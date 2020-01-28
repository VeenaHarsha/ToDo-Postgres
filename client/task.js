import getGlobalVars from './global-var.js'

const {
  listBlock, taskName, taskList, taskDiv2, taskNotes, dueDate, priority, moreInfo, schNav, mainDivList, nav1, nav2,
  filterBtn, todayBlock, todayDiv, schBlock, schDiv, listNav, todayNav, upTaskBtn, delTaskBtn, newListBtn, searchBtn, baseURL
} = getGlobalVars()

let currListId; let currTaskId
let taskDone = false
let listItems = ''
const setPriorityColor = { 3: 'red', 2: 'orange', 1: 'white' }

getList()
async function getList () {
  const items = await window.fetch(baseURL + 'list')
  listItems = await items.json()
}

function createDOM (type, props, ...children) {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}

async function createTask (event) {
  if (event.target.value === '') return
  if (event.keyCode === 13 || event.type === 'click') {
    event.preventDefault()
    const data = JSON.stringify({
      listid: currListId,
      taskname: taskName.value,
      notes: taskNotes.value,
      duedate: dueDate.value,
      iscompleted: taskDone,
      priority: priority.value
    })
    const taskObject = await window.fetch(baseURL + 'tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
    event.target.value = ''
    const result = await taskObject.json()
    // await displayListName()
    buildTaskItems(result)
  }
}

async function getTaskName (listId) {
  let tNames = ''
  const tasks = await window.fetch(baseURL + `tasks/${listId}`)
  const taskItems = await tasks.json()
  taskItems.forEach(ele => {
    tNames += ele.taskname + '<br>'
  })
  return tNames
}

async function displayListName () {
  // taskDiv2.innerHTML = ''
  const selList = await window.fetch(baseURL + `list/${parseInt(currListId)}`)
  const lName = await selList.json()
  taskDiv2.appendChild(createDOM('span',
    {
      className: 'spStyle',
      innerText: lName[0].name
    }))
}

async function showTaskList (event) {
  currListId = event.target.parentElement.id
  if (currListId) {
    nav1.style.display = 'none'
    nav2.style.display = 'block'
    listBlock.style.display = 'none'
    taskList.style.display = 'block'
  }
  taskDiv2.innerHTML = ''
  await displayListName()
  const currListTasks = await window.fetch(baseURL + `tasks/${currListId}`)
  const taskItems = await currListTasks.json()
  if (taskItems) taskItems.forEach(task => buildTaskItems(task))
  taskItems.forEach(task => {
    if (task.priority !== 1) {
      showPriorityTasks(task.id, task.priority)
    }
  })
}

async function setMoreInfoDetails (task) {
  const tasks = await window.fetch(baseURL + `tasks/${currListId}`)
  const taskItems = await tasks.json()
  for (const t of taskItems) {
    if (t.id === Number(task)) {
      taskNotes.value = t.notes
      priority.value = t.priority
      dueDate.value = t.duedate
    }
  }
}

function addMoreInfo (event) {
  currTaskId = event.target.parentNode.getAttribute('id')
  const ele = event.target
  event.preventDefault()
  if (moreInfo.style.display === 'none') {
    moreInfo.style.display = 'flex'
    setMoreInfoDetails(currTaskId)
    listBlock.style.display = 'none'
    ele.insertAdjacentElement('afterend', moreInfo)
  } else {
    moreInfo.style.display = 'none'
    listBlock.style.display = 'none'
  }

}

async function updateCompleted (event) {
  event.preventDefault()
  currTaskId = event.target.parentNode.getAttribute('id')
  if (event.target.click) {
    event.target.checked ? taskDone = true : taskDone = false
    updateTask(event, taskDone)
  }
}

async function updateTask (event, taskDone = false) {
  event.preventDefault()
  const currListTasks = await window.fetch(baseURL + `tasks/${parseInt(currListId)}`)
  const taskItems = await currListTasks.json()
  let data = {}
  taskItems.forEach(task => {
    if (task.id === Number(currTaskId)) {
      // task.taskname = task.taskname // taskName.value
      task.notes = taskNotes.value
      task.duedate = dueDate.value
      task.iscompleted = taskDone
      task.priority = priority[priority.selectedIndex].value
      data = task
    }
  })
  await window.fetch(baseURL + `tasks/${parseInt(currTaskId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  moreInfo.style.display = 'none'
  taskDiv2.innerHTML = ''
  await displayListName()
  taskItems.forEach(task => buildTaskItems(task))
  taskItems.forEach(task => {
    if (task.priority !== 1) {
      showPriorityTasks(task.id, task.priority)
    }
  })
}

async function deleteTask (event) {
  event.preventDefault()
  event.currentTarget.parentNode.remove()
  await window.fetch(baseURL + `tasks/${parseInt(currTaskId)}`, {
    method: 'DELETE'
  })
  taskDiv2.innerHTML = ''
}

function showPriorityTasks (taskId, prValue) {
  const textInput = document.querySelector(`#task-${taskId}`)
  textInput.style.backgroundColor = setPriorityColor[prValue]
}

listNav.addEventListener('click', () => {
  if (mainDivList.style.display === 'none') {
    mainDivList.style.display = 'grid'
    searchBtn.style.display = 'block'
    todayBlock.style.display = 'none'
    schBlock.style.display = 'none'
    newListBtn.style.visibility = 'visible'
  }
})

schNav.addEventListener('click', () => {
  if (schBlock.style.display === 'none') {
    schBlock.style.display = 'block'
    hideItems(newListBtn, searchBtn, mainDivList, todayBlock)
  }
})

todayNav.addEventListener('click', () => {
  if (todayBlock.style.display === 'none') {
    todayBlock.style.display = 'block'
    hideItems(newListBtn, searchBtn, mainDivList, schBlock)
  }
})

function hideItems (newListBtn, searchBtn, mainDivList, aBlock) {
  newListBtn.style.visibility = 'hidden'
  searchBtn.style.display = 'none'
  mainDivList.style.display = 'none'
  aBlock.style.display = 'none'
}

async function getScheduledTasks (event) {
  const allTasks = await window.fetch(baseURL + 'tasks')
  const items = await allTasks.json()
  schDiv.innerHTML = ''
  items.forEach(task => {
    if (task.duedate && !task.iscompleted) {
      buildScheduledTasks(task.taskname, task.duedate, task.listid, schDiv, schBlock)
    }
  })
}

async function getTodayTasks (event) {
  const today = new Date(Date.now()).toISOString().split('T')[0]
  const allTasks = await window.fetch(baseURL + 'tasks')
  const items = await allTasks.json()
  todayDiv.innerHTML = ''
  items.forEach(task => {
    if (task.duedate === today) {
      buildScheduledTasks(task.taskname, task.duedate, task.listid, todayDiv, todayBlock)
    }
  })
}

async function clearCompleted (event) {
  event.preventDefault()
  const currListTasks = await window.fetch(baseURL + `tasks/${parseInt(currListId)}`)
  const taskItems = await currListTasks.json()
  const tasks = taskItems.filter(ele => ele.iscompleted)
  const tId = parseInt(tasks[0].id)
  await window.fetch(baseURL + `tasks/${tId}`, {
    method: 'DELETE'
  })
  taskDiv2.innerHTML = ''
  await displayListName()
  taskItems.filter(ele => !ele.iscompleted).forEach(task => buildTaskItems(task))
}

schNav.addEventListener('click', getScheduledTasks)
todayNav.addEventListener('click', getTodayTasks)
filterBtn.addEventListener('click', clearCompleted)
upTaskBtn.addEventListener('click', updateTask)
delTaskBtn.addEventListener('click', deleteTask)
taskName.addEventListener('keypress', createTask)
// priority.addEventListener('change', showPriorityTasks(currTaskId, parseInt(priority[priority.selectedIndex].value)))

function buildTaskItems (task) {
  taskDiv2.appendChild(
    createDOM('div',
      {
        id: task.id,
        className: 'task-div'
      },
      createDOM('input',
        {
          type: 'checkbox',
          id: 'selTask',
          onclick: updateCompleted,
          checked: task.iscompleted
        }),
      createDOM('input',
        {
          type: 'text',
          id: `task-${task.id}`,
          value: task.taskname,
          onchange: showPriorityTasks
        }),
      createDOM('img',
        {
          id: 'more-info-btn',
          src: 'images/arrow-down.png',
          width: 15,
          height: 15,
          onclick: addMoreInfo
        }
      )
    )
  )
}

function buildScheduledTasks (taskName, sDate, listName, sDiv, sBlock) {
  sDiv.appendChild(
    createDOM('div',
      {
        className: 'sch-div-style'
      },
      createDOM('span',
        {
          innerText: taskName
        }
      ),
      createDOM('span',
        {
          innerText: sDate,
          className: 'span-2'
        }
      ),
      createDOM('span',
        {
          innerText: listName,
          className: 'span-3'
        }
      )
    )
  )
  sBlock.appendChild(sDiv)
}

export { showTaskList, createDOM, getTaskName, listItems }
