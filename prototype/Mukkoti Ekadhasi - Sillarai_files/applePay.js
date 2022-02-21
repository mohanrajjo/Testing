var applePayUiController = (function () {

    return {
        displayApplePayButton: function () {
            document.getElementById('applePay-button').style.display = 'block'
        },
        hideApplePayButton: function () {
            document.getElementById('applePay-button').style.display = 'none'
        }
    }
})()

var applePayController = (function (uiController) {

    var isApplePayAvailable = function () {
        return window.ApplePaySession && ApplePaySession.canMakePayments()
    }

    var startApplePaySession = function () {
        var config = {
            merchantCapabilities: ['supports3DS', 'supportsEMV', 'supportsCredit'],
            supportedNetworks: ['amex', 'masterCard', 'maestro', 'visa', 'mada'],
            countryCode: 'US',
            currencyCode: 'USD',
            total: {
                label: document.getElementById('businessName').innerHTML,
                amount: document.getElementById('total').value
            },
        };

        var session = new ApplePaySession(9, config);
        handleApplePayEvents(session);
        session.begin();
    }

    var validateApplePaySession = function (event, callback) {

        axios.post('/api/payments/validateApplePay?invoiceId=' + document.getElementById('invoiceId').innerHTML,
                {
                    validationURL: event.validationURL
                },
                {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                }
            ).then(function (response) {
                callback(response.data)
            })
    }

    var performTransaction = function (details, callback) {
        axios.post('/api/payments/applePay?tips=0&invoiceId=' + document.getElementById('invoiceId').innerHTML,
                {
                    token: details.token,
                },
                {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                }
            ).then(function (response) {
                callback(response.data)
            })
    }

    var handleApplePayEvents = function (appleSession) {

        appleSession.onvalidatemerchant = function (event) {
            validateApplePaySession(event, function (merchantSession) {
                appleSession.completeMerchantValidation(merchantSession)
            })
        }

        appleSession.onpaymentauthorized = function (event) {
            performTransaction(event.payment, function (outcome) {
                if (outcome.approved) {
                    appleSession.completePayment(ApplePaySession.STATUS_SUCCESS)
                    location.reload()
                } else {
                    appleSession.completePayment(ApplePaySession.STATUS_FAILURE)
                }
            })
        }
    }

    var setButtonClickListener = function () {
        document
            .getElementById('applePay-button')
            .addEventListener('click', function () {
                startApplePaySession()
            })
    }

    return {
        init: function () {
            if (isApplePayAvailable()) {
                uiController.displayApplePayButton()
                setButtonClickListener()
            } else {
                uiController.hideApplePayButton()
            }

        }
    }
})(applePayUiController)

applePayController.init()