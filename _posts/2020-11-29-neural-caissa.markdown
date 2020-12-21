---
layout: post
comments: true
title:  "Neural Caissa: Building a Chess bot with Deep Learning"
date:   2020-12-20
description: Fun little python project to teach a bot how to play chess.
categories: Python, Javascript
keywords: Python, Backtracking, Minimax, ConvNets, Deep Learning, Chess, Games
thumbnail: /assets/posts/neural-caissa/neural-caissa-banner.png
banner: /assets/posts/neural-caissa/neural-caissa-banner.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

This post will be updated with details and experiments from my [NeuralCaissa](https://github.com/glhuilli/neural_caissa) project.

<div class='got'>
<img style="margin: 10px auto;" width="450" src='{{ site.baseurl }}/assets/posts/neural-caissa/chess-board.png' alt='Game between human vs NeuralCaissa.'>
<p align="center">Game between human vs NeuralCaissa</p>
</div>


{% if page.comments %}
<!-- <script id="dsq-count-scr" src="//glhuilli.disqus.com/count.js" async></script> -->
<div id="disqus_thread"></div>
<script>
var disqus_config = function () {
this.page.url = virtual-environments;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = virtual-environments; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://glhuilli.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
{% endif %}
