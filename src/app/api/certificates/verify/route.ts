import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VerifyRequest {
  certificate_code: string;
  verification_code?: string;
}

interface Certificate {
  id: string;
  certificate_code: string;
  student_name: string;
  student_email?: string;
  course_type: string;
  level: string;
  completion_date: string;
  issue_date: string;
  expiration_date?: string;
  grade?: string;
  hours_completed?: number;
  instructor_name: string;
  status: 'active' | 'expired' | 'revoked';
  verification_code: string;
  created_at: string;
  updated_at: string;
}

// Rate limiting helper (simple in-memory store - use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body: VerifyRequest = await request.json();
    
    if (!body.certificate_code) {
      return NextResponse.json(
        { success: false, error: 'Certificate code is required' },
        { status: 400 }
      );
    }

    // Clean and normalize the certificate code
    const certificateCode = body.certificate_code.trim().toUpperCase();
    
    // Query the database
    const { data: certificate, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('certificate_code', certificateCode)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // If verification code is provided, check it
    if (body.verification_code && 
        body.verification_code.trim() !== certificate.verification_code) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if certificate is expired (if it has an expiration date)
    if (certificate.expiration_date) {
      const expirationDate = new Date(certificate.expiration_date);
      const currentDate = new Date();
      
      if (currentDate > expirationDate && certificate.status === 'active') {
        // Update status to expired
        await supabase
          .from('certifications')
          .update({ status: 'expired' })
          .eq('id', certificate.id);
        
        certificate.status = 'expired';
      }
    }

    // Remove sensitive information before sending response
    const safeCertificate: Omit<Certificate, 'student_email' | 'verification_code'> = {
      id: certificate.id,
      certificate_code: certificate.certificate_code,
      student_name: certificate.student_name,
      course_type: certificate.course_type,
      level: certificate.level,
      completion_date: certificate.completion_date,
      issue_date: certificate.issue_date,
      expiration_date: certificate.expiration_date,
      grade: certificate.grade,
      hours_completed: certificate.hours_completed,
      instructor_name: certificate.instructor_name,
      status: certificate.status,
      created_at: certificate.created_at,
      updated_at: certificate.updated_at
    };

    return NextResponse.json({
      success: true,
      certificate: safeCertificate
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for simple code verification (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const certificateCode = searchParams.get('code');

  if (!certificateCode) {
    return NextResponse.json(
      { success: false, error: 'Certificate code is required' },
      { status: 400 }
    );
  }

  // Create a new request with the certificate code in the body
  const mockBody = { certificate_code: certificateCode };
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify(mockBody),
    headers: { 'content-type': 'application/json' }
  });

  return POST(mockRequest);
}