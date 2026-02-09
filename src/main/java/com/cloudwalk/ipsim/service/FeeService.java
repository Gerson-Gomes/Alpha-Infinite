package com.cloudwalk.ipsim.service;

import com.cloudwalk.ipsim.model.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FeeService {

    // Hypothetical InfinitePay rates (Simulated)
    private static final BigDecimal FEE_DEBIT = new BigDecimal("0.0150"); // 1.5%
    private static final BigDecimal FEE_CREDIT_SPOT = new BigDecimal("0.0300"); // 3.0%
    private static final BigDecimal FEE_CREDIT_INSTALLMENT_BASE = new BigDecimal("0.0400"); // 4.0% base
    private static final BigDecimal FEE_PER_INSTALLMENT = new BigDecimal("0.0100"); // +1% per installment

    public BigDecimal calculateFee(BigDecimal amount, TransactionType type, int installments) {
        BigDecimal rate = BigDecimal.ZERO;

        switch (type) {
            case DEBIT:
                rate = FEE_DEBIT;
                break;
            case CREDIT_SPOT:
                rate = FEE_CREDIT_SPOT;
                break;
            case CREDIT_INSTALLMENT:
                // Simple logic: Base + (Installments * PerInstallment)
                // E.g. 12x = 4% + (12 * 1%) = 16% total (Just an example logic)
                // Real logic is often more complex, but this fits the "Simulation".
                BigDecimal installmentFactor = new BigDecimal(installments);
                rate = FEE_CREDIT_INSTALLMENT_BASE.add(installmentFactor.multiply(FEE_PER_INSTALLMENT));
                break;
        }

        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateNetAmount(BigDecimal amount, TransactionType type, int installments) {
        BigDecimal fee = calculateFee(amount, type, installments);
        return amount.subtract(fee);
    }
}
