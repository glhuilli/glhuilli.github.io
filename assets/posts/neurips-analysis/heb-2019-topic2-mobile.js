//Based on code posted by @mbostock in https://gist.github.com/mbostock/7607999

var diameter_19t2m = 340, // 960 original
    radius_19t2m = diameter_19t2m / 2,
    innerRadius_19t2m = radius_19t2m - 120;

var cluster_19t2m = d3.cluster()
    .size([360, innerRadius_19t2m]);

var line_19t2m = d3.radialLine()
    .curve(d3.curveBundle.beta(0.85))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg_19t2m = d3.select("div#heb-2019-topic2-mobile")
  .append("svg")
    .attr("width", diameter_19t2m)
    .attr("height", diameter_19t2m)
  .append("g")
    .attr("transform", "translate(" + radius_19t2m + "," + radius_19t2m + ")");

var link_19t2m = svg_19t2m.append("g").selectAll(".link"),
    node_19t2m = svg_19t2m.append("g").selectAll(".node");

d3.json("assets/posts/neurips-analysis/heb-files/2019-topic_2-deep_learning_models_graph.json", function(error, classes) {
  if (error) throw error;

  var root = packageHierarchy(classes)
      .sum(function(d) { return d.size; });

  cluster_19t2m(root);

  link_19t2m = link_19t2m
    .data(packageEdges(root.leaves()))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line_19t2m);

  node_19t2m = node_19t2m
    .data(root.leaves())
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.data.key; })
      .on("mouseover", mouseovered_19t2m)
      .on("mouseout", mouseouted_19t2m);
});

function mouseovered_19t2m(d) {
  node_19t2m
      .each(function(n) { n.target = n.source = false; });

  link_19t2m
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  node_19t2m
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });
}

function mouseouted_19t2m(d) {
  link_19t2m
      .classed("link--target", false)
      .classed("link--source", false);

  node_19t2m
      .classed("node--target", false)
      .classed("node--source", false);
}

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of edges for the given array of nodes.
function packageEdges(nodes) {
  var map = {},
      edges = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.edges) d.data.edges.forEach(function(i) {
      edges.push(map[d.data.name].path(map[i]));
    });
  });

  return edges;
}
