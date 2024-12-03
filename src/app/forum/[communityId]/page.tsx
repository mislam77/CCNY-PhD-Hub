'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
}

interface CommunityPageProps {
  params: {
    communityId: string; // Access the dynamic route parameter from props
  };
}

const CommunityPage: React.FC<CommunityPageProps> = ({ params }) => {
  const { communityId } = params; // Access `communityId` from route params
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communityResponse = await fetch(`/api/communities/${communityId}`);
        const postsResponse = await fetch(`/api/posts?communityId=${communityId}`);

        if (communityResponse.ok && postsResponse.ok) {
          setCommunity(await communityResponse.json());
          setPosts(await postsResponse.json());
        } else {
          console.error('Error fetching community or posts:', communityResponse.statusText, postsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  const handleCreatePost = async (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  if (loading) {
    return <p>Loading community...</p>;
  }

  if (!community) {
    return <p>Community not found.</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="relative h-64 bg-cover bg-center mb-8" style={{ backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">{community.name}</h1>
          <p className="text-lg mt-2">{community.description}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <CreatePostDialog communityId={community.id} onCreatePost={handleCreatePost} />
      </div>
      <div className="space-y-4 mx-40">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4 relative">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-700 mt-2">{post.content}</p>
            <p className="text-sm text-gray-500 mt-4">Posted on: {new Date(post.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;