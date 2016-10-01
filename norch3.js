// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var searchresult = []
    var q = {}
    q['categories'] = [{field: 'ingredients', limit: 5}]
    q['pageSize'] =  5
    var filters = []
    var queryinput = ''
    var filterinput = ''

    return {
      searchresult,
      queryinput,
      q
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

      console.log('queryinput undef: ' + queryinput)
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
        // set data on vm
        this.$set('searchresult', data)
        //console.log(data)
        // Here should the filters be defined and set
        //console.dir(JSON.stringify(this.searchresult.categories, null, 4))
        
        // Do it like this: http://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
        // Or check out how to loop within loop
        var categories = this.searchresult.categories
        var filtersfetched = []
        categories[0].value.map(function(val) {
          onefilter = {field: categories[0].key, gte: val.key, lte: val.key}
          filtersfetched.push(onefilter)
          return filtersfetched
        })
        console.log(JSON.stringify(filtersfetched))
      }).catch(function (data, status, request) {
        // handle error
      })
    }
  }
})
