'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { SectionDefinition } from '@/lib/types';
import { Layout, Type, Image, Grid, Box } from 'lucide-react';

interface AddSectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionDefinitions: SectionDefinition[];
    onSelect: (def: SectionDefinition) => void;
}

export const AddSectionDialog: React.FC<AddSectionDialogProps> = ({ open, onOpenChange, sectionDefinitions, onSelect }) => {

    // Helper to get icon based on name (simple heuristic)
    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('hero')) return <Layout className="w-8 h-8 text-primary mb-2" />;
        if (lower.includes('text') || lower.includes('content')) return <Type className="w-8 h-8 text-primary mb-2" />;
        if (lower.includes('image') || lower.includes('gallery')) return <Image className="w-8 h-8 text-primary mb-2" />;
        if (lower.includes('grid') || lower.includes('feature')) return <Grid className="w-8 h-8 text-primary mb-2" />;
        return <Box className="w-8 h-8 text-primary mb-2" />;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                    <DialogDescription>
                        Choose a section type to add to your page.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    {sectionDefinitions.map(def => (
                        <button
                            key={def.id}
                            onClick={() => {
                                onSelect(def);
                                onOpenChange(false);
                            }}
                            className="cursor-pointer flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/10 hover:shadow-md transition-all text-center group"
                        >
                            <div className="bg-gray-100 group-hover:bg-white p-3 rounded-full mb-3 transition-colors">
                                {getIcon(def.name)}
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">{def.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{def.description}</p>
                        </button>
                    ))}
                    {sectionDefinitions.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-400">
                            No section definitions found.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
