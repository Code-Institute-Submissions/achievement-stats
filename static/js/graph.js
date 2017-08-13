queue()
    .defer(d3.json, "/stats/details")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {

    //Keeps content responsive upon window width resizing
    var windowWidth = $(window).width();
    
    $(window).resize(function(){
        if(windowWidth != $(window).width()){
            location.reload();
        }
    });

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
    var isSecretDim = ndx.dimension(function (d) {
        return d.isSecret;
    });
    var totalAchievements = ndx.dimension(function (d) {
        return d.progression.requirements["0"].target;
    });

    //Calculate metrics
    var dateGroup = dateDim.group();
    var isUnlockedGroup = isUnlockedDim.group();
    var gameNameGroup = gameNameDim.group();
    var isSecretGroup = isSecretDim.group();
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

    //Date Chart Responsiveness
    var dateContainer = $("#date-container").width();
    var dateWidth = dateContainer;

    totalNumber
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    selectGame
        .dimension(gameNameDim)
        .group(gameNameGroup);

    if (dateContainer >= 768) {
        dateChart
            .width(dateWidth)
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
    } else {
        dateChart
            .width(dateWidth)
            .height(400)
            .margins({top: 10, right: 40, bottom: 70, left: 40})
            .dimension(dateDim)
            .group(dateGroup)
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .elasticY(true)
            .xAxisLabel("Date Unlocked")
            .yAxisLabel("Quantity")
            .on("renderlet", function (chart) {
                chart.selectAll("g.x text")
                    .attr('x', '-30')
                    .attr('y', '-5')
                    .attr('transform', "rotate(-90)");
            })
            .yAxis().ticks(10);
    }

    unlockedChart
        .height(300)
        .radius(120)
        .transitionDuration(1500)
        .dimension(isUnlockedDim)
        .group(isUnlockedGroup)
        .innerRadius(50)
        .legend(dc.legend().x(118).y(125).gap(5))
        .renderLabel(false)
        .colors(d3.scale.ordinal().range(['#FFFF00','#a8ddb5','#43a2ca']));

    secretChart
        .height(300)
        .radius(120)
        .transitionDuration(1500)
        .dimension(isSecretDim)
        .group(isSecretGroup)
        .innerRadius(40)
        .legend(dc.legend().x(130).y(135).gap(5))
        .renderLabel(false)
        .colors(d3.scale.ordinal().range(['#FFFF00','#43a2ca']));

    dc.renderAll();
}
