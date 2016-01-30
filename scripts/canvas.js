(function() {

  function Canvas() {
    this._canvas = document.getElementById('canvas');
    this._background = null;
    this._paths = [];

    this._pixelRatio = window.devicePixelRatio;

    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    this._registerMouseEvents();
    this._registerTouchEvents();
  }

  Canvas.prototype.reset = function() {
    this._paths = [];
    this._background = new window.app.ColorSmoothie();
    this._draw();
  };

  Canvas.prototype._resize = function() {
    this._canvas.width = this._canvas.offsetWidth * this._pixelRatio;
    this._canvas.height = this._canvas.offsetHeight * this._pixelRatio;
    this._draw();
  };

  Canvas.prototype._draw = function() {
    if (this._background === null) {
      return;
    }

    var width = this._canvas.width;
    var height = this._canvas.height;
    var ctx = this._canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.scale(this._pixelRatio, this._pixelRatio);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (var i = 0, len = this._paths.length; i < len; ++i) {
      var path = this._paths[i];
      if (path.length === 1) {
        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, 5, 0, Math.PI*2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (var j = 1, len1 = path.length; j < len1; ++j) {
        ctx.lineTo(path[j].x, path[j].y);
      }
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    this._background.draw(ctx, width, height);
    ctx.restore();
  };

  Canvas.prototype._registerMouseEvents = function() {
    this._canvas.addEventListener('mousedown', function(e) {
      var canvasRect = this._canvas.getBoundingClientRect();
      var path = [{x: e.clientX-canvasRect.left, y: e.clientY-canvasRect.top}];
      this._paths.push(path);
      this._draw();

      var moveHandler = function(e) {
        canvasRect = this._canvas.getBoundingClientRect();
        path.push({x: e.clientX-canvasRect.left, y: e.clientY-canvasRect.top});
        this._draw();
      }.bind(this);

      var upHandler;
      upHandler = function() {
        window.removeEventListener('mouseup', upHandler);
        window.removeEventListener('mousemove', moveHandler);
      };

      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    }.bind(this));
  };

  Canvas.prototype._registerTouchEvents = function() {
    var currentPath = [];
    this._canvas.addEventListener('touchstart', function(e) {
      e.preventDefault();
      var t = e.touches[0];
      var canvasRect = this._canvas.getBoundingClientRect();
      currentPath = [{x: t.clientX-canvasRect.left, y: t.clientY-canvasRect.top}];
      this._paths.push(currentPath);
      this._draw();
    }.bind(this));
    this._canvas.addEventListener('touchmove', function(e) {
      var t = e.touches[0];
      var canvasRect = this._canvas.getBoundingClientRect();
      var point = {x: t.clientX-canvasRect.left, y: t.clientY-canvasRect.top};
      currentPath.push(point);
      this._draw();
    }.bind(this));
  };

  window.app.Canvas = Canvas;

})();
