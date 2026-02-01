import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllSessions, getAnalytics } from '@/lib/placement-test';

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

// GET - Dashboard data (sessions + analytics)
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

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    if (view === 'analytics') {
      const analytics = await getAnalytics();
      return NextResponse.json({ success: true, analytics });
    }

    // Dashboard view - recent sessions + stats
    const status = searchParams.get('status') as 'in_progress' | 'completed' | 'pending_review' | 'reviewed' | 'expired' | undefined;
    const mode = searchParams.get('mode') as 'quick' | 'personalized' | 'advanced' | undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { sessions, total } = await getAllSessions(
      { status, test_mode: mode },
      limit,
      offset
    );

    const analytics = await getAnalytics();

    return NextResponse.json({
      success: true,
      sessions,
      total,
      analytics
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
