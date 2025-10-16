import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { publishPost, unpublishPost } from '@/lib/blog';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Verify admin token
function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// POST /api/blog/admin/publish - Publish or unpublish a post
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: 'Post ID and action are required' },
        { status: 400 }
      );
    }

    let post;
    if (action === 'publish') {
      post = await publishPost(id);
    } else if (action === 'unpublish') {
      post = await unpublishPost(id);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Failed to update post status' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
