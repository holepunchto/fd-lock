const test = require('brittle')
const fs = require('fs')
const FDLock = require('.')

test('basic', async (t) => {
  const fd = await open('package.json')

  const lock = new FDLock(fd)

  await t.execution(lock.ready())
  await t.execution(lock.close())
})

function open(path) {
  return new Promise((resolve, reject) =>
    fs.open(path, (err, fd) => (err ? reject(err) : resolve(fd)))
  )
}
