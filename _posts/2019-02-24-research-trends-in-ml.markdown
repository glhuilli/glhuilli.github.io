---
layout: post
title:  "Machine Learning research from 2009-2019"
date:   2020-08-20
description: This analysis covers all papers downloaded from NeurIPS conferences between 2009 and 2019
categories: DataAnalysis, MachineLearning
keywords: D3, DataViz, ML
thumbnail: /assets/posts/ml-analysis/ml-analysis-banner.png
banner: /assets/posts/ml-analysis/ml-analysis-banner.png
css:
  - /assets/posts/neurips-analysis/neurips-analysis.css
invert: true
---

This analysis covers all papers downloaded from NeurIPS conferences between 2009 and 2019 using the [[NeurIPS crawler](https://github.com/glhuilli/neurips_crawler)]. Originally I wanted to process and analyze all papers from 1987 to this date as I do have all the data, but I'll table that for time in the future. Given that it took me a while to re-start the work on this (at least two years), I decided to focus in the last 10 years of data.

This post's main purpose was to explore D3.js in a more extensive way, so you'll see that most of the results are presented below by using some D3.js option.

There were some few tricks I had to find to make the following visualizations work. Not being particularly experienced in `Javascript` was an issue, and most of "basic" things that are expected to be basic or "trivial" were mostly not documented by the D3.js communities, so I'll share some of these findings along with some of the findings that is possible to extract from the data.

A secondary purpose of this post, was to put much of the processing code into a new python package which I called [papeles](https://github.com/glhuilli/papeles). The word `papeles` is a literal translation for `papers` into Spanish. Most of this code is not exceptionally interesting, but it was worth cleaning and refactoring into a lightweight package for others to use. This is a very experimental package so I did not include unit tests.


## Which research institutions are the most influential in ML research today?

This is a very odd starting point for such analysis, but I honestly was checking D3.js and thought that looking at how institutions are interconnected between them by co-authoring papers using this visualization would be something interesting to see.

I believe this is an alternative to see how a graph looks like. I tried building some approximations about the co-authoring institutions graph, and none gave better information than the following viz.

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>
<div id='hierarchical-edge-bundling-mobile'></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/hierarchical-edge-bundling-mobile.js"></script>

<div id='hierarchical-edge-bundling'></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/hierarchical-edge-bundling.js"></script>

Using hierarchical edge bundling, it's easy to find which institutions share the most ML research with other institutions. For example CMU and MIT are very well into the top of this list, while Microsoft Research and Google among the top institutions without being educational institutions themselves.


## Are there institutions that mostly publish with a specific group?

Let's run some cluster algorithm on the co-author institution graph and see what happens. For this, I'm using the well known community detection algorithm in graphs created by researchers at Louvain, which gives the name for this algorithm.

This is a very simple model, non parametric and completely unsupervised. It finds some of the most recurrent connections within the graph, and results in a finite number of group of nodes that are most likely to share an edge between them. (add citation and actual explanation of the method).

To visualize the result, I decided to use a TreeMap, which at the same time allows us to inspect visually other properties of the network (e.g. centrality measures). These measures are computed over each node in the graph, and provides some insights on which are the institutions that connects most of the nodes in the graph, among other particular properties. The only one that is very different from the original results is Katz centrality measure which measures xxxx. This means that there's something very interesting about the behavior of these nodes (name the nodes that Katz rank higher).

<svg width="760" height="470" id="flare_treemap"></svg>
<form>
<!-- sumBySize, sumByCount, sumByHub, sumByAuthority, sumByBetweenness, sumByCloseness, sumByKatz, sumByEigen -->
  <label><input type="radio" name="mode" value="sumBySize" checked> Degree</label>
  <label><input type="radio" name="mode" value="sumByCount"> Count</label>
  <label><input type="radio" name="mode" value="sumByHub"> Hub</label>
  <label><input type="radio" name="mode" value="sumByAuthority"> Authority</label>
  <label><input type="radio" name="mode" value="sumByBetweenness"> Betweenness</label>
  <label><input type="radio" name="mode" value="sumByCloseness"> Closeness</label>
  <label><input type="radio" name="mode" value="sumByKatz"> Katz</label>
  <label><input type="radio" name="mode" value="sumByEigen"> Eigen</label>
</form>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/treemap.js"></script>

In the TreeMap you can see painted with 6 different colors that corresponds to the top 6 communities that can be identified in the co-authoring institutions network.


## What are the trends of ML research?

The answer to this question is for sure well known. Anyone with some degree of understanding about this area should be able to answer `deep learning`. However, while deep learning is capturing all the mainstream attention with GPT-3 and Deep-fakes, there are other fields that are very interesting to keep an eye on. For example XXX is an area of research that has gotten some traction over the last N years, and was pretty much inexistent 10 years ago. Also, I find particularly interesting what is going on with topics that were very hot 10 years ago and today are almost abandoned. "Classical" machine learning models like Support Vector Machines were the darlings for conferences like NeurIPS, but today are really out of the spotlight.

As listing all the possible research topics in machine learning could be a daunting task, I used some fairly simple non supervised NLP models that helped me listing the top 100 topics in ML. For this, I created first a list of keywords from the abstracts from all papers. Then, while just keeping the keywords that are present more than N times across topics in a particular year, I used a non-supervised topic modeling tool called LDA. There's a vast number of tricks and recommendations about how and when to use this model.


<!-- <div id="example1"></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/stack-plot1.js"></script> -->

<!-- <div id="example2"></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/stack-plot2.js"></script> -->

<div>
<img src='{{ site.baseurl }}/assets/posts/neurips-analysis/neurips-keywords-word-cloud.png' alt='Wordcloud with keywords per year'>
</div>


## What are the trends of ML research?

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2009-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2009-topic1.js"></script>
      <p align='center'>2009 - 1st Topic (Probabilistic Graphical Models)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2009-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2009-topic2.js"></script>
      <p align='center'>2009 - 2nd Topic (Bayesian Methods)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2009-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2009-topic1-mobile.js"></script>
  <p align='center'>2009 - 1st Topic (Probabilistic Graphical Models)</p>
  <div id='heb-2009-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2009-topic2-mobile.js"></script>
  <p align='center'>2009 - 2nd Topic (Bayesian Methods)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2010-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2010-topic1.js"></script>
      <p align='center'>2010 - 1st Topic (Probabilistic Graphical Models)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2010-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2010-topic2.js"></script>
      <p align='center'>2010 - 2nd Topic (Reinforcement learning)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2010-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2010-topic1-mobile.js"></script>
  <p align='center'>2010 - 1st Topic (Probabilistic Graphical Models)</p>
  <div id='heb-2010-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2010-topic2-mobile.js"></script>
  <p align='center'>2010 - 2nd Topic (Reinforcement learning)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2011-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2011-topic1.js"></script>
      <p align='center'>2011 - 1st Topic (Probabilistic Graphical Models - Inference)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2011-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2011-topic2.js"></script>
      <p align='center'>2011 - 2nd Topic (Neural networks)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2011-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2011-topic1-mobile.js"></script>
  <p align='center'>2011 - 1st Topic (Probabilistic Graphical Models - Inference)</p>
  <div id='heb-2011-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2011-topic2-mobile.js"></script>
  <p align='center'>2011 - 2nd Topic (Neural networks)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2012-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2012-topic1.js"></script>
      <p align='center'>2012 - 1st Topic (Bayesian Inference)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2012-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2012-topic2.js"></script>
      <p align='center'>2012 - 2nd Topic (Probabilistic Graphical Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2012-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2012-topic1-mobile.js"></script>
  <p align='center'>2012 - 1st Topic (Bayesian Inference)</p>
  <div class='div-only-mobile' id='heb-2012-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2012-topic2-mobile.js"></script>
  <p align='center'>2012 - 2nd Topic (Probabilistic Graphical Models)</p>
</div>


<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2013-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2013-topic1.js"></script>
      <p align='center'>2013 - 1st Topic (Markov Decision Processes)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2013-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2013-topic2.js"></script>
      <p align='center'>2013 - 2nd Topic (Matrix decomposition)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2013-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2013-topic1-mobile.js"></script>
  <p align='center'>2013 - 1st Topic (Markov Decision Processes)</p>
  <div class='div-only-mobile' id='heb-2013-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2013-topic2-mobile.js"></script>
  <p align='center'>2013 - 2nd Topic (Matrix decomposition)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2014-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2014-topic1.js"></script>
      <p align='center'>2014 - 1st Topic (Probabilistic Graphical Models)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2014-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2014-topic2.js"></script>
      <p align='center'>2014 - 2nd Topic (Neural Networks)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2014-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2014-topic1-mobile.js"></script>
  <p align='center'>2014 - 1st Topic (Probabilistic Graphical Models)</p>
  <div class='div-only-mobile' id='heb-2014-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2014-topic2-mobile.js"></script>
  <p align='center'>2014 - 2nd Topic (Neural Networks)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2015-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2015-topic1.js"></script>
      <p align='center'>2015 - 1st Topic (Deep Learning Optimization)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2015-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2015-topic2.js"></script>
      <p align='center'>2015 - 2nd Topic (Deep Learning Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2015-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2015-topic1-mobile.js"></script>
  <p align='center'>2015 - 1st Topic (Deep Learning Optimization)</p>
  <div class='div-only-mobile' id='heb-2015-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2015-topic2-mobile.js"></script>
  <p align='center'>2015 - 2nd Topic (Deep Learning Models)</p>
</div>

<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2016-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2016-topic1.js"></script>
      <p align='center'>2016 - 1st Topic (Deep Learning Optimization)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2016-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2016-topic2.js"></script>
      <p align='center'>2016 - 2nd Topic (Deep Learning Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2016-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2016-topic1-mobile.js"></script>
  <p align='center'>2016 - 1st Topic (Deep Learning Optimization)</p>
  <div class='div-only-mobile' id='heb-2016-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2016-topic2-mobile.js"></script>
  <p align='center'>2016 - 2nd Topic (Deep Learning Models)</p>
</div>



<p>something something</p>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2017-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2017-topic1.js"></script>
      <p align='center'>2017 - 1st Topic (Deep Learning Optimization)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2017-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2017-topic2.js"></script>
      <p align='center'>2017 - 2nd Topic (Deep Learning Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2017-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2017-topic1-mobile.js"></script>
  <p align='center'>2017 - 1st Topic (Deep Learning Optimization)</p>
  <div class='div-only-mobile' id='heb-2017-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2017-topic2-mobile.js"></script>
  <p align='center'>2017 - 2nd Topic (Deep Learning Models)</p>
</div>
