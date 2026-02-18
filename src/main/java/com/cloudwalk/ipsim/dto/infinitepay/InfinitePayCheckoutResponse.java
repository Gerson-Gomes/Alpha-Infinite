package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO from InfinitePay checkout link creation
 *
 * Contains the payment link URL that should be opened in the browser
 *
 * Note: The actual API response structure might vary.
 * Update this based on real API testing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfinitePayCheckoutResponse {

    /**
     * The checkout URL to open in browser
     *
     * Example: "https://pay.infinitepay.io/c/abc123def456"
     *
     * User completes payment at this URL
     */
    @JsonProperty("checkout_url")
    private String checkoutUrl;

    /**
     * Invoice slug/identifier from InfinitePay
     *
     * Used for tracking and status checks
     */
    private String slug;

    /**
     * Success indicator
     */
    private Boolean success;

    /**
     * Any error message if success = false
     */
    private String message;

    // TODO: Verify actual response structure from InfinitePay API
    // The documentation doesn't explicitly show the response format
    // for checkout link creation. Update this after API testing.
}
