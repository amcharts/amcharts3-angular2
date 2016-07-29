import { Directive, ElementRef, Input, SimpleChange } from "@angular/core";

// TODO better type for this
// TODO move this into a separate file ?
declare var AmCharts: any;

// TODO more efficient copying ?
// TODO better type ?
const copy = (x: any) =>
  JSON.parse(JSON.stringify(x));

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
        // TODO make this more efficient ?
        for (let key in this.options) {
          this.chart[key] = copy(this.options[key]);
        }

        this.chart.validateNow(true, false);
      }
    }
  }

  // TODO is this the correct hook to use ?
  ngOnInit() {
    // TODO is this correct ?
    this.el.id = this.id;
    // TODO a bit hacky
    this.el.style.display = "block";
    // TODO more efficient copying of an object ?
    this.chart = AmCharts.makeChart(this.id, copy(this.options));
  }

  ngOnDestroy() {
    this.chart.clear();
  }
}
