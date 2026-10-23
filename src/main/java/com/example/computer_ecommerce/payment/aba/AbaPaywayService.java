package com.example.computer_ecommerce.payment.aba;

import com.example.computer_ecommerce.payment.config.PaymentProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AbaPaywayService {

    private static final Logger log = LoggerFactory.getLogger(AbaPaywayService.class);
    private static final DateTimeFormatter REQ_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(ZoneOffset.UTC);

    private final PaymentProperties properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AbaPaywayService(PaymentProperties properties) {
        this.properties = properties;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public record AbaCheckoutPayload(
            String purchaseUrl,
            String reqTime,
            String merchantId,
            String tranId,
            String amount,
            String items,
            String shipping,
            String firstName,
            String lastName,
            String email,
            String phone,
            String type,
            String paymentOption,
            String returnUrl,
            String cancelUrl,
            String continueSuccessUrl,
            String currency,
            String hash,
            Map<String, String> formData
    ) {}

    public record AbaCheckResult(
            boolean isPaid,
            int statusCode,
            String description,
            String rawJson
    ) {
        public static AbaCheckResult unpaid(String description) {
            return new AbaCheckResult(false, -1, description, null);
        }
    }

    public AbaCheckoutPayload createCheckoutPayload(
            String tranId,
            BigDecimal amount,
            String customerName,
            String customerEmail,
            String customerPhone,
            List<Map<String, Object>> itemList,
            BigDecimal shippingAmount,
            String paymentOption,
            String frontendBaseUrl
    ) {
        PaymentProperties.AbaProperties aba = properties.getAba();

        String reqTime = REQ_TIME_FORMATTER.format(Instant.now());
        String merchantId = aba.getMerchantId();
        String formattedAmount = amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
        String shippingStr = (shippingAmount != null && shippingAmount.compareTo(BigDecimal.ZERO) > 0)
                ? shippingAmount.setScale(2, RoundingMode.HALF_UP).toPlainString()
                : "";

        // Names
        String firstName = "Customer";
        String lastName = "Store";
        if (customerName != null && !customerName.isBlank()) {
            String[] parts = customerName.trim().split("\\s+", 2);
            firstName = parts[0];
            if (parts.length > 1) {
                lastName = parts[1];
            }
        }

        String email = customerEmail != null ? customerEmail : "";
        String phone = customerPhone != null ? customerPhone : "";
        String type = "purchase";
        String option = paymentOption != null ? paymentOption : "";

        // Encode items to Base64 JSON
        String itemsBase64 = "";
        try {
            if (itemList != null && !itemList.isEmpty()) {
                String itemsJson = objectMapper.writeValueAsString(itemList);
                itemsBase64 = Base64.getEncoder().encodeToString(itemsJson.getBytes(StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            log.warn("Failed to serialize items for ABA PayWay: {}", e.getMessage());
        }

        String returnUrl = (frontendBaseUrl != null ? frontendBaseUrl : "http://localhost:3000") + "/orders/" + tranId;
        String cancelUrl = (frontendBaseUrl != null ? frontendBaseUrl : "http://localhost:3000") + "/shop";
        String continueSuccessUrl = returnUrl;
        String currency = "USD";
        String ctid = "";
        String pwt = "";
        String returnDeeplink = "";
        String customFields = "";
        String returnParams = "";

        // Hash concatenation sequence:
        // req_time + merchant_id + tran_id + amount + items + shipping + ctid + pwt + firstname + lastname + email + phone + type + payment_option + return_url + cancel_url + continue_success_url + return_deeplink + currency + custom_fields + return_params
        String rawHashString = reqTime
                + merchantId
                + tranId
                + formattedAmount
                + itemsBase64
                + shippingStr
                + ctid
                + pwt
                + firstName
                + lastName
                + email
                + phone
                + type
                + option
                + returnUrl
                + cancelUrl
                + continueSuccessUrl
                + returnDeeplink
                + currency
                + customFields
                + returnParams;

        String hash = generateHmacSha512(rawHashString, aba.getApiKey());

        Map<String, String> formData = new HashMap<>();
        formData.put("req_time", reqTime);
        formData.put("merchant_id", merchantId);
        formData.put("tran_id", tranId);
        formData.put("amount", formattedAmount);
        if (!itemsBase64.isEmpty()) {
            formData.put("items", itemsBase64);
        }
        if (!shippingStr.isEmpty()) {
            formData.put("shipping", shippingStr);
        }
        formData.put("firstname", firstName);
        formData.put("lastname", lastName);
        formData.put("email", email);
        formData.put("phone", phone);
        formData.put("type", type);
        if (!option.isEmpty()) {
            formData.put("payment_option", option);
        }
        formData.put("return_url", returnUrl);
        formData.put("cancel_url", cancelUrl);
        formData.put("continue_success_url", continueSuccessUrl);
        formData.put("currency", currency);
        formData.put("hash", hash);

        return new AbaCheckoutPayload(
                aba.getPurchaseUrl(),
                reqTime,
                merchantId,
                tranId,
                formattedAmount,
                itemsBase64,
                shippingStr,
                firstName,
                lastName,
                email,
                phone,
                type,
                option,
                returnUrl,
                cancelUrl,
                continueSuccessUrl,
                currency,
                hash,
                formData
        );
    }

    public AbaCheckResult checkTransaction(String tranId) {
        PaymentProperties.AbaProperties aba = properties.getAba();
        String reqTime = REQ_TIME_FORMATTER.format(Instant.now());
        String merchantId = aba.getMerchantId();

        String rawHashString = reqTime + merchantId + tranId;
        String hash = generateHmacSha512(rawHashString, aba.getApiKey());

        String checkUrl = aba.getBaseUrl();
        if (!checkUrl.endsWith("/")) {
            checkUrl += "/";
        }
        checkUrl += "check-transaction-2";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("req_time", reqTime);
            body.put("merchant_id", merchantId);
            body.put("tran_id", tranId);
            body.put("hash", hash);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            log.info("Checking ABA PayWay transaction at {} for tran_id: {}", checkUrl, tranId);

            ResponseEntity<String> response = restTemplate.exchange(checkUrl, HttpMethod.POST, entity, String.class);
            String responseBody = response.getBody();
            log.info("ABA PayWay response: status={}, body={}", response.getStatusCode(), responseBody);

            if (responseBody != null && !responseBody.isBlank()) {
                JsonNode root = objectMapper.readTree(responseBody);
                int status = root.path("status").asInt(-1);
                String desc = root.path("description").asText("");

                // In PayWay v1, status 0 = Success / Approved
                boolean isPaid = (status == 0);
                return new AbaCheckResult(isPaid, status, desc, responseBody);
            }

            return AbaCheckResult.unpaid("Empty response from ABA PayWay");
        } catch (Exception e) {
            log.warn("ABA PayWay check error for tran_id {}: {}", tranId, e.getMessage());
            return AbaCheckResult.unpaid("Verification call failed: " + e.getMessage());
        }
    }

    public static String generateHmacSha512(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC-SHA512", e);
        }
    }
}
