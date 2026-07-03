import React, { useState, useEffect, useRef } from 'react';
import type { SDLCStage } from '../types';
import { Save, Check } from 'lucide-react';

interface NotesProps {
  stage: SDLCStage;
  onSaveNotes: (stageId: string, notes: string) => void;
}

export const Notes: React.FC<NotesProps> = ({ stage, onSaveNotes }) => {
  const [text, setText] = useState(stage.notes);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  const textRef = useRef(text);
  const stageIdRef = useRef(stage.id);
  const saveStatusRef = useRef(saveStatus);

  // Sync refs on every state change
  useEffect(() => {
    textRef.current = text;
    saveStatusRef.current = saveStatus;
  }, [text, saveStatus]);

  // Sync state with stage if it changes from timeline click
  useEffect(() => {
    // If previous stage was dirty and we are switching stages, save the old notes first!
    if (saveStatusRef.current === 'dirty' && stageIdRef.current !== stage.id) {
      onSaveNotes(stageIdRef.current, textRef.current);
    }

    setText(stage.notes);
    setSaveStatus('saved');
    stageIdRef.current = stage.id;
  }, [stage.id, stage.notes, onSaveNotes]);

  // Auto-save on unmount (e.g. changing tabs) if dirty
  useEffect(() => {
    return () => {
      if (saveStatusRef.current === 'dirty') {
        onSaveNotes(stageIdRef.current, textRef.current);
      }
    };
  }, [onSaveNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSaveStatus('dirty');
  };

  const handleBlur = () => {
    if (saveStatus === 'dirty') {
      setSaveStatus('saving');
      onSaveNotes(stage.id, text);
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const handleManualSave = () => {
    setSaveStatus('saving');
    onSaveNotes(stage.id, text);
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Catatan & Ulasan Tahap
            </span>
            <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
              Catatan: {stage.name}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xs font-medium text-muted-foreground">
              {saveStatus === 'saved' && (
                <span className="flex items-center text-emerald-500 font-semibold font-mono">
                  <Check className="mr-1 h-3.5 w-3.5" /> Tersimpan
                </span>
              )}
              {saveStatus === 'saving' && <span className="text-amber-500 font-mono animate-pulse">Menyimpan...</span>}
              {saveStatus === 'dirty' && <span className="text-muted-foreground/60 font-mono">Ada perubahan belum disimpan</span>}
            </span>

            <button
              onClick={handleManualSave}
              disabled={saveStatus === 'saved' || saveStatus === 'saving'}
              className="flex items-center space-x-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Simpan</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tulis catatan penting, kendala, atau log perkembangan untuk tahap SDLC ini..."
            rows={6}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all resize-none"
          />
        </div>

        <div className="text-2xs text-muted-foreground flex justify-between">
          <span>* Catatan disimpan otomatis saat kursor keluar dari kolom teks.</span>
          <span>{text.length} karakter</span>
        </div>
      </div>
    </div>
  );
};
