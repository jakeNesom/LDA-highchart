# lite-server patching for CORS 
http://stackoverflow.com/questions/35086608/npm-start-using-cors
I had to follow instructions to patch the lite server to read cors so this localhost server can talk to the nodejs server @ localhost:3039 and read the get api
Since i changed node_modules files those changes aren't part of the commit and you'll need to recreate the changes when downloading the repository from other machines


# Puprpose

This project was created to display some simple stats from a node.js/mongo db application.  As clients log information via the node.js app into the mongoDB, This angular app acceses an express get API to view and chart the interactions

Information charted: 
 - Client Name
 - virtual load balancing - Represented as "NODE" this shows categorically which child-process handled the intake of the client's log


 # Angular modules / techniques used

 - A custom service handles the http requests with the node.js app

 - Angular 2 HighCharts is used for graphically representing the data
    - https://www.npmjs.com/package/angular2-highcharts
 - A material Design implementation of bootstrap is used for layout
    - http://fezvrasta.github.io/bootstrap-material-design/#about
  
 - Custom Angular Animations are used to show/hide the incoming data and filter menu
  
 - Custom Angular Filters are used to sort some dynamically created options lists (Still being tested)





# Angular QuickStart Source

Project built using Angular Quickstart starter files
[![Build Status][travis-badge]][travis-badge-url]

This repository holds the TypeScript source code of the [angular.io quickstart](https://angular.io/docs/ts/latest/quickstart.html),
the foundation for most of the documentation samples and potentially a good starting point for your application.

