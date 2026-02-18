package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Webhook payload sent by InfinitePay when payment is completed
 *
 * InfinitePay POSTs this data to your webhook_url when:
 * - Payment is successfully completed
 * - User finishes checkout (credit card or PIX)
 *
 * Your webhook endpoint should:
 * - Validate the payload
 * - Update transaction status in database
 * - Return 200 OK (or 400 to trigger retry)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfinitePayWebhookPayload {

    /**
     * Invoice identifier from InfinitePay
     * Example: "abc123"
     */
    @JsonProperty("invoice_slug")
    private String invoiceSlug;

    /**
     * Total amount paid in cents
     * Example: 1000 = R$ 10.00
     */
    private Long amount;

    /**
     * Number of installments
     * 1 = à vista (single payment)
     * 2-12 = parceled payment
     */
    private Integer installments;

    /**
     * Payment method used
     * Values: "credit_card" or "pix"
     */
    @JsonProperty("capture_method")
    private String captureMethod;

    /**
     * Unique transaction identifier from InfinitePay
     * UUID format
     */
    @JsonProperty("transaction_nsu")
    private String transactionNsu;

    /**
     * Your original order identifier
     * Matches the order_nsu sent in checkout request
     */
    @JsonProperty("order_nsu")
    private String orderNsu;

    /**
     * URL to payment receipt/proof
     * Example: "https://comprovante.com/123"
     */
    @JsonProperty("receipt_url")
    private String receiptUrl;

    /**
     * List of items from the original checkout
     * (Same structure as checkout request)
     */
    private List<CheckoutItemDTO> items;
}
