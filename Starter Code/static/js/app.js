// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let objectofsample = metadata.filter(x => x.id == sample);
    let objectresult = objectofsample[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in objectresult){
      panel.append("h6").text(`${key.toUpperCase()}: ${objectresult[key]}`)
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesfield = data.samples

    // Filter the samples for the object with the desired sample number
    // same filtering from the buildMetadata function
    let objectofsample = samplesfield.filter(x => x.id == sample);
    let objectresult = objectofsample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = objectresult.otu_ids;
    let otu_labels = objectresult.otu_labels;
    let sample_values = objectresult.sample_values;
    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }]
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "otu ID"},
      yaxis: {title: "Number of Bacteria"},
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(x => `otu ${x} `);

    // Build a Bar Chart
        // Don't forget to slice and reverse the input data appropriately
    let BarData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }]
    let BarLayout = {
      title: "Top 10 Bacteria Cultures",
      xaxis: {title:"Number of Bacteria"}
    }

    // Render the Bar Chart
    Plotly.newPlot("bar", BarData, BarLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let namesfield = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < namesfield.length; i++){
      dropdown.append("option").text(namesfield[i]).property("value", namesfield[i]);
    }

    // Get the first sample from the list
    let first = namesfield[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
