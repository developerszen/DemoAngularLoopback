'use strict';

module.exports = function(Token) {
    var jwt = require('jsonwebtoken');
    var Q = require('q')

    /**
     * getTokens
     * * Obtiene el listado de tokens
     * @param {id del usuario} fk_usuario 
     * @param {filtro para habilitado = true or false} habilitado 
     * @param {filtro para paginador} limit 
     * @param {filtro para paginador} skip 
     * @param {opciones adicionales en request} options 
     * @param {callback de la función} cb 
     */
    Token.getTokens = (fk_usuario, habilitado, limit, skip, options, cb) => {
        Token.verifyToken(options.headers.access_token, function(err, resp) {
            if (err) {
                return cb(err);
            }
            if (resp.code != 200) {
                return cb(null, data)
            }
            Token.find({ where: { fk_usuario: fk_usuario, habilitado: habilitado, limit: limit, skip: skip } }).then(function(tokens) {
                return cb(null, tokens)
            });
        })

    }

    Token.remoteMethod('getTokens', {
        accepts: [{
                arg: 'fk_usuario',
                type: 'number',
            },
            {
                arg: 'habilitado',
                type: 'bolean',
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
                arg: 'req',
                type: 'object',
                'http': { source: 'req' }
            }
        ],
        returns: {
            type: 'array',
            root: true
        },
        http: {
            verb: 'get'
        },
    });


    Token.verifyToken = (access_token, cb) => {
        return verifyToken(access_token, cb)
    }

    /**
     * verifyToken
     * * Verifica que el token enviado sea válido
     * @param access_token token en formato jwt
     * @param cb respuesta de la función
     */
    function verifyToken(access_token, cb) {
        var resp = {};
        if (!access_token) {
            resp.status = 'error';
            resp.code = 500;
            resp.message = 'Token no proporcionado';
            return cb(null, resp);
        } else {
            jwt.verify(access_token, 'llave', function(err, res) {
                if (err) {
                    resp.status = 'error';
                    resp.code = 403;
                    resp.message = err.message;
                    return cb(null, resp);
                } else {
                    tokenHabilitado(access_token).then(function(habilitado) {
                        if (habilitado) {
                            resp.status = 'success';
                            resp.code = 200;
                            resp.message = 'OK';
                            return cb(null, resp);
                        } else {
                            resp.status = 'error';
                            resp.code = 403;
                            resp.message = 'Token no habilitado';
                            return cb(null, resp);
                        }
                    });
                }
            });
        }
    }

    Token.remoteMethod('verifyToken', {
        accepts: {
            arg: 'access_token',
            type: 'string',
            required: true
        },
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'get'
        }
    });
    /**
     * tokenHabilitado
     * * Verifica si el token esta habilitado en la base de datos
     * @param access_token token en formato jwt
     */
    function tokenHabilitado(access_token) {
        var deff = Q.defer();

        Token.decodeToken(access_token, function(err, resp) {
            if (err) {
                console.log("Error al decodificar el token");
                return false;
            }

            var sql = `select habilitado
                        from tokens
                        where fk_usuario = $1 and token = $2`;
            var ds = Token.dataSource;
            ds.connector.query(sql, [resp.fk_usuario, access_token], function(err, resp) {
                if (err) {
                    console.log(err)
                    deff.resolve(false)
                }
                console.log(resp.length)
                if (resp.length > 0) {
                    console.log(resp[0].habilitado)
                    deff.resolve(resp[0].habilitado);
                } else
                    deff.resolve(false)
            });
        })

        return deff.promise

    }

    /**
     * decodeToken
     * * Decodifica el token
     * @param token token en formato jwt
     * @param cb respuesta de la función
     */
    Token.decodeToken = (token, cb) => {
        var decoded = jwt.decode(token);
        return cb(null, decoded);
    }

    Token.remoteMethod('decodeToken', {
        accepts: {
            arg: 'token',
            type: 'string'
        },
        returns: {
            arg: 'obj',
            type: 'object'
        },
        http: {
            verb: 'get'
        }
    });
    /**
     * deshabilitarToken
     * * Deshabilita el token cambiando el estado habilitado a false
     * @param fk_token id del token
     * @param cb callback de la función 
     */
    Token.deshabilitarToken = (fk_token, cb) => {
        var sql = `update tokens
                    set habilitado = false
                    where id = $1`;
        var ds = Token.dataSource;
        ds.connector.query(sql, [fk_token], function(err, resp) {
            if (err) {
                resp.status = 'error';
                resp.code = 500;
                resp.message = err.message;
                resp.detalle = err
            }

            resp.status = 'success';
            resp.code = 200;
            resp.message = 'Token deshabilitado exitosamente';

            return cb(null, resp);
        });
    }

    Token.remoteMethod('deshabilitarToken', {
        accepts: {
            arg: 'fk_token',
            type: 'numeric'
        },
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'post'
        }
    });
};