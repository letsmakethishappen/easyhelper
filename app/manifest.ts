import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CarHelper.ai - AI Automotive Diagnostics',
    short_name: 'CarHelper',
    description: 'Fix your car problems without the mechanic. Get instant, accurate automotive diagnostics powered by AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['automotive', 'utilities', 'productivity'],
    orientation: 'portrait-primary',
  };
}