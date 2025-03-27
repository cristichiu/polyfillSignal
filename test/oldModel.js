class State {
    constructor(val = null) {
        this.value = val
        this.newValue = val
        this.sinks = []
        this.sources = []
    }
    set(val = null) {
        if(this.value == val) return
        this.value = val
        this.setNextValues()
    }
    setNextValues() {
        for(let i=0; i<this.sinks.length; i++) {
            if(this.sinks[i].set()) continue
            this.sinks[i].setNextValues()
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
        const newVal = this.callback()
        if(this.value === newVal) return 1
        this.value = newVal
        return 0
    }
}
