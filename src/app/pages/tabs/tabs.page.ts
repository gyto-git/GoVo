import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  name: any;
  member: any;
  constructor(private navCtrl: NavController, private storage: StorageService) {}

  ionViewWillEnter() {
    this.storage.get('login').then((data) => {
      if (data == null) {
        this.navCtrl.navigateRoot('login');
      }
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
}
