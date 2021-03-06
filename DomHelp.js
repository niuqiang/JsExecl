/**
 *  模板创建html代码时, 对有Id 的对象单独处理 ,添加事件,进行封装;
 * @param tag
 */

var Execljs = {};

(Execljs.DomHelper == null ? Execljs.DomHelper = {} : Execljs.DomHelper).createHtml = function (tag) {


}

/**
 * Lightweight template used to build the output string from variables.
 *        // HTML template for presenting a label UI.
 *        var tpl = new Execljs.template( '<div class="{cls}">{label}</div>' );
 *        alert( tpl.output( { cls: 'cke-label', label: 'foo'} ) ); // '<div class="cke-label">foo</div>'
 *
 * @class
 * @constructor Creates a template class instance.
 * @param {String} source The template source.
 */
Execljs.DomHelper.createTemplate = function (source) {

    var cache = {},
        rePlaceholder = /{([^}]+)}/g,
        reEscapableChars = /([\\'])/g,
        reNewLine = /\n/g,
        reCarriageReturn = /\r/g;

    if (cache[source])
        this.output = cache[source];
    else {
        var fn = source
            // Escape chars like slash "\" or single quote "'".
            .replace(reEscapableChars, '\\$1')
            .replace(reNewLine, '\\n')
            .replace(reCarriageReturn, '\\r')
            // Inject the template keys replacement.
            .replace(rePlaceholder, function (m, key) {
                return "',data['" + key + "']==undefined?'{" + key + "}':data['" + key + "'],'";
            });

        fn = "return buffer?buffer.push('" + fn + "'):['" + fn + "'].join('');";

        this.output = cache[source] = Function('data', 'buffer', fn);
    }

    return this.output();

}

Execljs.DomHelper.doInsert = function (where, el, tpl, values) {

    var dom;
    if (typeof el == 'string') {
        dom = document.getElementById(el)
    } else {
        dom = el;
    }

    return Execljs.DomHelper.insertHtml(where, dom, tpl, values);


}

Execljs.DomHelper.insertHtml = function (where, el, html) {

    var hash = {},
        setStart,
        range,
        frag,
        rangeEl;

    where = where.toLowerCase();

    // add these here because they are used in both branches of the condition.
    hash['beforebegin'] = ['BeforeBegin', 'previousSibling'];
    hash['afterend'] = ['AfterEnd', 'nextSibling'];

    range = document.createRange();
    setStart = 'setStart' + (/end/i.test(where) ? 'After' : 'Before');
    if (hash[where]) {
        range[setStart](el);
        frag = range.createContextualFragment(html);
        el.parentNode.insertBefore(frag, where == 'beforebegin' ? el : el.nextSibling);
        return el;
    }
    else {
        rangeEl = (where == 'afterbegin' ? 'first' : 'last') + 'Child';
        if (el.firstChild) {
            range[setStart](el[rangeEl]);
            frag = range.createContextualFragment(html);
            if (where == 'afterbegin') {
                el.insertBefore(frag, el.firstChild);
            }
            else {
                el.appendChild(frag);
            }
        }
        else {
            el.innerHTML = html;
        }
        return el;
    }

    throw 'Illegal insertion point -> "' + where + '"';

}

Execljs.DomHelper.append = function (el, tpl, values, returnElement) {

    return this.doInsert('beforeEnd', el, tpl, values, returnElement);
}

Execljs.DomHelper.insertAfter = function (el, tpl, values, returnElement) {
    return this.doInsert('afterEnd', el, values, returnElement);
}


Execljs.DomHelper.insertBefore = function (el, tpl, values, returnElement) {
    return this.doInsert('beforeBegin', el, tpl, values, returnElement);
}


Execljs.DomHelper.insertFirst = function (el, tpl, values, returnElement) {
    return this.doInsert('afterBegin', el, tpl, values, returnElement);
}
