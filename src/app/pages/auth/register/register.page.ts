import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage {
  public switchPass = {
    enabled: false,
    text: 'tampilkan password',
    type: 'password',
  };
  //register
  data: any;
  uname: any;
  email: any;
  password: any;

  switching() {
    if (this.switchPass.enabled == false) {
      this.switchPass.enabled = true;
      this.switchPass.text = 'sembunyikan password';
      this.switchPass.type = 'text';
    } else {
      this.switchPass.enabled = false;
      this.switchPass.text = 'tampilkan password';
      this.switchPass.type = 'password';
    }
  }
  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private api: ApiService, private alertController: AlertController) {}
  // pergi ke login
  async toLogin() {
    this.navCtrl.navigateForward(['login']);
  }
  // untuk register
  async register() {
    //loading dimulai
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    await loading.present();
    //siapkan data
    let data = {
      name: this.uname,
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
                  this.toLogin();
                },
              },
            ],
          });
          await alert.present();
        } else {
          let namem = '';
          let emailm = '';
          let passwordm = '';
          let messages = '';
          for (const key in this.data.messages) {
            if (key === 'name') {
              namem = this.data.messages[key];
              messages = messages + namem + '<br>';
            } else if (key === 'email') {
              emailm = this.data.messages[key];
              messages = messages + emailm + '<br>';
            } else if (key === 'password') {
              passwordm = this.data.messages[key];
              messages = messages + passwordm + '<br>';
            }
          }
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Info',
            backdropDismiss: false,
            message: messages,
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
}
