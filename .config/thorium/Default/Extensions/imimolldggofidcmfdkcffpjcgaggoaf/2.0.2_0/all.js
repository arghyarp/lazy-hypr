/*
Copyright (c) 2005 Tim Taylor Consulting <http://tool-man.org/>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

var ToolMan = {
  events: function () {
    if (!ToolMan._eventsFactory) throw "ToolMan Events module isn't loaded";
    return ToolMan._eventsFactory
  },
  css: function () {
    if (!ToolMan._cssFactory) throw "ToolMan CSS module isn't loaded";
    return ToolMan._cssFactory
  },
  coordinates: function () {
    if (!ToolMan._coordinatesFactory) throw "ToolMan Coordinates module isn't loaded";
    return ToolMan._coordinatesFactory
  },
  drag: function () {
    if (!ToolMan._dragFactory) throw "ToolMan Drag module isn't loaded";
    return ToolMan._dragFactory
  },
  dragsort: function () {
    if (!ToolMan._dragsortFactory) throw "ToolMan DragSort module isn't loaded";
    return ToolMan._dragsortFactory
  },
  helpers: function () {
    return ToolMan._helpers
  },
  cookies: function () {
    if (!ToolMan._cookieOven) throw "ToolMan Cookie module isn't loaded";
    return ToolMan._cookieOven
  },
  junkdrawer: function () {
    return ToolMan._junkdrawer
  }
};
ToolMan._helpers = {
  map: function (array, func) {
    for (var i = 0, n = array.length; i < n; i++) func(array[i])
  },
  nextItem: function (item, nodeName) {
    if (item == null) return;
    var next = item.nextSibling;
    while (next != null) {
      if (next.nodeName == nodeName) return next;
      next = next.nextSibling
    }
    return null
  },
  previousItem: function (item, nodeName) {
    var previous = item.previousSibling;
    while (previous != null) {
      if (previous.nodeName == nodeName) return previous;
      previous = previous.previousSibling
    }
    return null
  },
  moveBefore: function (item1, item2) {
    var parent = item1.parentNode;
    parent.removeChild(item1);
    parent.insertBefore(item1, item2)
  },
  moveAfter: function (item1, item2) {
    var parent = item1.parentNode;
    parent.removeChild(item1);
    parent.insertBefore(item1, item2 ? item2.nextSibling : null)
  }
};
ToolMan._junkdrawer = {
  serializeList: function (list) {
    var items = list.getElementsByTagName("li");
    var array = new Array;
    for (var i = 0, n = items.length; i < n; i++) {
      var item = items[i];
      array.push(ToolMan.junkdrawer()._identifier(item))
    }
    return array.join("|")
  },
  inspectListOrder: function (id) {
    alert(ToolMan.junkdrawer().serializeList(document.getElementById(id)))
  },
  restoreListOrder: function (listID) {
    var list = document.getElementById(listID);
    if (list == null) return;
    var cookie = ToolMan.cookies().get("list-" + listID);
    if (!cookie) return;
    var IDs = cookie.split("|");
    var items = ToolMan.junkdrawer()._itemsByID(list);
    for (var i = 0, n = IDs.length; i < n; i++) {
      var itemID = IDs[i];
      if (itemID in items) {
        var item = items[itemID];
        list.removeChild(item);
        list.insertBefore(item, null)
      }
    }
  },
  _identifier: function (item) {
    var trim = ToolMan.junkdrawer().trim;
    var identifier;
    identifier = trim(item.getAttribute("id"));
    if (identifier != null && identifier.length > 0) return identifier;
    identifier = trim(item.getAttribute("itemID"));
    if (identifier != null && identifier.length > 0) return identifier;
    return trim(item.innerHTML)
  },
  _itemsByID: function (list) {
    var array = new Array;
    var items = list.getElementsByTagName("li");
    for (var i = 0, n = items.length; i < n; i++) {
      var item = items[i];
      array[ToolMan.junkdrawer()._identifier(item)] = item
    }
    return array
  },
  trim: function (text) {
    if (text == null) return null;
    return text.replace(/^(\s+)?(.*\S)(\s+)?$/, "$2")
  }
};
ToolMan._eventsFactory = {
  fix: function (event) {
    if (!event) event = window.event;
    if (event.target) {
      if (event.target.nodeType == 3) event.target = event.target.parentNode
    } else if (event.srcElement) event.target = event.srcElement;
    return event
  },
  register: function (element, type, func) {
    if (element.addEventListener) element.addEventListener(type, func, false);
    else if (element.attachEvent) {
      if (!element._listeners) element._listeners = new Array;
      if (!element._listeners[type]) element._listeners[type] = new Array;
      var workaroundFunc = function () {
        func.apply(element, new Array)
      };
      element._listeners[type][func] = workaroundFunc;
      element.attachEvent("on" + type, workaroundFunc)
    }
  },
  unregister: function (element, type, func) {
    if (element.removeEventListener) element.removeEventListener(type, func, false);
    else if (element.detachEvent) if (element._listeners && element._listeners[type] && element._listeners[type][func]) element.detachEvent("on" + type, element._listeners[type][func])
  }
};
ToolMan._coordinatesFactory = {
  create: function (x, y) {
    return new _ToolManCoordinate(this, x, y)
  },
  origin: function () {
    return this.create(0, 0)
  },
  topLeftPosition: function (element) {
    var left = parseInt(ToolMan.css().readStyle(element, "left"));
    var left = isNaN(left) ? 0 : left;
    var top = parseInt(ToolMan.css().readStyle(element, "top"));
    var top = isNaN(top) ? 0 : top;
    return this.create(left, top)
  },
  bottomRightPosition: function (element) {
    return this.topLeftPosition(element).plus(this._size(element))
  },
  topLeftOffset: function (element) {
    var offset = this._offset(element);
    var parent = element.offsetParent;
    while (parent) {
      offset = offset.plus(this._offset(parent));
      parent = parent.offsetParent
    }
    return offset
  },
  bottomRightOffset: function (element) {
    return this.topLeftOffset(element).plus(this.create(element.offsetWidth, element.offsetHeight))
  },
  scrollOffset: function () {
    if (window.pageXOffset) return this.create(window.pageXOffset, window.pageYOffset);
    else if (document.documentElement) return this.create(document.body.scrollLeft + document.documentElement.scrollLeft, document.body.scrollTop + document.documentElement.scrollTop);
    else if (document.body.scrollLeft >= 0) return this.create(document.body.scrollLeft, document.body.scrollTop);
    else return this.create(0, 0)
  },
  clientSize: function () {
    if (window.innerHeight >= 0) return this.create(window.innerWidth, window.innerHeight);
    else if (document.documentElement) return this.create(document.documentElement.clientWidth, document.documentElement.clientHeight);
    else if (document.body.clientHeight >= 0) return this.create(document.body.clientWidth, document.body.clientHeight);
    else return this.create(0, 0)
  },
  mousePosition: function (event) {
    event = ToolMan.events().fix(event);
    return this.create(event.clientX, event.clientY)
  },
  mouseOffset: function (event) {
    event = ToolMan.events().fix(event);
    if (event.pageX >= 0 || event.pageX < 0) return this.create(event.pageX, event.pageY);
    else if (event.clientX >= 0 || event.clientX < 0) return this.mousePosition(event).plus(this.scrollOffset())
  },
  _size: function (element) {
    return this.create(element.offsetWidth, element.offsetHeight)
  },
  _offset: function (element) {
    return this.create(element.offsetLeft, element.offsetTop)
  }
};

function _ToolManCoordinate(factory, x, y) {
  this.factory = factory;
  this.x = isNaN(x) ? 0 : x;
  this.y = isNaN(y) ? 0 : y
}
_ToolManCoordinate.prototype = {
  toString: function () {
    return "(" + this.x + "," + this.y + ")"
  },
  plus: function (that) {
    return this.factory.create(this.x + that.x, this.y + that.y)
  },
  minus: function (that) {
    return this.factory.create(this.x - that.x, this.y - that.y)
  },
  min: function (that) {
    return this.factory.create(Math.min(this.x, that.x), Math.min(this.y, that.y))
  },
  max: function (that) {
    return this.factory.create(Math.max(this.x, that.x), Math.max(this.y, that.y))
  },
  constrainTo: function (one, two) {
    var min = one.min(two);
    var max = one.max(two);
    return this.max(min).min(max)
  },
  distance: function (that) {
    return Math.sqrt(Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2))
  },
  reposition: function (element) {
    element.style["top"] = this.y + "px";
    element.style["left"] = this.x + "px"
  }
};
ToolMan._cssFactory = {
  readStyle: function (element, property) {
    if (element.style[property]) return element.style[property];
    else if (element.currentStyle) return element.currentStyle[property];
    else if (document.defaultView && document.defaultView.getComputedStyle) {
      var style = document.defaultView.getComputedStyle(element, null);
      return style.getPropertyValue(property)
    } else return null
  }
};
ToolMan._dragFactory = {
  createSimpleGroup: function (element, handle) {
    handle = handle ? handle : element;
    var group = this.createGroup(element);
    group.setHandle(handle);
    group.transparentDrag();
    group.onTopWhileDragging();
    return group
  },
  createGroup: function (element) {
    var group = new _ToolManDragGroup(this, element);
    var position = ToolMan.css().readStyle(element, "position");
    if (position == "static") element.style["position"] = "relative";
    else if (position == "absolute") ToolMan.coordinates().topLeftOffset(element).reposition(element);
    group.register("draginit", this._showDragEventStatus);
    group.register("dragmove", this._showDragEventStatus);
    group.register("dragend", this._showDragEventStatus);
    return group
  },
  _showDragEventStatus: function (dragEvent) {
    window.status = dragEvent.toString()
  },
  constraints: function () {
    return this._constraintFactory
  },
  _createEvent: function (type, event, group) {
    return new _ToolManDragEvent(type, event, group)
  }
};

function _ToolManDragGroup(factory, element) {
  this.factory = factory;
  this.element = element;
  this._handle = null;
  this._thresholdDistance = 0;
  this._transforms = new Array;
  this._listeners = new Array;
  this._listeners["draginit"] = new Array;
  this._listeners["dragstart"] = new Array;
  this._listeners["dragmove"] = new Array;
  this._listeners["dragend"] = new Array
}
_ToolManDragGroup.prototype = {
  setHandle: function (handle) {
    var events = ToolMan.events();
    handle.toolManDragGroup = this;
    events.register(handle, "mousedown", this._dragInit);
    handle.onmousedown = function () {
      return false
    };
    if (this.element != handle) events.unregister(this.element, "mousedown", this._dragInit)
  },
  register: function (type, func) {
    this._listeners[type].push(func)
  },
  addTransform: function (transformFunc) {
    this._transforms.push(transformFunc)
  },
  verticalOnly: function () {
    this.addTransform(this.factory.constraints().vertical())
  },
  horizontalOnly: function () {
    this.addTransform(this.factory.constraints().horizontal())
  },
  setThreshold: function (thresholdDistance) {
    this._thresholdDistance = thresholdDistance
  },
  transparentDrag: function (opacity) {
    var opacity = typeof opacity != "undefined" ? opacity : 0.75;
    var originalOpacity = ToolMan.css().readStyle(this.element, "opacity");
    this.register("dragstart", function (dragEvent) {
      var element = dragEvent.group.element;
      element.style.opacity = opacity;
      element.style.filter = "alpha(opacity=" + opacity * 100 + ")"
    });
    this.register("dragend", function (dragEvent) {
      var element = dragEvent.group.element;
      element.style.opacity = originalOpacity;
      element.style.filter = "alpha(opacity=100)"
    })
  },
  onTopWhileDragging: function (zIndex) {
    var zIndex = typeof zIndex != "undefined" ? zIndex : 1E5;
    var originalZIndex = ToolMan.css().readStyle(this.element, "z-index");
    this.register("dragstart", function (dragEvent) {
      dragEvent.group.element.style.zIndex = zIndex
    });
    this.register("dragend", function (dragEvent) {
      dragEvent.group.element.style.zIndex = originalZIndex
    })
  },
  _dragInit: function (event) {
    event = ToolMan.events().fix(event);
    var group = document.toolManDragGroup = this.toolManDragGroup;
    var dragEvent = group.factory._createEvent("draginit", event, group);
    group._isThresholdExceeded = false;
    group._initialMouseOffset = dragEvent.mouseOffset;
    group._grabOffset = dragEvent.mouseOffset.minus(dragEvent.topLeftOffset);
    group._grabOffset.y = group._grabOffset.y + group.element.parentNode.scrollTop;
    ToolMan.events().register(document, "mousemove", group._drag);
    document.onmousemove = function () {
      return false
    };
    ToolMan.events().register(document, "mouseup", group._dragEnd);
    group._notifyListeners(dragEvent)
  },
  _drag: function (event) {
    event = ToolMan.events().fix(event);
    var coordinates = ToolMan.coordinates();
    var group = this.toolManDragGroup;
    if (!group) return;
    var dragEvent = group.factory._createEvent("dragmove", event, group);
    var newTopLeftOffset = dragEvent.mouseOffset.minus(group._grabOffset);
    if (!group._isThresholdExceeded) {
      var distance = dragEvent.mouseOffset.distance(group._initialMouseOffset);
      if (distance < group._thresholdDistance) return;
      group._isThresholdExceeded = true;
      group._notifyListeners(group.factory._createEvent("dragstart", event, group))
    }
    for (i in group._transforms) {
      var transform = group._transforms[i];
      newTopLeftOffset = transform(newTopLeftOffset, dragEvent)
    }
    newTopLeftOffset.y = newTopLeftOffset.y + group.element.parentNode.scrollTop;
    var dragDelta = newTopLeftOffset.minus(dragEvent.topLeftOffset);
    var newTopLeftPosition = dragEvent.topLeftPosition.plus(dragDelta);
    newTopLeftPosition.reposition(group.element);
    dragEvent.transformedMouseOffset = newTopLeftOffset.plus(group._grabOffset);
    group._notifyListeners(dragEvent);
    var errorDelta = newTopLeftOffset.minus(coordinates.topLeftOffset(group.element));
    if (errorDelta.x != 0 || errorDelta.y != 0) coordinates.topLeftPosition(group.element).plus(errorDelta).reposition(group.element)
  },
  _dragEnd: function (event) {
    event = ToolMan.events().fix(event);
    var group = this.toolManDragGroup;
    var dragEvent = group.factory._createEvent("dragend", event, group);
    group._notifyListeners(dragEvent);
    this.toolManDragGroup = null;
    ToolMan.events().unregister(document, "mousemove", group._drag);
    document.onmousemove = null;
    ToolMan.events().unregister(document, "mouseup", group._dragEnd)
  },
  _notifyListeners: function (dragEvent) {
    var listeners = this._listeners[dragEvent.type];
    for (i in listeners) listeners[i](dragEvent)
  }
};

function _ToolManDragEvent(type, event, group) {
  this.type = type;
  this.event = event;
  this.group = group;
  this.mousePosition = ToolMan.coordinates().mousePosition(event);
  this.mouseOffset = ToolMan.coordinates().mouseOffset(event);
  this.transformedMouseOffset = this.mouseOffset;
  this.topLeftPosition = ToolMan.coordinates().topLeftPosition(group.element);
  this.topLeftOffset = ToolMan.coordinates().topLeftOffset(group.element)
}
_ToolManDragEvent.prototype = {
  toString: function () {
    return "mouse: " + this.mousePosition + this.mouseOffset + "    " + "xmouse: " + this.transformedMouseOffset + "    " + "left,top: " + this.topLeftPosition + this.topLeftOffset
  }
};
ToolMan._dragFactory._constraintFactory = {
  vertical: function () {
    return function (coordinate, dragEvent) {
      var x = dragEvent.topLeftOffset.x;
      return coordinate.x != x ? coordinate.factory.create(x, coordinate.y) : coordinate
    }
  },
  horizontal: function () {
    return function (coordinate, dragEvent) {
      var y = dragEvent.topLeftOffset.y;
      return coordinate.y != y ? coordinate.factory.create(coordinate.x, y) : coordinate
    }
  }
};
ToolMan._dragsortFactory = {
  makeSortable: function (item) {
    var group = ToolMan.drag().createSimpleGroup(item);
    group.register("dragstart", this._onDragStart);
    group.register("dragmove", this._onDragMove);
    group.register("dragend", this._onDragEnd);
    return group
  },
  makeListSortable: function (list) {
    var self = this;
    var helpers = ToolMan.helpers();
    var coordinates = ToolMan.coordinates();
    var items = list.getElementsByTagName("li");
    helpers.map(items, function (item) {
      var dragGroup = self.makeSortable(item);
      dragGroup.setThreshold(4);
      var min, max;
      dragGroup.addTransform(function (coordinate, dragEvent) {
        return coordinate.constrainTo(min, max)
      });
      dragGroup.register("dragstart", function () {
        var items = list.getElementsByTagName("li");
        min = max = coordinates.topLeftOffset(items[0]);
        for (var i = 1, n = items.length; i < n; i++) {
          var offset = coordinates.topLeftOffset(items[i]);
          min = min.min(offset);
          max = max.max(offset)
        }
      })
    });
    for (var i = 1, n = arguments.length; i < n; i++) helpers.map(items, arguments[i])
  },
  _onDragStart: function (dragEvent) {},
  _onDragMove: function (dragEvent) {
    var helpers = ToolMan.helpers();
    var coordinates = ToolMan.coordinates();
    var item = dragEvent.group.element;
    var xmouse = dragEvent.transformedMouseOffset;
    var scroll = item.parentNode.scrollTop;
    var moveTo = null;
    var previous = helpers.previousItem(item, item.nodeName);
    while (previous != null) {
      var bottomRight = coordinates.bottomRightOffset(previous);
      if (xmouse.y <= bottomRight.y && xmouse.x <= bottomRight.x) moveTo = previous;
      previous = helpers.previousItem(previous, item.nodeName)
    }
    if (moveTo != null) {
      helpers.moveBefore(item, moveTo);
      return
    }
    var next = helpers.nextItem(item, item.nodeName);
    while (next != null) {
      var topLeft = coordinates.topLeftOffset(next);
      if (topLeft.y <= xmouse.y && topLeft.x <= xmouse.x) moveTo = next;
      next = helpers.nextItem(next, item.nodeName)
    }
    if (moveTo != null) {
      helpers.moveBefore(item, helpers.nextItem(moveTo, item.nodeName));
      return
    }
  },
  _onDragEnd: function (dragEvent) {
    ToolMan.coordinates().create(0, 0).reposition(dragEvent.group.element)
  }
};
