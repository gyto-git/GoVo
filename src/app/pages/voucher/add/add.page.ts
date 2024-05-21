import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, DomController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GmapsService } from 'src/app/services/gmaps/gmaps.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HideHeaderDirective } from 'src/app/directives/hideHeader/hide-header.directive';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HideHeaderDirective],
})
export class AddPage {
  // urusan halaman
  @ViewChild('map') mapElementRef?: ElementRef;
  @ViewChild('page1') page1!: any;
  @ViewChild('page2') page2!: any;
  @ViewChild('page3') page3!: any;
  pages = 1;
  kota: any;
  // data yang diinput
  data: any;
  code: any;
  o_namaVoucher: any;
  o_stokVoucher: any;
  o_deskripsi: any;
  o_tanggalMulai: any;
  o_tanggalAkhir: any;
  o_alamat: any;
  o_kota: any;
  //pict stuff
  images: any = '';
  showpict: any;
  // gmaps stuff
  googleMaps: any;
  map: any;
  mapClickListener: any;
  markerClickListener: any;
  markers: any[] = [];
  lastcord: any = [];
  lat = 0;
  lng = 0;
  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController,
    private gmaps: GmapsService,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private storage: StorageService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ionViewDidEnter() {
    this.api.getOther(`https://gyto-git.github.io/api-wilayah-indonesia/api/regencies/16.json`).then((data) => {
      console.log(data);
      this.kota = data;
    });
    const coordinates = (await Geolocation.getCurrentPosition()).coords;
    this.lat = coordinates.latitude;
    this.lng = coordinates.longitude;
  }

  //untuk foto
  async ambilfoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      height: 480,
      width: 360,
    });
    this.images = image;
    this.showpict = `${'data:text/html;base64,' + image.base64String}`;
    console.log(this.images);
  }

  //untuk halaman
  async nextPage() {
    this.pages++;
    this.changePage();
  }
  async prevPage() {
    this.pages--;
    this.changePage();
  }
  async changePage() {
    // console.log('ey');
    if (this.pages == 1) {
      this.domCtrl.write(() => {
        this.renderer.removeClass(this.page1.el, 'hidden');
        this.renderer.addClass(this.page2.el, 'hidden');
        this.renderer.addClass(this.page3.el, 'hidden');
      });
    } else if (this.pages == 2) {
      this.domCtrl.write(() => {
        this.renderer.addClass(this.page1.el, 'hidden');
        this.renderer.removeClass(this.page2.el, 'hidden');
        this.renderer.addClass(this.page3.el, 'hidden');
      });
    } else if (this.pages == 3) {
      this.domCtrl.write(() => {
        if (this.markers.length <= 0) {
          this.loadMap();
        }
        this.renderer.addClass(this.page1.el, 'hidden');
        this.renderer.addClass(this.page2.el, 'hidden');
        this.renderer.removeClass(this.page3.el, 'hidden');
      });
    }
  }

  //gmaps untuk MENAMBAHKAN
  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(this.lat, this.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
        // styles: [
        //   {
        //     featureType: 'administrative',
        //     elementType: 'geometry',
        //     stylers: [
        //       {
        //         visibility: 'off',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'poi',
        //     stylers: [
        //       {
        //         visibility: 'on',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'road',
        //     elementType: 'labels.icon',
        //     stylers: [
        //       {
        //         visibility: 'on',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'road.arterial',
        //     elementType: 'labels',
        //     stylers: [
        //       {
        //         visibility: 'off',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'road.highway',
        //     elementType: 'labels',
        //     stylers: [
        //       {
        //         visibility: 'off',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'road.local',
        //     stylers: [
        //       {
        //         visibility: 'off',
        //       },
        //     ],
        //   },
        //   {
        //     featureType: 'transit',
        //     stylers: [
        //       {
        //         visibility: 'off',
        //       },
        //     ],
        //   },
        // ],
      });
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
      this.onMapClick();
    } catch (e) {
      console.log(e);
    }
  }

  async onMapClick() {
    this.mapClickListener = this.googleMaps.event.addListener(this.map, 'click', (mapsMouseEvent: { latLng: { toJSON: () => any } }) => {
      console.log(mapsMouseEvent.latLng.toJSON());
      this.lat = mapsMouseEvent.latLng.toJSON().lat;
      this.lng = mapsMouseEvent.latLng.toJSON().lng;
      console.log(this.lat, this.lng);
      this.lastcord = mapsMouseEvent.latLng.toJSON();
      this.cd.detectChanges();
      console.log(this.lastcord);
      this.addMarker(mapsMouseEvent.latLng);
    });
  }

  async addMarker(location: { toJSON: () => any }) {
    this.clearOverlays();
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
    this.markers.push(marker);
    // this.presentActionSheet();
    // this.markerClickListener = this.googleMaps.event.addListener(
    //   marker,
    //   'click',
    //   () => {
    //     console.log('markerclick', marker);
    //     this.checkAndRemoveMarker(marker);
    //     console.log('markers: ', this.markers);
    //   }
    // );
  }

  async checkAndRemoveMarker(marker: { position: { lat: () => any; lng: () => any } }) {
    const index = this.markers.findIndex((x) => x.position.lat() == marker.position.lat() && x.position.lng() == marker.position.lng());
    console.log('is marker already: ', index);
    if (index >= 0) {
      this.markers[index].setMap(null);
      this.markers.splice(index, 1);
      return;
    }
  }

  async clearOverlays() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  // kirim data
  async submit() {
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
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    //siapkan data
    let data = {
      code: this.code,
      o_namaVoucher: this.o_namaVoucher,
      o_stokVoucher: this.o_stokVoucher,
      o_deskripsi: this.o_deskripsi,
      o_tanggalMulai: this.o_tanggalMulai,
      o_tanggalAkhir: this.o_tanggalAkhir,
      o_alamat: this.o_alamat,
      o_kota: this.o_kota,
      o_lat: this.lat,
      o_lng: this.lng,
      img: this.images,
    };
    console.log(data);
    let url = 'VoucherOwner/Create';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        loading.dismiss();
        this.data = data;
        if (this.data.isCreate) {
          const alert = await this.alertCtrl.create({
            header: 'Sucess',
            backdropDismiss: false,
            message: 'Voucher sudah dibuat',
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
          console.log(this.data.messages);
          let temp = '';
          for (const key in this.data.messages) {
            if (key === 'o_namaVoucher') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_stokVoucher') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_deskripsi') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_tanggalMulai') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_tanggalAkhir') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_alamat') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_kota') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_lat') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'o_lng') {
              temp += this.data.messages[key] + '<br>';
            } else if (key === 'img') {
              temp += this.data.messages[key] + '<br>';
            }
          }
          loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Info',
            backdropDismiss: false,
            message: `${temp}`,
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
}
