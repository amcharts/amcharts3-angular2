import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { AmChartsDirective } from "amcharts3-angular2/amcharts.directive";

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, AmChartsDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
