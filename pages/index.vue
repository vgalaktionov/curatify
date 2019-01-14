<template>
  <div>
    <img src="~/assets/logo_transparent.png" alt="" class="banner">
    <h3 class="is-size-3">Welcome!</h3>
    <p class="subtitle">To start discovering new music, please</p>
    <div class="login-button">
      <a href="/auth/login" class="button is-spotify">
        <b-icon icon="spotify" />
        <span>Login with Spotify</span>
      </a>
    </div>
    <br>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  layout: 'login',
  fetch ({ store, redirect }) {
    if (store.state.user) {
      return redirect('/curate')
    }
  }
}
</script>

<style>
.button.is-spotify {
    background-color: transparent;
    color: #1db954;
    border-color: #1db954;
}

.button.is-spotify:hover {
    background-color: #1db954;
    color: black;
}

img.banner {
    height: 500px;
    margin-bottom: -50px;
}
</style>
