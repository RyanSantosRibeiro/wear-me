'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '../ui/button';

interface RegisterFormProps {
   onRegister: (data: any) => void;
   loading: boolean;
   error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading, error }) => {
   const [formData, setFormData] = useState({
      fullName: '',
      companyName: '',
      email: '',
      password: ''
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onRegister(formData);
   };

   return (
      <div className="flex min-h-screen w-full bg-white">
         {/* LEFT SIDE - Value Proposition & Persuasion */}
         <div className="hidden lg:flex w-1/2 bg-[#111b21] relative flex-col justify-between p-12 overflow-hidden text-white">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#1ca0b5] rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

            <div className="relative z-10">
               <div className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight mb-12">
                  <svg className="w-8 h-8 text-[#1ca0b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" /></svg>
                  CMS | we.digi
               </div>

               <h2 className="text-5xl font-extrabold leading-tight mb-6">
                  Transforme seu WhatsApp em uma <span className="text-[#1ca0b5]">máquina de vendas.</span>
               </h2>
               <p className="text-slate-400 text-lg mb-8 max-w-md">
                  Junte-se a mais de 500 empresas que automatizaram seu atendimento e triplicaram suas conversões.
               </p>

               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-[#1ca0b5]/20 flex items-center justify-center text-[#1ca0b5]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                     </div>
                     <span className="font-medium">Setup em menos de 2 minutos</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-[#1ca0b5]/20 flex items-center justify-center text-[#1ca0b5]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                     </div>
                     <span className="font-medium">Sem necessidade de cartão de crédito</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-[#1ca0b5]/20 flex items-center justify-center text-[#1ca0b5]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                     </div>
                     <span className="font-medium">Teste grátis por 7 dias</span>
                  </div>
               </div>
            </div>

            {/* Social Proof Card */}
            <div className="relative z-10 bg-[#1f2c33] p-6 rounded-xl border border-slate-700 shadow-xl max-w-md">
               <div className="flex gap-1 text-yellow-400 mb-3">
                  {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
               </div>
               <p className="text-slate-300 text-sm italic mb-4">
                  "Nossa equipe de vendas parou de perder tempo respondendo perguntas básicas. O bot do CMS | we.digi faz a triagem e nós só fechamos o negócio. Incrível."
               </p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white">R</div>
                  <div>
                     <div className="font-bold text-white text-sm">Ricardo Silva</div>
                     <div className="text-xs text-slate-400">Diretor Comercial, TechSol</div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT SIDE - Form */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
            <div className="w-full max-w-md">
               <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl font-bold text-[#111b21] mb-2">Crie sua conta grátis</h1>
                  <p className="text-[#54656f]">Comece seu teste de 7 dias. Cancele quando quiser.</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-[#3b4a54] mb-1">Nome Completo</label>
                        <input
                           type="text"
                           name="fullName"
                           required
                           value={formData.fullName}
                           onChange={handleChange}
                           className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] focus:border-[#1ca0b5] outline-none transition-all bg-[#f0f2f5] focus:bg-white"
                           placeholder="Seu nome"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-[#3b4a54] mb-1">Nome da Empresa</label>
                        <input
                           type="text"
                           name="companyName"
                           value={formData.companyName}
                           onChange={handleChange}
                           className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] focus:border-[#1ca0b5] outline-none transition-all bg-[#f0f2f5] focus:bg-white"
                           placeholder="Sua empresa"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-[#3b4a54] mb-1">E-mail Profissional</label>
                     <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] focus:border-[#1ca0b5] outline-none transition-all bg-[#f0f2f5] focus:bg-white"
                        placeholder="voce@empresa.com"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-[#3b4a54] mb-1">Senha</label>
                     <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-[#e9edef] rounded-lg focus:ring-2 focus:ring-[#1ca0b5] focus:border-[#1ca0b5] outline-none transition-all bg-[#f0f2f5] focus:bg-white"
                        placeholder="Mínimo 8 caracteres"
                     />
                  </div>

                  {error && (
                     <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                     </div>
                  )}

                  <Button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-[#1ca0b5] hover:bg-primary/80 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-200 hover:shadow-green-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-base"
                  >
                     {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : (
                        'Começar Agora - Grátis'
                     )}
                  </Button>

                  <div className="text-center text-sm text-[#54656f]">
                     Ao criar uma conta, você concorda com nossos <a href="#" className="text-[#1ca0b5] hover:underline">Termos</a> e <a href="#" className="text-[#1ca0b5] hover:underline">Privacidade</a>.
                  </div>
               </form>

               <div className="mt-8 pt-8 border-t border-[#e9edef] text-center">
                  <p className="text-[#54656f] mb-4">Já tem uma conta?</p>
                  <Link href="/login" className="text-[#1ca0b5] font-bold hover:underline">
                     Fazer Login
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};
