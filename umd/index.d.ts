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
export interface Formatter {
    precision: number;
    decimalSeparator: string;
    thousandsSeparator: string;
}
export declare class StockPanel {
    constructor();
    [key: string]: any;
}
export declare class StockGraph {
    constructor();
    [key: string]: any;
}
export declare class StockEvent {
    constructor();
    [key: string]: any;
}
export declare class StockLegend {
    constructor();
    [key: string]: any;
}
export declare class AmChartsService {
    private zone;
    constructor(zone: NgZone);
    readonly StockPanel: typeof StockPanel;
    readonly StockGraph: typeof StockGraph;
    readonly StockEvent: typeof StockEvent;
    readonly StockLegend: typeof StockLegend;
    baseHref: boolean;
    useUTC: boolean;
    dayNames: Array<string>;
    monthNames: Array<string>;
    shortDayNames: Array<string>;
    shortMonthNames: Array<string>;
    theme: any;
    processDelay: number;
    readonly charts: Array<AmChart>;
    addInitHandler(handler: (chart: AmChart) => void, types?: Array<string>): void;
    addPrefix(value: number, prefixesBig: Array<{
        number: number;
        prefix: string;
    }>, prefixesSmall: Array<{
        number: number;
        prefix: string;
    }>, numberFormatter: Formatter): string;
    clear(): void;
    formatDate(date: Date, format: string): string;
    formatNumber(number: number, formatter: Formatter, zeroCount: number): string;
    stringToDate(string: string, format: string): Date;
    makeChart(id: string | Node, config: any, delay?: number): AmChart;
    addListener(chart: AmChart, type: string, fn: (event: AmEvent) => void): () => void;
    updateChart(chart: AmChart, fn: () => void): void;
    destroyChart(chart: AmChart): void;
}
export declare class AmChartsModule {
}
