// components/EditStoryModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { supabase, moodOptions, type Story } from '@/lib/supabaseClient';

interface EditStoryModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedStory: Story) => void;
}

export default function EditStoryModal({ story, isOpen, onClose, onUpdate }: EditStoryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(moodOptions[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when story changes
  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setMood(story.mood);
      setError('');
    }
  }, [story]);

  const handleSubmit = async () => {
    if (!story) return;

    // Validation
    if (!title.trim()) {
      setError('Please enter a title for your story');
      return;
    }
    
    if (!content.trim()) {
      setError('Please write your story content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: updateError } = await supabase
        .from('stories')
        .update({
          title: title.trim(),
          content: content.trim(),
          mood: mood,
        })
        .eq('id', story.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message || 'Failed to update story');
      }

      if (!data) {
        throw new Error('Story was not updated properly. Please try again.');
      }

      // Success - update parent state
      onUpdate(data);
      onClose();
      
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setMood(story.mood);
    }
    setError('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Edit Your Story</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="edit-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2 border"
                placeholder="Give your story a title..."
                disabled={loading}
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label htmlFor="edit-mood" className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling?
              </label>
              <select
                id="edit-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2 border"
                disabled={loading}
              >
                {moodOptions.map((moodOption) => (
                  <option key={moodOption.value} value={moodOption.value}>
                    {moodOption.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Story
              </label>
              <textarea
                id="edit-content"
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2 border resize-none"
                placeholder="Share your thoughts, experiences, and reflections..."
                disabled={loading}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              {/* Date Display */}
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="inline h-3 w-3 mr-1" />
                Created: {new Date(story.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !content.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Story'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}