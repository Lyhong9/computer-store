package com.example.computer_ecommerce.payment.khqr;

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

import java.util.HashMap;
import java.util.Map;

@Service
public class BakongApiClient {

    private static final Logger log = LoggerFactory.getLogger(BakongApiClient.class);

    private final PaymentProperties properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BakongApiClient(PaymentProperties properties) {
        this.properties = properties;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public record BakongVerificationResult(
            boolean isPaid,
            Integer responseCode,
            String responseMessage,
            String transactionHash,
            String fromAccount,
            String toAccount,
            String rawJson
    ) {
        public static BakongVerificationResult unpaid(String reason) {
            return new BakongVerificationResult(false, -1, reason, null, null, null, null);
        }
    }

    public BakongVerificationResult checkTransactionByMd5(String md5Hash) {
        if (md5Hash == null || md5Hash.isBlank()) {
            return BakongVerificationResult.unpaid("Missing MD5 hash");
        }

        PaymentProperties.BakongProperties bakong = properties.getBakong();
        if (!bakong.isApiEnabled() || bakong.getApiToken() == null || bakong.getApiToken().isBlank()) {
            log.warn("Bakong Open API is disabled or API token is missing.");
            return BakongVerificationResult.unpaid("Bakong API disabled");
        }

        String url = bakong.getApiUrl();
        if (!url.endsWith("/")) {
            url += "/";
        }
        url += "v1/check_transaction_by_md5";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(bakong.getApiToken().trim());

            Map<String, String> body = new HashMap<>();
            body.put("md5", md5Hash.trim().toLowerCase());

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            log.info("Checking Bakong payment at {} for md5: {}", url, md5Hash);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            String responseBody = response.getBody();
            log.info("Bakong API response: status={}, body={}", response.getStatusCode(), responseBody);

            if (responseBody != null && !responseBody.isBlank()) {
                JsonNode root = objectMapper.readTree(responseBody);
                int code = root.path("responseCode").asInt(-1);
                String msg = root.path("responseMessage").asText("");
                JsonNode data = root.path("data");

                if (code == 0 && data != null && !data.isNull() && !data.isMissingNode()) {
                    String hash = data.path("hash").asText(null);
                    String from = data.path("fromAccountId").asText(null);
                    String to = data.path("toAccountId").asText(null);
                    return new BakongVerificationResult(true, code, msg, hash, from, to, responseBody);
                } else {
                    return new BakongVerificationResult(false, code, msg, null, null, null, responseBody);
                }
            }

            return BakongVerificationResult.unpaid("Empty response from Bakong");
        } catch (Exception e) {
            log.warn("Bakong payment verification error for md5 {}: {}", md5Hash, e.getMessage());
            return BakongVerificationResult.unpaid("Verification call failed: " + e.getMessage());
        }
    }
}
