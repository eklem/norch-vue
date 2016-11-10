// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var url = 'http://oppskrift.klemespen.com:3030/'
    var endpoint = 'search?q='
    var searchresult = []
    var q = {}
    var queryinput = ''

    return {
      url,
      endpoint,
      searchresult,
      queryinput,
      q
    }
  },
  //For predefined queryiput, like "*"
  //ready: function() {
  //  this.search();
  //},
  methods: {
    searchOn: function() {
      // Trim query input
      var queryinput = this.queryinput.trim().toLowerCase()
      var queryinput = queryinput.split(" ")
      // Set local q from data function
      var q = this.q
      // Merge queryinput in query
      q['query'] = [{'AND': [{'*': queryinput }]}]
      // Send q to searcher
      console.log('Query in searchOn method: ' + JSON.stringify(this.q))
      this.searcher(q)
    },
    searcher: function(q) {
      // JSON stringify q object
      Vue.set(vm, 'q', q)
      q = JSON.stringify(q)
      // URI encode q object
      q = encodeURIComponent(q)
      console.log('Query in searcher method: ' + q)
      var url = this.url
      var endpoint = this.endpoint
      // GET request
      this.$http.get(url + endpoint + q).then((response) => {
        // set searchresult on vm
        Vue.set(vm, 'searchresult', response)
      }, (response) => {
        // handle error
        console.log('Some error in vue-resource GET request')
        console.log(response)
      })
    }
  }
})
