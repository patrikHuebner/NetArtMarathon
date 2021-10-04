<template>
  <div class="row">
    <div class="col">
      <!-- <ResearchLinkList :topic="projectDetails.topic" /> -->
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getProjectDetails } from "../utils/utils";
import ResearchLinkList from "../components/researchLinkList.vue";

export default {
  components: {
    ResearchLinkList,
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