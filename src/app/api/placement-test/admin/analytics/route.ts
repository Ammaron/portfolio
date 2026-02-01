import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAnalytics } from '@/lib/placement-test';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

interface JwtPayload {
  role: string;
  username?: string;
}

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

// GET - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analytics = await getAnalytics();

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
