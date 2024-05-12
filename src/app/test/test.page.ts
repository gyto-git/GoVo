import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { MapsComponent } from './maps/maps.component';
import { HttpClient } from '@angular/common/http';
import { Mock } from '../interface/voucher';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TestPage implements OnInit {
  // 1
  message: any;
  // 2
  data: any = null;
  provinsi: any;
  kota: any = null;
  pilihprovinsi: any;
  pilihkota: any;
  api_url = 'https://gyto-git.github.io/api-wilayah-indonesia/api/';
  // 3
  datas: any;
  api_url_mock = 'https://gyto-git.github.io/mockdata/mock.json';
  mock: any[] = [];
  display: any[] = [];

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit(): void {}

  ionViewWillEnter() {
    this.send('provinsi', 'provinces.json');
    this.filter().then(async (data) => {
      this.datas = data;
      console.log(this.datas);
      this.mock = this.datas;
      this.display = this.datas;
      this.mock = this.mock.slice(0, 10);
      console.log(this.mock);
    });
  }

  // untuk maps
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: MapsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
    }
  }

  // untuk select kota dan provinsi
  async send(tipe: any, url: string) {
    try {
      let link = this.api_url + url;
      return new Promise((resolve, reject) => {
        this.http.get(link).subscribe({
          next: (data) => {
            if (tipe == 'provinsi') {
              this.provinsi = data;
              console.log(this.provinsi);
              resolve(this.provinsi);
            } else if (tipe == 'kota') {
              this.kota = data;
              console.log(this.kota);
              resolve(this.kota);
            }
          },
          error: (err) => {
            console.log(err);
            let errorMessage = {
              status: err.status,
              respon: 'terjadi kesalahan sistem',
            };
            if (err.status == 0) {
              errorMessage = {
                status: err.status,
                respon: 'terjadi kesalahan koneksi',
              };
            }
            reject(errorMessage);
          },
        });
      });
    } catch (rejectedReason: any) {
      return new Promise((resolve, reject) => {
        let errorMessage = {
          status: rejectedReason.status,
          respon: 'terjadi kesalahan koneksi',
        };
        reject(errorMessage);
      });
    }
  }

  async handleProvince(ev: any) {
    this.pilihprovinsi = ev.target.value;
    console.log(this.pilihprovinsi);
    this.send('kota', 'regencies/' + this.pilihprovinsi.id + '.json');
    console.log('Current value:', JSON.stringify(ev.target.value));
    // klo filter make ini biso
    // this.display = this.mock.filter((element) => {
    //   console.log(element.provinsi);
    //   return element.provinsi
    //     .toLowerCase()
    //     .includes(ev.target.value.name.toLowerCase());
    // });
  }

  async handlekota(ev: any) {
    this.pilihkota = ev.target.value;
    console.log(this.pilihkota);
    console.log('Current value:', JSON.stringify(ev.target.value));
  }

  // untuk search dan filter
  async handleSearch(ev: any) {
    this.display = this.mock.filter((element) => {
      return element.nama.toLowerCase().includes(ev.target.value.toLowerCase());
    });
  }
  async filter() {
    try {
      let link = this.api_url_mock;
      return new Promise((resolve, reject) => {
        this.http.get(link).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            console.log(err);
            let errorMessage = {
              status: err.status,
              respon: 'terjadi kesalahan sistem',
            };
            if (err.status == 0) {
              errorMessage = {
                status: err.status,
                respon: 'terjadi kesalahan koneksi',
              };
            }
            reject(errorMessage);
          },
        });
      });
    } catch (rejectedReason: any) {
      return new Promise((resolve, reject) => {
        let errorMessage = {
          status: rejectedReason.status,
          respon: 'terjadi kesalahan koneksi',
        };
        reject(errorMessage);
      });
    }
  }
}
