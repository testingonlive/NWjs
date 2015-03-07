/**
* module to get images
*
* @TODO Clean up this mess
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
            var win = gui.Window.open( config[ 0 ], { show: false, width: _width, height: _height } );
            
            win.once( 'loaded', function(){        
                win.capturePage(function( img ){
                    var base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                    fs.writeFile( _width + 'x' + _height + '.jpg', base64Data, 'base64', function( err ){
                        if ( err ) return callback( err );
                        // increment the curInd
                        next.curInd = curInd +1;
                        // clean up
                        win.close();
                        next();
                    });
                });        
            });          
            
            
        } else {
                        
            return callback( null, 'complete' );
        }   
    }());
    

    
}
