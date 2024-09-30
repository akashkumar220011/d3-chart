import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SunburstComponent } from '../app/components/sunburst/sunburst.component';
import { HeatmapComponent } from '../app/components/heatmap/heatmap.component';
import { BubbletooltipsComponent } from './components/bubbletooltips/bubbletooltips.component';
import { Intern1Component } from './components/intern1/intern1.component';
// import { Intern2Component } from './components/intern2/intern2.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
// import { zoomablecirclepackingComponent } from './components/intern2/zoomablecirclepacking.component';

// const routes: Routes = [
//   { path: 'sunburst', component: SunburstComponent },
//   { path: 'heatmap', component: HeatmapComponent },
//   { path: 'bubble', component: BubbletooltipsComponent },
//   // { path: '', redirectTo: '/heatmap', pathMatch: 'full' }, // Default /
// ];

const routes: Routes = [
  {
    path: 'intern1',
    component: Intern1Component,
    children: [
      { path: 'heatmap', component: HeatmapComponent },
      { path: 'sunburst', component: SunburstComponent },
      { path: 'bubble', component: BubbletooltipsComponent },
      { path: 'org-chart', component: OrgChartComponent},
    ],
  },
  // { path: 'intern2', component: Intern2Component },
  { path: '', redirectTo: '/intern1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
