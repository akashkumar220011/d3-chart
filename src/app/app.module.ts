import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { SunburstComponent } from './components/sunburst/sunburst.component';
import { HttpClientModule } from '@angular/common/http';
import { BubbletooltipsComponent } from './components/bubbletooltips/bubbletooltips.component';
import { TableComponent } from './components/sunburst/table/table.component';
import { Intern1Component } from './components/intern1/intern1.component';
// import { Intern2Component } from './components/intern2/intern2.component';
// import { Intern2Component } from './components/intern2/intern2.component';
// import { TreeChartComponent } from './components/intern2/intern2.component';
// import { TreeDataService } from './service/Tree/tree-data.service';
import { OrgChartComponent } from './components/org-chart/org-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    HeatmapComponent,
    SunburstComponent,
    BubbletooltipsComponent,
    TableComponent,
    Intern1Component,
    OrgChartComponent,
    // Intern2Component,
    
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
