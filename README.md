Official Angular plugin for amCharts V3

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

3) Use the `<amCharts>` tag in your `template`, and specify the `options`:

```
@Component({
  template: `<amCharts [options]="options" [style.width.%]="100" [style.height.px]="500"></amCharts>`
})
export class AppComponent {
  private options = {
    "type": "serial",
    "theme": "light",
    "dataProvider": []
    ...
  };
}
```

----

4) If you want to dynamically change the chart options after the chart has been created, you first need to create a *copy* of the existing options:

```
export class AppComponent {
  // Initial configuration
  private options = {
    "type": "serial",
    "theme": "light",
    "dataProvider": []
    ...
  };

  changeChart() {
    // Make a copy of the existing options
    this.options = JSON.parse(JSON.serialize(this.options));

    // Change the dataProvider
    this.options.dataProvider = [...];
  }
}
```

Alternatively, you can use a function or method to create the new options:

```
export class AppComponent {
  // Initial configuration
  private options = this.makeConfig({
    dataProvider: []
  });

  makeConfig(info) {
    return {
      "type": "serial",
      "theme": "light",
      "dataProvider": info.dataProvider
      ...
    };
  }

  changeChart() {
    // Change the dataProvider
    this.options = this.makeConfig({
      dataProvider: [...]
    });
  }
}
```

Why do you need to make a copy of the options? Even if you change the properties of the object, the object itself has not changed, and therefore Angular does **not** update AmCharts.

But if you make a copy of the object, then Angular realizes that the object is different, and so it updates AmCharts. This is an issue with Angular, and there isn't much we can do about it.

----

You can see some examples in the `examples` directory.

## Changelog

### 1.2.0
* Adding in support for Angular 4
* It is now possible to omit the id

### 1.1.0
* Various fixes
* Adding examples

### 1.0.0
* Initial release
