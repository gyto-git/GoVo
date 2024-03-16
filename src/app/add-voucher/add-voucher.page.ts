import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from '@ionic/angular';

import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.page.html',
  styleUrls: ['./add-voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddVoucherPage {
  o_namaVoucher: any;
  o_stokVoucher: any;
  o_tanggalMulai: any;
  o_tanggalAkhir: any;

  code: any;
  data: any;

  images: any;
  showpict: any;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  async ambilfoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      height: 480,
      width: 360,
    });
    this.images = image;
    this.showpict = `${'data:text/html;base64,' + image.base64String}`;
    console.log(this.images);
  }
  async kirim() {
    this.storage
      .get('data')
      .then((data) => {
        this.code = data.ucode;
        this.loadData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async loadData() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    //siapkan data
    let data = {
      code: this.code,
      o_namaVoucher: this.o_namaVoucher,
      o_stokVoucher: this.o_stokVoucher,
      o_tanggalMulai: this.o_tanggalMulai,
      o_tanggalAkhir: this.o_tanggalAkhir,
      img: this.images,
    };
    let url = 'VoucherOwner/Create';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        loading.dismiss();
        this.data = data;
        if (this.data.isCreate) {
          const alert = await this.alertController.create({
            header: 'Sucess',
            backdropDismiss: false,
            message: 'Voucher sudah dibuat',
            buttons: [
              {
                text: 'Tutup',
                role: 'confirm',
                handler: () => {
                  this.navCtrl.navigateForward(['tabs/voucher']);
                },
              },
            ],
          });
          await alert.present();
        } else {
          let temp1 = '';
          let temp2 = '';
          let temp3 = '';
          let temp4 = '';
          for (const key in this.data.messages) {
            if (key === 'o_namaVoucher') {
              temp1 = this.data.messages[key];
            } else if (key === 'o_stokVoucher') {
              temp2 = this.data.messages[key];
            } else if (key === 'o_tanggalMulai') {
              temp3 = this.data.messages[key];
            } else if (key === 'o_tanggalAkhir') {
              temp4 = this.data.messages[key];
            }
          }
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: temp1 + '<br>' + temp2 + '<br>' + temp3 + '<br>' + temp4,
            buttons: ['Tutup'],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        loading.dismiss();
        console.log(err);
      });
  }
}
