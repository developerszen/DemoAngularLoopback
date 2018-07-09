'use strict';

module.exports = function (MenuPerfil) {

    MenuPerfil.getMenu = (fk_perfil, cb) => {
        var ds = MenuPerfil.dataSource;
        var sql = `select m.id, m.menu,m.tipo, m.path, m.icono, m.id_padre, 
                        (select count(*) from menus_perfiles mmp where mmp.fk_perfil = 1 and mmp.fk_menu = m.id and m.id_padre != null) cant_hijos
                    from menus_perfiles mp
                    inner join menus m on m.id = mp.fk_menu and m.baja_logica = true
                    where mp.baja_logica = true and mp.fk_perfil = $1
                    order by m.indice asc`
        ds.connector.query(sql,[fk_perfil],(err,resp) => {
            if(err) console.log(err)
            return cb(null, resp)
        })
    }

    MenuPerfil.remoteMethod('getMenu',{
        accepts: {
            arg: 'fk_perfil',
            type: 'number'
        },
        returns: {
            type: 'array',
            root: true
        },
        http:{
            verb: 'get'
        }
    })
};
