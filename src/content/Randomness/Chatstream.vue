<template>
  <ProjectHeader />

  <div id="chatBoxContainer">
    <transition-group name="list" tag="div">
      <div v-for="(story, index) in stories" :key="index" class="chatBox">
        <div :class="'chatBubble list-item '+story.type">
          <!-- {{ story.content }} -->
          <div v-html="story.content"></div>
        </div>
      </div>
    </transition-group>
  </div>

  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-dom";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    let stories = ref([]);
    let index = 0;
    let requestInterval = null;

    let userHasScrolled = false;
    window.addEventListener("wheel", (e) => {
      userHasScrolled = true;
    });

    onUnmounted(() => {
      clearInterval(requestInterval);
    });

    tellMeAStory();

    requestInterval = setInterval(() => {
      tellMeAStory();
    }, Math.random() * 4000 + 3000);

    async function tellMeAStory(actionCode) {
      // Remove last entry from array (the typing bubble)
      if (actionCode != "dont remove") {
        stories.value.pop();
      }

      const response = await fetch(
        // "https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=random&prop=extracts&exchars=500&format=json"
        "https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=random&prop=extracts&exsentences=2&exlimit=1&explaintext=1&format=json"
      );
      const json = await response.json();

      for (let children in json.query.pages) {
        let result = json.query.pages[children].extract;
        if (result != "") {
          // The actual content bubble
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

          // The "typing" bubble
          let typing = {
            content:
              '<div class="typing"> <span></span>  <span></span>  <span></span> </div>',
            type: null,
          };
          if (index % 2 == 0) {
            typing.type = "receive";
          } else {
            typing.type = "send";
          }
          stories.value.push(typing);

          // Scroll to bottom of page
          if (!userHasScrolled) {
            let element = document.body;
            element.scrollIntoView({ behavior: "smooth", block: "end" });
          }

          // The index is used to determine if a post is of form "send" or "receive"
          index++;
        } else {
          tellMeAStory("dont remove");
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

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

$dot-width: 7px;
$speed: 1.5s;

.receive .typing span {
  background: #000;
}
.send .typing span {
  background: #fff;
}

.typing {
  position: relative;
  width: 40px;
  height: 25px;

  span {
    content: "";
    animation: blink $speed infinite;
    animation-fill-mode: both;
    height: $dot-width;
    width: $dot-width;
    // background: $dot-color;
    position: absolute;
    left: 7px;
    top: 10px;
    border-radius: 50%;

    &:nth-child(2) {
      animation-delay: 0.2s;
      margin-left: $dot-width * 1.5;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
      margin-left: $dot-width * 3;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0.1;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
