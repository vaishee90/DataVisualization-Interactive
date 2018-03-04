var margin = {top: 19.5, right: 15, bottom: 19.5, left: 42},
	width = d3.select("#chart_container").node().getBoundingClientRect().width - margin.right - margin.left,
    height = 420 - margin.top - margin.bottom,
    radius = 5;
   
var xAxisScale = d3.scale.linear()
		.range([0, width])
		.domain([0,170]),
	xAxis = d3.svg.axis()
		.orient('bottom')
		.ticks(20)
		.tickFormat(d3.format('02d'))
		.scale(xAxisScale),
    yAxisScale = d3.scale.linear()
    	.range([height, 0])
    	.domain([0,100]),
    yAxis = d3.svg.axis()
    	.orient('left')
    	.ticks(10)
    	.tickFormat(d3.format('02d'))
    	.scale(yAxisScale);

/*Ref: http://bl.ocks.org/vigorousnorth/5fa58afeefb073b5eb95*/

var svg = d3.select("#chart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);

svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.attr("x", width)
				.attr("y", height - 6)
				.text("Total % of Return Serves");

svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("y", 6)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")
				.text("% of Matches Won");

var label = svg.append("text")
				.attr("class", "name label")
				.attr("text-anchor", "end")
				.attr("y", height - 30)
				.attr("x", width)
				.text("Player Name");

var dot = svg.selectAll("circle");

d3.json("players_ret.json", (players)=>{
		var dat = players.map(function(d){
		return {
				player: d.player,
				percent_won: d.percent_won[2004],
				percent_tot_ret: d.percent_tot_ret[2004]
			};
		});

		dot = svg.selectAll("circle")
		.data(dat)
		.enter()
		.append("circle")
		.attr("class","circle")
		.attr("cx", (d)=> xAxisScale(+d.percent_tot_ret))
		.attr("cy", (d)=> yAxisScale(+d.percent_won))
		.attr("r", function(d) { return (d.percent_won === 100.0) ? radius*2 : radius })
		.attr("id", (d)=> d.player)
		.style("fill", function(d) { return (d.percent_won === 100.0) ? "#1BDC2C" : "#FE6FA0" })
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseExit);
	})

function yearSelect(year) {

	d3.json("players_ret.json", (players)=>{
		var dat = players.map(function(d){
		return {
				player: d.player,
				percent_won: d.percent_won[year],
				percent_tot_ret: d.percent_tot_ret[year]
			};
		})

		dot = svg.selectAll("circle")
		.data(dat)
		.transition()
		.duration(1000)
		.delay(50)
		.attr("cx", (d)=> xAxisScale(+d.percent_tot_ret))
		.attr("cy", (d)=> yAxisScale(+d.percent_won))
		.attr("r", function(d) { return (d.percent_won === 100.0) ? radius*2 : radius })
		.attr("id", (d)=> d.player)
		.style("fill", function(d) { return (d.percent_won === 100.0) ? "#1BDC2C" : "#FE6FA0" });


		svg.selectAll("circle")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseExit);
	})
}

/*http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774*/

function handleMouseOver(d){
	d3.select(this)
		.style({"stroke-width":"4"})
		.attr({"r": radius*3});

	label.text(d.player).style({"fill": (d.percent_won === 100.0) ? "#1BDC2C" : "#FE6FA0" })
}

function handleMouseExit(d) {
	d3.select(this)
    		.style({"fill": function(d) { return (d.percent_won === 100.0) ? "#1BDC2C" : "#FE6FA0" }})
    		.style({"stroke-width": "1"})
    		.attr({r: function(d) { return (d.percent_won === 100.0) ? radius*2 : radius }});
}

