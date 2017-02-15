Official Angular 2 plugin for amCharts V3

Installation
============

```
npm install amcharts/amcharts3-angular2 --save
```

How to use
==========

1) In your HTML file, load the amCharts library using `<script>` tags:

```
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
```

----

2) In your app module, import the `AmChartsModule` module and add it to the `imports`:

```
import { AmChartsModule } from "amcharts3-angular2";

@NgModule({
  imports: [
    AmChartsModule
  ]
})
export class AppModule {}
```

----

3) Use the `<amCharts>` tag in your `template`, and also specify the `id` and `options`:

```
@Component({
  template: `<amCharts [id]="id" [options]="options" [style.width.%]="100" [style.height.px]="500"></amCharts>`
})
export class AppComponent {
  id = "chartdiv";

  options = {
    "type": "serial",
    "theme": "light",
    "dataProvider": []
    ...
  };
}
```

----

4) If you want to dynamically change the chart config after the chart has been created, you first need to create a *copy* of the existing config:

```
export class AppComponent {
  changeChart() {
    // Make a copy of the existing config
    this.options = JSON.parse(JSON.serialize(this.options));

    // Change the config
    this.options.dataProvider = [...];
  }
}
```

Alternatively, you can use a function or method to create a new config:

```
export class AppComponent {
  makeConfig(dataProvider) {
    return {
      "type": "serial",
      "theme": "light",
      "dataProvider": dataProvider
      ...
    };
  }

  changeChart() {
    this.options = this.makeConfig([...]);
  }
}
```

Why do you need to make a copy of the config? Even if you change the properties of the object, the object itself has not changed, and therefore Angular2 does **not** update AmCharts.

But if you make a copy of the object, then Angular2 realizes that the object is different, and so it updates AmCharts. This is an issue with Angular2, and there isn't much we can do about it.

----

You can see some examples in the `examples` directory.

## Changelog

### 1.1.0
* Various fixes
* Adding examples

### 1.0.0
* Initial release
