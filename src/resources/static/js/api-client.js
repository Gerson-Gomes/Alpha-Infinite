/**
 * IP-Sim API Client
 * Shared types and fetch helpers for InfinitePay integration.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ── API helpers ────────────────────────────────────────────────────
/**
 * Submit a payment. Returns a TransactionResponse which may include
 * a checkoutUrl when InfinitePay integration is active.
 */
export function submitPayment(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const text = yield response.text();
            throw new Error(`Payment failed (${response.status}): ${text}`);
        }
        return yield response.json();
    });
}
/**
 * Poll a single transaction by its internal order NSU.
 * Used to detect when the webhook has flipped status to APPROVED.
 */
export function checkPaymentStatus(orderNsu) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/api/transactions/order/${orderNsu}`);
        if (!response.ok) {
            throw new Error(`Status check failed (${response.status})`);
        }
        return yield response.json();
    });
}
/**
 * Fetch all transactions (for the dashboard).
 */
export function fetchAllTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/api/transactions');
        if (!response.ok) {
            throw new Error(`Failed to load transactions (${response.status})`);
        }
        return yield response.json();
    });
}
