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
       return d["satisfaction_level"];
   });
   var lastEvaluationDim = ndx.dimension(function (d) {
       return d["last_evaluation"];
   });
   var numberProjectDim = ndx.dimension(function (d) {
       return d["number_project"];
   });
   var averageMonthlyHoursDim = ndx.dimension(function (d) {
       return d["average_monthly_hours"];
   });
   var timeSpendCompanyDim = ndx.dimension(function (d) {
       return d["time_spend_company"];
   });
   var workAccidentDim = ndx.dimension(function (d) {
       return d["work_accident"];
   });
   var leftDim = ndx.dimension(function (d) {
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
   var numStaffByAverageMonthlyHours = averageMonthlyHoursDim.group();
   var numStaffByTimeSpendCompany = timeSpendCompanyDim.group();
   var numStaffByWorkAccident = workAccidentDim.group();
   var numStaffByleft = leftDim.group();
   var numStaffByPromotionLast5Years = promotionLast5YearsDim.group();
   var numStaffByDepartment = departmentDim.group();
   var numStaffBySalary = salaryDim.group();
   
 
   var all = ndx.groupAll();
    
   //Charts
   var projectChart = dc.barChart("#project-chart");
   var satisfactionChart = dc.rowChart("#satisfaction-row-chart");
   var lastEvaluationChart = dc.rowChart("#last-evaluation-row-chart");
   var averageMonthlyHoursND = dc.numberDisplay("#average-monthly-hours-nd");
   var timeSpendCompanyND = dc.numberDisplay("#time-spend-company-nd");
   var workAccidentChart = dc.pieChart("#workAccident-chart");
   var departmentChart = dc.pieChart("#department-chart");
   var salaryChart = dc.barChart("#salary-chart");

 
 
   selectField = dc.selectMenu('#menu-select')
       .dimension(stateDim)
       .group(stateGroup);
 
 
   averageMonthlyHoursND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);
 
   timeSpendCompanyND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(totalDonations)
       .formatNumber(d3.format(".3s"));
 
    lastEvaluationChart
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(lastEvaluationDim)
       .group(all)
       .transitionDuration(500)
       .elasticY(true)
       .xAxisLabel("Last Evaluation Score")
       .yAxis().ticks(4);
 
   satisfactionChart
       .width(300)
       .height(250)
       .dimension(satisfactionDim)
       .group(all)
       .xAxis().ticks(4);
 
   workAccidentChart
       .width(300)
       .height(250)
       .dimension(workAccidentDim)
       .group(all)
       .xAxis().ticks(4);
 
   departmentChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(departmentDim)
       .group(all);
 
 
   dc.renderAll();
}