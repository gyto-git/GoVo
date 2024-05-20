import { Component } from '@angular/core';
import {
  IonicModule,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { QRCodeModule } from 'angularx-qrcode';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Voucher } from '../interface/voucher';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, QRCodeModule, CommonModule],
})
export class scanPage {
  isSupported = false;
  vouchers: Voucher[] = [];
  barcodes: Barcode[] = [];
  data: any;
  code: any;
  temp: any;
  loading: boolean = false;
  link: any = 'https://govo.my.id';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private storage: StorageService,
    private api: ApiService,
    private loadingCtrl: LoadingController
  ) {}

  async ionViewWillEnter() {
    if (
      !(await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()).available
    ) {
      this.installGoogleBarcodeScannerModule();
    }
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.storage
      .get('data')
      .then((data) => {
        this.code = data.ucode;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.loading = true;
    this.barcodes.splice(0);
    this.barcodes.push(...barcodes);
    console.log(this.barcodes);
    this.cekKlaim();
  }

  async cekKlaim() {
    let data = { code: this.code, qrcode: this.barcodes['0']['rawValue'] };
    console.log(data);
    let url = 'Scanner/cekKlaim';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        console.log(this.data);
        this.data = this.data.data;
        console.log(this.data);
        this.loading = false;
        if (this.data == undefined) {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Voucher ini bukan punya anda',
            buttons: ['OK'],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      });
  }

  async klaim() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    let data = {
      code: this.code,
      qrcode: this.barcodes['0']['rawValue'],
    };
    console.log(data);
    let url = 'Scanner/Klaim';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        loading.dismiss();
        console.log(data);
        this.temp = data;
        if (this.temp.isKlaim) {
          const alert = await this.alertController.create({
            header: 'Success',
            backdropDismiss: false,
            message: 'Voucher berhasil diKlaim',
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
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: this.temp.messages,
            buttons: ['tutup'],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }
}
