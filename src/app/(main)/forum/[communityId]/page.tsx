'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Share2, 
  Heart, 
  MoreHorizontal, 
  Send, 
  Users,
  Clock,
  Edit,
  Bookmark,
  Filter,
  Image as ImageIcon,
  PlusCircle
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
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
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState('latest');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const commentInputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

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
    // If already in editing mode for this post, handle saving the edit
    if (editingPost === postId) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            postId, 
            content: editContent,
            title: posts.find(p => p.id === postId)?.title || ''
          }),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          setPosts((prev) =>
            prev.map((post) => (post.id === postId ? updatedPost : post))
          );
          setEditingPost(null);
          setEditContent('');
        } else {
          console.error('Error updating post:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating post:', error);
      }
    } else {
      // Enter editing mode
      const post = posts.find(p => p.id === postId);
      if (post) {
        setEditContent(post.content);
        setEditingPost(postId);
      }
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
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
      setExpandedComments((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      // Only fetch if we're expanding comments and haven't already loaded them
      if (!expandedComments[postId] && !comments[postId]) {
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (response.ok) {
          const postComments = await response.json();
          setComments((prev) => ({ ...prev, [postId]: postComments }));
        } else {
          console.error("Error fetching comments:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInput[postId]?.trim();
    if (!content) return;

    setSubmittingComment(true);
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
        
        // Ensure the comments section is expanded
        setExpandedComments((prev) => ({
          ...prev,
          [postId]: true,
        }));
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle comment submission with Enter key (Ctrl/Cmd + Enter)
  const handleCommentKeyDown = (e: React.KeyboardEvent, postId: string) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAddComment(postId);
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

  // Sort posts based on active filter
  const getSortedPosts = () => {
    const postsCopy = [...posts];
    
    switch (activeFilter) {
      case 'latest':
        return postsCopy.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'popular':
        return postsCopy.sort((a, b) => b.like_count - a.like_count);
      case 'oldest':
        return postsCopy.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      default:
        return postsCopy;
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
          <p className="text-gray-600 mb-6">The community you're looking for may have been removed or doesn't exist.</p>
          <Button onClick={() => router.push('/forum')}>
            Return to Communities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Community Banner */}
      <div className="relative bg-gradient-to-r from-primary/80 to-purple-700/80">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: `url(${community.banner_photo_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay'
          }}
        ></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{community.name}</h1>
            <p className="text-lg text-white/90 mb-4 max-w-3xl">{community.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {community.hashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {user && (
                <CreatePostDialog communityId={community.id} onCreatePost={handleCreatePost}>
                  <Button className="bg-white text-primary hover:bg-white/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </CreatePostDialog>
              )}
              
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Users className="mr-2 h-4 w-4" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters & Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
            <div className="flex justify-between items-center">
              <Tabs 
                defaultValue="latest" 
                value={activeFilter} 
                onValueChange={setActiveFilter}
                className="w-full"
              >
                <TabsList className="bg-gray-50">
                  <TabsTrigger value="latest" className="data-[state=active]:bg-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Latest
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="data-[state=active]:bg-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="oldest" className="data-[state=active]:bg-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Oldest
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Show all posts</DropdownMenuItem>
                  <DropdownMenuItem>Show my posts</DropdownMenuItem>
                  <DropdownMenuItem>Show media only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Posts Section */}
          {getSortedPosts().length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm text-center py-16">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No posts yet</h3>
              <p className="text-gray-500 mt-2 mb-6">Be the first to start a conversation in this community</p>
              {user && (
                <CreatePostDialog communityId={community.id} onCreatePost={handleCreatePost}>
                  <Button className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create First Post
                  </Button>
                </CreatePostDialog>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {getSortedPosts().map((post) => (
                <div key={post.id} className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-start p-4 pb-2">
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
                          <p className="text-sm text-gray-500">
                            {formatRelativeTime(post.created_at)}
                          </p>
                        </div>
                        
                        {user?.id === post.author_id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditPost(post.id, post.content)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Post
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
            
                  {/* Post Content */}
                  <div className="px-4 pt-1 pb-3">
                    {editingPost === post.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] border-primary focus:ring-primary"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleEditPost(post.id, editContent)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                      </>
                    )}
                  </div>
            
                  {/* Media Content */}
                  {post.media_url && !editingPost && (
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
                        onClick={() => handleLikeToggle(post.id)}
                        className={`flex items-center gap-2 text-sm font-medium ${
                          likes[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {likes[post.id] ? (
                          <Heart className="h-5 w-5 fill-current" />
                        ) : (
                          <Heart className="h-5 w-5" />
                        )}
                        <span>{post.like_count}</span>
                      </button>
                      
                      <button
                        onClick={() => handleFetchComments(post.id)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>
                          {comments[post.id] ? 
                            `${comments[post.id].length} ${comments[post.id].length === 1 ? 'comment' : 'comments'}` : 
                            'Comments'
                          }
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
            
                  {/* Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="border-t border-gray-100 px-4 py-4">
                      {/* Comment Input */}
                      {user && (
                        <div className="flex gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>{user.firstName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 relative">
                            <Textarea
                              ref={el => commentInputRefs.current[post.id] = el}
                              placeholder="Write a comment..."
                              value={commentInput[post.id] || ''}
                              onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => handleCommentKeyDown(e, post.id)}
                              className="min-h-[80px] pr-10 resize-none"
                            />
                            <Button 
                              size="icon"
                              className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-primary hover:bg-primary/90 text-white"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInput[post.id]?.trim() || submittingComment}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Comments List */}
                      <div className="space-y-4">
                        {comments[post.id] && comments[post.id].length > 0 ? (
                          comments[post.id].map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Link href={`/profile/${comment.author_id}`}>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.author_profile_image_url} />
                                  <AvatarFallback>{comment.author_username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </Link>
                              
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg px-4 py-3">
                                  <div className="flex justify-between items-start">
                                    <Link href={`/profile/${comment.author_id}`} className="font-medium hover:underline">
                                      {comment.author_username}
                                    </Link>
                                    <span className="text-xs text-gray-500">{formatRelativeTime(comment.created_at)}</span>
                                  </div>
                                  <p className="text-gray-700 mt-1 whitespace-pre-line">{comment.content}</p>
                                </div>
                                
                                <div className="flex gap-4 px-2 mt-1">
                                  <button className="text-xs text-gray-500 hover:text-gray-700">Like</button>
                                  <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Banner skeleton */}
    <div className="relative bg-gradient-to-r from-primary/50 to-purple-700/50 animate-pulse">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-4 bg-white/30" />
          <Skeleton className="h-6 w-full max-w-3xl mb-2 bg-white/20" />
          <Skeleton className="h-6 w-1/2 mb-6 bg-white/20" />
          
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-7 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-7 w-24 rounded-full bg-white/20" />
            <Skeleton className="h-7 w-16 rounded-full bg-white/20" />
          </div>
          
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-md bg-white/30" />
            <Skeleton className="h-10 w-32 rounded-md bg-white/30" />
          </div>
        </div>
      </div>
    </div>
    
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Filter skeleton */}
        <Skeleton className="h-14 w-full rounded-xl mb-6 bg-white" />
        
        {/* Post skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <div className="border-t border-gray-100 p-3">
              <div className="flex justify-between">
                <div className="flex gap-8">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CommunityPage;