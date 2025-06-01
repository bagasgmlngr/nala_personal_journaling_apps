// components/LoadingPage.tsx
import { BookOpen } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-indigo-600 animate-pulse" />
        <p className="mt-2 text-gray-600">Loading NALA...</p>
      </div>
    </div>
  );
}