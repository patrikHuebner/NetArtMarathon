<template>
  <div class="row">
    <div class="col">
      <span class="tag">#{{ projectDetails.topic }}</span>
      <h2>{{projectDetails.name}}</h2>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getProjectDetails } from "../utils/utils";

export default {
  name: "ProjectHeader",
  setup() {
    const projectDetails = ref(getProjectDetails());

    return { projectDetails };
  },
};
</script>

<style>
</style>