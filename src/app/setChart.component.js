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
var platform_browser_1 = require("@angular/platform-browser");
var core_2 = require("@angular/core");
var loggerdata_service_1 = require("./loggerdata.service");
//ng on changes
//http://stackoverflow.com/questions/35823698/how-to-make-ngonchanges-work-in-angular2
var SetChart = (function () {
    // variable toggles activelyLook() to stop the repeating get requests
    // creating instance of LoggerService, initializing the high-charts options
    function SetChart(loggerService, sanitizer, _applicationRef) {
        this.loggerService = loggerService;
        this.sanitizer = sanitizer;
        this._applicationRef = _applicationRef;
        //incoming data from loggingService Get request
        this.dataset = [];
        //public clientTotals:any[] = [];
        this.clientTotals = {};
        this.filters = { client: "ANY", node: "ANY", time: "ANY" };
        this.clientLabels = [];
        this.nodeLabels = [];
        this.initFlag = false;
        this.newDataListening = false;
        this.changeFlag = false;
        // some example graph options that will appear if your methods aren't working correctly
        this.incomingOptions = {
            xAxis: {
                categories: ["Node A", "Node B", "Node C"]
            },
            chart: { type: 'column' },
            title: { text: '' },
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
                    data: [1, 2, 4] }
            ]
        };
        this.options = {
            xAxis: {
                categories: ["Node A", "Node B", "Node C", "Node D"]
            },
            chart: { type: 'column' },
            title: { text: '' },
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
    SetChart.prototype.ngOnChanges = function (changes) {
        var _this = this;
        console.log("onChange fired");
        console.log("changing", changes);
        for (var key in changes) {
            if (key == "currentClientC") {
                this.filters.client = this.currentClientC;
            }
            if (key == "currentNodeC") {
                this.filters.node = this.currentNodeC;
            }
            if (key == "timeFilterC") {
                this.filters.time = this.timeFilterC;
            }
        }
        if (this.initFlag = true) {
            this.loggerService.getLoggerData()
                .then(function (dataset) { return _this.setData(dataset); });
        }
        for (var key in changes) {
            if (key == "activelyLookForData") {
                this.lookForNewData();
            }
        }
    };
    SetChart.prototype.saveInstance = function (chartInstance) {
        this.chart = chartInstance;
    };
    // on init - run get service and initially set the data
    SetChart.prototype.ngOnInit = function () {
        // this.loggerService.getLoggerData()
        //  .then(dataset => this.dataset = dataset );
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    SetChart.prototype.lookForNewData = function () {
        var newData;
        this.loggerService.getLoggerData()
            .then(function (data) { return newData = data; });
        if (newData !== this.dataset) {
            this.setData(newData);
        }
    };
    //anytime you want to ADD a new client you have to use "addSeries()"
    SetChart.prototype.updateData = function () {
        this.chart.addSeries({
            type: 'column',
            name: 'Client D',
            data: [1, 2, 4, 3]
        });
    };
    SetChart.prototype.setData = function (incomingData, filter) {
        if (this.initFlag === true) {
            console.log("Updating using data: " + incomingData);
        }
        // this if statement should only be true on init
        if (incomingData) {
            this.dataset = incomingData;
            this.dataset = this.dataset.slice();
            if (this.initFlag === false)
                this.initFlag = true;
        }
        else
            (console.log('IncomingData parameter of setData() not defined'));
        // filter time, then client, then node
        if (this.timeFilterC != "ALL") {
            this.filterTime();
        }
        if (this.currentClientC != "ALL") {
            this.filterClient();
        }
        if (this.currentNodeC !== "ALL") {
            this.filterNode();
        }
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
    };
    SetChart.prototype.filterTime = function () {
        var data = this.dataset;
        var currentTime = ["12", "31", "00"];
        var currentMinutes = parseInt(currentTime[1]);
        var i = 0;
        while (i < data.length) {
            var time = data[i].time.split(":");
            var minutes = parseInt(time[1]);
            if (this.timeFilterC == "Last 5") {
                if (minutes <= (currentMinutes - 5)) {
                    data.splice(i, 1);
                }
                else
                    i++;
            }
            else if (this.timeFilterC == "Last 30") {
                if (minutes <= (currentMinutes - 30)) {
                    data.splice(i, 1);
                }
                else
                    i++;
            }
        }
        this.dataset = data.slice();
    };
    SetChart.prototype.filterClient = function () {
        var data = this.dataset;
        var i = 0;
        while (i < data.length) {
            if (data[i].client != this.currentClientC) {
                data.splice(i, 1);
            }
            else
                i++;
        }
        this.dataset = data;
        this.dataset.slice();
    };
    SetChart.prototype.filterNode = function () {
        var data = this.dataset;
        var i = 0;
        while (i < data.length) {
            if (data[i].node != this.currentNodeC) {
                data.splice(i, 1);
            }
            else
                i++;
        }
        this.dataset = data;
        this.dataset.slice();
    };
    SetChart.prototype.setClientLabels = function (incomingData) {
        var labels = [];
        for (var x = 0; x < incomingData.length; x++) {
            if (labels.indexOf(incomingData[x].client) === -1) {
                labels.push(incomingData[x].client);
            }
        }
        this.clientLabels = labels;
        this.clientLabels.slice();
        //set labels for incomingOptions Series
        for (var i = 0; i < this.clientLabels.length; i++) {
            this.incomingOptions.series[i] = {};
            this.incomingOptions.series[i].data = [];
            this.incomingOptions.series[i].name = labels[i];
        }
    };
    SetChart.prototype.reInitializeChartSeries = function () {
        /* Use this method to add-more / remove clients from the 'series' property of the
           highcharts chart  - this.chart.series
           ---- Should run this method every time you check for new data */
        // when you want to show more clients on the graph than before:
        if (this.chart.series.length < this.clientLabels.length) {
            var extraProperties = this.clientLabels.length - this.chart.series.length;
            for (var i = 0; i < extraProperties; i++) {
                this.chart.addSeries({
                    name: 'place',
                    data: [0]
                });
            }
        }
        else if (this.chart.series.length > this.clientLabels.length) {
            while (this.chart.series.length > this.clientLabels.length) {
                this.chart.series[this.clientLabels.length].remove();
            }
        }
    };
    SetChart.prototype.setNodeLabels = function (incomingData) {
        /* This method creates an array of nodes */
        var labels = [];
        //create labels array which fills 'pieChartLables[]'
        for (var x = 0; x < incomingData.length; x++) {
            if (labels.indexOf(incomingData[x].node) === -1) {
                labels.push(incomingData[x].node);
            }
        }
        this.nodeLabels = labels;
        this.nodeLabels = this.nodeLabels.slice();
        // set node labels to the categories section of  incoming Options
        this.incomingOptions.xAxis.categories = labels;
    };
    SetChart.prototype.countAllClientsNodes = function (incomingData, filter) {
        //clear out old data from ClientTotals
        this.clientTotals = {};
        var clabels = [];
        var nlabels = [];
        clabels = this.clientLabels;
        nlabels = this.nodeLabels;
        // initialize clientTotals object properties
        for (var h = 0; h < clabels.length; h++) {
            this.clientTotals[clabels[h]] = {};
            for (var i = 0; i < nlabels.length; i++) {
                this.clientTotals[clabels[h]][nlabels[i]] = {};
                this.clientTotals[clabels[h]][nlabels[i]]["total"] = 0;
            }
        }
        // Fill clientTotals Object with count data
        // for each present Client
        var size = 0;
        for (var client in this.clientTotals) {
            //cycle through every array property
            for (var i = 0; i < incomingData.length; i++) {
                // if one of the array properties matches this client
                if (client == incomingData[i].client) {
                    //cycle through each node for that client
                    for (var node in this.clientTotals[client]) {
                        // if if one of the nodes matches the incoming data array nodes
                        if (node == incomingData[i].node) {
                            // incrememnt the 'total' property of clienttotals.thisclient.thisnode.total
                            this.clientTotals[client][node]["total"]++;
                        }
                    }
                }
            }
            size++;
        }
    };
    SetChart.prototype.setChartData = function () {
        // Initialize barChartData object array
        // -- if you don't initialize the array with the number of objects it will contain,
        // the data won't show up correctly
        //this.barChartData = new Array(this.clientLabels.length-1);
        var clabels = [];
        var nlabels = [];
        clabels = this.clientLabels;
        nlabels = this.nodeLabels;
        for (var i = 0; i < clabels.length; i++) {
            for (var j = 0; j < nlabels.length; j++) {
                this.incomingOptions.series[i].data[j] = this.clientTotals[clabels[i]][nlabels[j]].total;
            }
        }
        this.chart.xAxis[0].setCategories(this.incomingOptions.xAxis.categories);
        for (var k = 0; k < this.incomingOptions.series.length; k++) {
            this.chart.series[k].update(this.incomingOptions.series[k]);
        }
    };
    return SetChart;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SetChart.prototype, "currentClientC", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SetChart.prototype, "currentNodeC", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SetChart.prototype, "timeFilterC", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SetChart.prototype, "activelyLookForDataC", void 0);
SetChart = __decorate([
    core_1.Component({
        selector: 'setChart',
        styles: ["\n      chart {\n        display:block;\n      }\n  "],
        templateUrl: 'app/views/setchart.html',
    }),
    __metadata("design:paramtypes", [loggerdata_service_1.LoggerService,
        platform_browser_1.DomSanitizer,
        core_2.ApplicationRef])
], SetChart);
exports.SetChart = SetChart;
//# sourceMappingURL=setChart.component.js.map