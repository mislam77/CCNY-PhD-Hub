'use client';

import React, { useState } from 'react';

const EditModal: React.FC<{ section: string, profile: any, onClose: () => void, onSave: () => void }> = ({ section, profile, onClose, onSave }) => {
  const [formData, setFormData] = useState(profile[section] || {});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await fetch('/api/updateprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile.id,
          section,
          data: formData,
        }),
      });

      if (response.ok) {
        onSave(); // Refresh the page with new information
        onClose(); // Close the modal on successful update
      } else {
        const errorText = await response.text();
        console.error('Error updating profile:', response.status, response.statusText, errorText);
        setError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <span className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={onClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-4">Edit {section}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group mb-4">
              <label htmlFor={key} className="block text-gray-700">{key}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;