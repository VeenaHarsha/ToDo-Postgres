const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  password: 'qwerty',
  host: 'localhost',
  database: 'dbtodo',
  port: 5432
})

const getList = (request, response) => {
  pool.query('SELECT * FROM list ORDER BY ID ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getListById = (request, response) => {
  const id = request.params.id
  pool.query(`SELECT * FROM list WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createList = (request, response) => {
  const { name } = request.body
  pool.query(`INSERT INTO list (name) VALUES ('${name}') RETURNING *`, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows[0])
    response.status(201).send(results.rows[0])
  })
}

const updateList = (request, response) => {
  const id = parseInt(request.params.id)
  const { name } = request.body
  pool.query(`UPDATE list SET name = '${name}' where id = ${id}`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`List name is modified with ID : ${id}`)
  })
}

const deleteList = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(`DELETE FROM list WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`List deleted with ID : ${id}`)
  })
}

module.exports = {
  getList,
  getListById,
  createList,
  updateList,
  deleteList
}
