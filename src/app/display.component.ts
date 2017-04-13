import { Input, Component, OnInit, PipeTransform, Pipe, AfterContentInit, DoCheck} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LoggerService } from './loggerdata.service';
import {  trigger, state, animate, transition, style, keyframes} from '@angular/animations';

import { Dataset } from './definitions/dataset';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';


@Component({
  selector: 'displayComponent',
  templateUrl: `app/views/display.html`,
  styleUrls: ['app/css/display.css'],
  animations: [
     trigger('hideFilters', [
       state('0' , style({ transform: 'translate3d(0,0,0)' })),
       state('1', style({  transform: 'translate3d(0, -200%, 0)', display: 'none' })),
      // state('0' , style({ opacity: 1, /*transform: 'scale(1.0)'*/ })),
      // state('1', style({ display:'none', height: 0, opacity: 0, /*transform: 'scale(0.0)'*/  })),
      transition('1 => 0',
      //style({height: 10, opacity: 0}),
      animate( '1000ms 500ms ease-in', keyframes([
        style({  transform: 'translate3d(0, -200%, 0)', offset: 0 }),
        style({ transform: 'translate3d(0, 3%, 0)', offset: 0.6 }),
        style({ transform: 'translate3d(0, 0, 0)', offset: 1.0 })

      ]))
      ), 
      transition('0 => 1', animate('1000ms 500ms ease-out' , keyframes([
        style({  transform: 'translate3d(0, 0, 0)', offset: 0 }),
        style({ transform: 'translate3d(0, 3%, 0)', offset: 0.3 }),
        style({ transform: 'translate3d(0, -200%, 0)', offset: 1.0 })
      ]))
     )]),
    trigger('flyOutIn', [
    state('1', style({ transform: 'translate3d(0,0,0)' })),
    state('0', style({ transform: 'translate3d(-103%, 0,0)' })),
    transition('1 => 0', 
      animate('0.4s 100ms ease-out', keyframes([
        style({ transform: 'translate3d(0,0,0)', offset: 0 }),
        style({ transform: 'translateX(20px)', offset: 0.3 }),
        style({ transform: 'translate3d(-103%,0,0)', offset: 1.0 })
      ])) 
    ),
    transition( '0 => 1', 
      animate( '0.4s 1000ms ease-in',  keyframes([
        style({ transform: 'translate3d(-103%,0,0)', offset: 0 }),
        style({ transform: 'translate3d(15px, 0, 0)', offset: 0.3 }),
        style({ transform: 'translate3d(0,0,0)', offset: 1.0 })
      ]))  
    ),
    // transition('0 => 1', [
    //   animate('0.2s 10 ease-out', style({
    //     opacity: 0,
    //     transform: 'translateX(100%)'
    //   }))
    //])
  ])

  ]
  
  
})



export class DisplayComponent  { 

 //incoming data from loggingService Get request

 /*
    dataset looks like this:

    {
      [client: "", timeCat:(1-4 value), time: "", node: ""]
    }
 */

 
  /**** Animations ****/

  public flyOutIn:boolean = true;
  public hideShow:boolean = true;




  public dataset:Dataset[] = [];
  public clientTotals:any = {};
  public clientList:string[] = [];

  public currentClient = "ALL";
  public currentNode = "ALL";
  public timeFilter = "ALL";
  
  public activelyLookForData: boolean = false;
  public myInterval: any;
  public intervalStarted: boolean = false;
  
  public allData = {
    clientTotals:<any>[{client: "", total: ""}],
    clientList: <any> [],
    currentClient: "ALL",
    nodeList:<any> [],
    currentNode: "ALL",
    timeList: <any> ["ALL", "Last 30", "Last 5"],
    timeFilter: "ALL",

  }

  public filterArray: string[] = [this.allData.currentClient, this.allData.currentNode, this.allData.timeFilter];

  constructor (private loggerService: LoggerService) {}


   ngOnInit(): void {


    this.loggerService.getLoggerData()
      .then(dataset => this.setData(dataset) );
  }

 
  setData(dataset:any) 
  {
    this.dataset = dataset;
    this.dataset = this.dataset.slice();
    
    this.setClientList();
    this.setNodeList();

  }
    //access a service component to populate client options list

    //watch options menu for changes, execute functions based on which option selected

 
  
  setClientList() 
  {
    
     let items:any = [];
     items.push("ALL");
    //create labels array which fills 'pieChartLables[]'
    // create clientTotals object keys dynamically from current clients
     for(let x = 0; x < this.dataset.length; x++)
     {
       
      
        if (items.indexOf(this.dataset[x].client) === -1 )
        {
          items.push(this.dataset[x].client);
          
        }
      }
      items.sort();
      this.allData.clientList = items;
  }
  
  setNodeList() 
  {
    
     let items:any = [];
     items.push("ALL");
    //create labels array which fills 'pieChartLables[]'
    // create clientTotals object keys dynamically from current clients
     for(let x = 0; x < this.dataset.length; x++)
     {
      
        if (items.indexOf(this.dataset[x].node) === -1 )
        {
          items.push(this.dataset[x].node);
          
        }
      }

      items.sort();
      this.allData.nodeList = items;
  }

  clientChange(value:string)
  {
    this.allData.currentClient = value;
    this.currentClient = value;
    console.log(this.allData.currentClient);
  }

  nodeChange(value:string)
  {
    this.allData.currentNode = value;
    this.currentNode = value;
    console.log(this.allData.currentNode);
  }

  timeChange(value:string)
  {
    this.allData.timeFilter = value;
    this.timeFilter = value;
    console.log(this.allData.timeFilter);
  }

  toggleCheck ()
  {
    if( this.activelyLookForData == true ) this.activelyLookForData = false;
    else 
    {
    
    this.loggerService.getLoggerData()
    .then(dataset => this.setData(dataset) );
    
    this.activelyLookForData = true;
    
     setTimeout( () => {
      
        this.activelyLookForData = false;
     }, 3000) 
      
    }
  }

  intervalCheckNewData () {

    // because setInterval acts on the window, any functions inside
    // lose their association with DisplayComponent so we create 
    // _this which points to "DisplayComponent"
    var _this = this;
    this.myInterval = setInterval(function () 
    { 
      // if statement toggle triggers setChart Component OnChange()
      // to force it to get new data
      if(_this.activelyLookForData == false)
      {
        _this.activelyLookForData = true;
      } else { _this.activelyLookForData = false; }
      
      console.log("Interval Iteration");
      _this.getDataFromService();
      
    
    }, 5000);
  }

  getDataFromService () {
     this.loggerService.getLoggerData()
        .then(dataset => this.setData(dataset) );
       
  }

  stopIntervalCheckNewData () {
    clearInterval(this.myInterval);
    console.log("Interval cleared");
    this.activelyLookForData = false;
  }

  toggleInterval () {

    if(this.intervalStarted == false )
    {
      this.intervalStarted = true;
      this.intervalCheckNewData();
    }
    else {
      this.intervalStarted = false;
      this.stopIntervalCheckNewData();
    }

  }
  resetSelect ()
  {
    this.currentClient = "ALL";
    this.currentNode = "ALL";
    this.timeFilter = "ALL";
    this.allData.timeFilter = "ALL";
    this.allData.currentClient = "ALL";
    this.allData.currentNode = "ALL";
  }

 /** Animations  **/

 toggleFilters () {

   if(this.hideShow == true && this.flyOutIn == true ) 
   { 
     this.flyOutIn = false;
     let variable = this.flyOutIn;
     this.hideShow = false;
     console.log("FlyOutIn == " + variable)
   }
   else { 
     this.hideShow = true; 
     this.flyOutIn = true;
  }
   console.log("toggle activated");
 }


 }
