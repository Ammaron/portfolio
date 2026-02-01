'use client';

import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle,
  Circle,
  Play,
  Pause,
  SpeakerHigh,
  Microphone,
  Stop,
  ArrowsClockwise
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
}

export default function QuestionRenderer({
  question,
  locale,
  onAnswer,
  currentAnswer,
  disabled = false
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
    onAnswer(JSON.stringify(newAnswers));
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
      // Convert to base64 for submission
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
      {question.options?.map((option) => (
        <button
          key={option.id}
          onClick={() => handleOptionSelect(option.id)}
          disabled={disabled}
          className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
            selectedOption === option.id
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
          } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3">
            {selectedOption === option.id ? (
              <CheckCircle size={24} weight="fill" className="text-primary flex-shrink-0" />
            ) : (
              <Circle size={24} className="text-gray-400 flex-shrink-0" />
            )}
            <span className="text-gray-800 dark:text-gray-200">
              {locale === 'es' && option.text_es ? option.text_es : option.text}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="flex gap-4">
      {['true', 'false'].map((value) => (
        <button
          key={value}
          onClick={() => handleOptionSelect(value)}
          disabled={disabled}
          className={`flex-1 p-4 text-center rounded-xl border-2 transition-all font-medium ${
            selectedOption === value
              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-300'
          } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          {value === 'true' ? 'True' : 'False'}
        </button>
      ))}
    </div>
  );

  const renderGapFill = () => {
    // Parse question text for gaps (marked with ___ or {gap1}, {gap2}, etc.)
    const parts = questionText.split(/(\{gap\d+\}|___)/g);

    return (
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {parts.map((part, index) => {
            if (part.match(/\{gap\d+\}/) || part === '___') {
              const gapId = part.match(/\d+/)?.[0] || String(index);
              return (
                <input
                  key={index}
                  type="text"
                  value={gapAnswers[gapId] || ''}
                  onChange={(e) => handleGapChange(gapId, e.target.value)}
                  disabled={disabled}
                  className="inline-block mx-1 px-3 py-1 w-32 border-b-2 border-primary bg-transparent text-center focus:outline-none focus:border-primary-dark"
                  placeholder="..."
                />
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </p>
      </div>
    );
  };

  const renderMatching = () => {
    // Split options into left and right columns
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
                  <span>{item.text}</span>
                  <select
                    value={matchedRight || ''}
                    onChange={(e) => handleMatchingChange(item.id, e.target.value)}
                    disabled={disabled}
                    className="ml-2 px-2 py-1 border rounded bg-white dark:bg-gray-600 text-sm"
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
              <span className="font-medium mr-2">{item.id}.</span>
              {item.text}
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
        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        placeholder="Write your answer here..."
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {textAnswer.length} characters
      </p>
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
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Read the passage:
          </h4>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {passageText}
          </p>
        </div>
      )}

      {/* Audio Player (if any) */}
      {question.audio_url && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SpeakerHigh size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Listen to the audio</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
          <audio ref={audioRef} src={question.audio_url} preload="auto" />
        </div>
      )}

      {/* Question Text */}
      <div className="text-lg font-medium text-gray-900 dark:text-white">
        {questionText}
      </div>

      {/* Answer Area */}
      {renderQuestion()}
    </div>
  );
}
