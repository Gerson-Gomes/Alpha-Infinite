var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { submitPayment, checkPaymentStatus } from './api-client.js';
// ── Polling state ──────────────────────────────────────────────────
let pollingInterval = null;
let pollingTimeout = null;
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 600000; // 10 minutes
// ── DOM Ready ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const executeBtn = document.getElementById('execute-btn');
    if (executeBtn) {
        executeBtn.addEventListener('click', executeTransaction);
    }
    // Dismiss overlay when the close button is clicked
    const closeBtn = document.getElementById('payment-overlay-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hidePaymentOverlay);
    }
});
// ── Type toggle (global for HTML onclick) ──────────────────────────
window.setType = (type) => {
    document.getElementById('type').setAttribute('value', type);
    const btnCredit = document.getElementById('btn-credit');
    const btnDebit = document.getElementById('btn-debit');
    if (type === 'CREDIT_SPOT') {
        btnCredit.className = 'type-btn type-btn--active';
        btnDebit.className = 'type-btn';
    }
    else {
        btnDebit.className = 'type-btn type-btn--active';
        btnCredit.className = 'type-btn';
    }
};
// ══════════════════════════════════════════════════════════════════
//  MAIN TRANSACTION FLOW
// ══════════════════════════════════════════════════════════════════
function executeTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        const amountVal = document.getElementById('amount').value;
        const typeVal = document.getElementById('type').value;
        const installmentsVal = document.getElementById('installments').value;
        const payload = {
            amount: parseFloat(amountVal),
            type: typeVal,
            installments: parseInt(installmentsVal),
            cardNumber: '4000123456789010',
            cardHolder: 'SIMULATED USER',
            cardExpiry: '12/30',
        };
        addLog('Request', 'POST /api/transactions', JSON.stringify(payload, null, 2));
        try {
            const start = Date.now();
            const data = yield submitPayment(payload);
            const latency = Date.now() - start;
            // Extend with latency for display
            const displayData = Object.assign(Object.assign({}, data), { latency_ms: latency });
            addLog('Response', `200 OK`, JSON.stringify(displayData, null, 2), true);
            // ── InfinitePay checkout flow ──────────────────────────
            if (data.checkoutUrl && data.orderNsu) {
                // Open payment page
                window.open(data.checkoutUrl, '_blank', 'width=600,height=800');
                // Show the overlay and start polling
                showPaymentOverlay(data.orderNsu);
                startPolling(data.orderNsu);
            }
        }
        catch (e) {
            addLog('Error', 'Payment Error', e.message, false);
        }
    });
}
// ══════════════════════════════════════════════════════════════════
//  PAYMENT OVERLAY (waiting / success / error / timeout)
// ══════════════════════════════════════════════════════════════════
function getOverlay() {
    return document.getElementById('payment-status');
}
function showPaymentOverlay(orderNsu) {
    const overlay = getOverlay();
    if (!overlay)
        return;
    overlay.classList.remove('payment-overlay--hidden');
    overlay.className = 'payment-overlay'; // reset variant classes
    overlay.innerHTML = `
        <div class="payment-overlay__content">
            <div class="payment-spinner"></div>
            <h3 class="payment-overlay__title">Waiting for Payment</h3>
            <p class="payment-overlay__text">
                Complete the payment in the window that just opened.
            </p>
            <p class="payment-overlay__nsu font-mono">${orderNsu}</p>
            <p class="payment-overlay__hint">This page will update automatically</p>
        </div>
    `;
}
function showSuccess(txn) {
    var _a, _b;
    const overlay = getOverlay();
    if (!overlay)
        return;
    overlay.className = 'payment-overlay payment-overlay--success';
    const receiptHtml = txn.receiptUrl
        ? `<a href="${txn.receiptUrl}" target="_blank" class="receipt-link">
               <span class="material-symbols-outlined" style="font-size:14px;">receipt_long</span>
               View Receipt
           </a>`
        : '';
    overlay.innerHTML = `
        <div class="payment-overlay__content">
            <span class="material-symbols-outlined payment-overlay__icon payment-overlay__icon--success">check_circle</span>
            <h3 class="payment-overlay__title">Payment Approved</h3>
            <p class="payment-overlay__text">
                R$ ${txn.amount.toFixed(2)}
            </p>
            <p class="payment-overlay__nsu font-mono">${(_a = txn.orderNsu) !== null && _a !== void 0 ? _a : ''}</p>
            ${receiptHtml}
            <button id="payment-overlay-dismiss" class="btn btn--primary" style="margin-top:var(--space-4);max-width:200px;">
                Done
            </button>
        </div>
    `;
    (_b = document.getElementById('payment-overlay-dismiss')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', hidePaymentOverlay);
}
function showError(message) {
    var _a;
    const overlay = getOverlay();
    if (!overlay)
        return;
    overlay.className = 'payment-overlay payment-overlay--error';
    overlay.innerHTML = `
        <div class="payment-overlay__content">
            <span class="material-symbols-outlined payment-overlay__icon payment-overlay__icon--error">cancel</span>
            <h3 class="payment-overlay__title">Payment Declined</h3>
            <p class="payment-overlay__text">${message}</p>
            <button id="payment-overlay-dismiss" class="btn btn--primary" style="margin-top:var(--space-4);max-width:200px;">
                Try Again
            </button>
        </div>
    `;
    (_a = document.getElementById('payment-overlay-dismiss')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', hidePaymentOverlay);
}
function showTimeout() {
    var _a;
    const overlay = getOverlay();
    if (!overlay)
        return;
    overlay.className = 'payment-overlay payment-overlay--timeout';
    overlay.innerHTML = `
        <div class="payment-overlay__content">
            <span class="material-symbols-outlined payment-overlay__icon payment-overlay__icon--timeout">schedule</span>
            <h3 class="payment-overlay__title">Payment Timed Out</h3>
            <p class="payment-overlay__text">
                No confirmation received within 10 minutes.<br/>
                Check your transaction history for updates.
            </p>
            <button id="payment-overlay-dismiss" class="btn btn--primary" style="margin-top:var(--space-4);max-width:200px;">
                Dismiss
            </button>
        </div>
    `;
    (_a = document.getElementById('payment-overlay-dismiss')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', hidePaymentOverlay);
}
function hidePaymentOverlay() {
    const overlay = getOverlay();
    if (!overlay)
        return;
    overlay.classList.add('payment-overlay--hidden');
    stopPolling();
}
// ══════════════════════════════════════════════════════════════════
//  POLLING
// ══════════════════════════════════════════════════════════════════
function startPolling(orderNsu) {
    stopPolling(); // clear any previous
    pollingInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        try {
            const txn = yield checkPaymentStatus(orderNsu);
            if (txn.status === 'APPROVED') {
                stopPolling();
                showSuccess(txn);
                addLog('Webhook', 'PAYMENT APPROVED', JSON.stringify(txn, null, 2), true);
            }
            else if (txn.status === 'DENIED') {
                stopPolling();
                showError('Payment was declined by the processor.');
                addLog('Webhook', 'PAYMENT DENIED', JSON.stringify(txn, null, 2), false);
            }
            // PENDING → keep polling
        }
        catch (err) {
            console.error('Polling error:', err);
            // Don't stop — network glitch
        }
    }), POLL_INTERVAL_MS);
    // Absolute timeout
    pollingTimeout = setTimeout(() => {
        if (pollingInterval) {
            stopPolling();
            showTimeout();
            addLog('Timeout', 'POLLING TIMEOUT', 'No webhook received within 10 min', false);
        }
    }, POLL_TIMEOUT_MS);
}
function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    if (pollingTimeout) {
        clearTimeout(pollingTimeout);
        pollingTimeout = null;
    }
}
// ══════════════════════════════════════════════════════════════════
//  LOG VIEWER (unchanged logic, kept here)
// ══════════════════════════════════════════════════════════════════
function addLog(type, title, body, isSuccess = true) {
    const container = document.getElementById('logs-container');
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    const logType = type === 'Request'
        ? 'log-entry--request'
        : isSuccess
            ? 'log-entry--success'
            : 'log-entry--error';
    const badgeType = type === 'Request'
        ? 'log-badge--request'
        : isSuccess
            ? 'log-badge--success'
            : 'log-badge--error';
    // Syntax-highlight JSON
    const highlightedBody = body.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'json-key' : 'json-string';
        }
        else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        }
        else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    const logHtml = `
        <div class="log-entry ${logType}">
            <div class="log-entry__header">
                <div class="log-entry__meta">
                    <span class="log-entry__timestamp">${timestamp}</span>
                    <span class="log-badge ${badgeType}">${type}</span>
                    <span class="log-entry__title">${title}</span>
                </div>
            </div>
            <pre class="log-entry__body">${highlightedBody}</pre>
        </div>
    `;
    // Remove empty state if present
    const emptyState = container === null || container === void 0 ? void 0 : container.querySelector('.empty-state');
    if (emptyState)
        emptyState.remove();
    // Prepend new entry
    const wrapper = document.createElement('div');
    wrapper.innerHTML = logHtml;
    container === null || container === void 0 ? void 0 : container.insertBefore(wrapper.firstElementChild, container.firstChild);
}
