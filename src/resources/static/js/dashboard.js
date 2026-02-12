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
            <div class="bg-card-dark border border-border-dark p-5 rounded-xl">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Volume</p>
                <h3 class="text-3xl font-bold">R$ ${totalVolume.toFixed(2)}</h3>
            </div>
             <div class="bg-card-dark border border-border-dark p-5 rounded-xl">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Revenue</p>
                <h3 class="text-3xl font-bold">R$ ${totalNet.toFixed(2)}</h3>
            </div>
             <div class="bg-card-dark border border-border-dark p-5 rounded-xl">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Success Rate</p>
                <h3 class="text-3xl font-bold">${successRate}%</h3>
            </div>
             <div class="bg-card-dark border border-border-dark p-5 rounded-xl">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Txns</p>
                <h3 class="text-3xl font-bold">${transactions.length}</h3>
            </div>
        `;
            // 3. Render Table
            tbody.innerHTML = transactions.map(t => {
                const isApproved = t.status === 'APPROVED';
                const statusColor = isApproved ? 'text-primary bg-primary/10 border-primary/20' : 'text-red-500 bg-red-500/10 border-red-500/20';
                return `
                 <tr class="hover:bg-primary/5 transition-colors group">
                    <td class="px-6 py-4 font-mono text-xs text-slate-400">${t.id.substring(0, 8)}...</td>
                    <td class="px-6 py-4 font-medium">${t.type}</td>
                    <td class="px-6 py-4 font-bold tabular-nums">R$ ${t.amount.toFixed(2)}</td>
                    <td class="px-6 py-4 font-bold tabular-nums text-slate-400">R$ ${t.netAmount.toFixed(2)}</td>
                    <td class="px-6 py-4 text-right">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}">${t.status}</span>
                    </td>
                </tr>
            `;
            }).join('');
        }
        catch (e) {
            console.error("Failed to load transactions", e);
            statsContainer.innerHTML = `<div class="p-4 text-red-500">Error loading data</div>`;
        }
    });
}
// Global scope hack for HTML onclick
window.loadTransactions = loadTransactions;
