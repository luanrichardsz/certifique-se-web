import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { certificateService } from '../../services/certificate.service';
import { toastService } from '../../services/toast.service';
import { Certificate, Tag } from '../../types';
import { CertificateUpload } from '../../components/shared/CertificateUpload';
import { TagChip } from '../../components/shared/TagChip';
import {
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  Link as LinkIcon,
  FileText,
  Eye,
  Lock,
} from 'lucide-react';

interface CertificateFormPageProps {
  mode?: 'create' | 'edit';
}

export const CertificateFormPage: React.FC<CertificateFormPageProps> = ({
  mode: propMode,
}) => {
  const { currentPath, params, navigate } = useRouter();
  const isEdit = propMode === 'edit' || currentPath.endsWith('/editar');
  const certificateId = params.id;

  const [isLoadingInitial, setIsLoadingInitial] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [workloadHours, setWorkloadHours] = useState<number | ''>('');
  const [credentialCode, setCredentialCode] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Tags
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');

  // File Upload State
  const [fileData, setFileData] = useState<{
    fileUrl: string;
    fileName: string;
    fileSize: string;
    fileType: 'image' | 'pdf';
  } | null>(null);

  // Validation State
  const [touched, setTouched] = useState({
    name: false,
    institution: false,
    completionDate: false,
  });

  useEffect(() => {
    if (isEdit && certificateId) {
      const fetchCertificate = async () => {
        setIsLoadingInitial(true);
        try {
          const cert = await certificateService.getById(certificateId);
          if (cert) {
            setName(cert.name);
            setInstitution(cert.institution);
            setCompletionDate(cert.completionDate);
            setWorkloadHours(cert.workloadHours || '');
            setCredentialCode(cert.credentialCode || '');
            setCredentialUrl(cert.credentialUrl || '');
            setDescription(cert.description || '');
            setIsPublic(cert.isPublic !== undefined ? cert.isPublic : true);
            setTags(cert.tags || []);
            if (cert.fileName) {
              setFileData({
                fileUrl: cert.fileUrl || '',
                fileName: cert.fileName,
                fileSize: cert.fileSize || 'Arquivo anexado',
                fileType: cert.fileType || 'image',
              });
            }
          } else {
            toastService.error('Certificado não encontrado.');
            navigate('/certificados');
          }
        } catch {
          toastService.error('Erro ao carregar dados do certificado.');
        } finally {
          setIsLoadingInitial(false);
        }
      };

      fetchCertificate();
    } else {
      // Default initial date to today
      setCompletionDate(new Date().toISOString().split('T')[0]);
    }
  }, [isEdit, certificateId, navigate]);

  const getNameError = () => {
    if (!touched.name) return '';
    if (!name.trim()) return 'O nome do certificado é obrigatório.';
    return '';
  };

  const getInstitutionError = () => {
    if (!touched.institution) return '';
    if (!institution.trim()) return 'A instituição emissora é obrigatória.';
    return '';
  };

  const getCompletionDateError = () => {
    if (!touched.completionDate) return '';
    if (!completionDate) return 'A data de conclusão é obrigatória.';
    return '';
  };

  const nameError = getNameError();
  const institutionError = getInstitutionError();
  const completionDateError = getCompletionDateError();

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    // Check duplicate
    if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setTagInput('');
      return;
    }

    setTags([...tags, { name: trimmed }]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, institution: true, completionDate: true });

    if (!name.trim() || !institution.trim() || !completionDate) {
      toastService.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && certificateId) {
        await certificateService.update(certificateId, {
          name: name.trim(),
          institution: institution.trim(),
          completionDate,
          workloadHours: workloadHours ? Number(workloadHours) : undefined,
          credentialCode: credentialCode.trim() || undefined,
          credentialUrl: credentialUrl.trim() || undefined,
          description: description.trim() || undefined,
          tags,
          isPublic,
          fileUrl: fileData?.fileUrl,
          fileName: fileData?.fileName,
          fileSize: fileData?.fileSize,
          fileType: fileData?.fileType,
          thumbnailUrl: fileData?.fileUrl,
        });

        toastService.success('Certificado atualizado com sucesso.');
        navigate(`/certificados/${certificateId}`);
      } else {
        const created = await certificateService.create({
          name: name.trim(),
          institution: institution.trim(),
          completionDate,
          workloadHours: workloadHours ? Number(workloadHours) : undefined,
          credentialCode: credentialCode.trim() || undefined,
          credentialUrl: credentialUrl.trim() || undefined,
          description: description.trim() || undefined,
          tags,
          isPublic,
          fileUrl: fileData?.fileUrl || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
          fileName: fileData?.fileName || 'certificado.png',
          fileSize: fileData?.fileSize || '1.2 MB',
          fileType: fileData?.fileType || 'image',
          thumbnailUrl: fileData?.fileUrl || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
        });

        toastService.success('Certificado adicionado com sucesso.');
        navigate(`/certificados/${created.id}`);
      }
    } catch {
      toastService.error('Ocorreu um erro ao salvar o certificado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 animate-pulse">
        <div className="h-8 bg-slate-200 w-1/3 rounded-xl"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
        <div className="h-96 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            isEdit && certificateId
              ? navigate(`/certificados/${certificateId}`)
              : navigate('/certificados')
          }
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {isEdit ? 'Editar certificado' : 'Adicionar certificado'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isEdit
            ? 'Atualize as informações do certificado no seu histórico.'
            : 'Adicione as informações do certificado ao seu histórico.'}
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: File Upload */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              1. Arquivo do certificado
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Faça o upload do documento original (imagem ou PDF).
            </p>
          </div>

          <CertificateUpload
            currentFileUrl={fileData?.fileUrl}
            currentFileName={fileData?.fileName}
            currentFileSize={fileData?.fileSize}
            currentFileType={fileData?.fileType}
            onFileSelect={setFileData}
          />
        </div>

        {/* Section 2: Certificate Information */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              2. Informações do certificado
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Preencha os dados de identificação e emissão do certificado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Certificate Name (Required) */}
            <div className="sm:col-span-2">
              <label
                htmlFor="cert-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Nome do certificado <span className="text-rose-500">*</span>
              </label>
              <input
                id="cert-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder="Ex: Java Foundations, Angular Avançado, etc."
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 transition-all ${
                  nameError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {nameError && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Institution (Required) */}
            <div>
              <label
                htmlFor="cert-institution"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Instituição emissora <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="cert-institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, institution: true }))}
                  placeholder="Ex: Oracle, Alura, FIAP, AWS"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 transition-all ${
                    institutionError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {institutionError && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {institutionError}
                </p>
              )}
            </div>

            {/* Completion Date (Required) */}
            <div>
              <label
                htmlFor="cert-completion-date"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Data de conclusão <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="cert-completion-date"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, completionDate: true }))}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 transition-all ${
                    completionDateError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {completionDateError && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {completionDateError}
                </p>
              )}
            </div>

            {/* Workload hours */}
            <div>
              <label
                htmlFor="cert-workload"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Carga horária (horas)
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  id="cert-workload"
                  type="number"
                  min="1"
                  max="5000"
                  value={workloadHours}
                  onChange={(e) =>
                    setWorkloadHours(e.target.value ? Number(e.target.value) : '')
                  }
                  placeholder="Ex: 40"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Credential Code */}
            <div>
              <label
                htmlFor="cert-credential-code"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Código / ID da credencial
              </label>
              <input
                id="cert-credential-code"
                type="text"
                value={credentialCode}
                onChange={(e) => setCredentialCode(e.target.value)}
                placeholder="Ex: ORCL-99238"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Verification URL */}
            <div className="sm:col-span-2">
              <label
                htmlFor="cert-credential-url"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Link público de validação
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  id="cert-credential-url"
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Tags (Chips input) */}
            <div className="sm:col-span-2 space-y-2">
              <label
                htmlFor="cert-tag-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Tags (Categorias)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="cert-tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Digite uma tag (ex: Java, Backend, Spring) e pressione Enter"
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  id="add-tag-btn"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Adicionar
                </button>
              </div>

              {/* Tags Container */}
              <div className="flex flex-wrap gap-2 pt-1 min-h-[32px]">
                {tags.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Nenhuma tag adicionada ainda.
                  </span>
                ) : (
                  tags.map((t, idx) => (
                    <TagChip
                      key={t.id || idx}
                      tag={t}
                      onRemove={() => handleRemoveTag(idx)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="cert-description"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Descrição ou tópicos abordados (opcional)
              </label>
              <textarea
                id="cert-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Principais competências desenvolvidas, tecnologias estudadas e projetos práticos..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <label
                  htmlFor="cert-is-public-toggle"
                  className="text-sm font-semibold text-slate-900 dark:text-slate-50 cursor-pointer"
                >
                  Exibir no portfólio público
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Permitir que este certificado seja visualizado no seu link público
                  /u/[username]
                </p>
              </div>

              <input
                id="cert-is-public-toggle"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded-md border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            id="cert-form-cancel-btn"
            onClick={() =>
              isEdit && certificateId
                ? navigate(`/certificados/${certificateId}`)
                : navigate('/certificados')
            }
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors focus:outline-none disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            id="cert-form-save-btn"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Salvar alterações' : 'Salvar certificado'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
