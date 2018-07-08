import Api from '../services/Api'

export default {
  fetchPosts () {
    return Api().get('posts')
  },

  getClients () {
    return Api().get('/api/clients/get');
  },

  saveClient (params) {
    return Api().post('/api/clients/save', params)
  },

  delClient (params) {
    return Api().post('/api/clients/del', params)
  },

  getProviders () {
    return Api().get('/api/providers/get');
  },

  saveProvider (params) {
    return Api().post('/api/providers/save', params)
  },

  delProvider (params) {
    return Api().post('/api/providers/del', params)
  }

}
