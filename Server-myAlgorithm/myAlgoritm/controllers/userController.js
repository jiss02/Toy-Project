const {au, sc, rm} = require('../modules/utils');
const encrypt = require('../modules/auth/encryption');
const User = require('../models/User');
const emptyParameter = require('../modules/utils/emptyParameter');

module.exports = {
    create: (req, res) => {
        const { id, password, nickname, email, prefer } = req.body;
        console.log(req.body);
        if(!id || !password || !nickname || !email || !prefer){
            const missParameter = emptyParameter({ id, password, nickname, email, prefer });
            res.status(sc.OK)
            .send(au.successFalse(sc.NO_CONTENT, rm.NULL_VALUE_X(missParameter)));
            return;
        }
        encrypt.encrypt(password)
        .then(({ salt, hashed }) => User.create({ id, password:hashed, salt, nickname, email, prefer}))
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        })
    },
    signin: () => {

    },
    read: () => {

    },
    update: () => {

    },
    delete: () => {

    }
}