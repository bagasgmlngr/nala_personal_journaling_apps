// components/WriteStoryPage.tsx
import React, { useState } from 'react';
import { Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase, moodOptions, type User, type Story } from '@/lib/supabaseClient';
import Navbar from './Navbar';

interface WriteStoryPageProps {
  user: User;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  handleSignOut: () => void;
  addNewStory: (story: Story) => void;
}

export default function WriteStoryPage({ 
  user, 
  currentPage, 
  setCurrentPage, 
  handleSignOut,
  addNewStory
}: WriteStoryPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(moodOptions[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
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
      // Double-check authentication
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !currentUser) {
        throw new Error('Please sign in again to save your story');
      }

      // Insert to database with explicit user_id
      const { data, error: insertError } = await supabase
        .from('stories')
        .insert([{
          title: title.trim(),
          content: content.trim(),
          mood: mood,
          user_id: currentUser.id
        }])
        .select()
        .single();

      if (insertError) {
        // Handle specific error types
        if (insertError.code === '42501') {
          throw new Error('Permission denied. Please contact support.');
        } else if (insertError.code === 'PGRST116') {
          throw new Error('Database security error. Please try signing out and back in.');
        } else {
          throw new Error(insertError.message || 'Failed to save story');
        }
      }

      if (!data) {
        throw new Error('Story was not saved properly. Please try again.');
      }

      // Success - add new story to state and navigate
      addNewStory(data);
      
      // Reset form
      setTitle('');
      setContent('');
      setMood(moodOptions[0].value);
      
      // Navigate to timeline
      setCurrentPage('timeline');
      
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setTitle('');
    setContent('');
    setMood(moodOptions[0].value);
    setError('');
    
    // Navigate to timeline
    setCurrentPage('timeline');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleSignOut={handleSignOut}
      />
      
      <div className="max-w-3xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        {/* Header Section - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Back Button */}
          <div className="flex items-center mb-4 md:hidden">
            <button
              onClick={handleCancel}
              className="mr-3 inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Write Your Story</h1>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900">Write Your Story</h1>
            <p className="mt-2 text-gray-600">Capture your thoughts and experiences</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200">
            {error && (
              <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-4">
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

            <div className="space-y-4 sm:space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="story-title"
                  name="story-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base px-3 py-2 border"
                  placeholder="Give your story a title..."
                  disabled={loading}
                />
              </div>

              {/* Mood Selection */}
              <div>
                <label htmlFor="story-mood" className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <select
                  id="story-mood"
                  name="story-mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base px-3 py-2 border"
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
                <label htmlFor="story-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Story
                </label>
                <textarea
                  id="story-content"
                  name="story-content"
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base px-3 py-2 border resize-none"
                  placeholder="What's on your mind today? Share your thoughts, experiences, and reflections..."
                  disabled={loading}
                />
              </div>

              {/* Footer Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 space-y-4 sm:space-y-0">
                {/* Date Display */}
                <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                  <Calendar className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {getCurrentDate()}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Story'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}