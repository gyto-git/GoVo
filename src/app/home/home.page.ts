import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage {
  nama: any;

  constructor(private storage: StorageService) {}

  ionViewWillEnter() {
    this.storage
      .get('data')
      .then((data) => {
        this.nama = data.name;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
