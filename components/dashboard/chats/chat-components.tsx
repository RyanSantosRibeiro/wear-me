import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Message, ConversationStatus, TeamMember } from '../../types';
import { formatChatDate } from '@/utils/helpers';
import { Contact } from '@/lib/types';

// --- SIDEBAR (CHAT LIST) ---
interface SidebarProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    filter: ConversationStatus | 'all';
    onFilterChange: (f: ConversationStatus | 'all') => void;
    teamMembers: TeamMember[]; // For checking names
    contactMap: Map<string, any>;
}

export const InboxSidebar: React.FC<SidebarProps> = ({ conversations, selectedId, onSelect, filter, onFilterChange, teamMembers, contactMap }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusBadge = (status: ConversationStatus) => {
        switch (status) {
            case 'bot': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#f0f2f5] text-[#54656f] border border-[#d1d7db]">Bot</span>;
            case 'waiting': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#fff5c4] text-[#856404] border border-[#ffeeba]">Waiting</span>;
            case 'in_progress': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#d9fdd3] text-[#111b21] border border-[#c0eec0]">Open</span>;
            case 'closed': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#e9edef] text-[#667781] border border-[#d1d7db]">Closed</span>;
        }
    };

    const getAssignedAgentName = (agentId?: string) => {
        if (!agentId) return null;
        const agent = teamMembers.find(m => m.id === agentId);
        return agent ? agent.profiles.full_name : 'Unknown';
    };

    // Filter by search query (Phone or Name)
    const filteredConversations = conversations.filter(c => {
        if (!searchQuery) return true;
        console.log({ c });
        const lowerQuery = searchQuery.toLowerCase();
        const matchPhone = c?.idNumber?.toLowerCase().includes(lowerQuery);
        const matchName = c?.name?.toLowerCase().includes(lowerQuery);
        return matchPhone || matchName;
    });

    return (
        <div className="w-96 border-r border-[#e9edef] bg-white flex flex-col h-full z-10">
            {/* Header */}
            <div className="h-16 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between px-4 shrink-0">
                <h2 className="text-xl font-bold text-[#41525d]">Chats</h2>
                <div className="flex gap-2">
                    <button title="New Chat" className="text-[#54656f]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                    </button>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="p-2 border-b border-[#e9edef] bg-white">
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-[#54656f]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#f0f2f5] text-[#111b21] text-sm rounded-lg block w-full pl-10 p-2 outline-none focus:ring-1 focus:ring-[#1ca0b5] transition-all"
                        placeholder="Search name or phone..."
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['all', 'waiting', 'bot', 'in_progress', 'closed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f as any)}
                            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors capitalize ${filter === f ? 'bg-primary/5 text-[#008069]' : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'}`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conv => {
                    const contact = contactMap.get(conv.idNumber);
                    if (!contact) return null;
                    return (
                        (
                            <div
                                key={conv.id}
                                onClick={() => onSelect(conv.id)}
                                className={`flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors border-b border-[#f0f2f5] ${selectedId === conv.id ? 'bg-[#f0f2f5]' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-[#dfe3e5] flex items-center justify-center shrink-0 mr-3">
                                    {/* Initials if name exists, otherwise generic icon */}
                                    {conv.name ? (
                                        <span className="font-bold text-[#54656f]">{conv.name.charAt(0)}</span>
                                    ) : (
                                        <svg className="w-6 h-6 text-[#fff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium text-[#111b21] truncate text-base">
                                            {conv.name || conv.customer_phone}
                                        </span>
                                        <span className="text-xs text-[#667781]">{formatChatDate(conv?.lastMessage?.timestamp)}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-1">
                                        <p className="text-sm text-[#3b4a54] truncate mr-2 flex-1">
                                            {conv.lastMessage && <span className="text-xs text-[#667781] mr-1 block sm:inline">{conv.lastMessage.body}</span>}
                                        </p>
                                        {getStatusBadge(contact.status)}
                                        {contact?.assigned_member_id && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#e9edef] text-[#667781] border border-[#d1d7db]">{getAssignedAgentName(contact?.assigned_member_id)}</span>}
                                        {conv.unreadCount > 0 && (
                                            <span className="text-xs  ml-1 bg-primary text-white px-2 py-1 rounded-2xl">{conv.unreadCount}</span>
                                        )}
                                    </div>
                                    {conv.assigned_to && (
                                        <div className="mt-1 text-[10px] text-[#54656f] flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                            {getAssignedAgentName(conv.assigned_to)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )
                })}
                {filteredConversations.length === 0 && (
                    <div className="p-8 text-center text-[#8696a0] text-sm">
                        No conversations found.
                    </div>
                )}
            </div>
        </div>
    );
};


// --- CHAT WINDOW ---
interface ChatWindowProps {
    conversation: Conversation;
    messages: Message[];
    input: string;
    setInput: (s: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onStatusChange: (s: ConversationStatus) => void;
    onAssignClick: () => void;
    isAdmin: boolean;
    teamMembers: TeamMember[];
    isAttachMenuOpen: boolean;
    setIsAttachMenuOpen: (b: boolean) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => void;
    contact: Contact;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    conversation, messages, input, setInput, onSendMessage, onStatusChange, onAssignClick, isAdmin, teamMembers,
    isAttachMenuOpen, setIsAttachMenuOpen, onFileUpload, contact
}) => {
    console.log({ contact });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getAssignedAgentName = (agentId?: string) => {
        console.log({ agentId });
        if (!agentId) return null;
        const agent = teamMembers.find(m => m.id === agentId);
        return agent ? agent?.profiles?.full_name : 'Unknown Agent';
    };
    return (
        <div className="flex-1 flex flex-col h-full relative whatsapp-bg">
            {/* Header */}
            <div className="h-16 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between px-4 py-2 shrink-0 z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#dfe3e5] flex items-center justify-center mr-3">
                        {/* Dynamic Icon/Initials */}
                        {conversation.name ? (
                            <span className="font-bold text-[#54656f] text-lg">{conversation.name.charAt(0)}</span>
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-[#111b21]">{conversation.name || conversation.customer_phone}</h3>
                        <div className="flex flex-col">
                            {/* juntar em um array separado por virgula , limitar a 5 items e adicionar ... se houver mais */}
                            {conversation.isGroup && (
                                <span className="text-xs text-[#667781]">{conversation.groupMetadata.participants.map((p: any) => p.id.user).slice(0, 5).join(', ') + (conversation.groupMetadata.participants.length > 5 ? '...' : '')}</span>
                            )}
                            {contact?.assigned_member_id && (
                                <span className="text-[10px] text-[#1ca0b5] font-medium">
                                    Assigned to: {getAssignedAgentName(contact.assigned_member_id)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* ADMIN ONLY: Assign Button */}
                    {isAdmin && conversation.status !== 'closed' && (
                        <button
                            onClick={onAssignClick}
                            className="cursor-pointer px-3 py-1.5 bg-white hover:bg-[#f0f2f5] text-[#54656f] text-sm rounded border border-[#d1d7db] flex items-center gap-1"
                            title="Assign to Agent"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6h-3.17L17 5H7l-.83 1H3v13h18V6zm-2 11H5v-9h14v9zM12 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 8H8v-.57c0-.81.48-1.53 1.22-1.85.85-.37 1.79-.58 2.78-.58s1.93.21 2.78.58c.74.32 1.22 1.04 1.22 1.85V17z" /></svg>
                            <span className="hidden lg:inline">{contact?.bot_stage == "assigned" ? "Reassign" : "Assign"}</span>
                        </button>
                    )}

                    {conversation.status === 'bot' && (
                        <button
                            onClick={() => onStatusChange('in_progress')}
                            className="cursor-pointer px-3 py-1.5 bg-[#008069] hover:bg-[#1ca0b5] text-white text-sm rounded shadow-sm"
                        >
                            Take Over
                        </button>
                    )}
                    {conversation.status !== 'closed' && (
                        <button
                            onClick={() => onStatusChange('closed')}
                            className="cursor-pointer px-3 py-1.5 bg-[#e9edef] hover:bg-[#d1d7db] text-[#54656f] text-sm rounded shadow-sm"
                        >
                            Close
                        </button>
                    )}
                    {conversation.status === 'in_progress' && (
                        <button
                            onClick={() => onStatusChange('bot')}
                            className="cursor-pointer px-3 py-1.5 bg-white hover:bg-[#f0f2f5] text-[#54656f] text-sm rounded border border-[#d1d7db]"
                        >
                            Bot
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 lg:px-16 bg-[#efeae2]" onClick={() => setIsAttachMenuOpen(false)}>
                {messages.map(msg => {
                    const isMe = msg.sender_type === 'agent' || msg?.fromMe;
                    const isBot = msg.sender_type === 'bot';
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[80%] lg:max-w-[60%] rounded-lg shadow-sm whitespace-pre-wrap text-sm ${isMe
                                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                                : 'bg-white text-[#111b21] rounded-tl-none'
                                }`}>

                                <div className={`p-2  ${msg.message_type === 'image' ? 'p-1 pb-0' : ''}`}>
                                    {isBot && <div className="text-[10px] font-bold text-[#008069] mb-1 uppercase tracking-wide">
                                        🤖 Auto-Reply
                                    </div>}

                                    {msg.message_type === 'image' && msg.file_url && (
                                        <div className="mb-1 rounded overflow-hidden max-w-sm">
                                            <img src={msg.file_url} alt="Shared photo" className="w-full h-auto max-h-80 object-cover" />
                                        </div>
                                    )}

                                    {msg.message_type === 'document' && (
                                        <div className="flex items-center gap-3 bg-black/5 p-3 rounded mb-1 min-w-[200px]">
                                            <div className="bg-[#f0f2f5] p-2 rounded">
                                                <svg className="w-6 h-6 text-[#ff5252]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                            </div>
                                            <span className="font-medium truncate flex-1">{msg.file_name || 'Document'}</span>
                                        </div>
                                    )}

                                    <span className="mr-13">{msg.content || msg.body}</span>
                                </div>

                                <div className="text-[10px] text-[#667781] absolute bottom-1 right-2 flex items-center gap-1">
                                    {new Date(msg?.created_at || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        <svg className="w-3 h-3 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88 5.79 7.321a.365.365 0 0 0-.464.043l-.41.41a.362.362 0 0 0 .026.54l3.52 3.065a.362.362 0 0 0 .493-.016l5.989-7.558a.363.363 0 0 0 .066-.489zM6.15 7.76l1.373 1.196-.289.348a.363.363 0 0 1-.493.016l-3.52-3.064a.362.362 0 0 1-.026-.54l.41-.41a.365.365 0 0 1 .464-.043l2.081 1.497zm-.429-3.235l2.453-2.028a.362.362 0 0 1 .49-.016l.488.423a.366.366 0 0 1 .054.492L6.108 7.08 5.72 6.742z" /></svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] px-4 py-2 border-t border-[#d1d7db] flex items-center gap-2 relative">

                {isAttachMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsAttachMenuOpen(false)}></div>

                        <div className="absolute bottom-16 left-2 z-50 flex flex-col gap-2 animate-[scaleIn_0.15s_ease-out] origin-bottom-left">
                            <div className="flex flex-col gap-3 bg-transparent">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-12 h-12 rounded-full bg-gradient-to-t from-purple-600 to-purple-500 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform group relative"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                    <span className="absolute left-14 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Document</span>
                                </button>

                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="w-12 h-12 rounded-full bg-gradient-to-t from-blue-600 to-blue-500 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform group relative"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                                    <span className="absolute left-14 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Photos & Videos</span>
                                </button>

                                <button
                                    onClick={() => alert('Camera access not supported in this demo')}
                                    className="w-12 h-12 rounded-full bg-gradient-to-t from-rose-600 to-rose-500 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform group relative"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
                                    <span className="absolute left-14 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Camera</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <input type="file" ref={fileInputRef} onChange={(e) => onFileUpload(e, 'document')} className="hidden" />
                <input type="file" ref={imageInputRef} onChange={(e) => onFileUpload(e, 'image')} accept="image/*" className="hidden" />

                <button
                    onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                    className={`text-[#54656f] p-2 rounded-full transition-all ${isAttachMenuOpen ? 'bg-[#d9dbdd] rotate-45' : 'hover:bg-[#e9edef]'}`}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                </button>

                <form onSubmit={onSendMessage} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-white border border-white rounded-lg px-4 py-2 text-[#111b21] focus:outline-none placeholder:text-[#667781]"
                        placeholder="Type a message"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={conversation.status === 'closed'}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || conversation.status === 'closed'}
                        className="text-[#54656f] p-2 hover:bg-[#e9edef] rounded-full disabled:opacity-50"
                    >
                        <svg className="w-6 h-6 text-[#54656f]" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- EMPTY STATE ---
export const InboxEmptyState: React.FC = () => (
    <div className="flex-1 flex flex-col items-center justify-center border-b-[6px] border-[#43cba8]">
        <div className="max-w-[460px] text-center">
            <h1 className="text-[#41525d] text-3xl font-light mb-4">CMS | we.digi</h1>
            <p className="text-[#667781] text-sm">
                Send and receive messages without keeping your phone online. <br />
                Use the bot to handle common questions.
            </p>
        </div>
    </div>
);

// --- ASSIGN MODAL ---
interface AssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamMembers: TeamMember[];
    onAssign: (id: string) => void;
    currentAssignedId?: string;
}

export const AssignAgentModal: React.FC<AssignModalProps> = ({ isOpen, onClose, teamMembers, onAssign, currentAssignedId }) => {
    if (!isOpen) return null;
    console.log(teamMembers);
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e9edef] flex justify-between items-center bg-[#f0f2f5]">
                    <h3 className="font-bold text-[#111b21]">Assign Conversation</h3>
                    <button onClick={onClose} className="text-[#54656f] hover:text-[#3b4a54]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {teamMembers.length > 0 ? (
                        <ul className="divide-y divide-[#e9edef]">
                            {teamMembers.map(member => (
                                <li
                                    key={member.id}
                                    onClick={() => onAssign(member.id)}
                                    className="px-4 py-3 hover:bg-[#f5f6f6] cursor-pointer flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#dfe3e5] flex items-center justify-center font-bold text-[#54656f] text-xs">
                                        {member?.profiles?.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-[#111b21]">{member?.profiles?.full_name}</div>
                                        <div className="text-xs text-[#667781] capitalize">{member.role}</div>
                                    </div>
                                    {currentAssignedId === member.id && (
                                        <div className="ml-auto text-[#1ca0b5] text-xs font-bold">CURRENT</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-[#667781] text-sm">
                            No team members found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
