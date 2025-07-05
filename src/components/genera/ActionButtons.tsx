
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Key, ClipboardList } from 'lucide-react';

interface ActionButtonsProps {
  onActionSelect: (action: string) => void;
}

export function ActionButtons({ onActionSelect }: ActionButtonsProps) {
  const actions = [
    {
      id: 'riassunto-completo',
      title: 'Riassunto Completo',
      description: 'Genera un riassunto dettagliato di tutta la trascrizione',
      icon: FileText,
      color: 'bg-electric-indigo',
    },
    {
      id: 'punti-chiave',
      title: 'Punti Chiave',
      description: 'Estrai i punti più importanti e le decisioni prese',
      icon: Key,
      color: 'bg-cool-teal',
    },
    {
      id: 'note-strutturate',
      title: 'Note Strutturate',
      description: 'Organizza il contenuto in note strutturate e categorizzate',
      icon: ClipboardList,
      color: 'bg-sky-blue',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-slate-gray">Seleziona un'azione</h2>
        <p className="text-slate-gray-600">
          Scegli come vuoi elaborare la trascrizione
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Card 
            key={action.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-electric-indigo/50 group bg-soft-white border-lavender-gray"
            onClick={() => onActionSelect(action.title)}
          >
            <CardHeader className="text-center pb-3">
              <div className={`mx-auto w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-slate-gray">{action.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-slate-gray-600">
                {action.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
