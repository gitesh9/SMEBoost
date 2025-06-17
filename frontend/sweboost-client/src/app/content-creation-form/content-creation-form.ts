import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataResponse } from '../data-types';
import { GlobalStore } from '../global-store';
import { API_URL } from '../const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-creation-form',
  standalone: false,
  templateUrl: './content-creation-form.html',
  styleUrl: './content-creation-form.css'
})
export class ContentCreationForm implements OnInit {
  contentForm!: FormGroup;
  loading = false

  constructor(private http: HttpClient, public fb: FormBuilder, public service: GlobalStore, public router: Router) { }

  ngOnInit() {
    this.contentForm = this.fb.group({
      businessDetails: this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        logo: [null, Validators.required],
      }),
      productDetails: this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        targetAudience: ['', Validators.required],
        price: ['', Validators.required],
      }),
      brandingDetails: this.fb.group({
        brandVoice: ['', Validators.required],
        language: ['', [Validators.required, Validators.minLength(2)]],
        socialMediaLinks: this.fb.group({
          instagram: ['', Validators.required],
          facebook: ['', Validators.required],
          x: ['', Validators.required]
        })
      }),
      customerDetails: this.fb.group({
        demographics: ['', Validators.required],
        preferences: ['', Validators.required],
        reviewsTestimonials: ['', Validators.required],
        FAQs: ['', Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.contentForm.valid) {
      if (this.service.streamActive) {
        new Error('Stream already active')
        return
      }
      this.loading = true;
      console.log('Submitted form:', this.contentForm.value);
      const data = { ...this.contentForm.value }
      const headers = new HttpHeaders({
        contentType: 'application/json'
      })
      this.contentForm.disable();
      this.http.post(API_URL + '/form', data, { headers }).subscribe({
        next: (res) => {
          const data: DataResponse = res as DataResponse;
          this.service.getStream(data.id);
          this.router.navigate(['blog'])
          this.loading = false;
        },
        error: (err) => console.error('Error:', err)
      });
      this.contentForm.enable();
    } else {
      console.log('Form is invalid', this.contentForm.value);
    }
  }
}

