<template>
  <!-- NAVIGATION -->
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>

  <!-- ROUTER VIEW (CONTENT) -->
  <router-view />

  <!-- FOOTER -->
  <div id="versionInfo">
    Copyright &copy; 2021 Patrik H&uuml;bner<br>
    Built at: {{ store.getters.appVersion }}
  </div>
</template>


<script>
import { useStore } from "vuex";

export default {
  name: "App",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  setup() {
    const store = useStore();

    return { store };
  },
};
</script>

<style lang="scss">
#app {
  display: block;
  background: #000;
  color: #fff;
}

#versionInfo {
  font-size: 12px;
}

#nav {
  text-align: center;
  padding: 30px;
  font-size: 14px;

  a {
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #ff0000;
    }
  }
}
</style>
