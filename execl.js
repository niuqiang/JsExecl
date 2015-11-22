/**
 * Created by Administrator on 2015/10/23.
 */
// 时间 2015年10月21日19:52:23


var Execljs = Execljs || {};

/**
 * 基础 ，继承 ，minix ， 配置
 * @param name
 *    if name eq String 创建一个该类
 *       else 创建继承的类
 * @param extend type String
 * @param minix
 * @param config
 * @constructor
 */
function Class(name, extend, mixins, config) {

    this.className = name;


    function maktor() {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }

        return constructor;
    };


    var tmp = maktor();
    var tmpPrototpye = tmp.prototype;

    if (arguments.length == 4) {

        var F = function () {
        }, superclassProto = extend.prototype;

        F.prototype = superclassProto;


        for (var i in  F.prototype) {
            tmpPrototpye[i] = F.prototype[i];
        }
    }
    for (var j in mixins) {

        var mixinsPro = mixins[j].prototype;

        for (var y in mixinsPro)
            tmpPrototpye[y] = mixinsPro[y];
    }

    for (var i in config) {

        tmpPrototpye[i] = config[i];

    }

    window[name] = tmp;
}


Execljs.Function = {
    bind: function (fn, scope) {
        return function () {
            return fn.apply(scope, arguments);
        };
    }

}

Execljs.Component = {};


Execljs.onReady(function () {

    Class('Button', Execljs.Component, [Event.EventManager], {
        cls: 'button',
        array: [],
        values: {},
        appendTo: function (_el) {
            this.el = Execljs.DomHelper.append(_el, Execljs.DomHelper.createTemplate(this.tpl), this.values, this.el);
        },
        constructor: function (tpl) {
            this.tpl = tpl;
            return this;
        }

    });


    var tpl = '<div class="inputmenuGroup">' +
        '   <input type="text" style="font-family: Consolas" class="input buttoninput  fonttype" value="Consolas"/>' +
        '   <span class="lsf arrow">dropdown</span>' +
        '</div>';


    var t = new Button(tpl);

    var t2 = new Button(
        '<div class="inputmenuGroup">' +
        '<input type="text" class="input buttoninput fontsize  " value="12px"/>' +
        '<span class="lsf arrow">dropdown</span>' +
        '</div>');

    var t3 = new Button(
        ' <div class="menuGroup">' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">bold</span>' +
        '</button>' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">italic</span>' +
        '</button>' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">underline</span>' +
        '</button>' +
        ' </div>'
    );

    var t4 = new Button(
        '<div class="menuGroup">' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">alignleft</span>' +
        '</button>' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">aligncenter</span>' +
        '</button>' +
        '<button type="button" class="btn btn-default">' +
        '<span class="lsf">alignright</span>' +
        '</button>' +
        '</div>'
    );

    t.appendTo('toolbar');
    t2.appendTo('toolbar');
    t3.appendTo('toolbar');
    t4.appendTo('toolbar');

    t2.on('mouseover', function () {

    })
    t.on('click', function (e) {
        console.log(e);
    });


    t.on('clicks', function (e) {
        alert('sclicksclickss');

    });


    Class('Scrollbar', Execljs.Component, [Event.EventManager, DragDrop], {

            constructor: function (tpl) {
                this.tpl = tpl;
                return this;
            },

            appendTo: function (_el) {
                this.el = Execljs.DomHelper.append(_el, Execljs.DomHelper.createTemplate(this.tpl), this.values, this.el);


                this.afterRender();

                return this;
            },

            afterRender: function () {
                var me = this;

                var ddEl = this.findDD(this.el, 'hscrollbarContainer');

                me.init();

                me.initScrollRow();

                me.constrainTo();
            },

            startDrag: function (x, y) {
                var me = this,
                    current = me.el;

                if (current) {

                    me.dragEl = me.findDD(me.el, 'ddElement');

                    // Add current drag class to dragged element

                    me.dragEl.setStyle('backgroundColor', 'rgb(119, 116, 116)');

                }
                me.dragThreshMet = true;
            },

            findDD: function (el, cls) {
                var out = [];
                Element.getElByCls(el, cls, out);
                return out[0];
            },

            initScrollRow: function () {
                var me = this;

                me.getLeftArrow().on('mousedown', function (e) {
                    me.moveScrollbar('left', 20);
                    me.intervalProcess = setInterval(function () {
                        me.moveScrollbar('left', 2);
                    }, 50);
                });

                me.getLeftArrow().on('mouseup', function (e) {

                    clearInterval(me.intervalProcess);

                });

                me.getRightArrow().on('mousedown', function () {

                    me.moveScrollbar('right', 20);
                    me.intervalProcess_ = setInterval(function () {
                        me.moveScrollbar('right', 2);
                    }, 50);

                });

                me.getRightArrow().on('mouseup', function () {
                    clearInterval(me.intervalProcess_);
                });

                me.geNavigationbar().on('mousedown', function (e) {

                    var out = [];
                    Element.getElByCls(me, 'ddElement', out);
                    if (out[0] != undefined) {

                        var mouseX = e.currentTarget.offsetLeft, ddElX = out[0].getStyle('left'),
                            ddElxWidth = out[0].getStyle('width');
                    }


                });

            },

            getLeftArrow: function () {
                var out = [];
                Element.getElByCls(this.el, 'arrowleft', out);
                return out[0];

            },

            getRightArrow: function () {
                var out = [];
                Element.getElByCls(this.el, 'arrowright', out);
                return out[0];
            },

            geNavigationbar: function () {
                var out = [];
                Element.getElByCls(this.el, 'hscrollbarContainer', out);

                return out[0];
            },

            moveScrollbar: function (dir, pix) {
                var out = [], scrollbar, dir, lenght, maxlenght;
                Element.getElByCls(this.el, 'ddElement', out);
                scrollbar = out [0];
                if (dir === 'left') {
                    lenght = scrollbar.getStyle('left') - pix;
                    scrollbar.setStyle('left', (lenght < 0 ? 0 : lenght ) + 'px');
                } else {
                    lenght = scrollbar.getStyle('left') - 0 + pix;
                    maxlenght = scrollbar.findParent().getWidth() - scrollbar.getWidth() - 3;
                    scrollbar.setStyle('left', (lenght > maxlenght ? maxlenght : lenght ) + 'px');
                }


            }
        }
    )
    var xScrollbar = new Scrollbar(JsExeclHtml.xScrollbar);

    xScrollbar.appendTo('hscrollbar');


    /**
     * list 表单内容
     */

    Class('List', Execljs.Component, [Event.EventManager, DragDrop], {

        /**
         * 初始化提交两个
         * @param tpl
         * @returns {constructor}
         */
        constructor: function (listBody, listTr) {

            /**初始化100行 **/
            var row = 100, i = 1, list_trs = '';

            for (; i <= row; i++) {

                list_trs += listTr.replace('$', i);
            }


            this.tpl = listBody.replace('$', list_trs);
            return this;
        },

        appendTo: function (_el) {

            var out = [];

            Element.getElByCls((new Element('execl')).dom, _el, out);

            this.el = Execljs.DomHelper.insertFirst(out[0].dom, Execljs.DomHelper.createTemplate(this.tpl), this.values, this.el).children[0];

            this.afterRender();

            return this;
        },

        startDrag: function () {


        },
        afterRender: function () {
            var me = this;

            me.on('mousemove', me.onMouseMove);

            me.dragTracker = new DragTracker({
                el:me.el ,
                onBeforeStart: Execljs.Function.bind(me.onBeforeStart, me),
                onStart: Execljs.Function.bind(me.onStart, me),
                onDrag: Execljs.Function.bind (me.onDrag, me),
                onEnd:  Execljs.Function.bind(me.onEnd, me)
            });


        },

        onMouseMove: function (e) {

            var me = this ;

            /** already draggin  return **/
            if(me.dragging){

                return ;
            }else{

               if(e.relatedTarget.className.indexOf('ddElement') > 0){

                    me.ddel = e.relatedTarget;
               }else{
                   me.ddel = null ;
               }


            }



        }
    })

    var list = new List(JsExeclHtml.listBody, JsExeclHtml.listTr);

    list.appendTo('contenttab');


})





