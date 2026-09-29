import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-stats-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-6 backdrop-blur-sm hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
      <!-- Glow effect -->
      <div class="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
      
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="text-xs sm:text-sm font-medium text-slate-400 truncate">{{ label }}</p>
          <p class="text-xl sm:text-3xl font-extrabold text-white mt-0.5 sm:mt-1 tracking-tight">{{ value }}</p>
          @if (subtitle) {
            <p class="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate hidden sm:block">{{ subtitle }}</p>
          }
        </div>
        <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" [ngClass]="iconBgClass">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class StatsCardComponent {
  @Input() label = "";
  @Input() value: string | number = "";
  @Input() subtitle?: string;
  @Input() color: "blue" | "indigo" | "emerald" | "amber" = "blue";

  get iconBgClass(): string {
    const colors = {
      blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      indigo: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    };
    return colors[this.color];
  }
}
