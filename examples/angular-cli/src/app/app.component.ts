import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  public options: any;
  private chart2: AmChart;
  private timer: number;

  constructor(private AmCharts: AmChartsService) {}

  makeRandomDataProvider() {
    const dataProvider = [];

    // Generate random data
    for (let year = 1950; year <= 2005; ++year) {
      dataProvider.push({
        year: "" + year,
        value: Math.floor(Math.random() * 100) - 50
      });
    }

    return dataProvider;
  }

  makeOptions(dataProvider) {
    return {
      "type": "serial",
      "theme": "light",
      "marginTop": 0,
      "marginRight": 80,
      "dataProvider": dataProvider,
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id": "g1",
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
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 55,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "autoGridCount": true,
        "selectedGraphFillAlpha": 0,
        "graphLineAlpha": 0.2,
        "graphLineColor": "#c2c2c2",
        "selectedGraphLineColor": "#888888",
        "selectedGraphLineAlpha": 1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueLineAlpha": 0.5,
        "fullWidth": true
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
    };
  }

  ngOnInit() {
    // Create chartdiv1
    this.options = this.makeOptions(this.makeRandomDataProvider());

    // Create chartdiv2
    this.chart2 = this.AmCharts.makeChart("chartdiv2", this.makeOptions(this.makeRandomDataProvider()));

    this.timer = setInterval(() => {
      // Update chartdiv1
      this.options = this.makeOptions(this.makeRandomDataProvider());

      // Update chartdiv2
      this.AmCharts.updateChart(this.chart2, () => {
        this.chart2.dataProvider = this.makeRandomDataProvider();
      });
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);

    // Cleanup chartdiv2
    if (this.chart2) {
      this.AmCharts.destroyChart(this.chart2);
    }
  }
}
