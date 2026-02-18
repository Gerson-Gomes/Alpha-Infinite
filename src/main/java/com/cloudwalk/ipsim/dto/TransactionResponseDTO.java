package com.cloudwalk.ipsim.dto;

import com.cloudwalk.ipsim.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class TransactionResponseDTO {

    private UUID id;
    private BigDecimal amount;
    private BigDecimal netAmount;
    private TransactionStatus status;
    private LocalDateTime timestamp;
    private String message;

    // InfinitePay Integration Fields
    private String checkoutUrl;  // InfinitePay payment link to open in browser
    private String orderNsu;      // Internal order tracking ID
    private String receiptUrl;    // Payment receipt URL (after successful payment)
}
