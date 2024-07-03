import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value: any, type: 'HTML' | "URL" = 'HTML') {
    if (type == 'URL') {
      console.log('safe url ' , this.sanitized.bypassSecurityTrustResourceUrl(value))
      //@ts-ignore
      return this.sanitized.bypassSecurityTrustResourceUrl(value)?.changingThisBreaksApplicationSecurity;
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}
