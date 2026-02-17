package com.cloudwalk.ipsim.service;

import com.cloudwalk.ipsim.model.Transaction;
import com.cloudwalk.ipsim.model.TransactionStatus;
import com.cloudwalk.ipsim.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TransactionRepository transactionRepository;
    private final FeeService feeService;

    public Transaction processPayment(Transaction transaction) {
        // 1. Validate
        if (transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        // 2. Calculate Fees (Net Amount)
        BigDecimal netAmount = feeService.calculateNetAmount(
                transaction.getAmount(),
                transaction.getType(),
                transaction.getInstallments());
        transaction.setNetAmount(netAmount);

        // 3. Set Status & Timestamp (Immediate Settlement / D+0 simulation)
        // In a real scenario, we might call an external acquirer.
        // Here, we simulate immediate approval.
        transaction.setStatus(TransactionStatus.APPROVED);
        transaction.setTimestamp(LocalDateTime.now());

        // 4. Save
        return transactionRepository.save(transaction);
    }
}
