
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Bell, 
  Shield, 
  Mic, 
  Globe, 
  Palette,
  Download,
  Trash2,
  Key,
  Database,
  Cloud
} from "lucide-react"

const Impostazioni = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    transcription: true,
    aiActions: true
  })

  const [audio, setAudio] = useState({
    quality: "alta",
    autoSave: true,
    noiseReduction: true,
    speakerSeparation: false
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Impostazioni</h1>
        <p className="text-gray-600">Personalizza la tua esperienza con Sunto.ai</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profilo</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifiche</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Aspetto</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Dati</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Personali</CardTitle>
                <CardDescription>Gestisci le informazioni del tuo account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" defaultValue="Marco" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Cognome</Label>
                    <Input id="lastName" defaultValue="Rossi" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="marco.rossi@example.com" />
                </div>
                <div>
                  <Label htmlFor="company">Azienda</Label>
                  <Input id="company" defaultValue="Acme Corp" />
                </div>
                <div>
                  <Label htmlFor="role">Ruolo</Label>
                  <Input id="role" defaultValue="Product Manager" />
                </div>
                <Button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  Salva Modifiche
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferenze Lingua</CardTitle>
                <CardDescription>Imposta la lingua predefinita per trascrizioni e interfaccia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="interfaceLanguage">Lingua Interfaccia</Label>
                  <Select defaultValue="it">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transcriptionLanguage">Lingua Trascrizione Predefinita</Label>
                  <Select defaultValue="it">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audio Settings */}
        <TabsContent value="audio">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualità Audio</CardTitle>
                <CardDescription>Configura le impostazioni di registrazione e trascrizione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audioQuality">Qualità Registrazione</Label>
                  <Select value={audio.quality} onValueChange={(value) => setAudio({...audio, quality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bassa">Bassa (32 kbps)</SelectItem>
                      <SelectItem value="media">Media (64 kbps)</SelectItem>
                      <SelectItem value="alta">Alta (128 kbps)</SelectItem>
                      <SelectItem value="max">Massima (256 kbps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave">Salvataggio Automatico</Label>
                    <p className="text-sm text-gray-600">Salva automaticamente le registrazioni durante la sessione</p>
                  </div>
                  <Switch 
                    id="autoSave"
                    checked={audio.autoSave}
                    onCheckedChange={(checked) => setAudio({...audio, autoSave: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="noiseReduction">Riduzione Rumore</Label>
                    <p className="text-sm text-gray-600">Applica filtri per ridurre il rumore di fondo</p>
                  </div>
                  <Switch 
                    id="noiseReduction"
                    checked={audio.noiseReduction}
                    onCheckedChange={(checked) => setAudio({...audio, noiseReduction: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="speakerSeparation">Separazione Speaker</Label>
                    <p className="text-sm text-gray-600">Identifica e separa automaticamente i diversi speaker</p>
                  </div>
                  <Switch 
                    id="speakerSeparation"
                    checked={audio.speakerSeparation}
                    onCheckedChange={(checked) => setAudio({...audio, speakerSeparation: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formati Export</CardTitle>
                <CardDescription>Configura i formati predefiniti per l'esportazione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audioFormat">Formato Audio</Label>
                  <Select defaultValue="mp3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">MP3</SelectItem>
                      <SelectItem value="wav">WAV</SelectItem>
                      <SelectItem value="m4a">M4A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="textFormat">Formato Testo</Label>
                  <Select defaultValue="txt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="txt">TXT</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="srt">SRT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferenze Notifiche</CardTitle>
              <CardDescription>Gestisci quando e come ricevere le notifiche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notifiche Email</Label>
                  <p className="text-sm text-gray-600">Ricevi aggiornamenti via email</p>
                </div>
                <Switch 
                  id="emailNotifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Notifiche Push</Label>
                  <p className="text-sm text-gray-600">Ricevi notifiche push nel browser</p>
                </div>
                <Switch 
                  id="pushNotifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transcriptionComplete">Trascrizione Completata</Label>
                  <p className="text-sm text-gray-600">Notifica quando una trascrizione è completata</p>
                </div>
                <Switch 
                  id="transcriptionComplete"
                  checked={notifications.transcription}
                  onCheckedChange={(checked) => setNotifications({...notifications, transcription: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aiActionsComplete">Azioni IA Completate</Label>
                  <p className="text-sm text-gray-600">Notifica quando un'azione IA è completata</p>
                </div>
                <Switch 
                  id="aiActionsComplete"
                  checked={notifications.aiActions}
                  onCheckedChange={(checked) => setNotifications({...notifications, aiActions: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security */}
        <TabsContent value="privacy">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy e Sicurezza</CardTitle>
                <CardDescription>Gestisci la privacy dei tuoi dati e la sicurezza dell'account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Condivisione Dati per Miglioramenti</Label>
                    <p className="text-sm text-gray-600">Aiuta a migliorare Sunto.ai condividendo dati anonimi</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Eliminazione Automatica</Label>
                    <p className="text-sm text-gray-600">Elimina automaticamente le trascrizioni dopo 90 giorni</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Crittografia End-to-End</Label>
                    <p className="text-sm text-gray-600">Attiva crittografia avanzata per i tuoi dati</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestione Password</CardTitle>
                <CardDescription>Cambia la tua password e gestisci l'autenticazione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Password Attuale</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nuova Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  Aggiorna Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aspetto</CardTitle>
              <CardDescription>Personalizza l'aspetto dell'interfaccia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Tema</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Chiaro</SelectItem>
                    <SelectItem value="dark">Scuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dimensione Font</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Piccolo</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Colore Accent</Label>
                <div className="grid grid-cols-6 gap-3 mt-2">
                  {['bg-primary-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'].map((color) => (
                    <div key={color} className={`w-8 h-8 ${color} rounded-full cursor-pointer border-2 border-gray-200 hover:border-gray-400`} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Animazioni Ridotte</Label>
                  <p className="text-sm text-gray-600">Riduci le animazioni per migliorare le performance</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Dati</CardTitle>
                <CardDescription>Gestisci i tuoi dati e backup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium">Esporta Tutti i Dati</h4>
                      <p className="text-sm text-gray-600">Scarica un archivio con tutte le tue trascrizioni</p>
                    </div>
                  </div>
                  <Button variant="outline">Esporta</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cloud className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium">Backup Automatico</h4>
                      <p className="text-sm text-gray-600">Configura backup automatici nel cloud</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-900">Elimina Tutti i Dati</h4>
                      <p className="text-sm text-red-600">Elimina permanentemente tutti i dati dell'account</p>
                    </div>
                  </div>
                  <Button variant="destructive">Elimina</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilizzo Storage</CardTitle>
                <CardDescription>Monitora l'utilizzo dello spazio di archiviazione</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Spazio utilizzato</span>
                    <span>2.4 GB di 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Audio Files:</span>
                      <span className="float-right">1.8 GB</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trascrizioni:</span>
                      <span className="float-right">0.6 GB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Impostazioni
