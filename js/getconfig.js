/**
* callback form getConfig method
*
* @callback getConfigCallback
* @param {Error} err - error object
* @param {Object} config - config object 
*/

/**
* module to get config file and convert to config object
*
* @method getConfig
* @param {String} path - path to config file
*/
var fs = require( 'fs' );

module.exports = function( path ){
    
    return new Promise(function( resolve, reject ){
    
        // check to see if path is *.txt
        if ( !/.txt$/i.test( path ) ) reject( new Error( 'invalid path' ) );
        
        // grab the file
        fs.readFile( path, 'utf8', function( err, data ){
            // if we error pass it to the call back
            if ( err ) reject( err );
             
            // temp array. Split on EOL, trim the start and end of empty strings
            var _arr = data.split( /\n|\r/ );
                            
            // create our array of arrays.         
            var arrOfArr = [];
            
            while ( _arr.length ){
                if ( _arr[ 0 ] !== '' ) {
                     var cut = _arr.indexOf( '' );
                     arrOfArr.push( _arr.splice( 0, cut ) );
                     
                 } else {
                     _arr.splice( 0, 1 );
                                 
                 }        
            }       
            
            resolve( arrOfArr );   
        
        });
    
    });

};
