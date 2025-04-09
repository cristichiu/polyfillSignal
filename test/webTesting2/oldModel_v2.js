class State {
    constructor(val = null) {
        this.value = val
        this.sinks = []
        this.sources = []
        this.dirty = false
        this.computed = true
        /*
         * dirty, not computed
         * dirty, computed
         * clean, not computed
         * clean, computed
        */
    }
    set(val = null) {
        this.setDirty()
        if(val === this.value) return this.unSetDirty()
        this.value = val
        this.dirty = false
        this.computed = true
        for(let i=0; i<this.sinks.length; i++) {
            this.sinks[i].set()
        }
    }
    setDirty() {
        this.dirty = true
        this.computed = false
        for(let i=0; i<this.sinks.length; i++) {
            this.sinks[i].setDirty()
        }
    }
    unSetDirty() {
        let dirtySources = false
        for(let i=0; i<this.sources.length; i++) {
            if(this.sources[i].dirty) {
                dirtySources = true
                break
            }
        }
        if(dirtySources) return
        this.dirty = false
        this.computed = false
        for(let i=0; i<this.sinks.length; i++) {
            this.sinks[i].unSetDirty()
        }
    }
    get() { return this.value }
    addSinks(sink) {
        this.sinks.push(sink)
    }
    addSources(source) {
        this.sources.push(source)
    }
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
        if(this.dirty) {
            const newVal = this.callback()
            if(this.value === newVal) this.unSetDirty()
            this.value = newVal
            this.dirty = false
            this.computed = true
        }
        for(let i=0; i<this.sinks.length; i++) {
            this.sinks[i].set()
        }
    }
}
