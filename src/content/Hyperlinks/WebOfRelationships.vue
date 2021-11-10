<template>
  <ProjectHeader />
  <div style="font-size: 20px; float: left; margin-right: 10px">&#9432;</div>
  <div style="max-width: 500px">
    Click on any element to discover a new web of connections. Zoom to scroll in
    and out. Click+drag to move around.
  </div>

  <div class="spinner-box">
    <div class="three-quarter-spinner"></div>
  </div>

  <div class="inputFieldForWeb">
    <input
      v-on:keyup.enter="loadNewWebsite"
      type="text"
      :value="websiteToLoad"
      id="relation_webAddress"
      name="relation_webAddress"
      title="Enter any URL and press ENTER to explore it."
    />
  </div>

  <div id="hyperlink_networkContainer"></div>
  <div style="height: 100vh"></div>
  <ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { onMounted, ref, watch } from "@vue/runtime-dom";

import { DataSet, Network } from "vis-network/standalone";
import { useStore } from "vuex";

export default {
  components: {
    ProjectHeader,
    ProjectFooter,
  },
  setup() {
    const store = useStore();

    let websiteToLoad = ref("https://www.timrodenbroeker.de/resources");
    let objectIndex = 0;
    let network = null;
    let options = null;

    watch(
      () => store.getters.themeChange,
      function () {
        if (store.state.theme.mode == "dark") {
          options.edges.color = "#ffffff";
          options.nodes.font.color = "#ffffff";
          options.nodes.color.border = "#000000";
          network.setOptions(options);
        }
        if (store.state.theme.mode == "light") {
          options.edges.color = "#000000";
          options.nodes.font.color = "#000000";
          options.nodes.color.border = "#ffffff";
          network.setOptions(options);
        }
      }
    );

    onMounted(() => {
      loadWebsite(websiteToLoad.value).then((urls) => {
        createNetwork(urls);
      });
    });

    function isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }

    function loadNewWebsite() {
      let siteToLoad = document.getElementById("relation_webAddress").value;
      if (isValidHttpUrl(siteToLoad)) {
        websiteToLoad.value = siteToLoad;

        network.destroy();

        loadWebsite(websiteToLoad.value).then((urls) => {
          createNetwork(urls);
        });

        //console.log(websiteToLoad.value);
      }
    }

    function createNetwork(urls) {
      // CREATE NODES
      // Fill nodeArray with urls
      let nodeContent = [];
      for (let index in urls) {
        // Only use "real" hyperlinks, no anchor jumps
        if (urls[index].charAt(0) != "#" && urls[index].charAt(0) != "/") {
          let node = {
            id: objectIndex,
            label: urls[index],
            title: urls[index],
          };
          objectIndex++;
          nodeContent.push(node);
        }
      }
      // Push root node
      let rootNode = {
        id: objectIndex,
        label: websiteToLoad.value,
        title: websiteToLoad.value,
      };
      objectIndex++;
      nodeContent.push(rootNode);
      // Create node dataset
      let nodes = new DataSet(nodeContent);

      // CREATE EDGES
      let edgeContent = [];
      for (let index in nodeContent) {
        let node = {
          from: nodeContent[index].id,
          to: rootNode.id,
        };
        edgeContent.push(node);
      }
      let edges = new DataSet(edgeContent);
      // create a network
      let container = document.getElementById("hyperlink_networkContainer");
      let data = {
        nodes: nodes,
        edges: edges,
      };

      // NETWORK OPTIONS
      options = {
        nodes: {
          shape: "dot",
          scaling: {
            min: 10,
            max: 30,
          },
          font: {
            size: 12,
            face: "Source Code Pro Bold",
            color: "#ffffff",
          },
          color: {
            // border: "#ffffff",
            border: "#000000",
            background: "#0000ff",
          },
        },
        edges: {
          width: 0.5,
          color: "#ffffff",
          smooth: {
            type: "continuous",
          },
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -20000,
            springConstant: 0.005,
            springLength: 200,
          },
        },
        interaction: {
          tooltipDelay: 0,
          hideEdgesOnDrag: true,
          hover: true,
        },
      };

      // CREATE NETWORK
      network = new Network(container, data, options);

      //
      network.on("hoverNode", function (params) {
        network.canvas.body.container.style.cursor = "pointer";
      });
      network.on("blurNode", function (params) {
        network.canvas.body.container.style.cursor = "default";
      });

      // ATTACH NETWORK CLICK EVENTS
      network.on("click", function (params) {
        if (params.nodes.length > 0) {
          let nodeID = params.nodes[0];
          let reference = nodeContent.find((x) => x.id === nodeID);

          if (reference != undefined) {
            websiteToLoad.value = reference.label;
            let sourceReferenceID = reference.id;

            loadWebsite(websiteToLoad.value).then((urls) => {
              // NODEX
              if (urls.length > 0) {
                for (let index in urls) {
                  // Only use "real" hyperlinks, no anchor jumps
                  if (urls[index] != null) {
                    if (
                      urls[index].charAt(0) != "#" &&
                      urls[index].charAt(0) != "/"
                    ) {
                      let node = {
                        id: objectIndex,
                        label: urls[index],
                        title: urls[index],
                      };
                      nodes.update(node);
                      nodeContent.push(node);

                      let edge = {
                        from: objectIndex,
                        to: sourceReferenceID,
                      };
                      edges.update(edge);

                      objectIndex++;
                    }
                  }
                }
              }
            });
          }
        }
      });
    }

    function loadWebsite(websiteURL) {
      document
        .getElementsByClassName("spinner-box")[0]
        .classList.add("spinner-box-loading");
      return new Promise((resolve) => {
        fetch("https://shutdown.gallery:8443/?site=" + websiteURL, {
          mode: "cors",
        })
          .then((response) => response.text())
          .then((rawHTML) => {
            var doc = document.createElement("html");
            doc.innerHTML = rawHTML;
            var links = doc.getElementsByTagName("a");
            var urls = [];

            for (var i = 0; i < links.length; i++) {
              urls.push(links[i].getAttribute("href"));
            }

            document
              .getElementsByClassName("spinner-box")[0]
              .classList.remove("spinner-box-loading");
            resolve(urls);
            //console.log(urls)
          })
          .catch((error) => {
            console.warn(error);
          });
      });
    }

    return { websiteToLoad, loadNewWebsite };
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

.inputFieldForWeb {
  position: absolute;
  bottom: 30px;
  width: 100%;
  z-index: 1000;

  input[type="text"] {
    padding: 10px;
    min-width: 400px;
    left: 0;
    margin-left: calc(50vw - 200px);
    @include theme(background-color, backgroundColor);
    @include theme(color, primaryColor);
    @include theme(border, primaryColor, 1px solid);
  }
  input[type="submit"] {
    margin-left: 20px;
    padding: 5px;
  }
}

#hyperlink_networkContainer {
  outline: none;
  border: none;
  width: 100vw;
  height: 100vh;
  display: block;
  // position: absolute;
  top: 0;
  left: 0;
}

.spinner-box {
  display: none;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 200;
}
.spinner-box-loading {
  display: block;
}

.three-quarter-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #fb5b53;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.5s linear 0s infinite;
  position: fixed;
  pointer-events: none;
  left: calc(50vw - 20px);
  top: calc(50vh - 27px);
  pointer-events: none;
}

/* KEYFRAMES */

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
