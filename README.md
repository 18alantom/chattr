# chattr
It's a twitter sentiment thing.

![chattr operation](ss/chattr.gif)

## Basically does this

1. Scrapes tweets using [twint](https://github.com/twintproject/twint).
2. Passes the scraped tweets through [roBERTa ](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment), ([Hugging Face](https://github.com/huggingface/transformers) 🤗), this gives sentiment probabilities.
3. All of the above is served using [FastAPI](https://fastapi.tiangolo.com/).

## Other than that
- Front end is built using [React](https://reactjs.org/), a bit of [Material-UI](https://material-ui.com/).
- Data served by the API is plotted using [Chart.js](https://www.chartjs.org/).
    
---

## Running It
Steps for getting the code to do what's in the gif.

### API Server
#### Installing Dependencies
- Install the dependencies in `api/requirements.txt`
- For `torch` I suggest following the steps [here](https://pytorch.org/get-started/locally/).
- Also if `twint` doesn't install properly using `pip`, use `pip3 install --upgrade -e git+https://github.com/twintproject/twint.git@origin/master#egg=twint`, this worked for me.

#### Running the api server
- `uvicorn api.main:app --reload` from the root of this repo.

If Hugging Face throws an [error](https://github.com/huggingface/transformers/issues/4336) then rename files in `api/core/model` to:
```
model
└── cardiffnlp
    └── twitter-roberta-base-sentiment
        ├── config.json
        └── pytorch_model.bin
```
and files in `api/core/tokenizer` to:
```
tokenizer
└── cardiffnlp
    └── twitter-roberta-base-sentiment
        ├── config.json
        ├── merges.txt
        ├── special_tokens_map.json
        └── vocab.json
```
*Note: these files are downloaded when the server runs.*

### Frontend
- `npm install` to install the dependencies.
- `npm start` to serve the frontend.
---

## Few more things
- API server should be served from port `http://localhost:5000` and frontend server from `http://localhost:3000`.
- **Impact** is calculated using *likes*, *retweets*, and *replies*.
- This was done without much thought, more of an exercise than a project, not meant to be serious so a more than a few things may be broken.
- Tweet scores aren't aggregated, it would be more meaningful if it was. 