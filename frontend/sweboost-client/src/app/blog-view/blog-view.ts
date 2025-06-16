import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResponse } from '../data-types';
import { GlobalStore } from '../global-store';

@Component({
  selector: 'app-blog-view',
  standalone: false,
  templateUrl: './blog-view.html',
  styleUrl: './blog-view.css'
})
export class BlogView implements OnInit {
  data: Observable<DataResponse>;

  constructor(private myService: GlobalStore) {
    this.data = myService.getData();
  }

  ngOnInit() {
    this.data.subscribe((res) => {
      console.log('noww: ', res)
    })
  }
}
