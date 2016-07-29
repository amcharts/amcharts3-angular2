An official directive for amCharts V3 products for Angular 2

Installation
============

```
npm install
```

How to use
==========

1) In your HTML file, load the amCharts library using `<script>` tags:

   ```
   <script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
   <script src="https://www.amcharts.com/lib/3/serial.js"></script>
   ```

2) In your Angular2 app, import the directive:

   ```
   import { AmChartsDirective } from "amcharts3-angular2/amcharts.directive";
   ```

3) Use the `<amCharts>` tag in your `template`, and also use `AmChartsDirective` in the `directives`:

   ```
   @Component({
     template: `<amCharts [id]="id" [options]="chart" [style.width.%]="100" [style.height.%]="100"></amCharts>`,
     directives: [AmChartsDirective]
   })
   ```

4) Specify the chart config in your component:

   ```
   export class AppComponent {
     id = "chartdiv";

     chart = {
       "type": "serial",
       "theme": "light",
       "dataProvider": []
       ...
     };
   }
   ```

5) If you want to dynamically change the chart config after the chart has been created, you first need to create a *copy* of the existing config:

   ```
   // Make a copy of the existing config
   this.chart = JSON.parse(JSON.serialize(this.chart));

   // Change the config
   this.chart.dataProvider = [...];
   ```

   Alternatively, you can use a function to create a new config:

   ```
   function makeConfig(dataProvider) {
     return {
       "type": "serial",
       "theme": "light",
       "dataProvider": dataProvider
       ...
     };
   }
   ```

   ```
   // Change the config
   this.chart = makeConfig([...]);
   ```

   Why do you need to make a copy of the config? Even if you change the properties of the object, the object itself has not changed, and so Angular2 does not update the AmCharts directive.

   But if you make a copy of the object, then Angular2 realizes that the object is different, and so it updates the AmCharts directive. This is an issue with Angular2, and there isn't much we can do about it.
