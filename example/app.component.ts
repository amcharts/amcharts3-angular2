import { Component } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl:'component.html',
    template: `
        <button (click)="doClick()">clique aqui</button>
        <amCharts [id]="id" [(options)]="chart" [style.width.%]="100" [style.height.%]="100"></amCharts>
    `
    
})

export class AppComponent{
    
    private id: string = "chartdiv";
    private chart: any;
    
    public constructor(){
        this.chart = this.makeChart(this.data);
    }
    
    public doClick(){
        this.change();
    }
    
    
    private change() {
        try{
            //this.chart = JSON.parse(JSON.stringify(this.chart));
            var v = JSON.parse(JSON.stringify(this.data));
            for(var i in v){
                v[i]['column-1'] = Math.floor(Math.random() * 10);
                v[i]['column-2'] = Math.floor(Math.random() * 10);
            }
            this.data = v;
            //this.chart.dataProvider = this.data;
            this.chart = this.makeChart(this.data);
        }catch(e){
            console.log(e);
        }
        
    }
    
        private makeChart(dataProvider: any) {
            return {
                "type": "serial",
                "categoryField": "category",
                "startDuration": 1,
                "categoryAxis": {
                    "gridPosition": "start"
                },
                "trendLines": [],
                "graphs": [
                    {
                        "balloonText": "[[title]] of [[category]]:[[value]]",
                        "bullet": "round",
                        "id": "AmGraph-1",
                        "title": "graph 1",
                        "valueField": "column-1"
                    },
                    {
                        "balloonText": "[[title]] of [[category]]:[[value]]",
                        "bullet": "square",
                        "id": "AmGraph-2",
                        "title": "graph 2",
                        "valueField": "column-2"
                    }
                ],
                "guides": [],
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "title": "Axis title"
                    }
                ],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "enabled": true,
                    "useGraphSettings": true
                },
                "titles": [
                    {
                        "id": "Title-1",
                        "size": 15,
                        "text": "Chart Title"
                    }
                ],
                "dataProvider": dataProvider
            };
        }
    
    private data: any = [
        {
                "category": "category 1",
                "column-1": 8,
                "column-2": 5
        },
        {
                "category": "category 2",
                "column-1": 6,
                "column-2": 7
        },
        {
                "category": "category 3",
                "column-1": 2,
                "column-2": 3
        },
        {
                "category": "category 4",
                "column-1": 1,
                "column-2": 3
        },
        {
                "category": "category 5",
                "column-1": 2,
                "column-2": 1
        },
        {
                "category": "category 6",
                "column-1": 3,
                "column-2": 2
        },
        {
                "category": "category 7",
                "column-1": 6,
                "column-2": 8
        }
    ];
}
