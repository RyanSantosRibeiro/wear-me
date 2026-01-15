'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp({email, password, name}: {email: string, password: string, name: string}) {
  const supabase = await createClient()

  const data = {
    email: email,
    password: password,
    name: name,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  })

  if (error) {
    console.log({error})
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
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

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}


export async function signInWithDiscord() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `https://tquaipjdqfpjjowrhytu.supabase.co/auth/v1/callback`,
    },
  })

  if (error) {
    console.error(error)
    redirect('/login?error=oauth')
  }

  redirect(data.url)
}

// recovery
export async function recoveryPassword({email}: {email: string}) {
  const supabase = await createAdminClient()

  const data = {
    email: email,
  }

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: 'http://localhost:3000/auth/reset_password',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

// send new password
export async function sendNewPassword({new_password}: {new_password: string}) {
  const supabase = await createAdminClient()


  const { error } = await supabase.auth.updateUser({
  password: new_password
})

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
