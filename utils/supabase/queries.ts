import { cache } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const getUser = cache(async (supabase: SupabaseClient) => {
    const {
        data: { user }
    } = await supabase.auth.getUser();
    return user;
});

export const getProfile = cache(async (supabase: SupabaseClient) => {
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
        return null;
    }
    const { data: profile } = await supabase.from("profiles").select("*, company_members(*)").eq("id", user.id).single()
    return profile;
});

export const getCompany = cache(async (supabase: SupabaseClient) => {
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
        return null;
    }

    const profile = await getProfile(supabase);
    if (!profile) {
        return null;
    }

    const { data: companyMembers } = await supabase.from("company_members").select("*").eq("user_id", user.id).single()
    console.log({ companyMembers });
    if (profile.role === "admin" || companyMembers?.role === "admin") {
        const { data: company } = await supabase.from("companies").select("*, company_members(*, profiles(*)), projects(*)").eq("id", companyMembers.company_id).single()
        return company;
    } else {
        const { data: company } = await supabase.from("companies").select("*, company_members(*, profiles(*)), projects(*)").eq("id", companyMembers?.company_id).single()
        return company;
    }
});

// get contacts
export const getContacts = cache(async (supabase: SupabaseClient, companyId: string, userId: string) => {
    if (!companyId || !userId) {
        return null;
    }
    // caso userID tenha um company_members com role admin
    const { data: companyMembers } = await supabase.from("company_members").select("*").eq("user_id", userId).single()
    if (companyMembers?.role === "admin" || companyMembers?.role === "owner") {
        const { data: contacts, error } = await supabase.from("contacts").select("*").eq("company_id", companyId)
        return contacts;
    }
    const { data: contacts } = await supabase.from("contacts").select("*").eq("company_id", companyId).eq("assigned_member_id", userId)
    return contacts;
});

export const getProject = cache(async (supabase: SupabaseClient, slug: string) => {
    try {
        const { data: project, error } = await supabase
            .from("projects")
            .select(`
                *,
                pages (
                    *,
                    versions: page_versions (
                        *,
                        sections: page_sections (*)
                    )
                ),
                sectionDefinitions: section_definitions (*)
            `)
            .eq("slug", slug)
            .single()

        // get sections definitions where project_id == null OR project_id == project.id
        const { data: sectionDefinitions, error: sectionDefinitionsError } = await supabase
            .from("section_definitions")
            .select("*")
            .or(`project_id.is.null,project_id.eq.${project.id}`)

        if (sectionDefinitions) {
            // Use a Map to ensure unique definitions by ID
            const definitionsMap = new Map();

            // Add definitions already fetched in the project query (if any)
            project.sectionDefinitions?.forEach((def: any) => definitionsMap.set(def.id, def));

            // Add definitions from the separate query (overwriting or adding new ones)
            sectionDefinitions.forEach((def: any) => definitionsMap.set(def.id, def));

            project.sectionDefinitions = Array.from(definitionsMap.values());
        }
        if (error) {
            console.log({ getProjectError: error });
            return null;
        }
        return project;
    } catch (error) {
        console.log(error);
        return null;
    }
});
