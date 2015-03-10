// zip module
// take an array containing arrays of images
// return the generated zip

var JSZip = require( 'jszip' ); 

module.exports = function( arr ){

    var zip = new JSZip();

    // first loop elm is array of image object
    arr.forEach(function( elm ){
        var _folder = zip.folder( elm[ 0 ].urlKey )

        // second loop is through the objects
        elm.forEach(function( elm ){
            
            var _data = elm.data.replace( /^data:image\/(png|jpg|jpeg);base64,/, '' );
            
            _folder.file( elm.id + '.jpg', _data, {base64: true} )
        })

    });

    return zip.generate( { type: 'base64' } );

}



