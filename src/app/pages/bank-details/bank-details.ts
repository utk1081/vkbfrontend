import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApplicationService,
  BankDetailsRequest
} from '../../services/application.service';

@Component({
  selector: 'app-bank-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bank-details.html',
  styleUrl: './bank-details.css'
})
export class BankDetails {
  accountHolder = '';
  iban = '';
  errorMessage = signal<string | null>(null);
  isSaving = signal(false);

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  save(): void {
    if (this.isSaving()) {
      return;
    }

    this.errorMessage.set(null);
    const applicationId = this.applicationService.getApplicationId();
    if (!applicationId) {
      this.errorMessage.set('Application ID not found. Please start again.');
      return;
    }

    const request: BankDetailsRequest = {
      iban: this.iban.replace(/\s+/g, '').toUpperCase(),
      accountHolder: this.accountHolder.trim()
    };

    this.isSaving.set(true);
    this.applicationService.saveBankDetails(applicationId, request).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/summary']);
      },
      error: (error: unknown) => {
        this.isSaving.set(false);
        this.errorMessage.set(
          this.getErrorMessage(error, 'Die Bankdaten konnten nicht gespeichert werden.')
        );
        console.error('Failed to save bank details:', error);
      }
    });
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
