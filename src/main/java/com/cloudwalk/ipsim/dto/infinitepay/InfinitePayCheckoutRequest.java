package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for creating a checkout link via InfinitePay API
 *
 * POST https://api.infinitepay.io/invoices/public/checkout/links
 *
 * This creates a payment link that the user will open in their browser
 * to complete the payment (Credit Card or PIX)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfinitePayCheckoutRequest {

    /**
     * Your InfinitePay handle (without the $ symbol)
     * REQUIRED
     *
     * Example: "joaosilva"
     */
    private String handle;

    /**
     * List of items being purchased
     * REQUIRED - At least 1 item
     *
     * Each item must have: quantity, price (in cents), description
     */
    private List<CheckoutItemDTO> items;

    /**
     * Your internal order identifier
     * OPTIONAL but HIGHLY RECOMMENDED
     *
     * This allows you to track payments and match webhooks
     * to transactions in your database
     *
     * Example: "ORD-2024-00123"
     */
    @JsonProperty("order_nsu")
    private String orderNsu;

    /**
     * URL to redirect user after payment completion
     * OPTIONAL
     *
     * If provided, InfinitePay will redirect to this URL with query params:
     * - receipt_url
     * - order_nsu
     * - slug
     * - capture_method
     * - transaction_nsu
     *
     * Example: "http://localhost:8080/payment-success"
     */
    @JsonProperty("redirect_url")
    private String redirectUrl;

    /**
     * URL where InfinitePay will send payment notifications
     * RECOMMENDED for production
     *
     * InfinitePay will POST to this endpoint when payment is completed
     * with full transaction details
     *
     * During development with ngrok:
     * Example: "https://abc123.ngrok.io/api/webhooks/infinitepay"
     */
    @JsonProperty("webhook_url")
    private String webhookUrl;

    /**
     * Customer information (optional)
     * Pre-fills the checkout form if provided
     */
    private CustomerDTO customer;

    // Note: Address field is also available in the API but omitted here
    // for simplicity. Add if needed for your use case.
}
