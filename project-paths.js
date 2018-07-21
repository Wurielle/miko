let ProjectPaths = function(environments) {
    this.envs = envs = environments;
    let _this = this;
    this.toPUBLIC = function() {
        let path = './';
        return path;
        // index.html (main page) is in the "public" folder
    };
    this.toPUBLICPath = function() {
        let path = '/';
        return path;
        // index.html (main page) is in the "public" folder
    };
    this.toSRC = function() {
        let path = './src/';
        return path;
        // your source folder where your source js, sass, ts, ... folders will be
    };
    this.toDIST = function() {
        let path = "assets/";
        if (envs.devServer) {
            path = './' + path;
        } else {
            // path = "assets/"; //+ "distFolder"
        }
        return path
        // your output folder where your compiled js, css, ... folders will be
    };
    this.toAssetsExport = function() {
        let path = _this.toDIST() +'export/';
        return path;
        // your source folder where your source js, sass, ts, ... folders will be
    };
    this.styles = function() {
        return _this.toSRC() + 'sass/ui'
        // allows you to call quickly files from the sass folder (e.g: require(@styles/_variables.sass)). See Webpack Aliases
    };
    this.toAssets = function() {
        // From the css output to the assets directory
        let path = _this.toSRC() + 'assets/';
        return path;
        // adjusts css path files depending on the environment
    }
};

module.exports = ProjectPaths;