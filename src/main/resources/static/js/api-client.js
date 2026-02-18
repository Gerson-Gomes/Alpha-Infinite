/**
 * IP-Sim API Client
 * Shared types and fetch helpers for InfinitePay integration.
 */
/**
 * Submit a payment. Returns a TransactionResponse which may include
 * a checkoutUrl when InfinitePay integration is active.
 */
export async function submitPayment(payload) {
    const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Payment failed (${response.status}): ${text}`);
    }
    return await response.json();
}
/**
 * Poll a single transaction by its internal order NSU.
 * Used to detect when the webhook has flipped status to APPROVED.
 */
export async function checkPaymentStatus(orderNsu) {
    const response = await fetch(`/api/transactions/order/${orderNsu}`);
    if (!response.ok) {
        throw new Error(`Status check failed (${response.status})`);
    }
    return await response.json();
}
/**
 * Fetch all transactions (for the dashboard).
 */
export async function fetchAllTransactions() {
    const response = await fetch('/api/transactions');
    if (!response.ok) {
        throw new Error(`Failed to load transactions (${response.status})`);
    }
    return await response.json();
}
