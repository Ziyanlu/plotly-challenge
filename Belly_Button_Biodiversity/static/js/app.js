function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function (data) {

    var Metadatasample = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    Metadatasample.html("");


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      var li = Metadatasample.append("li").text(`${key}:${value}`);
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  // var data2 = [{
  //   domain: {x: [0,1], y: [0,1]},
  //   value: 0-10,
  //   title: {text: "Belly Button Washing Frequency"},
  //   type: "inidicator",
  //   mode: gauge
  // }];

  // var layout = {
  //   width: 200,
  //   height: 400,
  //   margin: {t:0, b:0}
  // };

  // Plotly.newPlot("gd", data2, layout);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`)
    .then(
      function (response) {

        var bubbleChartData = [{
          x: response.otu_ids,
          y: response.sample_values,
          mode: "markers",
          type: "scatter",
          marker: {
            size: response.sample_values,
            color: response.otu_ids
          }
        }];

        var bubbleChartLayout = {
          xaxis: { title: "OUT ID" },
          showlegend: false
        };

        Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).

        var pieChartData = [{
          values: response.sample_values.slice(1, 10),
          labels: response.otu_ids.slice(0, 10),
          type: "pie"
        }];

        var pieChartLayout = {
          height: 600,
          width: 800
        };

        Plotly.newPlot("pie", pieChartData, pieChartLayout);
      }
    )
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
