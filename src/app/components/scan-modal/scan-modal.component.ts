import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-scan-modal',
  templateUrl: './scan-modal.component.html',
  styleUrls: ['./scan-modal.component.scss'],
})
export class ScanModalComponent implements OnInit {
  //data default
  data: any;
  barcode: any;
  code: any;
  switch: any;
  temp: any;
  constructor(
    private storage: StorageService,
    private api: ApiService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.storage
      .get('data')
      .then((data) => {
        this.code = data.ucode;
        this.cekKlaim();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async cekKlaim() {
    let data = { code: this.code, qrcode: this.barcode['0']['rawValue'] };
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
        // this.loading = false;
        if (this.data == undefined) {
          this.switch = 'error';
        } else {
          this.switch = 'continue';
        }
      })
      .catch((err) => {
        console.log(err);
        // this.loading = false;
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
      qrcode: this.barcode['0']['rawValue'],
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
                  this.modalCtrl.dismiss();
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
            buttons: [
              {
                text: 'Tutup',
                role: 'confirm',
                handler: () => {
                  this.modalCtrl.dismiss();
                },
              },
            ],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
