import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideHeaderDirective } from 'src/app/directives/hideHeader/hide-header.directive';
import { FadeHeaderDirective } from 'src/app/directives/fadeHeader/fade-header.directive';

@NgModule({
  imports: [CommonModule, HideHeaderDirective, FadeHeaderDirective],
  exports: [HideHeaderDirective, FadeHeaderDirective],
})
export class SharedDirectivesModule {}
