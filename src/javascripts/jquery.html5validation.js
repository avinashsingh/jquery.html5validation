/**
 * A fallback for HTML5 elements attributes.
 * Currently handling only input tag inside any form.
 * Hanlded attributes:
 * type => number, text
 *  -> min, max, step
 * required
 *
 * @author: Avinash Singh
 */

$( function () {
  // which all elements to iterate on
  var validatableDomElements = ["input"],
    validations = undefined;

  // create error on UI
  function showError( element, errorText ) {
    var html = $( "<div style='position: absolute;' class='errorTxt'>" + errorText + "</div>"),
        $el = $( element );

    if ( $el.data("showingWarning") ) {
      return;
    }

    function removeWarning () {
      $el.unbind( "focus", removeWarning );
      $el.removeData("showingWarning");
      html.remove();
    }
    
    $el.bind( "focus", removeWarning );
    setTimeout( removeWarning, 4000 );

    $("body").append( html );

    html.css( "top" , $el.offset().top + html.height() ).
        css( "left", $el.offset().left );

    $("body").animate({scrollTop: $el.offset().top - 100});
  }

  function Validations() {

    function validateInput () {
      var $this = $(this);
      if ( $this.attr("required") ) {
        if ( $.trim( $this.val() ).length == 0 ) {
          showError( this, "This is a required field" );
          return false;
        }
      }

      if ( $this.attr("type") === "number" ) {
        var numberValue;

        if ( !$.isNumeric( $this.val() ) ) {
          showError( this, "This should must contain numbers only" );
          return false;
        }

        numberValue = parseFloat( $this.val(), 5 );

        if ( $this.attr("step") !== undefined && ( numberValue % $this.sttr("step") !== 0 ) ) {
          showError( this, "The value should step by " + $this.attr("step") );
          return false;
        } else if ( $this.attr("min") !== undefined && ( numberValue < $this.attr("min") ) ) {
          showError( this, "Minimum allowed value is " + $this.attr("min") );
          return false;
        } else if ( $this.attr("max") !== undefined && ( numberValue > $this.attr("max") ) ) {
          showError( this, "Maximum allowed value is " + $this.attr("max") );
          return false;
        }
      }
      return true;
    }

    function validate () {
      if( $(this).is("input") ) {
        return validateInput.call( this );
      }
    }

    $(document).on ( "submit", "form", function (e) {
      var continued = true;
      $.each( $(this).find("input"), function ( index, input) {
        if ( !continued ) return;
        if( !validate.call(input) ) {
          e.preventDefault();
          continued = false;
        }
      });
    });
    return {};
  };

  $.html5validation = function () {
    if ( validations === undefined ) {
      validations = new Validations();
    }
    return validations;
  };

});
