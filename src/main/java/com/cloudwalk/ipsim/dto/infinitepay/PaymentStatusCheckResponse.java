package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO from InfinitePay payment status check
 *
 * Indicates whether a payment has been completed and its details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusCheckResponse {

    /**
     * Whether the API call was successful
     */
    private Boolean success;

    /**
     * Whether the payment has been completed
     * true = payment successful
     * false = payment pending or not found
     */
    private Boolean paid;

    /**
     * Amount paid in cents
     * Example: 1500 = R$ 15.00
     */
    private Long amount;

    /**
     * Number of installments used
     * 1 = à vista
     */
    private Integer installments;

    /**
     * Payment method used
     * "credit_card" or "pix"
     */
    @JsonProperty("capture_method")
    private String captureMethod;
}
