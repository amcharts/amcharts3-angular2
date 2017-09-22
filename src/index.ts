import { Component, Directive, ElementRef, Input, SimpleChanges, NgZone, NgModule, Injectable } from "@angular/core";


// TODO better type for this
declare const AmCharts: any;


function getType(x: any) {
  // TODO make this faster ?
  return {}.toString.call(x);
}

function hasOwnKey(obj: any, key: any) {
  return {}.hasOwnProperty.call(obj, key);
}


function copyObject(x: any) {
  var output = {};

  // TODO use Object.keys ?
  for (var key in x) {
    if (hasOwnKey(x, key)) {
      output[key] = copy(x[key]);
    }
  }

  return output;
}

function copyArray(x: any) {
  var length = x.length;

  var output = new Array(length);

  for (var i = 0; i < length; ++i) {
    output[i] = copy(x[i]);
  }

  return output;
}

// TODO can this be made faster ?
// TODO what about regexps, etc. ?
function copy(x: any) {
  switch (getType(x)) {
  case "[object Array]":
    return copyArray(x);

  case "[object Object]":
    return copyObject(x);

  // TODO is this necessary ?
  case "[object Date]":
    return new Date(x.getTime());

  default:
    return x;
  }
}


function isNaN(x: any) {
  return x !== x;
}

function isNumberEqual(x: any, y: any) {
  return x === y || (isNaN(x) && isNaN(y));
}


function removeChartListeners(chart: any, x: any, y: any) {
  if (x !== y) {
    // TODO is this necessary ?
    if (x == null) {
      x = [];
    }

    // TODO is this necessary ?
    if (y == null) {
      y = [];
    }

    var xLength = x.length;
    var yLength = y.length;

    for (var i = 0; i < xLength; ++i) {
      var xValue = x[i];

      var has = false;

      // TODO make this faster ?
      for (var j = 0; j < yLength; ++j) {
        var yValue = y[j];

        // TODO is this correct ?
        if (xValue.event  === yValue.event &&
            xValue.method === yValue.method) {
          has = true;
          break;
        }
      }

      if (!has) {
        // TODO is this correct ?
        chart.removeListener(chart, xValue.event, xValue.method);
      }
    }
  }
}


function updateArray(a: any, x: any, y: any) {
  var didUpdate = false;

  if (x !== y) {
    var xLength = x.length;
    var yLength = y.length;

    if (xLength !== yLength) {
      a.length = yLength;
      didUpdate = true;
    }

    for (var i = 0; i < yLength; ++i) {
      if (i < xLength) {
        if (update(a, i, x[i], y[i])) {
          didUpdate = true;
        }

      } else {
        // TODO make this faster ?
        a[i] = copy(y[i]);
        // TODO is this necessary ?
        didUpdate = true;
      }
    }
  }

  return didUpdate;
}


function update(obj: any, key: any, x: any, y: any) {
  var didUpdate = false;

  if (x !== y) {
    var xType = getType(x);
    var yType = getType(y);

    if (xType === yType) {
      switch (xType) {
      case "[object Array]":
        if (updateArray(obj[key], x, y)) {
          didUpdate = true;
        }
        break;

      case "[object Object]":
        if (updateObject(obj[key], x, y)) {
          didUpdate = true;
        }
        break;

      case "[object Date]":
        if (x.getTime() !== y.getTime()) {
          // TODO make this faster ?
          obj[key] = copy(y);
          didUpdate = true;
        }
        break;

      case "[object Number]":
        if (!isNumberEqual(x, y)) {
          // TODO is the copy necessary ?
          obj[key] = copy(y);
          didUpdate = true;
        }
        break;

      default:
        if (x !== y) {
          // TODO is the copy necessary ?
          obj[key] = copy(y);
          didUpdate = true;
        }
        break;
      }

    // TODO is this correct ?
    } else {
      // TODO make this faster ?
      obj[key] = copy(y);
      didUpdate = true;
    }
  }

  return didUpdate;
}

function updateObject(chart: any, oldObj: any, newObj: any) {
  var didUpdate = false;

  if (oldObj !== newObj) {
    // TODO use Object.keys ?
    for (var key in newObj) {
      if (hasOwnKey(newObj, key)) {
        // TODO make this faster ?
        if (hasOwnKey(oldObj, key)) {
          // TODO should this count as an update ?
          if (key === "listeners") {
            // TODO make this faster ?
            removeChartListeners(chart, oldObj[key], newObj[key]);
          }

          if (update(chart, key, oldObj[key], newObj[key])) {
            didUpdate = true;
          }

        } else {
          // TODO make this faster ?
          chart[key] = copy(newObj[key]);
          didUpdate = true;
        }
      }
    }

    // TODO use Object.keys ?
    for (var key in oldObj) {
      if (hasOwnKey(oldObj, key) && !hasOwnKey(newObj, key)) {
        if (key === "listeners") {
          removeChartListeners(chart, oldObj[key], []);
        }

        delete chart[key];
        didUpdate = true;
      }
    }
  }

  return didUpdate;
}


@Directive({
  selector: "amCharts"
})
export class AmChartsDirective {
  @Input() id: string;
  @Input() options: any; // TODO better type for this
  @Input() delay: number = 0;

  private chart: AmChart;

  constructor(private el: ElementRef, private AmCharts: AmChartsService, private zone: NgZone) {}

  ngAfterViewInit() {
    // AmCharts mutates the config object, so we have to make a deep copy to prevent that
    const props = copy(this.options);

    const el = this.el.nativeElement;

    el.id = this.id;
    el.style.display = "block";

    this.chart = this.AmCharts.makeChart(this.id, props, this.delay);
  }

  // TODO is this correct ?
  ngOnChanges(x: SimpleChanges) {
    const el = this.el.nativeElement;

    if (x.id) {
      el.id = x.id.currentValue;
    }

    if (x.options) {
      // Update the chart after init
      if (this.chart) {
        // This is needed to avoid triggering ngDoCheck
        this.zone.runOutsideAngular(() => {
          var didUpdate = updateObject(this.chart, x.options.previousValue, x.options.currentValue);

          // TODO make this faster
          if (didUpdate) {
            this.chart.validateNow(true);
          }
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }
}


export interface AmChart {
  [key: string]: any;
}

export interface AmEvent {
  [key: string]: any;
}


@Injectable()
export class AmChartsService {
  constructor(private zone: NgZone) {}


  get baseHref(): boolean {
    return AmCharts.baseHref;
  }

  set baseHref(v: boolean) {
    AmCharts.baseHref = v;
  }


  get useUTC(): boolean {
    return AmCharts.useUTC;
  }

  set useUTC(v: boolean) {
    AmCharts.useUTC = v;
  }


  get dayNames(): Array<string> {
    return AmCharts.dayNames;
  }

  set dayNames(v: Array<string>) {
    AmCharts.dayNames = v;
  }


  get monthNames(): Array<string> {
    return AmCharts.monthNames;
  }

  set monthNames(v: Array<string>) {
    AmCharts.monthNames = v;
  }


  get shortDayNames(): Array<string> {
    return AmCharts.shortDayNames;
  }

  set shortDayNames(v: Array<string>) {
    AmCharts.shortDayNames = v;
  }


  get shortMonthNames(): Array<string> {
    return AmCharts.shortMonthNames;
  }

  set shortMonthNames(v: Array<string>) {
    AmCharts.shortMonthNames = v;
  }


  // TODO better type for this
  get theme(): any {
    return AmCharts.theme;
  }

  // TODO better type for this
  set theme(v: any) {
    AmCharts.theme = v;
  }


  get processDelay(): number {
    return AmCharts.processDelay;
  }

  set processDelay(v: number) {
    AmCharts.processDelay = v;
  }


  get charts(): Array<AmChart> {
    return AmCharts.charts;
  }


  // TODO is Node the correct type ?
  // TODO better type for config
  makeChart(id: string | Node, config: any, delay?: number): AmChart {
    return this.zone.runOutsideAngular(() => AmCharts.makeChart(id, config, delay));
  }


  addListener(chart: AmChart, type: string, fn: (event: AmEvent) => void): () => void {
    const callback = (e: AmEvent) => {
      this.zone.run(() => {
        fn(e);
      });
    };

    this.zone.runOutsideAngular(() => {
      chart.addListener(type, callback);
    });

    return () => {
      this.zone.runOutsideAngular(() => {
        chart.removeListener(chart, type, callback);
      });
    };
  }


  updateChart(chart: AmChart, fn: () => void): void {
    this.zone.runOutsideAngular(() => {
      fn();
      chart.validateNow(true);
    });
  }


  destroyChart(chart: AmChart): void {
    this.zone.runOutsideAngular(() => {
      chart.clear();
    });
  }
}


@NgModule({
  declarations: [
    AmChartsDirective
  ],
  exports: [
    AmChartsDirective
  ],
  providers: [
    AmChartsService
  ]
})
export class AmChartsModule {}
