import Application from './src/app';

(() => {
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                let moment = require('moment');
                moment.locale('precise-en', {
                    relativeTime: {
                        future: "in %s",
                        past: "%s ago",
                        s: "%d seconds", //see https://github.com/timrwood/moment/pull/232#issuecomment-4699806
                        m: "a minute",
                        mm: "%d minutes",
                        h: "an hour",
                        hh: "%d hours",
                        d: "a day",
                        dd: "%d days",
                        M: "a month",
                        MM: "%d months",
                        y: "a year",
                        yy: "%d years"
                    }
                });
                let app = new Application(moment);
                app.execute();
            }
        };
    })();