'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/* =======================
   ADD BOT (SETUP INICIAL)
======================= */
export async function addBot(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const subscription_id = formData.get('subscription_id') as string
  const token = formData.get('token') as string
  const client_name = formData.get('client_name') as string

  if (!subscription_id || !token || !client_name) {
    return { error: 'Dados obrigatórios ausentes' }
  }

  // 🔎 Verifica se subscription existe e pertence ao usuário
  const { data: subscription, error: subError } = await supabase
    .from('user_subscriptions')
    .select('id, user_id')
    .eq('id', subscription_id)
    .single()

  if (subError || !subscription) {
    return { error: 'Subscription não encontrada' }
  }

  if (subscription.user_id !== user.id) {
    return { error: 'Sem permissão para esta subscription' }
  }

  // 🔒 Garante 1 bot por subscription
  const { data: existingBot } = await supabase
    .from('bot_instances')
    .select('bot_id')
    .eq('user_subscription_id', subscription_id)
    .maybeSingle()

  if (existingBot) {
    return { error: 'Já existe um bot para esta subscription' }
  }

  // 🤖 Criar bot
  const { error } = await supabase.from('bot_instances').insert({
    user_subscription_id: subscription_id,
    token,
    client_name,
    user_id: user.id,
    user_id: user.id,
    status: 'active',
  })

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/* =======================
   UPDATE BOT
======================= */
export async function updateBot(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const bot_id = formData.get('bot_id') as string
  const client_name = formData.get('client_name') as string
  const status = formData.get('status') as string
  const activity_name = formData.get('activity_name') as string
  const activity_type = formData.get('activity_type') as string

  if (!bot_id) {
    return { error: 'Bot inválido' }
  }

  const { error } = await supabase
    .from('bot_instances')
    .update({
      client_name,
      status,
      activity_name,
      activity_type,
      updated_at: new Date().toISOString(),
    })
    .eq('bot_id', bot_id)
    .eq('user_id', user.id) // 🔐 segurança

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/* =======================
   DELETE BOT
======================= */
export async function deleteBot(botId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { error } = await supabase
    .from('bot_instances')
    .delete()
    .eq('bot_id', botId)
    .eq('user_id', user.id) // 🔐

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
