import { Computed,State } from "../state.js"

const n = new State(0)
const isOdd = new Computed(() => { return n.get() % 2 }, [n])
const result = new Computed(() => { return isOdd.get() ? "odd" : "even" }, [isOdd])

export default new Computed(() => {
    function script(){
        const inc1 = document.getElementById("inc1")
        const inc2 = document.getElementById("inc2")
        inc1.addEventListener("click", () => { n.set(n.get()+1) })
        inc2.addEventListener("click", () => { n.set(n.get()+2) })
    }
    return [`
<div style="border: 1px solid black; padding: 1rem">
    <div id="num">${n.get()} - ${result.get()}</div>
    <button id="inc1">inc by one</button>
    <button id="inc2">inc by two</button>
</div>
`, script]
}, [n, result])
