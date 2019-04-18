---
layout: post
comments: true
title:  "Automatic activation of virtualenv (+ pyenv)"
date:   2019-03-03
description: Load virtualenv automatically whenever you move into a new folder
categories: Python, Bash
keywords: Bash, Python, virtualenv, pyenv
thumbnail: /assets/posts/virtual-environments/virtual-env-repeated2.png
banner: /assets/posts/virtual-environments/virtual-env-repeated2.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

There must be hundreds of alternatives for using Python virtualenv in a simple and clean way, but the following is by far the
one that I find most intuitive and easy to set up. The idea is simple. Each time you want to use a `virtualenv` in a project,
you need to:

1. Add to your folder a new two files:
  - 1.1. A .python-version file with the Python version you need.
  - 1.2. A .python-virtualenv file with the name of the virtual environment.
2. Switch to the project folder.
3. Done. Your environment is loaded for that particular project, and you are ready to go.

For this, you will need to have [pyenv](https://github.com/pyenv/pyenv) and [virtualenv](https://github.com/pypa/virtualenv)
installed in your development environment. Once that's done, you need to source the following `bash` script. Note that the `.python-version` is a `pyenv` requirement and all details related to its definition and usage can be found [[here](https://github.com/pyenv/pyenv)].

<script src="https://gist.github.com/glhuilli/c1af87bde701ede4d218bab829d3817e.js"></script>

This script works roughly as follows. First, it verifies the `.python-version` file which only contains
the version of python you want to use. For example,

```
$ cat .python-version
3.7.2
```

If `pyenv` is available and supports the python version you are intending to use, a `virtualenv` is then created
pointing to a `.python` folder within your projects home directory. The name of the `virtualenv` is defined in
the `.python-virtualenv` file, for example,

```
$ cat .python-virtualenv
my_python_project
```

If you want to use a given python version, the script will verify if it's available within `pyenv`. If not, then
it will prompt instructions on how to install it. Also, there are a few optimizations you might want to make to the
strategy (e.g. using only one config file, prompting more options, etc.) but this should be enough to get you ready
and set up to use Python virtual environments in an easy way.

You can use the script above in your development environment by sourcing it from your favorite bash/tcsh/zsh/other "autoloading" script (e.g. your `.bash_profile` or your `.zshrc`, etc.). Save the file locally (e.g. in `~/.development_scripts/python_env_load.sh`). Finally, I strongly suggest adding the following environment variables to your system so you make sure that anything
you install is within a `vitualenv`. Both the source of the script and the `pip` environment variables together would look like this:

<script src="https://gist.github.com/glhuilli/3a1245fa37644766b47e6a1420e8cbbf.js"></script>

Special thanks to [@rzilleruelo](https://github.com/rzilleruelo) for coming up with the first versions of this `virtualenv+pyenv` bash script.

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
