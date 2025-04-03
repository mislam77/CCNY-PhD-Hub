'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageSquare,
  Share2,
  Send,
  ArrowLeft,
  MoreHorizontal,
  Bookmark,
  Edit,
  MessageCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';

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
  content: string;
  created_at: string;
  author_username: string;
  author_profile_image_url: string;
}

interface Community {
  id: string;
  name: string;
}

interface PostPageProps {
  params: { 
    communityId: string;
    postId: string;
  };
}

const PostPage: React.FC<PostPageProps> = ({ params }) => {
  const { communityId, postId } = params;
  const { user } = useUser();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedByMe, setLikedByMe] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [community, setCommunity] = useState<Community | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
        setEditedContent(postData.content);
        
        // Fetch community info
        const communityResponse = await fetch(`/api/communities/${communityId}`);
        if (communityResponse.ok) {
          const communityData = await communityResponse.json();
          setCommunity(communityData);
        }
        
        // Check if the post is liked by the current user
        const likesResponse = await fetch(`/api/likes`);
        if (likesResponse.ok) {
          const likes = await likesResponse.json();
          setLikedByMe(likes.some((like: any) => like.post_id === postId));
        }
      } else {
        console.error('Error fetching post:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const response = await fetch(`/api/comments?postId=${postId}`);
    if (response.ok) {
      const commentsData = await response.json();
      setComments(commentsData);
    } else {
      console.error('Error fetching comments:', response.statusText);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: commentContent,
          communityId,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment]);
        setCommentContent('');
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      } else {
        console.error('Error adding comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const { liked } = await response.json();
        setLikedByMe(liked);
        if (post) {
          setPost({
            ...post,
            like_count: liked ? post.like_count + 1 : post.like_count - 1,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!post || !editedContent.trim()) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          title: post.title,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
        setEditMode(false);
      } else {
        console.error('Error updating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for may have been removed or doesn't exist.</p>
          <Button onClick={() => router.push(`/forum/${communityId}`)}>
            Return to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2"
              onClick={() => router.push(`/forum/${communityId}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-lg font-semibold">Post Details</h1>
              {community && (
                <p className="text-sm text-gray-500">
                  <Link href={`/forum/${communityId}`} className="hover:underline">
                    {community.name}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Post Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Post Header */}
            <div className="p-4 pb-2">
              <div className="flex items-start">
                <Link href={`/profile/${post.author_id}`}>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={post.author_profile_image_url} alt={post.author_username} />
                    <AvatarFallback>{post.author_username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/profile/${post.author_id}`} className="font-medium hover:underline">
                        {post.author_username}
                      </Link>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          {formatRelativeTime(post.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {user?.id === post.author_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditMode(!editMode)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {editMode ? 'Cancel Edit' : 'Edit Post'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="px-4 pt-2 pb-3">
              {editMode ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[150px] border-primary focus:ring-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleUpdatePost}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                </>
              )}
            </div>
            
            {/* Media Content */}
            {post.media_url && !editMode && (
              <div className="border-t border-gray-100">
                {post.media_url.endsWith(".mp4") ? (
                  <video controls className="w-full">
                    <source src={post.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                  />
                )}
              </div>
            )}
            
            {/* Post Actions */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {likedByMe ? (
                    <Heart className="h-5 w-5 fill-current" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                  <span>{post.like_count}</span>
                </button>
                
                <button
                  onClick={() => {
                    if (commentInputRef.current) {
                      commentInputRef.current.focus();
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>
                    {comments.length > 0
                      ? `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`
                      : 'Comment'}
                  </span>
                </button>
                
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Comments</h3>
            </div>
            
            {/* Comment Input */}
            {user && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 relative">
                    <Textarea
                      ref={commentInputRef}
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      onKeyDown={handleCommentKeyDown}
                      className="min-h-[100px] pr-10 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to submit</p>
                    <Button 
                      size="icon"
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white"
                      onClick={handleAddComment}
                      disabled={!commentContent.trim() || submitting}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comments List */}
            <div className="divide-y divide-gray-100">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <Link href={`/profile/${comment.author_id}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.author_profile_image_url} />
                          <AvatarFallback>{comment.author_username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <Link href={`/profile/${comment.author_id}`} className="font-medium hover:underline">
                            {comment.author_username}
                          </Link>
                          <span className="text-xs text-gray-500">{formatRelativeTime(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                        
                        <div className="flex gap-4 mt-2">
                          <button className="text-xs text-gray-500 hover:text-gray-700">Like</button>
                          <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No comments yet</h3>
                  <p className="text-gray-500">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
    
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Post skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />
            
            <Skeleton className="h-64 w-full mb-4" />
            
            <div className="flex justify-between pt-2">
              <div className="flex gap-8">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        {/* Comments section skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-24 w-full mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          
          {[1, 2].map(i => (
            <div key={i} className="p-4 border-b border-gray-100">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PostPage;