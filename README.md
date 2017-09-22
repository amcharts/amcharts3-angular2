Official Angular plugin for amCharts V3

Installation
============

```
npm install @amcharts/amcharts3-angular --save
```

How to use
==========

1) In your `index.html` file, load the amCharts library using `<script>` tags:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

If you are using other chart types, you should change `serial.js` to the chart type that you are using:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/pie.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

If you are using maps, you should use these `<script>` tags instead:

```html
<script src="https://www.amcharts.com/lib/3/ammap.js"></script>
<script src="https://www.amcharts.com/lib/3/maps/js/worldLow.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

----

2) In your app module, import the `AmChartsModule` module and add it to the `imports`:

```typescript
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

```typescript
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  template: `<div id="chartdiv" [style.width.%]="100" [style.height.px]="500"></div>`
})
export class AppComponent {
  private chart: AmChart;

  constructor(private AmCharts: AmChartsService) {}

  ngAfterViewInit() {
    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": []
      ...
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }
}
```

The first argument to `makeChart` must be the same as the `<div>`'s `id`. The `id` can be whatever you want, but if you display multiple charts each chart must have a different `id`

When you are finished with the chart, you must call the `destroyChart` method. It's good to put this inside the `ngOnDestroy` method.

----

4) If you want to change the chart after the chart has been created, you must make the changes using the `updateChart` method:

```typescript
// This must be called when making any changes to the chart
this.AmCharts.updateChart(this.chart, () => {
  // Change whatever properties you want
  this.chart.dataProvider = [];
});
```

----

5) If you want to add event listeners, use the `addListener` method:

```typescript
this.AmCharts.addListener(this.chart, "init", (e) => {
  // Do stuff when the event happens
});
```

The `addListener` method returns a function which you can call if you want to stop listening to the event:

```typescript
const stop = this.AmCharts.addListener(this.chart, "init", (e) => {
  // Do stuff when the event happens
});

// Call the stop function when you want to stop listening to the event
stop();
```

----

6) Rather than using `AmChartsService` you can instead use the `<amCharts>` tag in your template:

```typescript
@Component({
  template: `<amCharts id="chartdiv" [options]="options" [style.width.%]="100" [style.height.px]="500"></amCharts>`
})
export class AppComponent {
  public options = {
    "type": "serial",
    "theme": "light",
    "dataProvider": []
    ...
  };
}
```

This is much easier than using `AmChartsService`, but you cannot call the `AmCharts` methods, and it is difficult to change the chart options, so it works best for charts which do not change.

----

You can see some examples in the `examples` directory.

## Changelog

### 1.5.0
* Adding in `addListener` method

### 1.4.0
* Undeprecating the `AmChartsDirective`
* Adding in `delay` option for `AmChartsDirective`

### 1.3.0
* Adding in all of the global `AmCharts` properties to the `AmChartsService`

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
