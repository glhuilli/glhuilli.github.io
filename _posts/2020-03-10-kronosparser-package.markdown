---
layout: post
comments: true
title:  "kronosparser: Python package for parsing time from text"
date:   2020-03-10
description: Python package for parsing time from text
categories: Python
keywords: Python, NLP, Parsing Expression Grammar, Parser
thumbnail: /assets/posts/limbic/github-banner.png
banner: /assets/posts/limbic/github-banner.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

This post contains a few basic examples of how to use the [kronosparser](https://github.com/glhuilli/kronosparser) package. I particularly don't like the name, but it's descriptive enough so people know what it does. This post is just an extended version of the readme document available in Github.

## Why building this package?

I build this package together with [@roalonso](https://github.com/roalonso) back in the Sudo Technology, Inc. days, which we decided to open source. The main use case was when receiving input messages from users via the Sudo chatbot, we needed to extract some metadata from text (in particular dates), which were then used to decide the upcoming actions that the chatbot had to do.

With this package you can parse any type of time instance from text and translate it into a `date`, `datetime`, or time interval. This could be for either future dates or past dates, and you can set the timezone if available.

This package is based on a Parsing Expression Grammar defined using `pyparsing`. If you have any comments feel free to create issues or send pull requests in the Github repository.

## Installing the package

In the meantime, while I finish adding this as a ``pypi`` package, you can install it directly
from the Github repository, as shown below,


```
pip install git+https://github.com/Zapship/kronosparser.git
```

## Usage

To use it you need to import the parse_dates method. There are 3 parameters you can define, besides the input text for your parsing use case:

1. future: which states whether you are parsing a text that is supposed to be in the future or the past (particularly helpful for chatbots that asks users questions frame in the past or the future)
2. interval_to_date: useful when you have an interval, but you want to just pick a date (usually the closest date).
3. timezone: the timezone you want to use for your specific use case.

A very simple example on how this package can be used is the following:

<script src="https://gist.github.com/glhuilli/5880d1d281d2cc1bc19cef0de5b494eb.js"></script>

```
[{'end': 21,
      'parsed': {'datetime': '2020-03-11 14:20:38-07:00'},
      'start': 18,
      'text': 'now'},
     {'end': 39,
      'parsed': {'datetime': '2020-03-12 12:00:00'},
      'start': 26,
      'text': 'tomorrow noon'},
     {'end': 53,
      'parsed': {'interval': {'end': '2020-03-22', 'start': '2020-03-16'}},
      'start': 44,
      'text': 'next week'}]
```

Note that the example above has 3 types of identified instances: a `datetime` with timezone, a `datetime` without timezone, and a time interval.

Another simple example is just `tomorrow`, which is parsed into a `date` format without timezone.

<script src="https://gist.github.com/glhuilli/822bfa82b56f4eba9ac00a63ee3049bf.js"></script>
```
[{'end': 29, 'parsed': {'date': '2020-03-12'}, 'start': 21, 'text': 'tomorrow'}]
```

The following example shows how the `future` flag option works. If you parse an input with a date (e.g. `friday`) with the `future` option set `True`, it will find the closest instance of the date in the future.

<script src="https://gist.github.com/glhuilli/50dba909c8e9b00942a3b45e007303d9.js"></script>
```
[{'end': 6, 'parsed': {'date': '2020-03-13'}, 'start': 0, 'text': 'friday'}]
```

However, if you use the `future` flag set to `False`, it will find the closest instance of the date, but in the past.

<script src="https://gist.github.com/glhuilli/fc079927716e3e74e1478b23c1fed5bd.js"></script>
```
[{'end': 6, 'parsed': {'date': '2020-03-06'}, 'start': 0, 'text': 'friday'}]
```

Very important to note that if you don't define the ``timezone``, it will use ``US/Pacific`` by default. Also, if no parameters are specified, it will use ``future`` as ``False`` and ``interval_to_date`` as ``True``. Many more examples are available in the package's [test cases](https://github.com/glhuilli/kronosparser/tree/master/tests).

Let me know if this package is useful and/or you'd like to see it as an official `pypi` package, which I plan to do at some point. This way I can prioritize that item from my never ending TODO list.


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
