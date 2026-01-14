'use client'

import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { StrictModeDroppable } from '@/components/StrictModeDroppable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateProjectMenus } from '@/actions/projects'
import { Project } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface MenuItem {
    label: string
    href: string
    icon?: string
}

// Helper to render Lucide icon from string
const IconRenderer = ({ name, size = 16, className }: { name?: string, size?: number, className?: string }) => {
    if (!name) return <Icons.ExternalLink size={size} className={className} />;

    // Convert kebab-case or space-case to PascalCase if needed,
    // but users will likely type PascalCase or camelCase as per Lucide docs
    const IconComponent = (Icons as any)[name];

    if (IconComponent) {
        return <IconComponent size={size} className={className} />;
    }

    return <Icons.HelpCircle size={size} className={className} />;
}

interface MenuBuilderProps {
    project: Project
    type: 'horizontal' | 'drawer'
    title: string
    description: string
    isCompact?: boolean
    onItemsChange?: (items: MenuItem[]) => void
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({ project, type, title, description, isCompact, onItemsChange }) => {
    const { toast } = useToast()
    const router = useRouter()

    const initialItems = project.menus?.[type]?.items || []
    const [items, setItems] = useState<MenuItem[]>(initialItems)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        const updatedMenus = {
            ...project.menus,
            [type]: { items }
        }

        const { error } = await updateProjectMenus(project.id, updatedMenus)

        if (error) {
            toast({
                title: "Error saving menu",
                description: error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Menu updated",
                description: `${title} has been saved successfully.`,
            })
            router.refresh()
        }
        setLoading(false)
    }

    const addItem = () => {
        const newItems = [...items, { label: 'New Item', href: '/', icon: 'Circle' }]
        setItems(newItems)
        onItemsChange?.(newItems)
    }

    const removeItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
        onItemsChange?.(newItems)
    }

    const updateItem = (index: number, field: keyof MenuItem, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
        onItemsChange?.(newItems)
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const sourceIndex = result.source.index
        const destinationIndex = result.destination.index
        if (sourceIndex === destinationIndex) return

        const newItems = [...items]
        const [removed] = newItems.splice(sourceIndex, 1)
        newItems.splice(destinationIndex, 0, removed)
        setItems(newItems)
        onItemsChange?.(newItems)
    }

    return (
        <div className={isCompact ? "space-y-4" : "space-y-6 container mx-auto max-w-7xl p-6"}>
            {!isCompact && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        <p className="text-xs text-gray-500">{description}</p>
                    </div>
                    <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        {loading ? <Icons.Loader2 size={16} className="animate-spin mr-2" /> : <Icons.Save size={16} className="mr-2" />}
                        Save Changes
                    </Button>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={`grid grid-cols-1 lg:grid-cols-12 ${isCompact ? 'gap-6' : 'gap-10'}`}>
                    {/* Configuration Area */}
                    <div className="lg:col-span-7 space-y-4">
                        <Card className={`${isCompact ? 'p-4' : 'p-6'} border-gray-200 shadow-sm overflow-visible`}>
                            <StrictModeDroppable droppableId="menu-items">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-col gap-3"
                                    >
                                        {items.length === 0 && (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                                                <p className="text-gray-400 text-sm">No menu items yet. Click add to start.</p>
                                            </div>
                                        )}
                                        {items.map((item, index) => (
                                            <Draggable key={`${index}`} draggableId={`${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        style={provided.draggableProps.style}
                                                        className={`flex items-start gap-4 p-4 bg-white border rounded-xl ${snapshot.isDragging
                                                            ? 'shadow-2xl ring-2 ring-primary/20 border-primary z-50'
                                                            : 'border-gray-100 hover:border-gray-200 shadow-sm transition-all'
                                                            }`}
                                                    >
                                                        <div {...provided.dragHandleProps} className={`pt-2 cursor-grab text-gray-300 hover:text-gray-500 ${snapshot.isDragging ? 'cursor-grabbing' : ''}`}>
                                                            <Icons.GripVertical size={20} />
                                                        </div>

                                                        <div className="flex-1">
                                                            {isCompact ? (
                                                                <div className="flex items-center gap-3 h-full pt-1">
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary border border-gray-100">
                                                                        <IconRenderer name={item.icon} size={16} />
                                                                    </div>
                                                                    <span className="font-black text-gray-700 tracking-tight">{item.label}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Label</Label>
                                                                            <Input
                                                                                value={item.label}
                                                                                onChange={(e) => updateItem(index, 'label', e.target.value)}
                                                                                placeholder="Home, About..."
                                                                                className="h-9"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Link (HREF)</Label>
                                                                            <div className="relative">
                                                                                <Icons.LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                                <Input
                                                                                    className="pl-9 h-9"
                                                                                    value={item.href}
                                                                                    onChange={(e) => updateItem(index, 'href', e.target.value)}
                                                                                    placeholder="/home or https://..."
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1.5">
                                                                        <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Icon (Lucide Name)</Label>
                                                                        <div className="relative">
                                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                                                                                <IconRenderer name={item.icon} size={14} />
                                                                            </div>
                                                                            <Input
                                                                                className="pl-9 h-9 font-mono text-xs"
                                                                                value={item.icon}
                                                                                onChange={(e) => updateItem(index, 'icon', e.target.value)}
                                                                                placeholder="Home, ShoppingCart, User..."
                                                                            />
                                                                        </div>
                                                                        <p className="text-[9px] text-gray-400">Use PascalCase as in lucide.dev (e.g., ShoppingBag)</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(index)}
                                                            className="pt-2 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Icons.Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>

                            <Button
                                variant="outline"
                                className="w-full mt-6 border-dashed py-8 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 bg-gray-50/50"
                                onClick={addItem}
                            >
                                <Icons.Plus size={16} className="mr-2" />
                                Add Menu Item
                            </Button>
                        </Card>
                    </div>

                    {/* Preview Area (Mobile Device) */}
                    <div className="lg:col-span-5 relative flex justify-center lg:block h-fit">
                        <div className="sticky top-6">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mobile Preview</h3>
                            </div>

                            {/* Realistic Phone Frame */}
                            <div className={`relative mx-auto ${isCompact ? 'w-[240px] h-[480px]' : 'w-[280px] h-[560px]'} bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden ring-4 ring-black/5`}>
                                {/* Speaker/Notch Area */}
                                <div className="absolute top-0 inset-x-0 h-6 bg-[#1a1a1a] flex justify-center items-end pb-1 z-20">
                                    <div className="w-16 h-4 bg-black rounded-full" />
                                </div>

                                {/* Screen Content */}
                                <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
                                    {/* App Status Bar */}
                                    <div className="h-6 w-full px-6 flex justify-between items-center text-[8px] font-bold text-gray-400 pt-2">
                                        <span>9:41</span>
                                        <div className="flex gap-1 items-center">
                                            <div className="w-2 h-1 bg-gray-300 rounded-full" />
                                            <div className="w-4 h-2 border border-gray-300 rounded-[2px]" />
                                        </div>
                                    </div>

                                    {/* App Content Mockup */}
                                    <div className="flex-1 p-5 space-y-4 pt-8">
                                        <div className="h-32 w-full bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                                            <div className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">App Content Space</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
                                            <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-20 bg-gray-50 rounded-xl border border-gray-100" />
                                            <div className="h-20 bg-gray-50 rounded-xl border border-gray-100" />
                                        </div>
                                    </div>

                                    {/* Conditional Menu Previews */}
                                    {type === 'horizontal' ? (
                                        /* BOTTOM TAB BAR PREVIEW */
                                        <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-2">
                                            {items.slice(0, 5).map((item, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className="w-5 h-5 rounded flex items-center justify-center text-gray-400">
                                                        <IconRenderer name={item.icon} size={14} />
                                                    </div>
                                                    <span className="text-[9px] font-bold tracking-tight truncate max-w-[40px] text-center">{item.label || 'Empty'}</span>
                                                </div>
                                            ))}
                                            {items.length === 0 && (
                                                <span className="text-[10px] text-gray-300 italic">No items defined</span>
                                            )}
                                        </div>
                                    ) : (
                                        /* SIDE DRAWER PREVIEW */
                                        <div className="absolute inset-0 z-30 pointer-events-none">
                                            <div className="absolute inset-0 bg-black/40" />
                                            <div className="absolute top-0 left-0 w-[80%] h-full bg-white shadow-2xl pointer-events-auto transition-transform">
                                                <div className="p-6 pt-12 space-y-6">
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                                                            <Icons.Menu size={16} />
                                                        </div>
                                                        <span className="font-bold text-sm">Navigation</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        {items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                                                <div className="w-6 h-6 rounded flex items-center justify-center text-gray-300 bg-gray-50">
                                                                    <IconRenderer name={item.icon} size={12} />
                                                                </div>
                                                                <span className="text-xs font-semibold text-gray-700">{item.label || 'Empty'}</span>
                                                            </div>
                                                        ))}
                                                        {items.length === 0 && (
                                                            <div className="text-[10px] text-gray-300 py-4 text-center italic">Drawer is empty</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Drawer Bottom */}
                                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v1.0.0</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone Bottom Line (Home Indicator) */}
                                    <div className="absolute bottom-1 inset-x-0 h-1 flex justify-center z-40">
                                        <div className="w-20 h-full bg-gray-200 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}
