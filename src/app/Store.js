
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message)
  return response.json()
}

class Api {
  /**
   * Creates a new instance of the Api class.
   * @param {object} options
   * @param {string} options.baseUrl - The base URL of the API.
   */
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  /**
   * Gets a resource from the API.
   * @param {object} options
   * @param {string} options.url - The URL of the resource to get.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  /**
   * Creates a new resource on the API.
   * @param {object} options
   * @param {string} options.url - The URL of the resource to create.
   * @param {object} options.data - The data to include in the request body.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async post({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data}))
  }
  /**
   * Deletes a resource from the API.
   * @param {object} options
   * @param {string} options.url - The URL of the resource to delete.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async delete({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'}))
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}

/**
 * Creates the headers object to be sent with the request.
 * Adds the following headers if not specified to be excluded:
 * - Content-Type: application/json
 * - Authorization: Bearer <jwt>
 * @param {object} headers - The object with headers to be sent with the request.
 * @returns {object} The headers object.
 */
const getHeaders = (headers) => {
  const h = { }
  if (!headers.noContentType) h['Content-Type'] = 'application/json'
  const jwt = localStorage.getItem('jwt')
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}`
  return {...h, ...headers}
}

class ApiEntity {
  /**
   * @class ApiEntity
   * @classdesc A class for doing CRUD operations on a specific entity from the API.
   * @param {object} [options]
   * @param {string} options.key - The key of the entity in the API.
   * @param {Api} options.api - The Api class to use for the API requests.
   * @property {string} key - The key of the entity in the API.
   * @property {Api} api - The Api class to use for the API requests.
   */
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  /**
   * Gets a specific entity from the API.
   * @param {object} options
   * @param {string} options.selector - The selector of the entity to retrieve.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async select({selector, headers = {}}) {
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  /**
   * Gets all entities from the API.
   * @param {object} options
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object[]>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async list({headers = {}} = {}) {
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  /**
   * Updates a specific entity in the API.
   * @param {object} options
   * @param {object} options.data - The data to update the entity with.
   * @param {string} options.selector - The selector of the entity to update.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async update({data, selector, headers = {}}) {
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  /**
   * Creates a new entity in the API.
   * @param {object} options
   * @param {object} options.data - The data to create the entity with.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async create({data, headers = {}}) {
    return await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
  }
  /**
   * Deletes a specific entity from the API.
   * @param {object} options
   * @param {string} options.selector - The selector of the entity to delete.
   * @param {object} [options.headers] - The headers to include in the request.
   * @returns {Promise<object>} The JSON response from the API if the request was successful.
   * @throws {Error} If the request was not successful.
   */
  async delete({selector, headers = {}}) {
    return await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
}



class Store {
  /**
   * Constructor for the Store class.
   * Creates a new Store instance with the provided base URL.
   * @param {object} [options] - The options for the Store instance.
   * @param {string} [options.baseUrl] - The base URL for the API.
   */
  constructor() {
    this.api = new Api({baseUrl: 'http://localhost:5678'})
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})
  users = () => new ApiEntity({key: 'users', api: this.api})
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})})

  ref = (path) => this.store.doc(path)

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})
  bills = () => new ApiEntity({key: 'bills', api: this.api})
}

export default new Store()