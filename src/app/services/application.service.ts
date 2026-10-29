import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface BasicInformationRequest {
  vorname: string;
  nachname: string;
  dateOfBirths: string;
  beruf: string;
  email: string;
}

export interface TariffOption {
  tariffId: string;
  name: string;
  monthlyPrice: number;
}

export interface TariffSelectionRequest {
  selectedTariffIds: string[];
}

export interface BankDetailsRequest {
  iban: string;
  accountHolder: string;
}

export interface ApplicationBasicInformationSummary {
  vorname: string;
  nachname: string;
  dateOfBirth: string;
  profession: string;
  email: string;
}

export interface ApplicationSummary {
  applicationId: string;
  status: string;
  basicInformation: ApplicationBasicInformationSummary | null;
  selectedTariffs: Array<{ tariffId: string }> | null;
  bankDetails: BankDetailsRequest | null;
  totalAmount: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/applications';
  private readonly applicationIdStorageKey = 'applicationId';

  createApplication(): Observable<string> {
    return this.http.post<string>(this.baseUrl, {});
  }

  storeApplicationId(applicationId: string): void {
    sessionStorage.setItem(this.applicationIdStorageKey, applicationId);
  }

  getApplicationId(): string | null {
    return sessionStorage.getItem(this.applicationIdStorageKey);
  }

  getApplication<TApplication = unknown>(
    applicationId: string
  ): Observable<TApplication> {
    return this.http.get<TApplication>(`${this.baseUrl}/${applicationId}`);
  }

  saveBasicInformation(
    applicationId: string,
    request: BasicInformationRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/basic-information`,
      request
    );
  }

  getTariffs(): Observable<TariffOption[]> {
    return this.http.get<TariffOption[]>('http://localhost:8080/tariffs');
  }

  saveTariffSelection(
    applicationId: string,
    request: TariffSelectionRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/tariffs`,
      request
    );
  }

  saveBankDetails(
    applicationId: string,
    request: BankDetailsRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/bank-details`,
      request
    );
  }

  getSummary(applicationId: string): Observable<ApplicationSummary> {
    return this.http.get<ApplicationSummary>(
      `${this.baseUrl}/${applicationId}/summary`
    );
  }

  submitApplication(applicationId: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/submit`,
      null
    );
  }
}