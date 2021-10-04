import { useRoute } from "vue-router";
import { useStore } from "vuex";

const getProjectDetails = () => {
    const store = useStore();
    const route = useRoute();
    const projectName = route.name;
    return store.state.routing.content.filter((i) =>
        projectName.includes(i.name)
    )[0];
}

const radians = (angle) => {
    return angle * (Math.PI / 180);
};

const lerp = (min, max, amount) => {
    return min + amount * (max - min);
};

const map = (value, start1, stop1, start2, stop2) => {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

const random = (min, max) => {
    if (Object.prototype.toString.call(min) === '[object Array]') return min[~~(Math.random() * min.length)];

    if (typeof max !== 'number') {
        max = min || 1;
        min = 0;
    }

    return min + Math.random() * (max - min);
};


var support = (function () {
    if (!window.DOMParser) return false;
    var parser = new DOMParser();
    try {
        parser.parseFromString('x', 'text/html');
    } catch (err) {
        return false;
    }
    return true;
})();
const textToHTML = (str) => {
    // check for DOMParser support
    if (support) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body.innerHTML;
    }

    // Otherwise, create div and append HTML
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
};


export { getProjectDetails, radians, lerp, map, random, textToHTML }