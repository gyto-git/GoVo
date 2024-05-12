import { Component } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';
import { Voucher } from '../interface/voucher';

@Component({
  selector: 'app-voucher',
  templateUrl: 'voucher.page.html',
  styleUrls: ['voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule],
})
export class VoucherPage {
  code: any;
  data: any;
  segment: string = 'All';
  voucher: Voucher[] = [];
  voucher_temp: Voucher[] = [];
  link: any = 'https://govo.my.id';
  constructor(
    private api: ApiService,
    private storage: StorageService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
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
    //siapkan data
    let data = { code: this.code };
    let url = 'VoucherOwner';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        console.log(this.data);
        this.voucher = this.data.data;
        this.voucher_temp = this.data.data;
        console.log(this.voucher);
      })
      .catch((err) => {
        console.log(err);
      });
    document.getElementById('All')!.click();
  }

  async detail(id: any) {
    let data: NavigationExtras = {
      queryParams: {
        id: id,
      },
    };
    this.navCtrl.navigateForward(['detail-voucher'], data);
  }

  async tambah() {
    this.navCtrl.navigateForward(['add-voucher']);
  }

  async hapus(id: any) {
    let data = { ucode: this.code, id: id };
    let url = 'VoucherOwner/Delete';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        if (this.data.isDelete) {
          const alert = await this.alertController.create({
            header: 'Sucess',
            backdropDismiss: false,
            message: 'Voucher sudah dihapus',
            buttons: [
              {
                text: 'Tutup',
                role: 'confirm',
                handler: () => {
                  this.loadData();
                  this.navCtrl.navigateForward(['tabs/voucher']);
                },
              },
            ],
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            backdropDismiss: false,
            message: 'Error',
            buttons: ['Tutup'],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async detailUpdate(id: any) {
    let data: NavigationExtras = {
      queryParams: {
        id: id,
      },
    };
    this.navCtrl.navigateForward(['update'], data);
  }

  async segmentChanged(ev: any) {
    console.log(ev);
    if (ev.detail.value == 'Aktif') {
      this.voucher_temp = this.voucher.filter((element) => {
        // return element.o_namaVoucher.toLowerCase().includes('voucher');
        return element.o_status == 1;
      });
    } else if (ev.detail.value == 'Nonaktif') {
      this.voucher_temp = this.voucher.filter((element) => {
        return element.o_status == 0 || element.o_status == 2;
      });
    } else {
      this.voucher_temp = this.voucher;
    }
  }
}
