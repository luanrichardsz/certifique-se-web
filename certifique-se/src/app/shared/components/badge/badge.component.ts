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
    const base = "inline-flex items-center font-medium rounded-full transition-colors";
    const sizeClasses = this.size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";
    
    const variants = {
      default: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      indigo: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      slate: "bg-slate-800 text-slate-300 border border-slate-700",
      outline: "bg-transparent text-slate-400 border border-slate-700"
    };

    return `${base} ${sizeClasses} ${variants[this.variant]}`;
  }
}
