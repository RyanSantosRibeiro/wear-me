"use client"
import { Button } from "@/components/ui/button"

export const ReferralCopy = ({ referralCode }: { referralCode: string }) => {
    return (
        <div className="min-w-[300px] flex items-center justify-between gap-2 border-2 border-primary rounded-lg p-2 bg-[#f0f2f5] border-dashed">
            <p className="text-primary font-bold">{referralCode}</p>
            <Button onClick={() => navigator.clipboard.writeText(`${process.env.PRODUCTION_URL}/cadastro?ref=${referralCode}`)}>Copiar</Button>
        </div>
    )
}