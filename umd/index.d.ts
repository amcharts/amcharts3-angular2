import { ElementRef, SimpleChange, NgZone } from "@angular/core";
export declare class AmChartsDirective {
    private _zone;
    private el;
    private chart;
    id: string;
    options: any;
    constructor(el: ElementRef, _zone: NgZone);
    ngOnChanges(x: {
        options: SimpleChange;
    }): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
export declare class AmChartsService {
    private zone;
    constructor(zone: NgZone);
    makeChart(...a: any[]): any;
    updateChart(chart: any, fn: () => void): void;
    destroyChart(chart: any): void;
}
export declare class AmChartsModule {
}
