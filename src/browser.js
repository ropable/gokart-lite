if (!Array.prototype.find) {

    Array.prototype.find = function(func) {
        for(var i = 0;i < this.length; i++) {
            if (func(this[i])) {
                return this[i]
            }
        }
        return undefined
    }

}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(str) {
        return this.substring(0,(str.length < this.length)?str.length:this.length) === str
    }
}
