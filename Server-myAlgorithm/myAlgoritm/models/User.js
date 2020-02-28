const { au, sc, rm } = require('../modules/utils');
const pool = require('../modules/db/poolAsync');

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
            console.log(err);
            throw err;
        })

        if(userInsertResult.code && userInsertResult.json) return userInsertResult;

        fields = 'userIdx, langIdx';
        sql = `INSERT INTO ${SUBTABLE}(${fields}) VALUES(?,?);`;
        for(i = 0; i < prefer.length; i++){
            values = [userInsertResult, prefer[i]];
            await pool.queryParam_Parse(sql, values);
        }

        return {
            code: sc.OK,
            json: au.successTrue(sc.CREATED, rm.X_CREATE_SUCCESS(TABLE), userInsertResult.inserId)
        };
    },
}