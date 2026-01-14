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
import { Loader2 } from 'lucide-react';
import { createDraft } from '@/actions/cms';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface CreateDraftDialogProps {
    pageId: string;
    fromVersionId: string;
    fromVersionName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newVersionId: string) => void;
}

export const CreateDraftDialog: React.FC<CreateDraftDialogProps> = ({ pageId, fromVersionId, fromVersionName, open, onOpenChange, onSuccess }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset name when dialog opens
    useEffect(() => {
        if (open) {
            setName(`Draft from ${fromVersionName}`);
        }
    }, [open, fromVersionName]);

    const handleSubmit = async () => {
        if (!name) return;
        setLoading(true);
        setError(null);

        const { data, error: submitError } = await createDraft(pageId, fromVersionId, name);

        if (submitError) {
            setError(submitError);
        } else {
            toast({
                title: "Draft created",
                description: `"${name}" has been successfully created.`,
            })
            router.refresh();
            onOpenChange(false);
            if (data && onSuccess) onSuccess(data.id);
            setName('');
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Draft</DialogTitle>
                    <DialogDescription>
                        Create a new working version based on <strong>{fromVersionName}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="draft-name">Version Name</Label>
                        <Input
                            id="draft-name"
                            placeholder="e.g. Summer Campaign Draft"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !name}>
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Create Draft
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
