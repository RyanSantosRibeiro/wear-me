"use client"

import type React from "react"

import { useEffect, useState, useTransition } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { updateContactStatus } from "@/actions/contacts"
import { Phone, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"

type Contact = {
  id: string
  created_at: string
  company_id: string
  customer_number: string
  name: string
  assigned_member_id: string | null
  bot_stage: string | null
  status: string
}

type Column = {
  id: string
  title: string
  color: string
}

const COLUMNS: Column[] = [
  { id: "bot", title: "Bot", color: "bg-blue-500" },
  { id: "in_progress", title: "Em Progresso", color: "bg-yellow-500" },
  { id: "completed", title: "Concluído", color: "bg-green-500" },
  { id: "archived", title: "Arquivado", color: "bg-gray-500" },
]

export function ContactsKanban() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [draggedContact, setDraggedContact] = useState<Contact | null>(null)
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  useEffect(() => {
    loadContacts()

    // Subscribe to changes
    const channel = supabase
      .channel("contacts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contacts",
        },
        () => {
          loadContacts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadContacts() {
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setContacts(data)
    }
  }

  function handleDragStart(contact: Contact) {
    setDraggedContact(contact)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(columnId: string) {
    if (!draggedContact) return

    startTransition(async () => {
      const result = await updateContactStatus(draggedContact.id, columnId)

      if (result.success) {
        setContacts((prev) => prev.map((c) => (c.id === draggedContact.id ? { ...c, status: columnId } : c)))
      }

      setDraggedContact(null)
    })
  }

  function getContactsByStatus(status: string) {
    return contacts.filter((c) => c.status === status)
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className="flex w-80 shrink-0 flex-col gap-3"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${column.color}`} />
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="ml-auto">
              {getContactsByStatus(column.id).length}
            </Badge>
          </div>

          {/* Column Content */}
          <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 min-h-[200px]">
            {getContactsByStatus(column.id).map((contact) => (
              <ContactCard key={contact.id} contact={contact} onDragStart={handleDragStart} />
            ))}

            {getContactsByStatus(column.id).length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground text-sm">
                Nenhum contato
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactCard({
  contact,
  onDragStart,
}: {
  contact: Contact
  onDragStart: (contact: Contact) => void
}) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(contact)}
      className="cursor-move p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {contact.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-medium leading-none">{contact.name}</h4>
            <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
              <Phone className="h-3 w-3" />
              <span>{contact.customer_number}</span>
            </div>
          </div>

          {contact.bot_stage && (
            <Badge variant="outline" className="text-xs">
              {contact.bot_stage}
            </Badge>
          )}

          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(contact.created_at), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
