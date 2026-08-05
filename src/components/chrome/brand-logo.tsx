import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link href="/" className="brand-logo inline-flex items-center text-[0.93rem] font-semibold text-white transition-opacity hover:opacity-75">
      LUDAVIA
    </Link>
  );
}
