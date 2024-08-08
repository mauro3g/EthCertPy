import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ICertificate } from 'src/app/interfaces/interfaces';
import { DateFormatterUtil } from 'src/app/utils/dateFormatter';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certificate-validate',
  templateUrl: './certificate-validate.component.html',
  styleUrls: ['./certificate-validate.component.scss'],
})
export class CertificateValidateComponent extends DateFormatterUtil {
  @Input() certificate?: ICertificate;
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  constructor(
  ) {
    super();
  }

  generatePdf() {
    const element = this.pdfContent.nativeElement;
    html2canvas(element).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 600;
      var pageHeight = 500;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('l', 'px', 'letter'); // A4 size page of PDF
      var position = 10;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
}
