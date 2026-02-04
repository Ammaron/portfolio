import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Upload directory - stored in public so Next.js serves them
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'audio');

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

// POST - Upload audio file
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const authResult = verifyAdminToken(authHeader);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a', 'audio/x-m4a'];
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.webm', '.m4a'];
    const fileExt = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type. Allowed: MP3, WAV, OGG, WebM, M4A` },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 30);
    const extension = fileExt || '.mp3';
    const filename = `${timestamp}-${randomStr}-${safeOriginalName}${extension.startsWith('.') ? '' : extension}`;

    // Convert File to Buffer and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filepath = path.join(UPLOAD_DIR, filename);

    await writeFile(filepath, buffer);

    // Return the public URL path
    const publicUrl = `/uploads/audio/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during upload' },
      { status: 500 }
    );
  }
}

// DELETE - Remove audio file
export async function DELETE(request: NextRequest) {
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
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, safeFilename);

    // Check file exists and is within upload directory
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'Audio file deleted'
    });

  } catch (error) {
    console.error('Error deleting audio:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
