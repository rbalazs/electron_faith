"use strict";

/**
 * @constructor
 */
let Application = function () {
    /**
     * @type {Application}
     */
    let self = this;

    /**
     * @type {number}
     */
    this.value = 100;

    /**
     * Provides the response.
     */
    this.execute = function () {
        let gauge = loadLiquidFillGauge("gauge", 28, self.getConfig());

        gauge.update(self.value);

        let callback = function () {
            self.value -= Math.floor(Math.random() * 6) + 1;
            self.value = self.value < 0 ? 0 : self.value;

            gauge.update(self.value);

            setTimeout(function () {
                callback()
            }, (Math.random() * (14000 - 2500) + 2500) + (self.value + 50) * 100);
        };

        setTimeout(function () {
            callback();
        }, 2100);

        document.body.onkeyup = function (e) {
            if (e.keyCode === 32) {
                self.value = 100;
                gauge.update(self.value);
            }
        }
    };

    this.getConfig = function () {
        let config1 = liquidFillGaugeDefaultSettings();

        config1.circleThickness = 0.2;
        config1.textVertPosition = 0.3;
        config1.waveAnimateTime = 1000;
        config1.textSize = 0.6;

        return config1;
    };
};

module.exports = Application;