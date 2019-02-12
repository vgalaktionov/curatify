<template>
  <div class="columns">
    <InboxList />
    <div class="column is-1" />
    <Player />
  </div>
</template>

<script>
import InboxList from '~/components/InboxList'
import Player from '~/components/Player'

export default {
  components: {
    Player,
    InboxList
  },
  middleware: 'auth'
}
</script>


<style scoped>
img.play-spinner {
    padding-top: 0.5rem;
}

.playback {
    font-size: 40pt;
    border-color: transparent;
    outline: none;
}

.playback:hover {
    color: rgb(129, 135, 141);
}

.playback-buttons {
    /*margin-left: 6rem;*/
}


.album-art {
    min-height: 300px;
}

.player {
    /*margin-left: 6rem;*/
}

.currently-playing {
    height: 380px;
    min-height: 380px;
}

.currently-playing img {
    height: 280px;
}
</style>
