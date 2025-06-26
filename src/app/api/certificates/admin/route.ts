import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createCertificate } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

interface JwtPayload {
  role: string;
  username?: string;
  iat?: number;
  exp?: number;
}

// Helper function to verify JWT token
function verifyAdminToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No token provided' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    if (decoded.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' };
    }

    return { valid: true, user: decoded };
  } catch {
    return { valid: false, error: 'Invalid or expired token' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);
    
    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const certificateData = await request.json();
    
    // Validate required fields
    const requiredFields = ['student_name', 'course_type', 'level', 'completion_date'];
    for (const field of requiredFields) {
      if (!certificateData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Prepare certificate data for database
    const certificateToCreate = {
      student_name: certificateData.student_name,
      student_email: certificateData.student_email,
      course_type: certificateData.course_type,
      level: certificateData.level,
      completion_date: certificateData.completion_date,
      issue_date: certificateData.issue_date || new Date().toISOString().split('T')[0],
      expiration_date: certificateData.expiration_date,
      grade: certificateData.grade,
      hours_completed: certificateData.hours_completed,
      instructor_name: certificateData.instructor_name || 'Kirby McDonald',
      status: (certificateData.status || 'active') as 'active' | 'expired' | 'revoked'
    };

    try {
      // Create certificate in database
      const certificate = await createCertificate(certificateToCreate);

      // Log certificate creation
      console.log(`Certificate created by ${authResult.user?.username}: ${certificate.certificate_code}`);

      // Return success response (don't include verification_code for security)
      return NextResponse.json({
        success: true,
        certificate: {
          ...certificate,
          verification_code: undefined
        }
      });

    } catch (dbError: unknown) {
      console.error('Database error creating certificate:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Failed to create certificate in database';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Certificate creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}