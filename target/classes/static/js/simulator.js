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
    } else {
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
        data.latency_ms = latency;
        addLog('Response', `${response.status} ${response.statusText}`, JSON.stringify(data, null, 2), response.ok);
    } catch (e) {
        addLog('Error', 'Network Error', e.toString(), false);
    }
}

function addLog(type, title, body, isSuccess = true) {
    const container = document.getElementById('logs-container');
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);

    // Determine entry style
    let entryClass = 'log-entry--request';
    if (type === 'Response') entryClass = isSuccess ? 'log-entry--success' : 'log-entry--error';
    if (type === 'Error') entryClass = 'log-entry--error';

    let typeClass = 'log-type--request';
    if (type === 'Response') typeClass = isSuccess ? 'log-type--response' : 'log-type--error';
    if (type === 'Error') typeClass = 'log-type--error';

    // Syntax Highlight JSON
    const highlightedBody = body.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                cls = /:$/.test(match) ? 'json-key' : 'json-string';
            } else if (/true|false/.test(match)) {
                cls = 'json-string';
            } else if (/null/.test(match)) {
                cls = 'json-string';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );

    const logHtml = `
        <div class="log-entry ${entryClass} animate-fade-in">
            <div class="log-entry__header">
                <div class="log-entry__meta">
                    <span class="log-entry__timestamp">${timestamp}</span>
                    <span class="log-entry__type ${typeClass}">${type}</span>
                    <span class="log-entry__title">${title}</span>
                </div>
            </div>
            <pre>${highlightedBody}</pre>
        </div>
    `;

    // Remove empty state if present
    const emptyState = container?.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    // Prepend
    const wrapper = document.createElement('div');
    wrapper.innerHTML = logHtml;
    container?.insertBefore(wrapper.firstElementChild, container.firstChild);
}
