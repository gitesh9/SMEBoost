import { Component, OnInit } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-branding-details',
  standalone: false,
  templateUrl: './branding-details.html',
  styleUrl: './branding-details.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class BrandingDetails implements OnInit {
  brandingForm!: FormGroup;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.brandingForm = this.controlContainer.control?.get('brandingDetails') as FormGroup;
  }

  get socialMediaLinksForm(): FormGroup | null {
    return this.brandingForm.get('socialMediaLinks') as FormGroup | null;
  }

}
