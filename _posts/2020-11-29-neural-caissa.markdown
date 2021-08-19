---
layout: post
comments: true
title:  "Neural Caissa: Building a Chess bot with Deep Learning"
date:   2020-12-20
description: Fun little python project to teach a bot how to play Chess.
categories: Python, Javascript
keywords: Python, Backtracking, Minimax, ConvNets, Deep Learning, Chess, Games
thumbnail: /assets/posts/neural-caissa/neural-caissa-banner.png
banner: /assets/posts/neural-caissa/neural-caissa-banner.png
css:
  - /assets/posts/virtual-environments/virtual-env.css
invert: true
---

`Neural Caissa` is yet another attempt to build a neural network improved Chess bot (Caissa is the [goddess of Chess](https://en.wikipedia.org/wiki/Ca%C3%AFssa)). For more details on building and playing with the Chess bot or playing Chess puzzles, you can go to the [NeuralCaissa](https://github.com/glhuilli/neural_caissa) README and check the code available on Github.

<div class='got'>
  <img style="margin: 10px auto;" width="450" src='{{ site.baseurl }}/assets/posts/neural-caissa/chess-board.png' alt='Example of game between human vs NeuralCaissa.'>
  <p align="center">Game between human vs NeuralCaissa</p>
</div>

How does NeuralCaissa work?
-----

In a nutshell, the current version works as follows:

1. An initial board state is generated, and a valuator strategy is set ([code](https://github.com/glhuilli/neural_caissa/blob/f9620320795095d73e9288d44e50c6e32b37f01b/neural_caissa/app.py#L72)). The valuator will be used to compute the score for potential next states for the board.
2. Using a minimax algorithm with limited depth and alpha-beta pruning ([code](https://github.com/glhuilli/neural_caissa/blob/main/neural_caissa/ply/explore.py#L36)), a set of potential next states are explored ([code](https://github.com/glhuilli/neural_caissa/blob/main/neural_caissa/app.py#L53)). The valuator is used to compute the score for each state.  
3. The next state that has higher score is used as the next move ([code](https://github.com/glhuilli/neural_caissa/blob/main/neural_caissa/board/move.py#L19)).

The current `valuators` available are two: a baseline and a neural `valuator`. The baseline `valuator` is fairly simple but works surprisingly well. The current formula implemented is the following:

```
value = SUM(piece in white)
        - SUM(piece in black)
        + 0.1 * (White pieces mobility score)
        - 0.1 * (Black pieces mobility score)
```

The neural `valuator` is a scoring function trained using a deep learning model built in `PyTorch`. This scoring function is currently built using a series of ConvNets, which are then mapped into a rectified linear activation function (ReLU) and evaluated using a $$tanh \rightarrow [-1, +1]$$. The model was trained using `Adam` as optimizer, `MSE` as the loss function, mini-batches of size 256, and 100 epochs.

The input is determined by a very simple and naive serialization strategy: each state is represented as a tensor with binary variables (12 x (8 x 8) variables). For each piece $$k$$ ($$k \in [1, 12]$$), there's a 1 if piece $$k$$ is in position $$i$$ else 0 ($$i \in [1, 64]$$). The target label is either $$+1$$ or $$-1$$ depending on whether the player that is moving in given state won the game or not.

The data used to train this model was downloaded from [caissabase](http://caissabase.co.uk/). All the code used to pre-process and serialize ``caissabase`` (which is in the [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation)) is available in [NeuralCaissa](https://github.com/glhuilli/neural_caissa/blob/main/neural_caissa/data/generate.py).

A more detailed description of the model is summarized in the following table. The total number of parameters is fairly small.

```
----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Conv2d-1             [-1, 16, 8, 8]           1,744
            Conv2d-2             [-1, 16, 8, 8]           2,320
            Conv2d-3             [-1, 32, 3, 3]           4,640
            Conv2d-4             [-1, 32, 3, 3]           9,248
            Conv2d-5             [-1, 32, 3, 3]           9,248
            Conv2d-6             [-1, 64, 1, 1]          18,496
            Conv2d-7             [-1, 64, 2, 2]          16,448
            Conv2d-8             [-1, 64, 3, 3]          16,448
            Conv2d-9            [-1, 128, 1, 1]          32,896
           Conv2d-10            [-1, 128, 1, 1]          16,512
           Conv2d-11            [-1, 128, 1, 1]          16,512
           Conv2d-12            [-1, 128, 1, 1]          16,512
           Linear-13                    [-1, 1]             129
================================================================
Total params: 161,153
Trainable params: 161,153
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.03
Params size (MB): 0.61
Estimated Total Size (MB): 0.65
----------------------------------------------------------------
```

This model was **heavily** inspired by @geohot's [Twichchess](https://github.com/geohot/twitchchess).


TODOs
----

The following is a list of things I'd love to do in the future to improve the NeuralCaissa. You are more than welcome to try them out!

1. Speed up and/or distribute the serialization strategy for the Tensor representation 12x8x8 of the board's state. (currently it's about ~ 6it/s), which it's slow if you consider that the training data is about 10M of games (~38M iterations if you consider that, in average, there's 38 moves per game [[source](https://chess.stackexchange.com/questions/2506/what-is-the-average-length-of-a-game-of-chess#:~:text=The%20average%20number%20of%20moves%20per%20game%20is%20around%2038.)]). This would take ~73 days to process.   
2. Improve space search strategy when running the Minimax algorithm beyond just using the alpha-beta pruning strategy (@geohot in Twitchchess mentions using [Beam search](https://medium.com/@dhartidhami/beam-search-in-seq2seq-model-7606d55b21a5) for this).
3. Implement a MuZero style strategy to learn how to play Chess from the entire games, instead of relying on the minimax backtracking algorithm to find the best next move (maybe something like [this](https://medium.com/applied-data-science/how-to-build-your-own-muzero-in-python-f77d5718061a))   
4. Improve the ChessConvNet structure, so it's better suited for Chess. Currently it's a very straightforward stack of ConvNets, and most likely not using the best representation. For example, I think that it can be particularly improved by using a different loss function (I personally like the loss function proposed by @erikbern in his [deep-pink implementation](https://github.com/erikbern/deep-pink)).  
5. Improve the serialization strategy as the current one is extremely simple and naive. For example, in the current serialization strategy there basically no specific difference between a pawn and a queen.
6. Improve minimax algorithm moving from depth-limited search to probability-limited search (similar to what was done in [Giraffe](https://arxiv.org/pdf/1509.01549.pdf)). Note that there's a pretty interesting serialization strategy in the Giraffe paper that accounts for ~300 features for a given board state.
7. Maybe a simple Q-learning version might also be interesting to explore (Apparently, in [this Kaggle](https://www.kaggle.com/arjanso/reinforcement-learning-chess-3-q-networks#Reinforcement-Learning-Chess) set of scripts, there's something that could be useful).
8. Consider using the Piece Square Tables used in [Sunfish](https://github.com/thomasahle/sunfish) (also described in this [blog post](https://dev.to/zeyu2001/build-a-simple-chess-ai-in-javascript-18eg)).
9. [Chess2Vec](https://www.berkkapicioglu.com/wp-content/uploads/2020/07/chess2vec_long.pdf) could be used as a better vectorial representation than the current naive bit-board strategy used to train the deep learning model.
10. In [Shannon's work](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf) to teach computers to play Chess, he proposes an interesting equation that might be a better (and more complete) baseline for the valuator (more info in this [Stanford project](http://snap.stanford.edu/class/cs224w-2013/projects2013/cs224w-023-final.pdf)).


A note on Chess Puzzles
----

Besides playing Chess against the bot, you can also play "Chess puzzles", where given a file with existing games, it renders a game two movements before checkmate for you to finish. If you can't finish in the two moves, you'll be able to keep playing with the computer from that point forward. For now, a pre-loaded set of games are loaded by default, but you can modify the code to include your own collection of games.


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
