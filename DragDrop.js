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
        if (this.stopPropagation) {
            e.stopPropagation();
        }

        if (this.preventDefault) {
            e.preventDefault();
        }
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

    init: function (config) {

        var me = this;

        this.on('mousedown', me.handleMouseDown);

    },

    constrainTo: function (constrainTo) {

        var c, ddEl = this.findDD(this.el), constrainPal, topSpace, leftSpace;

        /**defaule ddEl parentNode **/
        if (constrainTo == null) {
            constrainPal = ddEl.parentNode;

            c = {width: constrainPal.clientWidth, height: constrainPal.clientHeight};
        }

        topSpace = ddEl.offsetTop;
        leftSpace = ddEl.offsetLeft;

        this.setXConstraint(leftSpace, c.width - leftSpace - ddEl.clientWidth);
        this.setYConstraint(topSpace, c.height - topSpace - ddEl.clientHeight);

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

        if (e.relatedTarget.className.indexOf('ddElement') < 0) {

            return;

        }

        me.DDMInstance = Execljs.DragDropManager;

        me.DDMInstance.handleMouseDown(e, me);

        Event.EventManager.event.add(document, 'mousemove', me.bind(me.handleMouseMove, me));

        Event.EventManager.event.add(document, 'mouseup', me.bind(me.handleMouseUp, me));

        var me = this;

        me.b4MouseDown(e);
    },

    bind: function (fn, scope) {
        return function () {
            return fn.apply(scope, arguments);
        };

    },

    startDrag: function (x, y) {
        var me = this,
            current = me.el;


        if (current) {

            me.dragEl = me.findDD(current);

            // Add current drag class to dragged element
            me.dragEl.style.backgroundColor = 'rgb(119, 116, 116)';
        }
        me.dragThreshMet = true;
    },

    handleMouseMove: function (e) {

        var dragel = this.dragEl, oCoord;

        if (dragel) {

            oCoord = this.getTargetCoord(e.xy[0], e.xy[1]);

            dragel.style.left = oCoord.x + 'px';
            // dragel.style.top = oCoord.y + 'px';

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

        (this.dragEl && this.dragEl.style || {}).backgroundColor = 'rgb(188, 188, 188)';
        this.dragEl = null;
        this.deltaX = null;
        this.deltaY = null;

    },

    b4MouseDown: function (e) {

    }
}

