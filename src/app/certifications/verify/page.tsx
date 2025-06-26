import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: { code?: string };
}

export default function CertificationsVerifyRedirect({ searchParams }: PageProps) {
  // Redirect to the English version with the code parameter if provided
  const codeParam = searchParams.code ? `?code=${searchParams.code}` : '';
  redirect(`/en/certifications/verify${codeParam}`);
}