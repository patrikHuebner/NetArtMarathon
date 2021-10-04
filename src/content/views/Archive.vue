<template>
  <h2>Archive View</h2>

  <div class="row">
    <div class="col col-6 contentCard" v-for="(content, index) in store.getters.content()" :key="index">
      <router-link :to="{name: content.name}">
        {{ content.name }}
      </router-link>
      <br>
      <span class="tag">#{{ content.topic }}</span>
    </div>
  </div>

</template>

<script>
import { useStore } from "vuex";

export default {
  name: "Home",
  components: {},
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>


<style lang="scss">
</style>
