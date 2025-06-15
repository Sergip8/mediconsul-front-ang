import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  
  constructor() { }
  
  async generatePdf(elementId: string, filename: string): Promise<void> {
    // Get the HTML element that needs to be converted to PDF
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return;
    }
    
    try {
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add image to PDF (centered horizontally)
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // If content is larger than A4, add more pages
      let position = imgHeight;
      const pageHeight = 297; // A4 height in mm
      
      while (position < canvas.height) {
        pdf.addPage();
        position -= pageHeight;
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          -position, 
          imgWidth, 
          imgHeight
        );
      }
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}