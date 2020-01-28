const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dbtodo',
  password: 'qwerty',
  port: 5432
})

const getTasks = (request, response) => {
  pool.query('SELECT * FROM tasks ORDER BY ID ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createTask = (request, response) => {
  const { listid, taskname } = request.body
  pool.query(`INSERT INTO tasks (listid,taskname,notes,duedate,iscompleted,priority) 
  VALUES (${listid},'${taskname}','','',FALSE,1)  RETURNING *`,
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows[0])
  })
}

const updateTask = (request, response) => {
  const id = parseInt(request.params.id)
  const { taskname, notes, duedate, iscompleted, priority } = request.body
  console.log('Request is:', request.body)
  pool.query(`UPDATE tasks SET  taskname = '${taskname}' ,notes = '${notes}',duedate = '${duedate}',iscompleted = ${iscompleted}, priority = ${priority} WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error
      }
      console.log('Showing tasks:', results.rows)
      response.status(200).send(results.rows[0])
    })
}

const deleteTask = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(`DELETE FROM tasks WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Task deleted with ID : ${id}`)
  })
}

const getTasksOfList = (request, response) => {
  const lid = request.params.listid
  pool.query(`SELECT * FROM tasks WHERE listid = ${lid}`, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksOfList
}
