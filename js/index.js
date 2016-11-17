function formatDate(dt) {
  var year = parseInt(dt.substr(0,4));

  switch (dt.substr(5,2)) {
    case "01": qtr =  "4th"; year--; break;
    case "04": qtr =  "1st"; break;
    case "07": qtr =  "2nd"; break;
    case "10": qtr =  "3rd"; break;
  }

  return year.toString() + " - " + qtr + " Qtr.";
}

function display(dates, amts) {
  var height = 500;
  var width = 1000;
  var xMargin = 60;
  var yMargin = 60;

  var maxAmount = d3.max(amts);
  var dateCount = dates.length;
  var minDate = new Date(dates[0]);
  var maxDate = new Date(dates[dateCount - 1]);

  var y = d3.scaleLinear().domain([0, maxAmount]).range([height, 0]);
  var x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  var yAxis = d3.axisLeft(y);
  var xAxis = d3.axisBottom(x);

  var tooltip = d3.select("body").append("div") .attr("class", "tooltip") .style("opacity", 0);

  var canvas = d3.select(".canvas")
    .attr("width", width + xMargin)
    .attr("height", height + yMargin)
    .append("g")
    .attr("transform", "translate(50, 10)")

  canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 25)
    .text("USA GDP in Billions of Dollars");

  canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var bars = canvas.selectAll("rect")
    .data(amts)
    .enter()
    .append("rect")
    .attr("class", "dataRect")
    .attr("y", function(d) {
      return y(d);
    })
    .attr("height", function(d) {
      return (height - y(d));
    })
    .attr("width", function(d) {
      return width / dateCount;
    })
    .attr("x", function(d, i) {
      return i * (width / dateCount)
    })
   .on("mouseover", function(d, i) {
     tooltip.transition().duration(200).style("opacity", .9);
     tooltip.html(formatDate(dates[i]) + "<br/>" + amts[i]).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })
   .on("mouseout", function(d) {
     tooltip.transition().duration(500).style("opacity", 0);
    });
}

$(document).ready(function() {
  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
    if (error) return console.warn(error);

    var dates = [];
    var amts = [];

    for (var i = 0; i < json.data.length; i++) {
      dates.push(json.data[i][0]);
      amts.push(json.data[i][1]);
    }

    display(dates, amts);
  });

});