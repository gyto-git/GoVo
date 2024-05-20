import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActionSheetController,
  AlertController,
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { GmapsService } from '../../services/gmaps.service';
import { Last } from 'src/app/interface/voucher';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class MapsComponent implements OnInit {
  @ViewChild('map') mapElementRef?: ElementRef;
  googleMaps: any;
  center: any;
  map: any;
  mapClickListener: any;
  markerClickListener: any;
  markers: any[] = [];
  lastcord: any = [];
  check(val: any): boolean {
    return val.length === 0;
  }
  // [] = [];

  constructor(
    private modalCtrl: ModalController,
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private alertController: AlertController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    const coordinates = (await Geolocation.getCurrentPosition()).coords;
    this.center = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    console.log(this.center);
    this.lastcord = this.center;
    this.loadMap();
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
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
      this.onMapClick();
    } catch (e) {
      console.log(e);
    }
  }

  async onMapClick() {
    this.mapClickListener = this.googleMaps.event.addListener(
      this.map,
      'click',
      (mapsMouseEvent: { latLng: { toJSON: () => any } }) => {
        console.log(mapsMouseEvent.latLng.toJSON());
        this.lastcord = mapsMouseEvent.latLng.toJSON();
        this.cd.detectChanges();
        console.log(this.lastcord);
        this.addMarker(mapsMouseEvent.latLng);
      }
    );
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

  async checkAndRemoveMarker(marker: {
    position: { lat: () => any; lng: () => any };
  }) {
    const index = this.markers.findIndex(
      (x) =>
        x.position.lat() == marker.position.lat() &&
        x.position.lng() == marker.position.lng()
    );
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

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Added Marker',
  //     subHeader: '',
  //     buttons: [
  //       {
  //         text: 'Remove',
  //         role: 'destructive',
  //         data: {
  //           action: 'delete',
  //         },
  //       },
  //       {
  //         text: 'Save',
  //         data: {
  //           action: 'share',
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         data: {
  //           action: 'cancel',
  //         },
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  // }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'anda belum memilih lokasi',
      message: 'Silahkan Pilih lokasi',
      buttons: ['Kembali'],
    });

    await alert.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.lastcord);
    if (this.lastcord.length == 0) {
      return this.presentAlert();
    }
    return this.modalCtrl.dismiss(this.lastcord, 'confirm');
  }
}
