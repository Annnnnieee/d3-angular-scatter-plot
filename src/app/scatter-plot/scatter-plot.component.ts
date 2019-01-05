import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ScatterPlot } from '../../../d3/models/ScatterPlot';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit {
  private d = [
    {
        song: 'song1',
        rating: 2
    },
    {
        song: 'song2',
        rating: 1
    },
    {
        song: 'song3',
        rating: 4
    },
    {
        song: 'song4',
        rating: 5
    }
]
  private host; // D3 object referebcing host dom object
  private svgContainer; // SVG in which we will print our chart
  private htmlElement; // Host HTMLElement
  private margin;
  private height;
  private width;
  private xScale;
  private yScale;

  /* Constructor, needed to get @Injectables */
  constructor(private element: ElementRef) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement);
    this.setup();
  }

  ngOnInit(): void { }

  /* Will Update on every @Input change */
  ngOnChanges(): void {
    this.setup();
  }

  /* Will setup the chart container */
  private setup(): void {
    this.setupGraph();
    this.createSVGContainer();
    this.drawXAxis();
    this.drawYAxis();
    this.drawPath();
    this.plotPoints();
  }

  private setupGraph(): void {
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 }
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  private drawXAxis(): void {
    this.xScale = d3.scalePoint()
    .domain(this.d.map( d => d.song))
    .range([0, this.width]);

    this.svgContainer.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.xScale));
  }

  private drawYAxis(): void {

    this.yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 5]);
    
    this.svgContainer.append("g")
      .call(d3.axisLeft(this.yScale));
  }

  private createSVGContainer(): void {
    this.host.html('');
    this.svgContainer = this.host.append('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }


  private plotPoints(): void {

    this.svgContainer.selectAll(".dot")
    .data(this.d)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", d => this.xScale(d.song))
    .attr("cy", d => this.yScale(d.rating))
  }

  private xValue = (data) => this.xScale(data.song);
  private yValue = (data) => this.yScale(data.rating);

  private drawPath(): void {
    var valueline = d3.line()
    .x(d => this.xValue(d))
    .y(d => this.yValue(d));

    var data = this.d;  
    this.svgContainer.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-width", "2px")
  }

}
