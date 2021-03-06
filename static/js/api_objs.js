class APIAccount {
    // Constructor initialised all variables to null, then asks the API to fill them in
    constructor(acct_id) {
        this.account_id = acct_id;
        this.create = this.account_id == null;
        // If loading already existing object, read from API
        this.balance = null;
        this.customer_name = null;
        this.credit_score = null;
        this.risk_score = null;
        this.currency = null;
        this.state = null;
        // Loaded will equal true once the API call is done
        this.loaded = false;
        this.get_info_from_api(this);
    }

    // All the setters for the different attributes
    set account_id_set(new_id) {
        this.account_id = new_id;
    }

    set customer_name_set(new_name) {
        this.customer_name = new_name;
    }

    set balance_set(new_bal) {
        this.balance = new_bal;
    }

    set credit_score_set(new_score) {
        this.credit_score = new_score;
    }

    set risk_score_set(new_risk) {
        this.risk_score = new_risk;
    }

    set currency_set(new_curr) {
        this.currency = new_curr;
    }

    set state_set(new_state) {
        this.state = new_state;
    }

    set loaded_status(new_loaded) {
        this.loaded = new_loaded
    }

    // Function which fills in the null attributes via an AJAX call to the Capital One API

    get_info_from_api = function (obj) {
        // Different URL and data depending on if creating or retrieving object
        let url = obj.create ? "/create_account/" : "/get_account_by_id/";
        let post = obj.create ? "quantity=1" : "account_id=" + obj.account_id;
        $.ajax({
            url: url,
            data: post,
            dataType: 'json',
            method: 'POST',
            success: function(data) {
                let account_info = JSON.parse(data['data'])['Accounts'][0];
                obj.account_id_set = account_info['accountId'];
                obj.credit_score_set = account_info['creditScore']
                obj.customer_name_set = account_info['firstname'] + " " + account_info['lastname'];
                obj.currency_set = account_info['currencyCode'];
                obj.risk_score_set = account_info['riskScore'];
                obj.balance_set = account_info['balance'];
                obj.state_set = account_info['state']
                // Sets loaded to true now all attributes are set
                obj.loaded_status = true;
            }
        });
    }
}

class APITransaction {

    constructor(acct_id, trans_id) {
        this.account_id = acct_id;
        this.transaction_id = trans_id;
        this.create = this.transaction_id == null;
        this.amount = null;
        this.merchant_name = null;
        this.merchant_category = null;
        this.loaded = false;
        this.get_info_from_api(this);
    }

    set account_id_set(new_id){
        this.account_id = new_id;
    }

    set transaction_id_set(new_id){
        this.transaction_id = new_id;
    }

    set loaded_set(new_loaded){
        this.loaded = new_loaded;
    }

    set amount_set(new_amount){
        this.amount = new_amount;
    }

    set merchant_name_set(new_name){
        this.merchant_name = new_name;
    }

    set merchant_category_set(new_cat){
        this.merchant_category = new_cat;
    }

    get_info_from_api = function(obj){
        let url = obj.create ? '/create_transactions/' : '/get_transaction_by_id/';
        let post = 'account_id=' + obj.account_id;
        post = post + (obj.create ? '&quantity=1' : "&transaction_id=" + obj.transaction_id)
        $.ajax({
            url: url,
            data: post,
            dataType: 'json',
            method: 'POST',
            success: function(data) {
                //console.log(data['data']);
                // Get the correct JSON data out of the response depending on if creating or recieving data
                let transaction_info = null;
                if(obj.create){
                    transaction_info = JSON.parse(data['data'])["Transactions"][0];
                }else {
                    transaction_info = JSON.parse(data['data']);
                }
                obj.account_id = transaction_info['accountUUID'];
                obj.transaction_id = transaction_info['transactionUUID'];
                obj.amount = transaction_info['amount'];
                obj.merchant_category_set = transaction_info['merchant']['category'];
                obj.merchant_name_set = transaction_info['merchant']['name'];
                // Sets loaded to true now all attributes are set
                obj.loaded_set = true;

                console.log("Wahey 2!");
            }
        });
    }
}
