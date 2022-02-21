function ViewInvoiceModel(amount, tipsEnabled) {
    var self = this;
    self.amount = ko.observable(amount);
    self.tipsEnabled = ko.observable(tipsEnabled);
    self.tips = ko.observable(0);
    self.refund = ko.observable(0);

    reduceTips = function () {
        var newVal = Number(self.tips()) - 1;
        if (newVal < 0)
            return;

        self.tips(newVal);
    };

    increaseTips = function () {
        var newVal = Number(self.tips()) + 1;
        self.tips(newVal);
    };

    self.total = ko.computed(function () {
        if(self.tips() >0)
            return Number(self.amount()) + Number(self.tips());
        else
            return Number(self.amount());
    });

    totalDisplay = ko.computed(function () {
        return '$ '+ Number(self.total()).toFixed(2);
    });

    refundDisplay = ko.computed(function () {
        return '$ ' + Number(self.refund()).toFixed(2);
    });

}

function Customer(id, name, phoneNumber, email) {

    var self = this;
    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.phoneNumber = ko.observable(phoneNumber);
    self.email = ko.observable(email);
}

function NewCustomer(name, phoneNumber, email) {

    var self = this;
    self.name = ko.observable(name);
    self.phoneNumber = ko.observable(phoneNumber);
    self.email = ko.observable(email);
}

function InvoiceModel(query) {

    var self = this;

    self.Query = ko.observable(query);
    self.Mobile = ko.observable();
    self.Customer = ko.observable();

    self.InvoiceNumber = ko.observable();
    self.Details = ko.observable();
    self.Amount = ko.observable();
    self.Tips = ko.observable();
    self.ConvenienceFee = ko.observable();
    self.RecurringEnabled = ko.observable(false);

    self.Customers = ko.observableArray();
    self.Searched = ko.observable(false);
    self.ShouldShowInvoice = ko.observable(false);

    customerSearch = function () {

        $.getJSON('/api/Customers/Search?query=' + self.Query())
            .fail(function () {
                alert('Unable to search for the Customers');
            })
            .done(function (results) {
                self.Searched(true);
                self.Customers.removeAll();
                ko.mapping.fromJS(results, {}, self.Customers);
            });

        return false;
    };

    moveToInvoicing = function (customer) {
        self.Customer(customer);
        self.ShouldShowInvoice(true);
    }

    canCreate = ko.computed(function () {
        return self.Customer() !== undefined;
    });

    shouldShowEmptyMessage = ko.computed(function () {
        return self.Searched() && self.Customers().length === 0;
    });

    isSmsEnabled = ko.computed(function () {
        if (self.Customer() === undefined)
            return false;
        if (self.Customer().phoneNumber() === undefined)
            return false;
        return self.Customer().phoneNumber() !== "";
    })

    isEmailEnabled = ko.computed(function () {
        if (self.Customer() === undefined)
            return false;
        if (self.Customer().email() === undefined)
            return false;
        return self.Customer().email() !== "";
    })

}
