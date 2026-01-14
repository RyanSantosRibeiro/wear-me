
'use client'
export default function CopyButton({ text }: { text: string }) {
    return (
        <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors"
        >
            Copiar
        </button>
    )
}