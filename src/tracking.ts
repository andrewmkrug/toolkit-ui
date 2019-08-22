import * as ReactGA from 'react-ga';

import { serverVersion, desktopVersion, UI_VERSION } from './services/service-versions';

const GA_ID = process.env.GA_ID;

// Note that all tracking here is fully anonymous.
// No user information is tracked, and no events are
// sent including anything personally identifiable.
// Tracking is used only to monitor real world performance,
// and work out which features of the app are used
// and how much.

export function initTracking() {
    if (GA_ID) {
        ReactGA.initialize(GA_ID, { gaOptions: { siteSpeedSampleRate: 100 } });

        // dimension1 is version:server (so we can work out how many users have updated to which server version)
        serverVersion.then((version) => ReactGA.set({ 'dimension1': version }));

        // dimension2 is version:desktop (so we can work out how many users are using which desktop shell version)
        desktopVersion.then((version) => ReactGA.set({ 'dimension2': version }));

        // dimension3 is version:ui. We don't version the UI, so it's just the current commit hash
        ReactGA.set({ 'dimension3': UI_VERSION });

        ReactGA.timing({
            category: 'Initial load',
            variable: 'tracking-initialize',
            value: performance.now()
        });

        trackPage();

        window.addEventListener('DOMContentLoaded', () => {
            ReactGA.timing({
                category: 'Initial load',
                variable: 'page-load',
                value: performance.now()
            });
        });

        document.addEventListener('load:rendering', () => {
            ReactGA.timing({
                category: 'Initial load',
                variable: 'app-load',
                value: performance.now()
            });
        });

        window.addEventListener('load', () => {
            ReactGA.timing({
                category: 'Initial load',
                variable: 'load-event',
                value: performance.now()
            });
        });
    }
}

let lastUrl: string | undefined;
export function trackPage() {
    if (!GA_ID) return;

    const currentUrl = window.location.href;
    if (currentUrl === lastUrl) return;
    lastUrl = currentUrl;
    const currentPath = window.location.pathname + location.search;

    ReactGA.set({
        location: location.href,
        page: currentPath
    });
    ReactGA.pageview(currentPath);
}

export function trackEvent(event: ReactGA.EventArgs) {
    if (!GA_ID) return;
    ReactGA.event(event);
}