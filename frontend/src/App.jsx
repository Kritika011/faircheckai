import React, { useState, lazy, Suspense } from 'react';
import Form from './components/Form';
import ResultCard from './components/ResultCard';
const Dashboard = lazy(() => import('./components/Dashboard'));
const CSVUpload = lazy(() => import('./components/CSVUpload'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
import { ShieldCheck, LayoutDashboard, Calculator, Upload, ClipboardList, Sparkles, BrainCircuit } from 'lucide-react';
import { predict as apiPredict } from './services/api';

function App() {
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('predict');
    const [refreshToken, setRefreshToken] = useState(0);

    const handlePredict = async (formData) => {
        try {
            const data = await apiPredict(formData);
            setResult(data);
            setRefreshToken((currentValue) => currentValue + 1);
        } catch (error) {
            alert(error.response?.data?.detail || 'Error connecting to the backend. Is it running?');
        }
    };

    const handleUploadComplete = () => {
        setRefreshToken((currentValue) => currentValue + 1);
        setActiveTab('dashboard');
    };

    const tabs = [
        { key: 'predict', label: 'Predict', icon: Calculator },
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'upload', label: 'CSV Upload', icon: Upload },
        { key: 'admin', label: 'Admin', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen text-slate-100">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 text-slate-950 shadow-glow">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white">
                                FairCheck<span className="text-cyan-300">AI</span>
                            </h1>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                Fairness detection for hiring decisions
                            </p>
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                    activeTab === key
                                        ? 'bg-white text-slate-950 shadow-sm'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon size={16} className="mr-2" /> {label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="glass-panel rounded-[2rem] p-8 shadow-glow">
                        <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                            Production-like Demo
                        </div>
                        <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
                            Detect bias, explain AI decisions, and suggest fairer hiring workflows.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base text-slate-300">
                            This prototype predicts candidate selection, measures gender disparity, highlights bias warnings,
                            stores results, and uses Gemini to suggest how to reduce unfairness.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('predict')}
                                className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:brightness-110"
                            >
                                Run Live Prediction
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                Analyze Uploaded Dataset
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="glass-panel rounded-3xl p-5">
                            <div className="mb-3 flex items-center gap-2 text-cyan-200">
                                <BrainCircuit size={18} />
                                <span className="text-sm font-semibold uppercase tracking-[0.24em]">Model Stack</span>
                            </div>
                            <p className="text-sm text-slate-300">
                                FastAPI + Logistic Regression + Bias Metrics + Gemini + Firestore-ready persistence.
                            </p>
                        </div>
                        <div className="glass-panel rounded-3xl p-5">
                            <div className="mb-3 flex items-center gap-2 text-fuchsia-200">
                                <Sparkles size={18} />
                                <span className="text-sm font-semibold uppercase tracking-[0.24em]">Advanced Features</span>
                            </div>
                            <p className="text-sm text-slate-300">
                                CSV upload, auto bias detection, feature importance, admin history, and polished charts.
                            </p>
                        </div>
                    </div>
                </section>

                {activeTab === 'predict' ? (
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                        <div>
                            <div className="mb-6">
                                <h2 className="mb-2 text-3xl font-bold text-white">Fairness Audit</h2>
                                <p className="text-slate-300">
                                    Enter candidate details to predict selection status and audit for potential algorithmic bias.
                                </p>
                            </div>
                            <Form onResult={handlePredict} />
                        </div>
                        <div className="lg:mt-16">
                            {result ? (
                                <ResultCard result={result} />
                            ) : (
                                <div className="glass-panel flex min-h-[420px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 p-8 text-center text-slate-300">
                                    <ShieldCheck size={48} className="mb-4 opacity-30" />
                                    <p className="font-medium text-white">No prediction run yet.</p>
                                    <p className="text-sm">Complete the form to see AI insights and bias analysis.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {activeTab === 'dashboard' ? (
                    <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
                        <div>
                            <div className="mb-8">
                                <h2 className="mb-2 text-3xl font-bold text-white">System Analytics</h2>
                                <p className="text-slate-300">Overview of system-wide fairness metrics and selection patterns.</p>
                            </div>
                            <Dashboard refreshToken={refreshToken} />
                        </div>
                    </Suspense>
                ) : null}

                {activeTab === 'upload' ? (
                    <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
                        <CSVUpload onUploadComplete={handleUploadComplete} />
                    </Suspense>
                ) : null}

                {activeTab === 'admin' ? (
                    <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
                        <AdminPanel refreshToken={refreshToken} />
                    </Suspense>
                ) : null}
            </main>

            <footer className="mt-20 border-t border-white/10 py-8 text-center text-sm text-slate-400">
                <p>&copy; 2026 FairCheck AI. Built for transparency in automated decision making.</p>
            </footer>
        </div>
    );
}

export default App;
