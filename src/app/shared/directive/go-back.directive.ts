import { Directive, HostListener } from '@angular/core';
import { NavigationService } from 'src/app/core/service/navigation.service';

@Directive({
  selector: '[goBack]'
})
export class GoBackDirective {
  constructor(private nav: NavigationService) { }
  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.nav.back();
  }
}