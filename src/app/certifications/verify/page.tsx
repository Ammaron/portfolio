import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ code?: string }>;

}

export default async function CertificationsVerifyRedirect({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;

  // Redirect to the English version with the code parameter if provided
  const codeParam = params.code ? `?code=${params.code}` : '';
  redirect(`/en/certifications/verify${codeParam}`);
}