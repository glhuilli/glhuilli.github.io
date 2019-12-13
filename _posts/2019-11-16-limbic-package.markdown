---
layout: post
comments: true
title:  "Limbic: Python package for emotion analysis from text"
date:   2019-04-10
description: Python package for emotion analysis from text
categories: Python
keywords: Python, NLP, Deep Learning, Multi-label Classifier
thumbnail: /assets/posts/limbic/github-banner.png
banner: /assets/posts/limbic/github-banner.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

This post contains a few basic examples of how to use the `limbic` package. First, a quick overview of the lexicon-based classifier is described, and then a few notes on how a machine learning model was trained and how it can be used to predict the emotions for a given text.


## Why building this package?

The objective of this package is simple: If you need to compute some emotion analysis on a word or a set of words this should be able to help. For now, it only supports plain text and subtitles, but the idea is to extend it to other formats (pdf, email, among other formats). In the meantime, this includes a basic example on how to use it on plain text and another example on how to use it in a collection of subtitles for series (all episodes for all seasons of a show). The name of the package is based on the limbic system, which is a set of brain structures that support different functions, like emotions or behavior among others.

In this package, there are two strategies to compute the emotions:

1. Via lexicon-based word matching, which is quite straightforward and examples of its usage are described below.
2. Via a multi-label machine learning classifier trained with the specific purpose of identifying emotions and their strength in full sentences.

Limbic also has a set of tools that are easy to reuse and extend for different use cases. For example, contains tools for the analysis of subtitles in a show, but can be easily extended to analyze books, papers, websites, customer reviews, or even further applications like comparing a movie script with its book, comparing properties of movies in a sequel, among others.



## Installing the package

In the meantime, while I finish adding this as a pypi package, you can install it by building the source code from the repository by first installing all the dependencies from the requirements.txt file and the dependencies for Spacy, the NLP framework used through this package. However, it might be easier to use `pip install` directly from the Github repository, as shown below, 

```
pip install git+https://github.com/glhuilli/limbic.git
python -m spacy download en_core_web_sm
```

## Importing a lexicon-based emotion classifier

The only thing you need to create a new lexicon-based emotion classifier is, of course, the lexicon. However, in case you are dealing with a specific context, it's possible to use a terms mapping dictionary,  which will automatically replace terms on the input you want to process.

The lexicon has to be loaded by the user, and it could be either a custom lexicon or a [lexicon from the NRC](http://saifmohammad.com/WebPages/AccessResource.htm). To load a lexicon, you can either use a generic `load_lexicon` or `load_nrc_lexicon` tailored for some NRC lexicons.

To use the generic `load_lexicon` method you can do the following:

<script src="https://gist.github.com/glhuilli/447690ef2b498a49d6b9f5c025dc9f4c.js"></script>

<!-- ```python
from limbic.emotion.utils import load_lexicon

my_lexicon_file_path = '../data/my_lexicon.csv'
lexicon = load_lexicon(my_lexicon_file_path)
``` -->

where the hypothetical file `../data/lexicon.csv` is a `csv` file with the header `term,emotion,score`.

To use the `load_nrc_lexicon` method, you need to download one of the supported NRC files and do

<!-- ```python
from limbic.emotion.nrc_utils import load_nrc_lexicon

nrc_lexcon_file_path = '../data/lexicons/NRC-AffectIntensity-Lexicon.txt'
lexicon = load_nrc_lexicon(nrc_lexicon_file_path, 'affect_intensity')
``` -->

<script src="https://gist.github.com/glhuilli/6d05e46c08218c3b3efb07b6cb6ad7fd.js"></script>


The supported files are the `affect_intensity` lexicon, the `emotion` lexicon (aka `EmoLex`), and the `vad` lexicon.

Once the lexicon is ready, you can create the `LexiconLimbicModel`,

<script src="https://gist.github.com/glhuilli/13c6eb1f3b9bad28b8184c6ea7c9f6b8.js"></script>

Also, there's an option to use a `terms mapping` dictionary has to be of type `Dict[str, str]`, where a given term or collection of terms will be mapped to another term of collection of terms when computing the emotions. This is specifically helpful for texts with a specific context that you would like to include in the model. This is specifically helpful for texts with a specific context that you would like to include in the model. An example of this included below (check out [this example](https://glhuilli.github.io/got-analysis.html) to use a mapping dictionary).

### Important note

In case you are using NRC lexicons, you need to know that there are some constraints about using them for profit. Please refer to the NRC website for more information on how to notify and work with their data. Otherwise, you are free to use limbic however you want under the MIT license.


### Emotions from Terms


Once the `limbic` model is loaded, you can either get the emotions that either a single term or a full-sentence has. For example, you can get the emotions associated with the word `love` or `hate`. Alternatively, you can get the emotions associated with `not love` and `not hate`, which is passing an `is_negated` parameter to the method.

For each term, a list of `Emotion` named tuples is returned. Each `Emotion` has the fields `category`, which indicates one of the motions that the term has been assigned, a `value` that quantifies how strong the emotion category has been assigned to the term, and the `term`. This term in case the method is called with `is_negated=True`, has a dash as a prefix, e.g., `term=love, is_negated=True` will generate an `Emotion` with `term=-love`.

<script src="https://gist.github.com/glhuilli/78641312fb741eb30579d5d2a906d180.js"></script>

<!-- ```python
print('-'* 50)
print('Emotions for love, hate, not love, and not hate.')
print('-'* 50)
for term in ['love', 'hate']:
    print(f'{term} -> {lb.get_term_emotions(term)}')
for term in ['LOVE', 'Hate']:
    print(f'{term} (negated) -> {lb.get_term_emotions(term, is_negated=True)}')
``` -->

```

    --------------------------------------------------
    Emotions for love, hate, not love, and not hate.
    --------------------------------------------------
    love -> [Emotion(category='joy', value=0.828, term='love')]
    hate -> [Emotion(category='anger', value=0.828, term='hate'),
              Emotion(category='fear', value=0.484, term='hate'),
              Emotion(category='sadness', value=0.656, term='hate')]
    LOVE (negated) -> [Emotion(category='sadness', value=0.828, term='-love')]
    Hate (negated) -> [Emotion(category='fear', value=0.828, term='-hate'),
                        Emotion(category='anger', value=0.484, term='-hate'),
                        Emotion(category='joy', value=0.656, term='-hate')]
```

### Negated terms

The categories supported for the `is_negated` parameter are the ones included in the [Plutchik's wheel of emotions](https://en.wikipedia.org/wiki/Contrasting_and_categorization_of_emotions), shown below (source: Wikipedia)

<img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Plutchik-wheel.svg" alt="Drawing" style="width: 450px;"/>


Here, each emotion is placed in a wheel where any emotion is facing its "opposite" on the other side. For example, `joy` is on the opposite side of `sadness`, `rage` to `terror`, and so on. When terms are negated, the opposite emotion will be used. For example, `love` has an emotion of `joy` with score `0.828` (following the NRC `affect_intensity` lexicon). Then `love` negated will have an emotion of `sadness` with score `0.828`.

### Emotions for sentences

Like getting the emotions of a term, `limbic` has a method for getting the emotions for full or partial sentence. This is supported by the fact that each sentence has multiple terms, which some of them could have one or multiple emotions. Note that, in some cases, a sentence could have some negated terms that need to be considered. Some examples of how to process sentences and the expected output are presented below.

<!-- ```python
sentence = 'I love and enjoy this string.'

lb.get_sentence_emotions(sentence)
``` -->

<script src="https://gist.github.com/glhuilli/08a86825885b9be650b376ad0ef184da.js"></script>

```

    [Emotion(category='joy', value=0.828, term='love'),
     Emotion(category='joy', value=0.812, term='enjoy')]
```

Then you can try checking a sentence with negated terms,

<!-- ```python
sentence = "I don't love but I enjoy this string."

lb.get_sentence_emotions(sentence)
``` -->

<script src="https://gist.github.com/glhuilli/2d5c462d633560f1b39af1c3147b7b14.js"></script>


```

    [Emotion(category='sadness', value=0.828, term='-love'),
     Emotion(category='joy', value=0.812, term='enjoy')]
```

Now, if you try to get the emotions from the following sentence without context, you can get unexpected results,


<!-- ```python
sentence = "I don't love but I enjoy this sentence."

lb.get_sentence_emotions(sentence)
``` -->

<script src="https://gist.github.com/glhuilli/f85932099e2e7f0cdd2b1b586c6eff91.js"></script>

```

    [Emotion(category='sadness', value=0.828, term='-love'),
     Emotion(category='joy', value=0.812, term='enjoy'),
     Emotion(category='anger', value=0.203, term='sentence'),
     Emotion(category='fear', value=0.266, term='sentence'),
     Emotion(category='sadness', value=0.234, term='sentence')]
```


### Emotions using the terms mapping

Note that in the last example `I don't love but I enjoy this sentence`, the word `sentence` could be placed under two different contexts: `sentence` as in a set for words or `sentence` as in punishment.

If you are under the context that `sentence` is just a collection of words, you can use the `terms_mapping` when defining the `limbic` object.


<!-- ```python
terms_mapping = {'sentence': 'string'}
lb = LexiconLimbicModel(lexicon, terms_mapping=terms_mapping)

sentence = "I don't love but I enjoy this sentence."

lb.get_sentence_emotions(sentence)
``` -->

<script src="https://gist.github.com/glhuilli/2a05a110fdb53cb3b0db024150633f7f.js"></script>


```

    [Emotion(category='sadness', value=0.828, term='-love'),
     Emotion(category='joy', value=0.812, term='enjoy')]
```


## Using a Machine Learning model for Emotion Analysis

Similar to the example above, using a lexicon-based model, this is just a quick walkthrough to understand how to load and use the machine learning model built in Tensorflow, which is included in the `limbic` package.


First, you need to understand the constraints and limitations of the model:
1. It was built only for a very narrow set of emotions (called Affection Emotions in limbic), which are "joy", "sadness", "anger", and "fear".
2. Using a synthetic dataset created using the lexicon-based model from a very particular dataset (top ~90 full books from different websites), a bidirectional RNN combined with a CNN was trained to predict multiple emotions as a multi-label classification problem. As future work, I'll add a section on how the network was decided step by step and the reasons for some of the decisions I took when defining the layers' parameters. Now you can see this in [the code itself](https://github.com/glhuilli/limbic/blob/master/limbic/emotion/models/tf_limbic_model/utils.py#L104), where I added as many comments as I could for each step of the network construction code.
3. Note that given that the data used to train was generated by using the lexicon-based model, this means that any biases that could come from that model will be included in the resulting trained model.
4. Emotions were not computed using any context disambiguation. Any unfortunate relationship associated with the lexicon-based model could be included in the ML trained model.
5. Parameters for the ML model were not tweaked with the full extent of hyper-parameter optimization, which means that it might not be the best version of itself. The same goes for the benchmark experiments with other models (FastText and Scikitlearn-based models). This is part of the future work still needed for this model to perform optimally.
6. Negations are not being captured correctly in the training phase, so a full dive into why and what can be done to improve this, it's necessary and will be .considered as future work.

The general idea behind the definition of the model is the following:

1. Use the embeddings layer first leveraging a pre-trained layer (e.g., Glove in this case).
2. Create a bi-directional layer to capture contextual info from upstream and downstream directions.
3. Allow some drop-out to include some regularization into the model and avoid over-fitting.
4. Use a convolution layer to extract some relationships between the hypothesis from the previous layer.
5. Using a pooling layer (avg and max) to group and allow more signal encoding from previous convolutions.
6. Use the sigmoid activation function in the output layer for the multi-label problem.
7. Use binary cross-entropy loss function, which is well suited for the multi-label classification problem.

To use the model is fairly simple. All you need to do is to create a TfLimbicModel and pass down the sentence you want to extract the emotions from,

<!-- ```python
from limbic.emotion.models.tf_limbic_model import TfLimbicModel

tf_model = TfLimbicModel()  
tf_model.predict('I have a lot of joy and sadness')
``` -->
<script src="https://gist.github.com/glhuilli/82e1ca190c05041863479215ebb19d72.js"></script>
```

    array([0.53164005, 0.95961887, 0.11894947, 0.05770496], dtype=float32)
```

The output represents the probability that each emotion was found in the input sentence. I included in `limbic` a more expressive way of returning such probabilities by using the `get_sentence_emotions` method, where each emotion is mapped to the right probability of being included in the sentence,


<!-- ```python
tf_model.get_sentence_emotions('I have a lot of joy and sadness.')
``` -->
<script src="https://gist.github.com/glhuilli/e8269c12d52a6b11a8359e39616292a0.js"></script>
```

    [EmotionValue(category='sadness', value=0.53164005),
     EmotionValue(category='joy', value=0.95961887),
     EmotionValue(category='fear', value=0.11894947),
     EmotionValue(category='anger', value=0.057704955)]
```

Note that this works within the boundaries for a full sentence. If the sentence is larger than 150 words, then it will be clipped to the first 150 words, given how the input layer of the network was constructed.

Improving this model is an on-going work, and I'll be updating this post and the code accordingly. If you have any suggestions on how to improve it, please let me know! Contributions and comments are more than welcome.


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
