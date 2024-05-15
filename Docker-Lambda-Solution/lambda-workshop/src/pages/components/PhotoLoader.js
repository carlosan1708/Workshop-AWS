import { useState } from 'react';

export default function PhotoLoader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;
        const body = new FormData();
        body.append('file', selectedFile);
        body.append('filename', selectedFile.name);
        try {
            const res = await fetch('api/fileUploader', { method: "POST", body });
            if (!res.ok) {
                // If response is not OK, throw an error
                throw new Error('Failed to fetch data');
            }
            const data = await res.text();
            setSelectedFile(null);
            setResult(data);
        } catch (error) {
            alert("Failed to upload")
        }
    };

    const handleFileChange = (event) => {
        setResult("")
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} value={selectedFile ? undefined : ''} />
                <button type="submit">Upload</button>
            </form>
            <div>{result}</div>
        </div>
    );
};
