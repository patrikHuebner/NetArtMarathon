<template>
  <ProjectHeader />

  <div id="goingPlaces_stage">
    <div v-for="(image, index) in images" :key="index">
      <img :src="image.imageURL" :style="{'transform':  'translateZ(-'+image.scale+'px) scale('+(image.scale+1)+');', 'margin-top': image.top+'px', 'margin-left': image.left+'px'}">
    </div>
  </div>

  <div id="goingPlaces_stage_videos">
    <div v-for="(video, index) in videos" :key="index">
      <iframe allow="autoplay *;" :src="video.videoURL" :style="{ 'top': video.top+'px', 'left': video.left+'px', 'width': video.width+'px', 'height': video.width+'px'}"></iframe>
    </div>
  </div>

  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { random } from "../../utils/utils";
import { ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-dom";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    let requestInterval = null;
    let images = ref([]);
    let videos = ref([]);
    let content = ref([]);
    let positions = [];
    let catastropheCounter = 2;
    for (let i = 0; i < 500; i++) {
      let position = {
        top: random(-400, 400),
        left: random(-300, 0),
        scale: Math.floor(random(0, 3)),
        width: random(400, 900),
      };
      positions.push(position);
    }

    getWebcams();

    requestInterval = setInterval(() => {
      updateWebcams();
    }, 10000);

    onUnmounted(() => {
      clearInterval(requestInterval);
    });

    // ------------
    async function getWebcams() {
      let imageArray = [];
      let videoArray = [];

      const response = await fetch(
        "https://api.oceandrivers.com:443/v1.0/getWebCams/"
      );
      const json = await response.json();

      let fileTypeExpression = (fileTypeExpression = /(?:\.([^.]+))?$/);

      for (let children in json) {
        let result = json[children];
        let url = result.url;

        if (
          fileTypeExpression.exec(url)[1] == "png" ||
          fileTypeExpression.exec(url)[1] == "jpg"
        ) {
          imageArray.push(result);
        }
        if (fileTypeExpression.exec(url)[1] == "html") {
          videoArray.push(result);
        }
      }

      for (let index in imageArray) {
        images.value.push({
          imageURL: imageArray[index].url,
          top: positions[index].top,
          left: positions[index].left,
          scale: positions[index].scale,
        });
      }

      let leftIndicator = 0;
      for (let index in videoArray) {
        leftIndicator += Math.abs(positions[index].left) * 2;
        videos.value.push({
          videoURL: videoArray[index].url,
          top: positions[index].top,
          left: leftIndicator + positions[index].left,
          scale: positions[index].scale,
          width: positions[index].width,
        });
      }
    }

    // ------------
    async function updateWebcams() {
      catastropheCounter++;

      let natureImages = [
        "https://upload.wikimedia.org/wikipedia/commons/0/00/Wildfire_in_California.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/4/4f/Wikipedia_Landslide.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Driving_through_flash_flood.jpg/1600px-Driving_through_flash_flood.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Haiti_earthquake_damage.jpg/1599px-Haiti_earthquake_damage.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/F5_tornado_Elie_Manitoba_2007.jpg/1600px-F5_tornado_Elie_Manitoba_2007.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Change_in_Average_Temperature.svg/1138px-Change_in_Average_Temperature.svg.png",
      ];

      let imageArray = [];
      let videoArray = [];

      const response = await fetch(
        "https://api.oceandrivers.com:443/v1.0/getWebCams/"
      );
      const json = await response.json();

      let fileTypeExpression = (fileTypeExpression = /(?:\.([^.]+))?$/);

      for (let children in json) {
        let result = json[children];
        let url = result.url;

        if (
          fileTypeExpression.exec(url)[1] == "png" ||
          fileTypeExpression.exec(url)[1] == "jpg"
        ) {
          imageArray.push(result);
        }
        if (fileTypeExpression.exec(url)[1] == "html") {
          videoArray.push(result);
        }
      }

      for (let index in imageArray) {
        if (index < imageArray.length) {
          if (catastropheCounter % 4 == 0) {
            images.value[index].imageURL =
              natureImages[
                Math.floor(random(0, Math.floor(natureImages.length)))
              ];
          } else {
            images.value[index].imageURL = imageArray[index].url;
          }
        }
      }
    }

    return { images, videos };
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

#goingPlaces_stage {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  max-height: 80vh;
  overflow-x: auto;
  overflow-y: hidden;
}
#goingPlaces_stage img {
  height: 40vh;
}

#goingPlaces_stage_videos {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 30vh;
  overflow-x: auto;
  overflow-y: hidden;
  position: absolute;
  top: 300px;
  // top: 300px;
}
#goingPlaces_stage_videos iframe {
  height: 600px !important;
  width: auto !important;
  display: block;
  position: absolute;
  z-index: 200;
}
</style>
