// Default data: setup fielded search, filters, limits, etc.
function getDefaultData() {
  // Application configuration
  config = {
    'url': 'http://oppskrift.klemespen.com:3030/',
    'endpoint': {
      'search':          'search?q=',
      'matcher':         'matcher?q=',
      'categorize':      'categorize?q=',
      'buckets':         'buckets?q=',
      'docCount':        'docCount',
      'totalHits':       'totalHits?q=',
      'availableFields': 'availableFields'
    },
    'categories': [
      {'field': 'Varetype'},
      {'field': 'Land'}
    ],
    'buckets': [
      {
        'field': 'Volum',
        'gte':   '0.76',
        'lte':   '15',
        'set':   false
      },
      {
        'field': 'Volum',
        'gte':   '0',
        'lte':   '0.75',
        'set':   false
      }
    ]
  }
  // UI Helpers
  uiHelpers = {
    'pageSizeIncrease': 10,
    'filtered': {
      'categories': [],
      'buckets': []
    },
    'scrolled':         false,
    'totalHits':        '',
    'docCount':         '',
    'json': false
  }
  // query object
  q = {
    'pageSize': 10,
    'category': ''
  }
  // results back from norch
  results = {
    'searchresults': [],
    'categories':    []
  }
  queryinput = ''
  queryinputOld = ''
  // variables returned to vm
  return {
    config,
    uiHelpers,
    queryinput,
    queryinputOld,
    q,
    results
  }
}

// URL sync setup
//Vue.use(VueSync)
//locationSync = VueSync.locationStrategy()

/* Vue instance, defining the following methods:
   A: resetDataBut (to reset all data but queryinput) 
   B: searchOn: Transform user queryinput, create query object 'q', set it to data model and send to 'searcher'-method
   C: filterOn: Takes user filterinput, create a query object 'q', set it to data model and send to 'searcher'-method
   D: searcher: Takes q from various methods and query the different norch endpoints
   E: endlessScroll: increases 'pageSize' with 'pageSizeIncrease' and calls 'searcher' with new 'q'
   F: (not a method, but when page onLoad) mounted() window scroll event to endlessScroll method
   */
var vm = new Vue({
  el: '#app',
  data: getDefaultData(),
  methods: {
    // A: resetDataBut - Start with data object from scratch: getDefaultData
    resetDataBut(queryinput) {
      var def = getDefaultData()
      def[queryinput] = this[queryinput]
      Object.assign(this.$data, def)
    },
    // B: SearchOn - Take user input and send to searcher
    searchOn() {
      if (this.queryinput != this.queryinputOld) // Check if input has changed
      {
        var queryinput = this.queryinput
        this.resetDataBut(queryinput)
        Vue.set(vm, 'queryinput', queryinput)
        Vue.set(vm, 'queryinputOld', queryinput)
        var queryinput = (queryinput.trim().toLowerCase()).split(" ")
        var q = this.q
        console.log('queryinput: ' + queryinput)
        // Merge queryinput into query
        q['query'] = {'AND':{'*':queryinput}}
        // Send q to searcher
        console.log('Query in searchOn method: ' + JSON.stringify(this.q))
        this.searcher(q)
      }
    },
    // C: filterOn - Take user input on buckets or categories, transform and send to 'searcher' method
    filterOn(category, filterName, filterNumber) {
      console.log('This is the filterOn method.\nCategory: ' + category + '\nFiltername: ' + filterName + '\nIndex: ' + filterNumber)
      // get this.q and add key/value to query + this.uiHelpers.filtered.categories
      var q = this.q
      console.log(JSON.stringify(this.q.query.AND))
      var filterObj = {}
      filterObj[category] = [filterName]
      console.log(JSON.stringify(filterObj))
      // push query to category-array if it does exist
      if (q.query.AND.hasOwnProperty(category)) {
        console.log('key ' + category + ' exists in query: PUSHING')
        vm.q.query.AND[category].push(filterName)
      }
      // Set key (category) + [filtername] for object if doesn't exist
      if (!q.query.AND.hasOwnProperty(category)) {
        console.log('key ' + category + ' doesn\'t exists in query: SETTING')
        Vue.set(vm.q.query.AND, [category], [filterName])
      }
      // Add same info a little different in uiHelpers.filtered.categories-array
      var filteredObj = {category: category, filter: filterName}
      console.log(JSON.stringify(filteredObj))
      console.log(vm.uiHelpers.filtered.categories)
      vm.uiHelpers.filtered.categories.push(filteredObj)
      this.searcher(q) // Send q to searcher
    },
    // D: filterOff - Remove filter that is now filtered on (added to AND), transform and send to 'searcher' method
    filterOff(category, filterName) {
      console.log('In filterOff, category ' + category + ' and filter ' + filterName)
      var q = this.q
      // remove filter from query
      index = q.query.AND[category].indexOf(filterName)
      q.query.AND[category].splice(index, 1)
      console.log(JSON.stringify(q))
      // remove from uiHelpers.filtered.categories
      var searchTerm = {category: category, filter: filterName}
      console.log('searchTerm: ' + JSON.stringify(searchTerm))
      console.log('filtered:   ' + JSON.stringify(this.uiHelpers.filtered.categories[0]))
      var index = -1
      var data = this.uiHelpers.filtered.categories
      keys = Object.keys(searchTerm),
      index = data.findIndex(a =>
        Object.keys(a).length === keys.length && keys.every(k => a[k] === searchTerm[k]))
      console.log('index in filtered: ' + index)
      this.uiHelpers.filtered.categories.splice(index, 1)
      this.searcher(q)
    },
    // D: searcher - Actually querying norch
    searcher(q) {
      // Check if category configured and loop query categorize endpoint
      if (this.config.categories.length > 0) {
        console.log('filter in searcher: ' + this.config.categories.length)
        for (var i = 0; i < this.config.categories.length; i++) {
          var category = this.config.categories[i]
          console.log('Category: ' + JSON.stringify(category))
          var qCat = q
          qCat['category'] = category
          qCat = encodeURIComponent(JSON.stringify(qCat))
          queryStreamEndpoint(config.url + config.endpoint.categorize + qCat, 'categorize', category)
        }
      }
      q = encodeURIComponent(JSON.stringify(q))
      queryObjectEndpoint(this.config.url + this.config.endpoint.totalHits + q, 'totalHits')
      queryStreamEndpoint(this.config.url + this.config.endpoint.search + q, 'searchResult')
      queryObjectEndpoint(this.config.url + this.config.endpoint.docCount, 'docCount')
    },
    // E: Endless scroll - Adding more results when at bottom of page
    endlessScroll() {
      this.uiHelpers.scrolled = window.scrollY > 0
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        var q = this.q
        q['pageSize'] += this.uiHelpers.pageSizeIncrease
        this.searcher(q)
      }
    },
    availableFields() {
      queryStreamEndpoint(this.config.url + this.config.endpoint.availableFields, 'availableFields')
    },
    json() {
      if (this.uiHelpers.json === false) {
        Vue.set(vm.uiHelpers, 'json', true)
      }
      else {
        Vue.set(vm.uiHelpers, 'json', false)
      }
    }
  },
  // F: connects window scroll event and connects to endlessScroll
  mounted() {
    // Add event listener for scrolling
    window.addEventListener('scroll', this.endlessScroll)
  }
})


/* Helper functions for querying norch endpoints:
   A: Simple stream endpoints: /search, /matcher, /buckets and /categorize
   B: JSON object endpoints: /get, /totalHits and /docCount
   */

// A: stream endpoint querying
function queryStreamEndpoint(queryURL, queryType, fieldName) {
  axios.get(queryURL, {responseType: 'blob'})
    .then(function(response) {
      readBlob(response.data, function(event) {
        processStream(event.target.result, queryType, fieldName)
      })
    })
    .catch(function (error) {
      console.log(queryType + ': Some error in axios GET request')
      console.log(error)
    })
}

// B: JSON object endpoint querying
function queryObjectEndpoint(queryURL, queryType) {
  axios.get(queryURL, {responseType: 'text'})
    .then(function(response) {
      console.log(response.data)
      setData(response.data, queryType)
    })
    .catch(function (error) {
      console.log(queryType + ': Some error in axios GET request')
      console.log(error)
    })
}


/* Helper functions for processing the response and other small tasks
   A: Read blobs
   B: Process streams (of JSON objects to arrays of JSON objects)
   C: JSONstringify and URLencode q object */


// A: readBlob - Read blobs as text string
function readBlob(blob, onLoadCallback){
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(blob);
}

// B: processStream - Process streams of JSON objects into arrays of JSON objects
function processStream(response, queryType, fieldName) {
  // Regex to extract objects from stream and push to array
  const regex = /{.*}/g;
  let items
  var resultsetParsed = []
  while ((items = regex.exec(response)) !== null) {
    // To avoid infinite loops with zero-width matches
    if (items.index === regex.lastIndex) {
      regex.lastIndex++
    }
    items.forEach((match, index) => {
      //console.log('Found match for index ' + index + ': ' + match)
      resultsetParsed.push(JSON.parse(match))
    })
  }
  setData(resultsetParsed, queryType, fieldName)
}


/* setData - Switch for setting data in the data model */
function setData(resultsetParsed, queryType, fieldName) {
  switch (queryType) {
    case 'categorize':
      resultsetParsed.splice(0,1) // Removing *-filter
      var category = fieldName['field']
      var categoryObj = {}
      categoryObj[category] = resultsetParsed
      // Setting index to -1 and changing if category key is found in this.results.categories array
      var index = -1
      for (var i=0; i<this.results.categories.length; i++) {
        if (this.results.categories[i].hasOwnProperty(category)) {
          index = i
          console.log('We have a winner. Index is ' + i + ' for category ' + category)
          break
        }
      }
      // Preventing duplicate categories by overwriting/splicing
      if (index > -1) {
        console.log('Replacing categoryObj for index in array: ' + index)
        Vue.set(vm.results.categories, index, categoryObj)
      } 
      // Pushing categoryObj to categories when category doesn't exist
      else if (index === -1) {
        console.log('Index is -1, pushing categoryObj for: ' + category)
        this.results.categories.push(categoryObj)
      }
      break
    case 'searchResult':
      Vue.set(vm.results, 'searchresults', resultsetParsed)
      break
    case 'docCount':
      Vue.set(vm.uiHelpers, 'docCount', resultsetParsed.docCount)
      break
    case 'totalHits':
      Vue.set(vm.uiHelpers, 'totalHits', resultsetParsed.totalHits)
      break
    case 'availableFields':
      console.log('availableFields: ' + JSON.stringify(resultsetParsed))
      Vue.set(vm.uiHelpers, 'availableFields', resultsetParsed.availableFields)
      break
    default:
      console.log('Error: Wrong switch variable name for setData. Switch ' + queryType + ' don\'t exist')
  }
}
