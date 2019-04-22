// Defining the data model
const norchAdd = {}
const norchData = {}

const norchAddcontent = new Vue ({ 
  el: '#norch-addcontent',
  data: norchAdd
})

const norchSearchbox = new Vue ({ 
  el: '#norch-searchbox',
  data: norchData
})

const norchAutocomplete = new Vue ({ 
  el: '#norch-autocomplete',
  data: norchData
})

const norchFilters = new Vue ({
  el: '#norch-filters',
  data: norchData
})

const norchSearchresults = new Vue ({
  el: '#norch-searchresults',
  data: norchData
})