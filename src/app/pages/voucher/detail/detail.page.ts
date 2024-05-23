import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { GmapsService } from 'src/app/services/gmaps/gmaps.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ApiService } from 'src/app/services/api/api.service';
import { FadeHeaderDirective } from 'src/app/directives/fadeHeader/fade-header.directive';
import { Chart } from 'chart.js/auto';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FadeHeaderDirective],
})
export class DetailPage implements OnInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  barChart: any;
  //data yang ditampilkan
  @ViewChild('map') mapElementRef?: ElementRef;
  data: any;
  id: any;
  nama: any;
  ucode: any;
  public theDetail = {
    title: '',
    owned: '',
    stock: '',
    fromWhen: '',
    toWhen: '',
    description: '',
    image: '',
    town: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
    status: {
      stok: '',
      ambil: '',
      klaim: '',
    },
  };
  //gmaps stuff
  googleMaps: any;
  map: any;
  mapClickListener: any;
  markerClickListener: any;
  markers: any[] = [];
  lastcord: any = [];
  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private storage: StorageService,
    private api: ApiService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.storage
        .get('data')
        .then((data) => {
          this.nama = data.name;
          this.ucode = data.ucode;
          console.log(this.ucode);
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  ionViewWillLeave() {
    this.barChart.destroy();
  }
  // load data dari database
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
        console.log(this.data);
        this.theDetail = {
          title: this.data.o_namaVoucher,
          owned: this.nama,
          stock: this.data.o_stokVoucher,
          fromWhen: this.data.o_tanggalMulai,
          toWhen: this.data.o_tanggalAkhir,
          description: this.data.o_deskripsi,
          image: 'https://govo.my.id/uploads/client/' + this.data.o_foto,
          town: this.data.o_kota,
          address: this.data.o_alamat,
          location: {
            lat: this.data.o_lat,
            lng: this.data.o_lng,
          },
          status: {
            stok: this.data.o_stokVoucher,
            ambil: this.data.o_ambil,
            klaim: this.data.o_klaim,
          },
        };
        setTimeout(() => {
          this.loadMap();
          this.handleBarChart();
          // this.loading = false;
        }, 2000);
      })
      .catch((err) => {
        this.presentAlert('Error', err.respon);
      });
  }
  // loading untuk grafik
  async handleBarChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Stok', 'Voucher Diambil', 'Voucher Diklaim'],
        datasets: [
          {
            label: 'Total',
            data: [this.data.o_stokVoucher, this.data.o_ambil, this.data.o_klaim],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
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

  // loading map
  async loadMap() {
    try {
      console.log('im here');
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(this.theDetail.location.lat, this.theDetail.location.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 12,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'poi',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'road.local',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'transit',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
        ],
      });
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
      console.log('im here!!');
    } catch (e) {
      console.log(e);
    }
  }

  async addMarker(location: { toJSON: () => any }) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50),
    };
    const marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      // draggable: true,
      animation: googleMaps.Animation.DROP,
    });
    console.log('im also here');
    this.markers.push(marker);
  }
  // edit data
  async edit() {
    let data: NavigationExtras = {
      queryParams: {
        id: this.id,
      },
    };
    this.navCtrl.navigateForward(['edit'], data);
  }
  // hapus data
  async hapus() {
    let data = { ucode: this.ucode, id: this.id };
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
                  this.navCtrl.navigateBack(['tabs/voucher']);
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

  //bagi voucher
  async share() {
    console.log('inside');
    try {
      const result = Filesystem.downloadFile({
        path: 'temp.jpeg',
        url: 'https://govo.my.id/uploads/client/' + this.data.o_foto,
        directory: Directory.Cache,
      }).then((res) => {
        console.log(res.path);
        Share.share({
          title: this.data.o_namaVoucher,
          text: this.data.o_deskripsi + '\nklik link dibawah ini untuk mengambil.' + '\ngovo.my.id/app/share/' + this.data.o_kodeVoucher,
          files: ['file://' + res.path!],
        });
      });
      setTimeout('', 5000);
      // writeFile({
      //   path: 'KB7SRyjtxo.jpeg',
      //   data: 'https://govo.my.id/uploads/client/KB7SRyjtxo.jpeg',
      //   directory: Directory.Cache,
      // });
      // console.log('file Downloaded', result);
      // setTimeout('', 5000);
      // await Share.share({
      //   title: this.data.o_namaVoucher,
      //   text:
      //     this.data.o_deskripsi +
      //     '\nklik link dibawah ini untuk mengambil.' +
      //     '\ngovo.my.id/app/share/' +
      //     this.data.o_kodeVoucher,
      //   files: [result.uri],
      // });
    } catch (e) {
      console.error('Unable to write file', e);
    }
  }
}
