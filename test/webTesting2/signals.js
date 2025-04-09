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
