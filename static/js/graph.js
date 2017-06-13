queue()
   .defer(d3.json, "/hrData/projects")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {
 
   //Clean projectsJson data
   var hrDataProjects = projectsJson;
   var total = hrDataProjects.length;


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
   
   var averageProjectsByDepartment = departmentDim.group().reduce(
        function (p, v) {
            ++p.count;
            p.total += v.number_project;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            --p.count;
            if(p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.number_project;
                p.average = p.total / p.count;
            };
            return p;
        },
        function () {
            return {count: 0, total: 0, average: 0};
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
    var averageProjectsByDepartmentChart = dc.bubbleChart("#average-projects-by-department-chart");
    // var compositeChart = dc.compositeChart("#composite-chart")

    totalAccidentsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
        return d;
        })
        .group(numTotalAccidents)

    selectField = dc.selectMenu('#menu-select')
        .dimension(departmentDim)
        .group(numStaffByDepartment)
        .label("Select a Department")

    totalHeadCountND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
        return d;
        })
        .group(all)

    departmentChart
        .width(500)
        .height(300)
        .margins({top: 20,right: 50,bottom: 70, left: 60})
        .dimension(departmentDim)
        .group(numStaffByDepartment)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Department")
        .colors('orange')

    staffLeftChart
        .height(110)
        .radius(50)
        .transitionDuration(1500)
        .dimension(staffLeftDim)
        .group(numStaffByleft)
        .label(function(d) {
        return Math.round(((d.value / total) * 100)) + '%';
    })

    promotionsLast5YearsChart
        .height(110)
        .radius(50)
        .transitionDuration(1500)
        .dimension(promotionLast5YearsDim)
        .group(numStaffByPromotionLast5Years)
        .label(function(d) {
        return Math.round((d.value / total) * 100) + '%';
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
        .height(220)
        .radius(90)
        .transitionDuration(1500)
        .dimension(numberProjectDim)
        .group(numStaffByNumberProject)

    averageMonthlyHoursChart
        .width(600)
        .height(250)
        .margins({top: 20,right: 50,bottom: 30, left: 60})
        .dimension(averageMonthlyHoursDim)
        .group(numStaffByAverageMonthlyHours)
        .x(d3.scale.linear().domain([0,320]))
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Time")
        .elasticY(true)
        .elasticX(true)

    workAccidentChart
        .height(220)
        .radius(90)
        .transitionDuration(1500)
        .dimension(workAccidentDim)
        .group(numStaffByWorkAccident)
        .label(function(d) {
        return Math.round(((d.value / total) * 100)) + '%';
    })

    satisfactionChart
        .width(600)
        .height(250)
        .margins({top: 20,right: 50,bottom: 30, left: 60})
        .x(d3.scale.linear().domain([35,100]))
        .xAxisLabel("Satisfaction %")
        .yAxisLabel("Staff Headcount")
        .transitionDuration(500)
        .dimension(lastEvaluationDim)
        .group(numStaffByLastEvaluation, 'Last Evaluation')
        .interpolate('basis')

    lastEvaluationChart
        .width(600)
        .height(250)
        .margins({top: 20,right: 50,bottom: 30, left: 60})
        .x(d3.scale.linear().domain([0,100]))
        .transitionDuration(500)
        .xAxisLabel("Evaluation %")
        .yAxisLabel("Staff Headcount")
        .dimension(satisfactionDim)
        .group(numStaffBySatisfaction, 'Satisfaction')
        .interpolate('basis')

    timeSpendCompanyChart
        .width(400)
        .height(250)
        .margins({top: 20,right: 50,bottom: 30, left: 60})
        .dimension(timeSpendCompanyDim)
        .group(numStaffByTimeSpendCompany)
        .x(d3.scale.linear().domain([0,10]))
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Time")
        .elasticY(true)
        .elasticX(true)
        .brushOn(false)

    salaryChart
        .width(300)
        .height(250)
        .margins({top: 20,right: 50,bottom: 30, left: 60})
        .dimension(salaryDim)
        .group(numStaffBySalary) 
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .transitionDuration(500)
        .yAxisLabel("Staff Headcount")
        .xAxisLabel("Salary level")
        .colors('orange')

    averageProjectsByDepartmentChart
        .width(990)
        .height(400)
        .dimension(departmentDim)
        .group(averageProjectsByDepartment)
        .colors(d3.scale.category20())
        .keyAccessor(function (p) {
            return p.value.department;
        })
        .valueAccessor(function (p) {
            return p.value.number_project;
        })
        .radiusValueAccessor(function (p) {
            return p.value.average_monthly_hours;
        })
        .x(d3.scale.linear().domain([0, 1000]))
        .r(d3.scale.linear().domain([0, 1000]))
        .minRadiusWithLabel(15)
        .renderLabel(true)
        .renderTitle(true)


   dc.renderAll();
}