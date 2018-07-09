'use strict';

module.exports = function(Sistema) {
    var resp = {};
    Sistema.getSistemas = (filtro, limit, skip, fk_sistema, options, cb) => {
        var token = options.headers.access_token;
        Sistema.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }

            var andFkSistema = '';
            if (fk_sistema != null) {
                andFkSistema = ` and id = ${fk_sistema} `;
            }

            var andFiltro = ``;
            if (filtro != null && filtro != '') {
                andFiltro = `and (lower(sistema) like '%${filtro.toLowerCase()}%')`;
            }
            var ds = Sistema.dataSource;
            var sql = `select id,sistema,link,color
                        from sistemas
                        where baja_logica = true ${andFkSistema} ${andFiltro}
                        limit $1 offset $2`;
            console.log(sql)

            ds.connector.query(sql, [limit, skip], function(err, result1) {
                if (err) console.log(err);
                var sql = `select count(*) count
                            from sistemas
                            where baja_logica = true ${andFkSistema} ${andFiltro}`;

                ds.connector.query(sql, null, function(err, result2) {
                    if (err) {
                        console.log(err);
                    }

                    console.log(result2)
                    resp.status = 'success';
                    resp.code = 200;
                    resp.message = 'OK';
                    resp.data = {
                        data: result1,
                        count: result2[0].count
                    }

                    return cb(null, resp)
                });
            });
        });
    }

    Sistema.remoteMethod('getSistemas', {
        accepts: [{
                arg: 'filtro',
                type: 'string',
            },
            {
                arg: 'limit',
                type: 'string',
            },
            {
                arg: 'skip',
                type: 'string',
            },
            {
                arg: 'fk_sistema',
                type: 'string',
            },
            {
                arg: 'req',
                type: 'object',
                'http': { source: 'req' }
            }
        ],
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'get'
        },
    });
};