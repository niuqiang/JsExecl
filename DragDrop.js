/**
 * Created by Administrator on 2015-11-12.
 */


Execljs.DragDropManager = {

    handleMouseDown: function (e, me_) {
        var me = me_;

        me.currentTarget = e.relatedTarget;

        me.startX = e.xy[0];
        me.startY = e.xy[1];

        me.ddTarget = me.currentTarget;

        me.deltaX = me.startX - me.offsetLeft(me.currentTarget);
        me.deltaY = me.startY - me.offsetTop(me.currentTarget);
        me.startDrag(me.startX, me.startY);
    },

    stopEvent: function (e) {


        e.originalEvent.stopPropagation();
        if (e.originalEvent.preventDefault !== false) {
            e.originalEvent.preventDefault();
        }
        ;

    }


}

DragDrop = function () {
}

DragDrop.prototype = {


    minX: 0,
    maxX: 0,
    minY: 0,
    maxX: 0,

    constrainX: false,
    constrainX: false,

    init: function () {

        var me = this;

        this.on('mousedown', me.handleMouseDown);

    },

    constrainTo: function (constrainTo) {

        var c, ddEl = this.findDD(this.el, 'ddElement'), constrainPal, topSpace, leftSpace;

        /**defaule ddEl parentNode **/
        if (constrainTo == null) {
            constrainPal = ddEl.findParent();

            c = {width: constrainPal.dom.clientWidth, height: constrainPal.dom.clientHeight};
        }

        topSpace = ddEl.dom.offsetTop;
        leftSpace = ddEl.dom.offsetLeft;

        this.setXConstraint(leftSpace, c.width - leftSpace - ddEl.dom.clientWidth);
        this.setYConstraint(topSpace, c.height - topSpace - ddEl.dom.clientHeight);

    },
    setXConstraint: function (iLeft, iRight, iTickSize) {
        this.minX = iLeft;
        this.maxX = iRight;


        this.setXTicks(0, 5);

        this.constrainX = true;
    },


    setYConstraint: function (iUp, iDown, iTickSize) {
        this.minY = iUp;
        this.maxY = iDown;
        this.constrainY = true;
    },


    handleMouseDown: function (e) {


        var me = this;
        me.DDMInstance = Execljs.DragDropManager;
        if (e.relatedTarget.className.indexOf('ddElement') < 0) {
            me.DDMInstance.stopEvent(e);
            return;

        }

        me.DDMInstance.handleMouseDown(e, me);

        Event.EventManager.event.add(document, 'mousemove', Execljs.Function.bind(me.handleMouseMove, me));

        Event.EventManager.event.add(document, 'mouseup', Execljs.Function.bind(me.handleMouseUp, me));

        var me = this;
        me.b4MouseDown(e);

    },

    handleMouseMove: function (e) {

        var dragel = this.dragEl, oCoord;

        if (dragel) {

            oCoord = this.getTargetCoord(e.xy[0], e.xy[1]);

            dragel.setStyle('left', oCoord.x + 'px');

        }
    },

    getTargetCoord: function (iPageX, iPageY) {
        var x = iPageX - this.deltaX,
            y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) {
                x = this.minX;
            }
            if (x > this.maxX) {
                x = this.maxX;
            }
        }

        if (this.constrainY) {
            if (y < this.minY) {
                y = this.minY;
            }
            if (y > this.maxY) {
                y = this.maxY;
            }
        }
        x = this.getTick(x, this.xTicks || 3);
        y = this.getTick(y, this.yTicks || 3);

        return {x: x, y: y};
    },

    getTick: function (val, tickArray) {
        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel,
            // so we return the value passed to us.
            return val;
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            var i, len, next, diff1, diff2;
            for (i = 0, len = tickArray.length; i < len; ++i) {
                next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    diff1 = val - tickArray[i];
                    diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    setXTicks: function (iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {},
            i;

        for (i = 0; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = 0; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }


        return this.xTicks
    },

    offsetTop: function (elements) {
        var top = elements.offsetTop;
        var parent = elements.offsetParent;

        while (parent != null) {
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        ;
        return top;
    },

    offsetLeft: function (elements) {
        var left = elements.offsetLeft;
        return left;
    },

    handleMouseUp: function (e) {

        this.dragEl && this.dragEl.setStyle('backgroundColor', 'rgb(188, 188, 188)');
        this.dragEl = null;
        this.deltaX = null;
        this.deltaY = null;


    },

    b4MouseDown: function (e) {

    }
}


DragTracker = function (config) {

    var me = this, el;

    if (config.el) {

        el = Element.get(config.el);

        el.on('mousedown', DT.onMouseDown)
    }
    ;

}

DT = DragTracker.Template = {

    onMouseDown: function (e, target) {

        var me = this;


        console.log(this);
        me.dragTarget = '';
        me.startXY = me.lastXY = e.xy;

        me.mouseIsDown = true;

        // Flag for downstream DragTracker instances that the mouse is being tracked.
        e.dragTracked = true;


        Event.EventManager.event.add(document, 'mouseup', DT.onMouseUp);

        Event.EventManager.event.add(document, 'mousemove', DT.onMouseMove);

        Event.EventManager.event.add(document, 'selectstart', DT.stopSelect);


    },

    onMouseMove: function (e, target) {
        var me = this,
            xy = e.xy,
            s = me.startXY;

        e.preventDefault();

        me.lastXY = xy;
        if (!me.active) {
            if (Math.max(Math.abs(s[0] - xy[0]), Math.abs(s[1] - xy[1])) > me.tolerance) {
                me.triggerStart(e);
            } else {
                return;
            }
        }
        // 自定义的 onDrag
        me.onDrag(e);

    },

    onMouseUp: function (e) {
        var me = this;
        // Clear the flag which ensures onMouseOut fires only after the mouse button
        // is lifted if the mouseout happens *during* a drag.
        me.mouseIsDown = false;

        // If we mouseouted the el *during* the drag, the onMouseOut method will not have fired. Ensure that it gets processed.
        if (me.mouseIsOut) {
            me.mouseIsOut = false;
            me.onMouseOut(e);
        }
        e.preventDefault();

        // See Ext.dd.DragDropManager::handleMouseDown
        if (Ext.isIE && document.releaseCapture) {
            document.releaseCapture();
        }

        me.fireEvent('mouseup', me, e);

        me.endDrag(e);
    },

    endDrag: function (e) {
        var me = this,
            wasActive = me.active;

        me.clearStart();
        me.active = false;
        if (wasActive) {
            me.onEnd(e);
            me.fireEvent('dragend', me, e);
        }
        // Private property calculated when first required and only cached during a drag
        // Remove flag from event singleton.  Using "Ext.EventObject" here since "endDrag" is called directly in some cases without an "e" param
        me._constrainRegion = Ext.EventObject.dragTracked = null
    },

    stopSelect: function () {
        return false;
    }

}



















