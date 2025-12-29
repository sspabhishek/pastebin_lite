import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePaste from './pages/CreatePaste';
import ViewPaste from './pages/ViewPaste';

const NotFound = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">404 - Not Found</h2>
        <p className="text-gray-600">The page you are looking for does not exist.</p>
    </div>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <header className="bg-white shadow-sm p-4 mb-8">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <h1 className="text-xl font-bold tracking-tight text-indigo-600">
                            <Link to="/" className="hover:text-indigo-800 transition">Pastebin Lite</Link>
                        </h1>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<CreatePaste />} />
                        <Route path="/p/:id" element={<ViewPaste />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

// Helper Link component for header since it's inside Router
const Link = ({ to, children, className }) => (
    <a href={to} className={className} onClick={(e) => {
        // Simple internal navigation handling if we want strict SPA, 
        // but <a> href update matches standard browser behavior.
        // React Router <Link> is better but needs to be imported.
        // Let's import Link from react-router-dom properly.
    }}>{children}</a>
);

export default App;
