<template>
  <span class="tag">#{{ projectDetails.topic }}</span>
  <h1>{{projectDetails.name}}</h1>
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

<style>
</style>