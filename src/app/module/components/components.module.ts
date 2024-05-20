import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import { InfoModalComponent } from 'src/app/components/info-modal/info-modal.component';
// import { DetailCompComponent } from 'src/app/components/detail-comp/detail-comp.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  // declarations: [InfoModalComponent, DetailCompComponent],
  imports: [CommonModule, IonicModule, FormsModule, DatePipe],
})
export class ComponentsModule {}
