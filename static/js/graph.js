queue()
   .defer(d3.json, "/hrData/projects")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {
 
   //Clean projectsJson data
   var hrDataProjects = projectsJson;
   var total = 0;
   var data = []

   var pieChartWidth = $("#staff-left-chart").width();
   var pieRadius = 30;
   if(pieChartWidth >= 600){
       pieRadius = 30;
   } else {
       pieRadius = pieChartWidth * 0.3;
   }



   //Create a Crossfilter instance
   var ndx = crossfilter (hrDataProjects);
   
   //Define Dimensions
   var satisfactionDim = ndx.dimension(function (d) {
       return d["satisfaction_level"] *100;
   });
   var lastEvaluationDim = ndx.dimension(function (d) {
       return d["last_evaluation"] *100;
   });
   var numberProjectDim = ndx.dimension(function (d) {
       return d["number_project"];
   });

   var timeSpendCompanyDim = ndx.dimension(function (d) {
       return d["time_spend_company"];
   });
    var averageMonthlyHoursDim = ndx.dimension(function (d) {
       return d["average_monthly_hours"];
   });
   var workAccidentDim = ndx.dimension(function (d) {
       return d["Work_accident"];
   });
   var staffLeftDim = ndx.dimension(function (d) {
       return d["left"];
   });
   var promotionLast5YearsDim = ndx.dimension(function (d) {
       return d["promotion_last_5years"];
   });
   var departmentDim = ndx.dimension(function (d) {
        return d["department"];
   });
   var salaryDim = ndx.dimension(function (d) {
       return d["salary"];
   });

   
 
 
 
   //Calculate metrics
   var numStaffBySatisfaction = satisfactionDim.group();

   var numStaffByLastEvaluation = lastEvaluationDim.group();
   var numStaffByNumberProject = numberProjectDim.group();
   var numStaffByTimeSpendCompany = timeSpendCompanyDim.group();
   var numStaffByAverageMonthlyHours = averageMonthlyHoursDim.group();

   var numStaffByWorkAccident = workAccidentDim.group();
   var numStaffByleft = staffLeftDim.group();
   var numStaffByPromotionLast5Years = promotionLast5YearsDim.group();
   var numStaffByDepartment = departmentDim.group();
   var numStaffBySalary = salaryDim.group();
   var numTotalAccidents = workAccidentDim.groupAll().reduceSum(
        function(d){
            return d["Work_accident"];
        }
    );
   
   var statsByDepartment = departmentDim.group().reduce(
        function (p, v) {
            p.department = v.department;
            p.headcount ++ ;
            p.resigned += v.left / p.headcount;
            return p;
        },
        function (p, v) {
            p.department = v.department;            
            p.headcount -- ;
            p.resigned -= v.left / p.headcount;
            return p;
        },
        function () {
            return {department: "", headcount: 0, resigned: 0};
        }
    );
   
 
   var all = ndx.groupAll();
    
   //Charts
    var satisfactionChart = dc.lineChart("#satisfaction-line-chart");
    var lastEvaluationChart = dc.lineChart("#last-evaluation-line-chart");
    var projectChart = dc.pieChart("#project-chart");
    var timeSpendCompanyChart = dc.barChart("#time-spend-company-chart");
    var averageMonthlyHoursChart = dc.barChart("#average-monthly-hours-chart");
    var workAccidentChart = dc.pieChart("#work-accident-chart");
    var staffLeftChart = dc.pieChart("#staff-left-chart");
    var promotionsLast5YearsChart = dc.pieChart("#promotions-chart");
    var salaryChart = dc.barChart("#salary-chart");
    var departmentChart = dc.barChart("#department-chart");
    var totalHeadCountND = dc.numberDisplay("#totalHeadCount-nd");
    var totalAccidentsND = dc.numberDisplay("#totalAccidents-nd");
    var resignationsByDepartmentHeadcountChart = dc.bubbleChart("#resignations-by-department-headcount-chart");
    // var compositeChart = dc.compositeChart("#composite-chart")

    selectField = dc.selectMenu('#menu-select')
        .dimension(departmentDim)
        .group(numStaffByDepartment)
        .label("Select a Department")

    totalAccidentsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
        return d;
        })
        .group(numTotalAccidents)

    totalHeadCountND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
        return d;
        })
        .group(all)

    departmentChart
        .width(document.getElementById('department-chart').clientWidth * 1.1)
        .height(300)
        .margins({top: 20,right: 50,bottom: 70, left: 50})
        .dimension(departmentDim)
        .group(numStaffByDepartment)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Department")
        .colors('orange')
        .elasticY(true)

    staffLeftChart
        .height(120)
        .width(document.getElementById('staff-left-chart').clientWidth)
        .radius(document.getElementById('staff-left-chart').clientHeight * 0.3)
        .transitionDuration(1500)
        .dimension(staffLeftDim)
        .group(numStaffByleft) 
        .label(function(d) {
            
            if (data.indexOf(d.value) == -1){
                data.splice(d.value);
                total += d.value;
            }
            console.log(total);
            console.log(data);
            if (d.key == 0){
                return Math.round(((d.value / total) * 100)) + '% Resigned';
            }

        return Math.round(((d.value / total) * 100)) + '% Employed';
    })

    promotionsLast5YearsChart
        .height(120)
        .width(document.getElementById('promotions-chart').clientWidth)
        .radius(document.getElementById('promotions-chart').clientHeight * 0.3)
        .transitionDuration(1500)
        .dimension(promotionLast5YearsDim)
        .group(numStaffByPromotionLast5Years)
        .label(function(d) {
            if (d.key == 0){
                return Math.round((d.value / total) * 100) + '% Not promoted';
            }
        return Math.round((d.value / total) * 100) + '% Promoted';
        })


    // compositeChart
    //    .width(600)
    //    .height(250)
    //    .x(d3.scale.linear().domain([0,100]))
    //    .transitionDuration(500)
    //     .legend(dc.legend().x(100).y(20).itemHeight(13).gap(5))
    //    .compose([
    //        dc.lineChart(compositeChart)
    //        .dimension(satisfactionDim)
    //        .colors('orange')
    //        .group(numStaffBySatisfaction, 'Satisfaction')
    //        .interpolate('basis'),
    //        dc.lineChart(compositeChart)
    //        .dimension(lastEvaluationDim)
    //        .colors('blue')
    //        .group(numStaffByLastEvaluation, 'Last Evaluation')
    //        .interpolate('basis')
    //    ])


    projectChart
        .height(160)
        .width(document.getElementById('project-chart').clientWidth)
        .radius(document.getElementById('project-chart').clientHeight * 0.3)
        .transitionDuration(1500)
        .dimension(numberProjectDim)
        .group(numStaffByNumberProject)
        .label(function(d) {
            return d.key + ' Projects';
        })
        .legend(dc.legend().x(0).y(0).gap(5))

    averageMonthlyHoursChart
        .width(document.getElementById('average-monthly-hours-chart').clientWidth * 1.1)
        .height(160)
        .margins({top: 20,right: 50,bottom: 40, left: 30})
        .dimension(averageMonthlyHoursDim)
        .group(numStaffByAverageMonthlyHours)
        .x(d3.scale.linear())
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Number of Hours Worked in the Month")
        .elasticY(true)
        .elasticX(true)

    workAccidentChart
        .height(160)
        .width(document.getElementById('work-accident-chart').clientWidth)
        .radius(document.getElementById('work-accident-chart').clientHeight * 0.3)
        .transitionDuration(1500)
        .dimension(workAccidentDim)
        .group(numStaffByWorkAccident)
        .label(function(d) {
            if (d.key == 0){
                return Math.round(((d.value / total) * 100)) + '% No Accidents';
            }
        return Math.round((d.value / total) * 100) + '% Accidents';
        })

    satisfactionChart
        .width(document.getElementById('satisfaction-line-chart').clientWidth)
        .height(250)
        .margins({top: 20,right: 50,bottom: 40, left: 60})
        .x(d3.scale.linear().domain([35,100]))
        .xAxisLabel("Satisfaction Score out of 100%")
        .yAxisLabel("Staff Headcount")
        .transitionDuration(500)
        .dimension(lastEvaluationDim)
        .group(numStaffByLastEvaluation, 'Last Evaluation')
        .interpolate('basis')
        .elasticY(true)

    lastEvaluationChart
        .width(document.getElementById('last-evaluation-line-chart').clientWidth)
        .height(250)
        .margins({top: 20,right: 50,bottom: 40, left: 50})
        .x(d3.scale.linear().domain([0,100]))
        .transitionDuration(500)
        .xAxisLabel("Evaluation Score out of 100%")
        .yAxisLabel("Staff Headcount")
        .dimension(satisfactionDim)
        .group(numStaffBySatisfaction, 'Satisfaction')
        .interpolate('basis')
        .elasticY(true)

    timeSpendCompanyChart
        .width(document.getElementById('time-spend-company-chart').clientWidth)
        .height(300)
        .margins({top: 20,right: 50,bottom: 40, left: 50})
        .dimension(timeSpendCompanyDim)
        .group(numStaffByTimeSpendCompany)
        .x(d3.scale.linear().domain([0,10]))
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Number of Years")
        .elasticY(true)
        .brushOn(false)

    salaryChart
        .width(document.getElementById('salary-chart').clientWidth)
        .height(290)
        .margins({top: 20,right: 50,bottom: 40, left: 50})
        .dimension(salaryDim)
        .group(numStaffBySalary) 
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Salary level")
        .colors('orange')
        .elasticY(true)

    resignationsByDepartmentHeadcountChart
        .width(document.getElementById('resignations-by-department-headcount-chart').clientWidth)
        .height(650)
        .dimension(departmentDim)
        .group(statsByDepartment)
        .colors(d3.scale.category20())
        .keyAccessor(function (p) {
            return p.value.department;
        })
        .valueAccessor(function (p) {
            return p.value.headcount;
        })
        .radiusValueAccessor(function (p) {
            return p.value.resigned;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .r(d3.scale.linear().domain([0, 100]))
        .minRadiusWithLabel(10)
        .maxBubbleRelativeSize(0.07)
        .elasticRadius(true)
        .margins({top: 20,right: 50,bottom: 70, left: 50})
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Department")
        .y(d3.scale.linear().domain([0, 5000]));


   dc.renderAll();
   
}