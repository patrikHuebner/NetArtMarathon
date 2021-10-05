<template>
  <ProjectHeader />

  <div id="wikiContainer">
    <div v-for="(block, index) in blocks" :key="index">
      <!-- <div style="pointer-events: none; top:0; left: 0; width: 100vw; height: 100vh; position: absolute; background: #000; opacity: 0.1; display:block;"></div> -->
      <div @click="grabRandomData" :style="{'line-height':'1', 'position': 'absolute', 'top': block.top, 'left': block.left, 'font-size': block.fontSize, 'z-index': block.zIndex, 'width': block.width, 'height': block.height}" v-html="block.content"></div>
    </div>
  </div>

  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { random } from "../../utils/utils";
import { ref } from "@vue/reactivity";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    let blocks = ref([]);

    grabRandomData();

    // Grab a random Wikipedia article
    async function grabRandomData() {
      const response = await fetch(
        "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content"
      );
      const json = await response.json();

      for (let children in json.query.pages) {
        let result = json.query.pages[children];

        // Revisions
        for (let revision in result.revisions[0]) {
          let width = random(50, window.innerWidth / 2);
          blocks.value.push({
            width: width + "px",
            left: random(0, (window.innerWidth - width) / 2) + "px",
            top: random(150, window.innerHeight) + "px",
            fontSize: random(10, 20) + "px",
            zIndex: 10,
            content:
              // '<div class="hyperlink_text_background">' +
              result.revisions[0][revision],
            // "</div>",
          });
        }

        // // Images
        // console.log(result.images)
        // for (let image in result.images[0]) {
        //   console.log(image)
        //   //console.log(result.images[0][image])
        //   // let width = random(50, window.innerWidth / 2);
        //   // blocks.value.push({
        //   //   width: width + "px",
        //   //   left: random(0, (window.innerWidth-width) / 2) + "px",
        //   //   top: random(150, window.innerHeight) + "px",
        //   //   fontSize: random(10, 20) + "px",
        //   //   zIndex: 10,
        //   //   content: '<div style="padding: 50px; background: #000; pointer-events: none;">'+result.revisions[0][revision]+'</div>',
        //   // });
        // }

        // Title
        blocks.value.push({
          top: random(150, window.innerHeight) + "px",
          left: random(0, window.innerWidth / 2) + "px",
          width: random(200, window.innerWidth / 2) + "px",
          fontSize: random(50, 200) + "px",
          zIndex: 100,
          content:
            '<a href="#" class="hyperlink_text_background">' +
            result.title +
            "</a>",
        });
      }
    }

    return { blocks, grabRandomData };
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

.hyperlink_text_background {
  // padding: 50px;
  // pointer-events: none;
  @include theme(background-color, primaryColor);
  @include theme(color, backgroundColor);
}

#wikiContainer {
  margin: 50px 0 50px 0;
  height: 100vw;
}
</style>
