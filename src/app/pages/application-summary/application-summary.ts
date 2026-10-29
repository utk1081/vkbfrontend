import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  ApplicationService,
  ApplicationSummary as ApplicationSummaryData,
  TariffOption
} from '../../services/application.service';

@Component({
  selector: 'app-application-summary',
  standalone: true,
  templateUrl: './application-summary.html',
  styleUrl: './application-summary.css'
})
export class ApplicationSummaryPage implements OnInit {
  summary = signal<ApplicationSummaryData | null>(null);
  tariffs = signal<TariffOption[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    const applicationId = this.applicationService.getApplicationId();
    if (!applicationId) {
      this.isLoading.set(false);
      this.errorMessage.set('Application ID not found. Please start again.');
      return;
    }

    forkJoin({
      summary: this.applicationService.getSummary(applicationId),
      tariffs: this.applicationService.getTariffs()
    }).subscribe({
      next: ({ summary, tariffs }) => {
        this.summary.set(summary);
        this.tariffs.set(tariffs);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          this.getErrorMessage(error, 'Die Zusammenfassung konnte nicht geladen werden.')
        );
        console.error('Failed to load application summary:', error);
      }
    });
  }

  submit(): void {
    const applicationId = this.applicationService.getApplicationId();
    const currentSummary = this.summary();
    if (
      this.isSubmitting() ||
      !applicationId ||
      !currentSummary ||
      currentSummary.status === 'SUBMITTED'
    ) {
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSubmitting.set(true);
    this.applicationService.submitApplication(applicationId).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.summary.update((summary) =>
          summary ? { ...summary, status: 'SUBMITTED' } : summary
        );
        this.successMessage.set('Ihr Antrag wurde erfolgreich übermittelt.');
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          this.getErrorMessage(error, 'Der Antrag konnte nicht übermittelt werden.')
        );
        console.error('Failed to submit application:', error);
      }
    });
  }

  getTariffName(tariffId: string): string {
    return this.tariffs().find((tariff) => tariff.tariffId === tariffId)?.name ?? tariffId;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error;
      if (typeof response === 'object' && response !== null) {
        if ('message' in response && typeof response.message === 'string') {
          return response.message;
        }
        if (
          'messages' in response &&
          typeof response.messages === 'object' &&
          response.messages !== null
        ) {
          const validationMessage = Object.values(response.messages).find(
            (message): message is string => typeof message === 'string'
          );
          if (validationMessage) {
            return validationMessage;
          }
        }
      }
    }

    return fallback;
  }
}
