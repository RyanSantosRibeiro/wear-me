'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Image as ImageIcon, Search, UploadCloud, X, RefreshCw } from 'lucide-react';
import { listFiles, uploadFile } from '@/actions/storage';
import { Input } from '@/components/ui/input';

interface AssetPickerDialogProps {
    slug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string) => void;
}

export const AssetPickerDialog: React.FC<AssetPickerDialogProps> = ({
    slug,
    open,
    onOpenChange,
    onSelect
}) => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchFiles = async () => {
        if (!slug) return;
        setLoading(true);
        const { data, error } = await listFiles(slug);
        if (data) {
            setFiles(data.filter((f: any) => {
                const ext = f.name.split('.').pop()?.toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
            }));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            fetchFiles();
        }
    }, [open, slug]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const { error } = await uploadFile(formData, slug);
        if (!error) {
            await fetchFiles();
        }
        setUploading(false);
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex justify-between items-center pr-8">
                        <div>
                            <DialogTitle>Select Asset</DialogTitle>
                            <DialogDescription>Choose an image from your project library or upload a new one.</DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchFiles}
                            disabled={loading}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex gap-2 my-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                            placeholder="Search assets..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Button className="bg-primary hover:bg-primary/90">
                            <UploadCloud size={16} className="mr-2" />
                            Upload
                        </Button>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleUpload}
                            accept="image/*"
                            disabled={uploading}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon size={48} className="mb-4 opacity-20" />
                            <p>No images found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                            {filteredFiles.map((file) => (
                                <Card
                                    key={file.id || file.name}
                                    className="aspect-square relative group cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden bg-gray-50 border-gray-100"
                                    onClick={() => {
                                        if (file.publicUrl) {
                                            onSelect(file.publicUrl);
                                            onOpenChange(false);
                                        }
                                    }}
                                >
                                    <img
                                        src={file.publicUrl}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[10px] text-white truncate">{file.name}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
