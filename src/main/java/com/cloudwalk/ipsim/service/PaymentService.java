package com.cloudwalk.ipsim.service;

import com.cloudwalk.ipsim.dto.infinitepay.InfinitePayCheckoutResponse;
import com.cloudwalk.ipsim.model.Transaction;
import com.cloudwalk.ipsim.model.TransactionStatus;
import com.cloudwalk.ipsim.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Service for processing payments via InfinitePay
 *
 * UPDATED: Now integrates with real InfinitePay API instead of local simulation
 *
 * Flow:
 * 1. Receive payment request from frontend
 * 2. Generate unique order NSU
 * 3. Call InfinitePay API to create checkout link
 * 4. Save transaction with PENDING status
 * 5. Return checkout URL to frontend
 * 6. Wait for webhook to update status to APPROVED
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TransactionRepository transactionRepository;
    private final InfinitePayService infinitePayService;
    // Note: FeeService is no longer needed since InfinitePay handles fees
    // Keeping it commented for reference if you want to show estimated fees in UI
    // private final FeeService feeService;

    /**
     * Processes a payment by creating an InfinitePay checkout link
     *
     * IMPORTANT: This method now returns a transaction in PENDING status
     * The transaction will be updated to APPROVED via webhook when payment succeeds
     *
     * @param transaction Transaction entity with amount, type, card details
     * @return Transaction with checkout URL and PENDING status
     */
    public Transaction processPayment(Transaction transaction) {
        log.info("Processing payment via InfinitePay. Amount: {}", transaction.getAmount());

        // 1. Validate
        if (transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        // 2. Generate unique order NSU
        String orderNsu = infinitePayService.generateOrderNsu();
        transaction.setOrderNsu(orderNsu);

        // 3. Create checkout link via InfinitePay API
        try {
            // Build description from transaction type
            String description = buildPaymentDescription(transaction);

            // Extract customer info from card (if available)
            String customerName = transaction.getCard() != null
                    ? transaction.getCard().getCardHolder()
                    : null;

            // Call InfinitePay API
            InfinitePayCheckoutResponse checkoutResponse = infinitePayService.createCheckoutLink(
                    transaction.getAmount(),
                    description,
                    orderNsu,
                    customerName,
                    null // email - could be added to Card entity if needed
            );

            // 4. Store checkout link details in transaction
            transaction.setCheckoutUrl(checkoutResponse.getCheckoutUrl());
            transaction.setInfinitePaySlug(checkoutResponse.getSlug());

            // 5. Set status to PENDING (will be updated to APPROVED by webhook)
            transaction.setStatus(TransactionStatus.PENDING);
            transaction.setTimestamp(LocalDateTime.now());

            // Note: netAmount is null at this point
            // InfinitePay handles fees internally
            // The webhook will contain actual received amount

            // 6. Save transaction
            Transaction savedTransaction = transactionRepository.save(transaction);
            log.info("Payment initiated. Order NSU: {}, Checkout URL: {}",
                    orderNsu, checkoutResponse.getCheckoutUrl());

            return savedTransaction;

        } catch (Exception e) {
            log.error("Failed to create InfinitePay checkout link", e);
            // Set status to DECLINED if checkout creation fails
            transaction.setStatus(TransactionStatus.DECLINED);
            transaction.setTimestamp(LocalDateTime.now());
            transactionRepository.save(transaction);
            throw new RuntimeException("Failed to initiate payment: " + e.getMessage(), e);
        }
    }

    /**
     * Builds a human-readable payment description
     *
     * @param transaction Transaction details
     * @return Description string for checkout
     */
    private String buildPaymentDescription(Transaction transaction) {
        String typeDesc = switch (transaction.getType()) {
            case DEBIT -> "Pagamento com Débito";
            case CREDIT -> transaction.getInstallments() > 1
                    ? "Pagamento com Crédito (" + transaction.getInstallments() + "x)"
                    : "Pagamento com Crédito à vista";
            case PIX -> "Pagamento via PIX";
        };

        return typeDesc + " - R$ " + transaction.getAmount();
    }

    /**
     * Checks payment status manually (alternative to webhooks)
     *
     * Use this to:
     * - Poll for payment status if webhook fails
     * - Verify payment before order fulfillment
     * - Manual reconciliation
     *
     * @param orderNsu Your internal order identifier
     * @return true if payment is complete, false otherwise
     */
    public boolean checkPaymentStatus(String orderNsu) {
        log.info("Checking payment status for order: {}", orderNsu);

        Transaction transaction = transactionRepository.findByOrderNsu(orderNsu)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + orderNsu));

        try {
            var statusResponse = infinitePayService.checkPaymentStatus(
                    orderNsu,
                    transaction.getInfinitePaySlug(),
                    transaction.getInfinitePayTransactionNsu()
            );

            if (statusResponse.getPaid()) {
                // Update transaction if it's marked as paid
                if (transaction.getStatus() != TransactionStatus.APPROVED) {
                    transaction.setStatus(TransactionStatus.APPROVED);
                    transactionRepository.save(transaction);
                    log.info("Payment confirmed via status check. Order: {}", orderNsu);
                }
                return true;
            }

            return false;

        } catch (Exception e) {
            log.error("Error checking payment status for order: " + orderNsu, e);
            return false;
        }
    }
}
