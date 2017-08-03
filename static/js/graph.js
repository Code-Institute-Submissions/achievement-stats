queue()
    .defer(d3.json, "/stats/details")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {

    //Clean projectsJson data
    var achievementsProject = projectsJson;  
    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");
    stripNanoseconds = function(s) { return s.slice(0, -5) + "Z"; },
    achievementsProject.forEach(function (d) {
        d["progression"]["timeUnlocked"] = dateFormat.parse(stripNanoseconds(d["progression"]["timeUnlocked"]));
        d["progression"]["timeUnlocked"].setDate(1);
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(achievementsProject);

    //Define Dimensions
    var dateDim = ndx.dimension(function (d) {
        return d["progression"]["timeUnlocked"];
    });
    var isUnlockedDim = ndx.dimension(function (d) {
        return d["progressState"];
    });
    var gameNameDim = ndx.dimension(function (d) {
        return d["titleAssociations"]["name"];
    });
    var rarityDim = ndx.dimension(function (d) {
        return d["rarity"]["currentPercentage"];
    });
    var isSecretDim = ndx.dimension(function (d) {
        return d["isSecret"];
    });
    var gamerscoreDim = ndx.dimension(function (d) {
        return d["rewards"]["value"];
    });

    //Calculate metrics
    var achievementsByDate = dateDim.group();

    //Define values (to be used in charts)
    var minDate = dateFormat.parse("2013-11-22T00:00:00.000Z");
    var maxDate = dateDim.top(1)[0]["progression"]["timeUnlocked"];

    //Charts
    var testChart = dc.barChart("#test-bar-chart");

    testChart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dateDim)
        .group(achievementsByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxis().ticks(4);

    dc.renderAll();
}
