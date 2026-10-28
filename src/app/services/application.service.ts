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

  saveTariffSelection<TRequest extends object>(
    applicationId: string,
    request: TRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/tariffs`,
      request
    );
  }

  saveBankDetails<TRequest extends object>(
    applicationId: string,
    request: TRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${applicationId}/bank-details`,
      request
    );
  }

  getSummary<TSummary = unknown>(
    applicationId: string
  ): Observable<TSummary> {
    return this.http.get<TSummary>(
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