class State {
    constructor(val = null) {
        this.value = val
        this.sinks = []
        this.sources = []
        this.dirty = false
        this.modified = true
    }
    set(val) {
        if(this.value === val) return
        this.setDirtyFlags()
        this.value = val
        this.dirty = false
        this.modified = true
        for(let i=0; i<this.sinks.length; i++) this.sinks[i].set()
    }
    setDirtyFlags() {
        this.dirty = true
        this.modified = false
        for(let i=0; i<this.sinks.length; i++) this.sinks[i].setDirtyFlags()
    }
    get() { return this.value }
    addSinks(sink) { this.sinks.push(sink) }
    addSources(source) { this.sources.push(source) }
}

class Computed extends State {
    constructor(callback, sources) {
        super()
        this.callback = callback
        this.value = this.callback()
        for(let i=0; i<sources.length; i++) {
            this.sources.push(sources[i])
            sources[i].addSinks(this)
        }
    }
    set() {
        let sourcesModified = false
        for(let i=0; i<this.sources.length; i++) if(this.sources[i].modified) { sourcesModified = true; break }
        if(sourcesModified && !this.modified) {
            let val = this.callback()
            if(this.value !== val) {
                this.value = val
                this.dirty = false
                this.modified = true
            } else {
                this.dirty = false
                this.modified = false
            }
        }
        for(let i=0; i<this.sinks.length; i++) this.sinks[i].set()
    }
}

// let st = new State(0)
// let cm = new Computed(() => { console.log("executed_cm"); return st.get() < 10 }, [st])
// let cm2 = new Computed(() => { console.log("executed_cm2"); return cm.get() ? "Is less then 10" : "Is greater or equal to 10" }, [cm])
// let cm3 = new Computed(() => { console.log("executed_cm3"); return cm.get() ? "haha" : "hihi" }, [cm])
// st.set(15)

const n = new State(0)
const isOdd = new Computed(() => { console.log(1); return n.get() % 2 }, [n])
const result = new Computed(() => { console.log(2); return isOdd.get() ? "odd" : "even" }, [isOdd])
new Computed(() => {
    console.log(3)
    return `${n.get()} ${result.get()}`
}, [n, result])
n.set(2)
