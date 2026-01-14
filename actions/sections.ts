'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSectionDefinition(projectId: string, name: string, description: string, schema: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('section_definitions')
        .insert({
            project_id: projectId,
            name,
            description,
            schema
        })
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath(`/apps/[slug]/sections`, 'page')
    return { data }
}

export async function updateSectionDefinition(id: string, updates: { name?: string, description?: string, schema?: any }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('section_definitions')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle()

    if (error) return { error: error.message }
    if (!data) return { error: "Section definition not found or you don't have permission to edit it." }

    revalidatePath(`/apps/[slug]/sections`, 'page')
    return { data }
}

export async function deleteSectionDefinition(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('section_definitions')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath(`/apps/[slug]/sections`, 'page')
    return { success: true }
}
