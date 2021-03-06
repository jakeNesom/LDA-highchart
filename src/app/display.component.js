"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var loggerdata_service_1 = require("./loggerdata.service");
var animations_1 = require("@angular/animations");
var DisplayComponent = (function () {
    function DisplayComponent(loggerService) {
        this.loggerService = loggerService;
        //incoming data from loggingService Get request
        /*
           dataset looks like this:
       
           {
             [client: "", timeCat:(1-4 value), time: "", node: ""]
           }
        */
        /**** Animations ****/
        this.flyOutIn = true;
        this.hideShow = true;
        this.dataset = [];
        this.clientTotals = {};
        this.clientList = [];
        this.currentClient = "ALL";
        this.currentNode = "ALL";
        this.timeFilter = "ALL";
        this.activelyLookForData = false;
        this.intervalStarted = false;
        this.allData = {
            clientTotals: [{ client: "", total: "" }],
            clientList: [],
            currentClient: "ALL",
            nodeList: [],
            currentNode: "ALL",
            timeList: ["ALL", "Last 30", "Last 5"],
            timeFilter: "ALL",
        };
        this.filterArray = [this.allData.currentClient, this.allData.currentNode, this.allData.timeFilter];
    }
    DisplayComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    DisplayComponent.prototype.setData = function (dataset) {
        this.dataset = dataset;
        this.dataset = this.dataset.slice();
        this.setClientList();
        this.setNodeList();
    };
    //access a service component to populate client options list
    //watch options menu for changes, execute functions based on which option selected
    DisplayComponent.prototype.setClientList = function () {
        var items = [];
        items.push("ALL");
        //create labels array which fills 'pieChartLables[]'
        // create clientTotals object keys dynamically from current clients
        for (var x = 0; x < this.dataset.length; x++) {
            if (items.indexOf(this.dataset[x].client) === -1) {
                items.push(this.dataset[x].client);
            }
        }
        items.sort();
        this.allData.clientList = items;
    };
    DisplayComponent.prototype.setNodeList = function () {
        var items = [];
        items.push("ALL");
        //create labels array which fills 'pieChartLables[]'
        // create clientTotals object keys dynamically from current clients
        for (var x = 0; x < this.dataset.length; x++) {
            if (items.indexOf(this.dataset[x].node) === -1) {
                items.push(this.dataset[x].node);
            }
        }
        items.sort();
        this.allData.nodeList = items;
    };
    DisplayComponent.prototype.clientChange = function (value) {
        this.allData.currentClient = value;
        this.currentClient = value;
        console.log(this.allData.currentClient);
    };
    DisplayComponent.prototype.nodeChange = function (value) {
        this.allData.currentNode = value;
        this.currentNode = value;
        console.log(this.allData.currentNode);
    };
    DisplayComponent.prototype.timeChange = function (value) {
        this.allData.timeFilter = value;
        this.timeFilter = value;
        console.log(this.allData.timeFilter);
    };
    DisplayComponent.prototype.toggleCheck = function () {
        var _this = this;
        if (this.activelyLookForData == true)
            this.activelyLookForData = false;
        else {
            this.loggerService.getLoggerData()
                .then(function (dataset) { return _this.setData(dataset); });
            this.activelyLookForData = true;
            setTimeout(function () {
                _this.activelyLookForData = false;
            }, 3000);
        }
    };
    DisplayComponent.prototype.intervalCheckNewData = function () {
        // because setInterval acts on the window, any functions inside
        // lose their association with DisplayComponent so we create 
        // _this which points to "DisplayComponent"
        var _this = this;
        this.myInterval = setInterval(function () {
            // if statement toggle triggers setChart Component OnChange()
            // to force it to get new data
            if (_this.activelyLookForData == false) {
                _this.activelyLookForData = true;
            }
            else {
                _this.activelyLookForData = false;
            }
            console.log("Interval Iteration");
            _this.getDataFromService();
        }, 5000);
    };
    DisplayComponent.prototype.getDataFromService = function () {
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    DisplayComponent.prototype.stopIntervalCheckNewData = function () {
        clearInterval(this.myInterval);
        console.log("Interval cleared");
        this.activelyLookForData = false;
    };
    DisplayComponent.prototype.toggleInterval = function () {
        if (this.intervalStarted == false) {
            this.intervalStarted = true;
            this.intervalCheckNewData();
        }
        else {
            this.intervalStarted = false;
            this.stopIntervalCheckNewData();
        }
    };
    DisplayComponent.prototype.resetSelect = function () {
        this.currentClient = "ALL";
        this.currentNode = "ALL";
        this.timeFilter = "ALL";
        this.allData.timeFilter = "ALL";
        this.allData.currentClient = "ALL";
        this.allData.currentNode = "ALL";
    };
    /** Animations  **/
    DisplayComponent.prototype.toggleFilters = function () {
        if (this.hideShow == true && this.flyOutIn == true) {
            this.flyOutIn = false;
            var variable = this.flyOutIn;
            this.hideShow = false;
            console.log("FlyOutIn == " + variable);
        }
        else {
            this.hideShow = true;
            this.flyOutIn = true;
        }
        console.log("toggle activated");
    };
    return DisplayComponent;
}());
DisplayComponent = __decorate([
    core_1.Component({
        selector: 'displayComponent',
        templateUrl: "app/views/display.html",
        styleUrls: ['app/css/display.css'],
        animations: [
            animations_1.trigger('hideFilters', [
                animations_1.state('0', animations_1.style({ transform: 'translate3d(0,0,0)' })),
                animations_1.state('1', animations_1.style({ transform: 'translate3d(0, -200%, 0)', display: 'none' })),
                // state('0' , style({ opacity: 1, /*transform: 'scale(1.0)'*/ })),
                // state('1', style({ display:'none', height: 0, opacity: 0, /*transform: 'scale(0.0)'*/  })),
                animations_1.transition('1 => 0', 
                //style({height: 10, opacity: 0}),
                animations_1.animate('1000ms 500ms ease-in', animations_1.keyframes([
                    animations_1.style({ transform: 'translate3d(0, -200%, 0)', offset: 0 }),
                    animations_1.style({ transform: 'translate3d(0, 3%, 0)', offset: 0.6 }),
                    animations_1.style({ transform: 'translate3d(0, 0, 0)', offset: 1.0 })
                ]))),
                animations_1.transition('0 => 1', animations_1.animate('1000ms 500ms ease-out', animations_1.keyframes([
                    animations_1.style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
                    animations_1.style({ transform: 'translate3d(0, 3%, 0)', offset: 0.3 }),
                    animations_1.style({ transform: 'translate3d(0, -200%, 0)', offset: 1.0 })
                ])))
            ]),
            animations_1.trigger('flyOutIn', [
                animations_1.state('1', animations_1.style({ transform: 'translate3d(0,0,0)' })),
                animations_1.state('0', animations_1.style({ transform: 'translate3d(-103%, 0,0)' })),
                animations_1.transition('1 => 0', animations_1.animate('0.4s 100ms ease-out', animations_1.keyframes([
                    animations_1.style({ transform: 'translate3d(0,0,0)', offset: 0 }),
                    animations_1.style({ transform: 'translateX(20px)', offset: 0.3 }),
                    animations_1.style({ transform: 'translate3d(-103%,0,0)', offset: 1.0 })
                ]))),
                animations_1.transition('0 => 1', animations_1.animate('0.4s 1000ms ease-in', animations_1.keyframes([
                    animations_1.style({ transform: 'translate3d(-103%,0,0)', offset: 0 }),
                    animations_1.style({ transform: 'translate3d(15px, 0, 0)', offset: 0.3 }),
                    animations_1.style({ transform: 'translate3d(0,0,0)', offset: 1.0 })
                ]))),
            ])
        ]
    }),
    __metadata("design:paramtypes", [loggerdata_service_1.LoggerService])
], DisplayComponent);
exports.DisplayComponent = DisplayComponent;
//# sourceMappingURL=display.component.js.map