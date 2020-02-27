var randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const { secretOrPrivateKey } = require("../../config/secretKey");

const options = {
    algorithm: "HS256",
    expiresIn: "1w",
    issuer: "jungah"
};
const refreshOptions = {
    algorithm: "HS256",
    expiresIn: "2w",
    issuer: "jungah"
};

module.exports = {
    sign: (user) => {
        const payload = {
            idx: user.userIdx,
        };

        const result = {
            token: jwt.sign(payload, secretOrPrivateKey, options),
            refreshToken: randtoken.uid(256)
        };
        return result;
    },

    verify: (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {//유효기간 만료
                console.log('expired token');
                return -3;
            } else if (err.message === 'invalid token') {//잘못된 token
                console.log('invalid token');
                return -2;
            } else {
                console.log("invalid token");
                return -2;
            }
        }
        return decoded;
    },

    refresh: (user) => {
        const payload = {
            idx: user.userIdx,
        };
        return jwt.sign(payload, secretOrPrivateKey, options);
    }

    
};