define(function (require) {

    var PageHelper = require("shared/pageHelper").PageHelper;

    function Button(id, value) {
        this.id = id;
        this.value = value;
        this.control = this.render();
    }

    Button.prototype.render = function () {
        var self = this;

        new PageHelper().addCssFile('control/button.css');

        var button = document.createElement("input");
        if (self.id) {
            button.id = self.id;
        }
        button.type = "button";

        if (self.value) {
            button.value = self.value;
        }

        return button;
    }

    return {
        Button: Button
    };
})
