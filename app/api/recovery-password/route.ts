import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Recovery Password
export async function POST(req: NextRequest) {
    try {
        const supabase = await createAdminClient(); // service_role key

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email obrigatório" },
                { status: 400 }
            );
        }

        // 2️⃣ Enviar convite (somente service_role pode)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://example.com/update-password',
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Convite enviado com sucesso!" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
