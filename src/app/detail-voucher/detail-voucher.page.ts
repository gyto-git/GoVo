import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { QRCodeModule, FixMeLater } from 'angularx-qrcode';
import { Directory } from '@capacitor/filesystem';
import write_blob from 'capacitor-blob-writer';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-voucher',
  templateUrl: './detail-voucher.page.html',
  styleUrls: ['./detail-voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class DetailVoucherPage {
  @ViewChild(IonModal) modal!: IonModal;
  id: any;
  qrcode: any;
  ucode: any;
  data: any;
  loading: boolean = true;

  public qrCodeSrc!: SafeUrl;

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

  async confirm() {
    this.modal.dismiss();
  }

  // onChangeURL(url: SafeUrl) {
  //   this.qrCodeSrc = url;
  //   console.log(this.qrCodeSrc);
  // }

  // saveAsImage(parent: FixMeLater) {
  //   let parentElement = null;
  //   parentElement = parent.qrcElement.nativeElement
  //     .querySelector('canvas')
  //     .toDataURL('image/png');
  //   console.log(parentElement);
  //   // converts base 64 encoded image to blobData
  //   let blobData = this.convertBase64ToBlob(parentElement);
  //   // saves as image
  //   const blob = new Blob([blobData], { type: 'image/png' });

  //   // const url = window.URL.createObjectURL(blob);
  //   // const link: any = this.renderer.createElement('a');
  //   // this.renderer.setProperty(link, 'href', url);
  //   // this.renderer.setProperty(link, 'download', 'qrCode');
  //   // this.renderer.setStyle(link, 'display', 'none');
  //   // this.renderer.appendChild(this.element.nativeElement, link);
  //   // link.click();
  //   // console.log(this.renderer);
  //   // this.renderer.removeChild(this.element.nativeElement, link);
  //   // URL.revokeObjectURL(url);

  //   // const link = document.createElement('a');
  //   // link.href = url;
  //   // // name of the file
  //   // link.download = 'angularx-qrcode';
  //   // console.log(link);
  //   // link.click();

  //   write_blob({
  //     path: 'media/image/' + this.data.o_namaVoucher + '.png',
  //     directory: Directory.Documents,
  //     blob: blob,
  //     recursive: true,
  //     on_fallback(error) {
  //       console.error(error);
  //     },
  //   }).then(async () => {
  //     const alert = await this.alertController.create({
  //       header: 'Info',
  //       backdropDismiss: false,
  //       message: 'Kode QR berhasil didownload, Silahkan cek di gallery anda',
  //       buttons: ['Tutup'],
  //     });
  //     await alert.present();
  //   });
  // }

  // private convertBase64ToBlob(Base64Image: string) {
  //   // split into two parts
  //   const parts = Base64Image.split(';base64,');
  //   // hold the content type
  //   const imageType = parts[0].split(':')[1];
  //   // decode base64 string
  //   const decodedData = window.atob(parts[1]);
  //   // create unit8array of size same as row data length
  //   const uInt8Array = new Uint8Array(decodedData.length);
  //   // insert all character code into uint8array
  //   for (let i = 0; i < decodedData.length; ++i) {
  //     uInt8Array[i] = decodedData.charCodeAt(i);
  //   }
  //   // return blob image after conversion
  //   return new Blob([uInt8Array], { type: imageType });
  // }
}
