import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
    // Split title to apply italic to the last word for that "premium" look
    const words = title.split(' ');
    const lastWord = words.length > 1 ? words.pop() : '';
    const mainTitle = words.join(' ');

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-2">
                    {mainTitle} {lastWord && <span className="text-primary italic text-shadow-sm">{lastWord}</span>}
                </h1>
                {description && <p className="text-gray-500 font-medium mt-1">{description}</p>}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
};
