'use client'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export async function signUp({email, password, name, redirectTo}: {email: string, password: string, name: string, redirectTo: string}) {
  const supabase = await createClient()
  console.log("signUp - client")

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: redirectTo || 'https://wearme.vercel.app/auth/callback', 
      data: {
        name: name,
      },
    },
  })

  if (error) {
    console.log({error})
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signIn({email, password}: {email: string, password: string}) {
  const supabase = await createClient()

  const data = {
    email: email,
    password: password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message, ...error }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

