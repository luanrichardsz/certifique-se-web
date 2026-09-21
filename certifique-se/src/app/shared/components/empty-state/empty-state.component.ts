import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-1">{{ title }}</h3>
      <p class="text-sm text-slate-400 max-w-sm mb-6">{{ description }}</p>
      @if (actionLabel && actionRoute) {
        <a [routerLink]="actionRoute" 
           class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          {{ actionLabel }}
        </a>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = "Nenhum certificado encontrado";
  @Input() description = "Você ainda não possui certificados cadastrados ou sua busca não retornou resultados.";
  @Input() actionLabel?: string;
  @Input() actionRoute?: string;
}
