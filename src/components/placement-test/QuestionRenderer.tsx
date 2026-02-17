'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  CheckCircle,
  Circle,
  Play,
  Pause,
  SpeakerHigh,
  Microphone,
  Stop,
  ArrowsClockwise,
  Keyboard
} from '@phosphor-icons/react';

interface QuestionOption {
  id: string;
  text: string;
  text_es?: string;
  audio_url?: string;
}

interface Question {
  id: string;
  question_code: string;
  skill_type: string;
  question_type: string;
  question_text: string;
  question_text_es?: string;
  passage_text?: string;
  passage_text_es?: string;
  audio_url?: string;
  image_url?: string;
  options?: QuestionOption[];
  max_points: number;
  time_limit_seconds?: number;
}

interface QuestionRendererProps {
  question: Question;
  locale: string;
  onAnswer: (answer: string | string[]) => void;
  currentAnswer?: string | string[];
  disabled?: boolean;
  onSubmit?: () => void; // For keyboard Enter to submit
}

export default function QuestionRenderer({
  question,
  locale,
  onAnswer,
  currentAnswer,
  disabled = false,
  onSubmit
}: QuestionRendererProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    typeof currentAnswer === 'string' ? currentAnswer : null
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );
  const [textAnswer, setTextAnswer] = useState(
    typeof currentAnswer === 'string' ? currentAnswer : ''
  );
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>({});
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [matchingActiveLeft, setMatchingActiveLeft] = useState<string | null>(null);

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const questionText = locale === 'es' && question.question_text_es
    ? question.question_text_es
    : question.question_text;

  const passageText = locale === 'es' && question.passage_text_es
    ? question.passage_text_es
    : question.passage_text;

  // Fisher-Yates shuffle helper
  const shuffle = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle options for MCQ questions (randomize order each time question loads)
  // The answer is tied to option.id, so shuffling doesn't affect correctness
  const shuffledOptions = useMemo(() => {
    if (!question.options || question.options.length === 0) return [];
    return shuffle(question.options);
  }, [question.id, question.options]);

  // Shuffle statements for T/F multi (answer is keyed by statement.id, so order doesn't matter)
  const shuffledTFMultiStatements = useMemo(() => {
    if (question.question_type !== 'true_false_multi' || !question.options || question.options.length === 0) return [];
    return shuffle(question.options);
  }, [question.id, question.question_type, question.options]);

  // Shuffle right-side items for matching (answer is keyed by id pairs, so order doesn't matter)
  const shuffledMatchingRight = useMemo(() => {
    if (question.question_type !== 'matching' || !question.options) return [];
    return shuffle(question.options.filter((_, i) => i % 2 === 1));
  }, [question.id, question.question_type, question.options]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(typeof currentAnswer === 'string' ? currentAnswer : null);
    setSelectedOptions(Array.isArray(currentAnswer) ? currentAnswer : []);
    setTextAnswer(typeof currentAnswer === 'string' ? currentAnswer : '');
    // For gap fill with pipe-separated answers, restore into gapAnswers instead of clearing
    if (question.question_type === 'gap_fill' && typeof currentAnswer === 'string' && currentAnswer.includes('|')) {
      const answerParts = currentAnswer.split('|');
      const restored: Record<string, string> = {};
      answerParts.forEach((val, i) => { restored[String(i)] = val; });
      setGapAnswers(restored);
    } else {
      setGapAnswers({});
    }
    // For form_filling, restore formAnswers from currentAnswer JSON instead of clearing
    if (question.question_type === 'form_filling' && typeof currentAnswer === 'string') {
      try {
        setFormAnswers(JSON.parse(currentAnswer));
      } catch {
        setFormAnswers({});
      }
    } else {
      setFormAnswers({});
    }
    setFocusedOptionIndex(-1);
    setMatchingActiveLeft(null);
  }, [question.id, currentAnswer]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;

    const optionCount = question.question_type === 'true_false' ? 2 : shuffledOptions.length;

    // Number keys for MCQ (1-9)
    if (question.question_type === 'mcq' && e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (index < shuffledOptions.length) {
        handleOptionSelect(shuffledOptions[index].id);
        setFocusedOptionIndex(index);
      }
      return;
    }

    // T/F keys for true_false
    if (question.question_type === 'true_false') {
      if (e.key.toLowerCase() === 't') {
        handleOptionSelect('true');
        setFocusedOptionIndex(0);
        return;
      }
      if (e.key.toLowerCase() === 'f') {
        handleOptionSelect('false');
        setFocusedOptionIndex(1);
        return;
      }
    }

    // Number keys to focus statement, T/F to toggle for true_false_multi
    if (question.question_type === 'true_false_multi' && shuffledTFMultiStatements.length > 0) {
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < shuffledTFMultiStatements.length) {
          setFocusedOptionIndex(index);
        }
        return;
      }
      if ((e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'f') && focusedOptionIndex >= 0 && focusedOptionIndex < shuffledTFMultiStatements.length) {
        const opt = shuffledTFMultiStatements[focusedOptionIndex];
        const val = e.key.toLowerCase() === 't' ? 'true' : 'false';
        handleTrueFalseMultiChange(opt.id, val);
        return;
      }
    }

    // Arrow keys for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocusedOptionIndex(prev => {
        const newIndex = prev <= 0 ? optionCount - 1 : prev - 1;
        return newIndex;
      });
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setFocusedOptionIndex(prev => {
        const newIndex = prev >= optionCount - 1 ? 0 : prev + 1;
        return newIndex;
      });
      return;
    }

    // Space to select focused option
    if (e.key === ' ' && focusedOptionIndex >= 0) {
      e.preventDefault();
      if (question.question_type === 'true_false') {
        handleOptionSelect(focusedOptionIndex === 0 ? 'true' : 'false');
      } else if (question.question_type === 'mcq' && shuffledOptions[focusedOptionIndex]) {
        handleOptionSelect(shuffledOptions[focusedOptionIndex].id);
      }
      return;
    }

    // Enter to submit (if answer selected)
    if (e.key === 'Enter' && !e.shiftKey) {
      if (question.question_type === 'gap_fill' || question.question_type === 'open_response') {
        // Don't intercept Enter in text inputs
        return;
      }
      if (question.question_type === 'matching' && selectedOptions.length > 0 && onSubmit) {
        e.preventDefault();
        onSubmit();
        return;
      }
      if (question.question_type === 'true_false_multi' && selectedOptions.length > 0 && onSubmit) {
        e.preventDefault();
        onSubmit();
        return;
      }
      if (selectedOption && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    }
  }, [disabled, question, shuffledOptions, shuffledTFMultiStatements, focusedOptionIndex, selectedOption, onSubmit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Audio controls
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [question.audio_url]);

  // Recording controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      console.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const reRecord = () => {
    setRecordedBlob(null);
    setRecordedUrl(null);
  };

  // Handle answer changes
  const handleOptionSelect = (optionId: string) => {
    if (disabled) return;
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  const handleTextChange = (value: string) => {
    if (disabled) return;
    setTextAnswer(value);
    onAnswer(value);
  };

  const handleGapChange = (gapId: string, value: string) => {
    if (disabled) return;
    const newAnswers = { ...gapAnswers, [gapId]: value };
    setGapAnswers(newAnswers);

    // For inline blanks (multiple gaps), send pipe-separated answer
    const blankPattern = /_{3,}|\[blank\]|\[___\]/gi;
    const totalGaps = (questionText.match(blankPattern) || []).length;
    if (totalGaps > 1) {
      const allValues = [];
      for (let j = 0; j < totalGaps; j++) {
        allValues.push(newAnswers[String(j)] || '');
      }
      onAnswer(allValues.join('|'));
    } else {
      onAnswer(value);
    }
  };

  const handleTrueFalseMultiChange = (statementId: string, value: string) => {
    if (disabled) return;
    const newSelections = [...selectedOptions.filter(s => !s.startsWith(statementId + ':'))];
    newSelections.push(`${statementId}:${value}`);
    setSelectedOptions(newSelections);
    onAnswer(newSelections);
  };

  const handleMatchingChange = (leftId: string, rightId: string) => {
    if (disabled) return;
    const newSelections = [...selectedOptions.filter(s => !s.startsWith(leftId + ':'))];
    if (rightId) {
      newSelections.push(`${leftId}:${rightId}`);
    }
    setSelectedOptions(newSelections);
    onAnswer(newSelections);
  };

  // Submit recording - covers all question types that use renderSpeaking():
  // open_response+speaking, interview, and picture_description+speaking
  useEffect(() => {
    if (recordedBlob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAnswer(reader.result as string);
      };
      reader.readAsDataURL(recordedBlob);
    }
  }, [recordedBlob, onAnswer]);

  // Render based on question type
  const renderQuestion = () => {
    switch (question.question_type) {
      case 'mcq':
        return renderMCQ();
      case 'true_false':
        return renderTrueFalse();
      case 'true_false_multi':
        return renderTrueFalseMulti();
      case 'gap_fill':
        return renderGapFill();
      case 'matching':
        return renderMatching();
      case 'open_response':
        return question.skill_type === 'speaking' ? renderSpeaking() : renderOpenResponse();
      case 'form_filling':
        return renderFormFilling();
      case 'short_message':
        return renderShortMessage();
      case 'picture_description':
        return renderPictureDescription();
      case 'interview':
        return renderInterview();
      default:
        return renderMCQ();
    }
  };

  const renderMCQ = () => (
    <div className="space-y-3">
      {shuffledOptions.map((option, index) => {
        const isSelected = selectedOption === option.id;
        const isFocused = focusedOptionIndex === index;

        return (
          <button
            key={option.id}
            onClick={() => {
              handleOptionSelect(option.id);
              setFocusedOptionIndex(index);
            }}
            disabled={disabled}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-md shadow-amber-500/20'
                : isFocused
                ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                {index + 1}
              </span>
              {isSelected ? (
                <CheckCircle size={24} weight="fill" className="text-amber-500 flex-shrink-0" />
              ) : (
                <Circle size={24} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
              )}
              <span className={`flex-1 ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
                {locale === 'es' && option.text_es ? option.text_es : option.text}
              </span>
            </div>
          </button>
        );
      })}

      {/* Keyboard hint */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Keyboard size={14} />
        <span>Press 1-{shuffledOptions.length} to select, Enter to continue</span>
      </div>
    </div>
  );

  const renderTrueFalse = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        {[
          { value: 'true', label: 'True', key: 'T' },
          { value: 'false', label: 'False', key: 'F' }
        ].map((option, index) => {
          const isSelected = selectedOption === option.value;
          const isFocused = focusedOptionIndex === index;

          return (
            <button
              key={option.value}
              onClick={() => {
                handleOptionSelect(option.value);
                setFocusedOptionIndex(index);
              }}
              disabled={disabled}
              className={`flex-1 p-5 text-center rounded-xl border-2 transition-all duration-200 font-semibold text-lg ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shadow-md shadow-amber-500/20'
                  : isFocused
                  ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/20 text-gray-700 dark:text-gray-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-amber-400 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col items-center gap-2">
                <span>{option.label}</span>
                <kbd className="px-2 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-600 rounded">
                  {option.key}
                </kbd>
              </div>
            </button>
          );
        })}
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Keyboard size={14} />
        <span>Press T for True, F for False, Enter to continue</span>
      </div>
    </div>
  );

  const renderTrueFalseMulti = () => {
    const statements = shuffledTFMultiStatements;

    return (
      <div className="space-y-3">
        {statements.map((statement, index) => {
          const currentValue = selectedOptions.find(s => s.startsWith(statement.id + ':'))?.split(':')[1];
          const isFocused = focusedOptionIndex === index;

          return (
            <div
              key={statement.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isFocused
                  ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  currentValue
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {index + 1}
                </span>
                <p className={`flex-1 text-gray-800 dark:text-gray-100 ${currentValue ? 'font-medium' : ''}`}>
                  {locale === 'es' && statement.text_es ? statement.text_es : statement.text}
                </p>
              </div>
              <div className="flex gap-3 ml-10">
                {[
                  { value: 'true', label: 'True' },
                  { value: 'false', label: 'False' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      handleTrueFalseMultiChange(statement.id, opt.value);
                      setFocusedOptionIndex(index);
                    }}
                    disabled={disabled}
                    className={`px-5 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 ${
                      currentValue === opt.value
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shadow-sm'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Keyboard hint */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Keyboard size={14} />
          <span>Press 1-{statements.length} to focus a statement, T for True, F for False, Enter to continue</span>
        </div>
      </div>
    );
  };

  const renderGapFill = () => {
    const blankPattern = /_{3,}|\[blank\]|\[___\]/gi;
    const parts = questionText.split(blankPattern);
    const hasInlineBlanks = parts.length > 1;

    // If the question text has inline blanks (___), render them inline
    if (hasInlineBlanks) {
      return (
        <div className="space-y-4">
          <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
            {parts.map((part, i) => (
              <span key={i}>
                {part}
                {i < parts.length - 1 && (
                  <input
                    type="text"
                    value={gapAnswers[String(i)] || ''}
                    onChange={(e) => {
                      handleGapChange(String(i), e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && onSubmit && Object.values(gapAnswers).some(v => v.trim() !== '')) {
                        e.preventDefault();
                        onSubmit();
                      }
                    }}
                    disabled={disabled}
                    autoFocus={i === 0}
                    className="inline-block w-40 mx-1 px-3 py-1.5 text-lg font-medium border-b-3 border-amber-400
                               bg-amber-50/50 dark:bg-amber-900/20 text-gray-900 dark:text-white
                               focus:outline-none focus:border-amber-500 focus:bg-amber-50 dark:focus:bg-amber-900/30
                               placeholder-gray-500 dark:placeholder-gray-400 transition-all rounded-md"
                    placeholder="..."
                  />
                )}
              </span>
            ))}
          </div>

          {/* Keyboard hint */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Keyboard size={14} />
            <span>Type your answer, press Enter to continue</span>
          </div>
        </div>
      );
    }

    // Fallback: simple input below the question
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={gapAnswers['0'] || textAnswer || ''}
          onChange={(e) => {
            handleGapChange('0', e.target.value);
            setTextAnswer(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit && (gapAnswers['0'] || textAnswer)) {
              e.preventDefault();
              onSubmit();
            }
          }}
          disabled={disabled}
          autoFocus
          className="w-full px-5 py-4 text-xl font-medium border-3 border-amber-400/50 rounded-xl
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30
                     placeholder-gray-400 dark:placeholder-gray-400 transition-all shadow-inner"
          placeholder="Type your answer here..."
        />

        {/* Keyboard hint */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Keyboard size={14} />
          <span>Type your answer, press Enter to continue</span>
        </div>
      </div>
    );
  };

  const renderMatching = () => {
    const options = question.options || [];
    const leftItems = options.filter((_, i) => i % 2 === 0);

    // Guard against malformed data (e.g., MCQ-format options on a matching question)
    if (leftItems.length === 0 || shuffledMatchingRight.length === 0) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-dashed border-red-300 dark:border-red-700 text-center space-y-2">
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Matching question not configured correctly
          </p>
          <p className="text-sm text-red-500/80 dark:text-red-400/60">
            This question requires matching pairs with left and right items.
          </p>
        </div>
      );
    }

    // Color palette for matched pairs — each pair gets a unique accent
    const pairColors = [
      { bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-500', ring: 'ring-blue-400/25', glow: 'shadow-blue-500/20' },
      { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-500', ring: 'ring-emerald-400/25', glow: 'shadow-emerald-500/20' },
      { bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300', badge: 'bg-violet-500', ring: 'ring-violet-400/25', glow: 'shadow-violet-500/20' },
      { bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-300', badge: 'bg-rose-500', ring: 'ring-rose-400/25', glow: 'shadow-rose-500/20' },
      { bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-500', ring: 'ring-cyan-400/25', glow: 'shadow-cyan-500/20' },
      { bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-500', ring: 'ring-amber-400/25', glow: 'shadow-amber-500/20' },
    ];

    const getMatchedRightId = (leftId: string): string | null => {
      const match = selectedOptions.find(s => s.startsWith(leftId + ':'));
      return match ? match.split(':')[1] : null;
    };

    const getMatchInfoForRight = (rightId: string): { leftId: string; leftIndex: number } | null => {
      for (const sel of selectedOptions) {
        const [lid, rid] = sel.split(':');
        if (rid === rightId) {
          const leftIndex = leftItems.findIndex(l => l.id === lid);
          return { leftId: lid, leftIndex };
        }
      }
      return null;
    };

    const handleLeftClick = (leftId: string) => {
      if (disabled) return;
      if (getMatchedRightId(leftId)) {
        // Unmatch
        handleMatchingChange(leftId, '');
        setMatchingActiveLeft(null);
      } else if (matchingActiveLeft === leftId) {
        setMatchingActiveLeft(null);
      } else {
        setMatchingActiveLeft(leftId);
      }
    };

    const handleRightClick = (rightId: string) => {
      if (disabled) return;
      const matchInfo = getMatchInfoForRight(rightId);
      if (matchInfo) {
        // Unmatch
        handleMatchingChange(matchInfo.leftId, '');
        return;
      }
      if (!matchingActiveLeft) return;
      handleMatchingChange(matchingActiveLeft, rightId);
      setMatchingActiveLeft(null);
    };

    const matchedCount = selectedOptions.length;
    const totalPairs = leftItems.length;
    const allMatched = matchedCount === totalPairs;

    // Instruction text based on state
    const instruction = allMatched
      ? 'All pairs matched! Press Enter to continue.'
      : matchingActiveLeft
      ? 'Now tap a matching item on the right'
      : 'Tap an item on the left to start matching';

    return (
      <div className="space-y-4">
        {/* Status bar */}
        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm font-medium transition-colors duration-300 ${
            allMatched
              ? 'text-emerald-600 dark:text-emerald-400'
              : matchingActiveLeft
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {instruction}
          </p>
          <span className={`text-xs font-bold tabular-nums px-3 py-1.5 rounded-full transition-all duration-300 ${
            allMatched
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {matchedCount} / {totalPairs}
          </span>
        </div>

        {/* Two-column card grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {/* ── Left column ── */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 pl-1">
              Items
            </h4>
            {leftItems.map((item, index) => {
              const matchedRightId = getMatchedRightId(item.id);
              const isActive = matchingActiveLeft === item.id;
              const isMatched = !!matchedRightId;
              const color = pairColors[index % pairColors.length];
              const letter = String.fromCharCode(65 + index);

              return (
                <button
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={disabled}
                  className={`matching-card group w-full text-left rounded-xl border-2 transition-all duration-300 relative overflow-hidden
                    ${isMatched
                      ? `${color.bg} ${color.border} ring-2 ${color.ring} shadow-md ${color.glow}`
                      : isActive
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30 -translate-y-0.5 matching-card-active'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-0.5'
                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {/* Matched badge */}
                  {isMatched && (
                    <span className={`matching-badge absolute -top-1.5 -right-1.5 w-6 h-6 ${color.badge} text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg z-10`}>
                      {letter}
                    </span>
                  )}
                  {/* Active indicator */}
                  {isActive && !isMatched && (
                    <span className="matching-badge absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-500 text-white text-sm rounded-full flex items-center justify-center shadow-lg z-10 animate-bounce">
                      ?
                    </span>
                  )}

                  <div className="p-3.5 flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors duration-300 ${
                      isMatched ? `${color.badge} text-white` : isActive ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {letter}
                    </span>
                    <span className={`flex-1 text-[13px] md:text-sm font-semibold leading-snug pt-0.5 transition-colors duration-300 ${
                      isMatched ? color.text : isActive ? 'text-amber-800 dark:text-amber-200' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {locale === 'es' && item.text_es ? item.text_es : item.text}
                    </span>
                  </div>
                  {item.audio_url && (
                    <div className="px-3.5 pb-3">
                      <audio src={item.audio_url} controls className="w-full h-8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 pl-1">
              Matches
            </h4>
            {shuffledMatchingRight.map((item) => {
              const matchInfo = getMatchInfoForRight(item.id);
              const isMatched = !!matchInfo;
              const color = isMatched ? pairColors[matchInfo!.leftIndex % pairColors.length] : null;
              const matchLetter = isMatched ? String.fromCharCode(65 + matchInfo!.leftIndex) : null;
              const isTarget = !isMatched && !!matchingActiveLeft;

              return (
                <button
                  key={item.id}
                  onClick={() => handleRightClick(item.id)}
                  disabled={disabled}
                  className={`matching-card group w-full text-left rounded-xl border-2 transition-all duration-300 relative overflow-hidden
                    ${isMatched && color
                      ? `${color.bg} ${color.border} ring-2 ${color.ring} shadow-md ${color.glow}`
                      : isTarget
                      ? 'border-dashed border-amber-400 dark:border-amber-500 bg-amber-50/40 dark:bg-amber-500/5 hover:border-solid hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:shadow-lg hover:-translate-y-0.5 matching-target'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                    } ${disabled ? 'cursor-not-allowed opacity-60' : isTarget || isMatched ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Matched badge */}
                  {isMatched && color && matchLetter && (
                    <span className={`matching-badge absolute -top-1.5 -left-1.5 w-6 h-6 ${color.badge} text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg z-10`}>
                      {matchLetter}
                    </span>
                  )}

                  <div className="p-3.5">
                    <span className={`text-[13px] md:text-sm font-semibold leading-snug transition-colors duration-300 ${
                      isMatched && color ? color.text : isTarget ? 'text-gray-700 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {locale === 'es' && item.text_es ? item.text_es : item.text}
                    </span>
                  </div>
                  {item.audio_url && (
                    <div className="px-3.5 pb-3">
                      <audio src={item.audio_url} controls className="w-full h-8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Keyboard size={14} />
          <span>Tap matched pairs to unmatch &middot; Enter to continue</span>
        </div>
      </div>
    );
  };

  const renderOpenResponse = () => (
    <div className="space-y-4">
      <textarea
        value={textAnswer}
        onChange={(e) => handleTextChange(e.target.value)}
        disabled={disabled}
        rows={6}
        className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none
                   placeholder-gray-500 dark:placeholder-gray-400 transition-all"
        placeholder="Write your answer here..."
      />
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{textAnswer.length} characters</span>
        <div className="flex items-center gap-2 text-xs">
          <Keyboard size={14} />
          <span>Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );

  const renderSpeaking = () => (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center">
        {!recordedUrl ? (
          <>
            {isRecording ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Microphone size={32} className="text-white" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-medium">Recording...</p>
                <button
                  onClick={stopRecording}
                  className="btn-authority bg-red-500 hover:bg-red-600 text-white px-6 py-3"
                >
                  <Stop size={20} className="mr-2" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <Microphone size={32} className="text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Click to start recording your response
                </p>
                <button
                  onClick={startRecording}
                  disabled={disabled}
                  className="btn-authority btn-primary-authority px-6 py-3"
                >
                  <Microphone size={20} className="mr-2" />
                  Start Recording
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium">Recording saved!</p>
            <audio src={recordedUrl} controls className="mx-auto" />
            <button
              onClick={reRecord}
              disabled={disabled}
              className="btn-authority btn-secondary-authority px-6 py-3"
            >
              <ArrowsClockwise size={20} className="mr-2" />
              Re-record
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Parse form fields from passage_text for form_filling questions
  // Expected format: "Form Title\nField1:\nField2:\nField3:"
  const parseFormFields = (text: string): { title: string; fields: string[] } => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0] || 'Form';
    const fields = lines.slice(1).map(line => {
      // Remove trailing colon if present
      return line.endsWith(':') ? line.slice(0, -1) : line;
    });
    return { title, fields };
  };

  const handleFormFieldChange = (fieldName: string, value: string) => {
    if (disabled) return;
    const newAnswers = { ...formAnswers, [fieldName]: value };
    setFormAnswers(newAnswers);
    onAnswer(JSON.stringify(newAnswers));
  };

  const renderFormFilling = () => {
    const { title, fields } = parseFormFields(passageText || '');

    return (
      <div className="space-y-4">
        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden shadow-lg">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4">
            {fields.map((field, index) => {
              const fieldKey = field.toLowerCase().replace(/\s+/g, '_');
              return (
                <div key={index} className="flex items-center gap-4">
                  <label className="w-32 text-right text-gray-700 dark:text-gray-300 font-medium flex-shrink-0">
                    {field}:
                  </label>
                  <input
                    type="text"
                    value={formAnswers[fieldKey] || ''}
                    onChange={(e) => handleFormFieldChange(fieldKey, e.target.value)}
                    disabled={disabled}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-500 rounded-lg
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                               placeholder-gray-400 transition-all"
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Keyboard size={14} />
          <span>Fill in all fields, press Tab to move between fields</span>
        </div>
      </div>
    );
  };

  // Parse bullet points from question text for short_message
  const parseBulletPoints = (text: string): string[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const bullets: string[] = [];
    for (const line of lines) {
      // Match lines starting with •, -, *, or numbers
      const bulletMatch = line.match(/^[•\-\*]\s*(.+)$/) || line.match(/^\d+[.)]\s*(.+)$/);
      if (bulletMatch) {
        bullets.push(bulletMatch[1]);
      }
    }
    return bullets;
  };

  // Determine message type from passage_text
  const getMessageType = (text: string): string => {
    const lower = (text || '').toLowerCase();
    if (lower.includes('email')) return 'Email';
    if (lower.includes('postcard')) return 'Postcard';
    if (lower.includes('letter')) return 'Letter';
    return 'Note';
  };

  const renderShortMessage = () => {
    const bulletPoints = parseBulletPoints(questionText);
    const messageType = getMessageType(passageText || '');

    return (
      <div className="space-y-4">
        {/* Instructions with bullet points */}
        {bulletPoints.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3 uppercase tracking-wide">
              Include in your message:
            </h4>
            <ul className="space-y-2">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-200">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Message Type Hint */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="text-lg">📧</span>
          <span>Write your {messageType.toLowerCase()}:</span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={textAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={disabled}
            rows={5}
            maxLength={500}
            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none
                       placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            placeholder={`Write your ${messageType.toLowerCase()} here...`}
          />
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Character count: {textAnswer.length}/500</span>
          <div className="flex items-center gap-2 text-xs">
            <Keyboard size={14} />
            <span>Write naturally, then submit</span>
          </div>
        </div>
      </div>
    );
  };

  // Parse image description from passage_text
  // Expected format: "[Image: description of what's in the image]"
  const parseImageDescription = (text: string): string => {
    const match = (text || '').match(/\[Image:\s*(.+?)\]/i);
    if (match) return match[1].trim();
    // If no [Image:] tag, return the whole text as description
    return text || 'A scene to describe';
  };

  const renderPictureDescription = () => {
    const imageDescription = parseImageDescription(passageText || '');
    const isWriting = question.skill_type === 'writing';

    return (
      <div className="space-y-5">
        {/* Image Display */}
        {question.image_url ? (
          <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
            <img
              src={question.image_url}
              alt={imageDescription || 'Question image'}
              className="w-full max-h-96 object-contain"
            />
          </div>
        ) : (
          /* Image Placeholder (fallback when no image_url) */
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800
                          rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600
                          p-8 text-center">
            <div className="max-w-md mx-auto">
              {/* Image Icon */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-xl
                              flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Description Box */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Picture shows:
                </p>
                <p className="text-gray-800 dark:text-gray-200 italic">
                  {imageDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response Area */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-lg">{isWriting ? '📝' : '🎤'}</span>
            <span>Your Description:</span>
          </div>

          {isWriting ? (
            <>
              <textarea
                value={textAnswer}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={disabled}
                rows={5}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none
                           placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                placeholder="Describe what you see in the picture..."
              />
              <div className="flex justify-end text-sm text-gray-500 dark:text-gray-400">
                {textAnswer.length} characters
              </div>
            </>
          ) : (
            /* Speaking - Audio Recorder */
            renderSpeaking()
          )}
        </div>
      </div>
    );
  };

  // Parse talking points from question_text for interview
  const parseTalkingPoints = (text: string): string[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const points: string[] = [];
    for (const line of lines) {
      // Match lines starting with -, *, •, or containing "your" (common in interview prompts)
      const bulletMatch = line.match(/^[•\-\*]\s*(.+)$/) || line.match(/^\d+[.)]\s*(.+)$/);
      if (bulletMatch) {
        points.push(bulletMatch[1]);
      }
    }
    return points;
  };

  const renderInterview = () => {
    const talkingPoints = parseTalkingPoints(questionText);

    return (
      <div className="space-y-5">
        {/* Interview Prompt Card */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30
                        rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">🎤</span>
            <h3 className="text-lg font-bold text-white">Interview Question</h3>
          </div>

          {/* Talking Points */}
          {talkingPoints.length > 0 && (
            <div className="p-5">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Suggested talking points:
              </p>
              <ul className="space-y-2">
                {talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-200">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recording Area */}
        <div className="space-y-3">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            Speak for 30-60 seconds
          </div>
          {renderSpeaking()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Passage (if any) */}
      {passageText && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wide">
            Read the passage:
          </h4>
          <p className="text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line text-base">
            {passageText}
          </p>
        </div>
      )}

      {/* Audio Player (if any) */}
      {question.audio_url && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SpeakerHigh size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Listen to the audio</span>
              </div>
              <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
          <audio ref={audioRef} src={question.audio_url} preload="auto" />
        </div>
      )}

      {/* Question Text - Maximum Contrast (hidden for inline gap_fill since it's rendered with inputs) */}
      {!(question.question_type === 'gap_fill' && /_{3,}|\[blank\]|\[___\]/gi.test(questionText)) && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20
                        rounded-xl p-5 border-l-4 border-primary">
          <p className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed tracking-wide"
             style={{ textShadow: '0 0 1px rgba(0,0,0,0.1)' }}>
            {questionText}
          </p>
        </div>
      )}

      {/* Answer Area */}
      {renderQuestion()}
    </div>
  );
}
