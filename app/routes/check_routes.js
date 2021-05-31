module.exports = function (app, db) {
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
            if (phone.length !== 11) {
                res.json({result: result, message: {code: 'Возможна опечатка, проверьте'}});
                return;
            }
            if (name.length === 0) {
                res.json({result: result, message: {code: 'Возможна опечатка, проверьте'}});
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
        } else {
            res.json({result: result});
        }
    });
};