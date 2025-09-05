import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarHelper.ai - AI-Powered Automotive Diagnostics',
  description: 'Fix your car problems without the mechanic. Get instant, accurate automotive diagnostics powered by AI. Save money and learn about your vehicle.',
  keywords: 'car repair, automotive diagnostics, AI mechanic, car problems, vehicle maintenance',
  authors: [{ name: 'CarHelper.ai' }],
  creator: 'CarHelper.ai',
  publisher: 'CarHelper.ai',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  metadataBase: new URL('https://carhelper.ai'),
  openGraph: {
    title: 'CarHelper.ai - AI-Powered Automotive Diagnostics',
    description: 'Fix your car problems without the mechanic. Get instant, accurate automotive diagnostics powered by AI.',
    type: 'website',
    siteName: 'CarHelper.ai',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CarHelper.ai - AI-Powered Automotive Diagnostics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarHelper.ai - AI-Powered Automotive Diagnostics',
    description: 'Fix your car problems without the mechanic. Get instant, accurate automotive diagnostics powered by AI.',
    creator: '@carhelperai',
    images: ['/og-image.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}