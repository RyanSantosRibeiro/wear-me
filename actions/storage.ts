'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET_NAME = 'project-assets'

export async function uploadFile(formData: FormData, projectSlug: string) {
    const supabase = await createClient()
    const file = formData.get('file') as File

    if (!file) {
        return { error: 'No file provided' }
    }

    const buffer = await file.arrayBuffer()
    const name = file.name
    const path = `${projectSlug}/${Date.now()}-${name}`

    const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(path, buffer, {
            contentType: file.type,
            upsert: false
        })

    if (error) {
        console.error("Error uploading file:", error)
        return { error: error.message }
    }

    revalidatePath(`/apps/${projectSlug}/assets`)
    return { data }
}

export async function listFiles(projectSlug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list(projectSlug, {
            sortBy: { column: 'created_at', order: 'desc' }
        })

    if (error) {
        return { error: error.message }
    }

    // Map to include public URL
    const filesWithUrl = data.map(file => {
        const { data: { publicUrl } } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${projectSlug}/${file.name}`)

        return {
            ...file,
            publicUrl
        }
    })

    return { data: filesWithUrl }
}

export async function deleteFile(path: string, projectSlug: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove([path])

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/apps/${projectSlug}/assets`)
    return { success: true }
}
