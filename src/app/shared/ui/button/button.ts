import { Component, input,output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class LibButton {
  label = input.required<string>();
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  clicked = output<MouseEvent>();
}