/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FaGithub, FaLinkedin, FaEdit } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { IoIosGlobe } from 'react-icons/io'
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

    const fetchProfile = useCallback(async () => {
        if (userId) {
            const fetchUser = async () => {
                const response = await fetch(`/api/getprofile?userId=${userId}`);
                const data = await response.json();
                setProfile(data);
            };
            fetchUser();
        }
      }, [userId]);
      
    useEffect(() => {
        fetchProfile();
      }, [fetchProfile]);

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8">
            {profile ? (
                <>
            {/* Left Side: Profile, Contact Info, Bio */}
            <div className="w-full lg:w-1/2 space-y-8">
                {/* Profile Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Profile</h2>
                    <div className="flex items-center mb-4">
                        <Image
                            src={profile?.imageUrl || 'https://via.placeholder.com/100'}
                            alt="Profile Icon"
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full mr-4"
                        />
                        <div>
                            <>
                                <h3 className="text-xl font-semibold">{profile.first_name+' '+profile.last_name || 'No information'}</h3>
                                <p className="text-gray-600">@{profile.username || 'No information'}</p>
                            </>
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                    <div>
                        <p>
                            <FaEnvelope className="inline-block mr-2 text-lg" />
                            Email: {profile.email || 'No information'}
                        </p>
                        <p>
                            <FaPhone className="inline-block mr-2 text-lg" />
                            Phone: {profile.contact_info?.phone || 'No information'}
                        </p>
                        <p>
                            <FaMapMarkerAlt className="inline-block mr-2 text-lg" />
                            Location: {profile.contact_info?.location || 'No information'}
                        </p>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Bio</h2>
                    <p>{profile.bio || 'No information'}</p>
                </div>
            </div>

            {/* Right Side: Experience, Portfolio, Education */}
            <div className="w-full lg:w-1/2 space-y-8">
                {/* Experience Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Experience</h2>
                        {profile.experiences?.map((exp, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-semibold">{exp.company_name || 'No information'}</h3>
                                <p>Location: {exp.location || 'No information'}</p>
                                <p>Experience Type: {exp.experience_type || 'No information'}</p>
                                <p>Start Date: {exp.start_date || 'No information'}</p>
                                <p>End Date: {exp.end_date || 'No information'}</p>
                                <p>Description: {exp.description || 'No information'}</p>
                            </div>
                        ))}
                </div>

                {/* Portfolio Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                    <div>
                        <p>
                            <FaGithub className="inline-block mr-2 text-lg" />
                            GitHub: <a href={profile.portfolio?.github || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">{profile.portfolio?.github || 'No information'}</a>
                        </p>
                        <p>
                            <FaLinkedin className="inline-block mr-2 text-lg" />
                            LinkedIn: <a href={profile.portfolio?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">{profile.portfolio?.linkedin || 'No information'}</a>
                        </p>
                        <p>
                            <IoIosGlobe className="inline-block mr-2 text-lg" />
                            Portfolio Site: <a href={profile.portfolio?.site || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">{profile.portfolio?.site || 'No information'}</a>
                        </p>
                    </div>
                </div>

                {/* Education Section */}
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <h2 className="text-2xl font-bold mb-4">Education</h2>
                    {profile.education?.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-xl font-semibold">{edu.college_name || 'No information'}</h3>
                            <p>Major: {edu.major || 'No information'}</p>
                            <p>Start Date: {edu.start_date || 'No information'}</p>
                            <p>End Date: {edu.end_date || 'No information'}</p>
                        </div>
                    ))}
                </div>
            </div>
            </>) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default ProfilePage;