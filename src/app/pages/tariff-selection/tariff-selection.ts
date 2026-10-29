import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService, TariffOption } from '../../services/application.service';

@Component({
  selector: 'app-tariff-selection',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tariff-selection.html',
  styleUrl: './tariff-selection.css'
})
export class TariffSelection implements OnInit {
  tariffs = signal<TariffOption[]>([]);
  selectedTariffIds = signal<string[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.getTariffs().subscribe({
      next: (tariffs) => {
        this.tariffs.set(tariffs);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(
          error,
          'Die Tarife konnten nicht geladen werden.'
        ));
        console.error('Failed to load tariffs:', error);
      }
    });
  }

  save(): void {
    if (this.isSaving() || this.selectedTariffIds().length === 0) {
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);

    const applicationId = this.applicationService.getApplicationId();
    if (!applicationId) {
      this.errorMessage.set('Application ID not found. Please start again.');
      return;
    }

    this.isSaving.set(true);
    this.applicationService
      .saveTariffSelection(applicationId, {
        selectedTariffIds: this.selectedTariffIds()
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/bank-details']);
        },
        error: (error: unknown) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(
            error,
            'Die Tarifauswahl konnte nicht gespeichert werden.'
          ));
          console.error('Failed to save tariff selection:', error);
        }
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  toggleTariff(tariffId: string, event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.selectedTariffIds.update((selectedTariffIds) =>
      event.target instanceof HTMLInputElement && event.target.checked
        ? [...selectedTariffIds, tariffId]
        : selectedTariffIds.filter((selectedId) => selectedId !== tariffId)
    );
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error;
      if (typeof response === 'object' && response !== null) {
        if ('message' in response && typeof response.message === 'string') {
          return response.message;
        }
        if ('detail' in response && typeof response.detail === 'string') {
          return response.detail;
        }
      }
    }

    return fallback;
  }
}
