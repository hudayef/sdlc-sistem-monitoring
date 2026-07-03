import React, { useState } from 'react';
import type { Project } from '../types';
import { FileText, FileCode, Plus, Trash2, Globe, FileSpreadsheet, Layers, Search, File } from 'lucide-react';

interface DocumentsProps {
  project: Project;
  onAddDocument: (fileName: string, type: string) => void;
  onDeleteDocument: (fileName: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({
  project,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('pdf');
  const [modalOpen, setModalOpen] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500 fill-red-500/10" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-6 w-6 text-blue-500 fill-blue-500/10" />;
      case 'fig':
      case 'figma':
        return <FileSpreadsheet className="h-6 w-6 text-purple-500 fill-purple-500/10" />;
      case 'drawio':
      case 'erd':
        return <Layers className="h-6 w-6 text-emerald-500 fill-emerald-500/10" />;
      case 'yaml':
      case 'yml':
      case 'json':
      case 'api':
        return <FileCode className="h-6 w-6 text-amber-500 fill-amber-500/10" />;
      default:
        return <File className="h-6 w-6 text-zinc-500 fill-zinc-500/10" />;
    }
  };

  const getFileBadge = (type: string) => {
    const uppercaseType = type.toUpperCase();
    switch (type.toLowerCase()) {
      case 'pdf':
        return <span className="bg-red-500/10 text-red-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-red-500/20">{uppercaseType}</span>;
      case 'docx':
        return <span className="bg-blue-500/10 text-blue-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-blue-500/20">{uppercaseType}</span>;
      case 'fig':
      case 'figma':
        return <span className="bg-purple-500/10 text-purple-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-purple-500/20">FIGMA</span>;
      case 'drawio':
        return <span className="bg-emerald-500/10 text-emerald-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">DRAWIO</span>;
      case 'yaml':
      case 'api':
        return <span className="bg-amber-500/10 text-amber-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/20">YAML</span>;
      default:
        return <span className="bg-zinc-500/10 text-zinc-500 text-3xs font-mono font-bold px-1.5 py-0.5 rounded border border-zinc-500/20">{uppercaseType}</span>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    
    // Add extension if not typed
    let name = newDocName.trim();
    const hasExtension = name.includes('.');
    if (!hasExtension) {
      name = `${name}.${newDocType}`;
    }
    
    // Prevent duplicates to avoid duplicate key rendering warning and mass deletion bug
    const isDuplicate = project.documents.some(
      (doc) => doc.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      alert(`Dokumen dengan nama "${name}" sudah ada dalam project ini.`);
      return;
    }
    
    onAddDocument(name, newDocType);
    setNewDocName('');
    setModalOpen(false);
  };

  const filteredDocuments = project.documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dokumen & Desain
            </span>
            <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
              Dokumen Project
            </h3>
          </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Dokumen</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* List of Documents */}
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-xl text-center text-muted-foreground bg-muted/5">
            <Globe className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold">Tidak ada dokumen ditemukan</p>
            <p className="text-xs mt-1">Coba cari kata kunci lain atau tambahkan dokumen baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.name}
                className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 p-3.5 transition-all hover:bg-muted/30 hover:border-border hover:shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="shrink-0">{getFileIcon(doc.type)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[160px] sm:max-w-[200px]">
                      {doc.name}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      {getFileBadge(doc.type)}
                      <span className="text-3xs text-muted-foreground">Mock File Link</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteDocument(doc.name)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  aria-label="Hapus dokumen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Document Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all z-10 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground mb-4">
              Tambah Dokumen Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Nama File / Tautan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: SRS_v2.0"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Tipe Dokumen
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="docx">Word Document (.docx)</option>
                  <option value="fig">Figma Design (.fig)</option>
                  <option value="drawio">Draw.io Diagram (.drawio)</option>
                  <option value="yaml">API Specification (.yaml)</option>
                  <option value="other">Lainnya (.txt / .zip)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
