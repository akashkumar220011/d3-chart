import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { MyData } from '../../service/heatmap/heatmap-data';
import { HeatmapService } from '../../service/heatmap/heatmap.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  @ViewChild('myDataviz', { static: true }) myDataviz!: ElementRef;
  private svg: any; // Define svg element as a class property
  private parentData!: MyData[]; // Store parent data
  private childData!: MyData[]; // Store child data
  private clickedCellColor!: number ;

  constructor(private heatmapService: HeatmapService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.drawParentHeatmap();
  }

  drawParentHeatmap(): void {
    const margin = { top: 80, right: 25, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    this.svg = d3.select(this.myDataviz.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.heatmapService.getHeatmapData().subscribe((data: MyData[]) => {
      const myGroups = Array.from(new Set(data.map(d => d.group)));
      const myVars = Array.from(new Set(data.map(d => d.variable)));

      const x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.05);
      this.svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();

      const y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)
        .padding(0.05);
      this.svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

      const myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 100]); // Adjust domain based on your data range

      const groupColors: { [key: string]: string } = {}; // Object to hold group colors

      data.forEach(d => {
        groupColors[d.group + ':' + d.variable] = myColor(parseFloat(d.value));
        // console.log(myColor(parseFloat(d.value)))
      });
      
      this.parentData = data; // Store parent data
      // console.log(groupColors);
      this.drawCells(data, x, y, groupColors);
    });
  }



  drawChildHeatmap(): void {
    this.svg.selectAll('*').remove(); // Remove all elements from SVG
    const margin = { top: 80, right: 25, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    const x = d3.scaleBand()
      .range([0, width])
      .domain(this.childData.map(d => d.group))
      .padding(0.05);
    this.svg.append("g")
      .style("font-size", 15)
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove();
  
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(this.childData.map(d => d.variable))
      .padding(0.05);
    this.svg.append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

      const myColor = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, 100]);
  
    // Object to hold parent colors
    const parentColors: { [key: string]: string } = {};

    // Populate parentColors with colors of parent cells
    this.parentData.forEach(d => {
      parentColors[d.group + ':' + d.variable] = myColor(this.clickedCellColor) // Provide a default color if clickedCellColor is null
    });
    // Draw child cells with colors of parent cells
    console.log(parentColors);
    this.drawCells(this.parentData, x, y, parentColors);
}


  drawCells(data: MyData[], x: any, y: any, colors: { [key: string]: string }): void {
    this.svg.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: MyData) => String(x(d.group)))
      .attr('y', (d: MyData) => String(y(d.variable)))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('data-group', (d: MyData) => d.group) // Add data-group attribute for reference
      .style('fill', (d: MyData) => colors[d.group + ':' + d.variable])// Set fill color based on group color
      .style('stroke-width', 4)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('click', (event: MouseEvent, d: MyData) => this.handleCellClick(event, d)); // Handle click event
  }

  @HostListener('document:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent): void {
  if (event.shiftKey && event.key === 'ArrowRight' && this.childData) {
    this.drawChildHeatmap();
  } else if (event.shiftKey && event.key === 'ArrowLeft') {
    this.clearAndRerenderParentHeatmap();
  }
}

clearAndRerenderParentHeatmap(): void {
  // Clear SVG container
  this.clearSVGContainer();

  // Redraw parent heatmap
  this.drawParentHeatmap();
}

clearSVGContainer(): void {
  // Code to clear the SVG container
  const svgContainer = document.getElementById('my_dataviz');
  if (svgContainer) {
    svgContainer.innerHTML = ''; // Clear the content of SVG container
  } else {
    console.error("SVG container not found");
  }
}


  handleCellClick(event: MouseEvent, d: MyData): void {
    const selectedCell = d3.select(<HTMLElement>event.target);
    const tooltipData = JSON.stringify(d, null, 2); // JSON data with proper formatting

  // Display JSON data in the div
  const jsonDataDiv = document.getElementById('json-data');
  if (jsonDataDiv) {
    jsonDataDiv.innerText = tooltipData;
    jsonDataDiv.style.display = 'block';
  }

    // Remove highlight from previously selected cells
    this.svg.selectAll('rect').style('stroke', 'none');

    // Highlight the selected cell
    selectedCell.style('stroke', 'red').style('stroke-width', 2);
    this.clickedCellColor = parseFloat(d.value);
    console.log(parseFloat(d.value));

    if (d.child) {
      this.childData = d.child;
    }
  }

}
