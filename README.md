# alz-chart
A simple jQuery plugin to generate bar-chart.
========================================================================
- author 	: alizainal.abidin@live.com
- created on : 09/12/2013 
========================================================================

## Usage:
1. Provide container to display chart. e.g: 
```sh
	<div id="chart-container"></div>
```

2. Initialize JSON data as below:
```sh
var chartJSONData = [{
	name: "#Ali",
	chart: "120",
	id: "1"			
}, 
{
	name: "#Sandhi",
	chart: "130",
	id: "2"
},
{
	name: "#Pablo",
	chart: "158",
	id: "3"
},
{
	name: "#John",
	chart: "140",
	id: "4"
}];	
```

3. Activate the `chart` by added the following lines:  
```sh
$("#chart-container").chart({
	identifierProperty: 'id',
	name: function(item) {
		return item.name;
	},      
	chart: function (item){
		return item.chart;
	},      
	upperBound: 100
}, chartJSONData); 

```
