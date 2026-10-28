import { Component, input, output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-text-field',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css'
})
export class LibTextField {
  label = input.required<string>();
  placeholder = input('');
  required = input(false);
  type = input('text');
  value = input('');
  valueChange = output<string>();
}