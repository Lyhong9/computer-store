package com.example.computer_ecommerce.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.payment")
public class PaymentProperties {

    private BakongProperties bakong = new BakongProperties();
    private AbaProperties aba = new AbaProperties();

    public BakongProperties getBakong() {
        return bakong;
    }

    public void setBakong(BakongProperties bakong) {
        this.bakong = bakong;
    }

    public AbaProperties getAba() {
        return aba;
    }

    public void setAba(AbaProperties aba) {
        this.aba = aba;
    }

    public static class BakongProperties {
        private String accountId = "dam_lyhong@bkrt";
        private String accountName = "DAM LYHONG";
        private String merchantCity = "Phnom Penh";
        private String merchantPhone = "855968999414";
        private String storeLabel = "POS Store";
        private String apiUrl = "https://api-bakong.nbc.gov.kh";
        private String apiToken = "";
        private boolean apiEnabled = true;

        public String getAccountId() {
            return accountId;
        }

        public void setAccountId(String accountId) {
            this.accountId = accountId;
        }

        public String getAccountName() {
            return accountName;
        }

        public void setAccountName(String accountName) {
            this.accountName = accountName;
        }

        public String getMerchantCity() {
            return merchantCity;
        }

        public void setMerchantCity(String merchantCity) {
            this.merchantCity = merchantCity;
        }

        public String getMerchantPhone() {
            return merchantPhone;
        }

        public void setMerchantPhone(String merchantPhone) {
            this.merchantPhone = merchantPhone;
        }

        public String getStoreLabel() {
            return storeLabel;
        }

        public void setStoreLabel(String storeLabel) {
            this.storeLabel = storeLabel;
        }

        public String getApiUrl() {
            return apiUrl;
        }

        public void setApiUrl(String apiUrl) {
            this.apiUrl = apiUrl;
        }

        public String getApiToken() {
            return apiToken;
        }

        public void setApiToken(String apiToken) {
            this.apiToken = apiToken;
        }

        public boolean isApiEnabled() {
            return apiEnabled;
        }

        public void setApiEnabled(boolean apiEnabled) {
            this.apiEnabled = apiEnabled;
        }
    }

    public static class AbaProperties {
        private String merchantId = "ec477591";
        private String apiKey = "863a16a886eba42f31ca758eb78c8a4184a003d3";
        private String purchaseUrl = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";
        private String baseUrl = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments";
        private String rsaPublicKey = "";
        private String rsaPrivateKey = "";

        public String getMerchantId() {
            return merchantId;
        }

        public void setMerchantId(String merchantId) {
            this.merchantId = merchantId;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getPurchaseUrl() {
            return purchaseUrl;
        }

        public void setPurchaseUrl(String purchaseUrl) {
            this.purchaseUrl = purchaseUrl;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getRsaPublicKey() {
            return rsaPublicKey;
        }

        public void setRsaPublicKey(String rsaPublicKey) {
            this.rsaPublicKey = rsaPublicKey;
        }

        public String getRsaPrivateKey() {
            return rsaPrivateKey;
        }

        public void setRsaPrivateKey(String rsaPrivateKey) {
            this.rsaPrivateKey = rsaPrivateKey;
        }
    }
}
