import Application from './src/Application';
import moment from 'moment';

moment.locale('precise-en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d seconds",
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

(() => {
    document.onreadystatechange = () => {
        if (document.readyState === "complete") {
            new Application(moment).execute();
        }
    };
})();