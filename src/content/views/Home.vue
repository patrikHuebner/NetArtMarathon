<template>
  <div style="font-size: 170px; margin-top: 50px; line-height: 1;">
    NetArt Marathon
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-dom";
import { useStore } from "vuex";

export default {
  name: "Home",
  components: {},
  setup() {
    const store = useStore();

    onMounted(() => {});

    return { store };
  },
};
</script>


<style lang="scss">
</style>
