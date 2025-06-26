import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Simple credential check - in production, use a proper database with hashed passwords
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'your_secure_password_here'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      // Add a small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username, 
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login (in production, use proper logging)
    console.log(`Admin login successful: ${username} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}