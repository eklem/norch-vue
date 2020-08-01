<template>
  <h1>Hello Search</h1>
</template>

<script>
import si from 'search-index'

export default {
  name: 'SearchDefault',
  methods: {
    mounted() {
      console.log('Hello search component')
      si({ name: 'idxVue' }, (err, db) => {
        // db is guaranteed to be open and available
        db.PUT([{_id: 1}])
          .then(function (message) {
            console.log('message from put: ' + message)
          })
          .catch(function (err) {
            console.log('Error while indexing: \n' + err.message)
          })
      })
    }
  }
}
</script>

<style scoped>
</style>