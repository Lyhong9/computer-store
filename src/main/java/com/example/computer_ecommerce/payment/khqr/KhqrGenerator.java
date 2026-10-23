package com.example.computer_ecommerce.payment.khqr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class KhqrGenerator {

    public record KhqrResult(
            String qrString,
            String md5Hash,
            String qrImageBase64
    ) {}

    public KhqrResult generateIndividualKhqr(
            String accountId,
            String accountName,
            String merchantCity,
            String merchantPhone,
            String storeLabel,
            String orderNumber,
            BigDecimal amount,
            String currency
    ) {
        StringBuilder sb = new StringBuilder();

        // 00: Payload Format Indicator
        sb.append(tlv("00", "01"));

        // 01: Point of Initiation Method (12 = Dynamic QR code)
        sb.append(tlv("01", "12"));

        // 29: Merchant Account Information (Bakong individual)
        // Sub-tag 00: Bakong account identifier (e.g. dam_lyhong@bkrt)
        String sub29 = tlv("00", accountId != null ? accountId : "dam_lyhong@bkrt");
        sb.append(tlv("29", sub29));

        // 52: Merchant Category Code (5999 = Miscellaneous Retail)
        sb.append(tlv("52", "5999"));

        // 53: Transaction Currency (840 = USD, 116 = KHR)
        String currencyCode = "KHR".equalsIgnoreCase(currency) ? "116" : "840";
        sb.append(tlv("53", currencyCode));

        // 54: Transaction Amount
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            String formattedAmount = amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
            sb.append(tlv("54", formattedAmount));
        }

        // 58: Country Code
        sb.append(tlv("58", "KH"));

        // 59: Merchant Name
        String name = (accountName != null && !accountName.isBlank()) ? accountName : "DAM LYHONG";
        sb.append(tlv("59", name));

        // 60: Merchant City
        String city = (merchantCity != null && !merchantCity.isBlank()) ? merchantCity : "Phnom Penh";
        sb.append(tlv("60", city));

        // 62: Additional Data Field Template
        StringBuilder sub62 = new StringBuilder();
        if (orderNumber != null && !orderNumber.isBlank()) {
            sub62.append(tlv("01", orderNumber)); // Bill Number
        }
        if (merchantPhone != null && !merchantPhone.isBlank()) {
            sub62.append(tlv("02", merchantPhone)); // Mobile Number
        }
        if (storeLabel != null && !storeLabel.isBlank()) {
            sub62.append(tlv("03", storeLabel)); // Store Label
        }
        sub62.append(tlv("07", "WEB")); // Terminal Label

        if (!sub62.isEmpty()) {
            sb.append(tlv("62", sub62.toString()));
        }

        // 63: CRC16 Checksum prefix
        sb.append("6304");

        // Calculate CRC16-CCITT for the string so far
        String crc = calculateCrc16(sb.toString());
        String fullKhqr = sb + crc;

        // MD5 hash of the full KHQR string (used by Bakong Open API verification)
        String md5 = calculateMd5(fullKhqr);

        // Render QR Code image
        String imageBase64 = renderQrCodeImage(fullKhqr, 400);

        return new KhqrResult(fullKhqr, md5, imageBase64);
    }

    private static String tlv(String tag, String value) {
        if (value == null) {
            value = "";
        }
        return String.format("%s%02d%s", tag, value.length(), value);
    }

    public static String calculateCrc16(String data) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);

        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i)) & 1) == 1;
                boolean c15 = ((crc >> 15) & 1) == 1;
                crc <<= 1;
                if (c15 ^ bit) {
                    crc ^= polynomial;
                }
            }
        }
        crc &= 0xFFFF;
        return String.format("%04X", crc);
    }

    public static String calculateMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return String.format("%032x", new BigInteger(1, digest));
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate MD5", e);
        }
    }

    public static String renderQrCodeImage(String text, int size) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);

            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, size, size, hints);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] pngBytes = outputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);
        } catch (Exception e) {
            return null;
        }
    }
}
