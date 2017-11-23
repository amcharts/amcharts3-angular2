(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
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
                    if (xValue.event === yValue.event &&
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
                }
                else {
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
            }
            else {
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
                    }
                    else {
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
    var AmChartsDirective = (function () {
        function AmChartsDirective(el, AmCharts, zone) {
            this.el = el;
            this.AmCharts = AmCharts;
            this.zone = zone;
            this.delay = 0;
        }
        AmChartsDirective.prototype.ngAfterViewInit = function () {
            // AmCharts mutates the config object, so we have to make a deep copy to prevent that
            var props = copy(this.options);
            var el = this.el.nativeElement;
            el.id = this.id;
            el.style.display = "block";
            this.chart = this.AmCharts.makeChart(this.id, props, this.delay);
        };
        // TODO is this correct ?
        // TODO is this correct ?
        AmChartsDirective.prototype.ngOnChanges = 
        // TODO is this correct ?
        function (x) {
            var _this = this;
            var el = this.el.nativeElement;
            if (x.id) {
                el.id = x.id.currentValue;
            }
            if (x.options) {
                // Update the chart after init
                if (this.chart) {
                    // This is needed to avoid triggering ngDoCheck
                    this.zone.runOutsideAngular(function () {
                        var didUpdate = updateObject(_this.chart, x.options.previousValue, x.options.currentValue);
                        // TODO make this faster
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
            { type: core_1.Directive, args: [{
                        selector: "amCharts"
                    },] },
        ];
        /** @nocollapse */
        AmChartsDirective.ctorParameters = function () { return [
            { type: core_1.ElementRef, },
            { type: AmChartsService, },
            { type: core_1.NgZone, },
        ]; };
        AmChartsDirective.propDecorators = {
            "id": [{ type: core_1.Input },],
            "options": [{ type: core_1.Input },],
            "delay": [{ type: core_1.Input },],
        };
        return AmChartsDirective;
    }());
    exports.AmChartsDirective = AmChartsDirective;
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
            // TODO better type for this
            get: 
            // TODO better type for this
            function () {
                return AmCharts.theme;
            },
            // TODO better type for this
            set: 
            // TODO better type for this
            function (v) {
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
        // TODO is Node the correct type ?
        // TODO better type for config
        // TODO is Node the correct type ?
        // TODO better type for config
        AmChartsService.prototype.makeChart = 
        // TODO is Node the correct type ?
        // TODO better type for config
        function (id, config, delay) {
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
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        AmChartsService.ctorParameters = function () { return [
            { type: core_1.NgZone, },
        ]; };
        return AmChartsService;
    }());
    exports.AmChartsService = AmChartsService;
    var AmChartsModule = (function () {
        function AmChartsModule() {
        }
        AmChartsModule.decorators = [
            { type: core_1.NgModule, args: [{
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
        /** @nocollapse */
        AmChartsModule.ctorParameters = function () { return []; };
        return AmChartsModule;
    }());
    exports.AmChartsModule = AmChartsModule;
});
//# sourceMappingURL=index.js.map