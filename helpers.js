var register = function (Handlebars) {
    var helpers = {
        // put all of your helpers inside this object
        ifCond: function (v1, v2) {
            console.log(v1, v2);
            if (v1 === v2) {
                return true;
            }
            return false;
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);   