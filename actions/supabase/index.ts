import { createClient } from "@/lib/supabase/client"


export const updateBotConfig = async (company_id: string, config: any) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bot_configs")
    .upsert(
      {
        company_id,
        ...config
      },
      {
        onConflict: "company_id"
      }
    )
    .select()
    .single()

  return { data, error }
}

export const assignContactToAgent = async (contact_id: string, agent_id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("contacts")
    .update({
      assigned_member_id: agent_id
    })
    .eq("id", contact_id)
    .select()
    .single()

  return { data, error }
}


export const createPage = async (projectId: string, title: string, slug: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("pages")
    .insert({
      project_id: projectId,
      title,
      slug
    })
    .select()
    .single()

  return { data, error }
}

export const getProjectPages = async (projectId: string) => {
  const supabase = createClient()

  // Fetches pages with their versions
  const { data, error } = await supabase
    .from("pages")
    .select(`
      *,
      versions:page_versions(
        id,
        name,
        status,
        updated_at,
        created_at
      )
    `)
    .eq("project_id", projectId)

  return { data, error }
}

// --- VERSIONS ---

export const createPageVersion = async (pageId: string, name: string, status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("page_versions")
    .insert({
      page_id: pageId,
      name,
      status
    })
    .select()
    .single()

  return { data, error }
}

export const updateVersionStatus = async (versionId: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("page_versions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", versionId)
    .select()
    .single()

  return { data, error }
}

// --- SECTIONS ---

export const getVersionSections = async (versionId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("section_instances")
    .select(`
      *,
      definition:section_definitions(*)
    `)
    .eq("version_id", versionId)
    .order('order_index', { ascending: true })

  return { data, error }
}

export const updateSectionContent = async (sectionId: string, content: any) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("section_instances")
    .update({
      content: content // Assuming 'content' column is JSONB
    })
    .eq("id", sectionId)
    .select()
    .single()

  return { data, error }
}

export const createSectionInstance = async (versionId: string, definitionId: string, orderIndex: number, content: any = {}) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("section_instances")
    .insert({
      version_id: versionId,
      section_definition_id: definitionId,
      order_index: orderIndex,
      content
    })
    .select()
    .single()

  return { data, error }
}

export const deleteSectionInstance = async (sectionId: string) => {
  const supabase = createClient()

  const { error } = await supabase
    .from("section_instances")
    .delete()
    .eq("id", sectionId)

  return { error }
}

// --- BULK OPERATIONS HELPERS ---

export const bulkCreateSections = async (sections: any[]) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("section_instances")
    .insert(sections)
    .select()

  return { data, error }
}
