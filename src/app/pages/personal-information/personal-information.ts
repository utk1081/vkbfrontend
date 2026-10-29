
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  isSaving = false;

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  save(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = null;

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
        this.router.navigate(['/tariff-selection']);
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

      if (
        typeof response === 'object' &&
        response !== null &&
        'messages' in response &&
        typeof response.messages === 'object' &&
        response.messages !== null
      ) {
        const firstValidationMessage = Object.values(response.messages).find(
          (message): message is string => typeof message === 'string'
        );
        if (firstValidationMessage) {
          return firstValidationMessage;
        }
      }
    }

    return 'Failed to save personal information.';
  }
}
