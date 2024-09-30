import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISunburstData } from './i-sunburst-data';

@Injectable({
  providedIn: 'root',
})
export class SunburstService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<ISunburstData>('assets/data/sunburst.json');
  }
  
  getDummyData() {
    return this.http.get('assets/data/data.json');
  }
}