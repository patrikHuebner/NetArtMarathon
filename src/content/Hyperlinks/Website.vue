<template>
  <ProjectHeader />

  <div id="WebContainer"></div>
  <!-- <div>
    <object type="text/html" data="http://www.timrodenbroeker.de/" width="800px" height="600px" style="overflow:auto;border:5px ridge blue">
    </object>
  </div> -->

  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { onMounted } from "@vue/runtime-dom";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    onMounted(() => {
      loadWebsite("https://www.timrodenbroeker.de/resources");
    });

    function loadWebsite(websiteURL) {
      fetch("https://shutdown.gallery:8443/?site=" + websiteURL, {
        mode: "cors",
      })
        .then((response) => response.text())
        .then((rawHTML) => {
          var doc = document.createElement("html");
          doc.innerHTML = rawHTML;
          var links = doc.getElementsByTagName("a");
          var urls = [];

          for (var i = 0; i < links.length; i++) {
            urls.push(links[i].getAttribute("href"));
          }

          console.log(urls)
        })
        .catch((error) => {
          console.warn(error);
        });
    }

    return {};
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";
</style>
