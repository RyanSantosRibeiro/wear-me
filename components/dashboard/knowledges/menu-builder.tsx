"use client"

import { useEffect } from "react"

import type React from "react"

import type { BotFlowConfig, BotNode, BotMenuOption } from "@/lib/types"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, Save, Eye, ChevronRight, MenuIcon, MessageSquare, ArrowLeft } from "lucide-react"

interface MenuBuilderProps {
  initialConfig: BotFlowConfig
  teamMembers: any[]
  onSave: (config: BotFlowConfig) => void
  saving: boolean
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({ initialConfig, teamMembers, onSave, saving }) => {
  const [config, setConfig] = useState<BotFlowConfig>(initialConfig)
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialConfig.start_node)
  const [previewMode, setPreviewMode] = useState(false)

  // Add new node
  const addNode = (type: "menu" | "message") => {
    const nodeId = `node_${Date.now()}`
    const newNode: BotNode = {
      type,
      message: type === "message" ? "Nova mensagem..." : "Escolha uma opção:",
      ...(type === "menu" ? { options: [] } : { next: config.start_node }),
    }

    setConfig({
      ...config,
      nodes: { ...config.nodes, [nodeId]: newNode },
    })
    setSelectedNodeId(nodeId)
  }

  // Update node
  const updateNode = (nodeId: string, updates: Partial<BotNode>) => {
    setConfig({
      ...config,
      nodes: {
        ...config.nodes,
        [nodeId]: { ...config.nodes[nodeId], ...updates },
      },
    })
  }

  // Delete node
  const deleteNode = (nodeId: string) => {
    if (nodeId === config.start_node) {
      alert("Cannot delete the start node")
      return
    }

    const newNodes = { ...config.nodes }
    delete newNodes[nodeId]

    // Remove references to this node
    Object.keys(newNodes).forEach((id) => {
      const node = newNodes[id]
      if (node.next === nodeId) {
        node.next = undefined
      }
      if (node.options) {
        node.options = node.options.filter((opt) => opt.next !== nodeId)
      }
    })

    setConfig({ ...config, nodes: newNodes })
    setSelectedNodeId(config.start_node)
  }

  // Add option to menu node
  const addOption = (nodeId: string) => {
    const node = config.nodes[nodeId]
    if (node.type !== "menu") return

    const newOption: BotMenuOption = {
      key: String((node.options?.length || 0) + 1),
      label: "Nova Opção",
      next: config.start_node,
    }

    updateNode(nodeId, {
      options: [...(node.options || []), newOption],
    })
  }

  // Update option
  const updateOption = (nodeId: string, optionIndex: number, updates: Partial<BotMenuOption>) => {
    const node = config.nodes[nodeId]
    if (!node.options) return

    const newOptions = [...node.options]
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates }

    updateNode(nodeId, { options: newOptions })
  }

  // Delete option
  const deleteOption = (nodeId: string, optionIndex: number) => {
    const node = config.nodes[nodeId]
    if (!node.options) return

    const newOptions = node.options.filter((_, i) => i !== optionIndex)
    updateNode(nodeId, { options: newOptions })
  }

  const selectedNode = config.nodes[selectedNodeId]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Multinível Interativo</h2>
          <p className="text-muted-foreground">Construa fluxos de conversação complexos</p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Editor" : "Preview"}
          </Button> */}
          <Button onClick={() => onSave(config)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <MenuPreview config={config} teamMembers={teamMembers} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Node List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Nós do Fluxo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 mb-4">
                <Button onClick={() => addNode("menu")} size="sm" className="flex-1">
                  <MenuIcon className="w-4 h-4 mr-1" />
                  Menu
                </Button>
                <Button onClick={() => addNode("message")} size="sm" className="flex-1" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Mensagem
                </Button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {Object.entries(config.nodes).map(([nodeId, node]) => (
                  <div
                    key={nodeId}
                    onClick={() => setSelectedNodeId(nodeId)}
                    className={`p-3 rounded border cursor-pointer transition-all ${selectedNodeId === nodeId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {node.type === "menu" ? (
                            <MenuIcon className="w-4 h-4 text-primary" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="font-mono text-xs text-muted-foreground">{nodeId}</span>
                        </div>
                        <p className="text-sm mt-1 line-clamp-2">{node.message}</p>
                        {nodeId === config.start_node && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            Início
                          </span>
                        )}
                      </div>
                      {nodeId !== config.start_node && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNode(nodeId)
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Node Editor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Editar Nó: {selectedNodeId}</span>
                {selectedNodeId === config.start_node && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Nó Inicial</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedNode && (
                <>
                  {/* Node Message */}
                  <div>
                    <Label>Mensagem</Label>
                    <Textarea
                      value={selectedNode.message || ""}
                      onChange={(e) => updateNode(selectedNodeId, { message: e.target.value })}
                      placeholder="Digite a mensagem que será exibida..."
                      rows={3}
                    />
                  </div>

                  {/* Menu Options */}
                  {selectedNode.type === "menu" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Opções do Menu</Label>
                        <Button onClick={() => addOption(selectedNodeId)} size="sm" variant="outline">
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Adicionar Opção
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {selectedNode.options?.map((option, index) => (
                          <Card key={index} className="border-2">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-primary">#{option.key}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteOption(selectedNodeId, index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div>
                                <Label>Chave (Key)</Label>
                                <Input
                                  value={option.key}
                                  onChange={(e) => updateOption(selectedNodeId, index, { key: e.target.value })}
                                  placeholder="1, 2, 3..."
                                />
                              </div>

                              <div>
                                <Label>Label (Texto do Botão)</Label>
                                <Input
                                  value={option.label}
                                  onChange={(e) => updateOption(selectedNodeId, index, { label: e.target.value })}
                                  placeholder="Ex: Horários, Agendar..."
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`collect-${selectedNodeId}-${index}`}
                                    checked={option.collect_data?.enabled || false}
                                    onChange={(e) => {
                                      updateOption(selectedNodeId, index, {
                                        collect_data: {
                                          enabled: e.target.checked,
                                          field_name: option.collect_data?.field_name || "data",
                                        },
                                      })
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <Label htmlFor={`collect-${selectedNodeId}-${index}`} className="cursor-pointer">
                                    Coletar resposta do usuário
                                  </Label>
                                </div>

                                {/* {option.collect_data?.enabled && (
                                  <div>
                                    <Label className="text-xs">Nome do campo (será enviado no payload)</Label>
                                    <Input
                                      value={option.collect_data?.field_name || ""}
                                      onChange={(e) =>
                                        updateOption(selectedNodeId, index, {
                                          collect_data: {
                                            enabled: true,
                                            field_name: e.target.value,
                                          },
                                        })
                                      }
                                      placeholder="Ex: servico, horario_preferido"
                                      className="text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Quando o usuário selecionar esta opção, o valor será salvo como{" "}
                                      <code className="bg-muted px-1 rounded">
                                        {option.collect_data?.field_name || "campo"}
                                      </code>
                                    </p>
                                  </div>
                                )} */}
                              </div>

                              <div>
                                <Label>Próximo Nó</Label>
                                <select
                                  className="w-full border rounded px-3 py-2"
                                  value={option.next || ""}
                                  onChange={(e) => updateOption(selectedNodeId, index, { next: e.target.value })}
                                >
                                  <option value="">-- Selecione --</option>
                                  {Object.keys(config.nodes).map((nodeId) => (
                                    <option key={nodeId} value={nodeId}>
                                      {nodeId} - {config.nodes[nodeId].message?.substring(0, 30)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <Label>Ação</Label>
                                <select
                                  className="w-full border rounded px-3 py-2"
                                  value={option.action || ""}
                                  onChange={(e) => {
                                    const action = e.target.value as any
                                    updateOption(selectedNodeId, index, {
                                      action: action || undefined,
                                      payload: action ? {} : undefined,
                                    })
                                  }}
                                >
                                  <option value="">Nenhuma</option>
                                  <option value="schedule">Agendar</option>
                                  <option value="assign_agent">Atribuir Agente</option>
                                  <option value="message">Mensagem</option>
                                  <option value="custom">Personalizada</option>
                                </select>
                              </div>

                              {/* Payload based on action */}
                              {option.action === "assign_agent" && (
                                <div>
                                  <Label>Agente</Label>
                                  <select
                                    className="w-full border rounded px-3 py-2"
                                    value={option.payload?.target_agent_id || ""}
                                    onChange={(e) =>
                                      updateOption(selectedNodeId, index, {
                                        payload: { ...option.payload, target_agent_id: e.target.value },
                                      })
                                    }
                                  >
                                    <option value="">-- Selecione um agente --</option>
                                    {teamMembers
                                      .filter((m) => m.status !== "pending")
                                      .map((member) => (
                                        <option key={member.id} value={member.id}>
                                          {member?.profiles?.full_name} ({member?.profiles?.role})
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              )}

                              {/* {option.action === "schedule" && (
                                <div>
                                  <Label>Serviço</Label>
                                  <Input
                                    value={option.payload?.service || ""}
                                    onChange={(e) =>
                                      updateOption(selectedNodeId, index, {
                                        payload: { ...option.payload, service: e.target.value },
                                      })
                                    }
                                    placeholder="Ex: cabelo, barba..."
                                  />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    💡 Os dados coletados ao longo do fluxo serão automaticamente incluídos no payload
                                    desta ação
                                  </p>
                                </div>
                              )} */}
                            </CardContent>
                          </Card>
                        ))}

                        {(!selectedNode.options || selectedNode.options.length === 0) && (
                          <p className="text-center text-muted-foreground py-4">Nenhuma opção adicionada ainda</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Next Node */}
                  {selectedNode.type === "message" && (
                    <div>
                      <Label>Próximo Nó (Opcional)</Label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedNode.next || ""}
                        onChange={(e) => updateNode(selectedNodeId, { next: e.target.value || undefined })}
                      >
                        <option value="">-- Fim do fluxo --</option>
                        {Object.keys(config.nodes)
                          .filter((id) => id !== selectedNodeId)
                          .map((nodeId) => (
                            <option key={nodeId} value={nodeId}>
                              {nodeId} - {config.nodes[nodeId].message?.substring(0, 30)}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Set as start node */}
                  {selectedNodeId !== config.start_node && (
                    <Button
                      onClick={() => setConfig({ ...config, start_node: selectedNodeId })}
                      variant="outline"
                      className="w-full"
                    >
                      Definir como Nó Inicial
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Preview Component
const MenuPreview: React.FC<{ config: BotFlowConfig; teamMembers: any[] }> = ({ config, teamMembers }) => {
  const [currentNodeId, setCurrentNodeId] = useState(config.start_node)
  const [history, setHistory] = useState<string[]>([])

  const currentNode = config.nodes[currentNodeId]

  const handleOptionClick = (option: BotMenuOption) => {
    if (option.next) {
      setHistory([...history, currentNodeId])
      setCurrentNodeId(option.next)
    }
  }

  const goBack = () => {
    if (history.length > 0) {
      const newHistory = [...history]
      const previousNode = newHistory.pop()!
      setHistory(newHistory)
      setCurrentNodeId(previousNode)
    }
  }

  const reset = () => {
    setCurrentNodeId(config.start_node)
    setHistory([])
  }

  if (!currentNode) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Nó não encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-[380px] bg-[#d1d7db] rounded-[30px] border-[8px] border-[#111b21] overflow-hidden shadow-2xl">
        {/* WhatsApp Header */}
        <div className="h-14 bg-[#008069] flex items-center px-4 text-white gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#008069]">
            <MenuIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Sua Empresa</div>
            <div className="text-[10px] opacity-80">Preview do Bot</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-[600px] bg-[#efeae2] p-4 overflow-y-auto relative">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 15h10v10H15zM55 55h10v10H55z' fill='%239ca3af' fillOpacity='0.2'/%3E%3C/svg%3E\")",
            }}
          ></div>

          <div className="relative z-10 space-y-3">
            {/* Bot Message */}
            <div className="bg-white rounded-lg p-3 shadow-sm text-sm text-[#111b21] rounded-tl-none max-w-[85%]">
              <div className="text-[10px] font-bold text-[#008069] mb-1">🤖 BOT</div>
              {currentNode.message}
              <div className="text-[10px] text-[#667781] text-right mt-1">
                {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            {/* Menu Options */}
            {currentNode.type === "menu" && currentNode.options && (
              <div className="space-y-2">
                {currentNode.options.map((option, index) => {
                  const agent = option.payload?.target_agent_id
                    ? teamMembers.find((m) => m.id === option.payload?.target_agent_id)
                    : null

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="w-full bg-white rounded-lg p-3 shadow-sm text-[#1ca0b5] text-center font-medium text-sm hover:bg-gray-50 transition-colors border border-transparent hover:border-[#1ca0b5]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-[#111b21]">{option.key}</span>
                        <span>{option.label}</span>
                        {option.next && <ChevronRight className="w-4 h-4" />}
                      </div>
                      {agent && <div className="text-xs text-muted-foreground mt-1">→ {agent.profiles?.full_name}</div>}
                      {option.action && <div className="text-xs text-blue-600 mt-1">⚡ {option.action}</div>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-4">
              {history.length > 0 && (
                <Button onClick={goBack} size="sm" variant="outline" className="flex-1 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              )}
              <Button onClick={reset} size="sm" variant="outline" className="flex-1 bg-transparent">
                Reiniciar
              </Button>
            </div>

            {/* Current Node Info */}
            <div className="mt-4 p-2 bg-black/10 rounded text-xs text-center">
              Nó atual: <span className="font-mono font-bold">{currentNodeId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewSimulator({ config }: { config: BotFlowConfig }) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(config.start_node)
  const [collectedData, setCollectedData] = useState<Record<string, string>>({})
  const [conversationHistory, setConversationHistory] = useState<Array<{ type: "bot" | "user"; message: string }>>([])

  const currentNode = config.nodes[currentNodeId]

  useEffect(() => {
    if (currentNode?.message) {
      setConversationHistory((prev) => [...prev, { type: "bot", message: currentNode.message || "" }])
    }
  }, [currentNodeId])

  const handleOptionClick = (option: BotMenuOption) => {
    // Add user response to history
    setConversationHistory((prev) => [...prev, { type: "user", message: option.label }])

    // Collect data if enabled
    if (option.collect_data?.enabled && option.collect_data.field_name) {
      setCollectedData((prev) => ({
        ...prev,
        [option.collect_data!.field_name]: option.label,
      }))
    }

    // Navigate to next node or trigger action
    if (option.action) {
      const finalPayload = { ...option.payload, ...collectedData }
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "bot",
          message: `✅ Ação "${option.action}" executada com payload: ${JSON.stringify(finalPayload, null, 2)}`,
        },
      ])
    } else if (option.next) {
      setCurrentNodeId(option.next)
    }
  }

  const resetPreview = () => {
    setCurrentNodeId(config.start_node)
    setCollectedData({})
    setConversationHistory([])
  }

  return (
    <div className="space-y-4">
      {/* Collected Data Display */}
      {Object.keys(collectedData).length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <p className="text-sm font-semibold text-blue-900 mb-2">📊 Dados Coletados:</p>
            <div className="space-y-1">
              {Object.entries(collectedData).map(([key, value]) => (
                <div key={key} className="text-xs text-blue-800">
                  <code className="bg-blue-100 px-1 rounded">{key}</code>: {value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp-like conversation */}
      <div className="bg-[#e5ddd5] p-4 rounded-lg space-y-2 max-h-96 overflow-y-auto">
        {conversationHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 ${msg.type === "bot" ? "bg-white text-gray-900" : "bg-[#dcf8c6] text-gray-900"
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        ))}

        {/* Current menu options */}
        {currentNode?.type === "menu" && currentNode.options && currentNode.options.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 space-y-2 max-w-[70%]">
              {currentNode.options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  variant="outline"
                  className="w-full justify-start text-left"
                  size="sm"
                >
                  {option.key}. {option.label}
                  {option.collect_data?.enabled && <span className="ml-2 text-xs text-blue-600">📝</span>}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={resetPreview} variant="outline" size="sm" className="w-full bg-transparent">
        🔄 Reiniciar Preview
      </Button>
    </div>
  )
}
