---
layout: post
title:  "Machine Learning research from 2009-2019"
date:   2020-09-14
description: This analysis covers all papers downloaded from NeurIPS conferences between 2009 and 2019
categories: DataAnalysis, MachineLearning
keywords: D3, DataViz, ML
thumbnail: /assets/posts/ml-analysis/ml-analysis-banner.png
banner: /assets/posts/ml-analysis/ml-analysis-banner.png
css:
  - /assets/posts/neurips-analysis/neurips-analysis.css
invert: true
---

This analysis covers all papers downloaded from NeurIPS conferences between 2009 and 2019 using the [[NeurIPS crawler](https://github.com/glhuilli/neurips_crawler)]. Originally I wanted to process and analyze all papers from 1987 to this date as I have all the data, but I decided to focus just in the last ten years of data.

This post's primary goal was to explore `D3.js` more extensively using some well-known data from a different angle. I know there are probably dozens of blog posts and Kaggle scripts that do a comprehensive analysis of NeurIPs data. I haven't seen an analysis for co-authorship on main topics from an Institution's perspective.

This post's secondary goal was to put much of the processing code into a new python package that I called [papeles](https://github.com/glhuilli/papeles). The word `papeles` is a literal translation for `papers` into Spanish. Most of this code is not exceptionally interesting, but it was worth cleaning and refactoring into a lightweight package for others (or my future self) to use. This package is very experimental, so I did not include unit tests and can be significantly improved. If you want to add something, you are more than welcome to send pull requests or create issues. I'll be checking on those regularly.

## How institutions interact with each other in machine learning research?

To answer this question, I pulled all the papers raw content using the `papeles` package and extracted the first page (or so) for each paper, focusing exclusively on the first section just before the abstract. From this section, `papeles` has some tooling to identify which institutions are mentioned and find a relationship between all authors in said paper.

When visualizing graphs, most examples I've seen are using the graph's force-directed representation (e.g., [this one](https://observablehq.com/@d3/force-directed-graph)). I tried this and got a very messy view that wouldn't provide any visualization insight. Looking at interconnected institutions in a hierarchical edge bundling graph offers a sweet spot between observing which institutions are highly connected and who, in a summarized way, can be enriched with extra signals by hovering the mouse over each institution.

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>
<div id='hierarchical-edge-bundling-mobile'></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/hierarchical-edge-bundling-mobile.js"></script>

<div id='hierarchical-edge-bundling'></div>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/hierarchical-edge-bundling.js"></script>

## Are there institutions that mostly publish with a specific group?

For this, I'm using the well known [Louvain method](https://sites.google.com/site/findcommunities/) for community detection in graphs. For more details about this method, please check [[Blonder et al. (2008)]](https://arxiv.org/abs/0803.0476).

To visualize the results, I decided to use a `TreeMap` based on the results published in [[Mylavanparu et al. (2019)]](http://users.umiacs.umd.edu/~elm/projects/ranked-list/ranked-list.pdf), which at the same time allows us to inspect visually other properties of the network, in particular centrality measures. These measures provide insights into how institutions are connected to other nodes in the graph.

<svg width="760" height="470" id="flare_treemap"></svg>
<form>
  <label><input type="radio" name="mode" value="sumBySize" checked> Degree</label>
  <!-- <label><input type="radio" name="mode" value="sumByCount"> Count</label> -->
  <!-- <label><input type="radio" name="mode" value="sumByHub"> Hub</label> -->
  <label><input type="radio" name="mode" value="sumByAuthority"> Authority</label>
  <label><input type="radio" name="mode" value="sumByBetweenness"> Betweenness</label>
  <label><input type="radio" name="mode" value="sumByCloseness"> Closeness</label>
  <!-- <label><input type="radio" name="mode" value="sumByKatz"> Katz</label> -->
  <label><input type="radio" name="mode" value="sumByEigen"> Eigen</label>
</form>
<script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/treemap.js"></script>

In the `TreeMap`, you can see painted with six different colors that correspond to the top six communities identified in the co-authoring institution's network. Most of the centrality measures show very similar behavior.


## What are the trends of ML research?

The answer to this question is, for sure, well known. Anyone with some degree of understanding about this area should be able to answer `Deep Learning`. However, while Deep Learning research captures all the mainstream attention, other fields are exciting to keep an eye on. For example, `Adversarial Machine Learning` is an area of research that has gotten some traction over the last few years. Yes, it has been fueled by Deep Learning and Generative Adversarial Networks (aka GANs), but back in the day (~10 years ago), this was very fringe and pretty much inexistent (trust me, [I know](https://www.kdd.org/exploration_files/v11-2-18-CSI-LHuillier.pdf)).

Also, I find it very interesting what is going on with topics that were very hot +10 years ago and today are almost abandoned. "Classical" machine learning models like Kernel methods or Graphical models are rarely mentioned. They are far from being mentioned and investigated to the level that Neural Networks and Deep Learning are being researched today.

As listing all the possible research topics in machine learning could be a daunting task, I used some fairly simple non supervised NLP models that helped me listing the top 100 topics in ML. For this, I created first a list of keywords from the abstracts from all papers. Then, while just keeping the keywords that are present more than N times across topics in a particular year, I used a non-supervised topic modeling tool called Latent Dirichlet Allocation (particularly the one available in the `gensim` package). All this code is available in the `papeles` package, and examples on how to use it is available in [this script](https://github.com/glhuilli/papeles/blob/master/scripts/papeles%20-%20keywords%20topics%20analysis.ipynb).

<div>
<img src='{{ site.baseurl }}/assets/posts/neurips-analysis/neurips-keywords-word-cloud.png' alt='Wordcloud with keywords per year'>
</div>


## How has been the collaboration between institutions over time?

In the following, you can see how institutions have been increasingly collaborating as NeurIPS got more popular. This is most likely the effect of having a larger volume of papers in recent years (higher volume of papers means a probability of institution collaborating).

Please check the [script](http://localhost:8888/notebooks/papeles%20-%20institutions%20and%20topics%20analysis.ipynb) in `papeles` for details on how the topics were computed and how the names were assigned.

Several follow-up questions can be done by using this dataset, analysis tool, and visualization strategies, but I'll leave that for another time. Questions like "which are the institutions that have co-authoring papers the most together over time" or "which are the institutions with more influence on topics like ConvNets" could be done quickly using `papeles` and the set of scripts available.

Interestingly, the answer to the first question is `University of Washington` and `Microsoft Research`.


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

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2018-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2018-topic1.js"></script>
      <p align='center'>2018 - 1st Topic (Deep Learning Optimization)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2018-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2018-topic2.js"></script>
      <p align='center'>2018 - 2nd Topic (Deep Learning Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2018-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2018-topic1-mobile.js"></script>
  <p align='center'>2018 - 1st Topic (Deep Learning Optimization)</p>
  <div class='div-only-mobile' id='heb-2018-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2018-topic2-mobile.js"></script>
  <p align='center'>2018 - 2nd Topic (Deep Learning Models)</p>
</div>

<div class='desk'>
  <div class='row' id='desk'>
    <div class='column' id='desk'>
      <div class='desk' id='heb-2019-topic1'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2019-topic1.js"></script>
      <p align='center'>2019 - 1st Topic (Deep Learning Optimization)</p>
    </div>
    <div class='column'>
      <div class='desk' id='heb-2019-topic2'></div>
      <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2019-topic2.js"></script>
      <p align='center'>2019 - 2nd Topic (Deep Learning Models)</p>
    </div>  
  </div>
</div>
<div class='div-only-mobile'>
  <div class='div-only-mobile' id='heb-2019-topic1-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2019-topic1-mobile.js"></script>
  <p align='center'>2019 - 1st Topic (Deep Learning Optimization)</p>
  <div class='div-only-mobile' id='heb-2019-topic2-mobile'></div>
  <script src="{{ base.url | prepend: site.url }}/assets/posts/neurips-analysis/heb-2019-topic2-mobile.js"></script>
  <p align='center'>2019 - 2nd Topic (Deep Learning Models)</p>
</div>
