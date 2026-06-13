import { useState, useRef } from "react";
import { Upload, X, FileText, Image, File, Loader2 } from "lucide-react";
import { subirRecurso } from "@/lib/recursos";
import { getFileTipo, type RecursoTipo } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface RecursoUploadDialogProps {
  asignaturaId: number;
  userId: number;
  onRecursoUploaded: () => void;
  children?: React.ReactNode;
}

const TIPO_ICONS: Record<RecursoTipo, React.ReactNode> = {
  pdf: <FileText className="size-5 text-red-500" />,
  txt: <FileText className="size-5 text-gray-500" />,
  doc: <FileText className="size-5 text-blue-500" />,
  docx: <FileText className="size-5 text-blue-500" />,
  jpg: <Image className="size-5 text-green-500" />,
  jpeg: <Image className="size-5 text-green-500" />,
  png: <Image className="size-5 text-green-500" />,
  gif: <Image className="size-5 text-green-500" />,
  xlsx: <FileText className="size-5 text-emerald-600" />,
  pptx: <FileText className="size-5 text-orange-500" />,
  mp4: <FileText className="size-5 text-purple-500" />,
  otro: <File className="size-5 text-gray-500" />,
};

const ACCEPTED_TYPES = ".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.pptx,.ppt,.mp4,.zip,.rar";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RecursoUploadDialog({
  asignaturaId,
  userId,
  onRecursoUploaded,
  children,
}: RecursoUploadDialogProps) {
  const[open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };
const handleOpenChange = (value: boolean) => {
  setOpen(value);
  if (!value) resetAndClose();
};
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0] ?? null;
    setFile(dropped);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    const result = await subirRecurso(file, asignaturaId, userId);

    if (result.success) {
      setFile(null);
      onRecursoUploaded();
    } else {
      setError(result.error ?? "Error al subir el archivo");
    }

    setUploading(false);
  };

  const resetAndClose = () => {
    setFile(null);
    setError(null);
    setUploading(false);
  };


  const tipo = file ? getFileTipo(file.name) : null;

  return (
    <>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>

        <DialogContent>
          <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-zinc-600 mt-5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-zinc-800">
                    {TIPO_ICONS[tipo ?? "otro"]}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-2 rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Upload className="size-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Arrastra un archivo aqui o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, TXT, DOC, DOCX, JPG, PNG, XLSX, PPTX, MP4
                    </p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
            <Button type="submit" disabled={!file || uploading} className="cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  Subir
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
