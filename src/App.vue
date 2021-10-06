<template>
  <!-- TOP AREA -->
  <div class="row topArea">
    <div class="col col-12 col-sm-12 col-md-12 col-lg-3 ">
      <router-link :to="{ name: 'Net Art Marathon' }">Net Art Marathon</router-link>
    </div>
    <div class="col col-12 col-sm-12 col-md-12 col-lg-3 ">
      <router-link :to="{ name: 'Archive' }">Archive</router-link>
    </div>
    <div class="col col-12 col-sm-12 col-md-12 col-lg-3">
      <router-link :to="{ name: 'About' }">About</router-link>
    </div>
    <div class="col col-12 col-sm-12 col-md-12 col-lg-3">
      <span @click="toggleTheme">&#x263C;</span>
    </div>
  </div>

  <!-- NAVIGATION -->
  <div id="nav">
    <router-link v-for="(topic, index) in topics" :key="index" :to="{name: topic.name}" class="routerLink">
      {{ topic.name }}
    </router-link>
  </div>

  <!-- ROUTER VIEW (CONTENT) -->
  <router-view />

  <!-- FOOTER -->
  <div id="footer">
    <div id="versionInfo">
      A research/design project by <a href="https://www.patrik-huebner.com" target="_blank">Patrik H&uuml;bner</a>. &copy; 2021-2022.
      <br>
      Created as a self-initiated project in the winter semester of 2021/2022 at <a href="https://www.fh-bielefeld.de/gestaltung/dmx/studienrichtung" target="_blank">Digital FH Bielefeld</a>.
      <p />
      Version {{ store.getters.appVersion }}
    </div>
  </div>
</template>


<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { parsePagesAndTopics } from "./router";

export default {
  name: "App",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  setup() {
    const store = useStore();
    let pages = ref([]);
    let topics = ref([]);
    let content = ref([]);

    // Parse pages and topics, put into vueX-store and build navigation
    parsePagesAndTopics().then((routes) => {
      // Pages
      store.dispatch("updateState", {
        parent: "routing",
        key: "pages",
        value: routes.pages,
      });
      for (let page in store.state.routing.pages) {
        pages.value.push(store.state.routing.pages[page]);
      }

      // Topics
      store.dispatch("updateState", {
        parent: "routing",
        key: "topics",
        value: routes.topics,
      });
      for (let topic in store.state.routing.topics) {
        topics.value.push(store.state.routing.topics[topic]);
      }

      // Content
      store.dispatch("updateState", {
        parent: "routing",
        key: "content",
        value: routes.content,
      });
      for (let thisContent in store.state.routing.content) {
        content.value.push(store.state.routing.content[thisContent]);
      }
    });

    // Toggle between light and dark themes
    function toggleTheme() {
      document.documentElement.className == "light"
        ? (document.documentElement.className = "dark")
        : (document.documentElement.className = "light");

      store.dispatch("updateState", {
        parent: "theme",
        key: "mode",
        value: document.documentElement.className,
      });
    }

    return { store, toggleTheme, pages, topics, content };
  },
};
</script>

<style lang="scss">
@import "./assets/styles/theming.scss";
#app {
  margin: 20px;
}

.topArea {
  text-transform: uppercase;
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
    &.router-link-exact-active {
      @include theme(color, primaryColorOn);
    }
  }
}

.routerLink {
  margin-right: 20px;
}

#nav {
  text-transform: uppercase;
  margin: 30px 0 30px 0;
  user-select: none;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  a {
    display: inline-block;
    text-decoration: none;
    &.router-link-exact-active {
      @include theme(color, primaryColorOn);
    }
  }
}

#footer {
  margin-top: 50px;
  #versionInfo {
    font-size: 10px;
  }
}
</style>
