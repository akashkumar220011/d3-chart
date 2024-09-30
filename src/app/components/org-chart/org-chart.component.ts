import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import {
  IOrgchartData,
  ExtendedHierarchyNode,
} from '../../service/org-chart/i-orgchart-data';
import { OrgChartService } from '../../service/org-chart/org-chart.service';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.css',
})
export class OrgChartComponent implements OnInit {
  readonly width = 165;
  readonly height = 600;
  readonly margin = { top: 30, right: 30, bottom: 30, left: 30 };

  data: IOrgchartData | undefined;
  nodes: ExtendedHierarchyNode[] = [];
  links: d3.HierarchyPointLink<IOrgchartData>[] = [];
  transform = '';

  private root!: ExtendedHierarchyNode;
  private zoomBehavior: any;

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  @ViewChild('chartGroup', { static: true }) chartGroup!: ElementRef;

  constructor(private orgChartService: OrgChartService) {}

  ngOnInit(): void {
    this.orgChartService.getData().subscribe({
      next: (data: IOrgchartData) => {
        this.data = data;
        this.createOrgChart();
      },
      error: (error: any) => {
        console.error('Error fetching organization chart data:', error);
      },
      complete: () => {
        console.log('Data fetch complete');
      },
    });
  }

  createOrgChart(): void {
    if (!this.data) {
      return;
    }

    const tree = d3.tree<IOrgchartData>().nodeSize([200, 100]);

    this.root = d3.hierarchy<IOrgchartData>(this.data) as ExtendedHierarchyNode;

    function setChildrenCount(node: ExtendedHierarchyNode) {
      if (node.children) {
        node.data.count = node.children.length;
        node.children.forEach(setChildrenCount);
      } else {
        node.data.count = 0;
      }
    }

    setChildrenCount(this.root);
    this.update(this.root);

    this.zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => this.onZoom(event));

    d3.select(this.svgContainer.nativeElement)
      .call(this.zoomBehavior)
      .on('dblclick.zoom', null);
  }

  update(source: ExtendedHierarchyNode): void {
    const treeData = d3.tree<IOrgchartData>().nodeSize([200, 100])(this.root);

    this.nodes = treeData.descendants() as ExtendedHierarchyNode[];
    this.links = treeData.links();
  }

  toggleChildren(node: ExtendedHierarchyNode, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (node.children) {
      node._children = node.children;
      node.children = undefined;
    } else {
      node.children = node._children;
      node._children = undefined;
    }
    this.update(node);
  }

  getLinkPath(link: d3.HierarchyPointLink<IOrgchartData>): string | null {
    return d3
      .linkVertical<
        d3.HierarchyPointLink<IOrgchartData>,
        d3.HierarchyPointNode<IOrgchartData>
      >()
      .x((d) => d.x + 70)
      .y((d) => d.y + 70)(link);
  }

  onZoom(event: any): void {
    d3.select(this.chartGroup.nativeElement)
      .attr('transform', event.transform)
      .attr('transform-origin', '0 0');
    this.transform = event.transform.toString();
  }
}
