'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle } from 'lucide-react';
import { SectionDefinition } from '@/lib/types';
import { createSectionDefinition, updateSectionDefinition } from '@/actions/sections';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface SectionDefinitionDialogProps {
    projectId: string;
    section?: SectionDefinition | null; // If provided, we're editing
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (sectionId: string) => void;
}

const DEFAULT_SCHEMA = {
    type: "object",
    required: [],
    properties: {
        title: { type: "string" },
        subtitle: { type: "string" }
    }
};

export const SectionDefinitionDialog: React.FC<SectionDefinitionDialogProps> = ({
    projectId,
    section,
    open,
    onOpenChange,
    onSuccess
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [schemaStr, setSchemaStr] = useState(JSON.stringify(DEFAULT_SCHEMA, null, 2));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!section;

    // Initialize/Reset form
    useEffect(() => {
        if (open) {
            if (section) {
                setName(section.name);
                setDescription(section.description || '');
                setSchemaStr(JSON.stringify(section.schema, null, 2));
            } else {
                setName('');
                setDescription('');
                setSchemaStr(JSON.stringify(DEFAULT_SCHEMA, null, 2));
            }
            setError(null);
        }
    }, [open, section]);

    const handleSubmit = async () => {
        if (!name) {
            setError("Name is required");
            return;
        }

        let parsedSchema;
        try {
            parsedSchema = JSON.parse(schemaStr);
        } catch (e) {
            setError("Invalid JSON schema");
            return;
        }

        setLoading(true);
        setError(null);

        const result = isEditing
            ? await updateSectionDefinition(section.id, { name, description, schema: parsedSchema })
            : await createSectionDefinition(projectId, name, description, parsedSchema);


        if (result.error) {
            setError(result.error);
        } else {
            toast({
                title: isEditing ? "Section updated" : "Section created",
                description: `Successfully ${isEditing ? 'updated' : 'created'} "${name}".`,
            });
            router.refresh();
            onOpenChange(false);
            if (result.data && onSuccess) onSuccess(result.data.id);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Section Definition' : 'Create New Section Definition'}</DialogTitle>
                    <DialogDescription>
                        Definitions act as blueprints for UI components. Define the schema that users will fill.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
                    <div className="grid gap-2">
                        <Label htmlFor="section-name">Name</Label>
                        <Input
                            id="section-name"
                            placeholder="e.g. Hero Banner"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="section-desc">Description</Label>
                        <Input
                            id="section-desc"
                            placeholder="A brief description of this section"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="section-schema">JSON Schema</Label>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500 uppercase tracking-tight">Draft-07</span>
                        </div>
                        <Textarea
                            id="section-schema"
                            placeholder='{"type": "object", ...}'
                            className="font-mono text-xs h-[250px] bg-slate-900 text-slate-100 p-4 border-none focus-visible:ring-primary"
                            value={schemaStr}
                            onChange={(e) => setSchemaStr(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !name} className="bg-primary hover:bg-indigo-700">
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        {isEditing ? 'Save Changes' : 'Create Section'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
