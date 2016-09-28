// setup fielded search, filters, limits, etc.
var vm = new Vue({
  el: '#app',
  data: function() {
    var a = {b: 1, c: 'hello'}
    var test = a
    return {
      test
    }
  },
  methods: {
    send: function(argument) {
      console.log(JSON.stringify(argument))
    }
  }
})
