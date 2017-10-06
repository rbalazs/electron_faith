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
     * @type {undefined|GaugeUpdater}
     */
    this.gauge = undefined;

    /**
     * @type {number}
     */
    this.minDelay = 2100;

    /**
     * @type {number}
     */
    this.maxDelay = 14000;

    /**
     * Execute applications main logic.
     */
    this.execute = function () {
        // Init gauge.
        self.gauge = loadLiquidFillGauge("gauge", 28, self.getConfig());
        self.gauge.update(self.value);

        // Start ticking.
        setTimeout(function () {
            self.tick();
        }, self.minDelay);

        // Reload on Spacebar.
        document.body.onkeyup = function (e) {
            if (e.keyCode === 32) {
                self.value = 100;
                self.gauge.update(self.value);
            }
        }
    };

    /**
     * Recursive setTimeout tick.
     */
    this.tick = function () {
        self.value -= Math.floor(Math.random() * 6) + 1;
        self.value = self.value < 0 ? 0 : self.value;

        self.gauge.update(self.value);

        setTimeout(function () {
            self.tick()
        }, self.getDelay());
    };

    /**
     * @returns {number}
     */
    this.getDelay = function () {
        return (Math.random() * (self.maxDelay - self.minDelay) + self.minDelay) + (self.value + 50) * 100;
    };

    /**
     * @returns {{minValue, maxValue, circleThickness, circleFillGap,
     * circleColor, waveHeight, waveCount, waveRiseTime, waveAnimateTime,
     * waveRise, waveHeightScaling, waveAnimate, waveColor,
     * waveOffset, textVertPosition, textSize,
     * valueCountUp, displayPercent, textColor, waveTextColor}|*}
     */
    this.getConfig = function () {
        let config = liquidFillGaugeDefaultSettings();

        config.circleThickness = 0.2;
        config.textVertPosition = 0.3;
        config.waveAnimateTime = 1000;
        config.textSize = 0.6;

        return config;
    };
};

module.exports = Application;