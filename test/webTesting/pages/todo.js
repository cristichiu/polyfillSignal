import { Computed,State } from "../state.js"

const task = new State("")
const tasks = new State([])

new Computed(() => { task.set(task.get().replace(/[<>]/, "")) })

export default new Computed(() => {
    function script(){
        const taskInp = document.getElementById("task")
        const addBut = document.getElementById("add")
        taskInp.addEventListener("input", () => { task.set(taskInp.value) })
        addBut.addEventListener("click", () => {
            tasks.set([...tasks.get(), task.get()])
            task.set("")
        })
    }
    return [`
<div>
    <input type="text" value="${task.get()}" placeholder="Your task" id="task" />
    <div>Task: ${task.get()}</div>
    <button id="add">Add</button>
    ${tasks.get().map(t => { return `<div>${t}</div>` }).join("\n")}
</div>
`, script]
})
