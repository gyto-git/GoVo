import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { Storage } from '@ionic/storage-angular';
import { StorageService } from './app/services/storage/storage.service';

import localeId from '@angular/common/locales/id';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeId, 'id');

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './app/services/api/api.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }), HttpClientModule),
    provideRouter(routes),
    Storage,
    StorageService,
    HttpClient,
    ApiService,
  ],
});
