import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: "default" | "success" | "warning" | "indigo" | "outline" | "slate" = "default";
  @Input() size: "sm" | "md" = "sm";

  get badgeClasses(): string {
    const base = "inline-flex items-center font-semibold rounded-full transition-colors";
    const sizeClasses = this.size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";
    
    const variants = {
      default: "bg-slate-900/90 text-blue-300 border border-blue-500/40",
      success: "bg-slate-900/90 text-emerald-300 border border-emerald-500/40",
      warning: "bg-slate-900/90 text-amber-300 border border-amber-500/40",
      indigo: "bg-slate-900/90 text-blue-300 border border-blue-500/40",
      slate: "bg-slate-900/90 text-slate-200 border border-slate-700/80",
      outline: "bg-slate-900/90 text-slate-200 border border-slate-600/80"
    };

    return `${base} ${sizeClasses} ${variants[this.variant]}`;
  }
}
