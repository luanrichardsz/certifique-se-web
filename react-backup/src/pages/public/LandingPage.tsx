import React from 'react';
import { useRouter } from '../../context/RouterContext';
import {
  ShieldCheck,
  ArrowRight,
  Upload,
  Tags,
  Search,
  CheckCircle2,
  Lock,
  Archive,
  Layers,
  Building2,
  Calendar,
} from 'lucide-react';
import { TagChip } from '../../components/shared/TagChip';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-white dark:from-slate-900 via-slate-50 dark:via-slate-900 to-slate-50 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Gestão inteligente de conquistas profissionais</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.12]">
                Seus certificados.{' '}
                <span className="text-blue-600 block sm:inline">
                  Organizados em um só lugar.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Armazene, organize e consulte seus certificados acadêmicos e
                profissionais sempre que precisar. Sem arquivos perdidos em pastas
                ou caixas de e-mail.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  id="hero-create-account-btn"
                  onClick={() => navigate('/cadastro')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-98"
                >
                  <span>Criar minha conta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-login-btn"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
                >
                  Entrar na plataforma
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pronto para uso
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Privacidade controlada
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Suporte a imagens & PDF
                </span>
              </div>
            </div>

            {/* Right Visual Representation */}
            <div className="lg:col-span-5 relative">
              {/* Decorative layered backdrop */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl opacity-10 blur-xl"></div>

              {/* Mock UI Card Stack */}
              <div className="relative space-y-4">
                {/* Main Card */}
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transform transition-transform hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        <Building2 className="w-3 h-3" />
                        Oracle University
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                        Java Foundations Certified
                      </h3>
                    </div>
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shrink-0">
                      ORCL
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Concluído em: 12/05/2026</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <TagChip tag={{ name: 'Java' }} size="sm" />
                    <TagChip tag={{ name: 'Backend' }} size="sm" />
                    <TagChip tag={{ name: 'Oracle' }} size="sm" />
                  </div>
                </div>

                {/* Sub Card */}
                <div className="p-4 bg-white dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-md flex items-center justify-between gap-4 -mt-2 ml-4">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Alura
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      Spring Boot REST APIs
                    </h4>
                    <p className="text-xs text-slate-400">4 tags vinculadas</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
                    Preservado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="como-funciona" className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Fluxo Simples & Direto
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Como funciona o Certifique-se
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Uma experiência sem fricção para você nunca mais perder seus
              comprovantes de estudo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg mb-5 shadow-xs">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                Adicione seu certificado
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Envie o arquivo por arrastar e soltar e informe os principais dados
                como instituição e data de conclusão.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg mb-5 shadow-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                Organize com facilidade
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilize instituições, datas e tags personalizadas para manter tudo
                categorizado e fácil de localizar.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg mb-5 shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                Consulte quando precisar
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Encontre rapidamente qualquer certificado em um único lugar, filtre
                por tecnologia ou compartilhe seu portfólio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Vantagens
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Construído para valorizar sua trajetória
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Menos burocracia, mais organização para sua carreira e estudos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Certificados centralizados
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Chega de procurar comprovantes espalhados em dezenas de plataformas
                e drives.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Organização por tags
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Classifique por linguagem, especialidade, ano ou metodologia com
                etiquetas flexíveis.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Pesquisa instantânea
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Encontre o documento exato em segundos digitando qualquer termo
                ou instituição.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Archive className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Histórico profissional
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tenha uma visão cronológica clara de todo o seu desenvolvimento e
                conquistas.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Arquivos preservados
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Seus arquivos protegidos e disponíveis para visualização ou
                download a qualquer momento.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Design minimalista e claro
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interface limpa e objetiva sem ruídos, pop-ups desnecessários ou
                complexidade excessiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Comece a organizar suas conquistas hoje
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
            Crie sua conta no Certifique-se e tenha todos os seus certificados à
            mão para processos seletivos e progressão de carreira.
          </p>
          <div className="pt-2">
            <button
              type="button"
              id="cta-bottom-register"
              onClick={() => navigate('/cadastro')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white dark:text-slate-900 font-semibold rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>Criar minha conta gratuitamente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
