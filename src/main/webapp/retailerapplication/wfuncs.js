(function( $ ) {
	//ep: warn has its own jquery extension apparently
	//TODO make thisnot a dependency
    //regular expression filters
    var rxemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var rxdate = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
    var rxsqlinj = /^[a-zA-Z0-9-(),\.\s']{1,80}$/;    
    var rxlength = /^(.{1,})/;    
    var rxcaps = /(\w)(\w*)/g;    

    var methods = {
        validateFormFields : function( requiredClassName, dateClassName, emailClassName ) {                                    
            var s;
            var i = 0;
            var rval = [];
            this.each(function() {
                var c = $(this);                
                    if (c.hasClass( requiredClassName )) {                        
                        if ( c.hasClass( dateClassName ) ) {                                    
                            if ( !c.wfuncs('validateDate') ) {                    
                                rval.push( c );
                            }            
                        } else if ( c.hasClass( emailClassName ) ) {
                            if ( !c.wfuncs('validateEmail') ) {
                                rval.push( c );
                            }
                        } else {
                            if ( !c.wfuncs('validateText') ) {                    
                                rval.push( c );                        
                            }
                        }
                    }                
            });
            return rval;
        },
        validateEmail : function() {                
            return methods.validateField( this.val(), rxemail );
        },
        validateDate : function() {
            return methods.validateField( this.val(), rxdate );
        },
        validateText : function() {
            return methods.validateField( this.val(), rxlength );
        },
        validateTextSQL : function() {
            return methods.validateField( this.val(), rxsqlinj );
        },
        validateField : function( data, regex ) {                       
            if (regex.test(data)) {
                return true;
            } else {
                return false;
            }
        },
        getDisplayName : function( txt ) {            
            return txt.replace(/_/g, " ").replace(/(\w)(\w*)/g,
                                                function( g0, g1, g2 ) {
                                                    return g1.toUpperCase() + g2.toLowerCase();
                                                    });
        },
        digitsOnly : function() {
            $(this).val($(this).val().replace(/[^0-9]+/g, ''));
        },
        alphanumericOnly : function() {
            $( this ).val( $( this ).val().replace( /[^a-zA-Z0-9]/g, '' ) );
        },
        sqlCheck : function() {
            var rval = [];
            this.each(function() {
                var c = $(this);       
                if (c.hasClass('sql')) {
                    if (c.val().length>0) {
                        if ( !c.wfuncs('validateTextSQL') ) {
                            rval.push ( c );
                        }
                    }
                }                
                });
            return rval;
        }
    };

    $.fn.wfuncs = function( method ) {
        if ( methods[ method ] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method == 'object' || !method ) {
            return methods.init.apply( this, arguments );
        }
    };
})( jQuery );
