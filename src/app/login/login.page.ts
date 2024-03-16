import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponent],
})
export class LoginPage implements OnInit {
  password: any;
  email: any;
  data: any;

  constructor(
    private navCtrl: NavController,
    private storage: StorageService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {}

  async login() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    //siapkan data
    let data = {
      email: this.email,
      password: this.password,
    };
    let url = 'Auth';
    //apiTime
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        console.log(this.data);
        if (this.data.isLogin) {
          // disini kita cek level gek masuk apo idak, men idak tinggal buat if bla bla be gitu trus pasangke alert
          if (this.data.level == '2') {
            this.storage.set('login', 'true');
            this.storage.set('data', data);
            this.navCtrl.navigateRoot(['tabs']);
            loading.dismiss();
          } else {
            loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Info',
              backdropDismiss: false,
              message: 'Akun ini bukan akun owner',
              buttons: ['Tutup'],
            });
            await alert.present();
          }
        } else {
          let emailm = '';
          let passwordm = '';
          for (const key in this.data.messages) {
            if (key === 'email') {
              emailm = this.data.messages[key];
            } else if (key === 'password') {
              passwordm = this.data.messages[key];
            }
          }
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: emailm + '<br>' + passwordm,
            buttons: ['Tutup'],
          });
          await alert.present();
        }
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
      });
  }

  async toRegister() {
    this.navCtrl.navigateForward(['register']);
  }
}
