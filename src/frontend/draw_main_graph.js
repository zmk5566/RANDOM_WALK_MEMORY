
var total_data = [];

var the_matrix = document.createElement("div");
the_matrix.setAttribute("id", "the_matrix");
the_matrix.setAttribute("class", "grid-container");
document.getElementById("div1").appendChild(the_matrix);

function draw_index(index){

var temp_element = document.createElement("div");
    var temp_id  = "graph_index"+index;
    temp_element.setAttribute("id", temp_id);
    temp_element.setAttribute("class", "grid-item");
    temp_element.setAttribute("onclick", "triger_index_block("+index+")");

    the_matrix.appendChild(temp_element);


const margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 60,
    height = 60;

// append the svg object to the body of the page
const svg =d3.select("#"+temp_id)
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("../../data/"+index+".csv").then ( function(data) {
  total_data = data;

  // List of subgroups = header of the csv files = soil condition here
  //console.log("current_data",data);
  slice_data = data.slice()[0];
  //console.log("slice data",slice_data);
  const subgroups = data.columns.slice(1);
  //console.log(subgroups);
  

  //console.log("slice data size" , slice_data);
  
  var count = -1;
  for(let key in slice_data) {
    // increase the count
    ++count;
    }

  var color_range = [];

  //console.log("count", count);

  for (var i = 0; i < count; i++) {
    //console.log("slice_data x",slice_data[i]);
    color_range.push(slice_data[i]);
    //simple_color_list.append(slice_data[i]);
  }

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.group)

  //console.log("groups", groups);
  //console.log("subgroups",subgroups);
  //console.log("color_range",color_range);
  // Add X axis
  const x = d3.scaleBand()
      .range([0, width])
      .padding([0])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(color_range);

  // Normalize the data -> sum of each group must be 100!
  //console.log(data)
  dataNormalized = []
  data.forEach(function(d){
    // Compute the total
    //console.log(d)
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

    //console.log("stacked",stackedData);

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
})
}

for (var i=1; i< 79; i++){
  draw_index(i);
}

// function activate_element(input_element){
//     console.log("input_element value",input_element.value);
//     input_element.value;
// }