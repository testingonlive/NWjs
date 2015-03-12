/**
* module to get images
*
*/

var gui = window.require( 'nw.gui' ),
    util = require( 'util' ),
    events = require( 'events' ),
    fs = require( 'fs' );


function ImageGetter(){
    events.EventEmitter.call( this );
}

util.inherits( ImageGetter, events.EventEmitter );


ImageGetter.prototype._getImage = function( url, width, height ){
    var self = this;
    
    return new Promise(function( resolve, reject ){
        
        var win = gui.Window.open( url, { show: false } ),
            urlKey = url.replace( /\W/g, '' );
        
        win.resizeTo( width, height );
        
        win.once( 'loaded', function(){                       
            win.capturePage( function( img ){
                win.close( true );
                self.emit( 'done' );
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


ImageGetter.prototype.getImages = function( arr ){      
    this.emit( 'done' );
    var self = this,
        _url = arr[ 0 ],
        promiseAr = arr.slice( 1 ).map(function( elm ){
            var _split = elm.split( 'x' ),
                _width = parseInt( _split[ 0 ] ),
                _height = parseInt( _split[ 1 ] );
                
            return self._getImage( _url, _width, _height );
        
        });
    
    return Promise.all( promiseAr )

}


module.exports = ImageGetter;



