import { Component, OnInit, Input, OnChanges, SimpleChange,
        Output, EventEmitter, ChangeDetectionStrategy, ElementRef, ViewChild,
      } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
// For window animations
import {  trigger, state, animate, transition, style} from '@angular/animations';


import { LoggerService } from './loggerdata.service';
import { Dataset } from './definitions/dataset';
import { DisplayComponent } from './display.component';



@Component({
  selector: 'liveCount',
  styles: [],
  templateUrl: 'app/views/liveCount.html',
})

export class LiveCount {

   @Input() currentData: any;

   @Input() activelyLookForDataC: boolean;

    ngOnChanges(changes: any []) {
      for (let key in changes)
      {
        if(key == "activelyLookForData") { this.lookForNewData(); }

        if(key == "dataset") { this.processData(changes[key]); }
      }

      
    }



constructor (private loggerService: LoggerService ) {

  this.options = {
    chart: {
            type: 'area',
            animation: true, // don't animate in old IE
            marginRight: 10,
            
            style: {
              "min-width": "300px"
            },
           
            
        },
        title: {
            text: 'All nodes over time'
        },
        xAxis: {
            type: 'datetime',
            //tickPixelInterval: 30
            
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            // formatter: function () {
            //     return '<b>' + this.series.name + '</b><br/>' +
            //        this.series.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            //        this.series.numberFormat(this.y, 2);
              
            // }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [
          {
            name: 'Node 1',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -9; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
        {},

        ]

        
  };

  
}


ngOnInit(): void {

    this.startInterval();
}
private options:any;
private oldOptions:any;
chart:any;
public myInterval: any;

saveInstance(chartInstance:any) {
  this.chart = chartInstance;
}




lookForNewData() {}

processData (newData: any) {
    console.log("liveCount.processData() fired ");
    console.log("dataset: " + JSON.stringify(newData) );
}




startInterval () {

  var _this = this; // setInterval acts on document so it messes up "this" reference
  this.myInterval = setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();

                            console.log("Interval Iteration");
                        
                        _this.chart.series[0].addPoint([x, y], true, true); 
                    }, 10000);
}

stopInterval() {
    clearInterval(this.myInterval);
    console.log("interval cleared");
}

} // end of component

