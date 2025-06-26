import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const emailData = await request.json();

    // We'll use EmailJS from the frontend, so this endpoint will just validate and forward
    // For now, we'll return success to indicate the API is working
    // The actual email sending will happen on the frontend using EmailJS browser library

    console.log('Certificate email request received for:', emailData.student_name);

    // In a production environment, you might want to:
    // 1. Log the email attempt to database
    // 2. Add rate limiting
    // 3. Validate the certificate exists
    // 4. Use a server-side email service for better reliability

    return NextResponse.json({
      success: true,
      message: 'Email request processed successfully'
    });

  } catch (error) {
    console.error('Failed to process certificate email request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process email request' },
      { status: 500 }
    );
  }
}