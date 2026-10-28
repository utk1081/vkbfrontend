
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LibButton } from '../../shared/ui/button/button';
import { LibTextField } from '../../shared/ui/text-field/text-field';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [LibButton, LibTextField],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
  errorMessage: string | null = null;
  isCreatingApplication = false;

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  startApplication(): void {
    if (this.isCreatingApplication) {
      return;
    }

    this.errorMessage = null;
    this.isCreatingApplication = true;

    this.applicationService.createApplication().subscribe({
      next: (applicationId) => {
        if (!applicationId) {
          this.isCreatingApplication = false;
          this.errorMessage = 'The server did not return an application ID.';
          return;
        }

        this.applicationService.storeApplicationId(applicationId);
        this.isCreatingApplication = false;
        this.router.navigate(['/personal-information']);
      },
      error: (error: unknown) => {
        this.isCreatingApplication = false;
        this.errorMessage = 'Failed to create application.';
        console.error('Failed to create application:', error);
      }
    });
  }
}
