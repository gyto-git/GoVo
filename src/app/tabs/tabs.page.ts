import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  public login: string = '';
  public name: any;
  public member: any;
  constructor(
    private navCtrl: NavController,
    private storage: StorageService
  ) {}

  ionViewWillEnter() {
    this.storage.get('login').then((data) => {
      if (data == null) {
        this.navCtrl.navigateRoot('login');
      }
      this.login = data;
      this.storage
        .get('data')
        .then((data) => {
          this.name = data.name;
          this.member = data.member;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  async logOut() {
    this.storage.clear();
    this.navCtrl.navigateRoot('login');
  }

  async qr() {
    this.navCtrl.navigateForward(['qr-example']);
  }

  async gen() {
    this.navCtrl.navigateForward(['qr-generator']);
  }
}
