import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyData } from './heatmap-data';

@Injectable({
  providedIn: 'root'
})
export class HeatmapService {
  private jsonDataUrl = 'assets/data/heatmap.json';

  constructor(private http: HttpClient) {}

  getHeatmapData(): Observable<MyData[]> {
    return this.http.get<MyData[]>(this.jsonDataUrl);
  }
}
