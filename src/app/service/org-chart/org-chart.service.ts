import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrgchartData } from './i-orgchart-data';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<IOrgchartData>('assets/data/org.json');
  }

  getDummyData() {
    return this.http.get('assets/data/data.json');
  }
}
