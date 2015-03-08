/**
* module to get images
*
*/

var gui = window.require( 'nw.gui' ),
    fs = require( 'fs' );


// helper function to get individual image
function _getImage( url, width, height ){
    return new Promise(function( resolve, reject ){
        
        var win = gui.Window.open( url, { show: false } ),
            urlKey = url.replace( /\W/g, '' );
        
        win.resizeTo( width, height );
        
        win.once( 'loaded', function(){                       
            win.capturePage( function( img ){
                win.close( true );
                resolve( { id: width + 'x' + height, urlKey: urlKey, data: img } );       
            });        
        }); 
        
        win.once( 'closed', function(){
            win = null;
        }); 
        
        win.on( 'error', function(){
            reject( new Error( 'image not captured' )        
        });
        
     });

}


module.exports = function( arr ){

    var _url = arr[ 0 ],
        promiseAr = arr.slice( 1 ).map(function( elm ){
            var _split = elm.split( 'x' ),
                _width = parseInt( _split[ 0 ] ),
                _height = parseInt( _split[ 1 ] );
                
            return _getImage( _url, _width, _height );
        
        });
    
    return Promise.all( promiseAr )

}



