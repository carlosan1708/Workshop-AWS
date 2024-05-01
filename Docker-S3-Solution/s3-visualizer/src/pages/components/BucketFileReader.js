// pages/index.js

import { useState } from 'react';

export default function BucketFileReader() {
  const [objectKey, setObjectKey] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      setError(null); // Clear any previous error
      // Fetch data from the API route
      const res = await fetch(`/api/readS3File?key=${objectKey}`);
      if (!res.ok) {
        // If response is not OK, throw an error
        throw new Error('Failed to fetch data');
      }
      const data = await res.text();
      setFileContent(data);
    } catch (error) {
      console.error('Error fetching data or not found:', error);
      setError('Error fetching data. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleGeneratePresigned = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      setError(null); // Clear any previous error
      // Fetch data from the API route
      const res = await fetch(`/api/generateS3PresignedUrl?key=${objectKey}`);
      if (!res.ok) {
        // If response is not OK, throw an error
        throw new Error('Failed to fetch data');
      }
      const data = await res.text();
      setFileContent(data);
    } catch (error) {
      console.error('Error fetching data or not found:', error);
      setError('Error fetching data. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <div>
      <h1>Retrieve File from S3</h1>
      <input
        type="text"
        value={objectKey}
        style={{ width: '400px' }} // Adjust width as needed
        onChange={(e) => setObjectKey(e.target.value)}
        placeholder="Enter object key"
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>
      <button onClick={handleGeneratePresigned} disabled={loading}>
        Generate Presigned
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileContent && (
        <div>
          <h2>File Content:</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
}
