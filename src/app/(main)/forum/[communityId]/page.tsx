'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
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
  like_count: number;
}

interface Comment {
  id: string;
  author_id: string;
  post_id: string;
  community_id: string;
  content: string;
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
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

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

  const fetchLikes = async () => {
    const response = await fetch(`/api/likes`);
    if (response.ok) {
      const likedPosts = await response.json();
      const likesMap = likedPosts.reduce(
        (acc: Record<string, boolean>, like: { post_id: string }) => {
          acc[like.post_id] = true;
          return acc;
        },
        {}
      );
      setLikes(likesMap);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const handleLikeToggle = async (postId: string) => {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });

    if (response.ok) {
      const { liked } = await response.json();
      setLikes((prev) => ({ ...prev, [postId]: liked }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, like_count: liked ? post.like_count + 1 : post.like_count - 1 }
            : post
        )
      );
    }
  };

  const handleFetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const postComments = await response.json();
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      } else {
        console.error("Error fetching comments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInput[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content, communityId }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));
        setCommentInput((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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
      {/* Community Banner */}
      <div
        className="relative h-64 bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${community.banner_photo_url})` }}
      >
        <div className="absolute inset-0 bg-black opacity-35"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">{community.name}</h1>
          <p className="text-lg mt-2">{community.description}</p>
        </div>
      </div>
  
      {/* Create Post Section */}
      <div className="flex justify-center space-x-4 mb-8">
        {user && <CreatePostDialog communityId={community.id} onCreatePost={handleCreatePost} />}
      </div>
  
      {/* Posts Section */}
      <div className="space-y-6 mx-40">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
            {/* Post Header */}
            <Link href={`/profile/${post.author_id}`} className="flex items-center">
              <img
                src={post.author_profile_image_url}
                alt="Author profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="text-lg font-semibold">{post.author_username}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </Link>
  
            {/* Post Content */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.content}</p>
            </div>
  
            {/* Media Content */}
            {post.media_url && (
              <div className="mt-4">
                {post.media_url.endsWith(".mp4") ? (
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
            <div className="mt-4 flex items-center justify-between text-gray-600">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeToggle(post.id)}
                  className="flex items-center space-x-1"
                >
                  {likes[post.id] ? <AiFillLike /> : <AiOutlineLike />}
                  <span>{post.like_count}</span>
                </button>
                <button
                  onClick={() => handleFetchComments(post.id)}
                  className="flex items-center space-x-1"
                >
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
  
            {/* Comments Section */}
            {comments[post.id] && (
              <div className="mt-6 border-t pt-4">
                {/* Comment Input */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={user?.imageUrl || "/default-profile.png"}
                    alt="User profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddComment(post.id)
                    }
                    className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Post
                  </button>
                </div>
  
                {/* Display Comments */}
                {comments[post.id].map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 mb-4">
                    <Link href={`/profile/${comment.author_id}`}>
                      <img
                        src={comment.author_profile_image_url || "/default-profile.png"}
                        alt="Comment author"
                        className="w-8 h-8 rounded-full"
                      />
                    </Link>
                    <div className="bg-gray-100 p-3 rounded-lg flex-1">
                      <p className="font-bold text-sm">{comment.author_username}</p>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );  
};

export default CommunityPage;