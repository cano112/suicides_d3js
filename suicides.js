var numbers = [48, 6, -15, 16, 23, -42].map(x => x * 5);

var keepGoing = true
allData = []
d3.csv("suicides_data.csv").then(function(data) {
  console.log(data[0]);

	data.reduce(function(res, value) {
	  if (!res[value.countryyear]) {
		res[value.countryyear] = { country: value.country, countryyear: value.countryyear, totalNumber: 0 , sucPerPopulation: 0, year: value.countryyear.substr(-4)};
		allData.push(res[value.countryyear])
	  }
	  res[value.countryyear].totalNumber += parseInt(value.suicides_no);
	  res[value.countryyear].sucPerPopulation += parseFloat(value.suicidesPerPop);
	  return res;
	}, {});

	console.log("Choose year max", chooseYearMax("2005", 10))

});

function chooseYearMax(year, howMany){
	var sortedArray = chooseYear(year).slice().sort(function(a, b){
		if (a["sucPerPopulation"] > b["sucPerPopulation"]){
			return -1
		} else {
			return 1
		}
	});
	
	return sortedArray.slice(0,10)
}

function chooseYear(year){
	var filteredArray = allData.filter(function(item){
	  return item.year == year
	});
	return filteredArray
}


var svg = d3.select("svg");
var g = svg.append("g");
g.attr("transform", "translate(40, 300)");

function compare( a, b ) {
  if ( a.value < b.value ){
    return 1;
  }
  if ( a.value > b.value ){
    return -1;
  }
  return 0;
}

function update(data) {
	var bar_pos = 80;
	var bar_width = 40;
	var arrow_height = 40;
	var arrow_skip = 5
	var t = d3.transition().duration(750);
	var maxCircleRadius = 60
	var inRow = 5
	var circleCentersHorizontalDistance = 3 * parseInt(maxCircleRadius)
	var circleCentersVerticalDistance = 3 * parseInt(maxCircleRadius)
	var firstRowY = 200
	var textLeftShift = 35
	var textDownShift = 15
	var textLengthShift = 0.5

	var circle = g.selectAll("circle").data(data, function(d,i) {return d.country})
	var text = g.selectAll("text").data(data, function(d,i) {return d.country})
	
	var maxValue = Math.max.apply(Math, data.map(function(o) { return o.sucPerPopulation; }))
	console.log(maxValue)
	
	text.exit()
		.transition()
		  .style("fill-opacity", 1e-6)
	      .style("stroke-opacity", 1e-6)
			.remove()
			
			
	circle.exit()
		.transition()
		  .style("fill-opacity", 1e-6)
	      .style("stroke-opacity", 1e-6)
			.remove()
	

	text
		.transition(t)
			.attr("x", function(d,i) {return `${parseInt(maxCircleRadius)/2 + (i%inRow) * circleCentersHorizontalDistance - textLeftShift - d.country.length/textLengthShift}`})
			.attr("y", function(d,i) {return `${Math.floor(i / inRow) * circleCentersVerticalDistance - firstRowY + maxCircleRadius + textDownShift}`})
			.text(function(d,i) {return d.country + ":" + d.sucPerPopulation.toFixed(2)})
	
	circle
		.transition(t)
			.attr("cx", function(d,i) {return `${parseInt(maxCircleRadius)/2 + i%5 * circleCentersHorizontalDistance}`})
			.attr("cy", function(d,i) {return `${Math.floor(i / inRow) * circleCentersVerticalDistance - firstRowY}`})
			.attr("r", function(d,i) {return `${maxCircleRadius * (d.sucPerPopulation/maxValue)}`})
			.attr("fill-opacity", "0.3")
			.attr("fill", "red")
	// UPDATE
	// ENTER

	text.enter().append("text")
			.attr("x", function(d,i) {return `${parseInt(maxCircleRadius)/2 + (i%5) * circleCentersHorizontalDistance - textLeftShift - d.country.length/textLengthShift}`})
			.attr("y", function(d,i) {return `${Math.floor(i / inRow) * circleCentersVerticalDistance - firstRowY + maxCircleRadius + textDownShift}`})
			.text(function(d,i) {return d.country + ":" + d.sucPerPopulation.toFixed(2)})

	circle.enter().append("circle")
			.attr("cx", function(d,i) {return `${parseInt(maxCircleRadius)/2 + i%5 * circleCentersHorizontalDistance}`})
			.attr("cy", function(d,i) {return `${Math.floor(i / inRow) * circleCentersVerticalDistance - firstRowY}`})
			.attr("r", function(d,i) {return `${maxCircleRadius * (d.sucPerPopulation/maxValue)}`})
			.attr("fill-opacity", "0.3")
			.attr("fill", "red")
			
}
// update(numbers);
year = 1985
function chooseNextYear(){
	if (year >= 2010){
		year = 1986
	} else{
		year += 1
	}
	return year.toString()
}

d3.interval(function() {
	if (keepGoing){
		var tmpYear = chooseNextYear()
		numbers = chooseYearMax(tmpYear, 10)
		document.getElementById("yearSpan").innerHTML = tmpYear
		update(numbers);
	}
	
}, 2500);

function forceUpdate(year){
	numbers = chooseYearMax(year, 10)
	document.getElementById("yearSpan").innerHTML = year
	update(numbers);
}
function previous(){
	keepGoing = false
	if (year <= 1986){
		year = 2010
	} else{
		year -= 1
	}
	forceUpdate(year)
}
function next(){
	keepGoing = false
	if (year >= 2010){
		year = 1986
	} else{
		year += 1
	}
	forceUpdate(year)
}



