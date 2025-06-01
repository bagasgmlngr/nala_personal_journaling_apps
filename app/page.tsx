// app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Story, User } from '@/lib/supabaseClient';
import AuthPage from '@/components/AuthPage';
import TimelinePage from '@/components/TimelinePage';
import WriteStoryPage from '@/components/WriteStoryPage';
import LoadingPage from '@/components/LoadingPage';

export default function NalaApp() {
  const [currentPage, setCurrentPage] = useState('timeline');
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || ''
          };
          setUser(userData);
          await fetchStories();
        } else {
          setUser(null);
          setStories([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userData: User = {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at || ''
        };
        setUser(userData);
        await fetchStories();
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const addNewStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      alert('Error signing out: ' + error.message);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingPage />;
  }

  // Authentication required
  if (!user) {
    return <AuthPage />;
  }

  // Main app pages
  const pageProps = {
    user,
    stories,
    currentPage,
    setCurrentPage,
    handleSignOut,
    addNewStory,
    fetchStories
  };

  switch (currentPage) {
    case 'timeline':
      return <TimelinePage {...pageProps} />;
    case 'write':
      return <WriteStoryPage {...pageProps} />;
    default:
      return <TimelinePage {...pageProps} />;
  }
}