// print function because I keep using print from Python instead of console.log
function print(string) {
	console.log(string);
};

// get JSON data from file
d3.json('data/samples.json').then(response => {
	print(response);
	var samples = response.samples;
	var metadata = response.metadata;

	// variables
	var otuIDs = [];
	var otuIDstr = [];
	var otuLabels = [];
	var quantity = [];
	var wash = [];

	function onChange() {
		// get value selected from dropdown
		value = d3.select('#selDataset').property('value');

		// create new variables for charts
		otuIDs = samples[value].otu_ids.slice(0, 10).reverse();
		otuIDstr = otuIDs.map(otu => 'OTU ' + otu);
		otuLabels = samples[value].otu_labels.slice(0, 10);
		quantity = samples[value].sample_values.slice(0, 10).reverse();
		wash = metadata[value].wfreq;

		print(otuIDs);

		// build meta table
		buildMeta(value);
		// refresh bar chart
		Plotly.restyle('bar', 'x', [quantity]);
		Plotly.restyle('bar', 'y', [otuIDstr]);
		Plotly.restyle('bar', 'text', [otuLabels]);
		// refresh bubble chart
		Plotly.restyle('bubble', 'x', [otuIDs]);
		Plotly.restyle('bubble', 'y', [quantity]);
		Plotly.restyle('bubble', 'marker.color', [otuIDs]);
		Plotly.restyle('bubble', 'marker.size', [quantity]);
		// refresh gauge
		Plotly.restyle('gauge', 'value', wash);
	};

	// bar chart
	function buildBar() {
		var trace = {
			x: [],
			y: [],
			type: 'bar',
			orientation: 'h',
			text: otuLabels
		};

		var layout = {
			title: 'Top 10 OTUs',
			yaxis: {tickmode: 'linear',
					type: 'category'},
			xaxis: {title: 'Quantity of OTU'}
		};
		var data = [trace];
		
		Plotly.plot('bar', data, layout);
	};

	// bubble chart
	function buildBubble() {
		var trace = {
			x: [],
			y: [],
			type: 'scatter',
			mode: 'markers',
			marker: {
				color: '',
				size: 0				
			},
			text: otuLabels
		};

		var data = [trace];

		var layout = {
			title: 'Top 10 OTUs'
		};

		Plotly.plot('bubble', data, layout);
	};

	// populate meta data
	function buildMeta(value) {
		//get table
		var table = d3.select('#sample-metadata');
		table.html('');

		print(metadata[value]);

		// insert variables to table
		Object.keys(metadata[value]).forEach(function(item) {
			table.append('h5').text(`${item.toUpperCase()}: ${metadata[value][item]}`);
		});

	};

	function buildGauge() {
		var trace = {
			x: [0, 1],
			y: [0, 1],
			value: 0,
			title: 'Wash Frequency',
			type: 'indicator',
			mode: 'gauge+number',
			gauge: {
				axis: {range: [0, 10]}
			}
		};
		var data = [trace];

		var layout = {

		};

		Plotly.plot('gauge', data, layout);
	}

	// fill dropdown options
	var dropdown = d3.select('#selDataset');
	response.names.forEach(function(name, value) {
		dropdown.append('option').text(name).property('value', value);
	});
	// enable dropdown select functionality
	d3.select('#selDataset').on('change', onChange);

	// initilization function to build the plots
	function init() {
		buildBar();
		buildBubble();
		buildGauge();
		//buildMeta();
	};

	init();
});
