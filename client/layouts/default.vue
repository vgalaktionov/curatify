<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <a href="/" class="navbar-item is-logo">
          <img src="/logo_transparent.png">
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link to="curate" class="navbar-item" active-class="is-active">
            Curate
          </nuxt-link>
          <nuxt-link to="playlists" class="navbar-item" active-class="is-active">
            Playlists
          </nuxt-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            Welcome, {{ name }}
          </div>
          <div class="navbar-item">
            <a href="/auth/logout" class="button is-primary is-inverted is-outlined">
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
    <section class="section">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$store.state.user.display_name
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
}

.center-table th {
    text-align: center;
    vertical-align: middle;
}

.center-table td {
    text-align: center;
    vertical-align: middle;
}
</style>
<style scoped>
.__nuxt-error-page {
  margin-top: 100px;
}

a.is-logo img {
  width: 100px;
}

nav {
  height: 90px;
}

.navbar img {
  max-height: 200px;
}

.navbar-item.is-logo {
  position: absolute;
  left: 50%;
  margin-left: -64px; /* 50% */
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
