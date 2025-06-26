'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheckIcon, WarningIcon, CalendarIcon, UserIcon, GraduationCap, ClockIcon } from '@phosphor-icons/react';

interface Certificate {
  id: string;
  certificate_code: string;
  student_name: string;
  course_type: string;
  level: string;
  completion_date: string;
  issue_date: string;
  expiration_date?: string;
  grade?: string;
  hours_completed?: number;
  instructor_name: string;
  status: 'active' | 'expired' | 'revoked';
}

interface VerificationResult {
  success: boolean;
  certificate?: Certificate;
  error?: string;
}

export default function CertificateVerificationPage() {
  const [searchCode, setSearchCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const handleVerificationWithCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificate_code: code.trim().toUpperCase(),
          verification_code: verificationCode.trim()
        }),
      });

      const data: VerificationResult = await response.json();
      setResult(data);

      // Add to search history if successful
      if (data.success && data.certificate) {
        const newHistory = [code.trim().toUpperCase(), ...searchHistory.filter(h => h !== code.trim().toUpperCase())].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('cert_search_history', JSON.stringify(newHistory));
      }
    } catch {
      setResult({
        success: false,
        error: 'Failed to verify certificate. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, searchHistory]);

  // Load search history from localStorage and check URL params
  useEffect(() => {
    const history = localStorage.getItem('cert_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Check for URL parameter
    const codeFromUrl = searchParams?.get('code');
    if (codeFromUrl) {
      setSearchCode(codeFromUrl);
      // Auto-verify if code is provided in URL
      setTimeout(() => {
        handleVerificationWithCode(codeFromUrl);
      }, 500);
    }
  }, [searchParams, handleVerificationWithCode]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchCode.trim()) return;
    
    await handleVerificationWithCode(searchCode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-yellow-600 bg-yellow-100';
      case 'revoked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <ShieldCheckIcon size={20} className="text-green-600" />;
      case 'expired': return <ClockIcon size={20} className="text-yellow-600" />;
      case 'revoked': return <WarningIcon size={20} className="text-red-600" />;
      default: return <WarningIcon size={20} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container-authority section-padding-authority">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-section-title-authority mb-6 gradient-text-authority">
              Certificate Verification
            </h1>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Verify the authenticity of certificates issued by our professional English programs
            </p>
          </div>

          {/* Search Form */}
          <div className="authority-card p-8 lg:p-12 mb-8">
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="certificate_code" className="block text-sm font-semibold text-gray-700 mb-2">
                    Certificate Code *
                  </label>
                  <input
                    type="text"
                    id="certificate_code"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="KMI-4D72-25-X9K2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the certificate code found on your official certificate
                  </p>
                </div>
                
                <div>
                  <label htmlFor="verification_code" className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verification_code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="A7B9C1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Additional security code if provided
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !searchCode.trim()}
                  className="btn-authority btn-primary-authority flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon size={20} className="mr-2" />
                      Verify Certificate
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSearchCode('');
                    setVerificationCode('');
                    setResult(null);
                  }}
                  className="btn-authority btn-secondary-authority justify-center"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((code, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchCode(code)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="authority-card p-8 lg:p-12">
              {result.success && result.certificate ? (
                <div>
                  {/* Success Header */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full">
                      <ShieldCheckIcon size={24} className="mr-2" />
                      <span className="font-semibold">Certificate Verified</span>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-8">
                    {/* Header Info */}
                    <div className="text-center pb-6 border-b border-gray-200">
                      <h2 className="text-3xl font-bold gradient-text-authority mb-2">
                        {result.certificate.course_type}
                      </h2>
                      <div className="flex items-center justify-center mb-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(result.certificate.status)}`}>
                          {getStatusIcon(result.certificate.status)}
                          <span className="ml-2 capitalize">{result.certificate.status}</span>
                        </span>
                      </div>
                      <p className="text-xl text-gray-600">
                        Level: <span className="font-semibold text-primary">{result.certificate.level}</span>
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <UserIcon size={24} className="text-primary mr-3 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Certificate Holder</h3>
                            <p className="text-gray-700">{result.certificate.student_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <CalendarIcon size={24} className="text-primary mr-3 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Completion Date</h3>
                            <p className="text-gray-700">{formatDate(result.certificate.completion_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <CalendarIcon size={24} className="text-primary mr-3 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Issue Date</h3>
                            <p className="text-gray-700">{formatDate(result.certificate.issue_date)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start">
                          <GraduationCap size={24} className="text-primary mr-3 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Instructor</h3>
                            <p className="text-gray-700">{result.certificate.instructor_name}</p>
                          </div>
                        </div>

                        {result.certificate.grade && (
                          <div className="flex items-start">
                            <ShieldCheckIcon size={24} className="text-primary mr-3 mt-1" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Grade</h3>
                              <p className="text-gray-700">{result.certificate.grade}</p>
                            </div>
                          </div>
                        )}

                        {result.certificate.hours_completed && (
                          <div className="flex items-start">
                            <ClockIcon size={24} className="text-primary mr-3 mt-1" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Hours Completed</h3>
                              <p className="text-gray-700">{result.certificate.hours_completed} hours</p>
                            </div>
                          </div>
                        )}

                        {result.certificate.expiration_date && (
                          <div className="flex items-start">
                            <CalendarIcon size={24} className="text-orange-500 mr-3 mt-1" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Expiration Date</h3>
                              <p className="text-gray-700">{formatDate(result.certificate.expiration_date)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Certificate Code */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl">
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">Certificate Code</h3>
                        <p className="text-2xl font-mono font-bold text-primary">
                          {result.certificate.certificate_code}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        This certificate has been verified as authentic and issued by Kirby McDonald Professional English Programs.
                        <br />
                        Verification completed on {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center px-6 py-3 bg-red-100 text-red-800 rounded-full">
                      <WarningIcon size={24} className="mr-2" />
                      <span className="font-semibold">Verification Failed</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {result.error || 'The certificate code you entered could not be verified. Please check the code and try again.'}
                  </p>
                  <div className="space-y-4 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-gray-900">Possible reasons:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        Incorrect certificate code
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        Certificate has been revoked
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        Certificate code not yet issued
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="authority-card p-8 mt-8">
            <h3 className="text-xl font-bold mb-6 text-center gradient-text-authority">
              Need Help?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Having trouble verifying?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Ensure you&apos;re entering the complete certificate code</li>
                  <li>• Check for any typos or extra characters</li>
                  <li>• Verification codes are case-sensitive</li>
                  <li>• Contact us if you continue having issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">About our certificates</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• All certificates are digitally secured</li>
                  <li>• CEFR-aligned international standards</li>
                  <li>• Recognized by employers worldwide</li>
                  <li>• Professional MBA-designed curriculum</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-6">
              <a 
                href="mailto:ammaron99@gmail.com" 
                className="btn-authority btn-secondary-authority"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}