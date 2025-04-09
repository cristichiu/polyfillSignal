import { Computed, State } from "./state.js"

import todo from "./pages/todo.js"
import counter from "./pages/counter.js"
import randomNumSum from "./pages/randomNumSum.js"

const params = new URLSearchParams(window.location.search)
const page = params.get("page")

export default new Computed(() => {
    function script() {
        switch(page) {
            case "todo": todo.get()[1](); break
            case "counter": counter.get()[1](); break
            case "random": randomNumSum.get()[1](); break
        }
    }
    return [`
<a href="?page=todo">todo</a>
<a href="?page=counter">counter</a>
<a href="?page=random">random</a>
${page=="todo" ? todo.get()[0] : ""}
${page=="counter" ? counter.get()[0] : ""}
${page=="random" ? randomNumSum.get()[0] : ""}
`, script]
}, [todo, counter, randomNumSum])
