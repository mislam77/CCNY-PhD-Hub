'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaEdit } from 'react-icons/fa';

interface Profile {
    username: string;
    email: string;
    contact_info: {
        phone: string;
        dob: string;
        location: string;
    };
    bio: string;
    experiences: Array<{
        company_name: string;
        location: string;
        experience_type: string;
        start_date: string;
        end_date: string;
        description: string;
    }>;
    portfolio: {
        github: string;
        linkedin: string;
        site: string;
    };
    education: Array<{
        college_name: string;
        major: string;
        start_date: string;
        end_date: string;
    }>;
}

const ProfilePage: React.FC = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editSection, setEditSection] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

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
                    body: JSON.stringify({ userId: user.id, section: editSection, data: formData[editSection] }),
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

    useEffect(() => {
        fetchProfile();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Not signed in</div>;
    }

    const handleEditClick = (section: string) => {
        setEditSection(section);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="container mx-auto px-48 py-8">
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
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
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
                        {editSection === 'contact_info' ? (
                            <>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <label>Date of Birth:</label>
                                <input
                                    type="text"
                                    name="dob"
                                    value={formData.dob || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                            </>
                        ) : (
                            <>
                                <p>Email: {profile.email || 'No information'}</p>
                                <p>Phone: {profile.contact_info?.phone || 'No information'}</p>
                                <p>Date of Birth: {profile.contact_info?.dob || 'No information'}</p>
                                <p>Location: {profile.contact_info?.location || 'No information'}</p>
                            </>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Bio</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('bio')} />
                        {editSection === 'bio' ? (
                            <>
                                <input
                                    type="text"
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </>
                        ) : (
                            <p>{profile.bio || 'No information'}</p>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Experience</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('experiences')} />
                        {editSection === 'experiences' ? (
                            profile.experiences?.map((exp, index) => (
                                <div key={index} className="mb-4">
                                    <label>Company Name:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].company_name`}
                                        value={formData.experiences?.[index]?.company_name || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Location:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].location`}
                                        value={formData.experiences?.[index]?.location || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Experience Type:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].experience_type`}
                                        value={formData.experiences?.[index]?.experience_type || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Start Date:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].start_date`}
                                        value={formData.experiences?.[index]?.start_date || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>End Date:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].end_date`}
                                        value={formData.experiences?.[index]?.end_date || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        name={`experiences[${index}].description`}
                                        value={formData.experiences?.[index]?.description || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                </div>
                            ))
                        ) : (
                            profile.experiences?.map((exp, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="text-xl font-semibold">{exp.company_name || 'No information'}</h3>
                                    <p>Location: {exp.location || 'No information'}</p>
                                    <p>Experience Type: {exp.experience_type || 'No information'}</p>
                                    <p>Start Date: {exp.start_date || 'No information'}</p>
                                    <p>End Date: {exp.end_date || 'No information'}</p>
                                    <p>Description: {exp.description || 'No information'}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('portfolio')} />
                        {editSection === 'portfolio' ? (
                            <>
                                <label>GitHub:</label>
                                <input
                                    type="text"
                                    name="portfolio.github"
                                    value={formData.portfolio?.github || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <label>LinkedIn:</label>
                                <input
                                    type="text"
                                    name="portfolio.linkedin"
                                    value={formData.portfolio?.linkedin || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <label>Portfolio Site:</label>
                                <input
                                    type="text"
                                    name="portfolio.site"
                                    value={formData.portfolio?.site || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                            </>
                        ) : (
                            <>
                                <p>GitHub: <a href={profile.portfolio?.github || '#'} className="text-blue-500">{profile.portfolio?.github || 'No information'}</a></p>
                                <p>LinkedIn: <a href={profile.portfolio?.linkedin || '#'} className="text-blue-500">{profile.portfolio?.linkedin || 'No information'}</a></p>
                                <p>Portfolio Site: <a href={profile.portfolio?.site || '#'} className="text-blue-500">{profile.portfolio?.site || 'No information'}</a></p>
                            </>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Education</h2>
                        <FaEdit className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => handleEditClick('education')} />
                        {editSection === 'education' ? (
                            profile.education?.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <label>College Name:</label>
                                    <input
                                        type="text"
                                        name={`education[${index}].college_name`}
                                        value={formData.education?.[index]?.college_name || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Major:</label>
                                    <input
                                        type="text"
                                        name={`education[${index}].major`}
                                        value={formData.education?.[index]?.major || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>Start Date:</label>
                                    <input
                                        type="text"
                                        name={`education[${index}].start_date`}
                                        value={formData.education?.[index]?.start_date || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <label>End Date:</label>
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