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
        console.dir(JSON.stringify(categories))
        for(var category in categories){
          var filtersGroup = categories[category]
          console.log('Filters group: ')
          console.dir(JSON.stringify(filtersGroup))
          //Get out value from key: http://stackoverflow.com/questions/17635866/get-values-from-an-object-in-javascript
          for(key in filtersGroup) {
            if(filtersGroup.hasOwnProperty(key)) {
              var filters = filtersGroup[key];
              console.log('Filters: ')
              console.dir(JSON.stringify(filters))
              // loop through array?
            }
          }
        }
      }).catch(function (data, status, request) {
        // handle error
      })
      console.log('Filter input: ' + filterinput)
    },
    filterOn: function(filter) {
      //Add filter (on category/bucket)
      console.dir(filter)
    },
  }
})
