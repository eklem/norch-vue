# norch-vuejs-app
Vue.js frontend to the search engine [norch](https://github.com/fergiemcdowall/norch) / [search-index](https://github.com/fergiemcdowall/search-index). An easy way to get started with norch and test your dataset without much coding. (Will be without any coding at a later point in time)

## Try it right away on Codepen.io
[norch-vuejs-app@codepen.io](http://codepen.io/eklem/pen/YNyrMo)

## Install

```console
npm install -g norch
npm install search-index-indexer norch-vuejs-app
```

## Setup

### Getting the data
```console
node node_modules/search-index-indexer/index.js -c https://cdn.rawgit.com/eklem/search-index-indexer/master/config.json -d https://cdn.rawgit.com/eklem/dataset-vinmonopolet/master/dataset-vinmonopolet-sparkling.str
mkdir norch-index
mv data/ norch-index/
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
      'url': 'http://[norch-url]:[port-number]/',
      'endpoint': {
        'search': 'search?q=',
        'categorize': 'categorize?q=',
        'buckets': 'buckets?q=',
        'docCount': 'docCount',
        'totalHits': 'totalHits?q='
      },
      'categories': [{
        'field': '[filed-to-categorize-on]'
      }]
    }
```
More about the [norch endpoint API](https://github.com/fergiemcdowall/norch#api). Only a subset is supported by this app.

### Deliver the html-page
I'm using Apache to deliver the page, but that's just me. User your preferred webserver to deliver index.html and norch.js and you're ready to play.

## Development

### Vue devtools
Google Chrome is the preferred browser when developing because it has a working devtool for Vue: [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd). It will among other things, show you what's happening to your data object(s) in your app.

### Test quey objects on norch
When developing, it's good to check what norch supports and not, and what the response is. Test in you browser like this:
```URL
http://[norch-url]:[port-number]/search?q=%7B%22pageSize%22%3A10%2C%22category%22%3A%7B%22field%22%3A%22Land%22%7D%2C%22query%22%3A%7B%22AND%22%3A%7B%22*%22%3A%5B%22*%22%5D%7D%7D%7D
``` 

## Plans
* [x] First step is to make it talk to [`norch`](https://github.com/fergiemcdowall/norch) JSON API. Together with the [`search-index-indexer`](https://github.com/eklem/search-index-indexer) this will make people able to test their dataset without any coding.
* [ ] Second step is to make it run in the browser and be able to switch from using an external `norch` JSON API to an internal [`search-index`](https://github.com/fergiemcdowall/search-index) API after replicating the search index into local storage.
