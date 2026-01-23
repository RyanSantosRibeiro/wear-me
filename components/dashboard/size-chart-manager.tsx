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

    // UI State
    const [step, setStep] = useState<0 | 1>(0) // 0: Select Type, 1: Edit Form
    const [chartType, setChartType] = useState<'shoes' | 'clothes'>('shoes')

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<{
        name: string
        width_score: number
        // Shoes Data
        charts: SizeChart[]
        // Clothes Data
        clothes_charts: any[]
    }>({
        name: "",
        width_score: 3,
        charts: [{ size_br: 34, measure_cm: 22.5 }],
        clothes_charts: [{ size_br: "P", chest_min: 88, chest_max: 95, length: 70 }]
    })

    const supabase = createClient()

    const handleAddNew = () => {
        setEditingId(null)
        setStep(0) // Start at selection
        setFormData({
            name: "",
            width_score: 3,
            charts: [{ size_br: 34, measure_cm: 22.5 }],
            clothes_charts: [{ size_br: "P", chest_min: 88, chest_max: 95, length: 70 }]
        })
        setIsDialogOpen(true)
    }

    const selectType = (type: 'shoes' | 'clothes') => {
        setChartType(type)
        setStep(1)
    }

    const handleEdit = (brand: any) => {
        setEditingId(brand.id)
        // Infer Type from brand data (assuming brand.category exists, or trying to detect existing charts)
        // For now relying on brand.category if migration run, or default to shoes
        const type = brand.category || 'shoes'
        setChartType(type as any)

        setFormData({
            name: brand.name,
            width_score: brand.width_score,
            charts: type === 'shoes' ? (brand.size_charts?.map((c: any) => ({ size_br: c.size_br, measure_cm: c.measure_cm })).sort((a: any, b: any) => a.size_br - b.size_br) || []) : [],
            clothes_charts: type === 'clothes' ? (brand.size_charts_clothes?.map((c: any) => ({
                size_br: c.size_br,
                chest_min: c.chest_min_cm,
                chest_max: c.chest_max_cm,
                length: c.length_cm
            })) || []) : []
        })
        setStep(1) // Jump to form
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta tabela?")) return

        // Delete children first (in case there's no ON DELETE CASCADE)
        await supabase.from('size_charts').delete().eq('brand_id', id)
        await supabase.from('size_charts_clothes').delete().eq('brand_id', id)

        const { error } = await supabase.from('brands').delete().eq('id', id)
        if (error) {
            alert("Erro ao excluir")
        } else {
            setBrands(prev => prev.filter(b => b.id !== id))
        }
    }

    // --- SHOES HANDLERS ---
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
        setFormData({ ...formData, charts: formData.charts.filter((_, i) => i !== index) })
    }

    // --- CLOTHES HANDLERS ---
    const updateClothesRow = (index: number, field: string, value: string) => {
        const newCharts = [...formData.clothes_charts]
        if (field === 'size_br') {
            newCharts[index] = { ...newCharts[index], [field]: value }
        } else {
            newCharts[index] = { ...newCharts[index], [field]: parseFloat(value) || 0 }
        }
        setFormData({ ...formData, clothes_charts: newCharts })
    }

    const addClothesRow = () => {
        setFormData({
            ...formData,
            clothes_charts: [...formData.clothes_charts, { size_br: "", chest_min: 0, chest_max: 0, length: 0 }]
        })
    }

    const removeClothesRow = (index: number) => {
        setFormData({ ...formData, clothes_charts: formData.clothes_charts.filter((_, i) => i !== index) })
    }


    const handleSave = async () => {
        if (!formData.name) return alert("Nome é obrigatório")
        setIsLoading(true)

        try {
            let brandId = editingId

            const brandPayload = {
                name: formData.name,
                width_score: formData.width_score,
                category: chartType // NEW FIELD
            }

            if (editingId) {
                // Update Brand
                const { error } = await supabase.from('brands').update(brandPayload).eq('id', editingId)
                if (error) throw error

                // Clear old charts to replace
                if (chartType === 'shoes') {
                    await supabase.from('size_charts').delete().eq('brand_id', editingId)
                } else {
                    await supabase.from('size_charts_clothes').delete().eq('brand_id', editingId)
                }
            } else {
                // Insert Brand
                const { data, error } = await supabase.from('brands').insert({
                    ...brandPayload,
                    owner_id: userId,
                    is_public: false
                }).select().single()

                if (error) throw error
                brandId = data.id
            }

            // Insert Charts
            if (brandId) {
                if (chartType === 'shoes' && formData.charts.length > 0) {
                    const rows = formData.charts.map(c => ({
                        brand_id: brandId,
                        size_br: c.size_br,
                        measure_cm: c.measure_cm
                    }))
                    const { error: chartError } = await supabase.from('size_charts').insert(rows)
                    if (chartError) throw chartError
                }
                else if (chartType === 'clothes' && formData.clothes_charts.length > 0) {
                    const rows = formData.clothes_charts.map(c => ({
                        brand_id: brandId,
                        size_br: c.size_br,
                        chest_min_cm: c.chest_min,
                        chest_max_cm: c.chest_max,
                        length_cm: c.length
                    }))
                    const { error: chartError } = await supabase.from('size_charts_clothes').insert(rows)
                    if (chartError) throw chartError
                }
            }

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

            <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Nome da Tabela</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Fôrma / Caimento</TableHead>
                            <TableHead className="text-center">Qtd. Tamanhos</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                    Nenhuma tabela encontrada. Crie a primeira!
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand: any) => (
                                <TableRow key={brand.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        #{brand.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-gray-900">{brand.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${brand.category === 'clothes' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
                                        `}>
                                            {brand.category === 'clothes' ? 'Roupas' : 'Calçados'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {brand.width_score}/5
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({brand.category === 'clothes'
                                                    ? (brand.width_score < 3 ? 'Justo' : brand.width_score > 3 ? 'Oversized' : 'Regular')
                                                    : (brand.width_score < 3 ? 'Estreita' : brand.width_score > 3 ? 'Larga' : 'Padrão')})
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-xs font-bold text-gray-700">
                                            {brand.category === 'clothes'
                                                ? (brand.size_charts_clothes?.length || 0)
                                                : (brand.size_charts?.length || 0)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={brand.is_public ? "secondary" : "default"} className="text-[10px]">
                                            {brand.is_public ? "Pública" : "Privada"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(brand)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Editar Tabela' : 'Nova Tabela de Medidas'}</DialogTitle>
                    </DialogHeader>

                    {step === 0 ? (
                        <div className="py-8 grid grid-cols-2 gap-6">
                            <button
                                onClick={() => selectType('shoes')}
                                className="flex flex-col items-center justify-center p-8 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200">
                                    <span className="text-2xl">👟</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Calçados</h3>
                                <p className="text-sm text-center text-gray-500 mt-2">Tabela com numeração (34-45) e medida em cm do pé.</p>
                            </button>

                            <button
                                onClick={() => selectType('clothes')}
                                className="flex flex-col items-center justify-center p-8 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200">
                                    <span className="text-2xl">👕</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Roupas</h3>
                                <p className="text-sm text-center text-gray-500 mt-2">Tabela com tamanhos (P-GG), tórax e comprimento.</p>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setStep(0)} disabled={!!editingId} className="-ml-2 text-gray-500">
                                    ← Voltar
                                </Button>
                                <Badge variant="outline">{chartType === 'shoes' ? 'Calçados' : 'Roupas'}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome da Tabela/Marca</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Minha Coleção 2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        {chartType === 'shoes' ? 'Largura da Fôrma (1-5)' : 'Ajuste do Caimento (1-5)'}
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={formData.width_score}
                                        onChange={e => setFormData({ ...formData, width_score: parseInt(e.target.value) || 3 })} // Default 3
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {chartType === 'shoes' ? '1=Estreita, 3=Padrão, 5=Larga' : '1=Justo/Slim, 3=Regular, 5=Oversized'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Grade de Tamanhos</Label>
                                    <Button size="sm" variant="outline" onClick={chartType === 'shoes' ? addChartRow : addClothesRow} type="button">
                                        <Plus size={14} className="mr-1" /> Adicionar Tamanho
                                    </Button>
                                </div>

                                {/* TABLE FORM: SHOES */}
                                {chartType === 'shoes' && (
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
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeChartRow(idx)}>
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                {/* TABLE FORM: CLOTHES */}
                                {chartType === 'clothes' && (
                                    <div className="border rounded-md overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Tamanho</TableHead>
                                                    <TableHead>Tórax Min (cm)</TableHead>
                                                    <TableHead>Tórax Max (cm)</TableHead>
                                                    <TableHead>Comprimento (cm)</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {formData.clothes_charts.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>
                                                            <Input
                                                                className="h-8 w-20"
                                                                placeholder="Ex: P"
                                                                value={row.size_br}
                                                                onChange={e => updateClothesRow(idx, 'size_br', e.target.value)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input type="number" className="h-8" step="0.5" value={row.chest_min} onChange={e => updateClothesRow(idx, 'chest_min', e.target.value)} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input type="number" className="h-8" step="0.5" value={row.chest_max} onChange={e => updateClothesRow(idx, 'chest_max', e.target.value)} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input type="number" className="h-8" step="0.5" value={row.length} onChange={e => updateClothesRow(idx, 'length', e.target.value)} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeClothesRow(idx)}>
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                {((chartType === 'shoes' && formData.charts.length === 0) || (chartType === 'clothes' && formData.clothes_charts.length === 0)) && (
                                    <p className="text-sm text-center text-red-500">Adicione pelo menos um tamanho.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Tabela
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
