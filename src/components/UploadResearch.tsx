'use client';

import { useState } from 'react';

export default function UploadResearch() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');  // Log when input changes
    if (event.target.files && event.target.files.length > 0) {
      console.log('Selected file:', event.target.files[0]);  // Log the selected file
      setFile(event.target.files[0]);
    } else {
      console.log('No file selected');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      console.log('No file selected for upload');
      return;
    }

    const form = new FormData(e.target);  // Collect the form data (including the file)
    form.append('file', file);  // Append the file to the form data

    setUploading(true);
    setMessage('');
    console.log('Preparing to upload file:', file);
    console.log('The form:', form.get('file'));  // Log the file from the form data

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        body: form,
      });

      console.log('Response status:', response.status);  // Log response status

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);  // Log the error response
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);  // Log the response data
      setMessage('Upload successful!');
      setFile(null);
    } catch (error) {
      console.error('Error during upload:', error);
      setMessage(`Upload failed. Please try again. Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Upload Research Paper</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          className="mb-2" 
        />
        {file && <p className="text-gray-700">{file.name}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}