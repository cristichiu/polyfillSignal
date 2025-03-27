// EX 1
const input = document.getElementById("task")
const inp = document.getElementById("inp")
const add = document.getElementById("add")
const tasks = document.getElementById("tasks")

const input_val = new State("")
const list = new State([])

input.addEventListener("input", () => {
    input_val.set(input.value)
    input.value = input_val.get()
})
add.addEventListener("click", () => {
    list.set([...list.get(), input_val.get()])
    input.value = ""
    input_val.set("")
})

new Computed(() => { inp.innerText = input_val.get() }, [input_val])
new Computed(() => {
    tasks.innerHTML = ""
    list.get().forEach(l => {
        tasks.innerHTML += `<div>${l}</div>`
    })
}, [list])

// EX 2
const num = document.getElementById("num")
const inc1 = document.getElementById("inc1")
const inc2 = document.getElementById("inc2")
const n = new State(0)
inc1.addEventListener("click", () => { n.set(n.get()+1) })
inc2.addEventListener("click", () => { n.set(n.get()+2) })
const isOdd = new Computed(() => { console.log(1); return n.get() % 2 }, [n])
const result = new Computed(() => { console.log(2); return isOdd.get() ? "odd" : "even" }, [isOdd])
new Computed(() => {
    console.log(3)
    num.innerText = `${n.get()} - ${result.get()}`
    return num.innerText
}, [n, result])
