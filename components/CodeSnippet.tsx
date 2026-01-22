import { useState } from "react"

const COLORS: any = {
  tag: "text-purple-400",
  attr: "text-blue-400",
  string: "text-green-400",
  comment: "text-gray-500",
  key: "text-blue-400",
  var: "text-yellow-400",
  fn: "text-blue-300",
  plain: "text-white",
}

const Token = ({ type, children }: { type: string; children: React.ReactNode }) => (
  <span className={COLORS[type] || COLORS.plain}>{children}</span>
)

export default function CodeSnippet({ lines }: { lines: any }) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    const raw = lines
      .filter((l: any) => l.type !== "spacer")
      .map((l: any) => l.raw || l.text || "")
      .join("\n")

    await navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm shadow-2xl border border-white/10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>

        <button
          onClick={copyCode}
          className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
        >
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
      </div>

      {/* Code */}
      <div className="space-y-2 opacity-90">
        {lines.map((line: any, i: number) => {
          if (line.type === "spacer")
            return <div key={i} className="h-4" />

          if (line.type === "comment")
            return <div key={i} className="text-gray-500">{line.text}</div>

          return (
            <div key={i} className={`pl-${(line.indent || 0) * 4}`}>
              {line.content
                ? line.content.map((item: any, j: number) => (
                    <Token key={j} type={item.type}>{item.text}</Token>
                  ))
                : line.text}
            </div>
          )
        })}
      </div>

      <div className="absolute top-6 right-6 text-xs font-bold text-white/20 uppercase tracking-widest">
        code
      </div>
    </div>
  )
}
