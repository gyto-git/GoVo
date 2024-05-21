import { Component } from '@angular/core';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ScanModalComponent } from 'src/app/components/scan-modal/scan-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  // config
  isSupported = false;
  //data default
  name: any;
  member: any;
  code: any;
  // qr code
  barcodes: Barcode[] = [];
  constructor(private navCtrl: NavController, private storage: StorageService, private alertController: AlertController, private modalCtrl: ModalController) {}

  // untuk scan qr
  async ionViewWillEnter() {
    this.storage.get('login').then((data) => {
      if (data == null) {
        this.navCtrl.navigateRoot('login');
      }
      this.storage
        .get('data')
        .then((data) => {
          this.name = data.name;
          this.member = data.member;
          this.code = data.ucode;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    if (!(await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()).available) {
      this.installGoogleBarcodeScannerModule();
    }
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    // this.loading = true;
    this.barcodes.splice(0);
    this.barcodes.push(...barcodes);
    console.log(this.barcodes);
    this.openModal(this.barcodes);
  }

  async openModal(data: any) {
    const modal = await this.modalCtrl.create({
      id: 'scanModal',
      component: ScanModalComponent,
      componentProps: {
        barcode: data,
      },
      cssClass: 'auto-height',
    });
    await modal.present();
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
}
