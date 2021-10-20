import { NgZone, Injectable } from '@angular/core';


// TODO better type for this
declare const AmCharts: any;


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


@Injectable({
    providedIn: 'root'
})
export class AmChartsService {
  constructor(private zone: NgZone) {}


  get StockPanel(): typeof StockPanel {
    return AmCharts.StockPanel;
  }

  get StockGraph(): typeof StockGraph {
    return AmCharts.StockGraph;
  }

  get StockEvent(): typeof StockEvent {
    return AmCharts.StockEvent;
  }

  get StockLegend(): typeof StockLegend {
    return AmCharts.StockLegend;
  }


  get baseHref(): boolean {
    return AmCharts.baseHref;
  }

  set baseHref(v: boolean) {
    AmCharts.baseHref = v;
  }


  get useUTC(): boolean {
    return AmCharts.useUTC;
  }

  set useUTC(v: boolean) {
    AmCharts.useUTC = v;
  }


  get dayNames(): Array<string> {
    return AmCharts.dayNames;
  }

  set dayNames(v: Array<string>) {
    AmCharts.dayNames = v;
  }


  get monthNames(): Array<string> {
    return AmCharts.monthNames;
  }

  set monthNames(v: Array<string>) {
    AmCharts.monthNames = v;
  }


  get shortDayNames(): Array<string> {
    return AmCharts.shortDayNames;
  }

  set shortDayNames(v: Array<string>) {
    AmCharts.shortDayNames = v;
  }


  get shortMonthNames(): Array<string> {
    return AmCharts.shortMonthNames;
  }

  set shortMonthNames(v: Array<string>) {
    AmCharts.shortMonthNames = v;
  }


  // TODO better type for this
  get theme(): any {
    return AmCharts.theme;
  }

  // TODO better type for this
  set theme(v: any) {
    AmCharts.theme = v;
  }


  get processDelay(): number {
    return AmCharts.processDelay;
  }

  set processDelay(v: number) {
    AmCharts.processDelay = v;
  }


  get charts(): Array<AmChart> {
    return AmCharts.charts;
  }


  addInitHandler(handler: (chart: AmChart) => void, types?: Array<string>): void {
    // TODO use this.zone.runOutsideAngular ?
    AmCharts.addInitHandler(handler, types);
  }

  addPrefix(
    value: number,
    prefixesBig: Array<{ number: number, prefix: string }>,
    prefixesSmall: Array<{ number: number, prefix: string }>,
    numberFormatter: Formatter
  ): string {
    // TODO use this.zone.runOutsideAngular ?
    return AmCharts.addPrefix(value, prefixesBig, prefixesSmall, numberFormatter);
  }

  clear(): void {
    // TODO use this.zone.runOutsideAngular ?
    AmCharts.clear();
  }

  formatDate(date: Date, format: string): string {
    // TODO use this.zone.runOutsideAngular ?
    return AmCharts.formatDate(date, format);
  }

  formatNumber(value: number, formatter: Formatter, zeroCount: number): string {
    // TODO use this.zone.runOutsideAngular ?
    return AmCharts.formatNumber(value, formatter, zeroCount);
  }

  stringToDate(value: string, format: string): Date {
    // TODO use this.zone.runOutsideAngular ?
    return AmCharts.stringToDate(value, format);
  }


  // TODO is Node the correct type ?
  // TODO better type for config
  makeChart(id: string | Node, config: any, delay?: number): AmChart {
    return this.zone.runOutsideAngular(() => AmCharts.makeChart(id, config, delay));
  }


  addListener(chart: AmChart, type: string, fn: (event: AmEvent) => void): () => void {
    const callback = (e: AmEvent) => {
      this.zone.run(() => {
        fn(e);
      });
    };

    this.zone.runOutsideAngular(() => {
      chart.addListener(type, callback);
    });

    return () => {
      this.zone.runOutsideAngular(() => {
        chart.removeListener(chart, type, callback);
      });
    };
  }


  updateChart(chart: AmChart, fn: () => void): void {
    this.zone.runOutsideAngular(() => {
      fn();
      chart.validateNow(true);
    });
  }


  destroyChart(chart: AmChart): void {
    this.zone.runOutsideAngular(() => {
      chart.clear();
    });
  }
}
