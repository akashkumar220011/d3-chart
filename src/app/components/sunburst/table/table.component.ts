import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ISunburstData } from '../../../service/sunburst/i-sunburst-data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() nodeData!: d3.HierarchyRectangularNode<ISunburstData> | null;

  data!:ISunburstData[];
  newLabel!: string;
  newValue!: number;
  constructor() {}

  ngOnInit(): void {
    console.log('from Table:',this.nodeData);
  }

  ngOnChanges(): void {
    console.log('data Changed:',this.nodeData?.data.children.length, this.nodeData?.children?.length);
  }

}
