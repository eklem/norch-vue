// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: {
    searchresult: [],
    queryinput: '',
    filterinput: ''
  },
  ready: function() {
    this.search();
  },
  methods: {
    search: function() {
      var queryinput = this.queryinput.trim().toLowerCase()
      var queryinput = queryinput.split(" ")
      var filterinput = this.filterinput

      console.log('queryinput undef: ' + queryinput)
      // query definition
      var q = {}
      q['query'] = [{'AND': [{'*': queryinput }]}]
      q['categories'] = [{field: 'ingredients', limit: 5}]
      q['pageSize'] =  5
      console.log('q object: ' + JSON.stringify(q, null, 4))
      // JSON stringify query object
      q = JSON.stringify(q)
      console.log('Stringify q: ' + JSON.stringify(q, null, 4))
      // URI encode query object
      q = encodeURIComponent(q)
      console.log('URIencode q: ' + JSON.stringify(q, null, 4))
      var url = 'http://oppskrift.klemespen.com:3030/'
      var endpoint = 'search?q='
      // GET request
      this.$http.get(url + endpoint + q, function (data) {
        //this.$http.get('http://oppskrift.klemespen.com:3030/search?q=%7B%22query%22%3A%7B%22AND%22%3A%5B%7B%22*%22%3A%5B%22' + queryinput + '%22%5D%7D%5D%7D%7D', function (data) {
        // set data on vm
        this.$set('searchresult', data)
          //console.log(data)
      }).catch(function (data, status, request) {
        // handle error
      })
      console.log('Filter input: ' + filterinput)
    },
    filterOn: function(filterinput) {
      //Add filter (on category/bucket)
      
      console.dir(filterinput)
    },
    filterOff: function() {
      //Remove filter already added (on category/bucket
    }
  }
})
