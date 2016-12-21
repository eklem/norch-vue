// fetch() returns a promise that
// resolves once headers have been received

fetch('http://oppskrift.klemespen.com:3030/search?q=%7B%22query%22%3A%7B%22AND%22%3A%7B%22Varenavn%22%3A%5B%22champagne%22%5D%7D%7D%7D', {method: 'GET', mode: 'cors'})
.then(response => {
  // response.body is a readable stream.
  // Calling getReader() gives us exclusive access to
  // the stream's content

  var decoder = new TextDecoder()
  var reader = response.body.getReader()
  var data = ''

  // read() returns a promise that resolves
  // when a value has been received
  reader.read().then(function processResult(result) {
    if (result.done) {
      console.log(data)
      // ### Here you set the data in the data model in VUE ###
      return
    }
    data += decoder.decode(result.value, {stream: true})

    // Read some more, and recall this function
    return reader.read().then(processResult)
  })
})
