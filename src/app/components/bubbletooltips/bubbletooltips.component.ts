// bubble-tooltip.component.ts
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BubbleTooltipService } from '../../service/bubble/bubble-tooltip.service';

interface DataItem {
  continent: string;
}

@Component({
  selector: 'app-bubble-tooltip',
  templateUrl: './bubbletooltips.component.html',
  styleUrls: ['./bubbletooltips.component.css']
})
export class BubbletooltipsComponent implements OnInit {

  constructor(private bubbleTooltipService: BubbleTooltipService) { }

  ngOnInit(): void {
    this.createBubbleChart();
  }

  createBubbleChart(): void {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 420 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.bubbleTooltipService.getData().subscribe(data => {
      console.log(data);
      const x = d3.scaleLinear()
        .domain([0, 12000])
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([35, 90])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Add a scale for bubble size
      const z = d3.scaleLinear()
        .domain([200000, 1310000000])
        .range([4, 40]);

      
      const myColor = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "America", "Africa", "Oceania"])
        .range(d3.schemeSet2);

      
      const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

     
      const showTooltip = function (d:any, event: any) {
        console.log(event); 
        // console.log(event); 
        tooltip
          .transition()
          .duration(200);
        tooltip
          .style("opacity", 1)
          .html("Country: " + event.country)
          .style("left", (d3.pointer(event)[0] + 30) + "px")
          .style("top", (d3.pointer(event)[1] + 30) + "px");
      };
      
      const moveTooltip = function (d: any, event: MouseEvent) {
        tooltip
          .style("left", (d3.pointer(event)[0] + 30) + "px")
          .style("top", (d3.pointer(event)[1] + 30) + "px");
      };
      
      const hideTooltip = function (d : any) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0);
      };

      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return x(d.gdpPercap); })
        .attr("cy", function (d) { return y(d.lifeExp); })
        .attr("r", function (d) { return z(d.pop); })
        .style("fill", function (d: DataItem): string { return myColor(d.continent) as string; })
        // -3- Trigger the functions
        // .on("mouseover", showTooltip)
        // .on("mousemove", moveTooltip)
        .on("mouseover", (d: any, event: MouseEvent) => showTooltip(d, event))
.on("mousemove", (d: any, event: MouseEvent) => moveTooltip(d, event))
        .on("mouseleave", hideTooltip);
    });
  }
}
