import getGlobalVars from './global-var.js'
import { showTaskList, createDOM, getTaskName, listItems } from './task.js'

const {
  listBlock, taskList, listForm, newListBtn, goBackBtn, listName, searchBtn,
  searchForm, searchName, mainDivList, nav1, nav2, baseURL
} = getGlobalVars()

loadLists()
async function loadLists () {
  mainDivList.innerHTML = ''
  const lItems = await window.fetch(baseURL + 'list')
  const items = await lItems.json()
  items.forEach(item => {
    buildListItems(item)
  })
}

newListBtn.addEventListener('click', () => {
  if (listForm.style.display === 'none') {
    listForm.style.display = 'block'
    searchForm.style.display = 'none'
  } else {
    listForm.style.display = 'none'
  }
})

searchBtn.addEventListener('click', () => {
  if (searchForm.style.display === 'none') {
    listForm.style.display = 'none'
    searchForm.style.display = 'block'
  } else {
    searchForm.style.display = 'none'
  }
})

async function createList (event) {
  if (event.target.value === '') return
  if (event.keyCode === 13 || event.type === 'click') {
    event.preventDefault()
    const data = JSON.stringify({ name: listName.value })
    const listObject = await window.fetch(baseURL + 'list',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      })
    const result = await listObject.json()
    buildListItems(result)
    listName.value = ''
    listForm.style.display = 'none'
  }
}
listName.addEventListener('keypress', createList)

function searchList (event) {
  if (event.target.value === '') return
  if (event.keyCode === 13 || event.type === 'click') {
    event.preventDefault()
    mainDivList.innerHTML = ''
    for (const li of listItems) {
      const lName = li.name.toLowerCase()
      if (lName.includes(searchName.value.toLowerCase())) {
        buildListItems(li)
      }
    }
    searchName.value = ''
    searchForm.style.display = 'none'
  }
}
searchName.addEventListener('keypress', searchList)

async function buildListItems (list) {
  mainDivList.appendChild(
    createDOM('div',
      {
        className: 'show-task-list'
      },
      createDOM('div',
        {
          id: list.id,
          className: 'ui-list-div',
          onclick: showTaskList
        },
        createDOM('p',
          {
            className: 'inner-p',
            innerHTML: !(await getTaskName(list.id)) ? 'No Tasks' : await getTaskName(list.id)
          }
        )
      ),
      createDOM('img',
        {
          id: list.id,
          src: 'images/delete-small.png',
          width: 15,
          height: 15,
          onclick: deleteListItem
        }
      ),
      createDOM('input',
        {
          className: 'new-name',
          type: 'text',
          value: list.name,
          onclick: renameList
        }
      )
    )
  )
}

async function renameList (event) {
  const newName = event.currentTarget.value
  const lId = event.target.parentNode.firstChild.id
  const data = JSON.stringify({ name: newName })
  await window.fetch(baseURL + `list/${lId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
}

async function deleteListItem (event) {
  const lId = event.currentTarget.getAttribute('id')
  event.currentTarget.parentNode.remove()
  await window.fetch(baseURL + `list/${lId}`, {
    method: 'DELETE'
  })
}

goBackBtn.addEventListener('click', (event) => {
  event.preventDefault()
  nav1.style.display = 'grid'
  nav2.style.display = 'none'
  taskList.style.display = 'none'
  listBlock.style.display = 'block'
  loadLists()
})
