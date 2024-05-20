import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { QRCodeModule, FixMeLater } from 'angularx-qrcode';
import {
  Filesystem,
  Directory,
  Encoding,
  DownloadFileResult,
} from '@capacitor/filesystem';
import write_blob from 'capacitor-blob-writer';
import { Share } from '@capacitor/share';
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
  link: any = 'https://govo.my.id';

  gmap: any;

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
        this.gmap = encodeURIComponent(this.data.o_alamat);
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
          text:
            this.data.o_deskripsi +
            '\nklik link dibawah ini untuk mengambil.' +
            '\ngovo.my.id/app/share/' +
            this.data.o_kodeVoucher,
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
