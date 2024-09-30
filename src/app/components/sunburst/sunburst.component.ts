import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';
import { SunburstService } from '../../service/sunburst/sunburst.service';
import { ISunburstData } from '../../service/sunburst/i-sunburst-data';
@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrl: './sunburst.component.css',
})
export class SunburstComponent implements OnInit, AfterViewInit {
  @ViewChild('titleText') titleText!: ElementRef;

  width: number = 928;
  height: number = this.width;
  radius: number = this.width / 2;

  root!: d3.HierarchyRectangularNode<ISunburstData>;
  color!: d3.ScaleOrdinal<string, string>;
  format = d3.format(',d');
  arc = d3
    .arc<d3.HierarchyRectangularNode<ISunburstData>>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(this.radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  totalSize!: number;
  hoveredNode: d3.HierarchyRectangularNode<ISunburstData> | null = null;

  sendNodeData!: d3.HierarchyRectangularNode<ISunburstData> | null;

  constructor(private sunburstService: SunburstService) {}

  ngOnInit(): void {
    this.sunburstService.getData().subscribe((data) => {
      this.root = this.partition(data);
      this.totalSize = this.root.descendants()[0].value!;
      this.color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
    });
  }

  ngAfterViewInit(): void {
    if (this.root) this.setTitle(this.getTitle());
  }

  partition(data: ISunburstData): d3.HierarchyRectangularNode<ISunburstData> {
    return d3.partition<ISunburstData>().size([2 * Math.PI, this.radius])(
      d3
        .hierarchy(data)
        .sum((d: any) => d.value)
        .sort((a: any, b: any) => b.value - a.value)
    );
  }

  getArc(d: d3.HierarchyRectangularNode<ISunburstData>): string {
    return this.arc(d) as string;
  }

  getColor(d: d3.HierarchyRectangularNode<ISunburstData>): string {
    while (d.depth > 1) d = d.parent!;
    return this.color(d.data.name);
  }

  handleNodeOpacity(d: d3.HierarchyRectangularNode<ISunburstData>) {
    const opacity = this.hoveredNode
      ? this.hoveredNode === d
        ? 0.8
        : 0.3
      : d.children
      ? 0.6
      : 0.4;
    return opacity;
  }

  handleMouseOver(d: d3.HierarchyRectangularNode<ISunburstData>) {
    var percentage = Number(((100 * d.value!) / this.totalSize).toPrecision(2));
    var percentageString = percentage + '%';
    if (percentage < 0.1) {
      percentageString = '< 0.1%';
    }
    this.setTitle(percentageString);
    this.hoveredNode = d;
  }

  handleMouseLeave() {
    this.setTitle(this.getTitle());
    this.hoveredNode = null;
  }

  setTitle(title: string) {
    d3.select(this.titleText.nativeElement).text(title);
  }

  getTitle(): string {
    return this.root.descendants()[0].data.name;
  }

  isTextVisible(d: d3.HierarchyRectangularNode<ISunburstData>) {
    return d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10;
  }

  getTextTransform(d: d3.HierarchyRectangularNode<ISunburstData>): string {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = (d.y0 + d.y1) / 2;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  getTruncatedText(d: d3.HierarchyRectangularNode<ISunburstData>): string {
    const availableWidth = Math.abs(d.x1 - d.x0) * this.radius;
    const maxCharacters = Math.floor(availableWidth / 2.2);
    const truncatedText =
      d.data.name.length > maxCharacters
        ? d.data.name.substring(0, maxCharacters - 3) + '...'
        : d.data.name;
    return truncatedText;
  }

  getAncestorsText(d: d3.HierarchyRectangularNode<ISunburstData>): string {
    return d
      .ancestors()
      .map((ancestor) => ancestor.data.name)
      .reverse()
      .join('/');
  }

  handleClick(d: d3.HierarchyRectangularNode<ISunburstData>){
    this.sendNodeData = d;
  }
}
