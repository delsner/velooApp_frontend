/**
 * Created by lukasmohs on 26/06/16.
 */
(function (angular) {
    'use strict';


    angular
        .module('velooAngular')
        .controller('paymentCtrl', paymentCtrl);

    function paymentCtrl($scope, $route, $rootScope, authService) {
        var vm = this;

        vm.test="test"
        //vm.paypal = require('paypal-rest-sdk');

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
        /*
        payment.payer.funding_instruments[0].credit_card_token.credit_card_id = user.card;
        payment.transactions[0].amount.total = req.query.order_amount;
        payment.transactions[0].description = req.session.desc;
        paypal.payment.create(payment, {}, function (err, resp) {
            if (err) {
                console.log(err);
                res.render('order_detail', { message: [{desc: "Payment API call failed", type: "error"}]});
            }
            if (resp) {
                db.insertOrder(order_id, req.session.email, resp.id, resp.state, req.session.amount, req.session.desc, resp.create_time, function (err, order) {
                    if (err || !order) {
                        console.log(err);
                        res.render('order_detail', { message: [{desc: "Could not save order details", type: "error"}]});
                    } else {
                        db.getOrders(req.session.email, function (err, orderList) {
                            console.log(orderList);
                            res.render('order_detail', {orders : orderList, message: [{desc: "Order placed successfully.", type: "info"}]});
                        });
                    }
                });
            }
        });
    */
    }


})(angular);

