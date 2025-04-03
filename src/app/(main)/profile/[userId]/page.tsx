/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FaGithub, FaLinkedin, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { IoIosGlobe } from 'react-icons/io';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

interface Profile {
  [key: string]: any;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  contact_info: {
    phone: string;
    location: string;
  };
  bio: string;
  experiences: {
    company_name: string;
    location: string;
    experience_type: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
  portfolio: {
    github: string;
    linkedin: string;
    site: string;
  };
  education: {
    college_name: string;
    major: string;
    start_date: string;
    end_date: string;
  }[];
}

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({ params }) => {
  const searchParams = useSearchParams();
  const { userId } = params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (userId) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getprofile?userId=${userId}`);
        const data = await response.json();
        setProfile(data);
        
        // Check if the viewed profile is the current user's
        if (user && user.id === userId) {
          setIsCurrentUser(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId, user]);
      
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold">Profile not found</h2>
        <p className="text-gray-600 mt-2">This user profile doesn't exist or has been removed</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile?.imageUrl || '/placeholder-avatar.png'} />
              <AvatarFallback className="text-4xl font-bold">
                {profile.first_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">
                {profile.first_name + ' ' + profile.last_name || profile.username || 'User'}
              </h1>
              <p className="text-white/90 text-lg">@{profile.username || 'username'}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                {profile.bio && (
                  <Badge variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    PhD Student
                  </Badge>
                )}
                {profile.contact_info?.location && (
                  <Badge variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                    {profile.contact_info.location}
                  </Badge>
                )}
              </div>
            </div>
            <div className="md:ml-auto">
              {isCurrentUser && (
                <Button 
                  className="bg-white text-primary hover:bg-white/90 transition-colors"
                  onClick={() => window.location.href = '/profile'}
                >
                  Edit My Profile
                </Button>
              )}
              {!isCurrentUser && (
                <Button className="bg-white text-primary hover:bg-white/90 transition-colors">
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white shadow rounded-lg mb-6">
            <TabsList className="w-full justify-start rounded-none p-0 h-14">
              <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full">
                Overview
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full">
                Education
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full">
                Portfolio
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bio Section */}
              <div className="md:col-span-2">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-gray-700">{profile.bio || 'No bio information available.'}</p>
                </div>
                
                {/* Latest Experience Preview */}
                {profile.experiences && profile.experiences.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Latest Experience</h2>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('experience')}>
                        View All
                      </Button>
                    </div>
                    <div className="border-l-2 border-primary pl-4 ml-2">
                      <h3 className="text-lg font-semibold">{profile.experiences[0].company_name}</h3>
                      <p className="text-gray-600">{profile.experiences[0].experience_type}</p>
                      <p className="text-gray-500 text-sm">
                        <FaCalendarAlt className="inline-block mr-1" />
                        {profile.experiences[0].start_date} - {profile.experiences[0].end_date || 'Present'}
                      </p>
                      <p className="text-gray-700 mt-2">{profile.experiences[0].description}</p>
                    </div>
                  </div>
                )}
                
                {/* Latest Education Preview */}
                {profile.education && profile.education.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Latest Education</h2>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('education')}>
                        View All
                      </Button>
                    </div>
                    <div className="border-l-2 border-secondary pl-4 ml-2">
                      <h3 className="text-lg font-semibold">{profile.education[0].college_name}</h3>
                      <p className="text-gray-600">{profile.education[0].major}</p>
                      <p className="text-gray-500 text-sm">
                        <FaCalendarAlt className="inline-block mr-1" />
                        {profile.education[0].start_date} - {profile.education[0].end_date || 'Present'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="md:col-span-1">
                <div className="bg-white shadow rounded-lg p-6 h-fit sticky top-6">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaEnvelope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email || 'Not shared'}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaPhone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.contact_info?.phone || 'Not shared'}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{profile.contact_info?.location || 'Not available'}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Portfolio Links Preview */}
                {(profile.portfolio?.github || profile.portfolio?.linkedin || profile.portfolio?.site) && (
                  <div className="bg-white shadow rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">Portfolio Links</h2>
                    <ul className="space-y-3">
                      {profile.portfolio?.github && (
                        <li>
                          <a 
                            href={profile.portfolio.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-primary hover:underline"
                          >
                            <FaGithub className="mr-2" />
                            GitHub
                          </a>
                        </li>
                      )}
                      {profile.portfolio?.linkedin && (
                        <li>
                          <a 
                            href={profile.portfolio.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-primary hover:underline"
                          >
                            <FaLinkedin className="mr-2" />
                            LinkedIn
                          </a>
                        </li>
                      )}
                      {profile.portfolio?.site && (
                        <li>
                          <a 
                            href={profile.portfolio.site} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-primary hover:underline"
                          >
                            <IoIosGlobe className="mr-2" />
                            Portfolio Website
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Experience</h2>
              
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-8">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-6 ml-3 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <FaBriefcase className="text-white text-xs" />
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{exp.company_name || 'No information'}</h3>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 md:ml-2 mt-1 md:mt-0 w-fit">
                            {exp.experience_type || 'No type'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-gray-600">
                          {exp.location && (
                            <span className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {exp.location}
                            </span>
                          )}
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {exp.start_date || 'Start date'} - {exp.end_date || 'Present'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700">{exp.description || 'No description available'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaBriefcase className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No experiences shared</h3>
                  <p className="mt-1 text-gray-500">This user hasn't added any professional experiences yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Education</h2>
              
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-8">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-secondary pl-6 ml-3 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <FaGraduationCap className="text-white text-xs" />
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-xl font-bold mb-1">{edu.college_name || 'No information'}</h3>
                        <p className="text-gray-700 font-medium">{edu.major || 'No major specified'}</p>
                        
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <FaCalendarAlt className="mr-1" />
                          <span>{edu.start_date || 'Start date'} - {edu.end_date || 'Present'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaGraduationCap className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No education shared</h3>
                  <p className="mt-1 text-gray-500">This user hasn't added any educational background information yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Portfolio & Links</h2>
              
              {(profile.portfolio?.github || profile.portfolio?.linkedin || profile.portfolio?.site) ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* GitHub Card */}
                  {profile.portfolio?.github && (
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <FaGithub className="h-8 w-8 text-gray-700" />
                        </div>
                      </div>
                      <h3 className="text-center text-lg font-semibold mb-2">GitHub</h3>
                      <a 
                        href={profile.portfolio.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-center text-primary hover:underline truncate"
                      >
                        {profile.portfolio.github}
                      </a>
                    </div>
                  )}
                  
                  {/* LinkedIn Card */}
                  {profile.portfolio?.linkedin && (
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <FaLinkedin className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-center text-lg font-semibold mb-2">LinkedIn</h3>
                      <a 
                        href={profile.portfolio.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-center text-primary hover:underline truncate"
                      >
                        {profile.portfolio.linkedin}
                      </a>
                    </div>
                  )}
                  
                  {/* Portfolio Website Card */}
                  {profile.portfolio?.site && (
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <IoIosGlobe className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-center text-lg font-semibold mb-2">Portfolio Website</h3>
                      <a 
                        href={profile.portfolio.site} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-center text-primary hover:underline truncate"
                      >
                        {profile.portfolio.site}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <IoIosGlobe className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No portfolio links shared</h3>
                  <p className="mt-1 text-gray-500">This user hasn't added any portfolio links yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;