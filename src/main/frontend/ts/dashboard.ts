import { fetchAllTransactions, TransactionResponse } from './api-client.js';

document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});

async function loadTransactions() {
    const statsContainer = document.getElementById('stats-container');
    const tbody = document.getElementById('transactions-body');
    if (!statsContainer || !tbody) return;

    try {
        const transactions: TransactionResponse[] = await fetchAllTransactions();

        // 1. Calculate Stats
        const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
        const totalNet = transactions.reduce((acc, t) => acc + (t.netAmount ?? 0), 0);
        const approvedCount = transactions.filter(t => t.status === 'APPROVED').length;
        const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
        const successRate = transactions.length > 0
            ? (approvedCount / transactions.length * 100).toFixed(1)
            : '0.0';

        // 2. Render Stats
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Total Volume</p>
                    <span class="material-symbols-outlined stat-card__icon">account_balance</span>
                </div>
                <h3 class="stat-card__value">R$ ${totalVolume.toFixed(2)}</h3>
                <p class="stat-card__delta stat-card__delta--positive">${transactions.length} transactions</p>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Net Revenue</p>
                    <span class="material-symbols-outlined stat-card__icon">payments</span>
                </div>
                <h3 class="stat-card__value">R$ ${totalNet.toFixed(2)}</h3>
                <p class="stat-card__delta stat-card__delta--positive">After fees</p>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Success Rate</p>
                    <span class="material-symbols-outlined stat-card__icon">check_circle</span>
                </div>
                <h3 class="stat-card__value">${successRate}%</h3>
                <p class="stat-card__delta stat-card__delta--positive">Approval ratio</p>
            </div>
            <div class="stat-card">
                <div class="stat-card__header">
                    <p class="stat-card__label">Pending</p>
                    <span class="material-symbols-outlined stat-card__icon">hourglass_top</span>
                </div>
                <h3 class="stat-card__value">${pendingCount}</h3>
                <p class="stat-card__delta">${pendingCount > 0 ? 'Awaiting payment' : 'All settled'}</p>
            </div>
        `;

        // 3. Render Table
        tbody.innerHTML = transactions.map(t => {
            const statusClass =
                t.status === 'APPROVED' ? 'status-badge--approved'
                    : t.status === 'PENDING' ? 'status-badge--pending'
                        : 'status-badge--declined';

            const netDisplay = t.netAmount != null ? `R$ ${t.netAmount.toFixed(2)}` : '–';
            const nsuDisplay = t.orderNsu ? t.orderNsu.substring(0, 16) + '…' : '–';

            return `
                 <tr>
                    <td class="font-mono">${t.id.substring(0, 8)}...</td>
                    <td class="font-mono text-xs">${nsuDisplay}</td>
                    <td class="tabular-nums">R$ ${t.amount.toFixed(2)}</td>
                    <td class="tabular-nums">${netDisplay}</td>
                    <td>
                        <span class="status-badge ${statusClass}">${t.status}</span>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (e) {
        console.error("Failed to load transactions", e);
        statsContainer.innerHTML = `<div class="stat-card"><p class="stat-card__label" style="color: var(--color-danger);">Error loading data</p></div>`;
    }
}

// Global scope hack for HTML onclick
(window as any).loadTransactions = loadTransactions;
