'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteSectionDefinitionDialogProps {
    sectionName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    loading: boolean;
}

export const DeleteSectionDefinitionDialog: React.FC<DeleteSectionDefinitionDialogProps> = ({
    sectionName,
    open,
    onOpenChange,
    onConfirm,
    loading
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={20} />
                        Delete Section Definition
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the <strong>{sectionName}</strong> blueprint.
                        Existing instances of this section in pages might break.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
