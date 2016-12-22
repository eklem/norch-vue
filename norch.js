// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  // Application configuration
  config = {
    'url': 'http://oppskrift.klemespen.com:3030/',
    'endpoint': {
      'search':     'search?q=',
      'matcher':    'matcher?q=',
      'categorize': 'categorize?q=',
      'buckets':    'buckets?q=',
      'docCount':   'docCount',
      'totalHits':  'totalHits?q='
    },
    'categories': [
      'Varetype',
      'Land'
    ],
    'buckets': [
      {
        'field': 'Volum',
        'gte':   '0.76',
        'lte':   '15',
        'set':   false
      },
      {
        'field': 'Volum',
        'gte':   '0',
        'lte':   '0.75',
        'set':   false
      }
    ]
  }
  // UI Helpers
  uiHelpers = {
    'scrolled':  false,
    'totalHits': '',
    'docCount':  ''
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
  queryinput = ''
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

// Vue instance
var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
  sync: {
    q: locationSync('q')
  },
  methods: {
    // Start with data object from scratch: getDefaultData
    resetDataBut(queryinput) {
      var def = getDefaultData()
      def[queryinput] = this[queryinput]
      Object.assign(this.$data, def)
    },
    // Take user input and send to searcher
    searchOn() {
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
    searcher(q) {
      // JSON stringify q object
      Vue.set(vm, 'q', q)
      q = JSON.stringify(q)
      // URI encode q object
      q = encodeURIComponent(q)
      var config = this.config
      querySearchEndpoint(config.url + config.endpoint.search + q, 'searchResult')
    },
    // Endless scroll: Adding more results when at bottom of page
    endlessScroll() {
      this.uiHelpers.scrolled = window.scrollY > 0
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        var q = this.q
        q['pageSize'] += 10
        this.searcher(q)
      }
    }
  },
  mounted() {
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

function querySearchEndpoint(queryURL, queryType) {
  axios.get(queryURL, {responseType: 'blob'})
    .then(function(response) {
      readBlob(response.data, function(event) {
        processStream(event.target.result, queryType)
      })
    })
    .catch(function (error) {
      // handle error
      console.log('Some error in axios GET request')
      console.log(error)
    })
}

function queryDocCountEndpoint(queryURL, queryType) {
  axios.get(queryURL, {responseType: 'text'})
    .then(function(response) {
      setData(response.data, queryType)
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
function processStream(response, queryType) {
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
  setData(resultsetParsed, queryType)
}

// reading blob as text string
function readBlob(blob, onLoadCallback){
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(blob);
}

// Switch for selecting correct data model setter
function setData(resultsetParsed, queryType) {
  switch (queryType) {
    case 'searchResult':
      Vue.set(vm.results, 'searchresults', resultsetParsed)
      break
    case 'docCount':
      Vue.set(vm.uiHelpers, 'docCount', resultsetParsed)
      break
    default:
      console.log('Error: Wrong switch variable name. Switch ' + queryType + ' don\'t exist')
  }
}
