import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  data: any = null;
  // public base_url = 'http://localhost:8080/';
  public base_url = 'https://govo.my.id/';
  constructor(private http: HttpClient) {}

  async send(request: any, url: string) {
    try {
      let data_request = JSON.stringify({ data: request });
      console.log(data_request);
      let link = this.base_url + url;
      return new Promise((resolve, reject) => {
        this.http.post(link, data_request).subscribe({
          next: (data) => {
            this.data = data;
            resolve(this.data);
          },
          error: (err) => {
            console.log(err);
            let errorMessage = {
              status: err.status,
              respon: 'terjadi kesalahan sistem',
            };
            if (err.status == 0) {
              errorMessage = {
                status: err.status,
                respon: 'terjadi kesalahan koneksi',
              };
            }
            reject(errorMessage);
          },
        });
      });
    } catch (rejectedReason: any) {
      return new Promise((resolve, reject) => {
        let errorMessage = {
          status: rejectedReason.status,
          respon: 'terjadi kesalahan koneksi',
        };
        reject(errorMessage);
      });
    }
  }

  //akhir
}
