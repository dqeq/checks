module.exports = function (app, db) {
    const dadataConfig = require('../config/dadata');
    const dadataNameRequest = (name) => {
        return new Promise(async (resolve, reject) => {
            const fetch = require('node-fetch');
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
            console.log('PHONE---')
            console.log(options)
            const res = await fetch(url, options)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    name = result[0].result
                })
                .catch(error => console.log("error", error));
            resolve(name)
        })
    }
    const dadataPhoneRequest = (phone) => {
        return new Promise(async (resolve, reject) => {
            const fetch = require('node-fetch');
            const url = "https://cleaner.dadata.ru/api/v1/clean/phone";
            let qcResult = 5;
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
            console.log('NAME---')
            console.log(options)
            const res = await fetch(url, options)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    qcResult = result[0].qc
                })
                .catch(error => console.log("error", error));
            resolve(qcResult);
        })
    }
    const processPhoneValue = (qcResult, res) => {
        console.log(`QC ${qcResult}`)
        if (Number(qcResult) !== 0) {
            console.log(qcResult);
            res.json({result: false, message: {phone: 'Возможна опечатка, проверьте'}});
            return;
        }
        return true;
    };
    const processNameValue = (name, unprocessedName, res) => {
        console.log(`NAME ${name}`)
        if (name !== unprocessedName) {
            res.json({result: false, message: {name: 'Возможна опечатка, проверьте'}, data: {name: name}});
            return;
        }
        return true;
    };

    app.post('/checkName', (req, res) => {
        let {name = false} = req.body;
        name = name.toString().replace(/[^А-Яа-яЁёA-Za-z\s]+/g, "").trim();
        if (name && name.length > 3) {
            const unprocessedName = String(name);
            dadataNameRequest(name).then((name) => {
                if (processNameValue(name, unprocessedName, res)) {
                    res.json({result: true});
                }
            })
        } else {
            res.json({result: false});
        }
    });
    app.post('/checkPhone', (req, res) => {
        let {phone = false} = req.body;
        phone = phone.toString().replace(/[^0-9]+/g, "");
        if (phone && phone.length == 11) {
            dadataPhoneRequest(phone).then((qc) => {
                if (processPhoneValue(qc, res)) {
                    res.json({result: true});
                }
            })
        } else {
            res.json({result: false});
        }
    });
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
            let qcResult = 5
            const processValues = (qcResult) => {
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

                setTimeout(() => {
                    collection.findOne({code: code}).then((err, item) => {
                        if (typeof item === 'undefined' && !err) {
                            collection.insert(resultObj, function (err, result) {
                                if (!err) {
                                    result = true;
                                }
                                res.json({result: result});
                            })
                        } else {
                            res.json({result: result});
                        }
                    })
                }, 3000)
            };

            const unprocessedName = String(name);
            dadataNameRequest(name)
                .then((nameL) => {
                    name = nameL
                    processNameValue(nameL, unprocessedName, res);
                })
                .then(() => {
                    dadataPhoneRequest(phone).then((qc) => {
                        qcResult = qc
                        processPhoneValue(qc, res)
                    }).then(()=>(processValues(qcResult)))
                })

        } else {
            res.json({result: result});
        }
    });
}
;