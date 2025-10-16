import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllPosts, createPost, updatePost, deletePost } from '@/lib/blog';

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

// GET /api/blog/admin - Fetch all blog posts (including drafts)
export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const posts = await getAllPosts();

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/blog/admin - Create a new blog post
export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const post = await createPost(body);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Failed to create post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/admin - Update a blog post
export async function PUT(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await updatePost(id, updates);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Failed to update post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/admin - Delete a blog post
export async function DELETE(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
