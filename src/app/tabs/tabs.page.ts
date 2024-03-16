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
