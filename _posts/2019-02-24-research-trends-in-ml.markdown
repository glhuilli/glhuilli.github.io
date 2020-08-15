---
layout: post
title:  "Research trends in Machine Learning from 1987-2018"
date:   2019-02-24
description: This analysis covers all papers downloaded from NeurIPS conferences between 1987 and 2018
categories: DataAnalysis, MachineLearning
keywords: D3, DataViz, ML
thumbnail: /assets/posts/ml-analysis/ml-analysis-banner.png
banner: /assets/posts/ml-analysis/ml-analysis-banner.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

Coming soon.

Currently processing 8.8Gb of papers downloaded using the [[NeurIPS crawler](https://github.com/glhuilli/neurips_crawler)]


<style type="text/css">

div.example {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.box {
  font: 10px sans-serif;
}

.box line,
.box rect,
.box circle {
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5px;
}

.box .center {
  stroke-dasharray: 3,3;
}

.box .outlier {
  fill: none;
  stroke: #ccc;
}

svg {
  font: 10px sans-serif;
  shape-rendering: crispEdges;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
}

path.domain {
  stroke: none;
}

.y .tick line {
  stroke: #ddd;
}
</style>
<div id="example"></div>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script type="text/javascript"></script>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/stack_plot1.js"></script>
