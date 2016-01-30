(function() {

  window.addEventListener('load', function() {
    var canvas = new window.app.Canvas();
    document.getElementById('new-button').addEventListener('click', function() {
      canvas.reset();
    });
    canvas.reset();
  });

})();
