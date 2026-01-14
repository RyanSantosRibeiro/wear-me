'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'

type Mode = 'login' | 'recovery' | 'success'

export const LoginForm: React.FC<any> = ({
  onLogin,
  onRecoveryPassword,
  loading,
  error,
}) => {
  const [mode, setMode] = useState<Mode>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(formData)
  }

  const handleRecoveryPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    await onRecoveryPassword({ email: formData.email })
    setMode('success')
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SIDE permanece igual */}
      <div className="hidden lg:flex w-1/2 bg-[#111b21] relative flex-col justify-between p-12 overflow-hidden text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1ca0b5] rounded-full blur-[140px] opacity-10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight mb-8">
            <svg className="w-8 h-8 text-[#1ca0b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" /></svg>
            CMS | we.digi
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Bem-vindo de volta. <br />
            Suas vendas não param.
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Acesse seu dashboard para acompanhar seus leads e gerenciar sua equipe de atendimento.
          </p>
        </div>

        {/* Abstract Metrics Card Visual */}
        <div className="relative z-10 mt-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-slate-300 uppercase font-semibold tracking-wider">Conversões Hoje</div>
              <div className="text-2xl font-bold text-white">+24.5%</div>
            </div>
            <div className="w-10 h-10 bg-[#1ca0b5] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#1ca0b5] w-[70%]"></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Meta Diária</span>
              <span>70/100</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 mt-auto">
          © 2024 CMS | we.digi Inc. Secure Login.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#fefefe]">
        <div className="w-full max-w-md">

          {/* ================= LOGIN ================= */}
          {mode === 'login' && (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#111b21] mb-2">
                  Acesse sua conta
                </h1>
                <p className="text-[#54656f]">
                  Entre com suas credenciais para continuar.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg bg-[#f0f2f5] focus:bg-white focus:ring-2 focus:ring-[#1ca0b5]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium">Senha</label>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setMode('recovery')}
                      className="!p-0"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>

                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg bg-[#f0f2f5] focus:bg-white focus:ring-2 focus:ring-[#1ca0b5]"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  Entrar na Plataforma
                </Button>
              </form>

              <div className="mt-8 text-center space-y-3">
                <Button
                  variant="link"
                  onClick={() => setMode('recovery')}
                  className="text-[#1ca0b5] font-semibold hover:underline"
                >
                  Primeiro acesso?
                </Button>

                <p className="text-sm text-[#54656f]">
                  Ainda não tem conta?{' '}
                  <Link href="/signup" className="font-bold text-[#1ca0b5]">
                    Criar conta
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ================= RECOVERY ================= */}
          {mode === 'recovery' && (
            <>
              <h1 className="text-2xl font-bold mb-4">Recuperar acesso</h1>
              <p className="text-sm text-[#54656f] mb-6">
                Informe seu e-mail e enviaremos um link para criar ou redefinir sua senha.
              </p>

              <form onSubmit={handleRecoveryPassword} className="space-y-6">
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1ca0b5]"
                />

                <Button type="submit" disabled={loading} className="w-full">
                  Enviar link de acesso
                </Button>
              </form>

              <Button
                variant="link"
                onClick={() => setMode('login')}
                className="mt-6 text-sm text-[#54656f] hover:underline"
              >
                Voltar para login
              </Button>
            </>
          )}

          {/* ================= SUCCESS ================= */}
          {mode === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-2xl font-bold">Email enviado!</h2>
              <p className="text-[#54656f]">
                Verifique sua caixa de entrada e siga as instruções para alterar sua senha.
              </p>

              <Button onClick={() => setMode('login')} className="mt-4">
                Voltar para login
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
