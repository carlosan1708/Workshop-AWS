// components/FileList.js

import { useState, useEffect } from 'react';

export default function BucketFileList({refreshed}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/listS3Files');
        if (!res.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Error fetching files. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch files immediately when component mounts
    fetchFiles();
  
    // Set up interval to fetch files every 4 seconds
    const interval = setInterval(fetchFiles, 4000); // 4 seconds
  
    // Clear interval on component unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, [refreshed]);
  

  return (
    <div>
      <h1>List of Files in S3 Bucket</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}
