import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLazyLoadRow]'
})
export class LazyLoadRowDirective {
  @HostBinding('attr.src') srcAttr :any;
  @Input() src: string ='';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }
  @HostListener('load', ['$event'])
  onLoad() {
    this.el.nativeElement.nextElementSibling.hidden=true;
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    //this.el.nativeElement.nextElementSibling.hidden=false;
    this.srcAttr = this.src;
  }
}
