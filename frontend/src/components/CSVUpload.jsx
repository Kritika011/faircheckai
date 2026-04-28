import React, { useState } from 'react';
import { FileUp, UploadCloud, Sparkles } from 'lucide-react';
import { uploadDataset } from '../services/api';

const CSVUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please choose a CSV file first.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await uploadDataset(file);
            setResult(response);
            onUploadComplete?.(response);
        } catch (uploadError) {
            setError(uploadError.response?.data?.detail || 'Dataset upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel rounded-3xl p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <FileUp size={20} /> CSV Upload
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Upload a hiring dataset with `gender`, `experience`, `score`, and `selected` columns.
                    </p>
                </div>
                <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 p-3 text-fuchsia-300">
                    <Sparkles size={18} />
                </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    className="block w-full rounded-2xl border border-dashed border-white/20 bg-slate-950/40 px-4 py-8 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-medium file:text-slate-950 hover:file:bg-blue-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-4 py-3 font-semibold text-white transition hover:brightness-110 ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                    <UploadCloud className="mr-2" size={18} />
                    {loading ? 'Uploading...' : 'Upload Dataset and Analyze Bias'}
                </button>
            </form>

            {error && (
                <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 space-y-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                    <p className="font-semibold">{result.message}</p>
                    <p>Total candidates: {result.total_candidates}</p>
                    <p>Bias detected: {result.bias}</p>
                    <p>Disparity: {(result.disparity * 100).toFixed(1)}%</p>
                    <p>Male selection rate: {(result.male_selection_rate * 100).toFixed(1)}%</p>
                    <p>Female selection rate: {(result.female_selection_rate * 100).toFixed(1)}%</p>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-slate-100">
                        <p className="mb-2 font-semibold text-fuchsia-200">Gemini Suggestions</p>
                        <p className="whitespace-pre-wrap">{result.ai_suggestion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CSVUpload;
