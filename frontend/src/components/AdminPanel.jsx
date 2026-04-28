import React, { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { getPredictions } from '../services/api';

const AdminPanel = ({ refreshToken = 0 }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadItems = async () => {
        setLoading(true);
        try {
            const response = await getPredictions();
            setItems(response.items || []);
        } catch (error) {
            console.error('Failed to load prediction history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [refreshToken]);

    return (
        <div className="glass-panel rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <ClipboardList size={20} /> Admin Panel
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        View stored predictions from local persistence or Firestore.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={loadItems}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-blue-400/40"
                >
                    <RefreshCw size={16} className="mr-2 inline" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-10 text-center text-slate-300">
                    Loading history...
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-4 py-10 text-center text-slate-300">
                    No saved predictions yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="min-w-full divide-y divide-white/10 bg-slate-950/30 text-sm text-slate-100">
                        <thead className="bg-white/5 text-left text-slate-300">
                            <tr>
                                <th className="px-4 py-3">Gender</th>
                                <th className="px-4 py-3">Experience</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">Prediction</th>
                                <th className="px-4 py-3">Bias</th>
                                <th className="px-4 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item, index) => (
                                <tr key={`${item.created_at}-${index}`} className="hover:bg-white/5">
                                    <td className="px-4 py-3">{item.gender}</td>
                                    <td className="px-4 py-3">{item.experience}</td>
                                    <td className="px-4 py-3">{item.score}</td>
                                    <td className="px-4 py-3">{item.prediction}</td>
                                    <td className="px-4 py-3">{item.bias}</td>
                                    <td className="px-4 py-3">{new Date(item.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
