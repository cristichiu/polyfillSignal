class Signal {
    static consumers = []
    static curent = () => {
        return Signal.consumers[Signal.consumers.length-1] || null
    }
    static State = class {
        constructor(val) {
            this.value = val
            this.sinks = new Set()
            this.dirty = false
            this.node = null
            this.modified = true
        }
        set(val) {
            if(this.value === val) return
            this.makeDirty()
            if(this.dirty) {
                this.value = val
                this.dirty = false
                this.modified = true
            }
        }
        get() {
            let active = Signal.curent()
            if(active) {
                this.sinks.add(active)
                active.sources.add(this)
                if(!active.node) active.node = this
            }
            return this.value
        }
        makeDirty() {
            this.dirty = true
            this.modified = false
            this.sinks.forEach(s => s.makeDirty())
        }
        verifyPrimaryNode() {
            if(this.node && this.node.dirty) {
                this.node.verifyPrimaryNode()
                this.makeClean()
            } else {
                if(this.dirty) this.makeClean()
            }
        }
    }
    static Computed = class extends Signal.State {
        constructor(callback) {
            super()
            this.sources = new Set()
            this.callback = callback
            this.dirty = true
            this.modified = false
        }
        get() {
            let active = Signal.curent()
            if (active) {
                this.sinks.add(active);
                active.sources.add(this);
                if(!active.node) active.node = this
            }
            if (this.dirty) {
                this.verifyPrimaryNode()
            }
            return this.value;
        }
        makeClean() {
            if(!this.dirty) return
            Signal.consumers.push(this)
            this.node = null
            let val = this.callback()
            if(val === this.value) {
                this.sinks.forEach(l => l.noCalcNeed())
            } else {
                this.value = val
                this.modified = true
            }
            Signal.consumers.pop()
            this.dirty = false
        }
        noCalcNeed() {
            let foundOneMod = false
            this.sources.forEach(s => { if(s.modified) { foundOneMod = true; }})
            if(foundOneMod) return
            this.dirty = false
            this.modified = false
            this.sinks.forEach(l => l.noCalcNeed())
        }
    }
}

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

const a = new Signal.State(0)
const b = new Signal.Computed(() => { console.log(1); return !(a.get()%2) })
const c = new Signal.Computed(() => { console.log(2); return b.get() ? "even":"odd" })
const s = new Signal.Computed(() => {
    console.log(3)
    return `${c.get()} is ${a.get()}`
})
console.log(s.get())
a.set(2)
console.log(s.get())