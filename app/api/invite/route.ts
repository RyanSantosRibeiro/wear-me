import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createAdminClient(); // service_role

    const body = await req.json();
    const { email, company_id } = body;

    if (!email || !company_id) {
      return NextResponse.json(
        { error: "Email e company_id são obrigatórios" },
        { status: 400 }
      );
    }

    // 1️⃣ Tentar convidar
    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: "https://brandflowcms.vercel.app/invite",
      });

    let userId: string | null = null;

    // 2️⃣ Se usuário já existe
    if (inviteError) {
      if (inviteError.code !== "email_exists") {
        return NextResponse.json(
          { error: inviteError.message },
          { status: 400 }
        );
      }

      // 🔍 Buscar usuário existente pelo email
      const { data: users, error: listError } =
        await supabase.auth.admin.listUsers({ //@ts-ignore
          email,
          perPage: 1,
        });

      if (listError || !users?.users?.length) {
        return NextResponse.json(
          { error: "Usuário já existe, mas não foi possível encontrá-lo" },
          { status: 400 }
        );
      }

      userId = users.users[0].id;
    } else {
      // 3️⃣ Usuário novo
      userId = inviteData.user.id;
    }

    // 4️⃣ Criar vínculo em company_members
    const { error: memberError } = await supabase
      .from("company_members")
      .insert({
        company_id,
        user_id: userId,
        profile_id: userId,
        role: "member",
        status: "pending",
      });

    if (memberError) {
      // evita duplicidade
      if (memberError.code === "23505") {
        return NextResponse.json(
          { error: "Usuário já é membro da empresa" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: memberError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Convite enviado com sucesso!" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}



// Data example
//  userIvited: {
//     user: {
//       id: '7e1b0af0-b14e-448e-9974-3fa2591e6ee4',
//       aud: 'authenticated',
//       role: 'authenticated',
//       email: 'santos131ryan@gmail.com',
//       invited_at: '2025-12-26T14:57:40.385709244Z',
//       phone: '',
//       confirmation_sent_at: '2025-12-26T14:57:40.385709244Z',
//       app_metadata: [Object],
//       user_metadata: {},
//       identities: [Array],
//       created_at: '2025-12-26T14:57:40.380769Z',
//       updated_at: '2025-12-26T14:57:42.155067Z',
//       is_anonymous: false
//     }
//   },
//   inviteError: null
