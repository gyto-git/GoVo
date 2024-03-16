import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-detail-voucher',
  templateUrl: './detail-voucher.page.html',
  styleUrls: ['./detail-voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class DetailVoucherPage {
  id: any;
  qrcode: any;
  ucode: any;
  data: any;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private api: ApiService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.storage
        .get('data')
        .then((data) => {
          this.ucode = data.ucode;
          console.log(this.ucode);
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async loadData() {
    //siapkan data
    let data = { ucode: this.ucode, id: this.id };
    let url = 'VoucherOwner/Detail';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        this.data = this.data.data;
        this.qrcode = this.data.o_kodeVoucher;
        console.log(this.data);
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      })
      .catch((err) => {
        this.presentAlert('Error', err.respon);
      });
  }

  async presentAlert(header: string, message: any) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
