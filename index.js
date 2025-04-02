class State {
    constructor(val = null) {
        this.value = val
        this.sinks = []
        this.sources = []
        this.dirty = false
        this.modified = true
    }
    set(val) {
        if(this.value === val) {
            this.modified = false
            this.dirty = false
            return
        }
        this.setDirtyFlags()
        this.value = val
        this.dirty = false
        this.modified = true
        for(let i=0; i<this.sinks.length; i++) this.sinks[i].update()
    }
    setDirtyFlags() {
        if(this.dirty) return
        this.dirty = true
        this.modified = false
        for(let i=0; i<this.sinks.length; i++) this.sinks[i].setDirtyFlags()
    }
    get() {
        if(this.dirty) {
            const error = new Error("Dirty variable detected. Something went wrong!")
            error.name = "InternalError"
            throw error
        }
        return this.value
    }
    addSinks(sink) { this.sinks.push(sink) }
    addSources(source) { this.sources.push(source) }
}

class Computed extends State {
    constructor(callback, sources = []) {
        super()
        this.callback = callback
        this.value = this.callback()
        for(let i=0; i<sources.length; i++) {
            this.addSources(sources[i])
            sources[i].addSinks(this)
        }
    }
    update() {
        if(!this.dirty) return
        let stillHasDirtySources = false
        for(let i=0; i<this.sources.length; i++) if(this.sources[i].dirty) { stillHasDirtySources = true; break }
        if(stillHasDirtySources) return
        let sourcesModified = false
        for(let i=0; i<this.sources.length; i++) if(this.sources[i].modified) { sourcesModified = true; break }
        let val = (sourcesModified && !this.modified && this.dirty) ? this.callback() : this.value
        this.set(val)
        for (let i = 0; i < this.sinks.length; i++) this.sinks[i].update()
    }
}

// let st = new State(0)
// let cm = new Computed(() => { console.log("executed_cm"); return st.get() < 10 }, [st])
// let cm2 = new Computed(() => { console.log("executed_cm2"); return cm.get() ? "Is less then 10" : "Is greater or equal to 10" }, [cm])
// let cm3 = new Computed(() => { console.log("executed_cm3"); return cm.get() ? "haha" : "hihi" }, [cm])
// st.set(15)

// console.log('init')
// const n = new State(0)
// const isOdd = new Computed(() => { console.log(1); return n.get() % 2 }, [n])
// const result = new Computed(() => { console.log(2); return isOdd.get() ? "odd" : "even" }, [isOdd])
// const a = new Computed(() => {
//     console.log(3)
//     return `${n.get()} ${result.get()}`
// }, [result, n])
// console.log("set from 0 to 1")
// n.set(1)
// console.log("set from 1 to 3")
// n.set(3)

// const a = new State(0)
// const b = new State(0)
// const sum = new Computed(() => { console.log(1); return a.get() + b.get() }, [a, b])
// const isOdd = new Computed(() => { console.log(2); return sum.get() % 2 }, [sum])
// const result = new Computed(() => { console.log(3); return isOdd.get() ? "odd" : "even" }, [isOdd])
// const calc = new Computed(() => {
//     console.log(4)
//     return `Sum of ${a.get()} and ${b.get()} is ${sum.get()} and it is ${result.get()}`
// }, [a, b, result, sum])
// const display = new Computed(() => {
//     console.log(calc.get())
//     return calc.get()
// }, [calc])
// a.set(2)
// b.set(3)

// const a = new State(0)
// const b = new Computed(() => { console.log(1); return a.get()*2 }, [a])
// const c = new Computed(() => { console.log(2); return b.get()*2 }, [b])
// b.addSources(c)
// c.addSinks(b)
// a.set(1)

// const a = new State(0)
// const b = new Computed(() => { console.log(1); return a.get()+1 }, [a])
// const c = new Computed(() => { console.log(2); return a.get()+2 }, [a])
// const d = new Computed(() => { console.log(3); return b.get()+c.get() }, [b,c])
// new Computed(() => { console.log("result", d.get()) }, [d])
// a.set(1)
