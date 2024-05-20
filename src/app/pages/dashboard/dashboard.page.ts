import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HideHeaderDirective } from 'src/app/directives/hideHeader/hide-header.directive';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HideHeaderDirective],
})
export class DashboardPage {
  // chart part
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  doughnutChart: any;
  barChart: any;
  activePer: any;
  // for default data
  nama: any;
  ucode: any;
  data: any;
  constructor(private navCtrl: NavController, private storage: StorageService, private api: ApiService) {}
  //masuk layar
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
  //keluar layar
  ionViewWillLeave() {
    this.doughnutChart.destroy();
  }
  // load data dari database
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
        this.handlePieChart();
        this.activePer = this.data.Aktif / this.data.All;
        setTimeout(() => {}, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // logout
  async logOut() {
    this.storage.clear();
    this.navCtrl.navigateRoot('login');
  }
  // urus chart
  async handlePieChart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Belum Diambil', 'Diambil', 'Diambil & Diklaim'],
        datasets: [
          {
            label: 'Total',
            data: [this.data.stok - this.data.ambil, this.data.ambil, this.data.klaim],
            backgroundColor: ['#39731b', '#3aa40c', '#77f540'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
