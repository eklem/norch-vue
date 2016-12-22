// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  // Keeping queryInput when resetting data and defining queryinput if not defined
  if (typeof queryinput != 'undefined') {
    console.log('getDefaultData - Hello queryInput: ' + queryinput)
  } else if (typeof queryinput == 'undefined') {
    queryinput = ''
    console.log('queryinput is not defined')
  }
  // Application configuration
  config = {
    'url': 'http://oppskrift.klemespen.com:3030/',
    'endpoint': {
      'search': 'search?q=',
      'matcher': 'matcher?q=',
      'categorize': 'categorize?q=',
      'buckets': 'buckets?q='
    },
    'categories': [
      'Varetype',
      'Land'
    ],
    'buckets': [
      {
        'field': 'Volum',
        'gte': '0.76',
        'lte': '15',
        'set': false
      },
      {
        'field': 'Volum',
        'gte': '0',
        'lte': '0.75',
        'set': false
      }
    ]
  }
  // UI Helpers
  uiHelpers = {
    'scrolled': false
  }
  // query object
  q = {
    'pageSize': 10
  }
  // results back from norch
  results = {
    'searchresults':  [],
    'categories': []
  }
  // variables returned to vm
  return {
    config,
    uiHelpers,
    queryinput,
    q,
    results
  }
}

// URL sync setup
Vue.use(VueSync)
locationSync = VueSync.locationStrategy()

// Axios setup
Vue.prototype.$http = axios

// Vue instance
var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
  sync: {
    q: locationSync('q')
  },
  methods: {
    // Start with data object from scratch: getDefaultData
    resetDataBut: function() {
      Object.assign(this.$data, getDefaultData())
    },
    // Take user input and send to searcher
    searchOn: function() {
      // Trim query input
      var queryinput = this.queryinput
      this.resetDataBut(queryinput)
      Vue.set(vm, 'queryinput', queryinput)
      var queryinput = queryinput.trim().toLowerCase()
      var queryinput = queryinput.split(" ")
      // Get q from data function
      var q = this.q
      console.log('queryinput: ' + queryinput)
      // Merge queryinput into query
      q['query'] = {'AND':{'*':queryinput}}
      // Send q to searcher
      console.log('Query in searchOn method: ' + JSON.stringify(this.q))
      this.searcher(q)
    },
    // searcher: Actually querying norch
    searcher: function(q) {
      // JSON stringify q object
      Vue.set(vm, 'q', q)
      q = JSON.stringify(q)
      // URI encode q object
      q = encodeURIComponent(q)
      var config = this.config
      querySearchEndpoint(config.url + config.endpoint.search + q, 'searchResult')
    },
    // Endless scroll: Adding more results when at bottom of page
    endlessScroll: function() {
      this.uiHelpers.scrolled = window.scrollY > 0
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        var q = this.q
        q['pageSize'] += 10
        this.searcher(q)
      }
    }
  },
  mounted: function() {
    // Add event listener for scrolling
    window.addEventListener('scroll', this.endlessScroll)
    console.dir(JSON.stringify(this.q))
  }
})


/* Helper functions for querying norch endpoints
   /docCount
   /buckets
   /categorize
   /get
   /matcher
   /search
   /totalHits */

function querySearchEndpoint(queryURL, responseType) {
  // GET request
  axios.get(queryURL, {responseType: 'blob'})
    .then(function(response) {
      readBlob(response.data, function(event) {
        // use result in callback...
        processStream(event.target.result, responseType)
      })
    })
    .catch(function (error) {
      // handle error
      console.log('Some error in axios GET request')
      console.log(error)
    })
}

/* Helper functions for processing the response
   a: JSON object or stream (of JSON objects)
   b: Functions for setting the data in the data model */


// Process streams
function processStream(response, responseType) {
  // Regex to extract objects from stream and push to array
  const regex = /{.*}/g;
  let items
  var resultsetParsed = []
  while ((items = regex.exec(response)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (items.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    items.forEach((match) => {
      console.log(`Found match: ${match}`);
      resultsetParsed.push(JSON.parse(match))
    })
  }
  setData(resultsetParsed, responseType)
}

// reading blob as text string
function readBlob(blob, onLoadCallback){
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(blob);
}

// Switch for selecting correct data model setter
function setData(resultsetParsed, responseType) {
  switch (responseType) {
    case 'searchResult':
      Vue.set(vm.results, 'searchresults', resultsetParsed)
      break
    default:
      console.log('Error: Wrong switch variable name. Switch ' + responseType + ' don\'t exist')
  }
}
