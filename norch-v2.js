// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  var url = 'http://oppskrift.klemespen.com:3030/'
  var endpoint = 'search?q='
  var searchresult = []
  var q = {}
  q['categories'] = [{field: 'ingredients', limit: 10}]
  q['pageSize'] =  10
  var filters = []
  //Keeping queryinput when resetting data
  if (typeof queryinput == 'undefined') {
    queryinput = ''
  }
  return {
    url,
    endpoint,
    searchresult,
    q,
    filters,
    queryinput
  }
}

// Vue instance
var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
  //For predefined queryiput, like "*"
  //ready: function() {
  //  this.search();
  //},
  methods: {
    // Start with data object from scratch: getDefaultData
    resetDataBut(keep) {
      var def = getDefaultData();
      def[keep] = this[keep];
      Object.assign(this.$data, def);
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
      q['query'] = [{'AND': [{'*': queryinput }]}]
      // Send q to searcher
      console.log('Query in searchOn method: ' + JSON.stringify(this.q))
      this.searcher(q)
    },
    // Applying category filter
    filterOn: function(filternumber) {
      var q = this.q
      var filters = this.filters
      var filter = this.filters[filternumber]
      if (!q.filter) {
        q['filter'] = []
      }
      q.filter.push(filter)
      // Send q to searcher
      this.searcher(q)
    },
    // Removing filter
    filterOff: function(filternumber) {
      var q = this.q
      // Remove from q.filter array. Get index, remove index
      filterToRemove = this.filters[filternumber]
      var keys = Object.keys(filterToRemove),
        index = q.filter.findIndex(a =>
          Object.keys(a).length === keys.length && keys.every(k => a[k] === filterToRemove[k]));
      q.filter.splice(index, 1)
      // Removing empty q.filter for norch to work
      if (q.filter.length === 0) {
        delete q.filter
      }
      // Send q to searcher
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
        // set searchresult on vm
        var searchresult = response.body
        Vue.set(vm, 'searchresult', searchresult)
        // set filters on wm
        var filtersfetched = []
        if (searchresult.categories) {
          var categories = searchresult.categories
          categories[0].value.map(function(val) {
            onefilter = {field: categories[0].key, gte: val.key, lte: val.key}
            filtersfetched.push(onefilter)
            return filtersfetched
          })
        }
        Vue.set(vm, 'filters', filtersfetched)
      }, (response) => {
        // handle error
        console.log('Some error in vue-resource GET request')
        console.log(response)
      })
    }
  }
})
