# norch-vuejs-app
Vue.js frontend to Norch and search-index. 

## Setup
`norch-vuejs-app` talks to a `[norch](/fergiemcdowall/norch)`-instance. Run it with something like:

```console
norch -i [search-index-folder] -c http://[norch-vuejs-frontend].com
```

## Plans
First step is to make it talk to [`norch`](https://github.com/fergiemcdowall/norch) JSON API. Together with the [`search-index-indexer`](https://github.com/eklem/search-index-indexer) this will make people able to test their dataset without any coding.

Second step is to make it run in the browser and be able to swith from using an external `norch` JSON API to an internal [`search-index`](https://github.com/fergiemcdowall/search-index) API after replicating the search index into local storage.
