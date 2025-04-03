'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MessageSquare, Heart, Share2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  profile_image_url: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
}

interface Post {
  id: string;
  author_id: string;
  author_username: string;
  author_profile_image_url: string;
  title: string;
  content: string;
  media_url?: string;
  created_at: string;
  like_count?: number;
}

interface SearchResults {
  users: User[];
  communities: Community[];
  posts: Post[];
}

const SearchLoading = () => (
  <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg text-gray-600">Loading search results...</p>
  </div>
);

const EmptyState = ({ type }: { type: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
    <div className="bg-gray-200 p-4 rounded-full mb-4">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900">No {type} found</h3>
    <p className="mt-1 text-gray-500">Try searching with different keywords</p>
  </div>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const keywords = searchParams.get('keywords');
  const [results, setResults] = useState<SearchResults>({ users: [], communities: [], posts: [] });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (keywords) {
      setIsLoading(true);
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/search?keywords=${encodeURIComponent(keywords)}`);
          if (!response.ok) throw new Error("Failed to fetch search results");
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    }
  }, [keywords]);

  const totalResults = results.users.length + results.communities.length + results.posts.length;

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <span className="ml-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {totalResults} results
          </span>
        </div>
        <p className="text-gray-600 text-lg">Showing results for "<span className="font-medium">{keywords}</span>"</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 w-full md:w-1/2">
          <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
          <TabsTrigger value="users">Users ({results.users.length})</TabsTrigger>
          <TabsTrigger value="communities">Communities ({results.communities.length})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({results.posts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-10">
          {totalResults === 0 && <EmptyState type="results" />}
          
          {results.users.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Users</h2>
                {results.users.length > 3 && (
                  <button 
                    onClick={() => setActiveTab("users")}
                    className="text-primary font-medium flex items-center"
                  >
                    View all
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.slice(0, 3).map((user) => (
                  <Link key={user.id} href={`/profile/${user.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={user.profile_image_url} alt={user.username} />
                            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-lg">{user.username}</p>
                            <p className="text-sm text-gray-500">View profile</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.communities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Communities</h2>
                {results.communities.length > 2 && (
                  <button 
                    onClick={() => setActiveTab("communities")}
                    className="text-primary font-medium flex items-center"
                  >
                    View all
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.communities.slice(0, 2).map((community) => (
                  <Link key={community.id} href={`/forum/${community.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-primary mb-2">{community.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {community.hashtags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-blue-50">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.posts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Posts</h2>
                {results.posts.length > 2 && (
                  <button 
                    onClick={() => setActiveTab("posts")}
                    className="text-primary font-medium flex items-center"
                  >
                    View all
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {results.posts.slice(0, 2).map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Link href={`/profile/${post.author_id}`}>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author_profile_image_url} alt={post.author_username} />
                              <AvatarFallback>{post.author_username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div>
                            <Link href={`/profile/${post.author_id}`} className="font-medium text-lg hover:text-primary">
                              {post.author_username}
                            </Link>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              <time>{formatDate(post.created_at)}</time>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                        </div>
                        
                        {post.media_url && (
                          <div className="mt-4 rounded-md overflow-hidden">
                            {post.media_url.endsWith('.mp4') ? (
                              <video controls className="w-full h-64 object-cover rounded-md">
                                <source src={post.media_url} type="video/mp4" />
                              </video>
                            ) : (
                              <img
                                src={post.media_url}
                                alt="Post media"
                                className="w-full h-64 object-cover rounded-md"
                              />
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6 mt-4 pt-4 border-t text-gray-500">
                          <div className="flex items-center">
                            <Heart className="h-5 w-5 mr-1" />
                            <span>{post.like_count || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-1" />
                            <span>Comment</span>
                          </div>
                          <div className="flex items-center">
                            <Share2 className="h-5 w-5 mr-1" />
                            <span>Share</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          {results.users.length === 0 ? (
            <EmptyState type="users" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.users.map((user) => (
                <Link key={user.id} href={`/profile/${user.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.profile_image_url} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-lg">{user.username}</p>
                          <p className="text-sm text-gray-500">View profile</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="communities" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Communities</h2>
          {results.communities.length === 0 ? (
            <EmptyState type="communities" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.communities.map((community) => (
                <Link key={community.id} href={`/forum/${community.id}`}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{community.name}</h3>
                      <p className="text-gray-600 mb-4">{community.description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {community.hashtags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-blue-50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          {results.posts.length === 0 ? (
            <EmptyState type="posts" />
          ) : (
            <div className="space-y-4">
              {results.posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Link href={`/profile/${post.author_id}`}>
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author_profile_image_url} alt={post.author_username} />
                            <AvatarFallback>{post.author_username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div>
                          <Link href={`/profile/${post.author_id}`} className="font-medium text-lg hover:text-primary">
                            {post.author_username}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            <time>{formatDate(post.created_at)}</time>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                      </div>
                      
                      {post.media_url && (
                        <div className="mt-4 rounded-md overflow-hidden">
                          {post.media_url.endsWith('.mp4') ? (
                            <video controls className="w-full h-64 object-cover rounded-md">
                              <source src={post.media_url} type="video/mp4" />
                            </video>
                          ) : (
                            <img
                              src={post.media_url}
                              alt="Post media"
                              className="w-full h-64 object-cover rounded-md"
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-6 mt-4 pt-4 border-t text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5 mr-1" />
                          <span>{post.like_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-1" />
                          <span>Comment</span>
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-5 w-5 mr-1" />
                          <span>Share</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;