
import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { PersonalInformation } from './pages/personal-information/personal-information';
import { TariffSelection } from './pages/tariff-selection/tariff-selection';
import { BankDetails } from './pages/bank-details/bank-details';
import { ApplicationSummaryPage } from './pages/application-summary/application-summary';

export const routes: Routes = [
  {
    path: '',
    component: Welcome
  },
  {
    path: 'personal-information',
    component: PersonalInformation
  },
  {
    path: 'tariff-selection',
    component: TariffSelection
  },
  {
    path: 'bank-details',
    component: BankDetails
  },
  {
    path: 'summary',
    component: ApplicationSummaryPage
  }
];
