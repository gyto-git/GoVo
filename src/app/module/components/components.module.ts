import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ScanModalComponent } from 'src/app/components/scan-modal/scan-modal.component';

@NgModule({
  declarations: [ScanModalComponent],
  imports: [CommonModule, IonicModule, FormsModule, DatePipe],
})
export class ComponentsModule {}
