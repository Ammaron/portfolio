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
    setFormAnswers({});
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
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
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
                       placeholder-gray-400 dark:placeholder-gray-500 transition-all"
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
                           placeholder-gray-400 dark:placeholder-gray-500 transition-all"
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
