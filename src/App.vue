<template>
  <!-- TOP AREA -->
  <div class="row topArea">
    <div class="col col-12 col-sm-12 col-md-12 col-lg-4 ">
      <router-link to="/">Net Art Marathon</router-link>
    </div>
    <div class="col col-12 col-sm-12 col-md-12 col-lg-4 ">
      <router-link to="/archive">Archive</router-link>
    </div>
    <div class="col col-12 col-sm-12 col-md-12 col-lg-4">
      <span @click="toggleTheme">&#9711;</span>
    </div>
  </div>

  <!-- NAVIGATION -->
  <div id="nav">
    <router-link to="/">Home</router-link>&nbsp;
    <router-link to="/about">About</router-link>
  </div>

  <!-- ROUTER VIEW (CONTENT) -->
  <router-view />

  <!-- FOOTER -->
  <div id="footer">
    <div id="versionInfo">
      Copyright &copy; 2021 Patrik H&uuml;bner<br>
      Built at: {{ store.getters.appVersion }}
    </div>
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

    // Toggle the theme between light and dark
    function toggleTheme() {
      document.documentElement.className == "light"
        ? (document.documentElement.className = "dark")
        : (document.documentElement.className = "light");
    }

    return { store, toggleTheme };
  },
};
</script>

<style lang="scss">
@import "./assets/styles/theming.scss";
#app {
  margin: 20px;
}

.topArea {
  user-select: none;
  span {
    cursor: pointer;
    &:hover {
      @include theme(color, primaryColorOn);
    }
  }

  @include theme(color, primaryColor);

  a {
    text-decoration: none;
    @include theme(color, primaryColor);
    &:hover {
      @include theme(color, primaryColorOn);
    }
  }
}

#nav {
  font-size: 14px;
  margin: 30px 0 30px 0;

  a {
    text-decoration: none;
    @include theme(color, primaryColor);
    &:hover {
      @include theme(color, primaryColorOn);
    }
    // &.router-link-exact-active {
    //   @include theme(color, primaryColorOn);
    // }
  }
}

#footer {
  margin-top: 50px;
  #versionInfo {
    font-size: 10px;
  }
}
</style>
