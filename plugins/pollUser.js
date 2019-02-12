export default function({ $axios, store }) {
  if (store.state.user) {
    setInterval(async () => {
      const user = await $axios.$get('/auth/me')
      store.commit('setUser', user)
    }, 1000 * 5 * 60)
  }
}
