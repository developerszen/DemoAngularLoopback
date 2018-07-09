'use strict';

module.exports = function(Perfil) {
    var resp = {};

    Perfil.getPerfiles = (options, cb) => {
        var token = options.headers.access_token;
        Perfil.app.models.Token.verifyToken(token, function(err, resp) {
            if (err) return cb(err)

            if (resp.code != 200) {
                return cb(null, resp);
            }

            Perfil.find({ where: { baja_logica: true } }).then(function(perfiles) {
                if (!perfiles) {
                    resp.status = 'error';
                    resp.code = 500;
                    resp.message = 'Error al buscar';
                    resp.data = null;
                    return cb(null, resp);
                }

                resp.status = 'success';
                resp.code = 200;
                resp.message = 'OK';
                resp.data = perfiles;
                return cb(null, resp);
            });
        });
    }

    Perfil.remoteMethod('getPerfiles', {
        accepts: [{
            arg: 'req',
            type: 'object',
            'http': { source: 'req' }
        }],
        returns: {
            type: 'object',
            root: true
        },
        http: {
            verb: 'get'
        },
    });
};