// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  // Keeping queryInput when resetting data and defining queryinput if not defined
  if (typeof queryinput != 'undefined') {
    console.log('getDefaultData - Hello queryInput: ' + queryinput)
  } else if (typeof queryinput == 'undefined') {
    queryinput = ''
    console.log('queryinput is not defined')
  }
  // Aplication configuration
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
    'searchresult':  [],
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
      // Set local q from data function
      var q = this.q
      console.log('queryinput: ' + queryinput)
      // Merge queryinput in query
      q['query'] = {'AND':{'*':queryinput}}
      // Send q to searcher
      console.log('Query in searchOn method: ' + JSON.stringify(this.q))
      this.searcher(q)
    },
    // searcher: Actually querying norch
    searcher: function(q) {
      console.log('Query in searcher method: ' + JSON.stringify(q))
      // JSON stringify q object
      Vue.set(vm, 'q', q)
      q = JSON.stringify(q)
      // URI encode q object
      q = encodeURIComponent(q)
      var config = this.config
      // GET request
      this.$http.get(config.url + config.endpoint.search + q).then((response) => {
        // Regex to extract objects from stream and push to array
        const regex = /{.*}/g;
        let items
        var searchresult = []
        while ((items = regex.exec(response.body)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (items.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          items.forEach((match) => {
            console.log(`Found match: ${match}`);
            searchresult.push(JSON.parse(match))
          })
          // set searchresult on vm
          Vue.set(vm.results, 'searchresult', searchresult)
        }
      }, (response) => {
        // handle error
        console.log('Some error in vue-resource GET request')
        console.log(response)
      })
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
