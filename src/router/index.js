import { createRouter, createWebHistory } from 'vue-router'

// Load topics.json, parse all content and build route object
async function parsePagesAndTopics() {
  let routes = {
    pages: [],
    topics: [],
    combined: [],
  }

  // Load and await JSON file
  const response = await fetch(process.env.BASE_URL + `content/content.json`);
  const json = await response.json();

  // Load and parse pages
  for (let page in json['pages']) {
    let route = {
      path: json['pages'][page].path,
      name: json['pages'][page].name,
      component: () => import('../content/views/' + json['pages'][page].view) // Lazy load only when requested
    }
    routes.pages.push(route);
  }
  routes.combined.push(...routes.pages);

  // Load and parse topics
  for (let page in json['topics']) {
    let route = {
      path: '/'+json['topics'][page].name,
      name: json['topics'][page].name,
      component: () => import('../content/views/Topic.vue')
    }
    routes.topics.push(route);
  }
  routes.combined.push(...routes.topics);


  return routes;
}


// Request the JSON, wait for it to be processed and then create/return the Router-object
async function newRouter() {
  return new Promise(resolve => {
    parsePagesAndTopics().then((routeData) => {

      let routes = routeData.combined;
      let router = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes
      });

      resolve(router);
    });
  });
}

export { newRouter, parsePagesAndTopics }
