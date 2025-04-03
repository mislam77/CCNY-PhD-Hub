'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import CreateCommunityDialog from '@/components/CreateCommunityDialog';
import { useUser } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Users,
  MessageCircle,
  TrendingUp,
  PlusCircle,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Community {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  created_at: string;
  banner_photo_url: string;
}

const ForumPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();
  const { user } = useUser();

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/communities', { cache: 'no-store' });
      if (response.ok) {
        const data: Community[] = await response.json();
        setCommunities(data);
        setFilteredCommunities(data);
      } else {
        console.error('Error fetching communities:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '' && activeFilter === 'all') {
      setFilteredCommunities(communities);
      return;
    }

    let filtered = [...communities];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        community => 
          community.name.toLowerCase().includes(query) || 
          community.description.toLowerCase().includes(query) ||
          community.hashtags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply tag filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(
        community => community.hashtags.includes(activeFilter)
      );
    }
    
    setFilteredCommunities(filtered);
  }, [searchQuery, communities, activeFilter]);

  // Get all unique hashtags from communities
  const allTags = Array.from(
    new Set(
      communities.flatMap(community => community.hashtags)
    )
  ).sort();

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/90 to-purple-700/90 py-16 px-4">
        <div className="absolute inset-0 bg-black/50">
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Community Forum</h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with fellow PhD students, join discussions, and share your research and experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white transition-colors"
                />
              </div>
              {user && (
                <CreateCommunityDialog onCommunityCreated={fetchCommunities}>
                  <Button className="bg-white text-primary hover:bg-white/90 py-6 px-6" size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Community
                  </Button>
                </CreateCommunityDialog>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 overflow-x-auto">
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="w-full justify-start h-10 bg-gray-50 p-1">
              <TabsTrigger 
                value="all" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                All Communities
              </TabsTrigger>
              {allTags.map(tag => (
                <TabsTrigger 
                  key={tag}
                  value={tag}
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  #{tag}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <MessageCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No communities found</h3>
            <p className="text-gray-500 mt-2 mb-6">Try a different search term or create a new community</p>
            {user && (
              <CreateCommunityDialog onCommunityCreated={fetchCommunities}>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Community
                </Button>
              </CreateCommunityDialog>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/forum/${community.id}`)}
              >
                <div 
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${community.banner_photo_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-4">
                      <h2 className="text-2xl font-bold text-white">{community.name}</h2>
                      <p className="text-white/80 text-sm mb-2">Created {formatDate(community.created_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 line-clamp-2 mb-4">{community.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.hashtags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-gray-50">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Members</span>
                    </div>
                    <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-0">
                      View Community
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;