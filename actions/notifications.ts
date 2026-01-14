'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendPushNotification(
    projectId: string,
    payload: {
        title: string
        body: string
        data?: any
    }
) {
    const supabase = await createClient()

    try {
        // Here you would fetch tokens from your database
        // example: const { data: tokens } = await supabase.from('push_tokens').select('token').eq('project_id', projectId)

        // Mock token for testing if none exist
        const tokens = ['ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]']

        const messages = tokens.map(token => ({
            to: token,
            sound: 'default',
            title: payload.title,
            body: payload.body,
            data: payload.data || {},
        }))

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        })

        const result = await response.json()

        // Log the notification in your database
        await supabase.from('notification_logs').insert({
            project_id: projectId,
            title: payload.title,
            body: payload.body,
            status: 'sent',
            payload: payload.data
        })

        revalidatePath(`/apps/[slug]/notifications`)
        return { success: true, result }
    } catch (error: any) {
        console.error('Error sending push notification:', error)
        return { success: false, error: error.message }
    }
}
