/**
* module to get images
*
* Takes an array as an argument. Represents a set of images to be got.
* Returns a promise that resolves when all images have been taken.
* Each image is resolved with an object being passed. id, urlKey + data props
*/

var gui = window.require( 'nw.gui' ),
    fs = require( 'fs' );


// helper function to get individual image
// cb (callback) used to measure progress
function _getImage( url, width, height, cb ){
    return new Promise(function( resolve, reject ){
        
        var win = gui.Window.open( url, { show: false } ),
            urlKey = url.replace( /\W/g, '' );
        
        win.resizeTo( width, height );
        
        win.once( 'loaded', function(){                       
            win.capturePage( function( img ){
                win.close( true );
                cb();
                resolve( { id: width + 'x' + height, urlKey: urlKey, data: img } );       
            });        
        }); 
        
        win.once( 'closed', function(){
            win = null;
        }); 
        
        win.on( 'error', function(){
            reject( new Error( 'image not captured' ) );        
        });
        
     });

}

// map _getImages onto the config arr
// since _getImage returns a promise we can return Promise.all
module.exports = function( cb ){
    return function( arr ){

        var _url = arr[ 0 ],
            promiseAr = arr.slice( 1 ).map(function( elm ){
                var _split = elm.split( 'x' ),
                    _width = parseInt( _split[ 0 ] ),
                    _height = parseInt( _split[ 1 ] );
                    
                return _getImage( _url, _width, _height, cb );
            
            });
        
        return Promise.all( promiseAr )

    }
}






