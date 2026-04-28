import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, Info, Scale } from 'lucide-react';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const { prediction, bias, explanation, confidence, ai_suggestion, feature_importance, bias_metrics } = result;
    const isSelected = prediction === 'Selected';
    const isBiased = bias === 'Yes';

    return (
        <div className="space-y-6">
            <div className={`rounded-3xl border p-6 shadow-glow ${isSelected ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-rose-400/30 bg-rose-400/10'}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center text-xl font-bold text-white">
                        {isSelected ? (
                            <CheckCircle className="mr-2 text-emerald-300" />
                        ) : (
                            <XCircle className="mr-2 text-rose-300" />
                        )}
                        Prediction:
                        <span className={isSelected ? 'ml-2 text-emerald-200' : 'ml-2 text-rose-200'}>{prediction}</span>
                    </h2>
                    <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-sm font-medium text-slate-200">
                        Confidence: {(confidence * 100).toFixed(1)}%
                    </span>
                </div>

                <div className="mb-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <h3 className="mb-2 flex items-center text-sm font-semibold uppercase tracking-wider text-slate-300">
                        <Info size={14} className="mr-1" /> Explainability
                    </h3>
                    <p className="font-medium text-white">{explanation}</p>
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                        <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-slate-300">
                            <Scale size={14} className="mr-1" /> Feature Importance
                        </h3>
                        <div className="space-y-3 text-sm text-slate-200">
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <span>Experience</span>
                                    <span>{feature_importance?.experience?.toFixed?.(4) ?? '0.0000'}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-800">
                                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.min((feature_importance?.experience || 0) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 flex justify-between">
                                    <span>Score</span>
                                    <span>{feature_importance?.score?.toFixed?.(4) ?? '0.0000'}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-800">
                                    <div className="h-2 rounded-full bg-fuchsia-400" style={{ width: `${Math.min((feature_importance?.score || 0) * 100, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-4 ${isBiased ? 'border-orange-400/30 bg-orange-400/10' : 'border-blue-400/30 bg-blue-400/10'}`}>
                        <div className="mb-2 flex items-center">
                            <AlertTriangle className={isBiased ? 'mr-2 text-orange-300' : 'mr-2 text-blue-300'} size={20} />
                            <h3 className={`font-bold ${isBiased ? 'text-orange-100' : 'text-blue-100'}`}>
                            Bias Warning: {bias}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-100">
                            Male rate: {((bias_metrics?.male_rate || 0) * 100).toFixed(1)}% | Female rate: {((bias_metrics?.female_rate || 0) * 100).toFixed(1)}%
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                            Disparity: {((bias_metrics?.disparity || 0) * 100).toFixed(1)}% (threshold {(bias_metrics?.threshold || 0.2) * 100}%)
                        </p>
                        {isBiased && (
                            <p className="mt-2 text-sm text-orange-100">
                                Significant selection rate disparity detected in the current dataset.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {ai_suggestion && (
                <div className="glass-panel rounded-3xl border border-fuchsia-400/20 p-6">
                    <h3 className="mb-3 flex items-center text-lg font-bold text-fuchsia-100">
                        <Lightbulb className="mr-2 text-fuchsia-300" /> AI Suggestions (Gemini)
                    </h3>
                    <div className="max-w-none text-fuchsia-50">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {ai_suggestion}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultCard;
