alz-Chart
=========
created by : Ali Zainal Abidin
email : alizainal.abidin@live.com
created on : 09/12/2013 

A simple jQuery plugin to generate bar-chart.

Usage:
1. Provide container to display chart. e.g: <div id="chart-container"></div>

2. Initialize JSON data as sample below:
  var chartJSONData = [{
			name: "#Ali",
			chart: "120",
			id: "Ali_100"			
		}, 
		{
			name: "#Sandhi",
			chart: "130",
			id: "Sandhi_30"
		},
		{
			name: "#Fakhri",
			chart: "158",
			id: "Fakhri_58"
		},
		{
			name: "#Juan",
			chart: "140",
			id: "Juan_40"
  }];
  
3. Generate bar-chart by simple script below:  
  
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

