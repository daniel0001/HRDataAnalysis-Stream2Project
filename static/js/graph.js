queue()
   .defer(d3.json, "/hrData/projects")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {
 
   //Clean projectsJson data
   var hrDataProjects = projectsJson;

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
//    var departmentDim = ndx.dimension(function (d) {
//        return d["department"];
//    });
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
//    var numStaffByDepartment = departmentDim.group();
   var numStaffBySalary = salaryDim.group();
   
 
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
//    var departmentChart = dc.pieChart("#department-chart");
   var salaryChart = dc.barChart("#salary-chart");
  

   satisfactionChart
       .width(600)
       .height(250)
       .dimension(satisfactionDim)
       .interpolate("basis")
       .group(numStaffBySatisfaction)
       .x(d3.scale.linear().domain([5,100]))
       .transitionDuration(500)
       .yAxisLabel("Staff Headcount")
       .xAxisLabel("Satisfaction level (0 - 100%)")

    lastEvaluationChart
       .width(600)
       .height(250)
       .interpolate("basis")
       .dimension(lastEvaluationDim)
       .group(numStaffByLastEvaluation)
       .x(d3.scale.linear().domain([35,100]))
       .transitionDuration(500)
       .yAxisLabel("Staff Headcount")
       .xAxisLabel("Last Evaluation Score (0 - 100%)")
 
   projectChart
       .height(220)
       .radius(90)
       .transitionDuration(1500)
       .dimension(numberProjectDim)
       .group(numStaffByNumberProject)

//    selectField = dc.selectMenu('#menu-select')
//        .dimension(stateDim)
//        .group(stateGroup);
 
  salaryChart
        .width(400)
       .height(250)
       .dimension(salaryDim)
       .group(numStaffBySalary) 
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .transitionDuration(500)
       .yAxisLabel("Staff Headcount")
       .xAxisLabel("Salary level")

   averageMonthlyHoursChart
        .width(400)
       .height(250)
       .dimension(averageMonthlyHoursDim)
       .group(numStaffByAverageMonthlyHours)
       .x(d3.scale.linear().domain([80,320]))
       .transitionDuration(500)
       .yAxisLabel("Staff Headcount")
       .xAxisLabel("Time")
 
   timeSpendCompanyChart
        .width(600)
       .height(250)
       .dimension(timeSpendCompanyDim)
       .group(numStaffByTimeSpendCompany)
       .x(d3.scale.linear().domain([0,10]))
       .transitionDuration(500)
       .yAxisLabel("Staff Headcount")
       .xAxisLabel("Time")
 
   
 
 
   workAccidentChart
       .height(220)
       .radius(90)
       .transitionDuration(1500)
       .dimension(workAccidentDim)
       .group(numStaffByWorkAccident)
       
       
    
    staffLeftChart
       .height(220)
       .radius(90)
       .transitionDuration(1500)
       .dimension(staffLeftDim)
       .group(numStaffByleft)

    promotionsLast5YearsChart
       .height(220)
       .radius(90)
       .transitionDuration(1500)
       .dimension(promotionLast5YearsDim)
       .group(numStaffByPromotionLast5Years)

 
//    departmentChart
//        .height(220)
//        .radius(90)
//        .innerRadius(40)
//        .transitionDuration(1500)
//        .dimension(departmentDim)
//        .group(all);



   dc.renderAll();
}