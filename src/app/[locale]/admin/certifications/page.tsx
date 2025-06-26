'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CertificateIcon, ShieldCheckIcon, LockIcon, CheckCircleIcon, XIcon } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';

interface CreateCertificateForm {
  student_name: string;
  student_email: string;
  course_type: string;
  level: string;
  completion_date: string;
  grade: string;
  hours_completed: number;
  expiration_date?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SuccessResult {
  certificate_code: string;
  student_name: string;
  course_type: string;
  level: string;
  verificationUrl: string;
  studentEmail?: string;
}

export default function AdminCertificationsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [formData, setFormData] = useState<CreateCertificateForm>({
    student_name: '',
    student_email: '',
    course_type: 'Essential English Foundations',
    level: 'A1',
    completion_date: new Date().toISOString().split('T')[0],
    grade: 'Pass',
    hours_completed: 90
  });
  const [successResult, setSuccessResult] = useState<SuccessResult | null>(null);

  // Check if user is already authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verify the token is still valid
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/certificates/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        localStorage.removeItem('admin_token');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ ...authState, isLoading: true, error: null });

    try {
      const response = await fetch('/api/certificates/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        setCredentials({ username: '', password: '' });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: result.error || 'Invalid credentials'
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Network error. Please try again.'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const courseTypes = [
    { value: 'Essential English Foundations', level: 'A1', hours: 90 },
    { value: 'Practical English Communication', level: 'A2', hours: 90 },
    { value: 'Independent English Mastery', level: 'B1', hours: 150 },
    { value: 'Advanced English Fluency', level: 'B2', hours: 150 },
    { value: 'Expert English Proficiency', level: 'C1', hours: 200 },
    { value: 'Native-Level English Mastery', level: 'C2', hours: 300 },
    { value: 'Professional Business Communication', level: 'PROF', hours: 60 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill level and hours when course type changes
      if (name === 'course_type') {
        const courseInfo = courseTypes.find(c => c.value === value);
        if (courseInfo) {
          newData.level = courseInfo.level;
          newData.hours_completed = courseInfo.hours;
        }
      }
      
      return newData;
    });
  };

  // Confetti animation
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Send certificate email using EmailJS
  const sendCertificateEmail = async (certificate: any) => {
    if (!certificate.student_email) return;

    try {
      const templateParams = {
        to_name: certificate.student_name,
        to_email: certificate.student_email,
        certificate_code: certificate.certificate_code,
        course_type: certificate.course_type,
        level: certificate.level,
        completion_date: new Date(certificate.completion_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        verification_url: `${window.location.origin}/certifications/verify?code=${certificate.certificate_code}`,
        from_name: 'Kirby McDonald',
        grade: certificate.grade || 'Pass',
        hours_completed: certificate.hours_completed || 'N/A',
        message: `Congratulations ${certificate.student_name}!

Your ${certificate.course_type} (Level ${certificate.level}) certificate has been issued.

Certificate Details:
- Certificate Code: ${certificate.certificate_code}
- Course: ${certificate.course_type}
- Level: ${certificate.level}
- Grade: ${certificate.grade || 'Pass'}
- Hours Completed: ${certificate.hours_completed || 'N/A'}

You can verify your certificate at any time using this link: ${window.location.origin}/certifications/verify?code=${certificate.certificate_code}

This certificate demonstrates your achievement in professional English communication and is recognized internationally. You can share this verification link with employers, universities, or other institutions that require proof of your English proficiency.

Best regards,
Kirby McDonald
Professional English Programs`
      };

      // Use EmailJS to send the email
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, // You might want to create a specific template for certificates
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('Certificate email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send certificate email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/certificates/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Create success result
        const successData: SuccessResult = {
          certificate_code: result.certificate.certificate_code,
          student_name: result.certificate.student_name,
          course_type: result.certificate.course_type,
          level: result.certificate.level,
          verificationUrl: `${window.location.origin}/certifications/verify?code=${result.certificate.certificate_code}`,
          studentEmail: formData.student_email
        };

        setSuccessResult(successData);
        
        // Trigger confetti
        triggerConfetti();
        
        // Send email if student email is provided
        if (formData.student_email) {
          await sendCertificateEmail(result.certificate);
        }
        
        // Reset form
        setFormData({
          student_name: '',
          student_email: '',
          course_type: 'Essential English Foundations',
          level: 'A1',
          completion_date: new Date().toISOString().split('T')[0],
          grade: 'Pass',
          hours_completed: 90
        });
      } else {
        if (result.error === 'Unauthorized') {
          handleLogout();
        } else {
          alert(result.error || 'Failed to create certificate');
        }
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Certificate creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login form if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="authority-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <LockIcon size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text-authority mb-2">
                Admin Access Required
              </h1>
              <p className="text-gray-600">
                Please authenticate to access the certificate administration panel
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={authState.isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={authState.isLoading}
                />
              </div>

              {authState.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {authState.error}
                </div>
              )}

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full btn-authority btn-primary-authority justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authState.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon size={20} className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                This is a secure administrative area for authorized personnel only.
                <br />
                Unauthorized access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Modal Component
  const SuccessModal = () => {
    if (!successResult) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="authority-card max-w-2xl w-full p-8 relative animate-fade-in-up">
          <button
            onClick={() => setSuccessResult(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon size={24} />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon size={48} className="text-green-600" />
            </div>

            <h2 className="text-3xl font-bold gradient-text-authority mb-4">
              Certificate Created Successfully! 🎉
            </h2>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Student:</span>
                  <span className="text-gray-900">{successResult.student_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Course:</span>
                  <span className="text-gray-900">{successResult.course_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Level:</span>
                  <span className="text-gray-900">{successResult.level}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Certificate Code:</span>
                    <span className="font-mono text-lg font-bold text-primary">{successResult.certificate_code}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successResult.certificate_code);
                  alert('Certificate code copied to clipboard!');
                }}
                className="btn-authority btn-primary-authority w-full"
              >
                📋 Copy Certificate Code
              </button>

              <button
                onClick={() => {
                  window.open(successResult.verificationUrl, '_blank');
                }}
                className="btn-authority btn-secondary-authority w-full"
              >
                🔗 View Certificate
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(successResult.verificationUrl);
                  alert('Verification URL copied to clipboard!');
                }}
                className="btn-authority btn-secondary-authority w-full"
              >
                📎 Copy Verification Link
              </button>
            </div>

            {successResult.studentEmail && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📧 Certificate details have been sent to <strong>{successResult.studentEmail}</strong>
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setSuccessResult(null)}
                className="text-primary hover:text-primary-dark transition-colors font-medium"
              >
                Create Another Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show admin dashboard if authenticated
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Success Modal */}
      <SuccessModal />
      
      <div className="container-authority section-padding-authority">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <h1 className="text-section-title-authority gradient-text-authority">
                Certificate Administration
              </h1>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-1 border border-gray-300 rounded hover:border-red-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Manage and issue professional English certificates
            </p>
          </div>

          {/* Create Certificate Form */}
          <div className="authority-card p-8 lg:p-12">
            <div className="flex items-center mb-8">
              <CertificateIcon size={32} className="text-primary mr-3" />
              <h2 className="text-2xl font-bold gradient-text-authority">Issue New Certificate</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Email
                  </label>
                  <input
                    type="email"
                    name="student_email"
                    value={formData.student_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Type *
                  </label>
                  <select
                    name="course_type"
                    value={formData.course_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    {courseTypes.map(course => (
                      <option key={course.value} value={course.value}>
                        {course.value} ({course.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level *
                  </label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Pass">Pass</option>
                    <option value="Merit">Merit</option>
                    <option value="Distinction">Distinction</option>
                    <option value="85%">85%</option>
                    <option value="90%">90%</option>
                    <option value="95%">95%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hours Completed
                  </label>
                  <input
                    type="number"
                    name="hours_completed"
                    value={formData.hours_completed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiration Date (optional)
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for certificates that don't expire
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-authority btn-primary-authority text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
                      </svg>
                      Creating Certificate...
                    </>
                  ) : (
                    <>
                      <PlusIcon size={20} className="mr-2" />
                      Create Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}