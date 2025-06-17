import { Component, Input, OnChanges } from '@angular/core';
import { GlobalStore } from '../../global-store';

export interface ImageObject {
  caption: string,
  hashtags: string,
  image_prompt: string,
  business_name: string,
  image_url: string,
  image_file: string
}

@Component({
  selector: 'app-social-media-card',
  standalone: false,
  templateUrl: './social-media-card.html',
  styleUrl: './social-media-card.css'
})
export class SocialMediaCard implements OnChanges {
  @Input() data: ImageObject[] = []
  @Input() ind!: number
  @Input() loading = true;
  currentImage!: ImageObject;

  constructor(public myService: GlobalStore) { }

  ngOnChanges() {
    if (this.ind >= this.data.length) {
      this.loading = true
    } else {
      this.loading = false
      this.currentImage = this.data[this.ind]
      console.log("Current Image: ", this.currentImage)
    }
  }
}
