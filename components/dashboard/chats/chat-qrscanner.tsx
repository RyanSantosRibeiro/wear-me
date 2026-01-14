"use client"
import { Button } from "@/components/ui/button"
import { getQrCode } from "@/utils/CMS | we.digi/queries"
import { useEffect, useState } from "react"
import QRCode from 'qrcode';
import { LoaderIcon } from "lucide-react";


const QrScanner = ({ status, sessionId, accessToken, onConnect, setStatus }: { status: 'pending' | 'expired' | 'connected' | 'ready', sessionId: string, accessToken: string, onConnect: () => void, setStatus: (s: 'pending' | 'expired' | 'connected' | 'ready') => void }) => {
    const [whatsappStatus, setWhatsappStatus] = useState<'pending' | 'expired' | 'connected' | 'ready'>(status)
    const [qrCode, setQrCode] = useState('')
    const [qrCodeImage, setQrCodeImage] = useState('')

    const fetchQrCode = async () => {
        try {
            console.log("fetching qr code")
            const response = await getQrCode(accessToken, sessionId)
            setStatus(response?.status)

            if (response?.status === 'ready') {
                setWhatsappStatus('ready')
                onConnect()
            }

            if (response.qr === null) {
                return;
            }
            console.log({ qr: response })
            setQrCode(response.qr)
            const img = await QRCode.toDataURL(response.qr);
            setQrCodeImage(img)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (status === 'pending') {
            fetchQrCode()
        }

        let interval = setInterval(() => {
            fetchQrCode()
        }, 2000)

        // caso seja ready , limpar o setInterval
        if (status === 'ready') {
            console.log("clear interval")
            clearInterval(interval)
            onConnect()
        }

        return () => {
            clearInterval(interval)
        }


    }, [status])

    return (
        <div className="flex-1 flex flex-col justify-center animate-[fadeIn_0.5s_ease-out]">

            {

            }
            <div className="mb-6 text-center">
                <span className="text-xs font-bold text-[#1ca0b5] uppercase tracking-wider mb-2 block">Eazy Zap</span>
                <h2 className="text-2xl font-bold text-[#111b21]">Connect your WhatsApp</h2>
                <p className="text-[#54656f] mt-2">Scan the QR code to link your business number.</p>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-[#d1d7db] relative">
                    {whatsappStatus === 'connected' ? (
                        <div className="w-48 h-48 flex flex-col items-center justify-center bg-primary/5 rounded-lg animate-[scaleIn_0.3s_ease-out]">
                            <div className="w-16 h-16 bg-[#1ca0b5] rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                            </div>
                            <span className="font-bold text-[#008069]">Connected!</span>
                        </div>
                    ) : (
                        <div className="relative">
                            {qrCodeImage && <img
                                // src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CMS | we.digi-Onboarding"
                                src={qrCodeImage}
                                alt="QR Code"
                                className={`w-64 h-64 transition-opacity duration-500 ${whatsappStatus === 'pending' ? 'opacity-100' : 'opacity-20 blur-sm'}`}
                            />}
                            {whatsappStatus === 'expired' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button onClick={() => setWhatsappStatus('pending')}>
                                        Generate QR Code
                                    </Button>
                                </div>
                            )}
                            {whatsappStatus === 'pending' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1ca0b5] animate-[width_3s_linear]"></div>
                            )}
                        </div>
                    )}
                </div>
                {qrCodeImage === null && <p className="text-sm text-[#54656f] mt-4 animate-pulse">Waiting...</p>}
            </div>
        </div>
    )
}

export default QrScanner
