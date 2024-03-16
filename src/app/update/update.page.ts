import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { Voucher } from '../interface/voucher';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UpdatePage implements OnInit {
  id: any;
  ucode: any;
  data: any;
  loading: boolean = true;
  showpict: any;
  input!: Voucher;

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private api: ApiService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
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
        this.input = this.data.data;
        this.showpict =
          'http://localhost:8080/uploads/client/' + this.input.o_foto;
        console.log(this.input);
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      })
      .catch((err) => {
        this.presentAlert('Error', err.respon);
      });
  }

  async edit() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    let data = {
      ucode: this.ucode,
      id: this.id,
      o_namaVoucher: this.input.o_namaVoucher,
      o_stokVoucher: this.input.o_stokVoucher,
      o_tanggalMulai: this.input.o_tanggalAkhir,
      o_tanggalAkhir: this.input.o_tanggalAkhir,
    };
    let url = 'VoucherOwner/Update';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        loading.dismiss();
        this.data = data;
        if (this.data.isUpdate) {
          const alert = await this.alertController.create({
            header: 'Sucess',
            backdropDismiss: false,
            message: 'Voucher sudah diupdate',
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

  async presentAlert(header: string, message: any) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
