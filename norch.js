// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  // Aplication configuration
  var config = {}
  config.url = 'http://oppskrift.klemespen.com:3030/'
  config.endpoint = {}
  config.endpoint.search = 'search?q='
  config.endpoint.matcher = 'matcher?q='
  config.endpoint.categorize = 'categorize?q='
  config.endpoint.buckets = 'buckets?q='
  config.categories = ['Varetype', 'Land']
  config.buckets = [
    {"field":"Volum","gte":"0.76","lte":"15","set":false},
    {"field":"Volum","gte":"0","lte":"0.75","set":false}
  ]
  // UI Helpers
  var UIHelpers = {}
  UIHelpers.scrolled = false
  //Keeping queryInput when resetting data and defining queryinput if not defined
  if (typeof queryinput != 'undefined') {
    console.log('getDefaultData - Hello queryInput: ' + queryinput)
  } else if (typeof queryinput == 'undefined') {
    queryinput = ''
    console.log('queryinput undefined')
  }
  // q-object fed to norch
  q = {}
  q['pageSize'] =  10
  // results back from norch
  var results = []
  results['searcresult'] = []
  results['categories'] = []

  return {
    config,
    UIHelpers,
    queryinput,
    q,
    results
  }
}

// Vue instance
var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
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
    //{"query":{"AND":{"*":["champagne"]}}}
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
      this.UIHelpers.scrolled = window.scrollY > 0
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
    window.addEventListener('scroll', this.endlessScroll);
  }
})
