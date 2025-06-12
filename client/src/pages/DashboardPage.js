// client/my-app/src/pages/DashboardPage.js
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
    const { logout, token } = useContext(AuthContext); // Get logout function and token

    // Form state
    const [inputType, setInputType] = useState('text');
    const [content, setContent] = useState('');

    // Result state
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSummary('');

        try {
            // This is the protected API call.
            // We must include the token in the authorization header.
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/summarize`,
                { inputType, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // <-- THE IMPORTANT PART
                    },
                }
            );
            setSummary(response.data.summary);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred while generating the summary.');
            }
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Welcome to Your CodeBrief AI Dashboard</h1>
            <button onClick={logout}>Logout</button>
            <hr />

            <form onSubmit={handleSubmit}>
                <div>
                    {/* Add tabs or radio buttons for input type later */}
                    <label>Content to summarize (paste text or a GitHub PR URL):</label>
                    <textarea
                        value={content}
                        onChange={(e) => {
                            // Simple check to see if it's a URL
                            if (e.target.value.startsWith('http')) {
                                setInputType('url');
                            } else {
                                setInputType('text');
                            }
                            setContent(e.target.value);
                        }}
                        placeholder="Paste your content here..."
                        rows="10"
                        style={{ width: '100%' }}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Summary'}
                </button>
            </form>

            {summary && (
                <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Summary Result:</h3>
                    <p>{summary}</p>
                </div>
            )}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default DashboardPage;