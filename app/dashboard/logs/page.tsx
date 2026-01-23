import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/PageHeader"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { ExternalLink, Image as ImageIcon, User, Layers } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function LogsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch logs for the current user's configs
    const { data: logs, error } = await supabase
        .from("wearme_logs")
        .select(`
      *,
      wearme_configs!inner(owner_id)
    `)
        .eq("wearme_configs.owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

    console.log({ logs, error })

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Histórico de Logs"
                description="Acompanhe todas as gerações e interações dos seus clientes em tempo real."
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Atividades Recentes</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Últimas 100 gerações processadas</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
                        Live Updates
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/30">
                            <TableRow className="hover:bg-transparent border-gray-50">
                                <TableHead className="w-[180px] font-bold text-gray-400 uppercase text-[10px] tracking-widest">Data / Hora</TableHead>
                                <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Sessão</TableHead>
                                <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Produto</TableHead>
                                <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Resultado</TableHead>
                                <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Modo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                                        <TableCell className="font-medium text-gray-600 text-sm">
                                            {format(new Date(log.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-mono text-gray-400 truncate w-24">
                                                    {log.session_id || 'N/A'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {
                                                    log.looks_image_url && log.looks_image_url.length > 0 ? log.looks_image_url.map((look:string)=>{
                                                        return (
                                                            <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-sm relative group">
                                                                <img src={look} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Product" />
                                                                <a
                                                                    href={look}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                                >
                                                                    <ExternalLink size={14} className="text-white" />
                                                                </a>
                                                            </div>
                                                        )
                                                    }) : (
                                                        <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-sm relative group">
                                                            <img src={log.product_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Product" />
                                                            <a
                                                                href={log.product_image_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <ExternalLink size={14} className="text-white" />
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Produto</span>
                                                    <span className="text-[10px] text-gray-400 font-mono truncate w-20">Ref: {log.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {log.result_image_url ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50 flex-shrink-0 shadow-sm relative group">
                                                        <img src={log.result_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Result" />
                                                        <a
                                                            href={log.result_image_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <ExternalLink size={14} className="text-white" />
                                                        </a>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Gerado</span>
                                                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200 h-4 text-[9px] w-fit px-1 shadow-none">IA Active</Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <ImageIcon size={16} />
                                                    <span className="italic text-xs font-medium">Pendente</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none rounded-lg font-bold text-[10px] uppercase">
                                                {log.mode || 'Front'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                            <Layers size={48} className="opacity-10" />
                                            <p className="font-bold">Nenhum log encontrado</p>
                                            <p className="text-xs">As atividades dos seus usuários aparecerão aqui.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
