//Based on code posted by @mbostock in https://gist.github.com/mbostock/7607999
// mobile version

var diameter_mobile = 340,
    radius_mobile = diameter_mobile / 2,
    innerRadius_mobile = radius_mobile - 120;

var cluster_mobile = d3.cluster()
    .size([360, innerRadius_mobile]);

var line_mobile = d3.radialLine()
    .curve(d3.curveBundle.beta(0.85))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg_mobile = d3.select("div#hierarchical-edge-bundling-mobile").append("svg")
    .attr("width", diameter_mobile)
    .attr("height", diameter_mobile)
  .append("g")
    .attr("transform", "translate(" + radius_mobile + "," + radius_mobile + ")");

var link_mobile = svg_mobile.append("g").selectAll(".link"),
    node_mobile = svg_mobile.append("g").selectAll(".node");

d3.json("assets/posts/neurips-analysis/n20_graph_all_years.json", function(error, classes) {
  if (error) throw error;

  var root_mobile = packageHierarchy(classes)
      .sum(function(d) { return d.size; });

  cluster_mobile(root_mobile);

  link_mobile = link_mobile
    .data(packageEdges(root_mobile.leaves()))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line_mobile);

  node_mobile = node_mobile
    .data(root_mobile.leaves())
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.data.key; })
      .on("mouseover", mouseovered_mobile)
      .on("mouseout", mouseouted_mobile);
});

function mouseovered_mobile(d) {
  node_mobile
      .each(function(n) { n.target = n.source = false; });

  link_mobile
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  node_mobile
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });
}

function mouseouted_mobile(d) {
  link_mobile
      .classed("link--target", false)
      .classed("link--source", false);

  node_mobile
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
