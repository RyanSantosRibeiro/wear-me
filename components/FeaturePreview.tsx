"use client"
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface FeaturePreviewProps {
    title: string;
    description: string;
    features: string[];
    ctaText?: string;
    illustration: React.ReactNode;
    badge?: string;
}

export const FeaturePreview: React.FC<FeaturePreviewProps> = ({
    title,
    description,
    features,
    ctaText = "Notify me when available",
    illustration,
    badge
}) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-12 p-8 animate-fade-in">
            {/* Left Content */}
            <div className="flex-1 max-w-xl space-y-8">
                {badge && (
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary text-xs font-bold tracking-wide uppercase rounded-full">
                        {badge}
                    </span>
                )}

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        {description}
                    </p>
                </div>

                <ul className="space-y-4">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1 min-w-4 min-h-4 rounded-full bg-green-100 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            </div>
                            <span className="text-slate-600 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-primary-700 hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
                    {ctaText} <ArrowRight size={16} />
                </button>
            </div>

            {/* Right Illustration */}
            <div className="flex-1 w-full max-w-xl">
                <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center p-8 group">
                    {/* Abstract decorative background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 opacity-50" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

                    {/* The Illustration Content */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        {illustration}
                    </div>
                </div>
            </div>
        </div>
    );
};