'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";

interface Post {
  id: string;
  author_id: string;
  community_id: string;
  title: string;
  content: string;
  media_url: string;
  created_at: string;
  updated_at: string;
  author_username: string;
  author_profile_image_url: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  banner_photo_url: string;
}

interface CommunityPageProps {
  params: {
    communityId: string;
  };
}

const CommunityPage: React.FC<CommunityPageProps> = ({ params }) => {
  const { communityId } = params;
  const router = useRouter();
  const { user } = useUser();
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

  const handleCreatePost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleEditPost = async (postId: string, updatedContent: string) => {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: updatedContent }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );
    } else {
      console.error('Error updating post:', response.statusText);
    }
  };

  if (loading) {
    return <p>Loading community...</p>;
  }

  if (!community) {
    return <p>Community not found.</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="relative h-64 bg-cover bg-center mb-8" style={{ backgroundImage: `url(${community.banner_photo_url})` }}>
        <div className="absolute inset-0 bg-black opacity-35"></div>
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
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6 relative">
            {/* Post Header */}
            <div className="flex items-start">
              <img
                src={post.author_profile_image_url}
                alt="Author profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{post.author_username}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.content}</p>
            </div>

            {/* Media Content */}
            {post.media_url && (
              <div className="mt-4">
                {post.media_url.endsWith('.mp4') ? (
                  <video controls className="w-full rounded-lg">
                    <source src={post.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}

            {/* Post Footer */}
            <div className="mt-4 flex items-center justify-between text-gray-600 text-sm">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1">
                  <AiOutlineLike className="text-lg" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1">
                  <BiComment className="text-lg" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1">
                  <RiShareForwardLine className="text-lg" />
                  <span>Share</span>
                </button>
              </div>
              {user?.id === post.author_id && (
                <Button
                  onClick={() =>
                    handleEditPost(
                      post.id,
                      prompt("Edit your post:", post.content) || post.content
                    )
                  }
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;