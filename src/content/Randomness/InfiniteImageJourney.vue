<template>
  <ProjectHeader />

  <div id="wikiContainer">
    <div @click="getRandomImage" v-for="(block, index) in blocks" :key="index" style="cursor: pointer" :style="{'line-height':'1', 'position': 'absolute', 'top': block.top, 'left': block.left, 'z-index': block.zIndex, 'font-size': block.fontSize, 'width': block.width, 'height': block.height}">
      <div v-html="block.content" class="randomImage"></div>
      <span class="randomInfo" v-html="block.meta" :style="{'z-index': block.metaZ}"></span>
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

    getRandomImage();

    async function getRandomImage() {
      blocks.value = [];
      // Grab a random topic off of Wikipedia
      const topicResponse = await fetch(
        "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content"
      );
      const topicJSON = await topicResponse.json();

      for (let topics in topicJSON.query.pages) {
        let randomTopic = topicJSON.query.pages[topics].title;

        blocks.value.push({
          top: random(150, window.innerHeight - 150) + "px",
          left: random(0, window.innerWidth / 2) + "px",
          width: random(200, window.innerWidth / 2) + "px",
          fontSize: random(50, 100) + "px",
          zIndex: 1000,
          content:
            '<span class="hyperlink_link hyperlink_text_background">' +
            randomTopic +
            "</span>",
        });

        // Once we have the random topic, grab 30 related images from Wikipedia
        let amountOfImages = Math.round(random(5, 30));
        const imageResponse = await fetch(
          "https://en.wikipedia.org/w/api.php?action=query&list=allimages&origin=*&ailimit=" +
            amountOfImages +
            "&format=json&aifrom=" +
            randomTopic,
          {
            method: "GET",
          }
        );

        const imageJSON = await imageResponse.json();
        let index = 0;
        for (let images in imageJSON.query.allimages) {
          let width = random(50, 400);
          blocks.value.push({
            zIndex: 200 + index,
            width: width + "px",
            left: random(0, window.innerWidth - width) + "px",
            top: random(150, window.innerHeight) + "px",
            content:
              '<img src="' + imageJSON.query.allimages[images].url + '"/>',
            meta:
              imageJSON.query.allimages[images].name +
              "<br>" +
              imageJSON.query.allimages[images].timestamp +
              "<br>" +
              imageJSON.query.allimages[images].title,
            metaZ: 200 + index + 5,
          });
          index += 10;
        }
      }
    }

    return { getRandomImage, blocks };
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

#wikiContainer {
  margin: 50px 0 50px 0;
  height: 100vw;
}
.hyperlink_text_background {
  @include theme(background-color, primaryColor);
  @include theme(color, backgroundColor);
}
.hyperlink_link {
  cursor: pointer;
  text-decoration: underline;
  user-select: none;
  @include theme(color, backgroundColor);
  &:hover {
    @include theme(color, primaryColorOn);
  }
}
.randomImage {
  transition: 1s;
  &:hover {
    scale: 1.1;
    .randomInfo {
      scale: 2.1;
    }
  }
}
.randomInfo {
  position: absolute;
  transform: rotate(90deg);
  font-size: 8px;
}
</style>
