"use strict";
/**
 * IP-Sim Main Entry Point
 * Redirects from the landing page to the dashboard.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Redirect to the main dashboard after a brief loading display
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1200);
});
