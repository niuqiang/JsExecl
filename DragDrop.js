/**
 * Created by Administrator on 2015-11-12.
 */


Execljs.DragDropManager = function(){};

DragDropManagerProto =  Execljs.DragDropManager;

DragDropManagerProto ={

    handleMouseDown :function(e){
        var me = this,  el;

        me.currentTarget = e.getTarget();
        me.dragCurrent = oDD;

        el = oDD.getEl();

        me.startX = e.getPageX();
        me.startY = e.getPageY();

        me.deltaX = me.startX - el.offsetLeft;
        me.deltaY = me.startY - el.offsetTop;

        me.dragThreshMet = false;

        me.clickTimeout = setTimeout(
            function() {
                me.startDrag(me.startX, me.startY);
            },
           30
        );
    },

    startDrag: function(x, y) {
        var me = this,
            current = me.dragCurrent,
            dragEl;

        clearTimeout(me.clickTimeout);
        if (current) {

            current.startDrag(x, y);
            dragEl = current.getDragEl();

            // Add current drag class to dragged element
            if (dragEl) {
             //   Ext.fly(dragEl).addCls(me.dragCls);
            }
        }
        me.dragThreshMet = true;
    },

    stopEvent: function(e) {
        if (this.stopPropagation) {
            e.stopPropagation();
        }

        if (this.preventDefault) {
            e.preventDefault();
        }
    },


}

DragDrop = function () {


}

DragDrop.prototype = {

    init: function (id, config ) {

        var me =this ;

        if (id) {
            this.initTarget(id, config);
        }

        this.on(this.id, "mousedown", me.handleMouseDown, this);

    },


    initTarget: function (id, config) {

        var me = this ;
        this.config = config || {};
        this.DDMInstance = DragDropManagerProto;

        me.on('mousedown', me.handleMouseDown);


    },

    handleMouseDown: function (e) {

        var me = this;

        me.b4MouseDown(e);
        me.DDMInstance.handleMouseDown(e, me);
        me.DDMInstance.stopEvent(e);
    },

    b4MouseDown:function(e){
      console.log(e)  ;

    }
}

