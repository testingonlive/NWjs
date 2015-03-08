/**
* module to get images
*
* @TODO move to image capture to series instead of seqential
*/

var gui = window.require( 'nw.gui' ),
    fs = require( 'fs' );



module.exports = function( config, callback ){

   
    // helper function to do next or not
    (function next(){   
        var curInd = next.curInd || 1,
            _dim = config[ curInd ];
       
        if ( _dim ) {
            // probably should be using let here
            var _split = _dim.split( 'x' ),
                _width = parseInt( _split[ 0 ] );
                _height = parseInt( _split[ 1 ] );
            
            // open a new window, hidden, with config url
            var win = gui.Window.open( config[ 0 ], { show: false } );
            
            win.resizeTo( _width, _height );
            
            win.once( 'loaded', function(){                       
                win.capturePage( function( img ){
                    // get the img data ready to be written
                    var base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
                        name = config[ 0 ].replace( /\W/g, '' );

                    fs.writeFile( name + _width + 'x' + _height + '.jpg', base64Data, 'base64', function( err ){
                        if ( err ) return callback( err );
                        win.close();
                    });        
                });        
            });   
            
            win.once( 'closed', function(){

                win = null;
                next.curInd = curInd +1;
                next();
            });  
            
            
        } else {
                        
            return callback( null, 'complete' );
        }   
    }());
    

    
}
