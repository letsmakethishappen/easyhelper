import { LoadingSpinner } from '@/components/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading CarHelper.ai..." />
    </div>
  );
}