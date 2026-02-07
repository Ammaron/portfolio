import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Certificate types
export interface Certificate {
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
  placement_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CertificateTemplate {
  id: string;
  template_name: string;
  course_type: string;
  level?: string;
  description?: string;
  requirements?: string;
  validity_period_months?: number;
  created_at: string;
}

// Professional certificate code generation
export function generateCertificateCode(courseType: string, level: string, year: number): string {
  // More sophisticated algorithm that looks professional
  const institutionCode = 'KMI'; // Kirby McDonald Institute
  
  // Generate a hash-like sequence based on course type and level
  const courseHash = generateCourseHash(courseType, level);
  
  // Year in 2-digit format
  const yearCode = year.toString().slice(-2);
  
  // Generate a random alphanumeric sequence (uppercase letters and numbers)
  const randomSequence = generateRandomSequence(4);
  
  // Format: KMI-4A7B-25-X9K2 (Institution-CourseHash-Year-Random)
  return `${institutionCode}-${courseHash}-${yearCode}-${randomSequence}`;
}

function generateCourseHash(courseType: string, level: string): string {
  // Map course types to professional codes
  const courseMap: Record<string, string> = {
    'Essential English Foundations': '1A',
    'Practical English Communication': '2B',
    'Independent English Mastery': '3C',
    'Advanced English Fluency': '4D',
    'Expert English Proficiency': '5E',
    'Native-Level English Mastery': '6F',
    'Professional Business Communication': 'BC',
    'English Placement Test - Comprehensive': 'PT'
  };
  
  // Level mapping for additional complexity
  const levelMap: Record<string, string> = {
    'A1': '1A',
    'A2': '2B',
    'B1': '3C',
    'B2': '4D',
    'C1': '5E',
    'C2': '6F',
    'PROF': 'PR'
  };
  
  const courseCode = courseMap[courseType] || '9Z';
  const levelCode = levelMap[level] || 'ZZ';
  
  // Combine and add some randomization
  const baseHash = courseCode + levelCode;
  const randomSuffix = Math.floor(Math.random() * 10);
  
  return baseHash.slice(0, 3) + randomSuffix;
}

function generateRandomSequence(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Ensure we have at least one letter and one number for authenticity
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  // Add at least one letter and one number
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  // Fill the rest randomly
  for (let i = 2; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the result to avoid predictable patterns
  return result.split('').sort(() => Math.random() - 0.5).join('');
}

export function generateVerificationCode(): string {
  // 6-digit alphanumeric code for additional security
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export async function createCertificate(certificateData: Omit<Certificate, 'id' | 'certificate_code' | 'verification_code' | 'created_at' | 'updated_at'>) {
  let certificate_code: string;
  let attempts = 0;
  const maxAttempts = 5;
  
  // Ensure unique certificate code
  do {
    certificate_code = generateCertificateCode(
      certificateData.course_type,
      certificateData.level,
      new Date().getFullYear()
    );
    
    // Check if code already exists
    const { data: existing } = await supabaseAdmin
      .from('certifications')
      .select('certificate_code')
      .eq('certificate_code', certificate_code)
      .maybeSingle();
    
    if (!existing) break;
    
    attempts++;
  } while (attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique certificate code after multiple attempts');
  }
  
  const verification_code = generateVerificationCode();

  const { data, error } = await supabaseAdmin
    .from('certifications')
    .insert({
      ...certificateData,
      certificate_code,
      verification_code
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create certificate: ${error.message}`);
  }

  return data;
}

export async function verifyCertificate(certificateCode: string, verificationCode?: string) {
  const { data: certificate, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('certificate_code', certificateCode.toUpperCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  if (!certificate) {
    return { success: false, error: 'Certificate not found' };
  }

  if (verificationCode && verificationCode !== certificate.verification_code) {
    return { success: false, error: 'Invalid verification code' };
  }

  // Check expiration
  if (certificate.expiration_date) {
    const expirationDate = new Date(certificate.expiration_date);
    const currentDate = new Date();
    
    if (currentDate > expirationDate && certificate.status === 'active') {
      // Update status to expired
      await supabaseAdmin
        .from('certifications')
        .update({ status: 'expired' })
        .eq('id', certificate.id);
      
      certificate.status = 'expired';
    }
  }

  return { success: true, certificate };
}