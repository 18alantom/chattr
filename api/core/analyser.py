import torch
from pathlib import Path

PREFIX = "api/core"
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"

def _preprocess(text):
    # Replaces usernames and links with '@user' and 'http'
    new_text = []
    for t in text.split(" "):
        t = '@user' if t.startswith('@') and len(t) > 1 else t
        t = 'http' if t.startswith('http') else t
        new_text.append(t)
    return " ".join(new_text)

def _get_path(prefix="."):
    return (Path(prefix)/MODEL)

def _get_source_path(path):
    return path.as_posix() if path.exists() else MODEL

def _get_model():
    from transformers import AutoModelForSequenceClassification
    path = _get_path(f"{PREFIX}/model")
    model = AutoModelForSequenceClassification.from_pretrained(_get_source_path(path))
    if not path.exists():
        model.save_pretrained(path.as_posix())
    return model
    
def _get_tokenizer():
    from transformers import AutoTokenizer
    path = _get_path(f"{PREFIX}/tokenizer")
    tokenizer = AutoTokenizer.from_pretrained(_get_source_path(path))
    if not path.exists():
        tokenizer.save_pretrained(path.as_posix())
    return tokenizer

def _post_process(output):
    # Score format : ['negative', 'neutral', 'positive']
    scores = output[0][0].detach()
    return torch.nn.functional.softmax(scores, dim=0).cpu().tolist()

def _get_sentiment_scores(tweet, tokenizer, model):
    tweet = _preprocess(tweet)
    tokens = tokenizer(tweet, return_tensors="pt")
    output = model(**tokens)
    return _post_process(output)

def get_sentiment_scorer():
    tokenizer = _get_tokenizer()
    model = _get_model()
    return lambda tweet: _get_sentiment_scores(tweet, tokenizer, model)