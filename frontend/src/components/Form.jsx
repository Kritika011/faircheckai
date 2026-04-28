import React, { useState } from 'react';
import { User, Briefcase, Award, Send, Sparkles } from 'lucide-react';

const Form = ({ onResult }) => {
    const [formData, setFormData] = useState({
        gender: 'M',
        experience: 5,
        score: 75
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onResult(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel rounded-3xl p-6 shadow-glow">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <User size={20} /> Candidate Information
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Enter candidate data and run an instant fairness-aware hiring prediction.
                    </p>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-300">
                    <Sparkles size={18} />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">Gender</label>
                    <select
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                        <Briefcase className="mr-1 inline" size={14} /> Experience (Years)
                    </label>
                    <input
                        type="number"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value || '0', 10) })}
                        min="0"
                        max="50"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                        <Award className="mr-1 inline" size={14} /> Test Score (0-100)
                    </label>
                    <input
                        type="number"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: Number.parseInt(e.target.value || '0', 10) })}
                        min="0"
                        max="100"
                    />
                </div>
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    Feature importance focuses on `experience` and `score`, while fairness checks compare male vs female selection rate.
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                    {loading ? 'Processing...' : (
                        <>
                            <Send className="mr-2" size={18} /> Run Prediction
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Form;
