package com.cloudwalk.ipsim.dto.infinitepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Optional customer information for InfinitePay checkout
 *
 * While optional, providing customer data:
 * - Pre-fills the checkout form
 * - Improves fraud detection
 * - Better transaction tracking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {

    /**
     * Customer's full name
     * Example: "João Silva"
     */
    private String name;

    /**
     * Customer's email address
     * Example: "joao.silva@example.com"
     */
    private String email;

    /**
     * Customer's phone number (Brazilian format)
     * Example: "11987654321"
     */
    @JsonProperty("phone_number")
    private String phoneNumber;
}
