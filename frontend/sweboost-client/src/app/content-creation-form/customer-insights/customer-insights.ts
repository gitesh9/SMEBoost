import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-customer-insights',
  standalone: false,
  templateUrl: './customer-insights.html',
  styleUrl: './customer-insights.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustomerInsights implements OnInit {
  customerForm!: FormGroup;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.customerForm = this.controlContainer.control?.get('customerDetails') as FormGroup;
  }
}
