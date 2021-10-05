<template>
  <div class="row">
    <div class="col">
      <!-- <TopicAbstract :topic="projectDetails.topic" /> -->
      <!-- <ResearchLinkList :topic="projectDetails.topic" /> -->
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getProjectDetails } from "../utils/utils";
import ResearchLinkList from "../components/researchLinkList.vue";
import TopicAbstract from "../components/topicAbstract.vue";

export default {
  components: {
    ResearchLinkList,
    TopicAbstract,
  },
  name: "ProjectFooter",
  setup() {
    const projectDetails = ref(getProjectDetails());
    return { projectDetails };
  },
};
</script>

<style>
</style>