"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
//import { ChartsModule } from 'ng2-charts';
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var nav_component_1 = require("./nav.component");
var setChart_component_1 = require("./setChart.component");
var display_component_1 = require("./display.component");
var loggerdata_service_1 = require("./loggerdata.service");
//import { Chart2 } from './chart2.component';
var angular2_highcharts_1 = require("angular2-highcharts");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            //ChartsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            //InMemoryWebApiModule.forRoot(InMemoryDataService),
            angular2_highcharts_1.ChartModule.forRoot(require('highcharts'))
        ],
        declarations: [
            app_component_1.AppComponent,
            nav_component_1.NavComponent,
            setChart_component_1.SetChart,
            display_component_1.DisplayComponent,
        ],
        providers: [loggerdata_service_1.LoggerService],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map