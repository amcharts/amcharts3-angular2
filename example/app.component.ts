import { AmChartsDirective } from "../amcharts.directive";
import { Component, ChangeDetectorRef } from "@angular/core";

interface Data {
  country: string;
  visits: number;
  color: string;
}

interface Configuration {
  dataProvider: Array<Data>;
  fillColors: string;
}

const makeChart = ({ dataProvider, fillColors } : Configuration) => {
  return {
    "type": "serial",
    "theme": "light",
    "marginRight": 70,
    "dataProvider": dataProvider,
    "valueAxes": [{
      "axisAlpha": 0,
      "position": "left",
      "title": "Visitors from country"
    }],
    "startDuration": 1,
    "graphs": [{
      "balloonText": "<b>[[category]]: [[value]]</b>",
      "fillColorsField": "color",
      "fillAlphas": 0.9,
      "lineAlpha": 0.2,
      "type": "column",
      "valueField": "visits",
      "fillColors": fillColors
    }],
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
    },
    "categoryField": "country",
    "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 45
    },
    "export": {
      "enabled": true
    }
  };
};

@Component({
  selector: "my-app",
  template: `
    <button (click)="change()">
      Change data + colors
    </button>
    <amCharts [id]="id" [options]="chart" [style.width.%]="100" [style.height.%]="100"></amCharts>
  `,
  directives: [AmChartsDirective]
})
export class AppComponent {
  private id: string = "chartdiv";

  private chart: any = makeChart({
    dataProvider: [{
      country: "USA",
      visits: 3025,
      color: "#FF0F00"
    }, {
      country: "China",
      visits: 1882,
      color: "#FF6600"
    }, {
      country: "Japan",
      visits: 1809,
      color: "#FF9E01"
    }, {
      country: "Germany",
      visits: 1322,
      color: "#FCD202"
    }, {
      country: "UK",
      visits: 1122,
      color: "#F8FF01"
    }, {
      country: "France",
      visits: 1114,
      color: "#B0DE09"
    }, {
      country: "India",
      visits: 984,
      color: "#04D215"
    }, {
      country: "Spain",
      visits: 711,
      color: "#0D8ECF"
    }, {
      country: "Netherlands",
      visits: 665,
      color: "#0D52D1"
    }, {
      country: "Russia",
      visits: 580,
      color: "#2A0CD0"
    }, {
      country: "South Korea",
      visits: 443,
      color: "#8A0CCF"
    }, {
      country: "Canada",
      visits: 441,
      color: "#CD0D74"
    }],
    fillColors: "red"
  });

  change() {
    this.chart = makeChart({
      dataProvider: this.chart.map((x: Data) => {
        return {
          country: x.country,
          visits: Math.floor(Math.random() * 100),
          color: x.color
        };
      }),
      fillColors: "green"
    });
  }
}
