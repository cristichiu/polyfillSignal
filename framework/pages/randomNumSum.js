import { State, Computed } from "../state.js"

const max = new State(0)
const random1 = new Computed(() => {
    let random = Math.floor(Math.random() * max.get())
    console.log(random)
    return random
})
const random2 = new Computed(() => {
    let random = Math.floor(Math.random() * max.get())
    console.log(random)
    return random
})

export default new Computed(() => {
    function script() {
        const but = document.getElementById("but")
        but.addEventListener("click", () => { max.set(max.get()+1) })
    }
    return [`
<div>${random1.get()+random2.get()}</div>
<button id="but">add</button>
    `, script]
})