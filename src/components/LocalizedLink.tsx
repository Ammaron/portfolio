import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LocalizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLocale = (pathSegments[0] === 'es' || pathSegments[0] === 'en') ? pathSegments[0] : 'en';
  
  // Construct localized href
  const localizedHref = href === '/' ? `/${currentLocale}` : `/${currentLocale}${href}`;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}