
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Users, Mail, Shield, Eye, Edit, Trash2, UserPlus, Info } from "lucide-react"

// Mock data - in a real app this would come from a backend
const mockCurrentUser = {
  id: 1,
  name: "Mario Rossi",
  email: "mario.rossi@email.com",
  role: "Proprietario" as const
}

const mockTeamMembers = [
  {
    id: 1,
    name: "Mario Rossi",
    email: "mario.rossi@email.com",
    role: "Proprietario" as const,
    status: "Attivo" as const
  },
  {
    id: 2,
    name: "Giulia Bianchi",
    email: "giulia.bianchi@email.com",
    role: "Editor" as const,
    status: "Attivo" as const
  },
  {
    id: 3,
    name: "Luca Verdi",
    email: "luca.verdi@email.com",
    role: "Visualizzatore" as const,
    status: "Invito in sospeso" as const
  }
]

type Role = "Proprietario" | "Editor" | "Visualizzatore"
type Status = "Attivo" | "Invito in sospeso"

interface TeamMember {
  id: number
  name: string
  email: string
  role: Role
  status: Status
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Editor" | "Visualizzatore">("Editor")
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newRole, setNewRole] = useState<Role>("Editor")
  const { toast } = useToast()

  const isOwner = mockCurrentUser.role === "Proprietario"
  const canInvite = teamMembers.length < 5 && isOwner
  const maxMembersReached = teamMembers.length >= 5

  const handleInviteMember = () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Errore",
        description: "Inserisci email e seleziona un ruolo",
        variant: "destructive"
      })
      return
    }

    if (teamMembers.length >= 5) {
      toast({
        title: "Limite raggiunto",
        description: "Limite massimo di 5 membri raggiunto",
        variant: "destructive"
      })
      return
    }

    // Check if email already exists
    if (teamMembers.some(member => member.email === inviteEmail)) {
      toast({
        title: "Errore",
        description: "Questo utente è già presente nel team",
        variant: "destructive"
      })
      return
    }

    const newMember: TeamMember = {
      id: Date.now(),
      name: "Nuovo Utente",
      email: inviteEmail,
      role: inviteRole,
      status: "Invito in sospeso"
    }

    setTeamMembers([...teamMembers, newMember])
    setInviteEmail("")
    setInviteRole("Editor")

    toast({
      title: "Invito inviato",
      description: `Invito inviato a ${inviteEmail}`,
    })
  }

  const handleRemoveMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId))
    toast({
      title: "Membro rimosso",
      description: "Il membro è stato rimosso dal team",
    })
  }

  const handleEditRole = (member: TeamMember) => {
    setEditingMember(member)
    setNewRole(member.role)
  }

  const handleSaveRole = () => {
    if (!editingMember) return

    setTeamMembers(teamMembers.map(member => 
      member.id === editingMember.id 
        ? { ...member, role: newRole }
        : member
    ))

    toast({
      title: "Ruolo aggiornato",
      description: `Ruolo di ${editingMember.name} aggiornato a ${newRole}`,
    })

    setEditingMember(null)
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "Proprietario": return <Shield className="w-4 h-4 text-electric-indigo" />
      case "Editor": return <Edit className="w-4 h-4 text-sky-blue" />
      case "Visualizzatore": return <Eye className="w-4 h-4 text-cool-teal" />
    }
  }

  const getStatusBadge = (status: Status) => {
    return (
      <Badge 
        variant={status === "Attivo" ? "default" : "secondary"}
        className={status === "Attivo" ? "bg-cool-teal text-white" : "bg-lavender-gray text-slate-gray"}
      >
        {status}
      </Badge>
    )
  }

  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-electric-indigo to-electric-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-1">Team</h1>
            <p className="text-slate-gray-600">Gestisci i membri del tuo team</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-electric-indigo-50 rounded-lg border border-electric-indigo-200">
          <Shield className="w-5 h-5 text-electric-indigo" />
          <span className="text-sm font-medium text-electric-indigo">
            Il tuo ruolo: {mockCurrentUser.role}
          </span>
        </div>
      </div>

      {/* Section 1: Team Members Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-slate-gray">Membri del team ({teamMembers.length}/5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-gray font-semibold">Nome</TableHead>
                  <TableHead className="text-slate-gray font-semibold">Email</TableHead>
                  <TableHead className="text-slate-gray font-semibold">Ruolo</TableHead>
                  <TableHead className="text-slate-gray font-semibold">Stato</TableHead>
                  {isOwner && <TableHead className="text-slate-gray font-semibold">Azioni</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-slate-gray">{member.name}</TableCell>
                    <TableCell className="text-slate-gray">{member.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <span className="text-slate-gray">{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(member.status)}
                    </TableCell>
                    {isOwner && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.role !== "Proprietario" && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditRole(member)}
                                    className="hover:bg-sky-blue-50 hover:text-sky-blue hover:border-sky-blue"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Modifica ruolo</DialogTitle>
                                    <DialogDescription>
                                      Cambia il ruolo di {member.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="role">Ruolo</Label>
                                      <Select value={newRole} onValueChange={(value) => setNewRole(value as Role)}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Editor">Editor</SelectItem>
                                          <SelectItem value="Visualizzatore">Visualizzatore</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingMember(null)}>
                                      Annulla
                                    </Button>
                                    <Button onClick={handleSaveRole} className="bg-electric-indigo hover:bg-electric-indigo-600">
                                      Salva
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Rimuovi membro</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Sei sicuro di voler rimuovere {member.name} dal team? Questa azione non può essere annullata.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveMember(member.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Rimuovi
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Invite Member */}
      {isOwner && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-slate-gray flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invita un membro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="inserisci@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="border-lavender-gray focus:border-electric-indigo"
                />
              </div>
              <div>
                <Label htmlFor="role">Ruolo</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as "Editor" | "Visualizzatore")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Visualizzatore">Visualizzatore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          onClick={handleInviteMember}
                          disabled={!canInvite}
                          className="w-full bg-electric-indigo hover:bg-electric-indigo-600 disabled:bg-lavender-gray disabled:text-slate-gray-400"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Invita
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {maxMembersReached && (
                      <TooltipContent>
                        <p>Limite massimo di 5 membri raggiunto</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Info Box */}
      <Card className="bg-sky-blue-50 border-sky-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-gray flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-blue" />
            Informazioni sui ruoli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-electric-indigo mt-0.5" />
              <div>
                <p className="font-semibold text-slate-gray">Proprietario</p>
                <p className="text-sm text-slate-gray-600">Pieno accesso, può invitare o rimuovere membri</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Edit className="w-5 h-5 text-sky-blue mt-0.5" />
              <div>
                <p className="font-semibold text-slate-gray">Editor</p>
                <p className="text-sm text-slate-gray-600">Può caricare documenti e usare le funzioni AI</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-cool-teal mt-0.5" />
              <div>
                <p className="font-semibold text-slate-gray">Visualizzatore</p>
                <p className="text-sm text-slate-gray-600">Può solo leggere e commentare</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Team
