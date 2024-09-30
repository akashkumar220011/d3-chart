import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class BubbleTooltipService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv', { responseType: 'text' })
      .pipe(
        map(csvData => Papa.parse(csvData, { header: true }).data)
      );
  }
}
