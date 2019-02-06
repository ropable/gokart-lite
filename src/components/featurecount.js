import L from 'leaflet/dist/leaflet-src.js'


L.Control.FeatureCount = L.Control.extend({
    options: {
        position:"bottomleft"
    },
    setFeatureCountOption:function(featurecount_option) {
        if (featurecount_option) {
            if (Array.isArray(featurecount_option)) {
                if (featurecount_option.length === 0) {
                    //don't configure any feature count, use the default one
                    this._featureCountOption = [["featurecount",null,"#featurecount"]]
                } else if (Array.isArray(featurecount_option[0])) {
                    //define multiple feature count
                    $.each(featurecount_option,function(index,option){
                        if (option.length === 0){
                            option.push("featurecount")
                            option.push(null)
                            option.push("#featurecount")
                        } else if (option.length === 1){
                            //only declare the key,
                            option.push(null)
                            option.push("#" + option[0])
                        } else if (option.length === 2){
                            //only declare the key and cqlcondition
                            option.push("#" + option[0])
                        } else {
                            //declare the key ,cqlcondition and html element selection
                        }
                    })
                    this._featureCountOption = featurecount_option
                } else {
                    //define one feature count
                    if (featurecount_option.length === 1){
                        //only declare the key,
                        featurecount_option.push(null)
                        featurecount_option.push("#" + featurecount_option[0])
                    } else if (featurecount_option.length === 2){
                        //only declare the key and cqlcondition
                        featurecount_option.push("#" + featurecount_option[0])
                    } else {
                        //declare the key ,cqlcondition and html element selection
                    }
                    this._featureCountOption = [featurecount_option]
                }

            } else {
                this._featureCountOption = [[featurecount_option,null,"#" + featurecount_option]]
            }
        } else {
            this._featureCountOption = [["featurecount",null,"#featurecount"]]
        }
    },
    setLayer:function(layer) {
        if (!layer) {
            this._layer = null
            this._div.innerHTML = ""
            this.setFeatureCountOption()
            return
        }
        if (this._layer === layer) {
            //same layer
            return
        }
        this._layer = layer
        if (this._layer._featureCountControl && this._layer._featureCountControl.options && this._layer._featureCountControl.options.html) {
            var vm = this
            this.setFeatureCountOption(this._layer._featureCountControl.options["featurecount"])
            if (typeof this._layer._featureCountControl.options["html"] === "function") {
                this._layer._featureCountControl.options["html"].call(this._layer,function(html){
                    vm._div.innerHTML = html
                    if (vm._map) {
                        //already add to the map
                        vm.showFeatureCount()
                    }
                })
                return
            } else {
                this._div.innerHTML = this._layer._featureCountControl.options["html"]
                if (this._map) {
                    //already add to the map
                    this.showFeatureCount()
                }
            }
        } else if (this._map) {
            //already add to the map
            this.showFeatureCount()
        }

    },
    showFeatureCount:function(refresh) {
        if (!this._featureCountOption) {
            return
        }
        var vm = this
        if (this._layer) {
            $.each(vm._featureCountOption,function(index,option) {
                vm._layer.getFeatureCount(refresh,option,function(featurecount){
                    $(vm._div).find(option[2]).html(featurecount)
                },function(msg){
                    $(vm._div).find(option[2]).html(msg)
                })
            })
        } else {
            $.each(vm._featureCountOption,function(index,option) {
                $(vm._div).find(option[2]).html("")
            })
        }
    },
    onAdd:function(map) {
        var vm = this
        return this._div;
    },

})

L.Control.FeatureCount.addInitHook(function() {
    var vm = this
    this._layer = null
    this._div = L.DomUtil.create('div');
    this._div.id = "featurecount_control";
    this._featureCountOption = null;
    if (this.options["html"]) {
        this.setFeatureCountOption(this.options["featurecount"])
        if (typeof this.options["html"] === "function") {
            var vm = this
            this.options["html"].call(this,function(html) {
                vm._div.innerHTML = html
            })
            return
        } else {
            this._div.innerHTML = this.options["html"]
        }
    } else {
        this._div.innerHTML = ""
        this.setFeatureCountOption()
    }

})

L.control.featureCount = function(map,opts) {
    if (opts === undefined || opts === null) {
        opts = (map.gokart.env["featureCountControl"] && map.gokart.env["featureCountControl"]["options"])?map.gokart.env["featureCountControl"]["options"]:{}
    } 
    var control = new L.Control.FeatureCount(opts)
    control.map = map
    return control
}

export default L
