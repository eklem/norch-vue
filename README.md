# norch-vue
Vue.js frontend to the search engine [norch](https://github.com/fergiemcdowall/norch) / [search-index](https://github.com/fergiemcdowall/search-index). An easy way to get started with norch and test your dataset without much coding. (Will be without any coding at a later point in time)

[![Join the chat at https://gitter.im/fergiemcdowall/search-index][gitter-image]][gitter-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

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

For test-data we use the dataset [dataset-vinmonopolet](https://github.com/eklem/dataset-vinmonopolet).

### Starting norch
```console
norch -p 3030 -l silly -i norch-index
```

### Configuring norch-vue
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
http://[norch-url]:[port-number]/search?q={"pageSize":10,"query":{"AND":{"*":["*"]}}}
``` 

## Plans
* [x] First step is to make it talk to [`norch`](https://github.com/fergiemcdowall/norch) JSON API. Together with the [`search-index-indexer`](https://github.com/eklem/search-index-indexer) this will make people able to test their dataset without any coding.
* [ ] Second step is to make it run in the browser and be able to switch from using an external `norch` JSON API to an internal [`search-index`](https://github.com/fergiemcdowall/search-index) API after replicating the search index into local storage.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE
[npm-url]: https://npmjs.org/package/norch-vuejs-app
[npm-version-image]: http://img.shields.io/npm/v/norch-vuejs-app.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/norch-vuejs-app.svg?style=flat-square
[gitter-url]: https://gitter.im/fergiemcdowall/search-index?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter-image]: https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square
