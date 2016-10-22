// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var searchresult = []
    var q = {}
    q['categories'] = [{field: 'ingredients', limit: 5}]
    q['pageSize'] =  10
    var filters = []
    var queryinput = ''
    var filterinput = ''

    return {
      searchresult,
      queryinput,
      q,
      filters
    }
  },
  ready: function() {
    this.search();
  },
  methods: {
    search: function() {
      var queryinput = this.queryinput.trim().toLowerCase()
      var queryinput = queryinput.split(" ")
      var filterinput = this.filterinput
      var q = this.q
      // query definition
      q['query'] = [{'AND': [{'*': queryinput }]}]
      //console.log('q object: ' + JSON.stringify(q, null, 4))
      // JSON stringify query object
      q = JSON.stringify(q)
      //console.log('Stringify q: ' + JSON.stringify(q, null, 4))
      // URI encode query object
      q = encodeURIComponent(q)
      //console.log('URIencode q: ' + JSON.stringify(q, null, 4))
      var url = 'http://oppskrift.klemespen.com:3030/'
      var endpoint = 'search?q='
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
    },
    filterOn: function(filternumber) {
      console.log('filter: ' + filternumber)
      var filters = this.filters
      console.dir(JSON.stringify(this.filters[filternumber]))
    }
  }
})
