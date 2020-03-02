const { au, sc, rm } = require('../modules/utils');
const pool = require('../modules/db/poolAsync');
const encrypt = require('../modules/auth/encryption');
const jwt = require('../modules/auth/jwt');

const TABLE = 'user';
const SUBTABLE = 'prefer_lang';

module.exports = {
    create: async ({ id, password, salt, nickname, email, prefer }) => {
        let fields = 'id, password, salt, nickname, email';
        let sql = `INSERT INTO ${TABLE}(${fields}) VALUES(?,?,?,?,?);`;
        let values = [id, password, salt, nickname, email];
        const userInsertResult = await pool.queryParam_Parse(sql, values)
        .then(result => {
            return result.insertId;
        })
        .catch(err => {
            if(err.errno == 1062) {
                console.log(err.errno, err.code);
                const reg = /(?<=\.)[a-z]+(?=\_)/.exec(err.sqlMessage);
                return {
                    code: sc.OK,
                    json: au.successFalse(sc.BAD_REQUEST, rm.ALREADY_X(reg[0]))
                };
            }
            throw err;
        });
        if(userInsertResult.code && userInsertResult.json) return userInsertResult;
        // 트랜잭션으로 처리했어야 했을까?
        fields = 'userIdx, langIdx';
        sql = `INSERT INTO ${SUBTABLE}(${fields}) VALUES(?,?);`;
        for(i = 0; i < prefer.length; i++){
            values = [userInsertResult, prefer[i]];
            await pool.queryParam_Parse(sql, values)
            .catch(err => {
                console.log(err);
                throw err;
            });
        }
        return {
            code: sc.OK,
            json: au.successTrue(sc.CREATED, rm.X_CREATE_SUCCESS(TABLE), userInsertResult.inserId)
        };
    },

    signin: async ({ id, password }) => {
        let sql = `SELECT * FROM ${TABLE} WHERE id = ${id};`;
        const signinResult = await pool.queryParam_None(sql)
        .then(result => result)
        .catch(err => { throw err });
        if(signinResult.length == 0){
            return {
                code: sc.OK,
                json: au.successFalse(sc.BAD_REQUEST, rm.X_EMPTY('user'))
            };
        }
        const user = signinResult[0];
        const { salt, hashed } = await encrypt.encryptWithSalt(password, user.salt);
        if (hashed != user.password){
            return {
                code:sc.OK,
                json: au.successFalse(sc.BAD_REQUEST,rm.X_NOT_MATCH('password'))
            };
        }
        const token = jwt.sign(user).token;
        const resData = { token };
        return {
            code: sc.OK,
            json: au.successTrue(sc.OK, rm.X_SUCCESS('로그인'), resData)
        };
    },

    read: async (userIdx) => {
        let userSql = `SELECT * FROM ${TABLE} WHERE userIdx = ${userIdx}`;
        let innerSql = `SELECT langIdx FROM ${SUBTABLE} WHERE userIdx = ${userIdx}`;
        let preferlangSql = `SELECT * FROM language WHERE langIdx IN (${innerSql})`;
        const userReadResult = await pool.queryParam_None(userSql)
        .then(result => result[0])
        .catch(err => { throw err });
        const userLangResult = await pool.queryParam_None(preferlangSql)
        .catch(err => { throw err });
        userReadResult['prefer_lang'] = userLangResult;
        const resData = userReadResult;
        return {
            code: sc.OK,
            json: au.successTrue(sc.OK, rm.X_READ_SUCCESS(TABLE), resData)
        };
    }
}