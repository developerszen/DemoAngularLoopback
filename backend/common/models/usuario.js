'use strict';

module.exports = function(Usuario) {
    var jwt = require('jsonwebtoken');
    var sha256 = require('js-sha256');
    var resp = {};
    /**
     * authenticate
     * * Verifica las credenciales de un usuario
     * @param {username, password, remember} data 
     * @param {callback de la función} cb 
     */
    Usuario.authenticate = (data, cb) => {

        Usuario.findOne({ where: { username: data.username, baja_logica: true } }).then(function(usuario) {
            if (!usuario) {
                resp.status = 'error';
                resp.code = 500;
                resp.message = 'Usuario no encontrado';
                resp.data = { token: '' };
                return cb(null, resp);
            }
            var passcrypted = sha256.hmac('key', data.password);
            console.log("password")
            console.log(passcrypted)
            if (usuario.password != passcrypted) {
                resp.status = 'error';
                resp.code = 500;
                resp.message = 'Password incorrecto';
                resp.data = { token: '' };
                return cb(null, resp);
            }

            var payload = {
                fk_usuario: usuario.id,
                username: usuario.username,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                foto: usuario.foto,
                fk_perfil: usuario.fk_perfil
            };
            var token = '';
            if (data.remember) {
                token = jwt.sign(payload, 'llave', { expiresIn: 10000 });
            } else {
                token = jwt.sign(payload, 'llave', { expiresIn: 30 });
            }

            var sql = `update usuarios
                 set logins = logins + 1, last_login = now()
                 where id = $1`;
            var ds = Usuario.dataSource;

            ds.connector.query(sql, [usuario.id], function(err, resp) {
                if (err) return cb(res)
                resp.status = 'success';
                resp.code = 200;
                resp.message = 'OK';
                resp.data = { token: token };
                return cb(null, resp);
            });
        });
    }

    Usuario.remoteMethod('authenticate', {
        accepts: [{
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        }],
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'post'
        },
    });
    /**
     * getUsuarios
     * @param {*} filtro 
     * @param {*} limit 
     * @param {*} skip 
     * @param {*} options 
     * @param {*} cb 
     */
    Usuario.getUsuarios = (filtro, limit, skip, fk_usuario, options, cb) => {
        console.log("para usuarios")
        console.log(fk_usuario)
        var token = options.headers.access_token;
        Usuario.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }

            var andFkUsuario = '';
            if (fk_usuario != null) {
                andFkUsuario = ` and u.id = ${fk_usuario} `;
            }

            var andFiltro = ``;
            if (filtro != null && filtro != '') {
                andFiltro = `and (lower(username) like '%${filtro.toLowerCase()}%' 
                        or lower(nombres) like '%${filtro.toLowerCase()}%' 
                        or lower(apellidos) like '%${filtro.toLowerCase()}%')`;
            }
            var ds = Usuario.dataSource;
            var sql = `select u.*, p.perfil
                        from usuarios u
                        inner join perfiles p on p.id = u.fk_perfil
                        where u.baja_logica = true and u.estado = 1 
                        ${andFiltro} ${andFkUsuario}
                        order by u.id
                        limit $1 offset $2`;

            ds.connector.query(sql, [limit, skip], function(err, result1) {
                if (err) console.log(err);
                var sql = `select count(*) count
                        from usuarios u
                        where baja_logica = true and estado = 1 ${andFiltro} ${andFkUsuario}`
                console.log(sql)
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
                    }

                    return cb(null, resp)
                })
            })
        })
    }

    Usuario.remoteMethod('getUsuarios', {
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
                arg: 'fk_usuario',
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

    Usuario.updatePerfil = (fk_usuario, fk_perfil, options, cb) => {

        var token = options.headers.access_token;
        Usuario.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err);

            if (resp.code != 200) {
                return cb(null, resp)
            }

            Usuario.findOne({ where: { id: fk_usuario } }).then(function(usuario) {
                if (!usuario) {
                    resp.status = 'error';
                    resp.code = 500;
                    resp.message = 'Usuario no encontrado';
                    return cb(null, resp);
                }

                var sql = `update usuarios
                           set fk_perfil = $1
                           where id = $2`;
                var ds = Usuario.dataSource;
                ds.connector.query(sql, [fk_perfil, fk_usuario], function(err, result) {
                    if (err) {
                        resp.status = 'error';
                        resp.code = 500;
                        resp.message = err.message;
                        return cb(null, resp);
                    }

                    resp.status = 'success';
                    resp.code = 200;
                    resp.message = 'OK';

                    return cb(null, resp);
                });
            });
        });
    };

    Usuario.remoteMethod('updatePerfil', {
        accepts: [{
                arg: 'fk_usuario',
                type: 'number',
            },
            {
                arg: 'fk_perfil',
                type: 'number',
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
            verb: 'post'
        },
    });
};