
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LibButton } from '../../shared/ui/button/button';
import {
  ApplicationService,
  BasicInformationRequest
} from '../../services/application.service';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [FormsModule, InputTextModule, LibButton],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css'
})
export class PersonalInformation {
  vorname = '';
  nachname = '';
  dateOfBirths = '';
  beruf = '';
  email = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSaving = false;

  constructor(private applicationService: ApplicationService) {}

  save(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const applicationId = this.applicationService.getApplicationId();

    if (!applicationId) {
      this.errorMessage = 'Application ID not found. Please start again.';
      return;
    }

    const request: BasicInformationRequest = {
      vorname: this.vorname,
      nachname: this.nachname,
      dateOfBirths: this.dateOfBirths,
      beruf: this.beruf,
      email: this.email
    };

    this.isSaving = true;
    this.applicationService.saveBasicInformation(applicationId, request).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Ihre persönlichen Angaben wurden gespeichert.';
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = this.getSaveErrorMessage(error);
        console.error('Failed to save personal information:', error);
      }
    });
  }

  private getSaveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error;
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response &&
        typeof response.message === 'string'
      ) {
        return response.message;
      }
    }

    return 'Failed to save personal information.';
  }
}
