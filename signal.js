module.exports = class Signal {
    static consumers = []
    static origin = null
    static modified = new Set()
    static curent = () => {
        return Signal.consumers[Signal.consumers.length-1] || null
    }
    static State = class {
        constructor(val) {
            this.value = val
            this.sinks = new Set()
            this.dirty = false
            this.node = null
        }
        set(val) {
            if(this.value === val) return
            this.makeDirty()
            if(this.dirty) {
                this.value = val
                this.dirty = false
                Signal.modified.add(this)
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
        }
        get() {
            if(!Signal.origin) Signal.origin = this
            let active = Signal.curent()
            if (active) {
                this.sinks.add(active);
                active.sources.add(this);
                if(!active.node) active.node = this
            }
            if (this.dirty) {
                this.verifyPrimaryNode()
            }
            if(this == Signal.origin) {
                Signal.modified.clear()
                Signal.origin = null
            }
            return this.value;
        }
        makeClean() {
            if(!this.dirty) return
            Signal.consumers.push(this)
            this.node = null
            let val = this.callback()
            if(val === this.value) {
                this.dirty = false
                this.sinks.forEach(l => l.noCalcNeed())
            } else {
                this.value = val
                Signal.modified.add(this)
            }
            Signal.consumers.pop()
            this.dirty = false
        }
        noCalcNeed() {
            if(this.sources.intersection(Signal.modified).size) return
            let foundOneDirty = false
            this.sources.forEach(s => { if(s.dirty) foundOneDirty = true })
            if(foundOneDirty) return
            this.dirty = false
            this.modified = false
            this.sinks.forEach(l => l.noCalcNeed())
        }
    }
}