import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    providePrimeNG({
      theme: {
        preset: Aura
      },
      license: 'eyJpZCI6ImNhNmMwYmZlLWY2NWEtNDE5ZC04ZWU3LTcxNjJjNTE3Zjk4NiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTMxMDM2NzgsImV4cCI6MTgyNDYzOTY3OH0.4Hn_ipeHux3V4nBqvJW3OsHQV-B11YMW7hm5h5V4_vhWtyGJ4WXpjCplqUPKQbNxdJFYlW0kkaMxIMOXeNNgAw'
    })
  ]
};