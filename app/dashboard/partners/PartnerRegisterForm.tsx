'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createPartner } from '@/actions/supabase/partner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

const maskCPF = (value: string) => {
    if (!value) return '';
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
};

const maskCNPJ = (value: string) => {   
    if (!value) return '';
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .slice(0, 18);
};

export const PartnerRegisterForm: React.FC<{ partnerData: any }> = ({ partnerData }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [documentType, setDocumentType] = useState(partnerData?.cpf ? 'cpf' : 'cnpj');
    const [error, setError] = useState<string | null>(null);
    const [documentValue, setDocumentValue] = useState(partnerData?.cpf ? maskCPF(partnerData?.cpf) : maskCNPJ(partnerData?.cnpj));


    const [formData, setFormData] = useState({
        name: partnerData?.name || '',
        email: partnerData?.email || '',
        type: partnerData?.type || 'agency', // agency | affiliate,
        instagram: partnerData?.instagram || '',
        linkedin: partnerData?.linkedin || '',
        website: partnerData?.website || '',
    });




    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (e.target.name === 'cnpj' || e.target.name === 'cpf') {
            const maskedValue = documentType === 'cpf' ? maskCPF(e.target.value) : maskCNPJ(e.target.value);
            setDocumentValue(maskedValue);
            setFormData({ ...formData, [e.target.name]: maskedValue });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const document = documentValue.replace(/\D/g, '');
        try {
            console.log("Enviando: ", formData)
            await createPartner({
                name: formData.name,
                email: formData.email,
                type: formData.type,
                instagram: formData.instagram,
                linkedin: formData.linkedin,
                website: formData.website,
                cpf: documentType === 'cpf' ? documentValue : '',
                cnpj: documentType === 'cnpj' ? documentValue : '',
            });
            setSuccess(true);
        } catch (err: any) {
            setError('Não foi possível enviar sua solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-cente">
                <div className="card max-w-md w-full">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Solicitação enviada 🚀
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Recebemos seu pedido de parceria.
                        Nossa equipe vai analisar e entrar em contato em breve.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full ">
            <div className="w-full flex items-center justify-center">
                <div className="w-full">

                    <form onSubmit={handleSubmit} className="space-y-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                        <div>
                            <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                Nome ou Empresa
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                placeholder="Nome da agência ou parceiro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                placeholder="contato@email.com"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                CPF ou CNPJ
                            </label>
                            <input
                                type="text"
                                value={documentValue}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, '');

                                    if (raw.length <= 11) {
                                        setDocumentValue(maskCPF(e.target.value));
                                        setDocumentType('cpf');
                                    } else {
                                        setDocumentValue(maskCNPJ(e.target.value));
                                        setDocumentType('cnpj');
                                    }
                                }}
                                className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg
      focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                placeholder="CPF ou CNPJ"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                Tipo de parceria
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                            >
                                <option value="agency">Agência / Revenda</option>
                                <option value="affiliate">Indicação / Influencer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    required
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                    placeholder="@instagram"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                    LinkedIn
                                </label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                    placeholder="@linkedin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3b4a54] mb-1">
                                    Website
                                </label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-[#f0f2f5] focus:bg-white"
                                    placeholder="https://website.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="col-span-1 flex flex-col items-center justify-center gap-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-bold py-3 rounded-lg shadow disabled:opacity-70"
                            >
                                {loading ? 'Enviando...' : partnerData ? 'Atualizar Informações' : 'Solicitar Parceria'}
                            </Button>

                            {!partnerData && (
                                <p className="text-xs text-gray-500 text-center">
                                    Sua solicitação será analisada.
                                    A parceria só será ativada após aprovação.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
