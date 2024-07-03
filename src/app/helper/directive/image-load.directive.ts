import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { AppConstant } from '../class/app-constant';



@Directive({
  selector: '[imageLoad]'
})
export class ImageLoadDirective {
  @Input('imageLoad') public imgType: string | any;
  //@Input('imageLoad') public errorOnhide: boolean=false;
  constructor(private renderer: Renderer2,
    private el: ElementRef) {
    this.el.nativeElement.classList.add('loading');
  }

  @HostListener('load') onLoad() {
    console.log('load image');
    // this.renderer.setAttribute(this.el.nativeElement, 'src', this.el.nativeElement.src);
    this.el.nativeElement.classList.remove('loading');
  }

  @HostListener('error') onError() {
    console.log('load image error');
    if (this.imgType == 'group') {
      this.renderer.setAttribute(this.el.nativeElement, 'src', AppConstant.DEFAULT_GROUP_IMAGE_URL);
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'src', AppConstant.DEFAULT_PROFILE_IMAGE);
    }
    this.el.nativeElement.classList.remove('loading');
  }

}
