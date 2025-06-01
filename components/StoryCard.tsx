// components/StoryCard.tsx - Enhanced with Read More
import React, { useState } from 'react';
import { Calendar, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Story } from '@/lib/supabaseClient';
import { formatDate } from '@/lib/supabaseClient';

interface StoryCardProps {
  story: Story;
  currentUserId: string;
  onEdit?: (story: Story) => void;
  onDelete?: (storyId: number) => void;
}

export default function StoryCard({ story, currentUserId, onEdit, onDelete }: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to get excerpt (first 150 characters)
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  const isOwner = story.user_id === currentUserId;
  const showReadMore = story.content.length > 150;

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header: Title, Mood, and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2 sm:pr-0">
                {story.title}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 self-start">
                {story.mood}
              </span>
            </div>
            
            {/* Action Buttons (Only for owner) */}
            {isOwner && (
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => onEdit?.(story)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="Edit story"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete?.(story.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete story"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Content with Read More/Less */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
              {isExpanded ? story.content : getExcerpt(story.content)}
            </p>
            
            {/* Read More/Less Button */}
            {showReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Read Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Read More
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Date */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{formatDate(story.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}