import { ElementRef, SimpleChanges, NgZone } from "@angular/core";
export declare class AmChartsDirective {
    private el;
    private AmCharts;
    private zone;
    id: string;
    options: any;
    delay: number;
    private chart;
    constructor(el: ElementRef, AmCharts: AmChartsService, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnChanges(x: SimpleChanges): void;
    ngOnDestroy(): void;
}
export interface AmChart {
    [key: string]: any;
}
export interface AmEvent {
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
    addListener(chart: AmChart, type: string, fn: (event: AmEvent) => void): () => void;
    updateChart(chart: AmChart, fn: () => void): void;
    destroyChart(chart: AmChart): void;
}
export declare class AmChartsModule {
}
