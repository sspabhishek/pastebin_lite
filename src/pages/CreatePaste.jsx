import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreatePaste = () => {
    const [content, setContent] = useState('');
    const [ttl, setTtl] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = { content };
            if (ttl) payload.ttl_seconds = parseInt(ttl, 10);
            if (maxViews) payload.max_views = parseInt(maxViews, 10);

            const response = await fetch('/api/pastes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create paste');
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-green-600">Paste Created!</h2>
                <p className="mb-2 text-gray-700">Your paste is ready at:</p>
                <div className="bg-gray-100 p-3 rounded border border-gray-300 flex items-center justify-between mb-4">
                    <a href={result.url} className="text-indigo-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                        {result.url}
                    </a>
                </div>
                <div className="flex gap-4">
                    <Link
                        to={`/p/${result.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        View Paste (Internal)
                    </Link>
                    <button
                        onClick={() => {
                            setResult(null);
                            setContent('');
                            setTtl('');
                            setMaxViews('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                        Create Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">New Paste</h2>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                        placeholder="Paste your text here..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-1">
                            Time to Live (Seconds) <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="number"
                            id="ttl"
                            min="1"
                            value={ttl}
                            onChange={(e) => setTtl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. 60"
                        />
                    </div>

                    <div>
                        <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-1">
                            Max Views <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="number"
                            id="maxViews"
                            min="1"
                            value={maxViews}
                            onChange={(e) => setMaxViews(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. 5"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded font-medium text-white transition ${loading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                        }`}
                >
                    {loading ? 'Creating...' : 'Create Paste'}
                </button>
            </form>
        </div>
    );
};

export default CreatePaste;
