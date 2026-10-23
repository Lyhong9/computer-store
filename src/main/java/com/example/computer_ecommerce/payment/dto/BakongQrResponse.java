package com.example.computer_ecommerce.payment.dto;

import java.math.BigDecimal;

public record BakongQrResponse(
        String orderNumber,
        BigDecimal amount,
        String currency,
        String accountId,
        String accountName,
        String storeLabel,
        String qrString,
        String md5Hash,
        String qrImageBase64
) {}
