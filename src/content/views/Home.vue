<template>
  <div class="row">
    <div class="col col-12 col-md-6 col-lg-6" style="font-size: calc(9vw + 24px); margin-top: 50px; line-height: 1;">
      Net Art Marathon
    </div>
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
