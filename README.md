Official Angular plugin for amCharts V3

Installation
============

```
npm install @amcharts/amcharts3-angular --save
```

How to use
==========

1) In your HTML file, load the amCharts library using `<script>` tags:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

----

2) In your app module, import the `AmChartsModule` module and add it to the `imports`:

```js
import { AmChartsModule } from "@amcharts/amcharts3-angular";

@NgModule({
  imports: [
    AmChartsModule
  ]
})
export class AppModule {}
```

----

3) Inject the `AmChartsService` into your app component, create a `<div>` element with an `id`, then use the `makeChart` method to create the chart:

```js
import { AmChartsService } from "@amcharts/amcharts3-angular";

@Component({
  template: `<div id="chartdiv" [style.width.%]="100" [style.height.px]="500"></div>`
})
export class AppComponent {
  private chart: any;

  constructor(private AmCharts: AmChartsService) {}

  ngOnInit() {
    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": []
      ...
    });
  }

  ngOnDestroy() {
    this.AmCharts.destroyChart(this.chart);
  }
}
```

The first argument to `makeChart` must be the same as the `<div>`'s `id`. The `id` can be whatever you want, but if you display multiple charts each chart must have a different `id`

When you are finished with the chart, you must call the `destroyChart` method. It's good to put this inside the `ngOnDestroy` method.

----

5) If you want to change the chart after the chart has been created, you must make the changes using the `updateChart` method:

```js
// This must be called when making any changes to the chart
this.AmCharts.updateChart(this.chart, () => {
  // Change whatever properties you want, add event listeners, etc.
  this.chart.dataProvider = [];

  this.chart.addListener("init", () => {
    // Do stuff after the chart is initialized
  });
});
```

----

You can see some examples in the `examples` directory.

## Changelog

### 1.2.1
* Updating to the latest version of the Angular compiler

### 1.2.0
* Adding in support for Angular 4
* Deprecating the `<amCharts>` element in favor of the new `AmChartsService`

### 1.1.0
* Various fixes
* Adding examples

### 1.0.0
* Initial release
