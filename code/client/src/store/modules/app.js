const app = {
  state: {},
  mutations: {
    SET_ARTICLES(state, articleList) {
      state.articleList = articleList
    }
  },
  actions: {
    updateArticle({}, payload) {
      return axios.put(`/blog/update/article`, payload)
    }
  }
}
export default app
