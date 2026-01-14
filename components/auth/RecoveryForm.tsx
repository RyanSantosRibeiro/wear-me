'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface RecoveryFormProps {
  sendNewPassword: ({ new_password }: { new_password: string }) => Promise<{ error: string | null }>
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({ sendNewPassword }) => {

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)


  // Validar o link ao carregar
  // useEffect(() => {
  //   if (!accessToken || type !== 'recovery') {
  //     router.replace('/login?error=invalid_link')
  //   }
  // }, [accessToken, type, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await sendNewPassword({ new_password: newPassword })

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#111b21] p-12 text-white flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-2xl mb-8">
            <span className="text-[#1ca0b5]">CMS | we.digi</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Redefinição de senha
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Crie uma nova senha segura para sua conta.
          </p>
        </div>
        <div className="text-xs text-slate-500">© 2024 CMS | we.digi Inc.</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#fefefe]">
        <div className="w-full max-w-md">
          {!success ? (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#111b21] mb-2">Nova senha</h1>
                <p className="text-[#54656f]">Informe sua nova senha abaixo.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#3b4a54] mb-1.5">Nova senha</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-[#e9edef] rounded-lg bg-[#f0f2f5] focus:bg-white focus:ring-2 focus:ring-[#1ca0b5] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3b4a54] mb-1.5">Confirmar senha</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-[#e9edef] rounded-lg bg-[#f0f2f5] focus:bg-white focus:ring-2 focus:ring-[#1ca0b5] outline-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1ca0b5] hover:bg-primary/80 text-white font-bold py-3 rounded-lg"
                >
                  {loading ? 'Redefinindo...' : 'Redefinir senha'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-5xl">✅</div>
              <h2 className="text-2xl font-bold text-[#111b21]">Senha redefinida com sucesso</h2>
              <p className="text-[#54656f]">
                Agora você pode usar sua nova senha para entrar.
              </p>
              <Link href="/login">
                <Button className="mt-4">Voltar para login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
