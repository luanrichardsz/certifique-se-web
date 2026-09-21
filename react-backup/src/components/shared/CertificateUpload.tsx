import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface CertificateUploadProps {
  currentFileUrl?: string;
  currentFileName?: string;
  currentFileSize?: string;
  currentFileType?: 'image' | 'pdf';
  onFileSelect: (fileData: {
    fileUrl: string;
    fileName: string;
    fileSize: string;
    fileType: 'image' | 'pdf';
  } | null) => void;
}

export const CertificateUpload: React.FC<CertificateUploadProps> = ({
  currentFileUrl,
  currentFileName,
  currentFileSize,
  currentFileType = 'image',
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [preview, setPreview] = useState<{
    url: string;
    name: string;
    size: string;
    type: 'image' | 'pdf';
  } | null>(
    currentFileUrl && currentFileName
      ? {
          url: currentFileUrl,
          name: currentFileName,
          size: currentFileSize || 'Arquivo anexado',
          type: currentFileType,
        }
      : null
  );

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('O arquivo deve ter no máximo 15MB.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|svg)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setErrorMessage('Por favor selecione uma imagem (PNG, JPG, WebP) ou documento PDF.');
      return;
    }

    const type: 'image' | 'pdf' = isPdf ? 'pdf' : 'image';
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        const fileObj = {
          url: resultUrl,
          name: file.name,
          size: formattedSize,
          type: 'image' as const,
        };
        setPreview(fileObj);
        onFileSelect({
          fileUrl: resultUrl,
          fileName: file.name,
          fileSize: formattedSize,
          fileType: 'image',
        });
      };
      reader.readAsDataURL(file);
    } else {
      // PDF representation
      const fileObj = {
        url: '',
        name: file.name,
        size: formattedSize,
        type: 'pdf' as const,
      };
      setPreview(fileObj);
      onFileSelect({
        fileUrl: '',
        fileName: file.name,
        fileSize: formattedSize,
        fileType: 'pdf',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        id="certificate-file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {preview ? (
        <div
          id="certificate-file-preview-card"
          className="relative flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              {preview.type === 'image' && preview.url ? (
                <img
                  src={preview.url}
                  alt="Pré-visualização do certificado"
                  className="w-full h-full object-cover"
                />
              ) : preview.type === 'pdf' ? (
                <FileText className="w-6 h-6 text-rose-500" />
              ) : (
                <ImageIcon className="w-6 h-6 text-blue-500" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                {preview.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">{preview.size}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/60 px-1.5 py-0.2 rounded">
                  {preview.type === 'pdf' ? 'Documento PDF' : 'Imagem'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              type="button"
              id="change-certificate-file-btn"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white dark:bg-slate-900 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Trocar
            </button>
            <button
              type="button"
              id="remove-certificate-file-btn"
              onClick={handleRemove}
              aria-label="Remover arquivo"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          id="certificate-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.005]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50 dark:bg-slate-900/50/50 hover:bg-slate-50 dark:bg-slate-900/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 stroke-[1.75]" />
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">
            Arraste seu certificado aqui{' '}
            <span className="font-normal text-slate-500 dark:text-slate-400">ou</span>{' '}
            <span className="text-blue-600 hover:underline">Selecionar arquivo</span>
          </p>

          <p className="text-xs text-slate-400 mt-1.5 text-center">
            Suporta imagens (PNG, JPG, WebP) ou documentos PDF até 15MB
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
