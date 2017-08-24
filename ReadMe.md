# HR Data Analysis
**Interactive Data visualisation Web Application**

This Web App was built as the second project for the Code Institute's classroom bootcamp. It is a Data Visualisation project using Pythons *Flask* framework, MongoDB, HTML, CSS, d3, dc and crossfilter.

## Data Source
Data sourced from: https://www.kaggle.com/ludobenistant/hr-analytics

## Kaggle Challenge

Kaggle challenge:(not relevant for the stream 2 project at Code Institute but nice to have some ideas about possible insights)
Why are our best and most experienced employees leaving prematurely? Have fun with this database and try to predict which valuable employees will leave next. 

Fields in the dataset include:
Last evaluation
Number of projects
Average monthly hours
Time spent at the company
Whether they have had a work accident
Whether they have had a promotion in the last 5 years
Department
Salary
Whether the employee has left

## Live Demo

**Follow this link to view deployed version of the web app https://com-dan-dashboard.herokuapp.com/**

## Built with 
1. Flask 
2. Python
2. HTML
3. CSS
4. Bootstrap
5. MongoDB database
6. JavaScript Libraries:
    * d3.js
    * dc.js
    * crossfilter.js
7. A dataset obtained from https://www.kaggle.com/ludobenistant/hr-analytics

## Components

#### Flask
A Python micro-framework that was used to serve the data and render the HTML pages for this Application

#### Python
A Python file name hrdata.py renders a index.html template and builds a web server using pymongo to interact with MongoDB

#### MongoDB database
NoSQL database that converts and presents data in JSON format. The dataset resource was downloaded as a csv file from https://www.kaggle.com/ludobenistant/hr-analytics - The data was cleaned and fields were renamed in order to represent it in index.html

#### Crossfilter.js
A Javascript based data manipulation library that enables two way data binding - you will see this in action when a section of a graph is clicked, all the other graphs filter

#### D3.js
A JavaScript based visualisation engine that renders interactive charts and graphs in svg format when given data, which are then passed in to divs in graphs.html

#### Dc.js
A Javascript based wrapper library for d3.js - this made plotting the charts easier


## Deployment / Hosting

This Application was deployed and is hosted on Heroku - gunicorn Python package runs the http server for the app, the Procfile gives Heroku the information to run the app and requirements.txt is a file that conains all the Python packages (pip installs) required to run the app. mLab MongoDB was chosen to host the dataset on the server.


## Testing
This Application was tested across a range of browsers






