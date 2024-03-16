import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.page.html',
  styleUrls: ['./qr-generator.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class QrGeneratorPage implements OnInit {
  input: string = '';

  constructor() {}

  ngOnInit() {}
}
