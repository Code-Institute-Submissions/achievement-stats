# Achievement Stats
## Overview
### What is this website for?
This site is used to show Xbox achievement data in an interactive, aesthetically pleasing and simplistic interface.
### What does it do?
It displays Xbox achievement data that is stored in a database in graphs and charts. This dataset can then be narrowed down by the user and all the charts will update live on the page to reflect the changes made. There is a guide to walk the user through the page, explain what each chart represents and how the data can selected.
### How does it work?
The site is built using Flask which handles the page routing and accessing the data from a MongoDB database. The charts are then drawn using D3.js, DC.js and Crossfilter which help to display them and link the data between the charts so they are responsive. Intro.js is used to create the user guide.
## Features
### Existing Features
- Front-End
    - Home Page
    - About Page
    - Data Page
        - D3.js, DC.js, Crossfilter JavaScript libraries for creating charts
        - User Guide
- Back-End
    - MongoDB Database
    - Flask Routing and Database Access
### Features Left to Implement
- None!
    
## Tech Used
### The Tech Used Includes:
- [Bootstrap](http://getbootstrap.com/)
    - I use **Bootstrap** to give my project a simple, tidy and mobile friendly responsive layout
- [Flask](http://flask.pocoo.org)
    - I use **Flash** to manage page routing and to access my database
- [MongoDB](https://www.mongodb.com)
    - I use **MongoDB** to store all of my Achievement data in a noSQL database
- [D3.js](https://d3js.org)
    - **D3.js** is one of the libraries used to help create the charts
- [DC.js](https://dc-js.github.io/dc.js/)
    - **DC.js** is used in conjunction with **D3.js** and **Crossfilter** to create the responsive charts
- [Crossfilter](http://square.github.io/crossfilter/)
    - **Crossfilter** allows the charts to be filtered, linking all the data together and changing them to reflect what has been selected
- [Intro.js](http://introjs.com)
    - I used **Intro.js** to implement the user friendly guide to show new users around the interface
- [D3-Queue](https://github.com/d3/d3-queue)
    - The **queue.js** file is used to future proof the project if I need to call for data from multiple API's
## Content Used
### Sources
- [XboxAPI](https://xboxapi.com)
    - I have used **XboxAPI** to gather the data I want to display before importing it into MongoDB
- [Wikipedia](https://www.wikipedia.org)
    - I have use **Wikipedia** to provide the information and history of achievements on the about page
- [stack overflow](https://stackoverflow.com/questions/11679567/using-css-for-fade-in-effect-on-page-load?answertab=votes#tab-top)
    - I have used **stack overflow** many times for support with styling and subtle solutions to issues. I used the top reply in the link above to help with the css fade in and out on my home page
## Website link coming soon