if (typeof require === 'function'){
    const { ipcRenderer, remote } = require('electron');
    window.app.modules = {
        ipcRenderer,
        remote
    };
    let EventBus = window.app.EventBus;
    let ElectronBus = window.app.ElectronBus;

    ElectronBus.$on('toElectron', function(event) {
        ipcRenderer.send('toElectron', event);
    });

    ipcRenderer.on('toApp', (e, event) => {
        console.log(event.payload);
        ElectronBus.$emit('toApp', event);
    });
}
