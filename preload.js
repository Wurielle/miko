var ipcRenderer = require('electron').ipcRenderer;
window.addEventListener("click", function (e) {
    ipcRenderer.sendToHost('click', e);
});
function executeScript(source) {
    var el = document.createElement("script");
    el.src = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    document.head.appendChild(el);
}
ipcRenderer.on('injection', function(event, source){
    eval(source);
    // executeScript(source);
});