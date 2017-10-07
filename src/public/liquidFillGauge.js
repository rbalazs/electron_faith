import d3 from 'd3';

function liquidFillGaugeDefaultSettings() {
    return {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.05,
        circleFillGap: 0.05,
        circleColor: "#178BCA",
        waveHeight: 0.05,
        waveCount: 1,
        waveRiseTime: 1000,
        waveAnimateTime: 18000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: true,
        waveColor: "#178BCA",
        waveOffset: 0,
        textVertPosition: .5,
        textSize: 1,
        valueCountUp: true,
        displayPercent: true,
        textColor: "#045681",
        waveTextColor: "#A4DBf8"
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if (config == null) config = liquidFillGaugeDefaultSettings();

    const gauge = d3.select(`#${elementId}`);
    const radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
    const locationX = parseInt(gauge.style("width")) / 2 - radius;
    const locationY = parseInt(gauge.style("height")) / 2 - radius;
    const fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

    let waveHeightScale;
    if (config.waveHeightScaling) {
        waveHeightScale = d3.scale.linear()
            .range([0, config.waveHeight, 0])
            .domain([0, 50, 100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight, config.waveHeight])
            .domain([0, 100]);
    }

    const textPixels = (config.textSize * radius / 2);
    const textFinalValue = parseFloat(value).toFixed(2);
    const textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
    const percentText = config.displayPercent ? "%" : "";
    const circleThickness = config.circleThickness * radius;
    const circleFillGap = config.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = fillCircleRadius * 2 / config.waveCount;
    const waveClipCount = 1 + config.waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    let textRounder = value => Math.round(value);
    if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
        textRounder = value => parseFloat(value).toFixed(1);
    }
    if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
        textRounder = value => parseFloat(value).toFixed(2);
    }

    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
        data.push({x: i / (40 * waveClipCount), y: (i / (40))});
    }

    const gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
    const gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

    const waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

    const waveRiseScale = d3.scale.linear()
        .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
        .domain([0, 1]);
    const waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
        .domain([0, 1]);

    const textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
        .domain([0, 1]);

    const gaugeGroup = gauge.append("g")
        .attr('transform', `translate(${locationX},${locationY})`);

    const gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform', `translate(${radius},${radius})`);

    const text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", `${textPixels}px`)
        .style("fill", config.textColor)
        .attr('transform', `translate(${radius},${textRiseScaleY(config.textVertPosition)})`);

    const clipArea = d3.svg.area()
        .x(d => waveScaleX(d.x))
        .y0(d => waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)))
        .y1(d => fillCircleRadius * 2 + waveHeight);
    const waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", `clipWave${elementId}`);
    const wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    const fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", `url(#clipWave${elementId})`);
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    const text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", `${textPixels}px`)
        .style("fill", config.waveTextColor)
        .attr('transform', `translate(${radius},${textRiseScaleY(config.textVertPosition)})`);

    if (config.valueCountUp) {
        const textTween = function () {
            const i = d3.interpolate(this.textContent, textFinalValue);
            return function (t) {
                this.textContent = textRounder(i(t)) + percentText;
            }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    const waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
        waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(0)})`)
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`)
            .each("start", () => {
                wave.attr('transform', 'translate(1,0)');
            }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`);
    }

    if (config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform', `translate(${waveAnimateScale(wave.attr('T'))},0)`);
        wave.transition()
            .duration(config.waveAnimateTime * (1 - wave.attr('T')))
            .ease('linear')
            .attr('transform', `translate(${waveAnimateScale(1)},0)`)
            .attr('T', 1)
            .each('end', () => {
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater() {
        this.update = value => {
            const gaugeGroup = gauge[0][0].firstChild;

            if (value >= 41) {
                gaugeGroup.firstChild.style.fill = "#178BCA"
            } else if (value < 41) {
                gaugeGroup.firstChild.style.fill = "#FF7777";
            }

            const newFinalValue = parseFloat(value).toFixed(2);
            let textRounderUpdater = value => Math.round(value);
            if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
                textRounderUpdater = value => parseFloat(value).toFixed(1);
            }
            if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
                textRounderUpdater = value => parseFloat(value).toFixed(2);
            }

            const textTween = function () {
                const i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function (t) {
                    this.textContent = textRounderUpdater(i(t)) + percentText;
                }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            const fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
            const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
            const waveRiseScale = d3.scale.linear()
                .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
                .domain([0, 1]);
            const newHeight = waveRiseScale(fillPercent);
            const waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
            const waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);
            let newClipArea;
            if (config.waveHeightScaling) {
                newClipArea = d3.svg.area()
                    .x(d => waveScaleX(d.x))
                    .y0(d => waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)))
                    .y1(d => fillCircleRadius * 2 + waveHeight);
            } else {
                newClipArea = clipArea;
            }

            const newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate ? (config.waveAnimateTime * (1 - wave.attr('T'))) : (config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform', `translate(${newWavePosition},0)`)
                .attr('T', '1')
                .each("end", () => {
                    if (config.waveAnimate) {
                        wave.attr('transform', `translate(${waveAnimateScale(0)},0)`);
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform', `translate(${waveGroupXPosition},${newHeight})`)
        }
    }

    return new GaugeUpdater();
}