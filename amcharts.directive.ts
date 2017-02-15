import { Directive, ElementRef, Input, SimpleChange, NgZone, NgModule,
         OnDestroy, OnChanges, OnInit } from "@angular/core";


function getType(x) {
  // TODO make this faster ?
  return {}.toString.call(x);
}

function hasOwnKey(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}


function copyObject(x) {
  var output = {};

  // TODO use Object.keys ?
  for (var key in x) {
    if (hasOwnKey(x, key)) {
      output[key] = copy(x[key]);
    }
  }

  return output;
}

function copyArray(x) {
  var length = x.length;

  var output = new Array(length);

  for (var i = 0; i < length; ++i) {
    output[i] = copy(x[i]);
  }

  return output;
}

// TODO can this be made faster ?
// TODO what about regexps, etc. ?
function copy(x) {
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


function isNaN(x) {
  return x !== x;
}

function isNumberEqual(x, y) {
  return x === y || (isNaN(x) && isNaN(y));
}


function removeChartListeners(chart, x, y) {
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


function updateArray(a, x, y) {
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


function update(obj, key, x, y) {
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

function updateObject(chart, oldObj, newObj) {
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
export class AmChartsDirective implements OnDestroy, OnChanges, OnInit {
  private el: any; // TODO better type for this
  private chart: any; // TODO better type for this

  @Input() id: string;
  @Input() options: any; // TODO better type for this

  // TODO is this correct ?
  constructor(el: ElementRef, private _zone: NgZone) {
    this.el = el.nativeElement;
  }

  // TODO is this correct ?
  ngOnChanges(x: { options: SimpleChange }) {
    if (x.options) {
      // Update the chart after init
      if (this.chart) {
        // This is needed to avoid triggering ngDoCheck
        this._zone.runOutsideAngular(() => {
          var didUpdate = updateObject(this.chart, x.options.previousValue, x.options.currentValue);

          // TODO make this faster
          if (didUpdate) {
            this.chart.validateNow();
            this.chart.validateData();
          }
        });
      }
    }
  }

  // TODO is this the correct hook to use ?
  ngOnInit() {
    // TODO is this correct ?
    this.el.id = this.id;

    // TODO a bit hacky
    this.el.style.display = "block";

    // This is needed to avoid triggering ngDoCheck
    this._zone.runOutsideAngular(() => {
      // AmCharts mutates the config object, so we have to make a deep copy to prevent that
      var props = copy(this.options);

      this.chart = (window as any).AmCharts.makeChart(this.id, props);
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      // TODO does this need to use runOutsideAngular ?
      this.chart.clear();
    }
  }
}


@NgModule({
  declarations: [
    AmChartsDirective
  ],
  exports: [
    AmChartsDirective
  ],
  imports: []
})
export class AmChartsModule {}
