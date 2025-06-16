import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataResponse } from '../data-types';
import { GlobalStore } from '../global-store';

@Component({
  selector: 'app-content-creation-form',
  standalone: false,
  templateUrl: './content-creation-form.html',
  styleUrl: './content-creation-form.css'
})
export class ContentCreationForm implements OnInit {
  URL_CONST = 'http://127.0.0.1:8000/api/form/';
  contentForm!: FormGroup;

  constructor(private http: HttpClient, public fb: FormBuilder, private service: GlobalStore) { }

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
      console.log('Submitted form:', this.contentForm.value);
      const data = { ...this.contentForm.value }
      const headers = new HttpHeaders({
        contentType: 'application/json'
      })
      this.http.post(this.URL_CONST, data, { headers }).subscribe({
        next: (res) => {
          const data: DataResponse = res as DataResponse;
          if (data.result.instagram_posts?.length == 0) {
            this.service.getData(data.id);
          }
          else {
            this.service.myData = data;
          }
          this.service.getData(data.id);

        },
        error: (err) => console.error('Error:', err)
      });
    } else {
      console.log('Form is invalid', this.contentForm.value);
    }
  }
}

