
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface TranscriptionViewProps {
  transcription: string;
}

export function TranscriptionView({ transcription }: TranscriptionViewProps) {
  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-gray">
          <FileText className="w-5 h-5" />
          Trascrizione
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border border-lavender-gray p-4 bg-soft-white">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-gray">
            {transcription}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
