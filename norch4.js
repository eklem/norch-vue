// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var url = 'http://oppskrift.klemespen.com:3030/'
    var endpoint = 'search?q='
    var searchresult = []
    var q = {}
    q['categories'] = [{field: 'ingredients', limit: 5}]
    q['pageSize'] =  10
    var filters = []
    var queryinput = ''

    return {
      url,
      endpoint,
      searchresult,
      queryinput,
      q,
      filters
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
      this.$set('q', q)
      // Send q to searcher
      this.searcher(q)
    },
    filterOn: function(filternumber) {
      console.log('filter: ' + filternumber)
      var q = this.q
      console.log('this.q: ' + JSON.stringify(q))
      var filters = this.filters
      var filter = this.filters[filternumber]
      q['filter'] = [filter]
      this.$set('q', q)
      // Send q to searcher
      this.searcher(q)
    },
    searcher: function(q) {
      // JSON stringify q object
      q = JSON.stringify(q)
      // URI encode q object
      q = encodeURIComponent(q)
      console.log('query in searcher method: ' + q)
      var url = this.url
      var endpoint = this.endpoint
      // GET request
      this.$http.get(url + endpoint + q, function (data) {
        // set searchresult on vm
        this.$set('searchresult', data)
        // set filters on wm
        var categories = this.searchresult.categories
        var filtersfetched = []
        categories[0].value.map(function(val) {
          onefilter = {field: categories[0].key, gte: val.key, lte: val.key}
          filtersfetched.push(onefilter)
          return filtersfetched
        })
        this.$set('filters', filtersfetched)
        console.log('this.filters: ' + JSON.stringify(this.filters))
      }).catch(function (data, status, request) {
        // handle error
      })

    }
  }
})
