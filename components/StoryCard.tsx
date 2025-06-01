// components/StoryCard.tsx
import { Calendar } from 'lucide-react';
import type { Story } from '@/lib/supabaseClient';
import { formatDate } from '@/lib/supabaseClient';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item from overflowing */}
          {/* Title and Mood - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-2 sm:pr-0">
              {story.title}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 self-start">
              {story.mood}
            </span>
          </div>
          
          {/* Content - Mobile Optimized */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
              {story.content}
            </p>
          </div>
          
          {/* Date - Mobile Optimized */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{formatDate(story.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}