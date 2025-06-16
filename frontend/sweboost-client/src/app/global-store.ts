import { Injectable } from '@angular/core';
import { DataResponse, Result } from './data-types';
import { Subject } from 'rxjs';
import { API_URL } from './const';

@Injectable({
  providedIn: 'root'
})
export class GlobalStore {
  private dataSubject = new Subject<DataResponse>();
  private data$ = this.dataSubject.asObservable();
  private _myData: DataResponse = {
    id: '',
    result: {
      blog: '',
      campaign: {},
      instagram_posts: [],
      status: 'Updating'
    },
    status: ''
  };
  private source: EventSource | undefined;
  streamActive = false;

  getStream(id: string) {
    if (this.streamActive) {
      new Error('Stream already active')
      return
    }
    this._myData.id = id;
    this._myData.status = 'Updating';
    this.source = new EventSource(`${API_URL}/stream/${id}`)
    this.streamActive = true;
    console.log('Called');
    let campaign = ''
    let insta_posts = ''


    this.source.onmessage = event => {
      const payload = JSON.parse(event.data) as Partial<Result>;
      console.log('data: ', payload);
      const rawData = event.data.trim();

      if (payload.status == 'Complete' || rawData === '[DONE]') {
        this.processData(campaign, insta_posts);
        console.log("DATA RECIEVED FINALLY: ", this._myData)
        this.source?.close();
      }

      // Handle nested updates in 'result'
      if (payload.campaign) {
        campaign = campaign + payload.campaign
      }

      if (payload.instagram_posts) {
        insta_posts = insta_posts + payload.instagram_posts
      }

      if (payload.blog) {
        this._myData.result.blog = payload.blog;
      }

      this.dataSubject.next(event.data)
    };

    this.source.onerror = (error) => {
      this.streamActive = false;
      this.processData(campaign, insta_posts)
      console.log('FIRST SHOW DATA:', this._myData);
      console.error('Stream Error:', error);
      this.source?.close();
    };

  }

  closeStream() {
    this.streamActive = false;
    this.source?.close();
  }

  getData() {
    return this.data$
  }

  set myData(data: DataResponse) {
    this._myData = { ...data }
  }

  stopStreaming() {
    if (this.source) {
      this.streamActive = false;
      this.source.close();
    }
  }
  removeTrailingCommas(jsonString: string) {
    jsonString = jsonString.replace(/,\s*}/g, '}');
    // Remove trailing commas before ]
    jsonString = jsonString.replace(/,\s*]/g, ']');
    return jsonString;
  }
  processData(campaign: string, insta_posts: string) {
    campaign = this.removeTrailingCommas(campaign)
    insta_posts = this.removeTrailingCommas(insta_posts)
    console.log(campaign)
    console.log(insta_posts)
    const campaignData = JSON.parse(campaign)
    const instagramPosts = JSON.parse(insta_posts)
    this._myData.result = { campaign: campaignData, instagram_posts: instagramPosts }
  }
}

