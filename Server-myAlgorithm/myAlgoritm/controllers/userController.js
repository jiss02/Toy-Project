const {au, sc, rm} = require('../modules/utils');
const encrypt = require('../modules/auth/encryption');
const User = require('../models/User');
const emptyParameter = require('../modules/utils/emptyParameter');

module.exports = {
    create: async (req, res) => {
        const { id, password, nickname, email, prefer } = req.body;
        if(!id || !password || !nickname || !email || !prefer){
            const missParameter = await emptyParameter(req.body);
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
    signin: async (req, res) => {
        const { id, password } = req.body;
        if(!id || !password){
            const missParameter = await emptyParameter(req.body);
            res.status(sc.OK)
            .send(au.successFalse(sc.NO_CONTENT, rm.NULL_VALUE_X(missParameter)));
            return;
        }
        User.signin({ id, password })
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    },
    read: (req, res) => {
        const userIdx = req.decoded.idx;
        User.read(userIdx)
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        })
    },
    update: async (req, res) => {
        const userIdx = req.decoded.idx;
        const { nickname, email } = req.body;
        if(!nickname || !email){
            const missParameter = await emptyParameter(req.body);
            res.status(sc.OK)
            .send(au.successFalse(sc.NO_CONTENT, rm.NULL_VALUE_X(missParameter)));
        }
        User.update({ userIdx, nickname, email })
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    },
    delete: (req, res) => {
        const userIdx = req.decoded.idx;
        User.delete(userIdx)
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        })

    }
}