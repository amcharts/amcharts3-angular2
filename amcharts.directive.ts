import { Directive, ElementRef, Input, SimpleChange } from "@angular/core";

// TODO better type for this
// TODO move this into a separate file ?
declare var AmCharts: any;

@Directive({
  selector: "amCharts"
})
  

export class AmChartsDirective {
    
    private el: any; // TODO better type for this
    private chart: any; // TODO better type for this

    @Input() id: string;
    @Input() options: any; // TODO better type for this

    // TODO is this correct ?
    public constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }      // TODO is this correct ?

    //public ngOnChanges(x:any) {
    public ngOnChanges(x: { options: SimpleChange }) {        
            // Update the chart after init
        if (x.options && this.chart) {
            var didUpdate = this.updateChartObject(x.previousValue, x.currentValue);
            if (didUpdate) {
                // TODO is this correct ?
                this.chart.validateNow(true, false);
            } else {
                console.log('not updated');
            }
        }
    }
            
            // TODO make this faster ?
            // TODO does this work for listeners, etc. ?
            private updateChartObject(oldObj:any, newObj:any) {
                var didUpdate = false;

                // TODO use Object.keys ?
                for (var key in newObj) {
                    // TODO make this faster ?
                    if (!(key in oldObj) || !this.isEqual(oldObj[key], newObj[key])) {
                        if (key === "listeners") {
                            // TODO make this faster ?
                            this.removeChartListeners(oldObj[key]);
                        }

                        // TODO make this faster ?
                        this.chart[key] = this.copy(newObj[key]);
                        didUpdate = true;
                    }
                }

                // TODO use Object.keys ?
                for (var key in oldObj) {
                    if (!(key in newObj)) {
                        if (key === "listeners") {
                            this.removeChartListeners(oldObj[key]);
                        }

                        delete this.chart[key];
                        didUpdate = true;
                    }
                }

                return didUpdate;
            }

                    private removeChartListeners(listeners: any) {
                        if (listeners != null) {
                            // TODO use Object.keys ?
                            for (var key in listeners) {
                                var listener = listeners[key];
                                this.chart.removeListener(this.chart, listener.event, listener.method);
                            }
                        }
                    }

    // TODO is this the correct hook to use ?
    public ngOnInit() {
        // TODO is this correct ?
        this.el.id = this.id;
        // TODO a bit hacky
        this.el.style.display = "block";
        this.chart = AmCharts.makeChart(this.id, this.copy(this.options));
    }

    public ngOnDestroy() {
        if (this.chart) {
            this.chart.clear();
        }
    }
  


    // TODO can this be made faster ?
    // TODO what about regexps, etc. ?
    private copy(x:any) {
        switch (this.getType(x)) {
            case "[object Array]":
                return this.copyArray(x);

            case "[object Object]":
                return this.copyObject(x);

            // TODO is this necessary ?
            case "[object Date]":
                return new Date(x.getTime());

            default:
                return x;
        }
    }

            private getType(x:any):string{
              // TODO make this faster ?
              return {}.toString.call(x);
            }


            private copyObject(x:any):{}{
                var output = {};

                // TODO use Object.keys ?
                for (var key in x) {
                    output[key] = this.copy(x[key]);
                }

                return output;
            }

            private copyArray(x:any):Array<{}>{
                var length = x.length;

                var output = new Array(length);

                for (var i = 0; i < length; ++i) {
                    output[i] = this.copy(x[i]);
                }

                return output;
            }

            private isEqual(x: any, y: any) {
                var xType = this.getType(x);
                var yType = this.getType(y);

                if (xType === yType) {
                    switch (xType) {
                        case "[object Array]":
                            return this.isEqualArray(x, y);

                        case "[object Object]":
                            return this.isEqualObject(x, y);

                        case "[object Date]":
                            return x.getTime() === y.getTime();

                        case "[object Number]":
                            return x === y || (this.isNaN(x) && this.isNaN(y))

                        default:
                            return x === y;
                    }

                } else {
                    return false;
                }
            }


                    private isEqualArray(x: any, y: any) {
                        var xLength = x.length;
                        var yLength = y.length;

                        if (xLength === yLength) {
                            for (var i = 0; i < xLength; ++i) {
                                if (!this.isEqual(x[i], y[i])) {
                                    return false;
                                }
                            }

                            return true;

                        } else {
                            return false;
                        }
                    }

                    private isEqualObject(x: any, y: any) {
                        // TODO use Object.keys ?
                        for (var key in x) {
                            if (key in y) {
                                if (!this.isEqual(x[key], y[key])) {
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

                    private isNaN(x: any) {
                        return x !== x
                    }
    
}
