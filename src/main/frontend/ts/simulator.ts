interface SimPaymentRequest {
    amount: number;
    type: string;
    installments: number;
    cardNumber: string;
    cardHolder: string;
    cardExpiry: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const executeBtn = document.getElementById('execute-btn');
    if (executeBtn) {
        executeBtn.addEventListener('click', executeTransaction);
    }
});

// UI Helper to switch type buttons
(window as any).setType = (type: string) => {
    document.getElementById('type')!.setAttribute('value', type);
    const btnCredit = document.getElementById('btn-credit');
    const btnDebit = document.getElementById('btn-debit');

    // Simple toggle styling (resetting/setting classes manually for simplicity)
    if (type === 'CREDIT_SPOT') {
        btnCredit!.className = "type-btn flex items-center justify-center gap-2 h-10 border border-primary bg-primary/10 rounded-lg text-sm font-bold text-primary";
        btnDebit!.className = "type-btn flex items-center justify-center gap-2 h-10 border border-border-dark bg-background-dark rounded-lg text-sm font-bold text-slate-400";
    } else {
        btnDebit!.className = "type-btn flex items-center justify-center gap-2 h-10 border border-primary bg-primary/10 rounded-lg text-sm font-bold text-primary";
        btnCredit!.className = "type-btn flex items-center justify-center gap-2 h-10 border border-border-dark bg-background-dark rounded-lg text-sm font-bold text-slate-400";
    }
}

async function executeTransaction() {
    const amountVal = (document.getElementById('amount') as HTMLInputElement).value;
    const typeVal = (document.getElementById('type') as HTMLInputElement).value;
    const installmentsVal = (document.getElementById('installments') as HTMLInputElement).value;

    const payload: SimPaymentRequest = {
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
    } catch (e) {
        addLog('Error', 'Network Error', (e as Error).toString(), false);
    }
}

function addLog(type: string, title: string, body: string, isSuccess: boolean = true) {
    const container = document.getElementById('logs-container');
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm

    let colorClass = type === 'Request' ? 'border-slate-400 bg-slate-100/50 dark:bg-white/5'
        : (isSuccess ? 'border-primary bg-primary/5' : 'border-red-500 bg-red-500/10');

    let typeBadgeColor = type === 'Request' ? 'bg-slate-500 text-white'
        : (isSuccess ? 'bg-primary text-black' : 'bg-red-500 text-white');

    // Syntax Highlight JSON
    const highlightedBody = body.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-string'; // boolean
            } else if (/null/.test(match)) {
                cls = 'json-string'; // null
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );

    const logHtml = `
        <div class="border-l-2 ${colorClass} p-4 rounded-r-lg mb-4 animate-fade-in">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <span class="text-slate-500">${timestamp}</span>
                    <span class="${typeBadgeColor} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">${type}</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200 uppercase">${title}</span>
                </div>
            </div>
            <pre class="bg-slate-900 text-slate-300 p-3 rounded overflow-x-auto">${highlightedBody}</pre>
        </div>
    `;

    // Remove empty state if present
    const emptyState = container?.querySelector('.flex-col');
    if (emptyState) emptyState.remove();

    // Prepend
    const wrapper = document.createElement('div');
    wrapper.innerHTML = logHtml;
    container?.insertBefore(wrapper.firstElementChild!, container.firstChild);
}
