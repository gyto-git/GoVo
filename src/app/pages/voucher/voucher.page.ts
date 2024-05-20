import { Component } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { NavigationExtras } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule, formatDate } from '@angular/common';
import { Voucher } from '../../interface/voucher';
import { HideHeaderDirective } from 'src/app/directives/hideHeader/hide-header.directive';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voucher',
  templateUrl: 'voucher.page.html',
  styleUrls: ['voucher.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HideHeaderDirective],
})
export class VoucherPage {
  paramsSubscription!: Subscription;
  // config
  link: any = 'https://govo.my.id';
  // data default
  code: any;
  data: any;
  // untuk voucher
  voucher: Voucher[] = [];
  voucher_temp: Voucher[] = [];
  // untuk sorting
  dActive: Voucher[] = [];
  dNonActive: Voucher[] = [];
  //untuk search
  searchEnabled = false;
  constructor(private api: ApiService, private storage: StorageService, private navCtrl: NavController, private alertController: AlertController, private route: ActivatedRoute) {}

  //Ambil data
  ngOnInit() {
    // we use param thing here so the app know there is change.. thats it lol
    console.log('inside on-init');
    this.paramsSubscription = this.route.params.subscribe((params) => {
      console.log('inside on-init again');
      // this.ionViewWillEnter();
      // it will trigger when ever come back to this page
      this.storage
        .get('data')
        .then((data) => {
          this.code = data.ucode;
          this.loadData();
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  //Load Data dari api
  async loadData() {
    this.dActive = [];
    this.dNonActive = [];
    //siapkan data
    let data = { code: this.code };
    let url = 'VoucherOwner';
    //api TIME
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        this.voucher = this.data.data;
        this.voucher_temp = this.data.data;
        console.log(this.voucher);
        this.voucher.filter((item) => {
          let today = formatDate(new Date(), 'yyyy-MM-dd', 'id-ID');
          let data = formatDate(item.o_tanggalAkhir, 'yyyy-MM-dd', 'id-ID');
          if (data < today) {
            this.dNonActive.push(item);
          } else {
            this.dActive.push(item);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // buka detail
  async toDetail(id: any) {
    let data: NavigationExtras = {
      queryParams: {
        id: id,
      },
    };
    this.navCtrl.navigateForward(['detail'], data);
  }
  //buka tambah voucher
  async toTambah() {
    this.navCtrl.navigateForward(['add']);
  }
  // untuk search
  async search(ev: any) {
    if (ev.detail.value == '') {
      this.searchEnabled = false;
    } else {
      this.searchEnabled = true;
      this.voucher_temp = this.voucher.filter((element: any) => {
        return element.o_namaVoucher.toLowerCase().includes(ev.target.value.toLowerCase());
      });
    }
    console.log(ev);
  }
}
