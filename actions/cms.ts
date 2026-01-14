'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPage(projectId: string, title: string, slug: string) {
    const supabase = await createClient()

    // 1. Create Page
    const { data: page, error: pageError } = await supabase
        .from('pages')
        .insert({
            project_id: projectId,
            title,
            slug
        })
        .select()
        .single()

    if (pageError) return { error: pageError.message }

    // 2. Create Initial Draft Version
    const { data: version, error: versionError } = await supabase
        .from('page_versions')
        .insert({
            page_id: page.id,
            name: 'Initial Draft',
            status: 'DRAFT'
        })
        .select()
        .single()

    if (versionError) return { error: versionError.message }

    revalidatePath('/apps/[slug]/cms', 'page')
    // We can't easily guess the slug here without passing it, but revalidating layout might be safest or passing slug
    return { data: page }
}

export async function createDraft(pageId: string, fromVersionId: string, newName: string) {
    const supabase = await createClient()

    // 1. Fetch sections from source version
    const { data: sourceSections, error: fetchError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('version_id', fromVersionId)

    if (fetchError) return { error: fetchError.message }

    // 2. Create New Version
    const { data: newVersion, error: versionError } = await supabase
        .from('page_versions')
        .insert({
            page_id: pageId,
            name: newName,
            status: 'DRAFT'
        })
        .select()
        .single()

    if (versionError) return { error: versionError.message }

    // 3. Duplicate Sections
    if (sourceSections && sourceSections.length > 0) {
        const newSections = sourceSections.map(s => ({
            version_id: newVersion.id,
            section_definition_id: s.section_definition_id,
            order_index: s.order_index,
            content: s.content
        }))

        const { error: sectionsError } = await supabase
            .from('page_sections')
            .insert(newSections)

        if (sectionsError) return { error: sectionsError.message }
    }

    return { data: newVersion }
}

export async function publishVersion(pageId: string, versionId: string) {
    const supabase = await createClient()

    // 1. Archive current published version(s) for this page
    await supabase
        .from('page_versions')
        .update({ status: 'ARCHIVED' })
        .eq('page_id', pageId)
        .eq('status', 'PUBLISHED')

    // 2. Publish new version
    const { data, error } = await supabase
        .from('page_versions')
        .update({ status: 'PUBLISHED', updated_at: new Date().toISOString() })
        .eq('id', versionId)
        .select()
        .single()

    if (error) return { error: error.message }
    return { data }
}

export async function addSection(versionId: string, sectionDefId: string, orderIndex: number) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('page_sections')
        .insert({
            version_id: versionId,
            section_definition_id: sectionDefId,
            order_index: orderIndex,
            content: {} // Default empty content
        })
        .select()
        .single()

    if (error) return { error: error.message }
    return { data }
}

export async function updateSectionContent(sectionId: string, content: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('page_sections')
        .update({ content })
        .eq('id', sectionId)
        .select()
        .single()

    if (error) return { error: error.message }
    return { data }
}

export async function removeSection(sectionId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId)

    if (error) return { error: error.message }
    return { success: true }
}

export async function reorderSections(updates: { id: string, order_index: number }[]) {
    const supabase = await createClient()

    const errors = []
    for (const update of updates) {
        const { error } = await supabase
            .from('page_sections')
            .update({ order_index: update.order_index })
            .eq('id', update.id)

        if (error) errors.push(error)
    }

    if (errors.length > 0) return { error: errors[0].message }

    revalidatePath('/apps/[slug]/cms')
    return { success: true }
}
