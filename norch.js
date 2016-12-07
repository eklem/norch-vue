// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  var url = 'http://oppskrift.klemespen.com:3030/'
  var endpoint = 'search?q='
  var searchresult = []
  var q = {}
  q['pageSize'] =  10
  //Keeping queryinput when resetting data and defining queryinput if not defined
  if (typeof queryinput != 'undefined') {
    console.log('getDefaultData - Hello queryinput: ' + queryinput)
  } else if (typeof queryinput == 'undefined') {
    queryinput = ''
    console.log('queryinput undefined')
  }
  return {
    url,
    endpoint,
    searchresult,
    q,
    queryinput,
    scrolled: false
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
      var url = this.url
      var endpoint = this.endpoint
      // GET request
      this.$http.get(url + endpoint + q).then((response) => {
        // Regex to extract objects from stream and push to array
        const regex = /{.*}/g;
        let results
        var searchresult = []
        while ((results = regex.exec(response.body)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (results.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          // The result can be accessed through the `m`-variable.
          results.forEach((match) => {
            console.log(`Found match: ${match}`);
            searchresult.push(JSON.parse(match))
          })
          // set searchresult on vm
          Vue.set(vm, 'searchresult', searchresult)
        }
      }, (response) => {
        // handle error
        console.log('Some error in vue-resource GET request')
        console.log(response)
      })
    },
    // Endless scroll: Adding more results when at bottom of page
    endlessScroll: function() {
      this.scrolled = window.scrollY > 0
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
