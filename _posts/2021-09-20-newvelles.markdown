---
layout: post
comments: true
title:  "Newvelles: Navigating the latest news by topics"
date:   2021-09-20
description: Website to check latest news clustered by topic
categories: Python, Javascript
keywords: News, Text Clustering, Sentence Encoder, NLP, Tensorflow, AWS Lambda, Python
thumbnail: /assets/posts/newvelles/newvelles.png
banner: /assets/posts/newvelles/newvelles.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

`Newvelles`, a portmanteau between `New` and `Nouvelles` (french word for news), so in other words `Latest News`, is a simple website (available in [this link](https://newvelles.com/)) that allows you to navigate the latest news clustered by topics.

<div class='got'>
  <img style="margin: 10px auto;" width="450" src='{{ site.baseurl }}/assets/posts/newvelles/newvelles_use_case_list.png' alt='Example top 10 news fetched on Nov 30th at 5:46am PDT.'>
  <p align="center">Example top 10 news fetched on Nov 30th at 5:46am PDT.</p>
</div>

<div class='got'>
  <img style="margin: 10px auto;" width="450" src='{{ site.baseurl }}/assets/posts/newvelles/newvelles_use_case_expand_2.png' alt='Example of expanded top-level cluster all the way to the last level with the metadata.'>
  <p align="center">Example of expanded top-level cluster all the way to the last level with the metadata.</p>
</div>

All news are grouped in two levels. First by their "semantic similarity" (they have content that covers similar topics), and then by their potential duplicates (they have the same content). All ranked by frequency (size of the top-level cluster). For each cluster a set of noun phrases is extracted and then displayed so the user can infer the content within each cluster of news.

Users can navigate the news by expanding the top-level (same topics) news and the second level news (duplicates). The last level of the tree contains metadata of the particular news and a link to access the full article from the source.

How does Newvelles work?
-----

At a very high level, the production version of Newvelles works in the following way:
1. Every 60 minutes, it triggers a python script that runs in [AWS Lambda](https://aws.amazon.com/lambda/) that fetches raw news data from a list of valid RSS feeds.
2. For every RSS news site, the job pulls all the latest news (filtering anything older than 14 days), processes it, and dumps it to [AWS S3](https://aws.amazon.com/pm/serv-s3/).
3. The processed news are consumed from S3 by a simple website hosted in [AWS Lightsail](https://lightsail.aws.amazon.com/) which then presents the content to end users.

You can definitely run it 100% locally (no need to have S3, AWS lambda, or AWS lightsail). You just need to follow the instructions in [Newvelles](https://github.com/glhuilli/newvelles) (the backend that fetches and processes all news) and launch the [Newvelles website](https://github.com/glhuilli/newvelles_web) (to navigate the data). You can also check each project's Dockerfile for more details on how to run them locally.

The "news grouping algorithm" uses a combination of semantic similarity and matching similarity. The semantic similarity uses the [Universal Sentence Encoder](https://arxiv.org/abs/1803.11175) to encode news titles into sentence embeddings used to find which other titles are close using simple similarity measures. The current implementation is using a pre-trained collection of embeddings available in [TensorHub](https://tfhub.dev/google/universal-sentence-encoder/2), particularly the [lite version](https://www.tensorflow.org/hub/tutorials/semantic_similarity_with_tf_hub_universal_encoder_lite). The matching similarity uses a very simple algorithm that transforms all encoded words from the sentence into a set. It then iteratively builds groups of very similar sentences based on how many common words (non-stopwords and stemmed) are shared between these sets.

TODO
-----

Several improvements can be done in future versions:
1. Better UX to navigate the news. For example, using size to change which noun phrases are most common within a particular cluster or improving the topic similarity algorithm (expanding it beyond just using the Universal Sentence Encoder).
2. Better matching algorithms to group duplicate news. Current matching algorithm is extremely simple.
3. Allow users to pick their own set of RSS news links to personalize which news they are interested in following. This might need users to keep on their own cache these preferences unless a user registration process is created.
4. News websites can be polarized and it's well understood which direction of the political spectrum they can lean. Adding this metadata to the RSS news list and then using it to label how different news clusters are distributed along the political spectrum (e.g., in terms of coverage) could be an interesting feature to explore.

You are more than welcome to take a stab and contribute in any of these topics. Pull requests are welcome!

{% if page.comments %}
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
