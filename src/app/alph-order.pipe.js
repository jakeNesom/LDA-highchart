"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/*
    
    http://stackoverflow.com/questions/35158817/angular-2-orderby-pipe
    Sort an array of values by alphanumeric order before displaying in a list

*/
var alphaNumOrder = (function () {
    function alphaNumOrder() {
    }
    alphaNumOrder.prototype.transform = function (values) {
        var array = values;
    };
    return alphaNumOrder;
}());
alphaNumOrder = __decorate([
    core_1.Pipe({ name: 'alphaNumOrder ' })
], alphaNumOrder);
exports.alphaNumOrder = alphaNumOrder;
//# sourceMappingURL=alph-order.pipe.js.map