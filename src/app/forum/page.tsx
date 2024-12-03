'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreateCommunityDialog from '@/components/CreateCommunityDialog';

interface Community {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  created_at: string;
}

const ForumPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities', { cache: 'no-store' });
      if (response.ok) {
        const data: Community[] = await response.json();
        setCommunities(data);
      } else {
        console.error('Error fetching communities:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreateCommunity = (newCommunity: Community) => {
    setCommunities((prev) => [newCommunity, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="relative h-64 bg-cover bg-center mb-8" style={{ backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">Community Board</h1>
          <p className="text-lg mt-2">A place for CCNY PhD students to connect and share.</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
          <CreateCommunityDialog onCreateCommunity={handleCreateCommunity} />
      </div>
      <div className="space-y-4 mx-40">
        {communities.map((community) => (
          <div
            key={community.id}
            className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer"
            onClick={() => router.push(`/forum/${community.id}`)}
          >
            <h2 className="text-xl font-bold">{community.name}</h2>
            <p className="text-gray-700">{community.description}</p>
            <div className="flex items-center mt-4 space-x-2">
              {community.hashtags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;