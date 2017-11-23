/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, ElementRef, Input, NgZone, NgModule, Injectable } from "@angular/core";
/**
 * @param {?} x
 * @return {?}
 */
function getType(x) {
    // TODO make this faster ?
    return {}.toString.call(x);
}
/**
 * @param {?} obj
 * @param {?} key
 * @return {?}
 */
function hasOwnKey(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
}
/**
 * @param {?} x
 * @return {?}
 */
function copyObject(x) {
    var /** @type {?} */ output = {};
    // TODO use Object.keys ?
    for (var /** @type {?} */ key in x) {
        if (hasOwnKey(x, key)) {
            output[key] = copy(x[key]);
        }
    }
    return output;
}
/**
 * @param {?} x
 * @return {?}
 */
function copyArray(x) {
    var /** @type {?} */ length = x.length;
    var /** @type {?} */ output = new Array(length);
    for (var /** @type {?} */ i = 0; i < length; ++i) {
        output[i] = copy(x[i]);
    }
    return output;
}
/**
 * @param {?} x
 * @return {?}
 */
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
/**
 * @param {?} x
 * @return {?}
 */
function isNaN(x) {
    return x !== x;
}
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function isNumberEqual(x, y) {
    return x === y || (isNaN(x) && isNaN(y));
}
/**
 * @param {?} chart
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
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
        var /** @type {?} */ xLength = x.length;
        var /** @type {?} */ yLength = y.length;
        for (var /** @type {?} */ i = 0; i < xLength; ++i) {
            var /** @type {?} */ xValue = x[i];
            var /** @type {?} */ has = false;
            // TODO make this faster ?
            for (var /** @type {?} */ j = 0; j < yLength; ++j) {
                var /** @type {?} */ yValue = y[j];
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
/**
 * @param {?} a
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function updateArray(a, x, y) {
    var /** @type {?} */ didUpdate = false;
    if (x !== y) {
        var /** @type {?} */ xLength = x.length;
        var /** @type {?} */ yLength = y.length;
        if (xLength !== yLength) {
            a.length = yLength;
            didUpdate = true;
        }
        for (var /** @type {?} */ i = 0; i < yLength; ++i) {
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
/**
 * @param {?} obj
 * @param {?} key
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function update(obj, key, x, y) {
    var /** @type {?} */ didUpdate = false;
    if (x !== y) {
        var /** @type {?} */ xType = getType(x);
        var /** @type {?} */ yType = getType(y);
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
/**
 * @param {?} chart
 * @param {?} oldObj
 * @param {?} newObj
 * @return {?}
 */
function updateObject(chart, oldObj, newObj) {
    var /** @type {?} */ didUpdate = false;
    if (oldObj !== newObj) {
        // TODO use Object.keys ?
        for (var /** @type {?} */ key in newObj) {
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
        for (var /** @type {?} */ key in oldObj) {
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
    /**
     * @return {?}
     */
    AmChartsDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        // AmCharts mutates the config object, so we have to make a deep copy to prevent that
        var /** @type {?} */ props = copy(this.options);
        var /** @type {?} */ el = this.el.nativeElement;
        el.id = this.id;
        el.style.display = "block";
        this.chart = this.AmCharts.makeChart(this.id, props, this.delay);
    };
    // TODO is this correct ?
    /**
     * @param {?} x
     * @return {?}
     */
    AmChartsDirective.prototype.ngOnChanges = /**
     * @param {?} x
     * @return {?}
     */
    function (x) {
        var _this = this;
        var /** @type {?} */ el = this.el.nativeElement;
        if (x["id"]) {
            el.id = x["id"].currentValue;
        }
        if (x["options"]) {
            // Update the chart after init
            if (this.chart) {
                // This is needed to avoid triggering ngDoCheck
                this.zone.runOutsideAngular(function () {
                    var /** @type {?} */ didUpdate = updateObject(_this.chart, x["options"].previousValue, x["options"].currentValue);
                    // TODO make this faster
                    if (didUpdate) {
                        _this.chart["validateNow"](true);
                    }
                });
            }
        }
    };
    /**
     * @return {?}
     */
    AmChartsDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.chart) {
            this.AmCharts.destroyChart(this.chart);
        }
    };
    AmChartsDirective.decorators = [
        { type: Directive, args: [{
                    selector: "amCharts"
                },] },
    ];
    /** @nocollapse */
    AmChartsDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: AmChartsService, },
        { type: NgZone, },
    ]; };
    AmChartsDirective.propDecorators = {
        "id": [{ type: Input },],
        "options": [{ type: Input },],
        "delay": [{ type: Input },],
    };
    return AmChartsDirective;
}());
export { AmChartsDirective };
function AmChartsDirective_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    AmChartsDirective.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    AmChartsDirective.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    AmChartsDirective.propDecorators;
    /** @type {?} */
    AmChartsDirective.prototype.id;
    /** @type {?} */
    AmChartsDirective.prototype.options;
    /** @type {?} */
    AmChartsDirective.prototype.delay;
    /** @type {?} */
    AmChartsDirective.prototype.chart;
    /** @type {?} */
    AmChartsDirective.prototype.el;
    /** @type {?} */
    AmChartsDirective.prototype.AmCharts;
    /** @type {?} */
    AmChartsDirective.prototype.zone;
}
/**
 * @record
 */
export function AmChart() { }
function AmChart_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [key: string]: any;
    */
}
/**
 * @record
 */
export function AmEvent() { }
function AmEvent_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [key: string]: any;
    */
}
var AmChartsService = (function () {
    function AmChartsService(zone) {
        this.zone = zone;
    }
    Object.defineProperty(AmChartsService.prototype, "baseHref", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.baseHref;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.baseHref = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "useUTC", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.useUTC;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.useUTC = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "dayNames", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.dayNames;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.dayNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "monthNames", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.monthNames;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.monthNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "shortDayNames", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.shortDayNames;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.shortDayNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "shortMonthNames", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.shortMonthNames;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.shortMonthNames = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "theme", {
        // TODO better type for this
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.theme;
        },
        // TODO better type for this
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.theme = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "processDelay", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.processDelay;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            AmCharts.processDelay = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmChartsService.prototype, "charts", {
        get: /**
         * @return {?}
         */
        function () {
            return AmCharts.charts;
        },
        enumerable: true,
        configurable: true
    });
    // TODO is Node the correct type ?
    // TODO better type for config
    /**
     * @param {?} id
     * @param {?} config
     * @param {?=} delay
     * @return {?}
     */
    AmChartsService.prototype.makeChart = /**
     * @param {?} id
     * @param {?} config
     * @param {?=} delay
     * @return {?}
     */
    function (id, config, delay) {
        return this.zone.runOutsideAngular(function () { return AmCharts.makeChart(id, config, delay); });
    };
    /**
     * @param {?} chart
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    AmChartsService.prototype.addListener = /**
     * @param {?} chart
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    function (chart, type, fn) {
        var _this = this;
        var /** @type {?} */ callback = function (e) {
            _this.zone.run(function () {
                fn(e);
            });
        };
        this.zone.runOutsideAngular(function () {
            chart["addListener"](type, callback);
        });
        return function () {
            _this.zone.runOutsideAngular(function () {
                chart["removeListener"](chart, type, callback);
            });
        };
    };
    /**
     * @param {?} chart
     * @param {?} fn
     * @return {?}
     */
    AmChartsService.prototype.updateChart = /**
     * @param {?} chart
     * @param {?} fn
     * @return {?}
     */
    function (chart, fn) {
        this.zone.runOutsideAngular(function () {
            fn();
            chart["validateNow"](true);
        });
    };
    /**
     * @param {?} chart
     * @return {?}
     */
    AmChartsService.prototype.destroyChart = /**
     * @param {?} chart
     * @return {?}
     */
    function (chart) {
        this.zone.runOutsideAngular(function () {
            chart["clear"]();
        });
    };
    AmChartsService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AmChartsService.ctorParameters = function () { return [
        { type: NgZone, },
    ]; };
    return AmChartsService;
}());
export { AmChartsService };
function AmChartsService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    AmChartsService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    AmChartsService.ctorParameters;
    /** @type {?} */
    AmChartsService.prototype.zone;
}
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
    /** @nocollapse */
    AmChartsModule.ctorParameters = function () { return []; };
    return AmChartsModule;
}());
export { AmChartsModule };
function AmChartsModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    AmChartsModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    AmChartsModule.ctorParameters;
}
//# sourceMappingURL=index.js.map