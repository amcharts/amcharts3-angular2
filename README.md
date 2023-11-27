Official Angular plugin for amCharts V3

Installation
============

* If you are using Angular 12 or higher:

   ```
   npm install @amcharts/amcharts3-angular --save
   ```

* If you are using Angular 5 to 11:

   ```
   npm install @amcharts/amcharts3-angular^2.2.5 --save
   ```

* If you are using Angular 2 to 4:

   ```
   npm install @amcharts/amcharts3-angular@^1.5.0 --save
   ```

How to use
==========

1) In your `index.html` file, load the amCharts library using `<script>` tags:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

If you are using stock charts, you should use these `<script>` tags instead:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<script src="https://www.amcharts.com/lib/3/amstock.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

If you are using maps, you should use these `<script>` tags instead:

```html
<script src="https://www.amcharts.com/lib/3/ammap.js"></script>
<script src="https://www.amcharts.com/lib/3/maps/js/worldLow.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

If you are using other chart types, you should change `serial.js` to the chart type that you are using:

```html
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/pie.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

----

2) In your app component, import the `AmChartsModule` module and add it to the `imports`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AmChart, AmChartsService, AmChartsModule } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  // Add the import here
  imports: [CommonModule, RouterOutlet, AmChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
```

----

3) Inject the `AmChartsService` into your app component, create a `<div>` element with an `id`, then use the `makeChart` method to create the chart:

```html
<div id="chartdiv" [style.width.%]="100" [style.height.px]="500"></div>
```

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AmChart, AmChartsService, AmChartsModule } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  // Add the import here
  imports: [CommonModule, RouterOutlet, AmChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private chart: AmChart | undefined;

  // Inject the service here
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

### 3.0.5
* Adding in support for Angular 17

### 3.0.4
* Adding in support for Angular 16

### 3.0.3
* Adding in support for Angular 15

### 3.0.2
* Adding in support for Angular 14

### 3.0.1
* Adding in support for Angular 13

### 3.0.0
* Adding in support for Angular 12 Ivy

### 2.2.5
* Upgrading to Angular 9 - 12

### 2.2.4
* Upgrading to Angular 8

### 2.2.3
* Upgrading to Angular 7

### 2.2.1
* Adding in `StockEvent` and `StockLegend` constructors for dynamically adding stock events/legend.

### 2.2.0
* Adding in `StockPanel` and `StockGraph` constructors for dynamically adding stock panels/graphs.

### 2.1.0
* Adding in `addInitHandler`, `addPrefix`, `clear`, `formatDate`, `formatNumber`, and `stringToDate` methods to `AmChartsService`

### 2.0.0
* Upgrading to Angular 5
* Removing the Quickstart Seed example

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
