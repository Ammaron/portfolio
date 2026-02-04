import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, searchPosts, getPostsByCategory, getPostsByTag } from '@/lib/blog';

// GET /api/blog - Fetch published blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let posts;

    if (search) {
      posts = await searchPosts(search);
    } else if (category) {
      posts = await getPostsByCategory(category);
    } else if (tag) {
      posts = await getPostsByTag(tag);
    } else {
      posts = await getPublishedPosts();
    }

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error in blog API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
