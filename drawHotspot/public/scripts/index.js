


var DrawHotspot = function() {

};


DrawHotspot.prototype = {
  
  init: function(drawBox) {
    var _this = this;
  
    this.$drawBox = $(drawBox);
    
    this.params = {
      count: 1,
      startX: null,
      startY: null,
      drawBoxOffsetLeft: this.$drawBox.offset().left,
      drawBoxOffsetTop:  this.$drawBox.offset().top,
      $drawBoxWidth: this.$drawBox.width(),
      $drawBoxHeight: this.$drawBox.height(),
      dragging: false
    };
    
    this.coordinate = {};
    
    $('.image-btn').on('click', function() {
      _this.generateBox($(this));
  
      _this.bindEvent();
    });
    
    $('.get-codes').on('click', function() {
      _this.generateCodes();
    });
  
    $('.preview-btn').on('click', function() {
      _this.preview($(this));
    })
  },
  
  generateBox: function($this) {
    var _this = this,
        val = $this.siblings('.image-input').val();
  
    this.drawImgSrc = val;
  
    setEmpty();
    
    $('.draw-box').append('<img class="draw-img" ondragstart="return false"/>');
    $('.draw-box .draw-img').attr('src', val);
    
    
    function setEmpty() {
      $('.draw-box').html('');
      $('.link-input-box').html('');
      
      _this.coordinate = {};
      _this.params.count = 1;
    }
  },
  
  bindEvent: function() {
    var $document = $(document),
        _this = this;
    
    function isInRange(X ,Y) {
      if(X >= _this.params.drawBoxOffsetLeft && X <= _this.params.drawBoxOffsetLeft + _this.params.drawBoxWidth && Y >= _this.params.drawBoxOffsetTop && Y <= _this.params.drawBoxOffsetTop + _this.params.drawBoxHeight) {
        return true;
      }
    }
  
    this.params.drawBoxOffsetLeft = _this.$drawBox.offset().left;
    this.params.drawBoxOffsetTop = _this.$drawBox.offset().top;
    this.params.drawBoxWidth = _this.$drawBox.width();
    this.params.drawBoxHeight = _this.$drawBox.height();
    
    $document.on('mousedown', function(e) {
      var $target = $(e.target);
      startX = _this.params.startX = e.pageX;
      startY = _this.params.startY = e.pageY;
      
      if($target.hasClass('hotspot')) {
        _this.params.dragging = true;
        
        var targetOffsetLeft = $target.offset().left,
            targetOffsetTop = $target.offset().top;
  
        var diffX = _this.params.startX - targetOffsetLeft,
            diffY = _this.params.startY - targetOffsetTop;
      } else if($target.hasClass('close')) {
        _this.removeHotspot($target);
        return;
      }
      
      if(isInRange(startX, startY)) {
        _this.startDraw(e);
  
        //鼠标down后时候才触发move事件
        $document.on('mousemove', function(e) {
          var activeX = e.pageX,
              activeY = e.pageY,
              $target = $(e.target);
          
          if($target.hasClass('hotspot') && _this.params.dragging) {
            
            _this.dragging(e, diffX, diffY);
          } else {
            if(isInRange(activeX, activeY)) {
              _this.drawing(e);
            } else {
              _this.endDraw();
            }
          }
        });
      }
      
    });
    
    
    $document.on('mouseup', function() {
      if(isInRange(startX, startY)) {
        _this.endDraw();
  
        _this.params.dragging = false;
      }
    })
    
    
  },
  
  startDraw: function(e) {
    var _this = this,
        $target = $(e.target);
    
    if($target.hasClass('hotspot') && this.params.dragging) {
      return;
    }
    
    var html = template('tpl-hotspot', {count: _this.params.count});
    
    this.$drawBox.append(html);
    
    var $hotspot = $('.hotspot-' + _this.params.count);
    $hotspot.css({'left': _this.params.startX - _this.params.drawBoxOffsetLeft + 'px', 'top': _this.params.startY - _this.params.drawBoxOffsetTop + 'px'})
  },
  
  drawing: function(e) {
    var _this= this;
    
    var activeX = e.pageX,
        activeY = e.pageY,
        property = {};
    var $hotspot = $('.hotspot-' + _this.params.count);
    var $target = $(e.target);
    
    
    //计算热区宽高和位置
    if(activeX > this.params.startX && activeY > this.params.startY) {
      property = {
        'width': activeX - this.params.startX,
        'height': activeY - this.params.startY
      }
    } else if (activeX > this.params.startX && activeY < this.params.startY) {
      property = {
        'width': activeX - this.params.startX,
        'height': this.params.startY - activeY,
        'top': activeY - this.params.drawBoxOffsetTop
      }
    } else if (activeX < this.params.startX && activeY < this.params.startY) {
      property = {
        'width': this.params.startX - activeX,
        'height': this.params.startY - activeY,
        'left': activeX - this.params.drawBoxOffsetLeft,
        'top': activeY -this.params.drawBoxOffsetTop
      }
    } else if (activeX < this.params.startX && activeY > this.params.startY) {
      property = {
        'width': this.params.startX - activeX,
        'height': activeY - this.params.startY,
        'left': activeX - this.params.drawBoxOffsetLeft
      }
    }
  
    $hotspot.css({
      'width': property.width + 'px',
      'height': property.height + 'px'
    });
    
    if(property.width > 50 && property.height > 30) {
      $hotspot.find('.content').show();
      $hotspot.find('.close').show();
    }
  
    property.left ? $hotspot.css('left', property.left + 'px') : '';
    property.top ? $hotspot.css('top', property.top + 'px') : '';
    
  },
  
  dragging: function(e, diffX, diffY) {
    var _this = this,
        $target = $(e.target);
    
    $target.css({
      'left': e.pageX - _this.params.drawBoxOffsetLeft - diffX + 'px',
      'top': e.pageY - _this.params.drawBoxOffsetTop - diffY + 'px'
    });
    
    var drawBoxOffsetLeft = this.params.drawBoxOffsetLeft,
        drawBoxOffsetTop = this.params.drawBoxOffsetTop,
        drawBoxWidth = this.params.drawBoxWidth,
        drawBoxHeight = this.params.drawBoxHeight,
        targetOffsetLeft = $target.offset().left,
        targetOffsetTop = $target.offset().top,
        targetWidth = $target.width(),
        targetHeight = $target.height();
    
    if(targetOffsetLeft - 2 <= drawBoxOffsetLeft || targetOffsetLeft + 2 + targetWidth >= drawBoxOffsetLeft + drawBoxWidth || targetOffsetTop - 2 <= drawBoxOffsetTop || targetOffsetTop + targetHeight + 2 >= drawBoxOffsetTop + drawBoxHeight) {
      $(document).off('mousemove');
    }
   
  },
  
  endDraw: function() {
    var _this = this;
  
    var $hotspot = $('.hotspot-' + _this.params.count);
    //不达到最小长宽则移除dom
    if($hotspot.width() < 50 || $hotspot.height() < 30) {
      $hotspot.remove();
    } else {
      this.coordinate[this.params.count] = {
        leftTop: parseInt($hotspot.offset().left - this.params.drawBoxOffsetLeft),
        rightTop: parseInt($hotspot.offset().top - this.params.drawBoxOffsetTop),
        rightBottom: parseInt($hotspot.offset().left -this.params.drawBoxOffsetLeft + $hotspot.width()),
        leftBottom: parseInt($hotspot.offset().top - this.params.drawBoxOffsetTop + $hotspot.height())
      };
  
      this.generateLinkInput(this.params.count);
      
      this.params.count++;
    }
    
    $(document).off('mousemove');
  },
  
  removeHotspot: function($target) {
    var index = $target.attr('index');
    
    $target.closest('.hotspot').remove();
    $('.link-input-box .link-input-group[index=' + index + ']').remove();
    
    delete this.coordinate[index];
  },
  
  adjust: function() {
    
  },
  
  generateLinkInput: function(count) {
    var html = template('tpl-link-input', {count: count});
    
    $('.link-input-box').append(html);
  },
  
  generateCodes: function() {
    var _this = this;
        hash = md5(new Date().getTime());
        
    $('.link-input').each(function() {
      var $this = $(this),
          index = $this.attr('index');
      
      _this.coordinate[index]['link'] = $this.val();
    });
    
    console.log(_this.coordinate)
    var data = $.extend({coordinate: this.coordinate}, {drawImgSrc: this.drawImgSrc, md5: hash})
    var codes = template('tpl-codes', data);

    $('.codes-area').text(codes);
  },
  
  preview: function($this) {
    var codes = $('.codes-area').val();
    if(codes) {
      $this.siblings('.input-codes').val(codes);
      
      $('form').submit();
    } else {
      alert('请生成代码');
    }
  }
};

var drawHotspot = new DrawHotspot('.draw-box');
drawHotspot.init('.draw-box');