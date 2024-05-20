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
  o_deskripsi: any;
  o_tanggalMulai: any;
  o_tanggalAkhir: any;

  code: any;
  data: any;

  images: any = '';
  showpict: any = 'assets/yellow-green logo.png';

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  async ambilfoto() {
    const image = await Camera.getPhoto({
      quality: 50,
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
      o_deskripsi: this.o_deskripsi,
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
          console.log(this.data.messages);
          let temp = '';
          for (const key in this.data.messages) {
            if (key === 'o_namaVoucher') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_stokVoucher') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_tanggalMulai') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_tanggalAkhir') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_deskripsi') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'img') {
              temp += this.data.messages[key] + '<br>';
            }
          }
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: `${temp}`,
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
