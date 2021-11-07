<template>
<ProjectHeader />
<div style="font-size: 30px; float: left; margin-right: 10px;">&#9432;</div> Click on any element to discover a new web of connections. Zoom to scroll in and out. Click+drag to move around.
<div id="WebContainer"></div>
<div id="hyperlink_networkContainer"></div>
<ProjectFooter />
</template>

<script>
import ProjectHeader from "../../components/project_header.vue";
import ProjectFooter from "../../components/project_footer.vue";
import { onMounted, ref } from "@vue/runtime-dom";

import { DataSet, Network } from 'vis-network/standalone';

export default {
    components: {
        ProjectHeader,
        ProjectFooter,
    },
    setup() {
        let websiteToLoad = ref("https://www.timrodenbroeker.de/resources");
        let objectIndex = 0;

        onMounted(() => {
            loadWebsite(websiteToLoad.value).then((urls) => {
                createNetwork(urls);
            });
        });

        function createNetwork(urls) {
            // CREATE NODES
            // Fill nodeArray with urls
            let nodeContent = [];
            for (let index in urls) {
                // Only use "real" hyperlinks, no anchor jumps
                if (urls[index].charAt(0) != '#' && urls[index].charAt(0) != '/') {
                    let node = {
                        id: objectIndex,
                        label: urls[index],
                        title: urls[index],
                    }
                    objectIndex++;
                    nodeContent.push(node);
                }
            }
            // Push root node
            let rootNode = {
                id: objectIndex,
                label: websiteToLoad.value,
                title: websiteToLoad.value,
            }
            objectIndex++;
            nodeContent.push(rootNode);
            // Create node dataset
            let nodes = new DataSet(nodeContent);



            // CREATE EDGES
            let edgeContent = [];
            for (let index in nodeContent) {
                let node = {
                    from: nodeContent[index].id,
                    to: rootNode.id
                }
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
            let options = {
                nodes: {
                    shape: "dot",
                    scaling: {
                        min: 10,
                        max: 30,
                    },
                    font: {
                        size: 12,
                        face: "Source Code Pro Bold",
                        color: "#ffffff"
                    },
                    color: {
                        // border: "#ffffff",
                        border: "#000000",
                        background: '#0000ff',
                    }
                },
                edges: {
                    width: .5,
                    color: '#ffffff',
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
            let network = new Network(container, data, options);            
                
            // setTimeout(() => {
            //     options.edges.color = '#000000';
            //     options.nodes.font.color = '#000000';
            //     options.nodes.color.border = '#ffffff';
            //     network.setOptions(options);
            // }, 500);


            //
            network.on("hoverNode", function (params) {
                network.canvas.body.container.style.cursor = 'pointer'
            });
            network.on("blurNode", function (params) {
                network.canvas.body.container.style.cursor = 'default'
            });


            // ATTACH NETWORK CLICK EVENTS
            network.on("click", function (params) {
                if (params.nodes.length > 0) {
                let nodeID = params.nodes[0];
                let reference = nodeContent.find(x => x.id === nodeID);

                if (reference != undefined) {
                    websiteToLoad.value = reference.label;
                    let sourceReferenceID = reference.id;

                    loadWebsite(websiteToLoad.value).then((urls) => {
                        // NODEX
                        if (urls.length > 0) {
                            for (let index in urls) {
                                // Only use "real" hyperlinks, no anchor jumps
                                if (urls[index] != null) {
                                if (urls[index].charAt(0) != '#' && urls[index].charAt(0) != '/') {
                                    let node = {
                                        id: objectIndex,
                                        label: urls[index],
                                        title: urls[index],
                                    }
                                    nodes.update(node);
                                    nodeContent.push(node);

                                    let edge = {
                                        from: objectIndex,
                                        to: sourceReferenceID
                                    }
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
            return new Promise(resolve => {
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

                        resolve(urls);
                        //console.log(urls)
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
            });
        }

        return {websiteToLoad};
    },
};
</script>

<style lang="scss">
@import "../../assets/styles/theming.scss";

#hyperlink_networkContainer {
    width: 100vw;
    height: 70vh;
    display: block;
}
</style>
