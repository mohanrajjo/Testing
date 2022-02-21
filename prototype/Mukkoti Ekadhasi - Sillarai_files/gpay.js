const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"]
    }
};

const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
                "gateway": "cardconnect",
                "gatewayMerchantId": document.getElementById('cardconnectMerchantId').innerHTML
            }
        }
    }
);

let paymentsClient = null;

function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        merchantName: document.getElementById('businessName').innerHTML
    };
    paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
    return paymentDataRequest;
}

function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST',
            paymentDataCallbacks: {
                onPaymentAuthorized: onPaymentAuthorized
            }
        });
    }
    return paymentsClient;
}

function onPaymentAuthorized(paymentData) {

    return new Promise(function (resolve, reject) {

        var request = new XMLHttpRequest();
        if (window.paymentFor === 'Invoice')
            request.open("POST", "/api/payments/gPayInvoice?tips=" + document.getElementById('tip').value + "&invoiceId=" + document.getElementById('invoiceId').innerHTML);
        else
            request.open("POST", "/api/payments/gPayCampaign?amount=" + document.getElementById('total').value + "&campaignId=" + document.getElementById('campaignId').innerHTML + "&name=" + document.getElementById('Payment_CustomerName').value + "&phone=" + document.getElementById('Payment_Phone').value + "&email=" + document.getElementById('Payment_Email').value);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(paymentData));
        request.onload = function () {
            if (request.status == 200) {
                resolve({ transactionState: 'SUCCESS' });
                window.location = '/Customers/CampaignThankYou?id=' + JSON.parse(request.response).donationId;
            } else {
                reject(resolve({
                    transactionState: 'ERROR',
                    error: {
                        intent: 'PAYMENT_AUTHORIZATION',
                        message: 'Unable to process payment',
                        reason: 'PAYMENT_DATA_INVALID'
                    }
                }));
            }
        };
 
    });
}

function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function (response) {
            if (response.result) {
                addGooglePayButton();
            }
        })
        .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({
            onClick: onGooglePaymentButtonClicked,
            buttonType: 'pay',
            buttonSizeMode: 'fill'
        });
    document.getElementById('gpay-button').appendChild(button);
}

function getGoogleTransactionInfo() {
    return {
        countryCode: 'US',
        currencyCode: "USD",
        totalPriceStatus: "FINAL",
        totalPrice: document.getElementById('total').value,
        totalPriceLabel: "Total"
    };
}

function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest);
}
