import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]',
  standalone: true,
})
export class HideHeaderDirective implements OnInit {
  @Input('appHideHeader') toolbar: any;
  private toolbarHeight = 50;
  constructor(private renderer: Renderer2, private domCtrl: DomController) {}

  ngOnInit() {
    this.toolbar = this.toolbar.el;
    this.domCtrl.read(() => {
      this.toolbarHeight = this.toolbar.clientHeight;
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    const scrollTop = $event.detail.scrollTop;
    let newPosition = -(scrollTop / 4);
    if (newPosition < -this.toolbarHeight) {
      newPosition = -this.toolbarHeight;
    }

    let newOpacity = 1 - newPosition / -this.toolbarHeight;

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.toolbar, 'top', `${newPosition}px`);
      this.renderer.setStyle(this.toolbar, 'opacity', `${newOpacity}px`);
    });
  }
}
