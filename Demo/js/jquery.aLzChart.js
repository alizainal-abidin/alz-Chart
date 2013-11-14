/*
 * jQuery aLzChart Ver. 1.0 
 * jQuery function to generate chart from JSON data
 * with chart animation and color selection.
 * Copyright (c) 2013 aLz-engine.
 *
 * created by : Ali Zainal Abidin
 * email      : alizainal.abidin@live.com
 * created on : 09/12/2013 
 * usage      : call this function with params
 *		$(containerId).chart({
 *			identifierProperty: 'id',            
 *			name: function(item) {
 *				return item.name;
 *			},            			
 *			chart: function (item){
 *				return item.chart;
 *			},
 *			upperBound: 100
 *		}, chartJSONData);		
*/

(function ($) {

	var
		// Public methods exposed to $.fn.chart()
		methods = {},

		// Default options
		defaultOptions =
		{
			identifierProperty: 'id',
			name: function (item) {
			    return '';
			},
			chart: function (item) {
			    return '';
			},
			color: function (item) {
				return 'magenta';
			},
			actionMenu: {
			    Delete: {
			        showCondition: function (item) {
			            return true;
			        },
			        command: function (item) {
			            // Do Nothing;
			        }
			    }
			},								
			upperBound: 100
		},

		// define plug-in identity.
		pluginIdentity = 'aLzChart',

		// define chart template.
		chartTemplate = '' + 
            '<div class="column"><span class="name"></span><span class="chart"></span></div>',        

		nameSection = 'name',		
	    
        chartSection = 'chart';

	methods.init = function (options, jsonData) {
	    
	    var options = $.extend({}, defaultOptions, options),
			newJsonData = [],
			chartData = [];
			
		$.extend(true, newJsonData, jsonData);			
		
		return this.each(function () {
			
			var $container = $(this);

			// make container empty.
			$container.empty();

			$container.removeData(pluginIdentity);
			var data = {};
			data.options = options;
			data.jsonData = newJsonData;
			
			// check upper bound value.
			var chartValues = [];
			$.each(jsonData, function(key, value){
				chartValues.push(value.chart);
			});
		
			chartValues = chartValues.sort(function(a,b){return b-a;});
			if(chartValues[0] > data.options.upperBound){
				data.options.upperBound = chartValues[0] ; 
			}
			
		    $.each(data.jsonData, function (dataKey, dataItem) {

		        var $chartWrap = $(chartTemplate);		        
                			    
		        var $chart = $chartWrap.filter(".column");
		        
		        $chart.attr('chart-id', pluginIdentity + dataItem[data.options.identifierProperty]);
				$chart.attr('title', data.options.name(dataItem) + ': ' + data.options.chart(dataItem));		        
				
				var chartPercentageValue = data.options.chart(dataItem) / data.options.upperBound * 100;
		        // uncomment below code to disable animation.
				//$chart.find('.' + chartSection).css({"height" : chartPercentageValue + "%"});	
				
				var topPosition = parseInt(chartPercentageValue * $chart.height() / 100 + 12);
				$chart.find('.' + nameSection).html(data.options.chart(dataItem)).css({'height' : topPosition + 'px'});										
				
				var chartObj = {
					chart: $chart,
					value: chartPercentageValue,
					color: data.options.color(dataItem)
				}
				
				chartData.push(chartObj);
				
				/*$container.append($chart);
				
				$chart.find('.' + chartSection).animate({
					height: parseInt(chartPercentageValue * $chart.height() / 100)
				}, 800);	*/			
			});
			
			$.generateChart($container, chartData, 0);
			$container.data(pluginIdentity, data);
		});
	};

	methods.update = function (updatedItem, color) {
	    // Collect other updated items
	    var editedTiles = [];
	    $("[class='live-tile purple']").each(
            function()
            {
                var currentId = $(this).attr("tile-id");
                editedTiles.push(currentId);
            }
        );

		return this.each(function () {

		    $container = $(this);
		    var updated = false;

			data = $container.data(pluginIdentity);

			if (data != null) {
			    
				for (var i = 0; i < data.jsonData.length; i++) {

				    var existingItem = data.jsonData[i];
				    if (existingItem[data.options.identifierProperty] == updatedItem[data.options.identifierProperty]) {

				        data.jsonData.splice(i, 1, updatedItem);
				        updated = true;
				        break;
				    }
				}

				if (!updated) data.jsonData.push(updatedItem);

				$container.snowdentile(data.options, data.jsonData);
				
				if (data.options.moveable) {
				    $container.find('li[tile-id="' + pluginIdentity + updatedItem[data.options.identifierProperty] + '"]').removeClass(data.options.color).addClass(color)
				}
				else {
				    $container.find('div[tile-id="' + pluginIdentity + updatedItem[data.options.identifierProperty] + '"]').removeClass(data.options.color).addClass(color);
				}

			    // Restore all the edited data to purple
				editedTiles.forEach(
                    function (item)
                    {
                        $("[tile-id='" + item + "']").removeClass("blue").addClass("purple");
                    }
                );
			}
		});
    };

	methods.remove = function (removedItem) {

	    return this.each(function () {

	        $container = $(this);

	        data = $container.data(pluginIdentity);

	        if (data != null) {

	            for (var i = 0; i < data.jsonData.length; i++) {

	                var existingItem = data.jsonData[i];

	                if (existingItem[data.options.identifierProperty] == removedItem[data.options.identifierProperty]) {

	                    data.jsonData.splice(i, 1);
	                    break;
	                }
	            }

	            $container.snowdentile(data.options, data.jsonData);
	        }
	    });
	};

	$.fn.chart = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jquery.chart');
		}
	};	

	$.generateChart = function($container, $chartData, i){
		if (i < $chartData.length) {
			$container.append($chartData[i].chart);
			// Specified chart color.
			var color = $chartData[i].color == undefined ? 'magenta' : $chartData[i].color ;
			// Animate height using jQuery animate() function
			$chartData[i].chart.find('.' + chartSection).addClass(color).animate({
				height: parseInt($chartData[i].value * $chartData[i].chart.height() / 100)
			}, 800);
			
			var timer = setTimeout(function() {
				i++;
				$.generateChart($container, $chartData, i);
			}, 100);
		} 
	};
})(jQuery)