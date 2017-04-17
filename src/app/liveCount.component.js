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
var LiveCount = (function () {
    function LiveCount(loggerService) {
        this.loggerService = loggerService;
        this.options = {
            chart: {
                type: 'area',
                animation: true,
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
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.chart.series[0].dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        this.chart.series[0].numberFormat(this.y, 2);
                }
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
                        var data = [], time = (new Date()).getTime(), i;
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
    LiveCount.prototype.ngOnChanges = function (changes) {
        for (var key in changes) {
            if (key == "activelyLookForData") {
                this.lookForNewData();
            }
        }
    };
    LiveCount.prototype.ngOnInit = function () {
        this.startInterval();
    };
    LiveCount.prototype.saveInstance = function (chartInstance) {
        this.chart = chartInstance;
    };
    LiveCount.prototype.lookForNewData = function () { };
    LiveCount.prototype.startInterval = function () {
        var _this = this; // setInterval acts on document so it messes up "this" reference
        this.myInterval = setInterval(function () {
            var x = (new Date()).getTime(), // current time
            y = Math.random();
            console.log("Interval Iteration");
            _this.chart.series[0].addPoint([x, y], true, true);
        }, 1000);
    };
    LiveCount.prototype.stopInterval = function () {
        clearInterval(this.myInterval);
        console.log("interval cleared");
    };
    return LiveCount;
}()); // end of component
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], LiveCount.prototype, "activelyLookForDataC", void 0);
LiveCount = __decorate([
    core_1.Component({
        selector: 'liveCount',
        styles: [],
        templateUrl: 'app/views/liveCount.html',
    }),
    __metadata("design:paramtypes", [loggerdata_service_1.LoggerService])
], LiveCount);
exports.LiveCount = LiveCount;
//# sourceMappingURL=liveCount.component.js.map