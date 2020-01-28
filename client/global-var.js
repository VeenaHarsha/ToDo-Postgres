
export default function getGlobalVar () {
  return {
    listForm: document.getElementById('list-form'),
    newListBtn: document.getElementById('newList'),
    listName: document.getElementById('list-name'),
    searchBtn: document.getElementById('searchBtn'),
    searchForm: document.getElementById('search-form'),
    searchName: document.getElementById('search-name'),
    mainDivList: document.getElementById('main-div-list'),
    listBlock: document.querySelector('.list-container'),
    taskName: document.getElementById('task-name'),
    taskList: document.querySelector('.show-taskList'),
    taskDiv2: document.getElementById('task-div-2'),
    taskNotes: document.getElementById('task-note'),
    dueDate: document.getElementById('due-date'),
    priority: document.getElementById('prId'),
    moreInfo: document.querySelector('.show-more-info'),
    schNav: document.getElementById('sch-id'),
    filterBtn: document.getElementById('filterBtn'),
    todayBlock: document.querySelector('.today-container'),
    todayDiv: document.getElementById('today-task'),
    schBlock: document.querySelector('.sch-container'),
    schDiv: document.getElementById('sch-task'),
    listNav: document.getElementById('list-id'),
    todayNav: document.getElementById('today-id'),
    goBackBtn: document.getElementById('goBack'),
    upTaskBtn: document.getElementById('updateTask'),
    delTaskBtn: document.getElementById('delTaskBtn'),
    nav1: document.getElementById('nav-1'),
    nav2: document.getElementById('nav-2'),
    baseURL: 'http://localhost:3000/'
  }
}
