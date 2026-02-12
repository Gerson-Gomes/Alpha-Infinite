document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});

async function loadTransactions() {
    const statsContainer = document.getElementById('stats-container');
    const tbody = document.getElementById('transactions-body');
    if (!statsContainer || !tbody) return;

    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();

        // 1. Calculate Stats
        const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
        const totalNet = transactions.reduce((acc, t) => acc + t.netAmount, 0);
        const successRate = transactions.length > 0
            ? (transactions.filter(t => t.status === 'APPROVED').length / transactions.length * 100).toFixed(1)
            : '0.0';

        // 2. Render Stats
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Total Volume</p>
                    <span class="material-symbols-outlined stat-card__icon">account_balance</span>
                </div>
                <h3 class="stat-card__value">R$ ${totalVolume.toFixed(2)}</h3>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Net Revenue</p>
                    <span class="material-symbols-outlined stat-card__icon">savings</span>
                </div>
                <h3 class="stat-card__value">R$ ${totalNet.toFixed(2)}</h3>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Success Rate</p>
                    <span class="material-symbols-outlined stat-card__icon">check_circle</span>
                </div>
                <h3 class="stat-card__value">${successRate}%</h3>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Total Txns</p>
                    <span class="material-symbols-outlined stat-card__icon">receipt_long</span>
                </div>
                <h3 class="stat-card__value">${transactions.length}</h3>
            </div>
        `;

        // 3. Render Table
        tbody.innerHTML = transactions.map(t => {
            const isApproved = t.status === 'APPROVED';
            const badgeClass = isApproved ? 'badge--approved' : 'badge--declined';
            return `
                <tr>
                    <td class="cell-id">${t.id.substring(0, 8)}...</td>
                    <td class="cell-merchant">${t.type}</td>
                    <td class="cell-amount">R$ ${t.amount.toFixed(2)}</td>
                    <td class="cell-net">R$ ${t.netAmount.toFixed(2)}</td>
                    <td><span class="badge ${badgeClass}">${t.status}</span></td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        console.error("Failed to load transactions", e);
        statsContainer.innerHTML = `<div class="stat-card" style="color:var(--danger);">Error loading data</div>`;
    }
}

// Global scope for HTML onclick
window.loadTransactions = loadTransactions;
