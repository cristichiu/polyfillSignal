import app from "./app.js"
import { Computed, State, Signal } from "./state.js"


let a = new Computed(() => {
    const activeElement = document.activeElement;
    let selectionStart, selectionEnd;
    if (activeElement && activeElement.tagName === "INPUT") {
        selectionStart = activeElement.selectionStart;
        selectionEnd = activeElement.selectionEnd;
    }

    let getApp = app.get()
    document.getElementById("root").innerHTML = getApp[0]
    if(typeof(app.get()[1]) == "function") getApp[1]()

    if (activeElement && activeElement.id) {
        const restoreFocus = document.getElementById(activeElement.id);
        if (restoreFocus) {
            restoreFocus.focus();
            if (restoreFocus.tagName === "INPUT") restoreFocus.setSelectionRange(selectionStart, selectionEnd)
        }
    }
    return getApp[0]
})
Signal.watcher.add(a)
a.get()