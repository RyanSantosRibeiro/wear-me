"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { BotConfigEditor, BotPreview, type KnowledgeItem } from "./knowledges-card"
import type { BotConfig, BotFlowConfig } from "@/lib/types"
import { updateBotConfig } from "@/actions/supabase"
import { MenuBuilder } from "./menu-builder"

export default function KnowledgeIndex({
  botConfigs,
  teamMembersData,
}: { botConfigs: BotConfig; teamMembersData: any }) {
  // --- Q&A STATE ---
  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      question: "What are your opening hours?",
      answer: "We are open Monday to Friday from 9 AM to 6 PM.",
      is_active: true,
    },
    {
      id: "2",
      question: "Do you offer refunds?",
      answer: "Yes, we offer refunds within 30 days of purchase.",
      is_active: true,
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // --- CONFIG STATE ---
  const [botConfig, setBotConfig] = useState<BotConfig | null>(botConfigs)
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)

  // --- MENU BUILDER STATE ---
  const [menuFlowConfig, setMenuFlowConfig] = useState<BotFlowConfig>(
    botConfigs?.menu_options && typeof botConfigs.menu_options === "object" && "nodes" in botConfigs.menu_options
      ? botConfigs.menu_options
      : {
          type: "manual",
          start_node: "welcome",
          nodes: {
            welcome: {
              type: "menu",
              message: "Oi, tudo bem? Escolha uma opção:",
              options: [],
            },
          },
        },
  )

  // fuctions
  // --- Q&A HANDLERS ---
  const handleGenerateAI = async () => {
    if (!newQuestion) return
    setIsGenerating(true)
    // const generated = await generateKnowledgeBaseAnswer(newQuestion, "A subscription based software company.");
    setNewAnswer("This is a generated answer")
    setIsGenerating(false)
  }

  const handleSaveQA = () => {
    if (!newQuestion || !newAnswer) return
    setItems([...items, { id: Date.now().toString(), question: newQuestion, answer: newAnswer, is_active: true }])
    closeQAModal()
  }

  const closeQAModal = () => {
    setIsModalOpen(false)
    setNewQuestion("")
    setNewAnswer("")
  }

  // --- CONFIG HANDLERS ---
  const handleUpdateWelcome = (text: string) => {
    console.log({ botConfig })
    if (botConfig) setBotConfig({ ...botConfig, welcome_message: text })
  }

  const handleAddMenuOption = () => {
    if (!botConfig) return
    const newOption = {
      id: Date.now().toString(),
      label: "Nova Opção",
      target_agent_id: "",
    }
    setBotConfig({ ...botConfig, menu_options: [...botConfig.menu_options, newOption] })
  }

  const handleUpdateMenuOption = (id: string, field: any, value: string) => {
    if (!botConfig) return
    const updatedOptions = botConfig?.menu_options?.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    setBotConfig({ ...botConfig, menu_options: updatedOptions })
  }

  const handleDeleteMenuOption = (id: string) => {
    if (!botConfig) return
    setBotConfig({ ...botConfig, menu_options: botConfig?.menu_options?.filter((o) => o.id !== id) })
  }

  const handleSaveConfig = async () => {
    if (!botConfig) return
    setSavingConfig(true)
    await updateBotConfig(botConfig.company_id, {
      welcome_message: botConfig.welcome_message,
      menu_options: botConfig.menu_options,
    })
    setSavingConfig(false)
  }

  // --- MENU BUILDER HANDLERS ---
  const handleSaveMenuFlow = async (flow: BotFlowConfig) => {
    if (!botConfig) return
    setSavingConfig(true)
    await updateBotConfig(botConfig.company_id, {
      welcome_message: botConfig.welcome_message,
      menu_options: flow,
    })
    setMenuFlowConfig(flow)
    setSavingConfig(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conhecimentos</h1>
        <p className="text-muted-foreground">Gerencie as informações do seu bot</p>
      </div>

      <Tabs defaultValue="menu-builder" className="">
        <TabsList>
          <TabsTrigger value="menu-builder">Menu Multinível</TabsTrigger>
          {/* <TabsTrigger value="profile">Menu Simples (Legado)</TabsTrigger> */}
          <TabsTrigger value="security">Base de Conhecimento</TabsTrigger>
        </TabsList>

        <TabsContent value="menu-builder" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <MenuBuilder
                initialConfig={menuFlowConfig}
                teamMembers={teamMembers}
                onSave={handleSaveMenuFlow}
                saving={savingConfig}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <BotConfigEditor
                  config={botConfig}
                  teamMembers={teamMembers}
                  onUpdateWelcome={handleUpdateWelcome}
                  onAddOption={handleAddMenuOption}
                  onUpdateOption={handleUpdateMenuOption}
                  onDeleteOption={handleDeleteMenuOption}
                  onSave={handleSaveConfig}
                  saving={savingConfig}
                />
                <BotPreview config={botConfig} teamMembers={teamMembers} />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent>{/* <SecuritySettings /> */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
