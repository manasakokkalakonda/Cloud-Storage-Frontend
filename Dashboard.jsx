import React, { useState, useEffect } from 'react';
import { Folder, File, Star, Trash2, MoreVertical, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fetch files and folders from Express backend on port 5000
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/files', {
        credentials: 'include' // if using cookies for JWT
      });
      if (!res.ok) throw new Error('Failed to fetch storage items.');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Star / Unstar
  const handleToggleStar = async (id, type, isStarred) => {
    try {
      const method = isStarred ? 'DELETE' : 'POST';
      const res = await fetch('http://localhost:5000/api/stars', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id, resourceType: type }),
      });

      if (!res.ok) throw new Error('Could update star status');
      
      setSuccessMsg('Successfully updated star status!');
      fetchItems();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Soft Delete / Move to Trash
  const handleDelete = async (id, type) => {
    try {
      const endpoint = type === 'folder' 
        ? `http://localhost:5000/api/folders/${id}` 
        : `http://localhost:5000/api/files/${id}`;
        
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item.');

      setItems(items.filter(item => item.id !== id));
      setSuccessMsg('Item moved to trash.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-ext500 font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Cloud Storage Dashboard
            </h1>
            <p className="text-sm text-slate-500">Manage your files securely and seamlessly</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">
              + Upload File
            </button>
          </div>
        </header>

        {/* Feedback Banners */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Grid */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Files & Folders</h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading your space...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No files found. Upload your first file!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="group relative bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    {item.type === 'folder' ? (
                      <Folder className="text-amber-500 w-8 h-8" />
                    ) : (
                      <File className="text-indigo-500 w-8 h-8" />
                    )}
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleToggleStar(item.id, item.type, item.isStarred)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-amber-500"
                      >
                        <Star size={16} fill={item.isStarred ? 'currentColor' : 'none'} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.type)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="font-medium text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.sizeBytes ? `${(item.sizeBytes / 1024).toFixed(1)} KB` : 'Folder'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}