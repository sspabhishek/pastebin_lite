import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ViewPaste = () => {
    const { id } = useParams();
    const [paste, setPaste] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Determine the API URL based on environment/routing.
        // In Vercel dev or prod, /api rewrite handles this relative path.
        const fetchPaste = async () => {
            try {
                const response = await fetch(`/api/pastes/read/${id}`);

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.error || 'Paste unavailable');
                }

                const data = await response.json();
                setPaste(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <svg className="animate-spin h-8 w-8 mr-3 text-indigo-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Loading paste...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Paste Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    Create New Paste
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                    ← Create New
                </Link>
                <div className="text-xs text-gray-400">
                    {paste.created_at && new Date(paste.created_at).toLocaleString()}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Raw Content</span>
                    {/* Copy button could go here */}
                </div>
                <pre className="p-6 overflow-auto text-sm font-mono whitespace-pre-wrap text-gray-800 leading-relaxed bg-white">
                    {paste.content}
                </pre>
            </div>
        </div>
    );
};

export default ViewPaste;
