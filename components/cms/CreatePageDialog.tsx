'use client';
import React, { useState } from 'react';
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
import { createPage } from '@/actions/cms';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface CreatePageDialogProps {
    projectId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (pageId: string) => void;
}

export const CreatePageDialog: React.FC<CreatePageDialogProps> = ({ projectId, open, onOpenChange, onSuccess }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Auto-generate slug
        setSlug('/' + newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    };

    const handleSubmit = async () => {
        if (!title || !slug) return;
        setLoading(true);
        setError(null);

        const { data, error: submitError } = await createPage(projectId, title, slug);

        if (submitError) {
            setError(submitError);
        } else {
            toast({
                title: "Page created",
                description: `"${title}" has been successfully created.`,
            })
            router.refresh();
            onOpenChange(false);
            if (data && onSuccess) onSuccess(data.id);
            setTitle('');
            setSlug('');
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>
                        Define the title and URL slug for your new page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input
                            id="page-title"
                            placeholder="e.g. About Us"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="page-slug">Page Slug</Label>
                        <Input
                            id="page-slug"
                            placeholder="e.g. /about-us"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !title || !slug}>
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Create Page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
