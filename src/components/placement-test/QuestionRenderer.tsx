'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

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

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(typeof currentAnswer === 'string' ? currentAnswer : null);
    setSelectedOptions(Array.isArray(currentAnswer) ? currentAnswer : []);
    setTextAnswer(typeof currentAnswer === 'string' ? currentAnswer : '');
    setGapAnswers({});
    setFocusedOptionIndex(-1);
  }, [question.id, currentAnswer]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;

    const options = question.options || [];
    const optionCount = question.question_type === 'true_false' ? 2 : options.length;

    // Number keys for MCQ (1-9)
    if (question.question_type === 'mcq' && e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (index < options.length) {
        handleOptionSelect(options[index].id);
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
      } else if (question.question_type === 'mcq' && options[focusedOptionIndex]) {
        handleOptionSelect(options[focusedOptionIndex].id);
      }
      return;
    }

    // Enter to submit (if answer selected)
    if (e.key === 'Enter' && !e.shiftKey) {
      if (question.question_type === 'gap_fill' || question.question_type === 'open_response') {
        // Don't intercept Enter in text inputs
        return;
      }
      if (selectedOption && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    }
  }, [disabled, question, focusedOptionIndex, selectedOption, onSubmit]);

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
    onAnswer(value); // For single gap, just send the value
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

  // Submit recording
  useEffect(() => {
    if (recordedBlob && question.question_type === 'open_response' && question.skill_type === 'speaking') {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAnswer(reader.result as string);
      };
      reader.readAsDataURL(recordedBlob);
    }
  }, [recordedBlob, question.question_type, question.skill_type, onAnswer]);

  // Render based on question type
  const renderQuestion = () => {
    switch (question.question_type) {
      case 'mcq':
        return renderMCQ();
      case 'true_false':
        return renderTrueFalse();
      case 'gap_fill':
        return renderGapFill();
      case 'matching':
        return renderMatching();
      case 'open_response':
        return question.skill_type === 'speaking' ? renderSpeaking() : renderOpenResponse();
      default:
        return renderMCQ();
    }
  };

  const renderMCQ = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
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
                <Circle size={24} className="text-gray-400 flex-shrink-0" />
              )}
              <span className={`flex-1 ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
                {locale === 'es' && option.text_es ? option.text_es : option.text}
              </span>
            </div>
          </button>
        );
      })}

      {/* Keyboard hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Keyboard size={14} />
        <span>Press 1-{question.options?.length} to select, Enter to continue</span>
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
                  ? option.value === 'true'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-md shadow-green-500/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 shadow-md shadow-red-500/20'
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
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Keyboard size={14} />
        <span>Press T for True, F for False, Enter to continue</span>
      </div>
    </div>
  );

  const renderGapFill = () => {
    // For simple gap fill, show as single input below the sentence
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
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Keyboard size={14} />
          <span>Type your answer, press Enter to continue</span>
        </div>
      </div>
    );
  };

  const renderMatching = () => {
    const options = question.options || [];
    const leftItems = options.filter((_, i) => i % 2 === 0);
    const rightItems = options.filter((_, i) => i % 2 === 1);

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Match these:</h4>
          {leftItems.map((item) => {
            const matchedRight = selectedOptions.find(s => s.startsWith(item.id + ':'))?.split(':')[1];
            return (
              <div key={item.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
                  <select
                    value={matchedRight || ''}
                    onChange={(e) => handleMatchingChange(item.id, e.target.value)}
                    disabled={disabled}
                    className="ml-2 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm
                               focus:outline-none focus:border-primary"
                  >
                    <option value="">Select...</option>
                    {rightItems.map((r) => (
                      <option key={r.id} value={r.id}>{r.id}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">With these:</h4>
          {rightItems.map((item) => (
            <div key={item.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="font-bold mr-2 text-primary">{item.id}.</span>
              <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
            </div>
          ))}
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
                   placeholder-gray-400 dark:placeholder-gray-500 transition-all"
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

      {/* Question Text - Maximum Contrast */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20
                      rounded-xl p-5 border-l-4 border-primary">
        <p className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed tracking-wide"
           style={{ textShadow: '0 0 1px rgba(0,0,0,0.1)' }}>
          {questionText}
        </p>
      </div>

      {/* Answer Area */}
      {renderQuestion()}
    </div>
  );
}
