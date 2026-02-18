package com.cloudwalk.ipsim.controller;

import com.cloudwalk.ipsim.dto.infinitepay.InfinitePayWebhookPayload;
import com.cloudwalk.ipsim.model.Transaction;
import com.cloudwalk.ipsim.model.TransactionStatus;
import com.cloudwalk.ipsim.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Controller for receiving webhooks from InfinitePay
 *
 * InfinitePay sends POST requests to this endpoint when:
 * - Payment is successfully completed
 * - User finishes checkout (credit card or PIX)
 *
 * IMPORTANT: This endpoint must be publicly accessible
 * During development: Use ngrok to expose localhost:8080
 * In production: Must be a real public URL
 *
 * Expected behavior:
 * - Return 200 OK on success (stops retries)
 * - Return 400 Bad Request to trigger retry
 */
@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final TransactionRepository transactionRepository;

    /**
     * Receives payment completion webhook from InfinitePay
     *
     * Flow:
     * 1. Receive webhook payload
     * 2. Find transaction by order_nsu
     * 3. Update transaction status to APPROVED
     * 4. Store InfinitePay transaction details
     * 5. Return 200 OK
     *
     * @param payload Webhook data from InfinitePay
     * @return ResponseEntity with status code
     */
    @PostMapping("/infinitepay")
    public ResponseEntity<String> handleInfinitePayWebhook(
            @RequestBody InfinitePayWebhookPayload payload) {

        log.info("Received InfinitePay webhook for order: {}", payload.getOrderNsu());
        log.debug("Webhook payload: {}", payload);

        // Validate payload
        if (payload.getOrderNsu() == null || payload.getOrderNsu().isEmpty()) {
            log.error("Webhook missing order_nsu");
            return ResponseEntity.badRequest().body("Missing order_nsu");
        }

        try {
            // Find transaction by order NSU
            Optional<Transaction> optionalTransaction = transactionRepository
                    .findByOrderNsu(payload.getOrderNsu());

            if (optionalTransaction.isEmpty()) {
                log.warn("Transaction not found for order_nsu: {}", payload.getOrderNsu());
                // Return 200 to prevent retries for non-existent orders
                return ResponseEntity.ok("Transaction not found, but acknowledged");
            }

            Transaction transaction = optionalTransaction.get();

            // Check if already processed
            if (transaction.getStatus() == TransactionStatus.APPROVED) {
                log.info("Transaction already approved (duplicate webhook). Order: {}",
                        payload.getOrderNsu());
                return ResponseEntity.ok("Already processed");
            }

            // Update transaction with webhook data
            transaction.setStatus(TransactionStatus.APPROVED);
            transaction.setInfinitePaySlug(payload.getInvoiceSlug());
            transaction.setInfinitePayTransactionNsu(payload.getTransactionNsu());
            transaction.setReceiptUrl(payload.getReceiptUrl());
            transaction.setInstallments(payload.getInstallments());
            transaction.setTimestamp(LocalDateTime.now());

            // Calculate actual amount received (already net of fees from InfinitePay)
            // Note: InfinitePay handles the fee calculation internally
            // The webhook amount is what the merchant receives

            transactionRepository.save(transaction);

            log.info("Transaction updated successfully. Order: {}, Status: APPROVED",
                    payload.getOrderNsu());

            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            log.error("Error processing webhook for order: " + payload.getOrderNsu(), e);
            // Return 400 to trigger InfinitePay to retry
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing webhook: " + e.getMessage());
        }
    }

    /**
     * Health check endpoint for webhook verification
     *
     * Useful for:
     * - Verifying ngrok tunnel is working
     * - Testing webhook endpoint accessibility
     *
     * @return Simple success message
     */
    @GetMapping("/infinitepay/health")
    public ResponseEntity<String> webhookHealthCheck() {
        return ResponseEntity.ok("InfinitePay webhook endpoint is healthy");
    }
}
