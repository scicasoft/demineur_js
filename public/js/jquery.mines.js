(function($) {
// Un jeu de demineur
$.fn.mines = function(options) {

  if (!this.length) { return this; }

  var opts = $.extend(true, {}, $.fn.mines.defaults, options);

  this.each(function() {
    var $this = $(this);
    
  });

  return this;
};

// default options
$.fn.mines.defaults = {
  width: 10,
  height: 10,
  mines: 10
  
};

})(jQuery);
