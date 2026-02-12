document.addEventListener('DOMContentLoaded', () => {
    const executeBtn = document.getElementById('execute-btn');
    if (executeBtn) {
        executeBtn.addEventListener('click', executeTransaction);
    }
});
// UI Helper to switch type buttons
window.setType = (type) => {
    document.getElementById('type').setAttribute('value', type);
    const btnCredit = document.getElementById('btn-credit');
    const btnDebit = document.getElementById('btn-debit');
    if (type === 'CREDIT_SPOT') {
        btnCredit.className = "type-btn type-btn--active";
        btnDebit.className = "type-btn";
    }
    else {
        btnDebit.className = "type-btn type-btn--active";
        btnCredit.className = "type-btn";
    }
};
async function executeTransaction() {
    const amountVal = document.getElementById('amount').value;
    const typeVal = document.getElementById('type').value;
    const installmentsVal = document.getElementById('installments').value;
    const payload = {
        amount: parseFloat(amountVal),
        type: typeVal,
        installments: parseInt(installmentsVal),
        // Mocked Card Data
        cardNumber: "4000123456789010",
        cardHolder: "SIMULATED USER",
        cardExpiry: "12/30"
    };
    addLog('Request', 'POST /api/transactions', JSON.stringify(payload, null, 2));
    try {
        const start = Date.now();
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const latency = Date.now() - start;
        // Add fake latency property for display
        data.latency_ms = latency;
        addLog('Response', `${response.status} ${response.statusText}`, JSON.stringify(data, null, 2), response.ok);
    }
    catch (e) {
        addLog('Error', 'Network Error', e.toString(), false);
    }
}
function addLog(type, title, body, isSuccess = true) {
    const container = document.getElementById('logs-container');
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm
    const logType = type === 'Request' ? 'log-entry--request'
        : (isSuccess ? 'log-entry--success' : 'log-entry--error');
    const badgeType = type === 'Request' ? 'log-badge--request'
        : (isSuccess ? 'log-badge--success' : 'log-badge--error');
    // Syntax Highlight JSON
    const highlightedBody = body.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            }
            else {
                cls = 'json-string';
            }
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
    // Prepend
    const wrapper = document.createElement('div');
    wrapper.innerHTML = logHtml;
    container === null || container === void 0 ? void 0 : container.insertBefore(wrapper.firstElementChild, container.firstChild);
}
