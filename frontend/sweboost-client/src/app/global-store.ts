import { Injectable } from '@angular/core';
import { DataResponse, ResponseAIType } from './data-types';
import { Subject } from 'rxjs';
import { API_URL } from './const';
@Injectable({
  providedIn: 'root'
})
export class GlobalStore {
  private dataSubject = new Subject<ResponseAIType>();
  private data$ = this.dataSubject.asObservable();
  private _myData: DataResponse = {
    id: '',
    result: {
      blog: '',
      campaign: {
        campaign_name: ''
      },
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


    this.source.onmessage = event => {
      console.log(event)
      const payload = JSON.parse(event.data.trim());
      console.log('data: ', payload);

      if (payload.status == 'Complete' || payload === '[DONE]') {
        // console.log("DATA RECIEVED FINALLY: ", this._myData)
        console.log("DATA RECIEVED FINALLY: ", this._myData)
        this.streamActive = false;
        this.source?.close();
      }

      // Handle nested updates in 'result'
      if (payload.campaign) {
        // campaign = JSON.parse(payload.campaign)
        this._myData.result.campaign = payload.campaign
      }

      if (payload.instagram_posts) {
        // insta_posts = JSON.parse(payload.instagram_posts)
        this._myData.result.instagram_posts?.push(payload.instagram_posts)
      }

      if (payload.blog) {
        this._myData.result.blog = payload.blog;
      }

      this.dataSubject.next(payload)
    };

    this.source.onerror = (error) => {
      this.source?.close();
      this.streamActive = false;
      console.log('FIRST SHOW DATA ERROR', error);
      console.log('FIRST SHOW DATA:', this._myData);
      console.error('Stream Error:', error);
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
  get myData() {
    return this._myData
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
  processData(campaign: string) {
    campaign = this.removeTrailingCommas(campaign)
    console.log(campaign)
    const campaignData = JSON.parse(campaign)
    this._myData.result = { campaign: campaignData }
  }
}
