const { au, rm, sc } = require('../modules/utils');
const Post = require('../models/Post');
const emptyParameter = require('../modules/utils/emptyParameter');

module.exports = {
    create: async (req, res) => {
        const { lanIdx, title, code, describe, thought } = req.body;
        if(!lanIdx || !title || !code || !describe || !thought){
            const missParameter = await emptyParameter(req.body);
            res.status(sc.OK)
            .send(au.successFalse(sc.NO_CONTENT, rm.NULL_VALUE_X(missParameter)));
            return;
        }
        Post.create()
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR,rm.INTERNAL_SERVER_ERROR));
        });
    },
    readAll: (req, res) => {
        Post.readAll()
        .then(({ code, json }) => res.status(code).send(json))
        .caych(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    },
    read: (req, res) => {
        const postIdx = req.params.postIdx;
        Post.read(postIdx)
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    },
    update: async (req, res) => {
        const postIdx = req.params.postIdx;
        const { lanIdx, title, code, describe, thought } = req.body;
        if(!lanIdx || !title || !code || !describe || !thought){
            const missParameter = await missParameter(req.body);
            res.status(sc.OK)
            .send(au.successFalse(sc.NO_CONTENT, rm.NULL_VALUE_X(missParameter)));
            return;
        }
        Post.update(postIdx)
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    },
    delete: (req, res) => {
        const postIdx = req.params.postIdx;
        Post.delete(postIdx)
        .then(({ code, json }) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(sc.INTERNAL_SERVER_ERROR)
            .send(au.successFalse(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        });
    }
}
