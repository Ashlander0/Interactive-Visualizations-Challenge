// print function because I keep using print from Python instead of console.log
function print(string) {
	console.log(string);
};

// get JSON data from file
d3.json('data/samples.json').then(response => {
	print(response);
	var samples = response.samples;
	
	// variables
	var otuIDs = [samples[0].otu_ids.slice(0, 10).reverse()];
	var otuLabels = [samples[0].otu_labels.slice(0, 10)];
	var quantity = [samples[0].sample_values.slice(0, 10).reverse()];

	function onChange() {
		// get value selected from dropdown
		value = d3.select('#selDataset').property('value');

		otuIDs = samples[value].otu_ids.slice(0, 10).reverse();
		otuIDs = otuIDs.map(otu => 'OTU ' + otu);
		otuLabels = samples[value].otu_labels.slice(0, 10);
		quantity = samples[value].sample_values.slice(0, 10).reverse();
		
		print(otuIDs);

		Plotly.restyle('bar', 'x', [quantity]);
		Plotly.restyle('bar', 'y', [otuIDs]);
		Plotly.restyle('bar', 'text', [otuLabels]);
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
		print(quantity);
		print(otuIDs);

		var layout = {
			title: 'Top 10 OTUs',
			yaxis: {title: 'OTU',
					tickmode: 'linear',
					type: 'category'},
			xaxis: {title: 'Quantity of OTU'}
		};
		var data = [trace];
		
		Plotly.plot('bar', data, layout);
	};

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
	};
	init();
});
