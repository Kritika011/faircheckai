import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, BarChart3, Database, ShieldAlert } from 'lucide-react';
import { getStats } from '../services/api';

const Dashboard = ({ refreshToken = 0 }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [refreshToken]);

    if (loading) return <div className="py-10 text-center text-slate-300">Loading Dashboard...</div>;
    if (!stats) return null;

    const colors = ['#38bdf8', '#f472b6'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="glass-panel flex items-center rounded-3xl p-4">
                    <div className="mr-4 rounded-full bg-blue-500/15 p-3">
                        <Users className="text-blue-300" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">Total Candidates</p>
                        <p className="text-2xl font-bold text-white">{stats.total_candidates}</p>
                    </div>
                </div>
                <div className="glass-panel flex items-center rounded-3xl p-4">
                    <div className="mr-4 rounded-full bg-emerald-500/15 p-3">
                        <TrendingUp className="text-emerald-300" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">Selection Rate</p>
                        <p className="text-2xl font-bold text-white">{(stats.selection_rate * 100).toFixed(1)}%</p>
                    </div>
                </div>
                <div className="glass-panel flex items-center rounded-3xl p-4">
                    <div className="mr-4 rounded-full bg-purple-500/15 p-3">
                        <BarChart3 className="text-purple-300" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">Disparity</p>
                        <p className="text-2xl font-bold text-white">{(stats.disparity * 100).toFixed(1)}%</p>
                    </div>
                </div>
                <div className="glass-panel flex items-center rounded-3xl p-4">
                    <div className="mr-4 rounded-full bg-cyan-500/15 p-3">
                        <Database className="text-cyan-300" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">Saved Predictions</p>
                        <p className="text-2xl font-bold text-white">{stats.prediction_count}</p>
                    </div>
                </div>
                <div className="glass-panel flex items-center rounded-3xl p-4">
                    <div className="mr-4 rounded-full bg-amber-500/15 p-3">
                        <ShieldAlert className="text-amber-300" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-300">Bias Status</p>
                        <p className="text-2xl font-bold text-white">{stats.bias}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
                <h3 className="mb-6 text-lg font-bold text-white">Selection Rate by Gender</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                            <XAxis dataKey="name" stroke="#cbd5e1" />
                            <YAxis unit="%" stroke="#cbd5e1" />
                            <Tooltip
                                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f172a' }}
                                labelStyle={{ color: '#e2e8f0' }}
                            />
                            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                                {stats.chart_data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
