import emailjs from '@emailjs/browser';

// EmailJS configuration (reuses existing env vars)
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

// Level descriptions for emails
const LEVEL_DESCRIPTIONS: Record<string, string> = {
  'A1': 'Beginner - Can understand and use familiar everyday expressions',
  'A2': 'Elementary - Can communicate in simple and routine tasks',
  'B1': 'Intermediate - Can deal with most situations while traveling',
  'B2': 'Upper Intermediate - Can interact fluently with native speakers',
  'C1': 'Advanced - Can express ideas fluently and spontaneously',
  'C2': 'Proficient - Can understand virtually everything heard or read'
};

interface PlacementResultsEmailParams {
  studentName: string;
  studentEmail: string;
  sessionCode: string;
  testMode: 'quick' | 'personalized';
  calculatedLevel: string;
  skillBreakdown?: Record<string, { level: string }>;
  adminFeedback?: string;
  resultsUrl: string;
  certificateCode?: string;
}

// Send placement test results email
export const sendPlacementResultsEmail = async (
  params: PlacementResultsEmailParams
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      console.warn('EmailJS not configured - skipping email');
      return { success: false, message: 'Email not configured' };
    }

    // Build skill breakdown text
    let skillBreakdownText = '';
    if (params.skillBreakdown) {
      skillBreakdownText = Object.entries(params.skillBreakdown)
        .map(([skill, data]) => `  • ${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${data.level}`)
        .join('\n');
    }

    // Build the email message
    const message = `
Hello ${params.studentName},

${params.testMode === 'quick'
  ? 'Thank you for completing the Quick English Placement Test!'
  : 'Great news! Your Personalized English Placement Test has been reviewed.'}

YOUR RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Level: ${params.calculatedLevel}
${LEVEL_DESCRIPTIONS[params.calculatedLevel] || ''}

${skillBreakdownText ? `Skill Breakdown:\n${skillBreakdownText}\n` : ''}
${params.adminFeedback ? `\nExpert Feedback:\n${params.adminFeedback}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${params.certificateCode ? `YOUR CERTIFICATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your certificate is ready! You can now download it from your results page.
Certificate Code: ${params.certificateCode}
Verify at: mrmcdonald.org/certifications/verify

` : ''}View your full results and download your certificate:
${params.resultsUrl}

Your session code for future reference: ${params.sessionCode}

${params.testMode === 'quick'
  ? 'Want a more detailed assessment? Take our Personalized Test for expert feedback on all 4 skills!'
  : 'Thank you for choosing our comprehensive assessment. We wish you success in your English learning journey!'}

Best regards,
Kirby McDonald
Professional English Programs
    `.trim();

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: 'English Placement Test',
        from_email: 'noreply@mrmcdonald.org',
        to_name: params.studentName,
        to_email: params.studentEmail,
        subject: `Your English Placement Test Results - Level ${params.calculatedLevel}`,
        message: message,
        reply_to: 'kirby@mrmcdonald.org',
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true, message: 'Results email sent successfully' };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send placement results email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

// Send review complete notification
export const sendReviewCompleteEmail = async (
  studentName: string,
  studentEmail: string,
  sessionCode: string,
  calculatedLevel: string,
  resultsUrl: string,
  certificateCode?: string
): Promise<{ success: boolean; message: string }> => {
  return sendPlacementResultsEmail({
    studentName,
    studentEmail,
    sessionCode,
    testMode: 'personalized',
    calculatedLevel,
    resultsUrl,
    certificateCode
  });
};

// Send test submission confirmation (for personalized mode)
export const sendSubmissionConfirmationEmail = async (
  studentName: string,
  studentEmail: string,
  sessionCode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      return { success: false, message: 'Email not configured' };
    }

    const message = `
Hello ${studentName},

Thank you for completing the Personalized English Placement Test!

Your submission has been received and is now being reviewed by our expert team. You will receive another email with your detailed results and personalized feedback within 24-48 hours.

Your Session Code: ${sessionCode}

Keep this code safe - you can use it to check your results at any time.

What happens next:
• Our expert reviewers will evaluate your writing and speaking responses
• You'll receive detailed feedback on all four language skills
• A certificate will be generated once the review is complete

If you have any questions, please don't hesitate to reach out.

Best regards,
Kirby McDonald
Professional English Programs
    `.trim();

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: 'English Placement Test',
        from_email: 'noreply@mrmcdonald.org',
        to_name: studentName,
        to_email: studentEmail,
        subject: 'Your Placement Test Submission Received',
        message: message,
        reply_to: 'kirby@mrmcdonald.org',
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return response.status === 200
      ? { success: true, message: 'Confirmation email sent' }
      : { success: false, message: 'Failed to send email' };
  } catch (error) {
    console.error('Failed to send submission confirmation:', error);
    return { success: false, message: 'Failed to send email' };
  }
};
