<template>
  <ProjectHeader />

  <div v-for="(story, index) in stories.slice().reverse()" :key="index" class="chatBox">
    <div :class="'chatBubble '+story.type">
      {{ story.content }}
    </div>
  </div>

  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { ref } from "@vue/reactivity";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    let stories = ref([]);
    let index = 0;

    tellMeAStory();

    setInterval(() => {
      tellMeAStory();
    }, 5000);

    async function tellMeAStory() {
      const response = await fetch(
        // "https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=random&prop=extracts&exchars=500&format=json"
        "https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=random&prop=extracts&exsentences=2&exlimit=1&explaintext=1&format=json"
      );
      const json = await response.json();

      for (let children in json.query.pages) {
        let result = json.query.pages[children].extract;
        if (result != "") {
          let chatData = {
            content: result,
            type: null,
          };

          if (index % 2 == 0) {
            chatData.type = "send";
          } else {
            chatData.type = "receive";
          }

          stories.value.push(chatData);

          index++;
        } else {
          tellMeAStory();
        }
      }
    }

    return { stories, tellMeAStory };
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

.chatBox {
  display: flex;
  max-width: 100%;
  flex-direction: column;
}
.chatBubble {
  max-width: 60%;
  word-wrap: break-word;
  margin-bottom: 12px;
  line-height: 24px;
  position: relative;
  padding: 10px 20px;
  border-radius: 25px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 25px;
  }
}

.send {
  background-color: #0b93f6;
  color: #fff;
  // @include theme(background-color, primaryColor);
  // @include theme(color, backgroundColor);
  align-self: flex-end;

  &:before {
    right: -7px;
    width: 20px;
    background-color: #0b93f6;
    // @include theme(background-color, primaryColor);
    border-bottom-left-radius: 16px 14px;
  }

  &:after {
    right: -26px;
    width: 26px;
    @include theme(background-color, backgroundColor);
    border-bottom-left-radius: 10px;
  }
}
.receive {
  @include theme(background-color, primaryColor);
  @include theme(color, backgroundColor);
  align-self: flex-start;

  &:before {
    left: -7px;
    width: 20px;
    @include theme(background-color, primaryColor);
    border-bottom-right-radius: 16px 14px;
  }

  &:after {
    left: -26px;
    width: 26px;
    @include theme(background-color, backgroundColor);
    border-bottom-right-radius: 10px;
  }
}
</style>
