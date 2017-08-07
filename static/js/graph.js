queue()
    .defer(d3.json, "/stats/details")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {

    //Clean projectsJson data
    var achievementsProject = projectsJson;  
    var dateFormat = d3.time.format("%Y-%m-%d");
    stripTime = function(s) { return s.slice(0, -18); },
    achievementsProject.forEach(function (d) {
        d.progression.timeUnlocked = dateFormat.parse(stripTime(d.progression.timeUnlocked));
        d.progression.timeUnlocked.setDate(1);
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(achievementsProject);

    //Define Dimensions
    var dateDim = ndx.dimension(function (d) {
        return d.progression.timeUnlocked;
    });
    var isUnlockedDim = ndx.dimension(function (d) {
        return d.progressState;
    });
    var gameNameDim = ndx.dimension(function (d) {
        return d.titleAssociations["0"].name;
    });
    var rarityDim = ndx.dimension(function (d) {
        return d.rarity.currentCategory;
    });
    var isSecretDim = ndx.dimension(function (d) {
        return d.isSecret;
    });
    var totalAchievements = ndx.dimension(function (d) {
        return d.progression.requirements["0"].target;
    });
    //var gamerscoreDim = ndx.dimension(function (d) {
    //    return d.rewards["0"].value;
    //});

    //Calculate metrics
    var dateGroup = dateDim.group();
    var isUnlockedGroup = isUnlockedDim.group();
    var gameNameGroup = gameNameDim.group();
    var isSecretGroup = isSecretDim.group();
    var rarityGroup = rarityDim.group();
    var totalGroup = totalAchievements.group();

    var all = ndx.groupAll();

    //Define values (to be used in charts)
    var minDate = dateFormat.parse("2013-11-22");
    var maxDate = dateDim.top(1)[0]["progression"]["timeUnlocked"];

    //Charts
    var dateChart = dc.lineChart("#date-chart");
    var unlockedChart = dc.pieChart("#unlocked-chart");
    var secretChart = dc.pieChart("#secret-chart");
    var selectGame = dc.selectMenu("#select-game");
    var totalNumber = dc.numberDisplay("#total-number");

    totalNumber
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    selectGame
        .dimension(gameNameDim)
        .group(gameNameGroup);

    dateChart
        .width(800)
        .height(400)
        .margins({top: 10, right: 40, bottom: 40, left: 40})
        .dimension(dateDim)
        .group(dateGroup)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Date Unlocked")
        .yAxisLabel("Quantity")
        .yAxis().ticks(10);

    unlockedChart
        .height(300)
        .radius(120)
        .transitionDuration(1500)
        .dimension(isUnlockedDim)
        .group(isUnlockedGroup);

    secretChart
        .height(300)
        .radius(120)
        .transitionDuration(1500)
        .dimension(isSecretDim)
        .group(isSecretGroup);

    dc.renderAll();
}
