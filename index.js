const Signal = require("./signal.js")
// const { Signal } = require("signal-polyfill")

// const a = new Signal.State(0)
// const b = new Signal.Computed(() => { console.log(1); return !(a.get()%2) })
// const c = new Signal.Computed(() => { console.log(2); return b.get() ? "even":"odd" })
// const s = new Signal.Computed(() => {
//     console.log(3)
//     return c.get()
// })
// console.log(s.get())
// a.set(1)
// console.log(s.get())

// const a = new Signal.State(0)
// const b = new Signal.State(1)
// const c = new Signal.State(2)
// const a1 = new Signal.Computed(() => { console.log("a"); return a.get() })
// const b1 = new Signal.Computed(() => { console.log("b"); return b.get() })
// const c1 = new Signal.Computed(() => { console.log("c"); return c.get() })

// const r = new Signal.Computed(() => {
//     console.log("r")
//     if(a1.get()) {
//         return b1.get()
//     } else {
//         return c1.get()
//     }
// })
// r.get()
// a.set(1)
// r.get()

// const a = new Signal.State(0)
// const b = new Signal.State(0)
// const sum = new Signal.Computed(() => { console.log(1); return a.get() + b.get() })
// const isOdd = new Signal.Computed(() => { console.log(2); return sum.get() % 2 })
// const result = new Signal.Computed(() => { console.log(3); return isOdd.get() ? "odd" : "even" })
// const calc = new Signal.Computed(() => {
//     console.log(4)
//     return `Sum of ${a.get()} and ${b.get()} is ${sum.get()} and it is ${result.get()}`
// })
// const display = new Signal.Computed(() => {
//     console.log(5)
//     return calc.get()
// })

// console.log(display.get())
// a.set(1)
// b.set(2)
// console.log(display.get())

// const a = new Signal.State(0)
// const a1 = new Signal.State(0)
// a1.set(3)
// const b = new Signal.Computed(() => { console.log(1); return !(a.get()%2) })
// const c = new Signal.Computed(() => { console.log(2); return b.get() ? "even":"odd" })
// const s = new Signal.Computed(() => {
//     console.log(3)
//     return `${c.get()} is ${a.get()}`
// })
// console.log(s.get())
// a.set(1)
// console.log(s.get())

// const a = new Signal.State(0)
// const b = new Signal.State(0)
// const a1 = new Signal.Computed(() => {console.log(1); return a.get()})
// const b1 = new Signal.Computed(() => {console.log(2); return b.get()})
// let i = 0
// const d = new Signal.Computed(() => {
//     console.log(3)
//     if(i) {
//         return a1.get()
//     } else {
//         return b1.get()
//     }
// })
// console.log("result", d.get())
// a.set(1)
// i = 1
// b.set(2)
// console.log("result", d.get())