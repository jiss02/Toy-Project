module.exports = function emptyParameter(datas){
    const missParameter = Object.entries(datas)
    .filter(it => it[1] == undefined).map(it => it[0]).join(',');
    return missParameter;
}
