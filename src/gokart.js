import Map from './components/map.js'
import {getCRS} from './components/crs.js'
import {Layer} from './components/layer.js'
import {utils} from 'src/vendor.js'

var serviceUrlRe = new RegExp('^(?<service>([htps]+:\\/\\/)?[a-z0-9_\\.\\-]+(:[0-9]+)?)(?<path>(\\/.*)?$)','i')

var domainRe = new RegExp('^((?<protocol>([htps]+)):\\/\\/)?(?<app>[a-z0-9_\\-]+)((?<domain>\\.[a-z0-9_\\.\\-]+))?(:(?<port>[0-9]+))?$','i')

var Gokart = function(app,mapid,embeded,gokartService) {
    //initialize env
    this.env = eval(app + "Env")
    if (typeof gokartOptions !== 'undefined') {
        if (Array.isArray(gokartOptions)) {
            var options = gokartOptions.find(function(o) {return o["app"] === app})
            if (options) {
                this.env = utils.extend(this.env,options)   
            }
        } else if (gokartOptions["app"] === app) {
            this.env = utils.extend(this.env,gokartOptions)   
        } else if (!("app" in gokartOptions)) {
            this.env = utils.extend(this.env,gokartOptions)   
        }
    }
    this.env["app"] = app
    this.env["mapid"] = mapid
    this.embeded = embeded?true:false
    try {
        if (this.embeded) { 
            if (gokartService) {
                this.gokartService = gokartService
                this.gokartDomain = this.gokartService.match(domainRe).groups["domain"] || null
                
                if (this.gokartDomain) {
                    this.sameDomain = (window.top.location.host.endsWith(this.gokartDomain))?true:false
                } else {
                    this.sameDomain = false
                }
                this.sameDomain = (window.top.location.host.endsWith(this.gokartDomain))?true:false
            } else {
                this.gokartService = undefined
                this.gokartDomain = undefined
                this.sameDomain = false
            }
        } else {
            this.gokartService = window.location.toString().match(serviceUrlRe).groups["service"]
            this.gokartDomain = this.gokartService.match(domainRe).groups["domain"] || null
            this.sameDomain = (this.gokartDomain)?true:false
        }
    } catch (ex) {
        this.gokartService = undefined
        this.gokartDomain = undefined
        this.sameDomain = false
    }
     

    var vm = this
    $.each([["publicWmtsService","wmtsService"],["publicWmsService","wmsService"],["publicWfsService","wfsService"]],function(index,config){
        if (!vm.env[config[0]]) {
            vm.env[config[0]] = vm.env[config[1]]
        }
    })
    
    //try to authenticate user
    if (this.sameDomain) {
        $.ajax({
            url: this.env["whoamiUrl"],
            method:"GET",
            dataType:"json",
            success: function (response, stat, xhr) {
                vm.user = response
                vm.user["authenticated"] = vm.user["session_key"]?true:false
                //create leaflet map
                vm.map = new Gokart.Map(vm)
            },
            error: function (xhr,status,message) {
                vm.user = {authenticated:false}
                //create leaflet map
                vm.map = new Gokart.Map(vm)
            },
            xhrFields: {
              withCredentials: true
            }
        })
    } else {
        this.user = {authenticated:false}
        //create leaflet map
        this.map = new Gokart.Map(vm)
    }
}

Gokart.prototype.isAuthenticated = function() {
    return (this.user && this.user["authenticated"])?true:false
}

Gokart.Map = Map;
Gokart.Layer = Layer;
Gokart.getCRS = getCRS;
Gokart.utils = utils;

export  default Gokart
