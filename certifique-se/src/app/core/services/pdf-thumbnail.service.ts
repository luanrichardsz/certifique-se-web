import { Injectable } from "@angular/core";
import * as pdfjsLib from "pdfjs-dist";

@Injectable({
  providedIn: "root"
})
export class PdfThumbnailService {
  private isWorkerConfigured = false;

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
   */
  async generateThumbnail(source: Blob | string, scale = 1.5): Promise<string> {
    this.ensureWorker();

    let loadingTask;
    if (typeof source === "string") {
      loadingTask = pdfjsLib.getDocument({
        url: source,
        withCredentials: false
      });
    } else {
      const arrayBuffer = await source.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer)
      });
    }

    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D context not available");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvas: canvas,
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas.toDataURL("image/jpeg", 0.85);
  }
}
