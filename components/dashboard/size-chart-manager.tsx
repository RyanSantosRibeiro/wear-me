"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Ruler, Trash2, Edit, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner" // Assuming sonner or similar usage, usually exposed via a hook or library. If not, I'll allow error handling via alert or console for now, or check toaster usage.
// Checked components/ui/toaster.tsx, uses standard hook. I'll use simple alerts or console if toast not globally available in context easily without checking layout. 
// Actually I'll use the one from user context if available or standard alert for MVP speed.

interface SizeChart {
    size_br: number
    measure_cm: number
}

interface Brand {
    id?: string
    name: string
    width_score: number
    owner_id: string
    is_public: boolean
    size_charts?: SizeChart[]
}

export function SizeChartManager({ initialBrands, userId }: { initialBrands: any[], userId: string }) {
    const [brands, setBrands] = useState<Brand[]>(initialBrands)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<{
        name: string
        width_score: number
        charts: SizeChart[]
    }>({
        name: "",
        width_score: 3,
        charts: [{ size_br: 34, measure_cm: 22.5 }]
    })

    const supabase = createClient()

    const handleAddNew = () => {
        setEditingId(null)
        setFormData({
            name: "",
            width_score: 3,
            charts: [{ size_br: 34, measure_cm: 22.5 }]
        })
        setIsDialogOpen(true)
    }

    const handleEdit = (brand: any) => {
        setEditingId(brand.id)
        setFormData({
            name: brand.name,
            width_score: brand.width_score,
            charts: brand.size_charts?.map((c: any) => ({ size_br: c.size_br, measure_cm: c.measure_cm })).sort((a: any, b: any) => a.size_br - b.size_br) || []
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta tabela?")) return

        const { error } = await supabase.from('brands').delete().eq('id', id)
        if (error) {
            alert("Erro ao excluir")
        } else {
            setBrands(prev => prev.filter(b => b.id !== id))
        }
    }

    const updateChartRow = (index: number, field: keyof SizeChart, value: string) => {
        const newCharts = [...formData.charts]
        newCharts[index] = { ...newCharts[index], [field]: parseFloat(value) || 0 }
        setFormData({ ...formData, charts: newCharts })
    }

    const addChartRow = () => {
        const last = formData.charts[formData.charts.length - 1] || { size_br: 33, measure_cm: 22 }
        setFormData({
            ...formData,
            charts: [...formData.charts, { size_br: last.size_br + 1, measure_cm: last.measure_cm + 0.5 }]
        })
    }

    const removeChartRow = (index: number) => {
        setFormData({
            ...formData,
            charts: formData.charts.filter((_, i) => i !== index)
        })
    }

    const handleSave = async () => {
        if (!formData.name) return alert("Nome é obrigatório")
        setIsLoading(true)

        try {
            let brandId = editingId

            if (editingId) {
                // Update Brand
                const { error } = await supabase.from('brands').update({
                    name: formData.name,
                    width_score: formData.width_score
                }).eq('id', editingId)
                if (error) throw error

                // Delete old charts (simple strategy: delete all and insert new)
                await supabase.from('size_charts').delete().eq('brand_id', editingId)
            } else {
                // Insert Brand
                const { data, error } = await supabase.from('brands').insert({
                    name: formData.name,
                    width_score: formData.width_score,
                    owner_id: userId,
                    is_public: false
                }).select().single()

                if (error) throw error
                brandId = data.id
            }

            // Insert Charts
            if (formData.charts.length > 0 && brandId) {
                const rows = formData.charts.map(c => ({
                    brand_id: brandId,
                    size_br: c.size_br,
                    measure_cm: c.measure_cm
                }))
                const { error: chartError } = await supabase.from('size_charts').insert(rows)
                if (chartError) throw chartError
            }

            // Refresh Local State (Optimistic or Refetch? Let's just reload page or refetch logic. 
            // For simple Client Component without extensive caching, refreshing page or updating local state manually is easiest.
            // I'll update local state manually for basic fields but reloading would be safer for relationships.
            // For this step I'll trigger a browser reload or router refresh.)
            window.location.reload()

        } catch (e) {
            console.error(e)
            alert("Erro ao salvar tabela.")
        } finally {
            setIsLoading(false)
            setIsDialogOpen(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Suas Tabelas de Medidas</h2>
                <Button onClick={handleAddNew} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus size={18} /> Nova Tabela
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand: any) => (
                    <Card key={brand.id} className="overflow-hidden border-2 hover:border-blue-200 transition-all">
                        <CardHeader className="pb-3 bg-gray-50/50 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                                    <CardDescription>ID: {brand.id}</CardDescription>
                                </div>
                                <Badge variant={brand.is_public ? "secondary" : "default"}>
                                    {brand.is_public ? "Pública" : "Privada"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Pontuação de Largura (Fôrma):</span>
                                    <span className="font-bold">{brand.width_score}/5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tamanhos cadastrados:</span>
                                    <span className="font-bold">{brand.size_charts?.length || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 border-t p-3 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)}>
                                <Edit size={16} className="text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(brand.id)}>
                                <Trash2 size={16} className="text-red-500" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {brands.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Ruler className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma tabela criada</h3>
                        <p className="text-gray-500 mb-6">Crie tabelas personalizadas para usar no seu widget.</p>
                        <Button onClick={handleAddNew} variant="outline">Criar Tabela</Button>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Editar Tabela' : 'Nova Tabela de Medidas'}</DialogTitle>
                        <DialogDescription>
                            Configure o nome e a grade de tamanhos. Use o ID desta tabela no script do seu widget.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome da Tabela/Marca</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Minha Confirmação M"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Largura da Fôrma (1-5)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={formData.width_score}
                                    onChange={e => setFormData({ ...formData, width_score: parseInt(e.target.value) || 3 })} // Default 3
                                />
                                <span className="text-xs text-muted-foreground">1=Muito Estreita, 3=Padrão, 5=Muito Larga</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-base font-semibold">Grade de Tamanhos</Label>
                                <Button size="sm" variant="outline" onClick={addChartRow} type="button">
                                    <Plus size={14} className="mr-1" /> Adicionar Tamanho
                                </Button>
                            </div>

                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead>Tamanho (BR)</TableHead>
                                            <TableHead>Medida (cm)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.charts.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-24"
                                                        value={row.size_br}
                                                        onChange={e => updateChartRow(idx, 'size_br', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-24"
                                                        step="0.1"
                                                        value={row.measure_cm}
                                                        onChange={e => updateChartRow(idx, 'measure_cm', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => removeChartRow(idx)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {formData.charts.length === 0 && (
                                <p className="text-sm text-center text-red-500">Adicione pelo menos um tamanho.</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Tabela
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
