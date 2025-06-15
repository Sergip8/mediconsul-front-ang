import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MarkdownParseService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Parse markdown-like syntax to HTML
   * @param text Raw text with markdown syntax
   * @returns SafeHtml with parsed formatting
   */
  parseToHtml(text: string): SafeHtml {
    if (!text) return '';

    // Handle headers (### Level 3 Header)
    text = text.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-4 mb-3">$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>');

    // Handle bold text (**bold**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');

    // Handle italic text (*italic*)
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');

    // Handle code blocks (`)
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 text-red-600 px-1 rounded-md text-sm">$1</code>');

    // Handle line breaks
    text = text.replace(/\n/g, '<br/>');

    // Handle bullet points
    text = text.replace(/^\* (.*$)/gim, '<li class="list-disc ml-4 text-gray-700">$1</li>');
    text = text.replace(/^- (.*$)/gim, '<li class="list-disc ml-4 text-gray-700">$1</li>');

    // Wrap lists
    text = text.replace(/(<li>.*<\/li>\n?)+/gim, '<ul class="my-2">$&</ul>');

    // Sanitize and return
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  /**
   * Convert markdown to plain text, removing formatting
   * @param text Raw text with markdown syntax
   * @returns Plain text without markdown
   */
  parseToPlainText(text: string): string {
    return text
      .replace(/^### /gim, '')   // Remove header markers
      .replace(/\*\*/g, '')      // Remove bold markers
      .replace(/\*/g, '')        // Remove italic markers
      .replace(/`/g, '')         // Remove code markers
      .replace(/^[*-] /gim, '')  // Remove list markers
      .trim();
  }
}
