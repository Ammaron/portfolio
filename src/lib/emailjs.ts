import emailjs from '@emailjs/browser';

// EmailJS configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (typeof window !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
};

// Email template parameters interface
export interface EmailParams {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  to_name?: string;
  to_email?: string;
}

// Send email function
export const sendEmail = async (params: EmailParams): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: params.from_name,
        from_email: params.from_email,
        subject: params.subject,
        message: params.message,
        to_name: 'Kirby McDonald',
        to_email: 'ammaron99@gmail.com',
        reply_to: params.from_email,
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully!',
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email. Please try again.',
    };
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting helper (client-side protection)
export const checkRateLimit = (): boolean => {
  const lastSent = localStorage.getItem('emailjs_last_sent');
  const now = Date.now();
  const cooldownPeriod = 60000; // 1 minute cooldown

  if (lastSent && now - parseInt(lastSent) < cooldownPeriod) {
    return false; // Rate limited
  }

  localStorage.setItem('emailjs_last_sent', now.toString());
  return true;
};