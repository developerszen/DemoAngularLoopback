'use strict';

module.exports = function(UsuarioSistema) {
    var resp = {};
    UsuarioSistema.insertUsuariosSistemas = (data, cb) => {

        let res = {}

        var sql = "";
        for (let index = 0; index < data.length; index++) {
            sql = sql + `insert into usuarios_sistemas
                         (fk_usuario,fk_sistema,usuariocreacion,fechacreacion,baja_logica)
                         values
                         (${data[index].fk_usuario},${data[index].fk_sistema},'cramirez',now(), true);`
        }
        var ds = UsuarioSistema.dataSource;
        console.log(sql)
        ds.connector.query(sql, null, function(err, resp) {
            if (err) {
                cb(res)
            }

            res.type = 'success'
            res.msg = 'Sistemas asignados exitosamente';
            cb(null, res)
        })
    }

    UsuarioSistema.remoteMethod('insertUsuariosSistemas', {
        accepts: [{
            arg: 'data',
            type: 'array',
            http: { source: 'body' }
        }],
        returns: {
            arg: 'data',
            type: 'object'
        },
        http: {
            verb: 'post'
        },
    })

    UsuarioSistema.deleteUsuariosSistemas = (data, cb) => {

        let res = {}
        console.log(data)
        var sql = "";
        for (let index = 0; index < data.length; index++) {
            sql = sql + `update usuarios_sistemas
                         set baja_logica = false, fechamodificacion = now()
                         where fk_usuario = ${data[index].fk_usuario} and fk_sistema = ${data[index].fk_sistema};`
        }
        var ds = UsuarioSistema.dataSource;
        console.log(sql)
        ds.connector.query(sql, null, function(err, resp) {
            if (err) {
                return cb(res)
            }

            res.type = 'success'
            res.msg = 'sistemas eliminados exitosamente'
            cb(null, res)
        })
    }

    UsuarioSistema.remoteMethod('deleteUsuariosSistemas', {
        accepts: {
            arg: 'data',
            type: 'array',
            http: { source: 'body' }
        },
        returns: {
            arg: 'data',
            type: 'object'
        },
        http: {
            verb: 'post'
        },
    })



    UsuarioSistema.getSistemasByFkUsuario = (fk_usuario, cb) => {

        var ds = UsuarioSistema.dataSource;
        var sql = `select s.id, s.sistema, s.link, s.color, us.ultimo_acceso
                   from usuarios_sistemas us 
                   inner join sistemas s on s.id = us.fk_sistema 
                   and s.baja_logica = true 
                   where us.baja_logica = true and us.fk_usuario = $1`
        ds.connector.query(sql, [fk_usuario], function(err, resp) {
            console.log(resp)
            if (err) console.log(err);
            cb(null, resp)
        })
    }

    UsuarioSistema.remoteMethod('getSistemasByFkUsuario', {
        accepts: [{
            arg: 'fk_usuario',
            type: 'string'
        }],
        returns: {
            type: 'array',
            root: true
        },
        http: {
            verb: 'get'
        },
    })

    UsuarioSistema.getUsuariosByFkSistema = (filtro, limit, skip, fk_sistema, options, cb) => {

        var token = options.headers.access_token;
        UsuarioSistema.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }

            var andFkSistema = ``;
            if (fk_sistema != null) {
                andFkSistema = ` and us.fk_sistema = ${fk_sistema} `;
            }

            var andFiltro = ``;
            if (filtro != null && filtro != '') {
                andFiltro = `and (lower(username) like '%${filtro.toLowerCase()}%' 
                        or lower(nombres) like '%${filtro.toLowerCase()}%' 
                        or lower(apellidos) like '%${filtro.toLowerCase()}%')`;
            }

            var ds = UsuarioSistema.dataSource;
            var sql = `select us.id, fk_usuario, fk_sistema, username, nombres,apellidos
                        from usuarios_sistemas us
                        inner join usuarios u on u.id = us.fk_usuario and u.baja_logica = true
                        where us.baja_logica = true ${andFkSistema} 
                        limit $1 offset $2 `
            console.log(limit)
            console.log(skip)
            console.log(sql)
            ds.connector.query(sql, [limit, skip], function(err, result1) {
                if (err) console.log(err);

                var sql = `select count(*) count
                            from usuarios_sistemas us
                            inner join usuarios u on u.id = us.fk_usuario and u.baja_logica = true
                            where us.baja_logica = true  ${andFkSistema}`;

                ds.connector.query(sql, null, function(err, result2) {
                    if (err) {
                        console.log(err);
                    }
                    resp.status = 'success';
                    resp.code = 200;
                    resp.message = 'OK';
                    resp.data = {
                        data: result1,
                        count: result2[0].count
                    };

                    return cb(null, resp);
                });
            });
        });
    };

    UsuarioSistema.remoteMethod('getUsuariosByFkSistema', {
        accepts: [{
                arg: 'filtro',
                type: 'string',
            },
            {
                arg: 'limit',
                type: 'number',
            },
            {
                arg: 'skip',
                type: 'number',
            },
            {
                arg: 'fk_sistema',
                type: 'number'
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

    UsuarioSistema.getUsuariosInSistema = (fk_sistema, options, cb) => {

        var token = options.headers.access_token;
        UsuarioSistema.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }

            var ds = UsuarioSistema.dataSource;
            var sql = `select u.id,u.username, u.nombres,u.apellidos
                        from usuarios u
                        where u.baja_logica = true
                        and u.id in (select us.fk_usuario
                                        from usuarios_sistemas us
                                        where us.baja_logica = true and fk_sistema = $1)`;
            ds.connector.query(sql, [fk_sistema], function(err, result) {
                if (err) console.log(err);
                resp.status = 'success';
                resp.code = 200;
                resp.message = 'OK';
                resp.data = result

                cb(null, resp)
            });
        });
    }

    UsuarioSistema.remoteMethod('getUsuariosInSistema', {
        accepts: [{
                arg: 'fk_sistema',
                type: 'number'
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
    })

    UsuarioSistema.getUsuariosNotInSistema = (fk_sistema, options, cb) => {

        var token = options.headers.access_token;
        UsuarioSistema.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }
            console.log("por aca not in")
            console.log(fk_sistema)
            var ds = UsuarioSistema.dataSource;
            var sql = `select u.id,u.username, u.nombres,u.apellidos
                        from usuarios u
                        where u.baja_logica = true
                        and u.id not in (select us.fk_usuario
                                        from usuarios_sistemas us
                                        where us.baja_logica = true and fk_sistema = $1)`;
            ds.connector.query(sql, [fk_sistema], function(err, result) {
                if (err) console.log(err);

                resp.status = 'success';
                resp.code = 200;
                resp.message = 'OK';
                resp.data = result

                return cb(null, resp)
            });
        });
    }

    UsuarioSistema.remoteMethod('getUsuariosNotInSistema', {
        accepts: [{
                arg: 'fk_sistema',
                type: 'number'
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
    })



    UsuarioSistema.getSistemasNoAsignadosByFkUsuario = (fk_usuario, cb) => {

        var ds = UsuarioSistema.dataSource;
        var sql = `select s.id, s.sistema, s.link
                       from sistemas s 
                       where s.baja_logica = true and s.id not in (select us.fk_sistema
                                                                   from usuarios_sistemas us
                                                                   where us.baja_logica = true and fk_usuario = $1)`
        ds.connector.query(sql, [fk_usuario], function(err, data) {
            console.log(data)
            if (err) console.log(err);

            cb(null, data)
        })
    }

    UsuarioSistema.remoteMethod('getSistemasNoAsignadosByFkUsuario', {
        accepts: [{
            arg: 'fk_usuario',
            type: 'string'
        }],
        returns: {
            type: 'array',
            root: true
        },
        http: {
            verb: 'get'
        },
    })

    UsuarioSistema.updateUltimoAcceso = (data, cb) => {
        var ds = UsuarioSistema.dataSource;
        var sql = `update usuarios_sistemas
        set ultimo_acceso = now()
        where fk_usuario = $1 and fk_sistema in (select id from sistemas where link = $2 limit 1)`
        ds.connector.query(sql, [data.fk_usuario, data.url], function(err, data) {
            if (err) console.log(err);

            cb(null, data)
        })
    }

    UsuarioSistema.remoteMethod('updateUltimoAcceso', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'post'
        },
    })


    // UsuarioSistema.find({
    //     include: {
    //         relation: "sistemas",
    //         scope: {
    //             fields:["sistema"]
    //         }
    //     }
    // },
    // {where:{fk_usuario: data.fk_usuario}}, function(err, res){
    //     return cb(null, res)
    // })



};