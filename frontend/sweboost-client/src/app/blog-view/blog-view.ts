import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ResponseAIType } from '../data-types';
import { GlobalStore } from '../global-store';
import { Router } from '@angular/router';
import { ImageObject } from './social-media-card/social-media-card';



type BlogPiece =
  | { type: 'text'; content: string }
  | { type: 'card'; content: number };

interface HomeImg {
  imgUrl: string,
  imgFile: string | number,
}

@Component({
  selector: 'app-blog-view',
  standalone: false,
  templateUrl: './blog-view.html',
  styleUrl: './blog-view.css'
})
export class BlogView implements OnInit {
  data: Observable<ResponseAIType>;
  blogPieces: BlogPiece[] = [];
  instagramPosts: ImageObject[] = [];
  titleHandled = false;
  homeImg: HomeImg;
  campaignName = '';
  campaignTheme = '';
  stream!: Subscription;
  showInstaPost = false
  imageInd = 0

  constructor(private myService: GlobalStore, public router: Router, public cdr: ChangeDetectorRef) {
    this.data = myService.getData();
    this.homeImg = {
      imgUrl: 'string',
      imgFile: '',
    }
  }

  ngOnInit() {
    if (!this.myService.streamActive) {
      this.router.navigate(['services'])
    }
    this.stream = this.data.subscribe((res) => {
      console.log('noww: ', res)

      if (res.status === 'Complete') {
        this.unSubscribe();
      } else if (res.blog) {
        this.parseBlog(res.blog);
      } else if (res.campaign && this.campaignName == '') {
        this.campaignName = res.campaign.campaign_name
        this.campaignTheme = res.campaign.campaign_theme
        this.homeImg.imgUrl = res.campaign.home_image_url
        this.homeImg.imgFile = res.campaign.home_image_file
      } else if (res.instagram_posts) {
        this.instagramPosts = [...this.instagramPosts, res.instagram_posts]
      }
      this.cdr.detectChanges();
    })
    console.log(this.blogPieces)
  }

  unSubscribe() {
    this.stream.unsubscribe()
  }

  parseBlog(blogText: string) {
    const instaRegex = /\[instagram_post_(\d+)\]/g;
    this.blogPieces = [];
    let lastIndex = 0;
    let match;

    while ((match = instaRegex.exec(blogText)) !== null) {
      // const idx = Number(match[1]);

      const textChunk = blogText.slice(lastIndex, match.index).trim();
      if (textChunk) {
        this.blogPieces.push({ type: 'text', content: this.convertToMarkdown(textChunk) });
      }

      this.blogPieces.push({ type: 'card', content: this.imageInd++ });

      lastIndex = instaRegex.lastIndex;
    }

    const remainingText = blogText.slice(lastIndex).trim();
    if (remainingText) {
      this.blogPieces.push({ type: 'text', content: this.convertToMarkdown(remainingText) })
    }
  }

  convertToMarkdown(text: string) {
    const lines = text.split('\n').map(line => line.trim());
    let html = '';
    let inList = false;
    let currentListType: 'ul' | 'ol' | null = null;

    const unorderedListRegex = /^([-*•+])\s+(.*)/;
    // eslint-disable-next-line no-useless-escape
    const orderedListRegex = /^(\d+[\.\)])\s+(.*)/;

    lines.forEach(line => {
      if (!line) {
        html += '<br>';
        return;
      }

      if (!this.titleHandled && line.startsWith('Title:')) {
        const title = line.startsWith('Title:') ? line.replace('Title:', '').trim() : line;
        html += `<h1 class='font-semibold text-gray-900 dark:text-white sm:text-2xl'>${title}</h1>`;
        this.titleHandled = true;
        return;
      }

      const unorderedMatch = unorderedListRegex.exec(line);
      const orderedMatch = orderedListRegex.exec(line);

      if (unorderedMatch) {
        if (!inList || currentListType !== 'ul') {
          if (inList) html += `</${currentListType}>`;
          inList = true;
          currentListType = 'ul';
          html += '<ul class="list-outside list-disc space-y-4 pl-4 text-base font-normal text-gray-500 dark:text-gray-400">';
        }
        html += `<li>${unorderedMatch[2]}</li>`;
      } else if (orderedMatch) {
        if (!inList || currentListType !== 'ol') {
          if (inList) html += `</${currentListType}>`;
          inList = true;
          currentListType = 'ol';
          html += '<ol class="list-outside list-decimal space-y-4 pl-4 text-base font-normal text-gray-500 dark:text-gray-400">';
        }
        html += `<li>${orderedMatch[2]}</li>`;
      } else {
        if (inList) {
          html += `</${currentListType}>`;
          inList = false;
          currentListType = null;
        }
        html += `<p class="text-base font-normal text-gray-500 dark:text-gray-400">${line}</p>`;
      }
    });

    if (inList) {
      html += `</${currentListType}>`;
    }

    return html;
  }

  isHomeImgAvailable(): boolean {
    return this.homeImg.imgUrl !== '';
  }
}

