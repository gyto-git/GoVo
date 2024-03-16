import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private alertController: AlertController,
    private storage: StorageService
  ) {}
  name: any;
  email: any;
  password: any;
  data: any;

  ngOnInit() {}

  async register() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    //siapkan data
    let data = {
      name: this.name,
      email: this.email,
      password: this.password,
      level: '2',
    };
    let url = 'Auth/Register';
    //apiTime
    this.api
      .send(data, url)
      .then(async (data) => {
        this.data = data;
        console.log(this.data);
        if (this.data.isRegister) {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Sucess',
            backdropDismiss: false,
            message: 'account made sucessfully',
            buttons: [
              {
                text: 'Tutup',
                role: 'confirm',
                handler: () => {
                  this.Login();
                },
              },
            ],
          });
          await alert.present();
        } else {
          let namem = '';
          let emailm = '';
          let passwordm = '';
          for (const key in this.data.messages) {
            if (key === 'name') {
              namem = this.data.messages[key];
            } else if (key === 'email') {
              emailm = this.data.messages[key];
            } else if (key === 'password') {
              passwordm = this.data.messages[key];
            }
          }
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: namem + '<br>' + emailm + '<br>' + passwordm,
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

  async Login() {
    this.navCtrl.navigateRoot(['login']);
  }
}
