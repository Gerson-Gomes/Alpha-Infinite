"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});
function loadTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        const statsContainer = document.getElementById('stats-container');
        const tbody = document.getElementById('transactions-body');
        if (!statsContainer || !tbody)
            return;
        try {
            const response = yield fetch('/api/transactions');
            const transactions = yield response.json();
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
                    <p class="stat-card__label">Total Txns</p>
                    <span class="material-symbols-outlined stat-card__icon">receipt_long</span>
                </div>
                <h3 class="stat-card__value">${transactions.length}</h3>
                <p class="stat-card__delta">Simulated</p>
            </div>
        `;
            // 3. Render Table
            tbody.innerHTML = transactions.map(t => {
                const isApproved = t.status === 'APPROVED';
                const statusClass = isApproved ? 'status-badge--approved' : 'status-badge--declined';
                return `
                 <tr>
                    <td class="font-mono">${t.id.substring(0, 8)}...</td>
                    <td>${t.type}</td>
                    <td class="tabular-nums">R$ ${t.amount.toFixed(2)}</td>
                    <td class="tabular-nums">R$ ${t.netAmount.toFixed(2)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">${t.status}</span>
                    </td>
                </tr>
            `;
            }).join('');
        }
        catch (e) {
            console.error("Failed to load transactions", e);
            statsContainer.innerHTML = `<div class="stat-card"><p class="stat-card__label" style="color: var(--color-danger);">Error loading data</p></div>`;
        }
    });
}
// Global scope hack for HTML onclick
window.loadTransactions = loadTransactions;
