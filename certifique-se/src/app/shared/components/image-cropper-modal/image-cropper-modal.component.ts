import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  HostListener
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-image-cropper-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
           (click)="onBackdropClick($event)">
        <div class="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 overflow-hidden flex flex-col items-center"
             (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                  <path d="M18 22V8a2 2 0 0 0-2-2H2"/>
                </svg>
                Ajustar Foto de Perfil
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Posicione e dê zoom para recortar no formato ideal (1:1)</p>
            </div>
            <button (click)="onCancel()"
                    class="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                    title="Fechar">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Canvas Preview Area -->
          <div class="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-slate-950 select-none shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing">
            <canvas #cropCanvas
                    [width]="viewportSize"
                    [height]="viewportSize"
                    class="w-full h-full block touch-none"
                    (mousedown)="onMouseDown($event)"
                    (mousemove)="onMouseMove($event)"
                    (mouseup)="onMouseUp()"
                    (mouseleave)="onMouseUp()"
                    (touchstart)="onTouchStart($event)"
                    (touchmove)="onTouchMove($event)"
                    (touchend)="onTouchEnd()"
                    (wheel)="onWheel($event)"></canvas>

            @if (isLoadingImage) {
              <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-blue-400">
                <svg class="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-xs font-medium text-slate-300">Carregando imagem...</span>
              </div>
            }
          </div>

          <p class="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Arraste para mover • Use o controle para aproximar
          </p>

          <!-- Controls: Zoom & Rotate -->
          <div class="w-full mt-4 space-y-3 px-1">
            <div class="flex items-center gap-3">
              <button type="button" (click)="stepZoom(-0.1)"
                      class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-bold"
                      title="Diminuir zoom">
                −
              </button>
              <input type="range" min="1" max="3" step="0.02" [value]="zoomFactor"
                     (input)="onZoomSliderChange($event)"
                     class="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              <button type="button" (click)="stepZoom(0.1)"
                      class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-bold"
                      title="Aumentar zoom">
                +
              </button>
            </div>

            <div class="flex items-center justify-center gap-2 pt-1">
              <button type="button" (click)="rotateClockwise()"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                Girar 90°
              </button>

              <button type="button" (click)="resetTransform()"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M8 16H3v5"/>
                </svg>
                Centralizar
              </button>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="w-full flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            <button type="button" (click)="onCancel()"
                    class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              Cancelar
            </button>
            <button type="button" (click)="applyCrop()" [disabled]="isLoadingImage || isProcessing"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50">
              @if (isProcessing) {
                <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando...</span>
              } @else {
                <span>Cortar e Salvar Foto</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ImageCropperModalComponent implements OnChanges, AfterViewInit {
  @Input() isOpen = false;
  @Input() imageSource: string | null = null;
  @Output() cropped = new EventEmitter<File>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild("cropCanvas") cropCanvasRef?: ElementRef<HTMLCanvasElement>;

  readonly viewportSize = 320;
  private imageElement: HTMLImageElement | null = null;

  isLoadingImage = false;
  isProcessing = false;

  zoomFactor = 1.0;
  rotation = 0; // 0, 90, 180, 270
  panX = 0;
  panY = 0;

  private isDragging = false;
  private startDragX = 0;
  private startDragY = 0;
  private initialPanX = 0;
  private initialPanY = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"] && this.isOpen) {
      this.resetTransform();
      if (this.imageSource) {
        this.loadImage(this.imageSource);
      }
    } else if (changes["imageSource"] && this.imageSource && this.isOpen) {
      this.resetTransform();
      this.loadImage(this.imageSource);
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen && this.imageElement) {
      this.render();
    }
  }

  private loadImage(src: string): void {
    this.isLoadingImage = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.imageElement = img;
      this.isLoadingImage = false;
      this.resetTransform();
      setTimeout(() => this.render(), 50);
    };
    img.onerror = () => {
      this.isLoadingImage = false;
      this.onCancel();
    };
    img.src = src;
  }

  resetTransform(): void {
    this.zoomFactor = 1.0;
    this.rotation = 0;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  rotateClockwise(): void {
    this.rotation = (this.rotation + 90) % 360;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  stepZoom(delta: number): void {
    this.zoomFactor = Math.min(3.0, Math.max(1.0, +(this.zoomFactor + delta).toFixed(2)));
    this.constrainPan();
    this.render();
  }

  onZoomSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.zoomFactor = parseFloat(input.value);
    this.constrainPan();
    this.render();
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.05 : -0.05;
    this.stepZoom(delta);
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.startDragX = event.clientX;
    this.startDragY = event.clientY;
    this.initialPanX = this.panX;
    this.initialPanY = this.panY;
    this.render();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const dx = event.clientX - this.startDragX;
    const dy = event.clientY - this.startDragY;
    this.panX = this.initialPanX + dx;
    this.panY = this.initialPanY + dy;
    this.constrainPan();
    this.render();
  }

  @HostListener("window:mouseup")
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.render();
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.startDragX = event.touches[0].clientX;
      this.startDragY = event.touches[0].clientY;
      this.initialPanX = this.panX;
      this.initialPanY = this.panY;
      this.render();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || event.touches.length !== 1) return;
    event.preventDefault();
    const dx = event.touches[0].clientX - this.startDragX;
    const dy = event.touches[0].clientY - this.startDragY;
    this.panX = this.initialPanX + dx;
    this.panY = this.initialPanY + dy;
    this.constrainPan();
    this.render();
  }

  onTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.render();
    }
  }

  private getEffectiveDimensions(): { ew: number; eh: number; baseScale: number } {
    if (!this.imageElement) {
      return { ew: 1, eh: 1, baseScale: 1 };
    }
    const isRotated90 = this.rotation === 90 || this.rotation === 270;
    const ew = isRotated90 ? this.imageElement.naturalHeight : this.imageElement.naturalWidth;
    const eh = isRotated90 ? this.imageElement.naturalWidth : this.imageElement.naturalHeight;
    const baseScale = Math.max(this.viewportSize / ew, this.viewportSize / eh);
    return { ew, eh, baseScale };
  }

  private constrainPan(): void {
    const { ew, eh, baseScale } = this.getEffectiveDimensions();
    const currentScale = baseScale * this.zoomFactor;
    const currentW = ew * currentScale;
    const currentH = eh * currentScale;

    const maxPanX = Math.max(0, (currentW - this.viewportSize) / 2);
    const maxPanY = Math.max(0, (currentH - this.viewportSize) / 2);

    this.panX = Math.min(maxPanX, Math.max(-maxPanX, this.panX));
    this.panY = Math.min(maxPanY, Math.max(-maxPanY, this.panY));
  }

  render(): void {
    const canvas = this.cropCanvasRef?.nativeElement;
    if (!canvas || !this.imageElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const V = this.viewportSize;
    ctx.clearRect(0, 0, V, V);

    const { baseScale } = this.getEffectiveDimensions();
    const currentScale = baseScale * this.zoomFactor;
    const drawW = this.imageElement.naturalWidth * currentScale;
    const drawH = this.imageElement.naturalHeight * currentScale;

    // Draw image centered with rotation and pan
    ctx.save();
    ctx.translate(V / 2 + this.panX, V / 2 + this.panY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.imageElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Draw overlay mask with circle cutout
    ctx.save();
    ctx.fillStyle = "rgba(10, 15, 30, 0.7)";
    ctx.beginPath();
    ctx.rect(0, 0, V, V);
    // Cutout circular preview (radius = V/2 - 12)
    const radius = V / 2 - 12;
    ctx.arc(V / 2, V / 2, radius, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw boundary circle
    ctx.beginPath();
    ctx.arc(V / 2, V / 2, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(59, 130, 246, 0.85)"; // Blue
    ctx.stroke();

    // Rule of thirds subtle grid when dragging
    if (this.isDragging) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      const step = (radius * 2) / 3;
      const left = V / 2 - radius;
      const top = V / 2 - radius;

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(left + step, top);
      ctx.lineTo(left + step, top + radius * 2);
      ctx.moveTo(left + step * 2, top);
      ctx.lineTo(left + step * 2, top + radius * 2);

      // Horizontal lines
      ctx.moveTo(left, top + step);
      ctx.lineTo(left + radius * 2, top + step);
      ctx.moveTo(left, top + step * 2);
      ctx.lineTo(left + radius * 2, top + step * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  applyCrop(): void {
    if (!this.imageElement) return;

    this.isProcessing = true;
    const exportSize = 1024; // High definition 1:1 avatar
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) {
      this.isProcessing = false;
      return;
    }

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const ratio = exportSize / this.viewportSize;
    const { baseScale } = this.getEffectiveDimensions();
    const currentScale = baseScale * this.zoomFactor * ratio;
    const drawW = this.imageElement.naturalWidth * currentScale;
    const drawH = this.imageElement.naturalHeight * currentScale;
    const exportPanX = this.panX * ratio;
    const exportPanY = this.panY * ratio;

    ctx.save();
    ctx.translate(exportSize / 2 + exportPanX, exportSize / 2 + exportPanY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.imageElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export as high quality JPEG (0.95 quality)
    exportCanvas.toBlob(
      (blob) => {
        this.isProcessing = false;
        if (blob) {
          const croppedFile = new File([blob], "foto-perfil.jpg", { type: "image/jpeg" });
          this.cropped.emit(croppedFile);
        } else {
          this.onCancel();
        }
      },
      "image/jpeg",
      0.95
    );
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
