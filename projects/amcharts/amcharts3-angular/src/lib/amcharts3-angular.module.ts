import { NgModule } from '@angular/core';
import { AmChartsDirective } from './amcharts3-angular.directive';
import { AmChartsService } from './amcharts3-angular.service';

@NgModule({
  declarations: [
    AmChartsDirective
  ],
  exports: [
    AmChartsDirective
  ],
  providers: [
    AmChartsService
  ]
})
export class AmChartsModule {}
