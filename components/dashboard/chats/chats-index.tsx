"use client"
import React, { useState, useEffect } from 'react';
import { Conversation, Message, ConversationStatus, AuthSession, TeamMember } from '../types';
import { AssignAgentModal, ChatWindow, InboxEmptyState, InboxSidebar } from './chat-components';
import { getConversations, getMessages, sendMessage } from '@/utils/CMS | we.digi/queries';
import QrScanner from './chat-qrscanner';
import { assignContactToAgent } from '@/actions/supabase';

interface InboxProps {
  teamMembers: TeamMember[];
  user: AuthSession;
  accessToken: string;
  contactMap: any;
  whatsappSession: any;
  filterByMenu?: {
    id: string;
    label: string;
    target_agent_id: string;
  };
}

const ChatIndex: React.FC<InboxProps> = ({ teamMembers, user, accessToken, contactMap, whatsappSession, filterByMenu }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<ConversationStatus | 'all'>('all');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(whatsappSession?.status || 'pending');


  // --- ATTACHMENT STATE ---
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);

  // --- ASSIGNMENT STATE ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const isAdmin = teamMembers.find(m => m.user_id === user.id)?.role === 'admin' || teamMembers.find(m => m.user_id === user.id)?.role === 'owner';


  // Load conversations and team members
  useEffect(() => {
    if (whatsappSession.status === 'ready') {
      handleConnect();
    }
  }, [whatsappSession]);

  // update info
  const updateInfo = async () => {
    const data = await getConversations(accessToken);
    console.log(data);
    setStatus(data?.status);
    if (data) {
      setConversations(data);
    }
  }


  const handleConnect = async () => {
    // get chats
    const data = await getConversations(accessToken);
    console.log(data);
    setStatus(data?.status);
    if (data) {
      setConversations(data);
    }
  }


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedId) return;

    const data = await sendMessage(accessToken, selectedId, input);
    console.log(data);

    const newMessage: Message = {
      id: Date.now().toString(),
      conversation_id: selectedId,
      sender_type: 'agent',
      content: input,
      message_type: 'text',
      created_at: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setInput('');
    updateLastMessage(selectedId, input);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    if (!selectedId || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);

    const newMessage: Message = {
      id: Date.now().toString(),
      conversation_id: selectedId,
      sender_type: 'agent',
      content: type === 'image' ? '📷 Photo' : '📄 Document',
      message_type: type,
      file_url: objectUrl,
      file_name: file.name,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setIsAttachMenuOpen(false);
    updateLastMessage(selectedId, type === 'image' ? '📷 Photo' : '📄 Document');

    e.target.value = '';
  };

  const updateLastMessage = (convId: string, previewText: string) => {
    setConversations(prev => prev.map(c =>
      c.id === convId
        ? { ...c, last_message_preview: previewText, last_message_at: new Date().toISOString() }
        : c
    ));
  };

  const handleStatusChange = (newStatus: ConversationStatus) => {
    if (!selectedId) return;
    setConversations(prev => prev.map(c =>
      c.id === selectedId ? { ...c, status: newStatus } : c
    ));
  };

  const handleAssignAgent = async (agentId: string) => {
    if (!selectedId) return;
    const agent = teamMembers.find(m => m.id === agentId);
    if (!agent) return;

    // assign contact to agent
    await assignContactToAgent(selectedId, agentId);

    setIsAssignModalOpen(false);

  };


  // --- FILTER CONVERSATIONS ---
  // caso o filtro seja 'all', deve mostrar todas as conversas que não estejam fechadas
  //  caso o filtro seja 'bot', deve mostrar to
  // caso o filtro seja 'in_progress', deve mostrar todas as conversas que estejam em andamento
  // caso o filtro seja 'closed', deve mostrar todas as conversas que estejam fechadas
  const filteredConversations = conversations?.filter(c => {
    const contact = contactMap.get(c.idNumber);
    if (!contact) return false;

    // adicionar contect ao c
    if (filterByMenu) {
      return contact.assigned_member_id === filterByMenu.target_agent_id;
    }
    if (filter === 'all') return c;
    return contact.status === filter;
  });

  const selectedConversation = conversations?.find(c => c.id === selectedId);

  return (
    <div className="flex h-full w-full bg-white relative">

      {status === 'pending' ? (
        <div className="flex-1 absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-40">
          <QrScanner onConnect={handleConnect} status={status} sessionId={whatsappSession?.sessionId} accessToken={accessToken} setStatus={setStatus} />
        </div>
      ) : <></>
      }

      {/* When session.qr is null or session.status is 'pending' */}
      <InboxSidebar
        contactMap={contactMap}
        conversations={filteredConversations}
        selectedId={selectedId}
        onSelect={async (id) => {
          setSelectedId(id);
          const msgs = await getMessages(accessToken, id);
          setMessages(msgs);
          console.log(msgs);
        }}
        filter={filter}
        onFilterChange={setFilter}
        teamMembers={teamMembers}
      />

      {selectedId && selectedConversation ? (
        <ChatWindow
          contact={contactMap.get(selectedConversation.idNumber)}
          conversation={selectedConversation}
          messages={messages || []}
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          onStatusChange={handleStatusChange}
          onAssignClick={() => setIsAssignModalOpen(true)}
          isAdmin={isAdmin}
          teamMembers={teamMembers}
          isAttachMenuOpen={isAttachMenuOpen}
          setIsAttachMenuOpen={setIsAttachMenuOpen}
          onFileUpload={handleFileUpload}
        />
      ) : (
        <InboxEmptyState />
      )}

      <AssignAgentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        teamMembers={teamMembers}
        onAssign={handleAssignAgent}
        currentAssignedId={selectedConversation?.assigned_to}
      />
    </div>
  );
};

export default ChatIndex;
