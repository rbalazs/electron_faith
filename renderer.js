(function () {

    document.onreadystatechange = function () {

        if (document.readyState == "complete") {
            let value = 100;
            let config1 = liquidFillGaugeDefaultSettings();
            config1.circleThickness = 0.2;
            config1.textVertPosition = 0.3;
            config1.waveAnimateTime = 1000;
            config1.textSize = 0.6;

            let gauge = loadLiquidFillGauge("gauge", 28, config1);

            gauge.update(value);

            let callback = function () {
                value -= Math.floor(Math.random() * 6) + 1;
                value = value < 0 ? 0 : value;

                gauge.update(value);

                setTimeout(function () {
                    callback()
                }, (Math.random() * (14000 - 2500) + 2500) + (value + 50) * 100);
            };

            setTimeout(function () {
                callback();
            }, 2100);


            document.body.onkeyup = function (e) {
                if (e.keyCode == 32) {
                    value = 100;
                    gauge.update(value);
                }
            }
        }
    };
})();