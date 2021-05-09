# chattr
It's a twitter sentiment thing.

![chattr operation](ss/chattr.gif)

**Basically does this**

1. Scrapes tweets using [twint](https://github.com/twintproject/twint).
2. Passes the scraped tweets through [roBERTa ](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment), ([Hugging Face](https://github.com/huggingface/transformers) 🤗), this gives sentiment probabilities.
3. All of the above is served using [FastAPI](https://fastapi.tiangolo.com/).

**Other than that**
- Front end is built using [React](https://reactjs.org/), a bit of [Material-UI](https://material-ui.com/).
- Data served by the API is plotted using [Chart.js](https://www.chartjs.org/).
    
---

**Few more things**
- **Impact** is calculated using *likes*, *retweets*, and *replies*.
- This was done without much thought, more of an exercise than a project, not meant to be serious so a more than a few things may be broken.
- Tweet scores aren't aggregated, it would be more meaningful if it was.
    
**To Do**
- Add `requirements.txt`.
- Add something on how to run it.