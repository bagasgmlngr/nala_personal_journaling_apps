// components/TimelinePage.tsx - Enhanced with Edit/Delete
import React, { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import type { User, Story } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';
import Navbar from './Navbar';
import StoryCard from './StoryCard';
import EditStoryModal from './EditStoryModal';

interface TimelinePageProps {
  user: User;
  stories: Story[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  handleSignOut: () => void;
  fetchStories: () => void;
}

export default function TimelinePage({ 
  user, 
  stories, 
  currentPage, 
  setCurrentPage, 
  handleSignOut,
  fetchStories 
}: TimelinePageProps) {
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
  };

  const handleUpdateStory = (updatedStory: Story) => {
    // Refresh stories to get latest data
    fetchStories();
    setEditingStory(null);
  };

  const handleDeleteStory = async (storyId: number) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(storyId);

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) {
        throw new Error(error.message || 'Failed to delete story');
      }

      // Refresh stories after successful deletion
      fetchStories();
      
    } catch (error: any) {
      alert('Error deleting story: ' + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        {/* Header Section - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Journal Timeline</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Reflect on your journey through your stories
          </p>
          {stories.length > 0 && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'} in your journal
            </p>
          )}
        </div>

        {stories.length === 0 ? (
          /* Empty State - Mobile Optimized */
          <div className="text-center py-8 sm:py-12 px-4">
            <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stories yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by writing your first story and begin your journaling journey.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setCurrentPage('write')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-indigo-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write your first story
              </button>
            </div>
          </div>
        ) : (
          /* Stories List - Enhanced with Edit/Delete */
          <div className="space-y-4 sm:space-y-6">
            {stories.map((story) => (
              <div key={story.id} className="relative">
                {/* Delete Loading Overlay */}
                {deleteLoading === story.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                    <div className="flex items-center space-x-2 text-red-600">
                      <Trash2 className="h-5 w-5 animate-pulse" />
                      <span className="text-sm">Deleting...</span>
                    </div>
                  </div>
                )}
                
                <StoryCard 
                  story={story}
                  currentUserId={user.id}
                  onEdit={handleEditStory}
                  onDelete={handleDeleteStory}
                />
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button
            onClick={() => setCurrentPage('write')}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            aria-label="Write new story"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Edit Story Modal */}
      <EditStoryModal
        story={editingStory}
        isOpen={!!editingStory}
        onClose={() => setEditingStory(null)}
        onUpdate={handleUpdateStory}
      />
    </div>
  );
}