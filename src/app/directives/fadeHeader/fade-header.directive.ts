import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appFadeHeader]',
  standalone: true,
})
export class FadeHeaderDirective implements OnInit {
  @Input('appFadeHeader') toolbar: any;
  private toolbarHeight = 50;
  constructor(private domCtrl: DomController) {}

  ngOnInit() {
    this.toolbar = this.toolbar.el;
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    let scrollTop = $event.detail.scrollTop;
    if (scrollTop >= 255) {
      scrollTop = 255;
    }
    const hexDist = parseInt(scrollTop, 10).toString(16);
    this.domCtrl.write(() => {
      this.toolbar.style.setProperty('--color', `#424242${hexDist}`);
      this.toolbar.style.setProperty('--background', `#99e265${hexDist}`);
    });
  }
}
