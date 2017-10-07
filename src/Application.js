/**
 * @constructor
 *
 * @param {Moment} moment
 */
let Application = function (moment) {
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
    this.minDelay = 100;

    /**
     * @type {number}
     */
    this.maxDelay = 1000;

    /**
     * @type {undefined|Date}
     */
    this.momentOfZeroValue = undefined;

    /**
     * Execute applications main logic.
     */
    this.execute = () => {
        // Init gauge.
        self.gauge = loadLiquidFillGauge("gauge", 28, self.getConfig());
        self.gauge.update(self.value, self.value);

        // Start ticking.
        setTimeout(() => {
            self.tick();
        }, self.minDelay);

        // Reload on Spacebar.
        document.body.onkeyup = e => {
            if (e.keyCode === 32) {
                self.value = 100;
                self.gauge.update(self.value);
                self.momentOfZeroValue = undefined;
            }
        }
    };

    /**
     * Recursive setTimeout tick.
     */
    this.tick = () => {
        self.value -= Math.floor(Math.random() * 6) + 1;

        if (self.value <= 0) {
            self.value = 0;
            if (typeof self.momentOfZeroValue === 'undefined') {
                self.momentOfZeroValue = moment.now();
            }
        }

        if (typeof self.momentOfZeroValue !== 'undefined') {
            document.getElementsByClassName("title")[0].innerHTML = moment(self.momentOfZeroValue).fromNow();
        } else {
            document.getElementsByClassName("title")[0].innerHTML = "";
        }

        self.gauge.update(self.value);

        setTimeout(() => {
            self.tick()
        }, self.getDelay());
    };

    /**
     * @returns {number}
     */
    this.getDelay = () => {
        if (self.value <= 0) {
            return 1000;
        }

        return (Math.random() * (self.maxDelay - self.minDelay) + self.minDelay)/* + (self.value + 50) * 100*/;
    };

    /**
     * @returns {{minValue, maxValue, circleThickness, circleFillGap,
     * circleColor, waveHeight, waveCount, waveRiseTime, waveAnimateTime,
     * waveRise, waveHeightScaling, waveAnimate, waveColor,
     * waveOffset, textVertPosition, textSize,
     * valueCountUp, displayPercent, textColor, waveTextColor}|*}
     */
    this.getConfig = () => {
        let config = liquidFillGaugeDefaultSettings();

        config.circleThickness = 0.2;
        config.textVertPosition = 0.3;
        config.waveAnimateTime = 1000;
        config.textSize = 0.6;

        return config;
    };
};

export default Application;