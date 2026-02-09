package com.cloudwalk.ipsim.dto;

import com.cloudwalk.ipsim.model.TransactionStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponseDTO {

    private UUID id;
    private BigDecimal amount;
    private BigDecimal netAmount;
    private TransactionStatus status;
    private LocalDateTime timestamp;
    private String message;

    public TransactionResponseDTO(UUID id, BigDecimal amount, BigDecimal netAmount, TransactionStatus status,
            LocalDateTime timestamp, String message) {
        this.id = id;
        this.amount = amount;
        this.netAmount = netAmount;
        this.status = status;
        this.timestamp = timestamp;
        this.message = message;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }
}
