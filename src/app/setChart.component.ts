import { Component, OnInit, PipeTransform, Pipe, Input, OnChanges, SimpleChange,
        Output, EventEmitter, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';

import { LoggerService } from './loggerdata.service';
import { Dataset } from './definitions/dataset';

import { DisplayComponent } from './display.component';

//ng on changes
//http://stackoverflow.com/questions/35823698/how-to-make-ngonchanges-work-in-angular2

@Component({
  selector: 'setChart',
  styles: [`
      chart {
        display:block;
      }
  `],
  templateUrl: 'app/views/setchart.html',  
})

export class SetChart {
 
 

  // the @Inputs take variables passed from the parent component via the parent view where the current component view
  // tags are written
  @Input() currentClientC: string;

  @Input() currentNodeC: string;
 
  @Input() timeFilterC: string;

  @Input() activelyLookForDataC: boolean;

  ngOnChanges(changes: any []) {
    console.log("onChange fired");
    console.log("changing", changes);

    for (let key in changes)
    {
      if(key == "currentClientC") { this.filters.client = this.currentClientC; }
      if(key == "currentNodeC") { this.filters.node = this.currentNodeC; }
      if(key == "timeFilterC") { this.filters.time = this.timeFilterC; }
    }

    if(this.initFlag = true) 
    {
      
       this.loggerService.getLoggerData()
      .then( dataset => this.setData(dataset) );
     
      
    }

    // if( this.activelyLookForDataC == true )
    // {
      
    //   this.lookForNewData();
    // }
    
  }
  //incoming data from loggingService Get request
  public dataset:Dataset[] = [];

  //public clientTotals:any[] = [];
  public clientTotals:any = {};

  public filters:any = {client:"ANY", node:"ANY", time:"ANY"};
  public clientLabels: any = [];
  public nodeLabels: any = []
  

  private initFlag: boolean = false;
  private newDataListening: boolean = false;
  // variable toggles activelyLook() to stop the repeating get requests
  
  

  // creating instance of LoggerService, initializing the high-charts options
  constructor (private loggerService: LoggerService, 
    private sanitizer: DomSanitizer, 
    private _applicationRef: ApplicationRef) {

      
      this.options = {
        xAxis: {
          categories: ["Node A", "Node B", "Node C", "Node D"]
        },
        chart: { type: 'column' },
        title: { text : ''},
        series: [
          { type: 'column',
            name: 'Client A',
            data: [1, 2, 3, 2] },
          { type: 'column',
            name: 'Client B',
            data: [0, 2, 4, 1] },
          { type: 'column',
            name: 'Client C',
            data: [4, 1, 1, 3] },
        ]
      };
      this.oldOptions = this.options;
        //setInterval( () => this.chart.series[0].addPoint(Math.random()*10), 1000);
      
     
    }

    chart : any;

    
    options: Object;
    oldOptions: Object;
    private changeFlag = false;
    saveInstance(chartInstance:any) {
      this.chart = chartInstance;
    }
 
    // some example graph options that will appear if your methods aren't working correctly
    incomingOptions: any = {
        xAxis: {
          categories: ["Node A", "Node B", "Node C"]
        },
        chart: { type: 'column' },
        title: { text : ''},
        series: [
          { type: 'column',
            name: 'Client A',
            data: [1, 2, 3] },
          { type: 'column',
            name: 'Client B',
            data: [0, 2, 4] },
          { type: 'column',
            name: 'Client C',
            data: [4, 1, 1] },
          { type: 'column',
            name: 'Client D',
            data: [1,2,4]}
        ]
      };
 // on init - run get service and initially set the data
  ngOnInit(): void {

   // this.loggerService.getLoggerData()
    //  .then(dataset => this.dataset = dataset );

    this.loggerService.getLoggerData()
      .then( dataset => this.setData(dataset) );

    
  }

  
  public lookForNewData() {
          let newData:any;
          this.loggerService.getLoggerData()
          .then( (data:any) => newData = data );
          if(newData !== this.dataset) { this.setData(newData); }
    }
    

  

  //anytime you want to ADD a new client you have to use "addSeries()"
  public updateData () {
     
   
       this.chart.addSeries({
            type: 'column',
            name: 'Client D',
            data: [1,2,4,3]
       });
       
  }

  private setData(incomingData?:any, filter?:any ):void {

    if(this.initFlag === true) {
     console.log("Updating using data: " + incomingData);
    }
     
     // this if statement should only be true on init
     if(incomingData) {
        this.dataset = incomingData;
        this.dataset = this.dataset.slice();
        
       if(this.initFlag === false ) this.initFlag = true;
     } else(console.log('IncomingData parameter of setData() not defined'))

   

     // filter time, then client, then node
     if( this.timeFilterC != "ALL")
     {
       this.filterTime();
     }
     if ( this.currentClientC != "ALL") { this.filterClient() }
     
     if ( this.currentNodeC !== "ALL") { this.filterNode() }
     
     // set labels
     this.setClientLabels(this.dataset);

     // check if there's a change in the chart.series[] array length - if we need more room we have to use 
     // a highchart method to add new series
     // also if  when updating the chart display, if there's now less series than before, we need to remmove the old series first
     this.reInitializeChartSeries();

     //this.removeExtraLabels();
     this.setNodeLabels(this.dataset);
     this.countAllClientsNodes(this.dataset);
     this.setChartData();
    
     //this.updateData();
     
    
}

private filterTime () {

  let data = this.dataset;
  let currentTime = ["12", "31", "00"];
  let currentMinutes = parseInt(currentTime[1]);

  let i = 0;
  while (i < data.length)
  {
    let time = data[i].time.split(":");
    let minutes = parseInt(time[1]);
    if( this.timeFilterC == "Last 5")
    {
      if( minutes <= (currentMinutes - 5) ) 
      {
         data.splice(i, 1);
      }
      else i++;

    } else if ( this.timeFilterC == "Last 30")
    {
      if( minutes <= (currentMinutes - 30) )
      {
        data.splice(i, 1);
      } else i++;
    }
  }

  this.dataset = data.slice();
  
}

filterClient () {

  let data = this.dataset;
  let i = 0;
  while(i < data.length )
  {
    if( data[i].client != this.currentClientC )
    {
      data.splice(i, 1);
    }else i++
  }

  this.dataset = data;
  this.dataset.slice();
}
filterNode() {
  let data = this.dataset;
  let i = 0;
  while(i < data.length )
  {
    if( data[i].node != this.currentNodeC )
    {
      data.splice(i, 1);
    }else i++
  }

  this.dataset = data;
  this.dataset.slice();
  
}


private setClientLabels(incomingData:any) {
  let labels:any = [];
    
     for(let x = 0; x < incomingData.length; x++)
     {
        if (labels.indexOf(incomingData[x].client) === -1 )
        {
          labels.push(incomingData[x].client);
        }
      }

    this.clientLabels = labels;
    this.clientLabels.slice();

    //set labels for incomingOptions Series
    for(let i = 0; i < this.clientLabels.length; i++)
    {
      this.incomingOptions.series[i] = {};
      this.incomingOptions.series[i].data = [];
      this.incomingOptions.series[i].name = labels[i];
    }
    
    
}


private reInitializeChartSeries() {
  /* Use this method to add-more / remove clients from the 'series' property of the 
     highcharts chart  - this.chart.series  
     ---- Should run this method every time you check for new data */ 

  // when you want to show more clients on the graph than before:
  if(this.chart.series.length < this.clientLabels.length )
  {
    let extraProperties:number = this.clientLabels.length - this.chart.series.length;
    for( let i = 0; i < extraProperties; i++ )
    {
      this.chart.addSeries({
        name: 'place',
        data : [0]
      });
    }

  }

  //when you want to display less clients than are curently displayed
  else if(this.chart.series.length > this.clientLabels.length)
  {
    while (this.chart.series.length > this.clientLabels.length)
    {
      this.chart.series[this.clientLabels.length].remove();
    }
   
  }
}


private setNodeLabels(incomingData:any) {
  /* This method creates an array of nodes */
  
  let labels:any = [];
    //create labels array which fills 'pieChartLables[]'
     for(let x = 0; x < incomingData.length; x++)
     {
        if (labels.indexOf(incomingData[x].node) === -1 )
        {
          labels.push(incomingData[x].node);
        }
      }

    this.nodeLabels = labels;
    this.nodeLabels = this.nodeLabels.slice();

    // set node labels to the categories section of  incoming Options
    this.incomingOptions.xAxis.categories = labels;
}
 
  
  private countAllClientsNodes(incomingData:any, filter?: any):void {
    //clear out old data from ClientTotals
    this.clientTotals = {};
    
    let clabels:any =  [];
    let nlabels:any = [];
    clabels = this.clientLabels;
    nlabels = this.nodeLabels;

    // initialize clientTotals object properties
    for(let h = 0; h < clabels.length; h++ )
    {
      this.clientTotals[clabels[h]] = {};
    
      for(let i = 0; i < nlabels.length; i++)
      {
        this.clientTotals[clabels[h]][nlabels[i]] = {};
        this.clientTotals[clabels[h]][nlabels[i]]["total"] = 0;
      }
    }


   

    // Fill clientTotals Object with count data
    // for each present Client
    let size = 0;
    for(let client in this.clientTotals)
    {
      
      //cycle through every array property
      for(let i = 0; i < incomingData.length; i++ )
      {
        // if one of the array properties matches this client
        if ( client == incomingData[i].client)
        {
          //cycle through each node for that client
          for(let node in this.clientTotals[client])
          {
            // if if one of the nodes matches the incoming data array nodes
            if( node == incomingData[i].node) 
            {
              // incrememnt the 'total' property of clienttotals.thisclient.thisnode.total
              this.clientTotals[client][node]["total"]++;
            }
          } 
        }
      }
      size++;

     }
   
  }

  
  private setChartData (): void {
      // Initialize barChartData object array
      // -- if you don't initialize the array with the number of objects it will contain,
      // the data won't show up correctly
     //this.barChartData = new Array(this.clientLabels.length-1);
     let clabels:any =  [];
    let nlabels:any = [];
    clabels = this.clientLabels;
    nlabels = this.nodeLabels;

     for(let i = 0; i < clabels.length; i++ )
     {
       for(let j = 0; j < nlabels.length; j++ )
       {
         this.incomingOptions.series[i].data[j] = this.clientTotals[clabels[i]][nlabels[j]].total;
       }
     }
     
    this.chart.xAxis[0].setCategories(this.incomingOptions.xAxis.categories);
    
    

    for ( let k = 0 ; k < this.incomingOptions.series.length; k++)
    {
       this.chart.series[k].update(this.incomingOptions.series[k]);
    }
   
  }
 
   
}