"use client"
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import { toSlug } from '@/utils/helpers';

interface OnboardingProps {
    profile: any;
}

const Onboarding: React.FC<OnboardingProps> = ({ profile }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Form Data
    const [companyName, setCompanyName] = useState('');
    const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'scanning' | 'connected'>('idle');

    // Steps configuration
    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    const completeOnboarding = async (profileId: string, companyName: string) => {
        const supabase = createClient();
        const { data, error } = await supabase.from('companies').insert({ name: companyName, owner_id: profileId, slug: toSlug(companyName) }).select("*").single();
        console.log({ data, error })
        // create member company like owner
        const { error: memberError } = await supabase.from('company_members').insert({ company_id: data?.id, profile_id: profileId, role: 'owner', user_id: profileId });
        if (error || memberError) throw error;
    };

    const handleNext = async () => {
        if (step === 2 && !companyName) return;

        if (step === totalSteps) {
            setLoading(true);
            try {
                if (profile) {
                    // Update actual data
                    await completeOnboarding(profile.id, companyName);
                    // Also update the profile mock locally if needed or rely on parent reload
                    // In a real app, onComplete() would likely trigger a re-fetch of the session
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Onboarding failed", error);
            } finally {
                setLoading(false);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleConnectWhatsapp = () => {
        setWhatsappStatus('scanning');
        setTimeout(() => {
            setWhatsappStatus('connected');
        }, 3000); // Simulate connection time
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
                {/* Header / Progress */}
                <div className="h-2 bg-[#e9edef] w-full">
                    <div
                        className="h-full bg-[#1ca0b5] transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col">
                    {/* STEP 1: WELCOME */}
                    {step === 1 && (
                        <div className="flex-1 flex flex-col items-center text-center justify-center animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-[#1ca0b5] mb-6">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>
                            <h1 className="text-3xl font-bold text-[#111b21] mb-4">
                                Welcome to CMS | we.digi, {profile?.full_name.split(' ')[0]}!
                            </h1>
                            <p className="text-[#54656f] text-lg max-w-md mb-8">
                                We're excited to help you automate your WhatsApp and boost your sales. Let's get your workspace ready in less than 2 minutes.
                            </p>
                            <Button size="lg" onClick={handleNext}>
                                Let's Get Started
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: COMPANY INFO */}
                    {step === 2 && (
                        <div className="flex-1 flex flex-col justify-center animate-[fadeIn_0.5s_ease-out]">
                            <div className="mb-8">
                                <span className="text-xs font-bold text-[#1ca0b5] uppercase tracking-wider mb-2 block">Step 1 of 3</span>
                                <h2 className="text-2xl font-bold text-[#111b21]">Tell us about your business</h2>
                                <p className="text-[#54656f] mt-2">This name will be visible to your team members.</p>
                            </div>

                            <div className="space-y-6 max-w-md w-full mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-[#3b4a54] mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full text-lg px-4 py-3 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none"
                                        placeholder="e.g. Acme Corp"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && companyName && handleNext()}
                                    />
                                </div>
                            </div>

                            <div className="mt-auto pt-8 flex justify-end">
                                <Button size="lg" onClick={handleNext} disabled={!companyName}>
                                    Next Step
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: WHATSAPP CONNECTION */}
                    {step === 3 && (
                        <div className="flex-1 flex flex-col justify-center animate-[fadeIn_0.5s_ease-out]">
                            <div className="mb-6 text-center">
                                <span className="text-xs font-bold text-[#1ca0b5] uppercase tracking-wider mb-2 block">Step 2 of 3</span>
                                <h2 className="text-2xl font-bold text-[#111b21]">Connect your WhatsApp</h2>
                                <p className="text-[#54656f] mt-2">Scan the QR code to link your business number.</p>
                            </div>

                            <div className="flex flex-col items-center justify-center mb-8">
                                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-[#d1d7db] relative">
                                    {whatsappStatus === 'connected' ? (
                                        <div className="w-48 h-48 flex flex-col items-center justify-center bg-primary/5 rounded-lg animate-[scaleIn_0.3s_ease-out]">
                                            <div className="w-16 h-16 bg-[#1ca0b5] rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                            </div>
                                            <span className="font-bold text-[#008069]">Connected!</span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CMS | we.digi-Onboarding"
                                                alt="QR Code"
                                                className={`w-48 h-48 transition-opacity duration-500 ${whatsappStatus === 'scanning' ? 'opacity-100' : 'opacity-20 blur-sm'}`}
                                            />
                                            {whatsappStatus === 'idle' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Button onClick={handleConnectWhatsapp}>
                                                        Generate QR Code
                                                    </Button>
                                                </div>
                                            )}
                                            {whatsappStatus === 'scanning' && (
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1ca0b5] animate-[width_3s_linear]"></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {whatsappStatus === 'scanning' && <p className="text-sm text-[#54656f] mt-4 animate-pulse">Waiting for scan...</p>}
                            </div>

                            <div className="mt-auto pt-8 flex justify-between items-center">
                                <button onClick={() => handleNext()} className="text-sm text-[#54656f] hover:underline">
                                    Skip for now
                                </button>
                                <Button size="lg" onClick={handleNext} disabled={whatsappStatus !== 'connected'}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="flex-1 flex flex-col items-center text-center justify-center animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-24 h-24 relative mb-8">
                                <div className="absolute inset-0 bg-[#1ca0b5] rounded-full opacity-20 animate-ping"></div>
                                <div className="relative w-full h-full bg-[#1ca0b5] rounded-full flex items-center justify-center text-white shadow-xl">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-[#111b21] mb-4">
                                You are all set!
                            </h1>
                            <p className="text-[#54656f] text-lg max-w-md mb-8">
                                Your workspace <strong>{companyName}</strong> is ready. Let's go to your dashboard and start managing your leads.
                            </p>

                            <Button size="lg" onClick={handleNext} isLoading={loading} className="w-full max-w-xs">
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
