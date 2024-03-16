import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { QRCodeModule } from 'angularx-qrcode';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-qr-example',
  templateUrl: './qr-example.page.html',
  styleUrls: ['./qr-example.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class QrExamplePage implements OnInit {
  imagess: any;
  showpict: any;
  constructor(private api: ApiService) {}

  ngOnInit() {}

  async takepict() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    this.imagess = image;
    this.showpict = `${'data:text/html;base64,' + image.base64String}`;
    console.log(this.imagess);
    // this.send();
  }

  async send() {
    let data = {
      img: this.imagess,
    };
    let url = 'VoucherOwner/ambil';
    //apiTime
    this.api
      .send(data, url)
      .then(async () => {})
      .catch((err) => {
        console.log(err);
      });
  }
}
