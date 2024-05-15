// pages/index.js

import { useState } from 'react';

export default function BucketFileReader() {
    const [objectKey, setObjectKey] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGeneratePresigned = async () => {
        try {
            setLoading(true)
            setError(null); // Clear any previous error
            // Fetch data from the API route
            const res = await fetch(`/api/generateS3PresignedUrl?key=${objectKey}`);
            if (!res.ok) {
                // If response is not OK, throw an error
                throw new Error('Failed to fetch data');
            }
            const data = await res.text();
            setPhotoLink(data);
            setObjectKey('');
        } catch (error) {
            console.error('Error fetching data or not found:', error);
            setError('Error fetching data. Please try again.'); // Set error message
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>
            <div style={{ overflow: 'hidden', marginBottom: '20px' }}>
                <h1>Retrieve File from S3</h1>
                <input
                    type="text"
                    value={objectKey}
                    style={{ width: '400px' }}
                    onChange={(e) => setObjectKey(e.target.value)}
                    placeholder="Enter object key"
                />
                <button onClick={handleGeneratePresigned} disabled={loading}>
                    Display image
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div>
                {photoLink && (
                    <img src={photoLink} alt="Loaded Photo" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                )}
            </div>
        </div>
    );
}
