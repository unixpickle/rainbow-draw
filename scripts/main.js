(function() {

  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var smoothie = new window.app.ColorSmoothie();
    smoothie.draw(ctx, canvas.width, canvas.height);
  });

})();
