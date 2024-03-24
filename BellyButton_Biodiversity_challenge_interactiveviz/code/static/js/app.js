// fetch data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// initialize variables
let dataSamples;
let dataMetaData;
let dataNames;

// extract data & create dropdown function
dataPromise.then(function(data){
    dataSamples = data.samples;
    dataMetaData = data.metadata;
    dataNames = data.names;  
    // populate dropdown menu
    let dropdownSelector = d3.select("#selDataset");
    // create <option> for each id
    dataNames.forEach((id) => {
        dropdownSelector.append("option").text(id).property("value", id);
    });
    // call update charts function
    updateCharts(dataNames[0]);
});

// dropdown change event handler
function optionChanged(value){
    updateCharts(value);
}

// chart update function
function updateCharts(sampleID){
    const selectedIndex = dataNames.indexOf(sampleID);
    const selectedSample = dataSamples[selectedIndex];
    const selectedMetaData = dataMetaData[selectedIndex];
    displayMetaData(selectedMetaData);
    horizontalBarChart(selectedSample);
    bubbleChart(selectedSample);
}

// create bar chart
function horizontalBarChart(selectedSample) {
    let x_axis = selectedSample.sample_values.slice(0, 10).reverse();
    let y_axis = selectedSample.otu_ids.slice(0, 10).reverse().map((item) => `OTU ${item}`);
    let text = selectedSample.otu_labels.slice(0,10).reverse();
    let trace = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
    };
    let data = [trace];
    let layout = {
        margin: {
            1: 100,
            r: 20,
            t: 0,
            b: 100,
        },
        height: 500,
        width: 600,        
    };
    Plotly.newPlot("bar", data, layout);
}

// create bubble chart
function bubbleChart(selectedSample){
    let x_axis = selectedSample.otu_ids;
    let y_axis = selectedSample.sample_values;
    let marker_size = selectedSample.sample_values;
    let color = selectedSample.otu_ids;
    let text = selectedSample.otu_labels;
    let trace = {
        x: x_axis,
        y: y_axis,
        text: text,
        mode: "markers",
        marker: {
            color: color,
            colorscale: "Earth",
            size: marker_size,
        },
        type: "scatter",        
    };
    let data = [trace];
    let layout = {
        xaxis: {
            title: { text: "OTU ID" },            
        },
    };
    Plotly.newPlot("bubble", data, layout);
}

// display metadata
function displayMetaData(demographicInfo) {
    let demoSelect = d3.select("#sample-metadata");
    demoSelect.html(`
        <strong><small>id: ${demographicInfo.id} <br>
        ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} <br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} <br>
        wfreq: ${demographicInfo.wfreq}
    `);
}

// initial chart update
updateCharts(dataNames[0]);