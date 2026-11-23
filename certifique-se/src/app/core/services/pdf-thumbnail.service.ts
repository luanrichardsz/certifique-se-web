import { Injectable } from "@angular/core";
import * as pdfjsLib from "pdfjs-dist";

@Injectable({
  providedIn: "root"
})
export class PdfThumbnailService {
  private isWorkerConfigured = false;
  private thumbnailCache = new Map<string, Promise<string>>();

  private ensureWorker(): void {
    if (!this.isWorkerConfigured) {
      // Configure local PDF.js worker served from assets
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      this.isWorkerConfigured = true;
    }
  }

  /**
   * Generates a dataURL JPEG image of the 1st page of a PDF.
   * Can receive a File/Blob or a remote URL string.
   * Uses in-memory caching for URL strings to avoid redundant network & canvas work.
   */
  async generateThumbnail(source: Blob | string, scale = 2.0): Promise<string> {
    if (typeof source === "string") {
      const cacheKey = `${source}::scale=${scale}`;
      const cached = this.thumbnailCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const task = this.renderPdfToDataUrl(source, scale).catch((err) => {
        this.thumbnailCache.delete(cacheKey);
        throw err;
      });
      this.thumbnailCache.set(cacheKey, task);
      return task;
    }

    return this.renderPdfToDataUrl(source, scale);
  }

  private async renderPdfToDataUrl(source: Blob | string, scale: number): Promise<string> {
    this.ensureWorker();

    let data: Uint8Array;
    if (typeof source === "string") {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Falha ao obter arquivo PDF: HTTP ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      data = new Uint8Array(arrayBuffer);
    } else {
      const arrayBuffer = await source.arrayBuffer();
      data = new Uint8Array(arrayBuffer);
    }

    const loadingTask = pdfjsLib.getDocument({ data });

    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      throw new Error("Canvas 2D context not available");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas.toDataURL("image/jpeg", 0.95);
  }
}
