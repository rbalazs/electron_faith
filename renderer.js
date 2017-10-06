(function () {
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            let Application = require('./src/app');
            let app = new Application();
            app.execute();
        }
    };
})();