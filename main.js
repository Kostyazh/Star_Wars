const results = document.getElementById('result');

function fil() {
      const Films = new Swapi('films')
      Films.init({
          category: ['planets', 'starships'],
          container() {
              return document.querySelector('.sw-list')
          },
          item(data) {
              return `
                      <div  class="sw-item card p-3 m-3 w-100 dropdown show">
                      <div class="sw-item__info">
                          <a id="btn_item" class="btn " data-toggle="collapse" href="#name"  role="button" aria-expanded="false" aria-controls="collapseExample">${data.title}</a>
                          </div>
                          <br>
                      <div class="collapse" id="name">
                          <div class="card card-body">
                              <div class="opening_crawl">
                                  ${Films.method('concat', data.starships, (starships) => {
                                  return `
                                  <h4>3вездолёт:</h4>
                                  <div class="name">Название звездолёта: ${starships.name}</div>
                                  <div class="birth">Birth: ${starships.birth_year}</div>
                                  <hr>
                                  `
                              })}
                              </div>
                              <div class="planets">
                                  ${Films.method('concat', data.planets, (planet) => {
                                  return `
                                  <h4>Планета:</h4>
                                  <div class="name">Name: ${planet.name}</div>
                                  <hr>
                                  `
                              })}
                              </div>
                          </div>
                      </div>
                  </div>
        `
          }
      })
    /**
      * Инициализация Swapi
      * @param {string} endpoint - категория запроса: flims, ...
    **/
      function Swapi(endpoint) {
          this.init = (setting) => {
              const container = setting.container()
              makeRequest(`https://swapi.dev/api/${endpoint}/`).then(response => {
                  for (const item in response.results) {
                      makeCategoryRequest(response.results[item], setting.category).then(results => {
                          appendCollection(container, parseHtml(setting.item(results)))
                      })
                  }
              })
          },
              this.method = (name, value, callback) => {
                  switch (name.toLowerCase()) {
                      case 'concat':
                          return filterStrings(value, callback)
                  }
              }
      }
    /**
      * Сделать все запросы на переданные категории
      * @param {object} results - объект данных фильма
      * @param {array} types - категории, которые нужно загрузить
      * @returns {Promise}
    **/
      async function makeCategoryRequest(results, types = ['starships']) {
          const promises = {};
          for (const type of types) {
              promises[type] = makeDeepRequest(results[type])
          }
          for (const [type, promise] of Object.entries(promises)) {
              await promise.then(response => {
                  results[type] = response;
              }).catch(console.error)
          }
          return results
      }

    /**
      * Сделать запрос на url
      * @param {string} url - ссылка
      * @returns {Promise}
    **/
      function makeRequest(url) {
          return new Promise(resolve => {
              fetch(url, {
                  method: 'GET',
                  mode: 'cors'
              }).then(response => {
                  return response.json()
              }).then(resolve).catch(error => {
                  resolve(null)
              })
          })
      }

    /**
      * Сделать запросы на переданные url
      * @param {array} urls - массив ссылок
      * @returns {Promise}
    **/
      function makeDeepRequest(urls) {
          return new Promise(resolve => {
              const promises = []
              for (const url of urls) {
                  promises.push(makeRequest(url))
              }
              Promise.all(promises).then(resolve)
          })
      }
    /**
      * Вставка HTMLCollection на страницу
      * @param {Node} element - Node элемент, куда будет вставлятся коллекция
      * @param {HTMLCollection} collection - масив HTMLCollection
    **/
      function appendCollection(element, collection) {
          element.appendChild(collection[0])
      }

    /**
      * Парсинг HTML из строки
      * @param {string} string - html строка
      * @returns {HTMLCollection} - html коллекция node узлов
    **/
      function parseHtml(string) {
          const template = document.implementation.createHTMLDocument()
          template.body.innerHTML = string
          return template.body.children
      }

    /**
      * Фильтрация массва, запись в строку
      * @param {array} - массив данных
      * @param {function} filter - функция фильтрации
      * @returns {string} - строка с отфильтрованными данными из массива
    **/

      function filterStrings(array, filter) {
          let strings = []
          if (filter) {
              for (let i = 0; i < array.length; i++) {
                  strings += filter(array[i], i)
              }
          } else {
              for (let i = 0; i < array.length; i++) {
                  strings += array[i]
              }
          }
          return strings
      }
    }

      /**
        * Фильтр и перебор по массиву
        * @param {array} data - массив данных
        * @param {function} filter - функция для фильтрации
        * @returns {array} - отфильтрованный массив данных
      **/
      function filterArray(data, filter) {
      	const array = []
      	for (let i = 0; i < data.length; i++) {
      		array.push(filter(data[i], i))
      	}
      	return array
      }


let a = document.getElementById('films');
a.addEventListener('click', clicker);
let flag = true;
function clicker() {
  if(flag){
      fil();
      flag = false;
  }
};
