'use strict';

var assert = require('assert') ;

module.exports = function (req, res, next) {
    assert(typeof req.registration === 'undefined', 'drachtio-mw-registration-parser has been used twice') ;

    if( req.method !== 'REGISTER' ) { return next(); }

    req.registration = {};

    var contact = req.getParsedHeader('Contact') ;
    var to = req.getParsedHeader('To') ;
    var expiresHeader = req.get('Expires') ;

    //contact header is required
    if( !req.get('Contact') || !contact.length ) {
        return res.send(400) ;
    }
    var expires ;
    if( contact[0].params && contact[0].params.expires ) {
        expires = parseInt( contact[0].params.expires ) ;
    }
    else if( typeof expires === 'undefined' && typeof expiresHeader !== 'undefined' ) {
        expires = parseInt( expiresHeader) ;
    }
    else {
        return res.send(400) ;
    }

    req.registration = {
        type: 0 === expires ? 'unregister' : 'register',
        expires: expires,
        contact: contact,
        aor: to.uri
    } ;

    next() ;

};
