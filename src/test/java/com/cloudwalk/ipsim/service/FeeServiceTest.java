package com.cloudwalk.ipsim.service;

import com.cloudwalk.ipsim.model.TransactionType;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

class FeeServiceTest {

    private final FeeService feeService = new FeeService();

    @Test
    void testCalculateFeeDebit() {
        BigDecimal amount = new BigDecimal("100.00");
        BigDecimal fee = feeService.calculateFee(amount, TransactionType.DEBIT, 1);
        // 1.5% of 100 = 1.50
        assertEquals(new BigDecimal("1.50"), fee);
    }

    @Test
    void testCalculateFeeCreditSpot() {
        BigDecimal amount = new BigDecimal("100.00");
        BigDecimal fee = feeService.calculateFee(amount, TransactionType.CREDIT_SPOT, 1);
        // 3.0% of 100 = 3.00
        assertEquals(new BigDecimal("3.00"), fee);
    }

    @Test
    void testCalculateFeeCreditInstallment() {
        BigDecimal amount = new BigDecimal("100.00");
        // 12 installments: 4% base + (12 * 1%) = 16% total
        BigDecimal fee = feeService.calculateFee(amount, TransactionType.CREDIT_INSTALLMENT, 12);
        // 16% of 100 = 16.00
        assertEquals(new BigDecimal("16.00"), fee);
    }

    @Test
    void testCalculateNetAmount() {
        BigDecimal amount = new BigDecimal("100.00");
        BigDecimal net = feeService.calculateNetAmount(amount, TransactionType.DEBIT, 1);
        // 100 - 1.50 = 98.50
        assertEquals(new BigDecimal("98.50"), net);
    }
}
