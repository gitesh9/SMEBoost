import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-business-details',
  standalone: false,
  templateUrl: './business-details.html',
  styleUrl: './business-details.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class BusinessDetails implements OnInit {
  businessForm!: FormGroup;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.businessForm = this.controlContainer.control?.get('businessDetails') as FormGroup;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.businessForm.get('logo')?.setValue(null);
      return;
    }

    const file = input.files[0];
    this.businessForm.get('logo')?.setValue(file);
  }
}
