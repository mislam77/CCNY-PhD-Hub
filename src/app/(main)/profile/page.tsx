/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaGithub, FaLinkedin, FaEdit, FaBuilding, FaGraduationCap } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import { IoIosGlobe, IoIosAddCircleOutline } from 'react-icons/io';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newExperience, setNewExperience] = useState<Partial<Profile["experiences"][number]>>({});
  const [newEducation, setNewEducation] = useState<Partial<Profile["education"][number]>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getprofile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData(data);
        } else {
          const errorText = await response.text();
          console.error('Error fetching profile:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);
    
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async () => {
    if (user) {
      try {
        const response = await fetch('/api/updateprofile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, data: formData }),
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
          setEditSection(null); // Exit edit mode
        } else {
          const errorText = await response.text();
          console.error('Error updating profile:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const addExperience = async () => {
    if (user) {
      try {
        const updatedExperiences = [...(formData.experiences || []), newExperience];
        const response = await fetch('/api/updateprofile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, data: { ...formData, experiences: updatedExperiences } }),
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
          setFormData(updatedProfile);
          setNewExperience({});
          setEditSection(null); // Exit edit mode
        } else {
          const errorText = await response.text();
          console.error('Error adding experience:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Error adding experience:', error);
      }
    }
  };

  const addEducation = async () => {
    if (user) {
      try {
        const updatedEducation = [...(formData.education || []), newEducation];
        const response = await fetch('/api/updateprofile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, data: { ...formData, education: updatedEducation } }),
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
          setFormData(updatedProfile);
          setNewEducation({});
          setEditSection(null); // Exit edit mode
        } else {
          const errorText = await response.text();
          console.error('Error adding education:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Error adding education:', error);
      }
    }
  };

  const handleEditClick = (section: string) => {
    setEditSection(section);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys: string[] = name.split('.');
        
    if (keys.length > 1) {
      setFormData((prevData: Partial<Profile>) => {
        const updatedData = { ...prevData };
        let current: Partial<Profile> = updatedData;
    
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]] as Partial<Profile>;
        }
        current[keys[keys.length - 1]] = value;
        return updatedData;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNewExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

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
        <p className="text-gray-600 mt-2">We couldn't load your profile information</p>
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
              <AvatarImage src={user?.imageUrl || '/placeholder-avatar.png'} />
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
              <Button className="bg-white text-primary hover:bg-white/90 transition-colors" onClick={() => handleEditClick('bio')}>
                <FaEdit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
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

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Experience</h2>
                <Button onClick={() => setEditSection('add_experience')}>
                  <IoIosAddCircleOutline className="h-5 w-5 mr-1" />
                  Add Experience
                </Button>
              </div>
              
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-8">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-6 ml-3 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <FaBriefcase className="text-white text-xs" />
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => handleEditClick(`experience-${index}`)}
                        >
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        
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
                        
                        <Dialog open={editSection === `experience-${index}`} onOpenChange={(open) => !open && setEditSection(null)}>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Edit Experience</DialogTitle>
                              <DialogDescription>Edit the details for this experience.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <label className="text-sm font-medium block mb-1">Company Name</label>
                                <input
                                  type="text"
                                  name={`experiences.${index}.company_name`}
                                  value={formData.experiences?.[index]?.company_name || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">Experience Type</label>
                                <input
                                  type="text"
                                  name={`experiences.${index}.experience_type`}
                                  value={formData.experiences?.[index]?.experience_type || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">Location</label>
                                <input
                                  type="text"
                                  name={`experiences.${index}.location`}
                                  value={formData.experiences?.[index]?.location || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">Start Date</label>
                                <input
                                  type="text"
                                  name={`experiences.${index}.start_date`}
                                  value={formData.experiences?.[index]?.start_date || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">End Date</label>
                                <input
                                  type="text"
                                  name={`experiences.${index}.end_date`}
                                  value={formData.experiences?.[index]?.end_date || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                  placeholder="Present (if current)"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium block mb-1">Description</label>
                                <Textarea
                                  name={`experiences.${index}.description`}
                                  value={formData.experiences?.[index]?.description || ''}
                                  onChange={handleChange}
                                  className="min-h-32"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditSection(null)}>
                                Cancel
                              </Button>
                              <Button onClick={updateProfile}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaBriefcase className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No experiences yet</h3>
                  <p className="mt-1 text-gray-500">Add your professional experiences to showcase your background</p>
                  <Button className="mt-4" onClick={() => setEditSection('add_experience')}>
                    Add Experience
                  </Button>
                </div>
              )}
              
              <Dialog open={editSection === 'add_experience'} onOpenChange={(open) => !open && setEditSection(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Experience</DialogTitle>
                    <DialogDescription>Add details about your professional experience.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium block mb-1">Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={newExperience.company_name || ''}
                        onChange={handleNewExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Experience Type</label>
                      <input
                        type="text"
                        name="experience_type"
                        value={newExperience.experience_type || ''}
                        onChange={handleNewExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Full-time, Part-time, Internship, etc."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={newExperience.location || ''}
                        onChange={handleNewExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Start Date</label>
                      <input
                        type="text"
                        name="start_date"
                        value={newExperience.start_date || ''}
                        onChange={handleNewExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Jan 2023"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">End Date</label>
                      <input
                        type="text"
                        name="end_date"
                        value={newExperience.end_date || ''}
                        onChange={handleNewExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Present (if current)"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium block mb-1">Description</label>
                      <Textarea
                        name="description"
                        value={newExperience.description || ''}
                        onChange={handleNewExperienceChange}
                        className="min-h-32"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditSection(null)}>
                      Cancel
                    </Button>
                    <Button onClick={addExperience}>
                      Add Experience
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Education</h2>
                <Button onClick={() => setEditSection('add_education')}>
                  <IoIosAddCircleOutline className="h-5 w-5 mr-1" />
                  Add Education
                </Button>
              </div>
              
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-8">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-secondary pl-6 ml-3 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <FaGraduationCap className="text-white text-xs" />
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => handleEditClick(`education-${index}`)}
                        >
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        
                        <h3 className="text-xl font-bold mb-1">{edu.college_name || 'No information'}</h3>
                        <p className="text-gray-700 font-medium">{edu.major || 'No major specified'}</p>
                        
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <FaCalendarAlt className="mr-1" />
                          <span>{edu.start_date || 'Start date'} - {edu.end_date || 'Present'}</span>
                        </div>
                        
                        <Dialog open={editSection === `education-${index}`} onOpenChange={(open) => !open && setEditSection(null)}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Education</DialogTitle>
                              <DialogDescription>Edit your education details.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium block mb-1">Institution Name</label>
                                <input
                                  type="text"
                                  name={`education.${index}.college_name`}
                                  value={formData.education?.[index]?.college_name || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">Major/Field of Study</label>
                                <input
                                  type="text"
                                  name={`education.${index}.major`}
                                  value={formData.education?.[index]?.major || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">Start Date</label>
                                <input
                                  type="text"
                                  name={`education.${index}.start_date`}
                                  value={formData.education?.[index]?.start_date || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium block mb-1">End Date</label>
                                <input
                                  type="text"
                                  name={`education.${index}.end_date`}
                                  value={formData.education?.[index]?.end_date || ''}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                                  placeholder="Present (if current)"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setEditSection(null)}>
                                Cancel
                              </Button>
                              <Button onClick={updateProfile}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaGraduationCap className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No education added yet</h3>
                  <p className="mt-1 text-gray-500">Add your educational background</p>
                  <Button className="mt-4" onClick={() => setEditSection('add_education')}>
                    Add Education
                  </Button>
                </div>
              )}
              
              <Dialog open={editSection === 'add_education'} onOpenChange={(open) => !open && setEditSection(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>Add details about your educational background.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Institution Name</label>
                      <input
                        type="text"
                        name="college_name"
                        value={newEducation.college_name || ''}
                        onChange={handleNewEducationChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Major/Field of Study</label>
                      <input
                        type="text"
                        name="major"
                        value={newEducation.major || ''}
                        onChange={handleNewEducationChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Start Date</label>
                      <input
                        type="text"
                        name="start_date"
                        value={newEducation.start_date || ''}
                        onChange={handleNewEducationChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Sep 2020"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">End Date</label>
                      <input
                        type="text"
                        name="end_date"
                        value={newEducation.end_date || ''}
                        onChange={handleNewEducationChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-
                        primary focus:outline-none"
                        placeholder="Present (if current)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditSection(null)}>
                      Cancel
                    </Button>
                    <Button onClick={addEducation}>
                      Add Education
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Portfolio & Links</h2>
                <Button onClick={() => handleEditClick('portfolio')}>
                  <FaEdit className="h-4 w-4 mr-2" />
                  Edit Links
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* GitHub Card */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <FaGithub className="h-8 w-8 text-gray-700" />
                    </div>
                  </div>
                  <h3 className="text-center text-lg font-semibold mb-2">GitHub</h3>
                  {profile.portfolio?.github ? (
                    <a 
                      href={profile.portfolio.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center text-primary hover:underline truncate"
                    >
                      {profile.portfolio.github}
                    </a>
                  ) : (
                    <p className="text-center text-gray-500">No GitHub profile added</p>
                  )}
                </div>
                
                {/* LinkedIn Card */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <FaLinkedin className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-center text-lg font-semibold mb-2">LinkedIn</h3>
                  {profile.portfolio?.linkedin ? (
                    <a 
                      href={profile.portfolio.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center text-primary hover:underline truncate"
                    >
                      {profile.portfolio.linkedin}
                    </a>
                  ) : (
                    <p className="text-center text-gray-500">No LinkedIn profile added</p>
                  )}
                </div>
                
                {/* Portfolio Website Card */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <IoIosGlobe className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-center text-lg font-semibold mb-2">Portfolio Website</h3>
                  {profile.portfolio?.site ? (
                    <a 
                      href={profile.portfolio.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center text-primary hover:underline truncate"
                    >
                      {profile.portfolio.site}
                    </a>
                  ) : (
                    <p className="text-center text-gray-500">No portfolio website added</p>
                  )}
                </div>
              </div>
              
              <Dialog open={editSection === 'portfolio'} onOpenChange={(open) => !open && setEditSection(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Portfolio Links</DialogTitle>
                    <DialogDescription>Update your online presence and portfolio links.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">GitHub URL</label>
                      <div className="flex items-center">
                        <FaGithub className="mr-2 text-xl text-gray-700" />
                        <input
                          type="text"
                          name="portfolio.github"
                          value={formData.portfolio?.github || ''}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">LinkedIn URL</label>
                      <div className="flex items-center">
                        <FaLinkedin className="mr-2 text-xl text-blue-600" />
                        <input
                          type="text"
                          name="portfolio.linkedin"
                          value={formData.portfolio?.linkedin || ''}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourusername"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Portfolio Website</label>
                      <div className="flex items-center">
                        <IoIosGlobe className="mr-2 text-xl text-green-600" />
                        <input
                          type="text"
                          name="portfolio.site"
                          value={formData.portfolio?.site || ''}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditSection(null)}>
                      Cancel
                    </Button>
                    <Button onClick={updateProfile}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bio Section */}
              <div className="md:col-span-2">
                <div className="bg-white shadow rounded-lg p-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">About Me</h2>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick('bio')}>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700">{profile.bio || 'No information added yet.'}</p>
                  
                  <Dialog open={editSection === 'bio'} onOpenChange={(open) => !open && setEditSection(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Bio</DialogTitle>
                        <DialogDescription>Update your bio below.</DialogDescription>
                      </DialogHeader>
                      <Textarea
                        name="bio"
                        placeholder="Tell us about yourself!"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        className="min-h-32"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditSection(null)}>
                          Cancel
                        </Button>
                        <Button onClick={updateProfile}>
                          Save
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                <div className="bg-white shadow rounded-lg p-6 relative h-fit sticky top-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Contact Information</h2>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick('contact_info')}>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaEnvelope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email || 'No information'}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaPhone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.contact_info?.phone || 'No information'}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{profile.contact_info?.location || 'No information'}</p>
                      </div>
                    </li>
                  </ul>
                  
                  <Dialog open={editSection === 'contact_info'} onOpenChange={(open) => !open && setEditSection(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Contact Information</DialogTitle>
                        <DialogDescription>Update your contact information below.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Email</label>
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-gray-500" />
                            <input
                              type="text"
                              name="email"
                              value={formData.email || ''}
                              onChange={handleChange}
                              placeholder="Email"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Phone Number</label>
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-gray-500" />
                            <input
                              type="text"
                              name="contact_info.phone"
                              value={formData.contact_info?.phone || ''}
                              onChange={handleChange}
                              placeholder="Phone Number"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Location</label>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-500" />
                            <input
                              type="text"
                              name="contact_info.location"
                              value={formData.contact_info?.location || ''}
                              onChange={handleChange}
                              placeholder="Location"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditSection(null)}>
                          Cancel
                        </Button>
                        <Button onClick={updateProfile}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;