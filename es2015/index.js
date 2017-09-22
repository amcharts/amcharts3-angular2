import { Directive, ElementRef, Input, NgZone, NgModule, Injectable } from "@angular/core";
function getType(x) {
    return {}.toString.call(x);
}
function hasOwnKey(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
}
function copyObject(x) {
    var output = {};
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
function copy(x) {
    switch (getType(x)) {
        case "[object Array]":
            return copyArray(x);
        case "[object Object]":
            return copyObject(x);
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
        if (x == null) {
            x = [];
        }
        if (y == null) {
            y = [];
        }
        var xLength = x.length;
        var yLength = y.length;
        for (var i = 0; i < xLength; ++i) {
            var xValue = x[i];
            var has = false;
            for (var j = 0; j < yLength; ++j) {
                var yValue = y[j];
                if (xValue.event === yValue.event &&
                    xValue.method === yValue.method) {
                    has = true;
                    break;
                }
            }
            if (!has) {
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
            }
            else {
                a[i] = copy(y[i]);
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
                        obj[key] = copy(y);
                        didUpdate = true;
                    }
                    break;
                case "[object Number]":
                    if (!isNumberEqual(x, y)) {
                        obj[key] = copy(y);
                        didUpdate = true;
                    }
                    break;
                default:
                    if (x !== y) {
                        obj[key] = copy(y);
                        didUpdate = true;
                    }
                    break;
            }
        }
        else {
            obj[key] = copy(y);
            didUpdate = true;
        }
    }
    return didUpdate;
}
function updateObject(chart, oldObj, newObj) {
    var didUpdate = false;
    if (oldObj !== newObj) {
        for (var key in newObj) {
            if (hasOwnKey(newObj, key)) {
                if (hasOwnKey(oldObj, key)) {
                    if (key === "listeners") {
                        removeChartListeners(chart, oldObj[key], newObj[key]);
                    }
                    if (update(chart, key, oldObj[key], newObj[key])) {
                        didUpdate = true;
                    }
                }
                else {
                    chart[key] = copy(newObj[key]);
                    didUpdate = true;
                }
            }
        }
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
var AmChartsDirective = (function () {
    function AmChartsDirective(el, AmCharts, zone) {
        this.el = el;
        this.AmCharts = AmCharts;
        this.zone = zone;
        this.delay = 0;
    }
    AmChartsDirective.prototype.ngAfterViewInit = function () {
        var props = copy(this.options);
        var el = this.el.nativeElement;
        el.id = this.id;
        el.style.display = "block";
        this.chart = this.AmCharts.makeChart(this.id, props, this.delay);
    };
    AmChartsDirective.prototype.ngOnChanges = function (x) {
        var _this = this;
        var el = this.el.nativeElement;
        if (x.id) {
            el.id = x.id.currentValue;
        }
        if (x.options) {
            if (this.chart) {
                this.zone.runOutsideAngular(function () {
                    var didUpdate = updateObject(_this.chart, x.options.previousValue, x.options.currentValue);
                    if (didUpdate) {
                        _this.chart.validateNow(true);
                    }
                });
            }
        }
    };
    AmChartsDirective.prototype.ngOnDestroy = function () {
        if (this.chart) {
            this.AmCharts.destroyChart(this.chart);
        }
    };
    AmChartsDirective.decorators = [
        { type: Directive, args: [{
                    selector: "amCharts"
                },] },
    ];
    AmChartsDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: AmChartsService, },
        { type: NgZone, },
    ]; };
    AmChartsDirective.propDecorators = {
        'id': [{ type: Input },],
        'options': [{ type: Input },],
        'delay': [{ type: Input },],
    };
    return AmChartsDirective;
}());
export { AmChartsDirective };
var AmChartsService = (function () {
    function AmChartsService(zone) {
        this.zone = zone;
    }
    Object.defineProperty(AmChartsService.prototype, "baseHref", {
        get: function () {
            return AmCharts.baseHref;
        },
        set: function (v) {
            AmCharts.baseHref = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "useUTC", {
        get: function () {
            return AmCharts.useUTC;
        },
        set: function (v) {
            AmCharts.useUTC = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "dayNames", {
        get: function () {
            return AmCharts.dayNames;
        },
        set: function (v) {
            AmCharts.dayNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "monthNames", {
        get: function () {
            return AmCharts.monthNames;
        },
        set: function (v) {
            AmCharts.monthNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "shortDayNames", {
        get: function () {
            return AmCharts.shortDayNames;
        },
        set: function (v) {
            AmCharts.shortDayNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "shortMonthNames", {
        get: function () {
            return AmCharts.shortMonthNames;
        },
        set: function (v) {
            AmCharts.shortMonthNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "theme", {
        get: function () {
            return AmCharts.theme;
        },
        set: function (v) {
            AmCharts.theme = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "processDelay", {
        get: function () {
            return AmCharts.processDelay;
        },
        set: function (v) {
            AmCharts.processDelay = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "charts", {
        get: function () {
            return AmCharts.charts;
        },
        enumerable: true,
        configurable: true
    });
    AmChartsService.prototype.makeChart = function (id, config, delay) {
        return this.zone.runOutsideAngular(function () { return AmCharts.makeChart(id, config, delay); });
    };
    AmChartsService.prototype.addListener = function (chart, type, fn) {
        var _this = this;
        var callback = function (e) {
            _this.zone.run(function () {
                fn(e);
            });
        };
        this.zone.runOutsideAngular(function () {
            chart.addListener(type, callback);
        });
        return function () {
            _this.zone.runOutsideAngular(function () {
                chart.removeListener(chart, type, callback);
            });
        };
    };
    AmChartsService.prototype.updateChart = function (chart, fn) {
        this.zone.runOutsideAngular(function () {
            fn();
            chart.validateNow(true);
        });
    };
    AmChartsService.prototype.destroyChart = function (chart) {
        this.zone.runOutsideAngular(function () {
            chart.clear();
        });
    };
    AmChartsService.decorators = [
        { type: Injectable },
    ];
    AmChartsService.ctorParameters = function () { return [
        { type: NgZone, },
    ]; };
    return AmChartsService;
}());
export { AmChartsService };
var AmChartsModule = (function () {
    function AmChartsModule() {
    }
    AmChartsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AmChartsDirective
                    ],
                    exports: [
                        AmChartsDirective
                    ],
                    providers: [
                        AmChartsService
                    ]
                },] },
    ];
    AmChartsModule.ctorParameters = function () { return []; };
    return AmChartsModule;
}());
export { AmChartsModule };
//# sourceMappingURL=index.js.map