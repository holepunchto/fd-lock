const test = require('brittle')
const fs = require('fs')
const FDLock = require('.')

test('basic', async (t) => {
  const fd = await open('test/fixtures/lock', 'w+')

  const lock = new FDLock(fd)

  t.absent(lock.locked)

  await t.execution(lock.ready())
  t.ok(lock.locked)

  await t.execution(lock.close())
  t.absent(lock.locked)
})

test('suspend/resume locked', async (t) => {
  const fd = await open('test/fixtures/suspend', 'w+')
  const lock = new FDLock(fd)

  t.teardown(() => lock.close())

  await t.execution(lock.ready())

  await t.execution(lock.suspend())
  t.absent(lock.locked)

  await t.execution(lock.resume())
  t.ok(lock.locked)
})

function open(path, mode) {
  return new Promise((resolve, reject) =>
    fs.open(path, mode, (err, fd) => (err ? reject(err) : resolve(fd)))
  )
}
