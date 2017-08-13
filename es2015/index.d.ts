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
export interface AmChart {
    [key: string]: any;
}
export declare class AmChartsService {
    private zone;
    constructor(zone: NgZone);
    baseHref: boolean;
    useUTC: boolean;
    dayNames: Array<string>;
    monthNames: Array<string>;
    shortDayNames: Array<string>;
    shortMonthNames: Array<string>;
    theme: any;
    processDelay: number;
    readonly charts: Array<AmChart>;
    makeChart(id: string | Node, config: any, delay?: number): AmChart;
    updateChart(chart: AmChart, fn: () => void): void;
    destroyChart(chart: AmChart): void;
}
export declare class AmChartsModule {
}
