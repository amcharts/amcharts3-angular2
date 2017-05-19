import { Component } from '@angular/core';
import { AmChartsService } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'my-app',
  template: `<div id="chartdiv" [style.width.%]="100" [style.height.px]="500"></div>`
})
export class AppComponent {
  private timer: NodeJS.Timer;
  private chart: any;

  constructor(private AmCharts: AmChartsService) {}

  makeRandomDataProvider() {
    var dataProvider = [];

    // Generate random data
    for (var year = 1950; year <= 2005; ++year) {
      dataProvider.push({
        year: "" + year,
        value: Math.floor(Math.random() * 100) - 50
      });
    }

    return dataProvider;
  }

  ngOnInit() {
    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "valueField": "value"
      }],
      "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "YYYY",
      "categoryField": "year",
      "categoryAxis": {
        "minPeriod": "YYYY",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });

    // Updates the chart every 3 seconds
    this.timer = setInterval(() => {
      // This must be called when making any changes to the chart
      this.AmCharts.updateChart(this.chart, () => {
        this.chart.dataProvider = this.makeRandomDataProvider();
      });
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.AmCharts.destroyChart(this.chart);
  }
}
