# norch-vuejs-app
Vue.js frontend to the search engine norch/search-index. An easy way to get started with norch and test your dataset without much coding. (Will be without any coding at a later point in time)

## Test it right away on Codepen.io
[norch-vuejs-app@codepen.io](http://codepen.io/eklem/pen/YNyrMo)

## Install
```console
npm install -g norch
npm install search-index-indexer norch-vuejs-app
```

## Setup

### Getting the data
```console
node node_modules/search-index-indexer/index.js -c -d https://raw.githubusercontent.com/eklem/dataset-vinmonopolet/master/dataset-vinmonopolet-sparkling.str
mkdir norch-index
mv si/ norch-index/data
```

### Starting norch
```console
norch -p 3030 -l silly -i norch-index
norch -i [search-index-folder] -c http://[norch-vuejs-frontend]
```

### Configuring norch-vuejs-app
norch.js starts with defining a data model. Part of it is the config-stuff. Point it to the `url` of your norch instance, and setup cateories (fields you want to filter on).
```javascript
// Application configuration
  config = {
      'url': 'http://oppskrift.klemespen.com:3030/',
      'endpoint': {
        'search': 'search?q=',
        'matcher': 'matcher?q=',
        'categorize': 'categorize?q=',
        'buckets': 'buckets?q=',
        'docCount': 'docCount',
        'totalHits': 'totalHits?q='
      },
      'categories': [{
        'field': 'Varetype'
      }]
    }
```

I'm using Apache to deliver the page, but that's just me. User your preferred webserver to deliver index.html and norch.js and you're ready to play.

### Vue devtools
Google Chrome is the preferred browser when developing because it has a working devtool for Vue: [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 

## Plans
* [x] First step is to make it talk to [`norch`](https://github.com/fergiemcdowall/norch) JSON API. Together with the [`search-index-indexer`](https://github.com/eklem/search-index-indexer) this will make people able to test their dataset without any coding.
* [ ]Second step is to make it run in the browser and be able to switch from using an external `norch` JSON API to an internal [`search-index`](https://github.com/fergiemcdowall/search-index) API after replicating the search index into local storage.
