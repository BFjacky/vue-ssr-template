var redis = require('redis')

var client = redis.createClient(6379, '127.0.0.1')
client.on('error', function(err) {
  console.log('Error ' + err)
})

module.exports = {
  getHtml(url) {
    const s = new Date()
    return new Promise(resolve => {
      client.get(url, (err, value) => {
        if (err) {
          resolve(null)
          return
        }
        console.log(`fetch from redis: ${Date.now() - s}ms`)
        resolve(value)
        return
      })
    })
  },
  setHtml(url, html) {
    client.set(url, html)
  },
  clearSomeKey(id) {
    client.set('/blog/', '')
    client.set('/blog', '')
    client.set(`/blog/page/${id}`, '')
  }
}
