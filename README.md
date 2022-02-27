# Honk Honk By Reb Bit Hunters

Web application finding the best route for Truckers based on their Trip requests. 
This project was built in the scope of Code.Jam(XI); hackathon run by the McGill Electrical, Computer, and Software Engineering Student’ Society

## Demo

There is a demo that can be found [here](https://honkhonk-f1ac7.web.app/).
However, while the front end and the algorithm are all functional, we were unable to load the C++ code into our React App with Web Assembly due to the time constraint and lack of clear documentation. Consequently, the output result on the map are random generated trips from the dataset and not optimal.

## Introduction

This project's intent is to help truckers find the optimal loads based on current loads that need to be delivered. By default, it will set the user's starting point to his current GeoLocation, but he is able to change it. Once inputted, he will also have to decide the starting time and max destination time. Once done, the algorithm should run and output the optimal route. In our case, our algorithm is found in the src/algorithm folder and written in C++. However, once again, we were unfortunately not able to load it into our React app, and so the results shown to the user are not the optimal ones. 

## Getting Setup
This project assumes that you already have `Node ^14.17.6` & `npm ^6.14.15`. If you do not, please download them from [the official website](https://nodejs.org/en/download/)
Here are a couple of steps that you can follow to quickly get started with the project.

1. Clone the repository: `git clone https://github.com/mike1572/honkhonk.git`
2. Install the project dependencies by running `npm install` inside the cloned directory
3. Run `npm start` to start your own local development environment! Alternatively, here are some more commands available:

| Commands        | Output
|-----------------|-------------------------------------------------------------------|
| `npm run build` | Creates a production-ready build of the project, ready for deployment |
| `npm update`    | Updates dependencies that require newer versions to keep functioning correctly|
| `serve -s`      | You *must* install serve (`npm install -g serve`) before running this command. This command makes the project accessible both locally and on your network, in the event that you want to test it on different devices or share it with your entourage.|

There are many more commands, which you can familiarise yourself with on the [Create a React App](https://create-react-app.dev/) website, or in [npm's](https://docs.npmjs.com/) documentation.


## Packages

We used Material UI for the interface: the CSS more specifically, and React Leaflet for the map and markups.


