import React from 'react';
import { BotConfig, BotMenuOption, TeamMember } from '../../types';

// --- CONFIG EDITOR ---
interface BotEditorProps {
    config: BotConfig;
    teamMembers: TeamMember[];
    onUpdateWelcome: (t: string) => void;
    onAddOption: () => void;
    onUpdateOption: (id: string, field: keyof BotMenuOption, value: string) => void;
    onDeleteOption: (id: string) => void;
    onSave: () => void;
    saving: boolean;
}

export const BotConfigEditor: React.FC<BotEditorProps> = ({
    config, teamMembers, onUpdateWelcome, onAddOption, onUpdateOption, onDeleteOption, onSave, saving
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded shadow-sm border border-[#e9edef] p-6">
                <h3 className="font-bold text-[#111b21] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1ca0b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" /></svg>
                    Welcome Message
                </h3>
                <p className="text-sm text-[#667781] mb-3">This message is sent immediately when a new lead contacts you.</p>
                <textarea
                    rows={4}
                    className="w-full border border-[#e9edef] rounded px-3 py-2 focus:ring-2 focus:ring-[#1ca0b5] outline-none text-sm resize-none bg-white"
                    placeholder="Hello! Welcome to our service..."
                    value={config?.welcome_message || ''}
                    onChange={(e) => onUpdateWelcome(e.target.value)}
                />
            </div>

            <div className="bg-white rounded shadow-sm border border-[#e9edef] p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-[#111b21] flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#1ca0b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
                            Interactive Menu
                        </h3>
                        <p className="text-sm text-[#667781]">Buttons for the customer to choose from.</p>
                    </div>
                    <button
                        onClick={onAddOption}
                        className="text-sm bg-[#f0f2f5] hover:bg-[#dfe3e5] text-[#1ca0b5] font-medium px-3 py-1.5 rounded transition-colors"
                    >
                        + Add Option
                    </button>
                </div>

                <div className="space-y-3">
                    {config?.menu_options?.map((option, index) => (
                        <div key={option.id} className="border border-[#e9edef] rounded-lg p-3 bg-[#f8f9fa] flex gap-3 items-start animate-[fadeIn_0.3s_ease-out]">
                            <div className="pt-2 text-[#8696a0] text-xs font-bold w-6 text-center">{index + 1}</div>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-[#54656f] mb-0.5">Button Label (Visible to Client)</label>
                                    <input
                                        type="text"
                                        className="w-full border border-[#e9edef] rounded px-2 py-1.5 text-sm focus:border-[#1ca0b5] outline-none bg-white"
                                        value={option.label}
                                        onChange={(e) => onUpdateOption(option.id, 'label', e.target.value)}
                                        placeholder="e.g. Comercial"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#54656f] mb-0.5">Assign to Agent</label>
                                    <div className="relative">
                                        <select
                                            className="w-full border border-[#e9edef] rounded px-2 py-1.5 text-sm focus:border-[#1ca0b5] outline-none appearance-none bg-white"
                                            value={option.target_agent_id || ''}
                                            onChange={(e) => onUpdateOption(option.id, 'target_agent_id', e.target.value)}
                                        >
                                            <option value="">-- No Specific Agent --</option>
                                            {teamMembers.map(member => {
                                                console.log(member)
                                                if (member.status === 'pending') return null
                                                return (
                                                    <option key={member.id} value={member.id}>
                                                        {member?.profiles?.full_name} ({member?.profiles?.role})
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onDeleteOption(option.id)}
                                className="text-red-400 hover:text-red-600 p-1 mt-6"
                                title="Remove Option"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {config?.menu_options?.length === 0 && (
                        <div className="text-center py-4 text-[#8696a0] text-sm italic">
                            No buttons added. The bot will only send the text message.
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onSave}
                disabled={saving}
                className="w-full py-3 bg-[#1ca0b5] hover:bg-primary/80 text-white rounded font-bold shadow-sm disabled:opacity-70 transition-all"
            >
                {saving ? 'Saving...' : 'Save Configuration'}
            </button>
        </div>
    );
};

// --- PREVIEW ---
interface PreviewProps {
    config: BotConfig;
    teamMembers: TeamMember[];
}

export const BotPreview: React.FC<PreviewProps> = ({ config, teamMembers }) => {
    return (
        <div className="flex justify-center items-start lg:sticky lg:top-8">
            <div className="w-[320px] bg-[#d1d7db] rounded-[30px] border-[8px] border-[#111b21] overflow-hidden shadow-2xl h-[600px] flex flex-col relative">
                <div className="h-14 bg-[#008069] flex items-center px-4 text-white gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#008069]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold">Your Company</div>
                        <div className="text-[10px] opacity-80">Business Account</div>
                    </div>
                </div>

                <div className="flex-1 bg-[#efeae2] p-4 flex flex-col overflow-y-auto relative">
                    <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 15h10v10H15zM55 55h10v10H55z' fill='%239ca3af' fill-opacity='0.2'/%3E%3C/svg%3E\")" }}></div>

                    <div className="mt-auto relative z-10">
                        <div className="bg-white w-fit ml-auto rounded-lg p-2.5 shadow-sm text-sm text-right text-[#111b21] rounded-tr-none mb-2 relative">
                            <div className="text-[10px] font-bold text-[#008069] mb-1 uppercase text-right">Cliente</div>
                            Olá, tudo bom ?
                            <div className="text-[10px] text-[#667781] text-left mt-1">10:00 AM</div>
                        </div>
                        <div className="bg-white w-fit mr-auto rounded-lg p-2.5 shadow-sm text-sm text-[#111b21] rounded-tl-none mb-2 relative">
                            <div className="text-[10px] font-bold text-[#008069] mb-1 uppercase">🤖 Bot</div>
                            {config?.welcome_message || '...'}
                            <div className="text-[10px] text-[#667781] text-right mt-1">10:00 AM</div>
                        </div>

                        {config?.menu_options?.map(opt => {
                            const assignedAgent = teamMembers.find(m => m.id === opt.target_agent_id);
                            return (
                                <div key={opt.id} className="relative group">
                                    <div className="bg-white rounded-lg p-3 shadow-sm text-[#1ca0b5] text-center font-medium text-sm mb-2 cursor-pointer hover:bg-gray-50 transition-colors border-b-2 border-transparent hover:border-gray-100">
                                        {opt.label || '...'}
                                    </div>
                                    {assignedAgent && (
                                        <div className="absolute -right-2 top-0 translate-x-full bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            → {assignedAgent.full_name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Q&A TABLE ---
export interface KnowledgeItem { id: string; question: string; answer: string; is_active: boolean; }

interface QATableProps {
    items: KnowledgeItem[];
    onAddClick: () => void;
}

export const QATable: React.FC<QATableProps> = ({ items, onAddClick }) => (
    <div className="bg-white rounded shadow-sm border border-[#e9edef] overflow-hidden">
        <div className="p-4 bg-[#f0f2f5] border-b border-[#e9edef] flex justify-between items-center">
            <h3 className="font-bold text-[#111b21]">Knowledge Base Items</h3>
            <button
                onClick={onAddClick}
                className="bg-[#1ca0b5] hover:bg-primary/80 text-white px-4 py-2 rounded shadow-sm font-medium transition-colors flex items-center gap-2 text-sm"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Q&A
            </button>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-[#f0f2f5] border-b border-[#e9edef]">
                    <th className="px-6 py-4 font-semibold text-[#54656f] text-sm">Question</th>
                    <th className="px-6 py-4 font-semibold text-[#54656f] text-sm">Bot Answer</th>
                    <th className="px-6 py-4 font-semibold text-[#54656f] text-sm w-24">Status</th>
                    <th className="px-6 py-4 font-semibold text-[#54656f] text-sm w-24">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#e9edef]">
                {items.map(item => (
                    <tr key={item.id} className="hover:bg-[#f5f6f6] transition-colors">
                        <td className="px-6 py-4 text-[#111b21] font-medium">{item.question}</td>
                        <td className="px-6 py-4 text-[#3b4a54] text-sm">{item.answer}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/5 text-[#008069]">Active</span>
                        </td>
                        <td className="px-6 py-4">
                            <button className="text-[#1ca0b5] hover:text-[#008f6f] font-medium text-sm">Edit</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {items.length === 0 && (
            <div className="p-8 text-center text-[#8696a0]">No knowledge base items yet.</div>
        )}
    </div>
);

// --- Q&A MODAL ---
interface QAModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: string;
    answer: string;
    setQuestion: (s: string) => void;
    setAnswer: (s: string) => void;
    onGenerate: () => void;
    onSave: () => void;
    isGenerating: boolean;
}

export const QAModal: React.FC<QAModalProps> = ({
    isOpen, onClose, question, answer, setQuestion, setAnswer, onGenerate, onSave, isGenerating
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-xl max-w-lg w-full overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e9edef] flex justify-between items-center bg-[#f0f2f5]">
                    <h3 className="font-bold text-lg text-[#111b21]">Add Q&A Item</h3>
                    <button onClick={onClose} className="text-[#54656f] hover:text-[#3b4a54]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#3b4a54] mb-1">Question</label>
                        <input
                            type="text"
                            className="w-full border border-[#e9edef] rounded px-3 py-2 focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-white"
                            placeholder="e.g. How do I reset my password?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-[#3b4a54]">Answer</label>
                            <button
                                type="button"
                                onClick={onGenerate}
                                disabled={!question || isGenerating}
                                className="text-xs flex items-center gap-1 text-[#1ca0b5] hover:underline disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Thinking...</span>
                                ) : (
                                    <>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8h2c0-.664.47-1.14 1.333-1.14.863 0 1.333.476 1.333 1.14 0 .648-.38 1.02-1.043 1.535l-.044.033c-1.135.875-2.246 1.733-2.246 3.109v.784h2v-.785c0-.664.47-1.14 1.333-1.14.863 0 1.333.476 1.333 1.14 0 .649-.38 1.02-1.043 1.535l-.045.035c-1.134.873-2.244 1.73-2.244 3.106v.783h2v-.783c0-1.293 1.077-2.129 2.196-2.99l.046-.036c1.233-.96 2.425-1.889 2.425-3.414 0-2.318-1.785-3.417-3.667-3.417A3.714 3.714 0 0011 5.092V5z" clipRule="evenodd" /></svg>
                                        Draft with AI
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            rows={4}
                            className="w-full border border-[#e9edef] rounded px-3 py-2 focus:ring-2 focus:ring-[#1ca0b5] outline-none bg-white"
                            placeholder="The bot's response..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                </div>
                <div className="bg-[#f0f2f5] px-6 py-4 flex justify-end gap-3 border-t border-[#e9edef]">
                    <button onClick={onClose} className="px-4 py-2 text-[#54656f] hover:text-[#3b4a54] font-medium border border-[#d1d7db] rounded bg-white">Cancel</button>
                    <button onClick={onSave} className="px-4 py-2 bg-[#1ca0b5] hover:bg-primary/80 text-white rounded font-medium shadow-sm">Save Item</button>
                </div>
            </div>
        </div>
    );
};
