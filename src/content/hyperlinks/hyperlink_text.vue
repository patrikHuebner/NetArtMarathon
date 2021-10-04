<template>
  <span class="tag">#{{ projectDetails.topic }}</span>
  <h2>{{projectDetails.name}}</h2>
</template>

<script>
import { ref } from "vue";
import { getProjectDetails } from "../../utils/utils";

export default {
  setup() {
    const projectDetails = ref(getProjectDetails());

    return { projectDetails };
  },
};
</script>

<style lang="scss">
</style>
