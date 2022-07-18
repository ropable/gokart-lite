# gokart-lite

An engine for embedded map widget written with [leaflet](https://leafletjs.com) .

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
git commit -am "new point release"
git tag -a "vX.XX"
git push --tags

# lint all *.js and *.vue files
npm run lint

# run unit tests
npm test
```
## Environment variables

``` bash
1. DIST_TYPE :  Distribution type, two options: 'release' ,'dev'
2. ENV_TYPE  : Map widget env type, three classic options: 'prod', 'uat' and 'dev'; gokart-list uses APP_NAME,DIST_TYPE and ENV_TYPE to find the map widget settings in the js file './dist/[DIST_TYPE]/[APP_NAME]-[ENV_TYPE].env.js'

```
## How to add a new map app

``` bash
1. Naming the map app; for example, the app is 'todaysburns'
2. Listing possible running env types; for example, 'prod', 'uat' and 'dev'
3. Adding the js settings files in folder ./dist/release/static/js,
   A. prod: todaysburns-prod.env.js 
   B. uat: todaysburns-uat.env.js 
   C. dev: todaysburns-dev.env.js 
```

## Map app settings

``` bash
# The following is the exmaple settings for 'Indicative Burning Program'
var ibpEnv = {
    title:"Indicative Burning Program",

    whoamiUrl:"/sso/profile",

    gokartService:"https://ssslite.dpaw.wa.gov.au",

    cswService:"https://csw.dpaw.wa.gov.au/catalogue/api/records/",

    wmtsService:"https://kmi.dpaw.wa.gov.au/geoserver/gwc/service/wmts",
    wmsService:"https://kmi.dpaw.wa.gov.au/geoserver/wms",
    wfsService:"https://kmi.dpaw.wa.gov.au/geoserver/wfs",

    publicWmtsService:"https://kmi.dpaw.wa.gov.au/geoserver/public/gwc/service/wmts",
    publicWmsService:"https://kmi.dpaw.wa.gov.au/geoserver/public/wms",
    publicWfsService:"https://kmi.dpaw.wa.gov.au/geoserver/public/wfs",

    app:"ibp",
    cswApp:"ibp",

    map: {
        crs:"EPSG:4326",
        center:[-31.95296,115.86067 ],
        minZoom:2,
        maxZoom:17,
        maxBounds:[[-36,112.6],[-13,129.1]],
        bounds:[[-36,112.6],[-13,129.1]],

        zoomControl:true,
        attributionControl:false,
        scaleControl:false,
        fullpageControl:false,
        featureCountControl:true,

        zoomSnap:1,
        zoomDelta:1,
        traceResize:true,
        boxZoom:true,
        doubleClickZoom:true,
        dragging:true,

        zoomAnimation:true,
        zoomAnimationThreshold:4,
        fadeAnimation:true,
        markerZoomAnimation:true,

        keyboard:true,
        keyboardPanDelta:80
    },

    //layerType: three types: baselayer, overlayer,toplayer
    //base layer always has zindex 1, only one base layer can be shown on map
    //overlayer are layers between base layer and top layer
    //  all overlayers loaded from csw but not configured in environment file have zindex 2
    //  all overlayers cofigured in environment but without configured a correct zindex will receive a zindex from 3 to 100, based on configure order.
    //  all overlayers configure in enviromment with a valid zindex between 100 to 1000, will receive the configured zindex
    //toplayer are layers on the top, always has zindex 1000, only one top layer can be shown on map, user can click on the map to get the detail information of the related feature
    layers:[{
        id:"public:mapbox-streets",
        serviceType:"WMTS",
        layerType:"baselayer",
        options:{
        }
    },{
        id:"public:latest_indicative_burn_program2",
        type:"WMTS",
        layerType:"toplayer",
        geometryType:"polygon",
        geometryColumn:"shape",
        options:{
            style:"public:latest_indicative_burn_program2.ShowPinpoint"
        },
        featureInfo:{
            highlight:true,
            buttons:["clear"],
            tryMinZoom:6,
            tryBuffers:10,
            //used in the first time to fetch the features, default is 1 for polygon ,10 for others
            buffer:1,
            style:{
                stroke:true,
                color:"#ff0000",
                weight:3,
                opacity:1,
                fill:true,
                fillColor:"ff0000",
                fillOpacity:0.3
            },
            properties: ["burnid","region","district","location","purpose_1",{name:"area_ha",precision:0},{name:"perim_km",precision:0}]
        }
    }],
    //configuration for feature info popup
    featureInfoPopup:{
        options:{
        }
    },
    fullpageControl: {
        options:{
        }
    },
    featureCountControl:{
        options:{
            html:"<div style='color:#2a044e;font-weight:bold;font-size:18px'>Total Indicative Burning Program : <span id='total_count'></span> </div>",
            featurecount :[
                ["total_count",null]
            ]
        }
    }

};
```

## How to embed a widget into a web page

``` bash
Three steps to embed the map widget for todays burns
1. Configure gokart options

var gokartOptions = {
    app:"todaysburns", //the application name
    containerId:"map", //the id of the html element which contains the map widget
    name:"gokart" //the global variable name of this gokart instance, default is gokart
}

2. Declare the html element to contain the map widget

<div id="map" style="border-style:double;width:100%;height:600px" />

3. Load gokart's bootstrap.js

<script type="text/javascript" src="https://ssslite.dpaw.wa.gov.au/dist/static/js/bootstrap.js" ></script>

```
