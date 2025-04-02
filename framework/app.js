import { Computed, State } from "./state.js"

import todo from "./todo.js"
import counter from "./counter.js"
import randomNumSum from "./randomNumSum.js"

const params = new URLSearchParams(window.location.search)
const page = params.get("page")

export default new Computed(() => {
    let res = `
<a href="?page=todo">todo</a>
<a href="?page=counter">counter</a>
<a href="?page=random">random</a>
    `
    switch(page) {
        case "todo": { return [res+todo.get()[0], todo.get()[1]] }
        case "counter": { return [res+counter.get()[0], counter.get()[1]] }
        case "random": { return [res+randomNumSum.get()[0], randomNumSum.get()[1]] }
    }
}, [todo, counter, randomNumSum])