"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch = require("minimatch");
function sleep(time = 0) {
    return new Promise(res => {
        setTimeout(() => res(), time);
    });
}
exports.sleep = sleep;
function flattenStories(stories) {
    return stories.reduce((acc, storyKind) => [...acc, ...storyKind.stories.map(story => ({ kind: storyKind.kind, story }))], []);
}
exports.flattenStories = flattenStories;
function filterStories(flatStories, include, exclude) {
    const conbined = flatStories.map(s => (Object.assign({}, s, { name: s.kind + "/" + s.story })));
    const included = include.length ? conbined.filter(s => include.some(rule => minimatch(s.name, rule))) : conbined;
    const excluded = exclude.length ? included.filter(s => !exclude.every(rule => minimatch(s.name, rule))) : included;
    return excluded.map(({ kind, story }) => ({ kind, story }));
}
exports.filterStories = filterStories;
exports.execParalell = (tasks, runners) => {
    const copied = tasks.slice();
    const results = [];
    const p = runners.length;
    if (!p)
        throw new Error("No runners");
    return Promise.all(new Array(p).fill("").map((_, i) => new Promise((res, rej) => {
        function next() {
            const t = copied.shift();
            return t == null ? Promise.resolve(res()) : t(runners[i])
                .then((r) => results.push(r))
                .then(next)
                .catch(rej);
        }
        return next();
    }))).then(() => results);
};
