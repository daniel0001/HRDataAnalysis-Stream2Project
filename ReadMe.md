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

## Design

This dashboard was designed using d3, dc and crossfilter to show the changing relationship of data as it is manipulated by the user.

Bootstrap 3 was used to layout the various tables by row and col. This makes the dashboard responsive to various media screen sizes.

There is a 'tour button' at the top of the page and this starts a guide to explain to the user what each graph's function is.

There is a 'select' at the top of the page to allow quick manipulation of data by field.

## CSS template

CSS dashboard template utilised from keen dashboards: https://github.com/keen/dashboards

## Fonts

Google fonts include Roboto and Lato

## Color scheme

Navbar background: #3d4a57
chart headings: rgb(102, 102, 102)
chart text: white
chart stage: lightgray
pie-chart: rgb(49,130,189), rgb(107,174,214)
bar-chart bars: rgb(255,165,0)
lin-chart lines: rgb(49,130,189)
nummber display background: rgb(51,204,153)

## Live Demo

**Follow this link to view deployed version of the web app https://com-dan-dashboard.herokuapp.com/**

## Built with 
1. Flask 
2. Python 3
2. HTML 5
3. CSS 3
4. Bootstrap 3
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






