import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
// import {
//   Chart,
//   DoughnutController,
//   ArcElement,
//   Legend,
//   Tooltip,
// } from 'chart.js';
import { Chart } from 'chart.js/auto';
// Chart.register(DoughnutController, ArcElement, Legend, Tooltip);
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage {
  nama: any;
  ucode: any;
  data: any;
  //donut
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  doughnutChart: any;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.storage
      .get('data')
      .then((data) => {
        this.nama = data.name;
        this.ucode = data.ucode;
        this.loadData();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  ionViewWillLeave() {
    this.doughnutChart.destroy();
  }

  loadData() {
    //siapkan data
    let data = { ucode: this.ucode };
    let url = 'VoucherOwner/Chart';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        this.data = this.data.data;
        console.log(this.data);
        this.doughnutChartMethod();
        setTimeout(() => {}, 2000);
      })
      .catch((err) => {
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

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Voucher', 'Voucher yang diambil', 'Voucher yang diklaim'],
        datasets: [
          {
            label: 'Jumlah',
            data: [
              this.data.stok - this.data.ambil,
              this.data.ambil - this.data.klaim,
              this.data.klaim,
            ],
            backgroundColor: ['#77f540', '#3aa40c', '#39731b'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
    });
  }
}
