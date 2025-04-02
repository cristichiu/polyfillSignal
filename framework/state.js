export class State {
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

export class Computed extends State {
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
