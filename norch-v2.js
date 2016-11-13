// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var url = 'http://oppskrift.klemespen.com:3030/'
    var endpoint = 'search?q='
    var searchresult = []
    var q = {}
    q['categories'] = [{field: 'ingredients', limit: 10}]
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
      // Send q to searcher
      console.log('Query in searchOn method: ' + JSON.stringify(this.q))
      this.searcher(q)
    },
    filterOn: function(filternumber) {
      console.log('filter# turned on: ' + filternumber)
      var q = this.q
      console.log('this.q: ' + JSON.stringify(q))
      var filters = this.filters
      var filter = this.filters[filternumber]
      if (!q.filter) {
        q['filter'] = []
      }
      q.filter.push(filter)
      // Send q to searcher
      this.searcher(q)
    },
    filterOff: function(filternumber) {
      var q = this.q
      console.log('Filter number: ' + filternumber)
      // Remove from searchresult.categories (removes it from GUI)
//      this.searchresult.categories[0].value.splice(filternumber, 1)
//      console.dir('Categories with active filter deleted: ' + JSON.stringify(this.searchresult.categories[0].value))
      // Remove from q.filter array. Get index, remove index
      console.log('q.filter: ')
      console.dir(JSON.stringify(q.filter))
      filterToRemove = this.filters[filternumber]
      console.dir(JSON.stringify(filterToRemove))
      //var index = q.filter.findIndex(filterToRemove)
      var keys = Object.keys(filterToRemove),
        index = q.filter.findIndex(a =>
          Object.keys(a).length === keys.length && keys.every(k => a[k] === filterToRemove[k]));
      console.log('index: ' + index)
      q.filter.splice(index, 1)
      console.log('q.filter, removed: ')
      console.dir(JSON.stringify(q))
      // Removing empty q.filter
      console.log(q.filter.length)
      if (q.filter.length === 0) {
        console.log('filter array empty, needs to be removed')
        delete q.filter
      }
      // Send q to searcher
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
        var searchresult = response.body
        Vue.set(vm, 'searchresult', searchresult)
        // set filters on wm
        console.dir(searchresult.categories)
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
        console.log('this.filters: ' + JSON.stringify(this.filters))
      }, (response) => {
        // handle error
        console.log('Some error in vue-resource GET request')
        console.log(response)
      })
    }
  }
})
