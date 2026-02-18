package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for checking payment status via InfinitePay API
 *
 * POST https://api.infinitepay.io/invoices/public/checkout/payment_check
 *
 * Used to manually check if a payment has been completed
 * (Alternative to webhooks or for polling)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusCheckRequest {

    /**
     * Your InfinitePay handle (without $ symbol)
     * REQUIRED
     */
    private String handle;

    /**
     * Your original order identifier
     * OPTIONAL but useful for lookup
     */
    @JsonProperty("order_nsu")
    private String orderNsu;

    /**
     * InfinitePay transaction NSU (UUID)
     * OPTIONAL - received from webhook or redirect
     */
    @JsonProperty("transaction_nsu")
    private String transactionNsu;

    /**
     * Invoice slug from InfinitePay
     * OPTIONAL - received when checkout link was created
     */
    private String slug;
}
