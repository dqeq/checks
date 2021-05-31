module.exports = function (app, db, dadata) {
    app.post('/check', (req, res) => {
        let {name = false, phone = false, code = false} = req.body;
        let result = false;
        if (name !== false &&
            phone !== false &&
            code !== false) {
            //prepare
            code = code.toString().replace(/[^0-9]+/g, "");
            phone = phone.toString().replace(/[^0-9]+/g, "");
            name = name.toString().replace(/[^А-Яа-яЁёA-Za-z\s]+/g, "").trim();
            //validate
            if (code.length !== 6) {
                res.json({result: result, message: {code: 'Возможна опечатка, проверьте'}});
                return;
            }

            let qcResult = 5;
            const dadataConfig   = require('../config/dadata');
            const dadataPhoneRequest = async () => {
                const fetch   = require('node-fetch');
                const url = "https://cleaner.dadata.ru/api/v1/clean/phone";
                const options = {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + dadataConfig.apiKey,
                        "X-Secret": dadataConfig.secret
                    },
                    body: JSON.stringify([phone])
                }
                const res = await fetch(url, options)
                    .then(response => response.json())
                    .then(result => {
                        qcResult = result[0].qc
                    })
                    .catch(error => console.log("error", error));
            }
            const dadataNameRequest = async () => {
                const fetch   = require('node-fetch');
                const url = "https://cleaner.dadata.ru/api/v1/clean/name";
                const options = {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + dadataConfig.apiKey,
                        "X-Secret": dadataConfig.secret
                    },
                    body: JSON.stringify([name])
                }
                const res = await fetch(url, options)
                    .then(response => response.json())
                    .then(result => {
                        name = result[0].result
                    })
                    .catch(error => console.log("error", error));
            }
            const processValues = () => {
                if (phone.length !== 11 || qcResult !== 0) {
                    res.json({result: result, message: {phone: 'Возможна опечатка, проверьте'}});
                    return;
                }

                if (name.length === 0) {
                    res.json({result: result, message: {name: 'Возможна опечатка, проверьте'}});
                    return;
                }

                //prepare types
                code = Number(code);
                phone = Number(phone);

                //save
                let collection = db.collection("checks_list");
                const resultObj = {
                    code: code,
                    phone: phone,
                    name: name,
                };

                setTimeout(()=>{
                    collection.findOne({code:code}).then((err, item) => {
                        if (typeof item === 'undefined' && !err) {
                            collection.insert(resultObj, function (err, result) {
                                if(!err){
                                    result = true;
                                }
                                res.json({result: result});
                            })
                        } else {
                            res.json({result: result});
                        }
                    })
                },3000)
            };
            Promise.all([dadataNameRequest(),dadataPhoneRequest()]).then(processValues)
        } else {
            res.json({result: result});
        }
    });
};