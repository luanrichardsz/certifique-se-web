import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-stats-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 transition hover:border-slate-700">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs sm:text-sm font-medium text-slate-400 truncate">{{ label }}</p>
          <p class="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums tracking-tight">{{ value }}</p>
          @if (subtitle) {
            <p class="text-xs text-slate-400 mt-1 truncate">{{ subtitle }}</p>
          }
        </div>
        <div class="text-slate-400 flex-shrink-0 pt-0.5" aria-hidden="true">
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
      indigo: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    };
    return colors[this.color];
  }
}
