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


export { getProjectDetails, radians, lerp, map, random }