/**
 * Created by Administrator on 2015-11-12.
 */


Execljs.DragDropManager = function(){};

DragDropManagerProto =  Execljs.DragDropManager;

DragDropManagerProto ={

    handleMouseDown :function(e ,me_){
        var me = me_   ;

        me.currentTarget = e.relatedTarget;

        me.startX  =   e.xy[0];
        me.startY = e.xy[1];

        me.ddTarget = me.currentTarget;

        me.deltaX = me.startX -   me.currentTarget.offsetLeft;
        me.deltaY = me.startY -   me.currentTarget.offsetTop;

    },

    handleMouseMove:function(e  ,me_){

        var me = me_,
            current =me.ddTarget,
            diffX,
            diffY;

        if (!current) {
            return true;
        }


            diffX = Math.abs(me.startX - e.xy[0]);
            diffY = Math.abs(me.startY - e.xy[1]);


            e.relatedTarget.style.left = diffX +"px";



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
    startX:0,
    startY:0,
    deltaX:0,
    deltaY:0,
    init: function (el, config ) {

        var me =this ;

        if (el) {
            me.initTarget(el, config);
        }

    },

    initTarget: function (id, config) {

        var me = this ;
        this.config = config || {};
        this.DDMInstance = DragDropManagerProto;

        me.on('mousemove', me.handleMouseMove);

        me.on('mousedown', me.handleMouseDown);

        me.on('mouseup', me.handleMouseUp);

    },
    handleMouseMove:function(e){

        this.DDMInstance.handleMouseMove(e , this);

    },

    handleMouseUp:function(e){

        this.ddTarget = null;
    },

    handleMouseDown: function (e) {

        var me = this;

        me.b4MouseDown(e);

        me.DDMInstance.handleMouseDown(e, me);


    },

    b4MouseDown:function(e){



    }
}

