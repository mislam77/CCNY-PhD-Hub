'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaGithub, FaLinkedin, FaEdit } from 'react-icons/fa';
import { IoIosGlobe } from 'react-icons/io'
import { IoIosAddCircleOutline } from "react-icons/io";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const ProfilePage: React.FC = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editSection, setEditSection] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [newExperience, setNewExperience] = useState<any>({});

    const fetchProfile = async () => {
        if (isLoaded && isSignedIn && user) {
            try {
                const response = await fetch(`/api/getprofile?userId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setFormData(data); // Initialize form data with profile data
                } else {
                    const errorText = await response.text();
                    console.error('Error fetching profile:', response.status, response.statusText, errorText);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
    };

    const updateProfile = async () => {
        if (isLoaded && isSignedIn && user) {
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
        if (isLoaded && isSignedIn && user) {
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

    useEffect(() => {
        fetchProfile();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Not signed in</div>;
    }

    const handleEditClick = (section) => {
        setEditSection(section);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length > 1) {
            setFormData((prevData) => {
                const updatedData = { ...prevData };
                let current = updatedData;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) {
                        current[keys[i]] = {};
                    }
                    current = current[keys[i]];
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

    return (
        <div className="container mx-auto p-4">
            {profile && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Profile</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('profile')} />
                        <div className="flex items-center mb-4">
                            <img
                                src={user?.imageUrl || 'https://via.placeholder.com/100'}
                                alt="Profile Icon"
                                className="w-24 h-24 rounded-full mr-4"
                            />
                            <div>
                                {editSection === 'profile' ? (
                                    <>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username || ''}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-semibold">{profile.username || 'No information'}</h3>
                                        <p className="text-gray-600">@{profile.username || 'No information'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('contact_info')} />
                        <Dialog open={editSection === 'contact_info'} onOpenChange={() => setEditSection(null)}>
                            <DialogTrigger asChild>
                                <button className="hidden">Open</button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Contact Information</DialogTitle>
                                    <DialogDescription>
                                        Update your contact information below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <label className="block mb-1">Email:</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label className="block mb-1">Phone:</label>
                                    <input
                                        type="text"
                                        name="contact_info.phone"
                                        value={formData.contact_info?.phone || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label className="block mb-1">Date of Birth:</label>
                                    <input
                                        type="text"
                                        name="contact_info.dob"
                                        value={formData.contact_info?.dob || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label className="block mb-1">Location:</label>
                                    <input
                                        type="text"
                                        name="contact_info.location"
                                        value={formData.contact_info?.location || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                </div>
                                <button
                                    onClick={updateProfile}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                >
                                    Save
                                </button>
                            </DialogContent>
                        </Dialog>
                        <>
                            <p>Email: {profile.email || 'No information'}</p>
                            <p>Phone: {profile.contact_info?.phone || 'No information'}</p>
                            <p>Date of Birth: {profile.contact_info?.dob || 'No information'}</p>
                            <p>Location: {profile.contact_info?.location || 'No information'}</p>
                        </>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Bio</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('bio')} />
                        <Dialog open={editSection === 'bio'} onOpenChange={() => setEditSection(null)}>
                            <DialogTrigger asChild>
                                <button className="hidden">Open</button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Bio</DialogTitle>
                                    <DialogDescription>
                                        Update your bio below.
                                    </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                    name="bio"
                                    placeholder="Tell us about yourself!"
                                    value={formData.bio || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={updateProfile}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                >
                                    Save
                                </button>
                            </DialogContent>
                        </Dialog>
                        <>
                            <p>{profile.bio || 'No information'}</p>
                        </>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Experience</h2>
                        <IoIosAddCircleOutline className="absolute top-4 right-12 text-gray-500 cursor-pointer" onClick={() => setEditSection('add_experience')} />
                        
                        {profile.experiences?.map((exp, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 relative">
                                <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick(`experience-${index}`)} />

                                <Dialog open={editSection === `experience-${index}`} onOpenChange={() => setEditSection(null)}>
                                    <DialogTrigger asChild>
                                        <button className="hidden">Open</button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Experience</DialogTitle>
                                            <DialogDescription>Edit the details for this experience below.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <label className="block mb-1">Company Name:</label>
                                            <input
                                                type="text"
                                                name={`experiences.${index}.company_name`}
                                                value={formData.experiences?.[index]?.company_name || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <label className="block mb-1">Location:</label>
                                            <input
                                                type="text"
                                                name={`experiences.${index}.location`}
                                                value={formData.experiences?.[index]?.location || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <label className="block mb-1">Experience Type:</label>
                                            <input
                                                type="text"
                                                name={`experiences.${index}.experience_type`}
                                                value={formData.experiences?.[index]?.experience_type || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <label className="block mb-1">Start Date:</label>
                                            <input
                                                type="text"
                                                name={`experiences.${index}.start_date`}
                                                value={formData.experiences?.[index]?.start_date || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <label className="block mb-1">End Date:</label>
                                            <input
                                                type="text"
                                                name={`experiences.${index}.end_date`}
                                                value={formData.experiences?.[index]?.end_date || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <label className="block mb-1">Description:</label>
                                            <Textarea
                                                name={`experiences.${index}.description`}
                                                value={formData.experiences?.[index]?.description || ''}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                        </div>
                                        <button
                                            onClick={updateProfile}
                                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                        >
                                            Save
                                        </button>
                                    </DialogContent>
                                </Dialog>

                                <h3 className="text-xl font-semibold">{exp.company_name || 'No information'}</h3>
                                <p>Location: {exp.location || 'No information'}</p>
                                <p>Experience Type: {exp.experience_type || 'No information'}</p>
                                <p>Start Date: {exp.start_date || 'No information'}</p>
                                <p>End Date: {exp.end_date || 'No information'}</p>
                                <p>Description: {exp.description || 'No information'}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('portfolio')} />
                        
                        <Dialog open={editSection === 'portfolio'} onOpenChange={() => setEditSection(null)}>
                            <DialogTrigger asChild>
                                <button className="hidden">Open</button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Portfolio</DialogTitle>
                                    <DialogDescription>
                                        Update your portfolio information below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-center mb-4">
                                        <FaGithub className="mr-2 text-xl" />
                                        <input
                                            type="text"
                                            name="portfolio.github"
                                            value={formData.portfolio?.github || ''}
                                            onChange={handleChange}
                                            placeholder="GitHub URL"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <FaLinkedin className="mr-2 text-xl" />
                                        <input
                                            type="text"
                                            name="portfolio.linkedin"
                                            value={formData.portfolio?.linkedin || ''}
                                            onChange={handleChange}
                                            placeholder="LinkedIn URL"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <IoIosGlobe className="mr-2 text-xl" />
                                        <input
                                            type="text"
                                            name="portfolio.site"
                                            value={formData.portfolio?.site || ''}
                                            onChange={handleChange}
                                            placeholder="Portfolio Website URL"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <button
                                        onClick={updateProfile}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>

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

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Education</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('education')} />
                        {editSection === 'education' ? (
                            profile.education?.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <input
                                        type="text"
                                        name={`education[${index}].college_name`}
                                        value={formData.education?.[index]?.college_name || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <input
                                        type="text"
                                        name={`education[${index}].major`}
                                        value={formData.education?.[index]?.major || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <input
                                        type="text"
                                        name={`education[${index}].start_date`}
                                        value={formData.education?.[index]?.start_date || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <input
                                        type="text"
                                        name={`education[${index}].end_date`}
                                        value={formData.education?.[index]?.end_date || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                </div>
                            ))
                        ) : (
                            profile.education?.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="text-xl font-semibold">{edu.college_name || 'No information'}</h3>
                                    <p>Major: {edu.major || 'No information'}</p>
                                    <p>Start Date: {edu.start_date || 'No information'}</p>
                                    <p>End Date: {edu.end_date || 'No information'}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {editSection && (
                        <button
                            onClick={updateProfile}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;