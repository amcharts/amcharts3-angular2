import { Directive, ElementRef, Input, SimpleChange } from "@angular/core";

// TODO better type for this
// TODO move this into a separate file ?
declare var AmCharts: any;


function getType(x) {
  // TODO make this faster ?
  return {}.toString.call(x);
}


function copyObject(x) {
  var output = {};

  // TODO use Object.keys ?
  for (var key in x) {
    output[key] = copy(x[key]);
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


function isEqualArray(x, y) {
  var xLength = x.length;
  var yLength = y.length;

  if (xLength === yLength) {
    for (var i = 0; i < xLength; ++i) {
      if (!isEqual(x[i], y[i])) {
        return false;
      }
    }

    return true;

  } else {
    return false;
  }
}

function isEqualObject(x, y) {
  // TODO use Object.keys ?
  for (var key in x) {
    if (key in y) {
      if (!isEqual(x[key], y[key])) {
        return false;
      }

    } else {
      return false;
    }
  }

  // TODO use Object.keys ?
  for (var key in y) {
    if (!(key in x)) {
      return false;
    }
  }

  return true;
}

function isNaN(x) {
  return x !== x
}

function isEqual(x, y) {
  var xType = getType(x);
  var yType = getType(y);

  if (xType === yType) {
    switch (xType) {
    case "[object Array]":
      return isEqualArray(x, y);

    case "[object Object]":
      return isEqualObject(x, y);

    case "[object Date]":
      return x.getTime() === y.getTime();

    case "[object Number]":
      return x === y || (isNaN(x) && isNaN(y))

    default:
      return x === y;
    }

  } else {
    return false;
  }
}


function removeChartListeners(chart, listeners) {
  if (listeners != null) {
    // TODO use Object.keys ?
    for (var key in listeners) {
      var listener = listeners[key];

      chart.removeListener(chart, listener.event, listener.method);
    }
  }
}

// TODO make this faster ?
// TODO does this work for listeners, etc. ?
function updateChartObject(chart, oldObj, newObj) {
  var didUpdate = false;

  // TODO use Object.keys ?
  for (var key in newObj) {
    // TODO make this faster ?
    if (!(key in oldObj) || !isEqual(oldObj[key], newObj[key])) {
      if (key === "listeners") {
        // TODO make this faster ?
        removeChartListeners(chart, oldObj[key]);
      }

      // TODO make this faster ?
      chart[key] = copy(newObj[key]);
      didUpdate = true;
    }
  }

  // TODO use Object.keys ?
  for (var key in oldObj) {
    if (!(key in newObj)) {
      if (key === "listeners") {
        removeChartListeners(chart, oldObj[key]);
      }

      delete chart[key];
      didUpdate = true;
    }
  }

  return didUpdate;
}


@Directive({
  selector: "amCharts"
})
export class AmChartsDirective {
  private el: any; // TODO better type for this
  private chart: any; // TODO better type for this

  @Input() id: string;
  @Input() options: any; // TODO better type for this

  // TODO is this correct ?
  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  // TODO is this correct ?
  ngOnChanges(x: { options: SimpleChange }) {
    if (x.options) {
      // Update the chart after init
      if (this.chart) {
        var didUpdate = updateChartObject(this.chart, x.options.previousValue, x.options.currentValue);

        if (didUpdate) {
          // TODO is this correct ?
          this.chart.validateNow(true, false);
        }
      }
    }
  }

  // TODO is this the correct hook to use ?
  ngOnInit() {
    // TODO is this correct ?
    this.el.id = this.id;
    // TODO a bit hacky
    this.el.style.display = "block";
    this.chart = AmCharts.makeChart(this.id, copy(this.options));
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.clear();
    }
  }
}
