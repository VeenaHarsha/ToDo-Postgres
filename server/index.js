const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const rootDir = path.dirname(process.mainModule.filename)
const liDb = require('./list-queries')
const tskDb = require('./task-queries')

app.use(express.json())
app.use('/', express.static(path.join(rootDir, '../client')))

app.get('/list', liDb.getList)
app.get('/list/:id', liDb.getListById)
app.post('/list', liDb.createList)
app.put('/list/:id', liDb.updateList)
app.delete('/list/:id', liDb.deleteList)

app.get('/tasks', tskDb.getTasks)
app.get('/tasks/:listid', tskDb.getTasksOfList)
app.post('/tasks', tskDb.createTask)
app.put('/tasks/:id', tskDb.updateTask)
app.delete('/tasks/:id', tskDb.deleteTask)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
