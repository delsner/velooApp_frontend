/**
 * Created by lukasmohs on 26/06/16.
 */
(function (angular) {
    'use strict';

    var paypal = require('paypal-rest-sdk');

    angular
        .module('velooAngular')
        .controller('paymentProcessCtrl', paymentProcessCtrl);

    function paymentProcessCtrl($scope) {
        var vm = this;

        $scope.test="test"

        var payment  = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card_token": {}
                }]
            },
            "transactions": [{
                "amount": {
                    "currency": "USD"
                },
                "description": "This is the payment description."
            }]
        };

    }

})(angular);

