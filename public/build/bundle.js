
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\gui\examples\Section.svelte generated by Svelte v3.44.2 */

    const file$j = "src\\gui\\examples\\Section.svelte";

    function create_fragment$o(ctx) {
    	let fieldset;
    	let legend;
    	let t0;
    	let t1;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(legend, "class", "svelte-1i1rspz");
    			add_location(legend, file$j, 44, 2, 965);
    			attr_dev(div, "class", "content svelte-1i1rspz");
    			toggle_class(div, "horizontal", /*direction*/ ctx[1] === 'horizontal');
    			toggle_class(div, "vertical", /*direction*/ ctx[1] === 'vertical');
    			add_location(div, file$j, 45, 2, 993);
    			attr_dev(fieldset, "class", "section svelte-1i1rspz");
    			add_location(fieldset, file$j, 43, 0, 935);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, legend);
    			append_dev(legend, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*direction*/ 2) {
    				toggle_class(div, "horizontal", /*direction*/ ctx[1] === 'horizontal');
    			}

    			if (dirty & /*direction*/ 2) {
    				toggle_class(div, "vertical", /*direction*/ ctx[1] === 'vertical');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, ['default']);
    	let { title = "" } = $$props;
    	let { direction = "horizontal" } = $$props;
    	const writable_props = ['title', 'direction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, direction });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, direction, $$scope, slots];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { title: 0, direction: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get title() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\examples\Area.svelte generated by Svelte v3.44.2 */
    const file$i = "src\\gui\\examples\\Area.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "area svelte-1o8ml7n");

    			attr_dev(div, "style", div_style_value = `height:${/*height*/ ctx[1] > 0
			? /*height*/ ctx[1] + 'px'
			: 'auto'}`);

    			toggle_class(div, "horizontal", /*direction*/ ctx[0] === 'horizontal');
    			toggle_class(div, "vertical", /*direction*/ ctx[0] === 'vertical');
    			add_location(div, file$i, 20, 0, 411);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*height*/ 2 && div_style_value !== (div_style_value = `height:${/*height*/ ctx[1] > 0
			? /*height*/ ctx[1] + 'px'
			: 'auto'}`)) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*direction*/ 1) {
    				toggle_class(div, "horizontal", /*direction*/ ctx[0] === 'horizontal');
    			}

    			if (dirty & /*direction*/ 1) {
    				toggle_class(div, "vertical", /*direction*/ ctx[0] === 'vertical');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Area', slots, ['default']);
    	let { direction = "horizontal" } = $$props;
    	let { height = -1 } = $$props;
    	const writable_props = ['direction', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Area> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ direction, height });

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction, height, $$scope, slots];
    }

    class Area extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { direction: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Area",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get direction() {
    		throw new Error("<Area>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Area>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Area>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Area>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\examples\Events.svelte generated by Svelte v3.44.2 */

    const file$h = "src\\gui\\examples\\Events.svelte";

    function create_fragment$m(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = `${/*icon*/ ctx[0]}`;
    			attr_dev(div0, "class", "heading svelte-1tusvbq");
    			add_location(div0, file$h, 17, 2, 302);
    			attr_dev(div1, "class", "events svelte-1tusvbq");
    			add_location(div1, file$h, 15, 0, 266);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Events', slots, ['default']);
    	let { mute = false } = $$props;
    	let icon = mute ? "🔕" : "🔔";
    	const writable_props = ['mute'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('mute' in $$props) $$invalidate(1, mute = $$props.mute);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ mute, icon });

    	$$self.$inject_state = $$props => {
    		if ('mute' in $$props) $$invalidate(1, mute = $$props.mute);
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, mute, $$scope, slots];
    }

    class Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { mute: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get mute() {
    		throw new Error("<Events>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mute(value) {
    		throw new Error("<Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const letterRegex = /[a-zA-Z]/;
    const numericInputRegex = /[\-.]/;
    const generalInputRegex = /Tab|Escape|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Ctrl/;
    function isGeneralInputKey(key) {
        return !!key.match(generalInputRegex);
    }
    function isDeleteKey(key) {
        return key === "Delete" || key === "Backspace";
    }
    function isIncrementKey(key) {
        return key === "ArrowUp" || key === "ArrowRight";
    }
    function isDecrementKey(key) {
        return key === "ArrowDown" || key === "ArrowLeft";
    }
    function isScrollUpKey(key) {
        return key === "ArrowUp" || key === "ArrowLeft";
    }
    function isScrollDownKey(key) {
        return key === "ArrowDown" || key === "ArrowRight";
    }
    function isArrowKey(key) {
        return isIncrementKey(key) || isDecrementKey(key);
    }
    function isAcceptKey(key) {
        return key === "Enter" || key === " ";
    }
    function isNumeric(key) {
        return !isNaN(parseFloat(key));
    }
    function isNumericInput(key) {
        return !!key.match(numericInputRegex) || isNumeric(key);
    }
    function isLetter(key) {
        return !!key.match(letterRegex);
    }
    function isAlphaNumeric(key) {
        return isNumeric(key) || isLetter(key);
    }
    function isModifier(key) {
        return (key === "Control" || key === "Shift" || key === "Option" || key === "Alt");
    }

    /*!
     * hotkeys-js v3.8.7
     * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
     * 
     * Copyright (c) 2021 kenny wong <wowohoo@qq.com>
     * http://jaywcjlove.github.io/hotkeys
     * 
     * Licensed under the MIT license.
     */

    var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

    function addEvent(object, event, method) {
      if (object.addEventListener) {
        object.addEventListener(event, method, false);
      } else if (object.attachEvent) {
        object.attachEvent("on".concat(event), function () {
          method(window.event);
        });
      }
    } // 修饰键转换成对应的键码


    function getMods(modifier, key) {
      var mods = key.slice(0, key.length - 1);

      for (var i = 0; i < mods.length; i++) {
        mods[i] = modifier[mods[i].toLowerCase()];
      }

      return mods;
    } // 处理传的key字符串转换成数组


    function getKeys(key) {
      if (typeof key !== 'string') key = '';
      key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

      var keys = key.split(','); // 同时设置多个快捷键，以','分割

      var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

      for (; index >= 0;) {
        keys[index - 1] += ',';
        keys.splice(index, 1);
        index = keys.lastIndexOf('');
      }

      return keys;
    } // 比较修饰键的数组


    function compareArray(a1, a2) {
      var arr1 = a1.length >= a2.length ? a1 : a2;
      var arr2 = a1.length >= a2.length ? a2 : a1;
      var isIndex = true;

      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
      }

      return isIndex;
    }

    var _keyMap = {
      backspace: 8,
      tab: 9,
      clear: 12,
      enter: 13,
      return: 13,
      esc: 27,
      escape: 27,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      del: 46,
      delete: 46,
      ins: 45,
      insert: 45,
      home: 36,
      end: 35,
      pageup: 33,
      pagedown: 34,
      capslock: 20,
      num_0: 96,
      num_1: 97,
      num_2: 98,
      num_3: 99,
      num_4: 100,
      num_5: 101,
      num_6: 102,
      num_7: 103,
      num_8: 104,
      num_9: 105,
      num_multiply: 106,
      num_add: 107,
      num_enter: 108,
      num_subtract: 109,
      num_decimal: 110,
      num_divide: 111,
      '⇪': 20,
      ',': 188,
      '.': 190,
      '/': 191,
      '`': 192,
      '-': isff ? 173 : 189,
      '=': isff ? 61 : 187,
      ';': isff ? 59 : 186,
      '\'': 222,
      '[': 219,
      ']': 221,
      '\\': 220
    }; // Modifier Keys

    var _modifier = {
      // shiftKey
      '⇧': 16,
      shift: 16,
      // altKey
      '⌥': 18,
      alt: 18,
      option: 18,
      // ctrlKey
      '⌃': 17,
      ctrl: 17,
      control: 17,
      // metaKey
      '⌘': 91,
      cmd: 91,
      command: 91
    };
    var modifierMap = {
      16: 'shiftKey',
      18: 'altKey',
      17: 'ctrlKey',
      91: 'metaKey',
      shiftKey: 16,
      ctrlKey: 17,
      altKey: 18,
      metaKey: 91
    };
    var _mods = {
      16: false,
      18: false,
      17: false,
      91: false
    };
    var _handlers = {}; // F1~F12 special key

    for (var k = 1; k < 20; k++) {
      _keyMap["f".concat(k)] = 111 + k;
    }

    var _downKeys = []; // 记录摁下的绑定键

    var _scope = 'all'; // 默认热键范围

    var elementHasBindEvent = []; // 已绑定事件的节点记录
    // 返回键码

    var code = function code(x) {
      return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
    }; // 设置获取当前范围（默认为'所有'）


    function setScope(scope) {
      _scope = scope || 'all';
    } // 获取当前范围


    function getScope() {
      return _scope || 'all';
    } // 获取摁下绑定键的键值


    function getPressedKeyCodes() {
      return _downKeys.slice(0);
    } // 表单控件控件判断 返回 Boolean
    // hotkey is effective only when filter return true


    function filter(event) {
      var target = event.target || event.srcElement;
      var tagName = target.tagName;
      var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

      if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
        flag = false;
      }

      return flag;
    } // 判断摁下的键是否为某个键，返回true或者false


    function isPressed(keyCode) {
      if (typeof keyCode === 'string') {
        keyCode = code(keyCode); // 转换成键码
      }

      return _downKeys.indexOf(keyCode) !== -1;
    } // 循环删除handlers中的所有 scope(范围)


    function deleteScope(scope, newScope) {
      var handlers;
      var i; // 没有指定scope，获取scope

      if (!scope) scope = getScope();

      for (var key in _handlers) {
        if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
          handlers = _handlers[key];

          for (i = 0; i < handlers.length;) {
            if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
          }
        }
      } // 如果scope被删除，将scope重置为all


      if (getScope() === scope) setScope(newScope || 'all');
    } // 清除修饰键


    function clearModifier(event) {
      var key = event.keyCode || event.which || event.charCode;

      var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


      if (i >= 0) {
        _downKeys.splice(i, 1);
      } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


      if (event.key && event.key.toLowerCase() === 'meta') {
        _downKeys.splice(0, _downKeys.length);
      } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


      if (key === 93 || key === 224) key = 91;

      if (key in _mods) {
        _mods[key] = false; // 将修饰键重置为false

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = false;
        }
      }
    }

    function unbind(keysInfo) {
      // unbind(), unbind all keys
      if (!keysInfo) {
        Object.keys(_handlers).forEach(function (key) {
          return delete _handlers[key];
        });
      } else if (Array.isArray(keysInfo)) {
        // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
        keysInfo.forEach(function (info) {
          if (info.key) eachUnbind(info);
        });
      } else if (typeof keysInfo === 'object') {
        // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
        if (keysInfo.key) eachUnbind(keysInfo);
      } else if (typeof keysInfo === 'string') {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // support old method
        // eslint-disable-line
        var scope = args[0],
            method = args[1];

        if (typeof scope === 'function') {
          method = scope;
          scope = '';
        }

        eachUnbind({
          key: keysInfo,
          scope: scope,
          method: method,
          splitKey: '+'
        });
      }
    } // 解除绑定某个范围的快捷键


    var eachUnbind = function eachUnbind(_ref) {
      var key = _ref.key,
          scope = _ref.scope,
          method = _ref.method,
          _ref$splitKey = _ref.splitKey,
          splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
      var multipleKeys = getKeys(key);
      multipleKeys.forEach(function (originKey) {
        var unbindKeys = originKey.split(splitKey);
        var len = unbindKeys.length;
        var lastKey = unbindKeys[len - 1];
        var keyCode = lastKey === '*' ? '*' : code(lastKey);
        if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

        if (!scope) scope = getScope();
        var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
        _handlers[keyCode] = _handlers[keyCode].map(function (record) {
          // 通过函数判断，是否解除绑定，函数相等直接返回
          var isMatchingMethod = method ? record.method === method : true;

          if (isMatchingMethod && record.scope === scope && compareArray(record.mods, mods)) {
            return {};
          }

          return record;
        });
      });
    }; // 对监听对应快捷键的回调函数进行处理


    function eventHandler(event, handler, scope) {
      var modifiersMatch; // 看它是否在当前范围

      if (handler.scope === scope || handler.scope === 'all') {
        // 检查是否匹配修饰符（如果有返回true）
        modifiersMatch = handler.mods.length > 0;

        for (var y in _mods) {
          if (Object.prototype.hasOwnProperty.call(_mods, y)) {
            if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
              modifiersMatch = false;
            }
          }
        } // 调用处理程序，如果是修饰键不做处理


        if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
          if (handler.method(event, handler) === false) {
            if (event.preventDefault) event.preventDefault();else event.returnValue = false;
            if (event.stopPropagation) event.stopPropagation();
            if (event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    } // 处理keydown事件


    function dispatch(event) {
      var asterisk = _handlers['*'];
      var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

      if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
      // Webkit左右 command 键值不一样

      if (key === 93 || key === 224) key = 91;
      /**
       * Collect bound keys
       * If an Input Method Editor is processing key input and the event is keydown, return 229.
       * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
       * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
       */

      if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
      /**
       * Jest test cases are required.
       * ===============================
       */

      ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
        var keyNum = modifierMap[keyName];

        if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
          _downKeys.push(keyNum);
        } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
          _downKeys.splice(_downKeys.indexOf(keyNum), 1);
        } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
          /**
           * Fix if Command is pressed:
           * ===============================
           */
          if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
            _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
          }
        }
      });
      /**
       * -------------------------------
       */

      if (key in _mods) {
        _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = true;
        }

        if (!asterisk) return;
      } // 将 modifierMap 里面的修饰键绑定到 event 中


      for (var e in _mods) {
        if (Object.prototype.hasOwnProperty.call(_mods, e)) {
          _mods[e] = event[modifierMap[e]];
        }
      }
      /**
       * https://github.com/jaywcjlove/hotkeys/pull/129
       * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
       * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
       * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
       */


      if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
        if (_downKeys.indexOf(17) === -1) {
          _downKeys.push(17);
        }

        if (_downKeys.indexOf(18) === -1) {
          _downKeys.push(18);
        }

        _mods[17] = true;
        _mods[18] = true;
      } // 获取范围 默认为 `all`


      var scope = getScope(); // 对任何快捷键都需要做的处理

      if (asterisk) {
        for (var i = 0; i < asterisk.length; i++) {
          if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
            eventHandler(event, asterisk[i], scope);
          }
        }
      } // key 不在 _handlers 中返回


      if (!(key in _handlers)) return;

      for (var _i = 0; _i < _handlers[key].length; _i++) {
        if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
          if (_handlers[key][_i].key) {
            var record = _handlers[key][_i];
            var splitKey = record.splitKey;
            var keyShortcut = record.key.split(splitKey);
            var _downKeysCurrent = []; // 记录当前按键键值

            for (var a = 0; a < keyShortcut.length; a++) {
              _downKeysCurrent.push(code(keyShortcut[a]));
            }

            if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
              // 找到处理内容
              eventHandler(event, record, scope);
            }
          }
        }
      }
    } // 判断 element 是否已经绑定事件


    function isElementBind(element) {
      return elementHasBindEvent.indexOf(element) > -1;
    }

    function hotkeys(key, option, method) {
      _downKeys = [];
      var keys = getKeys(key); // 需要处理的快捷键列表

      var mods = [];
      var scope = 'all'; // scope默认为all，所有范围都有效

      var element = document; // 快捷键事件绑定节点

      var i = 0;
      var keyup = false;
      var keydown = true;
      var splitKey = '+'; // 对为设定范围的判断

      if (method === undefined && typeof option === 'function') {
        method = option;
      }

      if (Object.prototype.toString.call(option) === '[object Object]') {
        if (option.scope) scope = option.scope; // eslint-disable-line

        if (option.element) element = option.element; // eslint-disable-line

        if (option.keyup) keyup = option.keyup; // eslint-disable-line

        if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

        if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
      }

      if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

      for (; i < keys.length; i++) {
        key = keys[i].split(splitKey); // 按键列表

        mods = []; // 如果是组合快捷键取得组合快捷键

        if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

        key = key[key.length - 1];
        key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
        // 判断key是否在_handlers中，不在就赋一个空数组

        if (!(key in _handlers)) _handlers[key] = [];

        _handlers[key].push({
          keyup: keyup,
          keydown: keydown,
          scope: scope,
          mods: mods,
          shortcut: keys[i],
          method: method,
          key: keys[i],
          splitKey: splitKey
        });
      } // 在全局document上设置快捷键


      if (typeof element !== 'undefined' && !isElementBind(element) && window) {
        elementHasBindEvent.push(element);
        addEvent(element, 'keydown', function (e) {
          dispatch(e);
        });
        addEvent(window, 'focus', function () {
          _downKeys = [];
        });
        addEvent(element, 'keyup', function (e) {
          dispatch(e);
          clearModifier(e);
        });
      }
    }

    var _api = {
      setScope: setScope,
      getScope: getScope,
      deleteScope: deleteScope,
      getPressedKeyCodes: getPressedKeyCodes,
      isPressed: isPressed,
      filter: filter,
      unbind: unbind
    };

    for (var a in _api) {
      if (Object.prototype.hasOwnProperty.call(_api, a)) {
        hotkeys[a] = _api[a];
      }
    }

    if (typeof window !== 'undefined') {
      var _hotkeys = window.hotkeys;

      hotkeys.noConflict = function (deep) {
        if (deep && window.hotkeys === hotkeys) {
          window.hotkeys = _hotkeys;
        }

        return hotkeys;
      };

      window.hotkeys = hotkeys;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var eventemitter3 = createCommonjsModule(function (module) {

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    {
      module.exports = EventEmitter;
    }
    });

    class Action extends eventemitter3 {
        constructor(handler, shortcut) {
            super();
            this.isEnabled = true;
            this.isChecked = false;
            this.canToggle = false;
            this.handler = handler;
            this.hotkey = shortcut;
            this.register();
        }
        get printShortcut() {
            return this.hotkey
                .split("+")
                .map((part) => part[0].toUpperCase() + part.substring(1))
                .join(" ");
        }
        register() {
            if (this.hotkey) {
                hotkeys(this.hotkey, (event, _handler) => {
                    event.preventDefault();
                    this.execute();
                });
            }
        }
        unregister() {
            if (this.hotkey) {
                hotkeys.unbind(this.hotkey);
            }
        }
        execute() {
            if (this.isEnabled) {
                if (this.canToggle) {
                    this.isChecked = !this.isChecked;
                }
                this.handler();
                Action.notifications.emit("execute", this);
            }
        }
    }
    Action.notifications = new eventemitter3();
    function action(handler, hotkey, opts = {}) {
        const action = new Action(handler, hotkey);
        typeof opts.isEnabled === "boolean"
            ? (action.isEnabled = opts.isEnabled)
            : void 0;
        typeof opts.isChecked === "boolean"
            ? (action.isChecked = opts.isChecked)
            : void 0;
        typeof opts.canToggle === "boolean"
            ? (action.canToggle = opts.canToggle)
            : void 0;
        return action;
    }

    class MenuItem {
        constructor(opts) {
            const { isChecked = false, isEnabled = true, canToggle = false, label, value, icon, items, action, } = opts;
            this.action = action;
            this.isEnabled = isEnabled;
            this.isChecked = isChecked;
            this.canToggle = canToggle;
            this.label = label;
            this.value = value;
            this.icon = icon;
            this.items = items;
        }
        get hasAction() {
            return !!this.action;
        }
        get isEnabled() {
            return this.hasAction ? this.action.isEnabled : this._isEnabled;
        }
        set isEnabled(value) {
            if (this.hasAction) {
                this._isEnabled = value;
                this.action.isEnabled = value;
            }
            this._isEnabled = value;
        }
        get isChecked() {
            return this.hasAction ? this.action.isChecked : this._isChecked;
        }
        set isChecked(value) {
            if (this.hasAction) {
                this._isChecked = value;
                this.action.isChecked = value;
            }
            this._isChecked = value;
        }
        get canToggle() {
            return this.hasAction ? this.action.canToggle : this._canToggle;
        }
        set canToggle(value) {
            if (this.hasAction) {
                this._canToggle = value;
                this.action.canToggle = value;
            }
            this._canToggle = value;
        }
        get isSeparator() {
            return this.label === "-";
        }
        get isItem() {
            return !this.isSeparator;
        }
        get isInteractive() {
            return !!(this.isEnabled && this.isItem);
        }
        get hasSubMenu() {
            return !!(this.items && this.items.length > 0);
        }
        get hasShortcut() {
            return !!(this.hasAction && this.action.hotkey);
        }
        get hasIcon() {
            return !!(this.icon || this.canToggle || this.isChecked);
        }
        get hasIteractiveSubMenu() {
            if (!this.isInteractive || !this.hasSubMenu) {
                return false;
            }
            else {
                return this.items.some((item) => item.isInteractive);
            }
        }
        get printShortcut() {
            return this.hasShortcut ? this.action.printShortcut : "";
        }
        execute() {
            if (this.hasAction) {
                this.action.execute();
            }
        }
    }
    const separator = new MenuItem({ label: "-" });

    /* src\gui\components\Label.svelte generated by Svelte v3.44.2 */
    const file$g = "src\\gui\\components\\Label.svelte";

    // (133:2) {:else}
    function create_else_block$3(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*text*/ ctx[1]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "label-wrapper svelte-1ahidw9");
    			attr_dev(span, "style", /*indentStyle*/ ctx[7]);
    			add_location(span, file$g, 133, 4, 3202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*text*/ 2) set_data_dev(t0, /*text*/ ctx[1]);

    			if (!current || dirty & /*indentStyle*/ 128) {
    				attr_dev(span, "style", /*indentStyle*/ ctx[7]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(133:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (131:2) {#if !hasContent}
    function create_if_block$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*text*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(131:2) {#if !hasContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let label;
    	let current_block_type_index;
    	let if_block;
    	let label_style_value;
    	let label_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$c, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*hasContent*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if_block.c();
    			attr_dev(label, "class", "label svelte-1ahidw9");
    			attr_dev(label, "style", label_style_value = "" + (/*colorStyle*/ ctx[9] + /*fontStyle*/ ctx[8]));
    			attr_dev(label, "data-component", "label");
    			attr_dev(label, "data-position", /*position*/ ctx[3]);
    			attr_dev(label, "data-align", /*align*/ ctx[4]);
    			attr_dev(label, "data-justify", /*justify*/ ctx[5]);
    			attr_dev(label, "tabindex", label_tabindex_value = /*isEnabled*/ ctx[0] && /*isLink*/ ctx[2] ? 0 : -1);
    			toggle_class(label, "enabled", /*isEnabled*/ ctx[0]);
    			toggle_class(label, "disabled", !/*isEnabled*/ ctx[0]);
    			toggle_class(label, "link", /*isLink*/ ctx[2]);
    			add_location(label, file$g, 114, 0, 2762);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			if_blocks[current_block_type_index].m(label, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(label, "mouseover", /*mouseover_handler*/ ctx[16], false, false, false),
    					listen_dev(label, "mouseout", /*mouseout_handler*/ ctx[17], false, false, false),
    					listen_dev(label, "mousedown", /*mousedown_handler*/ ctx[18], false, false, false),
    					listen_dev(label, "mouseup", /*mouseup_handler*/ ctx[19], false, false, false),
    					listen_dev(label, "mouseup", /*onMouseUp*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(label, null);
    			}

    			if (!current || dirty & /*colorStyle, fontStyle*/ 768 && label_style_value !== (label_style_value = "" + (/*colorStyle*/ ctx[9] + /*fontStyle*/ ctx[8]))) {
    				attr_dev(label, "style", label_style_value);
    			}

    			if (!current || dirty & /*position*/ 8) {
    				attr_dev(label, "data-position", /*position*/ ctx[3]);
    			}

    			if (!current || dirty & /*align*/ 16) {
    				attr_dev(label, "data-align", /*align*/ ctx[4]);
    			}

    			if (!current || dirty & /*justify*/ 32) {
    				attr_dev(label, "data-justify", /*justify*/ ctx[5]);
    			}

    			if (!current || dirty & /*isEnabled, isLink*/ 5 && label_tabindex_value !== (label_tabindex_value = /*isEnabled*/ ctx[0] && /*isLink*/ ctx[2] ? 0 : -1)) {
    				attr_dev(label, "tabindex", label_tabindex_value);
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(label, "enabled", /*isEnabled*/ ctx[0]);
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(label, "disabled", !/*isEnabled*/ ctx[0]);
    			}

    			if (dirty & /*isLink*/ 4) {
    				toggle_class(label, "link", /*isLink*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let hasContent;
    	let colorStyle;
    	let fontStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Label', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { isEnabled = true } = $$props;
    	let { text = "" } = $$props;
    	let { isLink = false } = $$props;
    	let { position = "left" } = $$props;
    	let { align = "start" } = $$props;
    	let { justify = "start" } = $$props;
    	let { indent = 0 } = $$props;
    	let { color = undefined } = $$props;
    	let { fontSize = -1 } = $$props;
    	const dispatch = createEventDispatcher();
    	let indentStyle = undefined;

    	function onMouseUp() {
    		if (isEnabled && isLink) {
    			dispatch("clicked", {});
    		}
    	}

    	const writable_props = [
    		'isEnabled',
    		'text',
    		'isLink',
    		'position',
    		'align',
    		'justify',
    		'indent',
    		'color',
    		'fontSize'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Label> was created with unknown prop '${key}'`);
    	});

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('isLink' in $$props) $$invalidate(2, isLink = $$props.isLink);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('align' in $$props) $$invalidate(4, align = $$props.align);
    		if ('justify' in $$props) $$invalidate(5, justify = $$props.justify);
    		if ('indent' in $$props) $$invalidate(11, indent = $$props.indent);
    		if ('color' in $$props) $$invalidate(12, color = $$props.color);
    		if ('fontSize' in $$props) $$invalidate(13, fontSize = $$props.fontSize);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		isEnabled,
    		text,
    		isLink,
    		position,
    		align,
    		justify,
    		indent,
    		color,
    		fontSize,
    		dispatch,
    		indentStyle,
    		onMouseUp,
    		fontStyle,
    		colorStyle,
    		hasContent
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('isLink' in $$props) $$invalidate(2, isLink = $$props.isLink);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('align' in $$props) $$invalidate(4, align = $$props.align);
    		if ('justify' in $$props) $$invalidate(5, justify = $$props.justify);
    		if ('indent' in $$props) $$invalidate(11, indent = $$props.indent);
    		if ('color' in $$props) $$invalidate(12, color = $$props.color);
    		if ('fontSize' in $$props) $$invalidate(13, fontSize = $$props.fontSize);
    		if ('indentStyle' in $$props) $$invalidate(7, indentStyle = $$props.indentStyle);
    		if ('fontStyle' in $$props) $$invalidate(8, fontStyle = $$props.fontStyle);
    		if ('colorStyle' in $$props) $$invalidate(9, colorStyle = $$props.colorStyle);
    		if ('hasContent' in $$props) $$invalidate(6, hasContent = $$props.hasContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hasContent, indent, position*/ 2120) {
    			{
    				if (hasContent && indent !== 0) {
    					if (position === "left" || position === "right") {
    						$$invalidate(7, indentStyle = `top:${indent}px;`);
    					} else if (position === "top" || position === "bottom") {
    						$$invalidate(7, indentStyle = `left:${indent}px;`);
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*color*/ 4096) {
    			$$invalidate(9, colorStyle = color ? `color:${color};` : "");
    		}

    		if ($$self.$$.dirty & /*fontSize*/ 8192) {
    			$$invalidate(8, fontStyle = fontSize > -1 ? `font-size:${fontSize}px;` : "");
    		}
    	};

    	$$invalidate(6, hasContent = "default" in $$slots);

    	return [
    		isEnabled,
    		text,
    		isLink,
    		position,
    		align,
    		justify,
    		hasContent,
    		indentStyle,
    		fontStyle,
    		colorStyle,
    		onMouseUp,
    		indent,
    		color,
    		fontSize,
    		$$scope,
    		slots,
    		mouseover_handler,
    		mouseout_handler,
    		mousedown_handler,
    		mouseup_handler
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			isEnabled: 0,
    			text: 1,
    			isLink: 2,
    			position: 3,
    			align: 4,
    			justify: 5,
    			indent: 11,
    			color: 12,
    			fontSize: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLink() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLink(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justify() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justify(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indent() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indent(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Icon.svelte generated by Svelte v3.44.2 */

    const file$f = "src\\gui\\components\\Icon.svelte";

    function create_fragment$k(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;
    	let img_height_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "icon svelte-1roqwht");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0] || `img/icons/${/*name*/ ctx[1]}.svg`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "width", img_width_value = /*size*/ ctx[5] || /*width*/ ctx[3]);
    			attr_dev(img, "height", img_height_value = /*size*/ ctx[5] || /*height*/ ctx[4]);
    			attr_dev(img, "data-component", "icon");
    			add_location(img, file$f, 36, 0, 819);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src, name*/ 3 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0] || `img/icons/${/*name*/ ctx[1]}.svg`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 4) {
    				attr_dev(img, "alt", /*alt*/ ctx[2]);
    			}

    			if (dirty & /*size, width*/ 40 && img_width_value !== (img_width_value = /*size*/ ctx[5] || /*width*/ ctx[3])) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (dirty & /*size, height*/ 48 && img_height_value !== (img_height_value = /*size*/ ctx[5] || /*height*/ ctx[4])) {
    				attr_dev(img, "height", img_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const preload = filename => {
    	const img = new Image();
    	img.src = `img/icons/${filename}`;
    };

    [
    	"circle.svg",
    	"cross.svg",
    	"increment-down.svg",
    	"increment-up.svg",
    	"next-frame.svg",
    	"pause.svg",
    	"play.svg",
    	"prev-frame.svg",
    	"record.svg",
    	"search.svg",
    	"select.svg",
    	"stop.svg",
    	"tick.svg"
    ].forEach(filename => preload(filename));

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { src = undefined } = $$props;
    	let { name = undefined } = $$props;
    	let { alt = undefined } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { size = undefined } = $$props;
    	const writable_props = ['src', 'name', 'alt', 'width', 'height', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('alt' in $$props) $$invalidate(2, alt = $$props.alt);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('size' in $$props) $$invalidate(5, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		preload,
    		src,
    		name,
    		alt,
    		width,
    		height,
    		size
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('alt' in $$props) $$invalidate(2, alt = $$props.alt);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('size' in $$props) $$invalidate(5, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, name, alt, width, height, size];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			src: 0,
    			name: 1,
    			alt: 2,
    			width: 3,
    			height: 4,
    			size: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get src() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Button.svelte generated by Svelte v3.44.2 */
    const file$e = "src\\gui\\components\\Button.svelte";

    function create_fragment$j(ctx) {
    	let button;
    	let div;
    	let button_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[30].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[29], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content svelte-1wz7pjc");
    			attr_dev(div, "style", /*style*/ ctx[8]);
    			attr_dev(div, "data-component", "button-content");
    			add_location(div, file$e, 401, 3, 9391);
    			attr_dev(button, "class", "button svelte-1wz7pjc");
    			attr_dev(button, "data-type", /*type*/ ctx[4]);
    			attr_dev(button, "data-cantoggle", /*canToggle*/ ctx[2]);
    			attr_dev(button, "tabindex", button_tabindex_value = /*isEnabled*/ ctx[1] && /*canFocus*/ ctx[6] ? 0 : -1);
    			attr_dev(button, "data-component", "button");
    			toggle_class(button, "enabled", /*isEnabled*/ ctx[1]);
    			toggle_class(button, "disabled", !/*isEnabled*/ ctx[1]);
    			toggle_class(button, "isDown", /*isDown*/ ctx[0]);
    			toggle_class(button, "round", /*appearance*/ ctx[3] === 'round');
    			toggle_class(button, "noStyle", /*noStyle*/ ctx[5]);
    			toggle_class(button, "noFocus", !/*canFocus*/ ctx[6]);
    			add_location(button, file$e, 377, 0, 8844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*button_binding*/ ctx[39](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "change", /*change_handler*/ ctx[31], false, false, false),
    					listen_dev(button, "mousedown", /*mousedown_handler*/ ctx[32], false, false, false),
    					listen_dev(button, "mousedown", /*onMouseDown*/ ctx[9], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[33], false, false, false),
    					listen_dev(button, "mouseout", /*mouseout_handler*/ ctx[34], false, false, false),
    					listen_dev(button, "focus", /*focus_handler*/ ctx[35], false, false, false),
    					listen_dev(button, "blur", /*blur_handler*/ ctx[36], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[37], false, false, false),
    					listen_dev(button, "keydown", /*onKeyDown*/ ctx[10], false, false, false),
    					listen_dev(button, "keyup", /*keyup_handler*/ ctx[38], false, false, false),
    					listen_dev(button, "keyup", /*onKeyUp*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[29],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[29])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[29], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*style*/ 256) {
    				attr_dev(div, "style", /*style*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*type*/ 16) {
    				attr_dev(button, "data-type", /*type*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*canToggle*/ 4) {
    				attr_dev(button, "data-cantoggle", /*canToggle*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*isEnabled, canFocus*/ 66 && button_tabindex_value !== (button_tabindex_value = /*isEnabled*/ ctx[1] && /*canFocus*/ ctx[6] ? 0 : -1)) {
    				attr_dev(button, "tabindex", button_tabindex_value);
    			}

    			if (dirty[0] & /*isEnabled*/ 2) {
    				toggle_class(button, "enabled", /*isEnabled*/ ctx[1]);
    			}

    			if (dirty[0] & /*isEnabled*/ 2) {
    				toggle_class(button, "disabled", !/*isEnabled*/ ctx[1]);
    			}

    			if (dirty[0] & /*isDown*/ 1) {
    				toggle_class(button, "isDown", /*isDown*/ ctx[0]);
    			}

    			if (dirty[0] & /*appearance*/ 8) {
    				toggle_class(button, "round", /*appearance*/ ctx[3] === 'round');
    			}

    			if (dirty[0] & /*noStyle*/ 32) {
    				toggle_class(button, "noStyle", /*noStyle*/ ctx[5]);
    			}

    			if (dirty[0] & /*canFocus*/ 64) {
    				toggle_class(button, "noFocus", !/*canFocus*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[39](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const defaultLongPressDuration = 500;

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { isEnabled = true } = $$props;
    	let { canToggle = false } = $$props;
    	let { isControlled = false } = $$props;
    	let { hasToggleLock = false } = $$props;
    	let { isDown = false } = $$props;
    	let { appearance = "box" } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { padding = -1 } = $$props;
    	let { type = "button" } = $$props;
    	let { longPressDuration = defaultLongPressDuration } = $$props;
    	let { noStyle = false } = $$props;
    	let { customClasses = {} } = $$props;
    	let { onShouldClose = undefined } = $$props;
    	let { action = undefined } = $$props;
    	let { canFocus = true } = $$props;
    	const dispatch = createEventDispatcher();
    	let buttonEl;
    	let pressTimeout;
    	let isToggleDown = isDown;
    	let style = undefined;

    	function focus() {
    		buttonEl.focus();
    	}

    	function blur() {
    		buttonEl.blur();
    	}

    	function click() {
    		onMouseDown();
    	}

    	function containsEvent(node) {
    		return buttonEl.contains(node);
    	}

    	function setIsDown(value) {
    		$$invalidate(0, isDown = value);
    		isToggleDown = value;

    		if (value === false) {
    			clearCustomClasses();
    			window.removeEventListener("mouseup", onMouseUp);
    		} else {
    			applyCustomDownStyle();
    			buttonEl.focus();
    		}
    	}

    	function getIsDown() {
    		return { isDown, isToggleDown };
    	}

    	function clearCustomClasses() {
    		if (customClasses.down) {
    			buttonEl.classList.remove(customClasses.down);
    		}
    	}

    	function applyCustomDownStyle() {
    		if (customClasses.down) {
    			buttonEl.classList.add(customClasses.down);
    		}
    	}

    	Action.notifications.on("execute", cmd => {
    		if (cmd === action) {
    			if (canToggle) {
    				if (isDown === isToggleDown && isDown !== cmd.isChecked) {
    					setIsDown(cmd.isChecked);
    				}
    			} else {
    				setIsDown(true);

    				const onKeyUp = () => {
    					setIsDown(false);
    					window.removeEventListener("keyup", onKeyUp);
    				};

    				window.addEventListener("keyup", onKeyUp);
    			}
    		}
    	});

    	function down() {
    		$$invalidate(0, isDown = true);
    		applyCustomDownStyle();
    		dispatch("down");

    		if (action) {
    			action.execute();
    		}
    	}

    	function up() {
    		$$invalidate(0, isDown = false);
    		clearCustomClasses();
    		dispatch("up");

    		if (canToggle && action) {
    			action.execute();
    		}
    	}

    	const onMouseDown = () => {
    		if (isEnabled) {
    			buttonEl.focus();

    			if (canToggle) {
    				dispatch("push");

    				if (!isDown) {
    					isToggleDown = false;
    					down();
    				}
    			} else {
    				dispatch("push");
    				down();
    			}

    			window.addEventListener("mouseup", onMouseUp);

    			pressTimeout = setTimeout(
    				() => {
    					dispatch("longpress");
    				},
    				longPressDuration
    			);
    		}
    	};

    	const onMouseUp = e => {
    		if (canToggle) {
    			if (isToggleDown) {
    				if (isDown && !hasToggleLock) {
    					const shouldClose = onShouldClose ? onShouldClose() : true;

    					if (!shouldClose) {
    						// console.log("should not close");
    						return;
    					}

    					isToggleDown = false;
    					up();
    					dispatch("toggle", false);
    					dispatch("change", false);

    					if (containsEvent(e.target)) {
    						dispatch("click");
    					}
    				}
    			} else {
    				isToggleDown = true;
    				dispatch("toggle", true);
    				dispatch("change", true);

    				if (containsEvent(e.target)) {
    					dispatch("click");
    				}
    			}
    		} else {
    			if (!isControlled) {
    				up();

    				if (containsEvent(e.target)) {
    					dispatch("click");
    				}
    			}
    		}

    		window.removeEventListener("mouseup", onMouseUp);
    		dispatch("mouseup");
    		clearTimeout(pressTimeout);
    	};

    	const onKeyDown = e => {
    		if (isEnabled) {
    			const { key } = e;

    			if (!isDown && isAcceptKey(key)) {
    				onMouseDown();
    			}

    			if (isAcceptKey(key) || isArrowKey(key)) {
    				e.preventDefault();
    			}
    		}
    	};

    	const onKeyUp = e => {
    		if (isEnabled) {
    			const { key } = e;

    			if (isAcceptKey(key)) {
    				onMouseUp(e);
    			}

    			if (e.key === "Escape") {
    				buttonEl.blur();
    			}
    		}
    	};

    	const writable_props = [
    		'isEnabled',
    		'canToggle',
    		'isControlled',
    		'hasToggleLock',
    		'isDown',
    		'appearance',
    		'width',
    		'height',
    		'padding',
    		'type',
    		'longPressDuration',
    		'noStyle',
    		'customClasses',
    		'onShouldClose',
    		'action',
    		'canFocus'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonEl = $$value;
    			$$invalidate(7, buttonEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('canToggle' in $$props) $$invalidate(2, canToggle = $$props.canToggle);
    		if ('isControlled' in $$props) $$invalidate(12, isControlled = $$props.isControlled);
    		if ('hasToggleLock' in $$props) $$invalidate(13, hasToggleLock = $$props.hasToggleLock);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('appearance' in $$props) $$invalidate(3, appearance = $$props.appearance);
    		if ('width' in $$props) $$invalidate(14, width = $$props.width);
    		if ('height' in $$props) $$invalidate(15, height = $$props.height);
    		if ('padding' in $$props) $$invalidate(16, padding = $$props.padding);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('longPressDuration' in $$props) $$invalidate(17, longPressDuration = $$props.longPressDuration);
    		if ('noStyle' in $$props) $$invalidate(5, noStyle = $$props.noStyle);
    		if ('customClasses' in $$props) $$invalidate(18, customClasses = $$props.customClasses);
    		if ('onShouldClose' in $$props) $$invalidate(19, onShouldClose = $$props.onShouldClose);
    		if ('action' in $$props) $$invalidate(20, action = $$props.action);
    		if ('canFocus' in $$props) $$invalidate(6, canFocus = $$props.canFocus);
    		if ('$$scope' in $$props) $$invalidate(29, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		defaultLongPressDuration,
    		createEventDispatcher,
    		isAcceptKey,
    		isArrowKey,
    		Action,
    		isEnabled,
    		canToggle,
    		isControlled,
    		hasToggleLock,
    		isDown,
    		appearance,
    		width,
    		height,
    		padding,
    		type,
    		longPressDuration,
    		noStyle,
    		customClasses,
    		onShouldClose,
    		action,
    		canFocus,
    		dispatch,
    		buttonEl,
    		pressTimeout,
    		isToggleDown,
    		style,
    		focus,
    		blur,
    		click,
    		containsEvent,
    		setIsDown,
    		getIsDown,
    		clearCustomClasses,
    		applyCustomDownStyle,
    		down,
    		up,
    		onMouseDown,
    		onMouseUp,
    		onKeyDown,
    		onKeyUp
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('canToggle' in $$props) $$invalidate(2, canToggle = $$props.canToggle);
    		if ('isControlled' in $$props) $$invalidate(12, isControlled = $$props.isControlled);
    		if ('hasToggleLock' in $$props) $$invalidate(13, hasToggleLock = $$props.hasToggleLock);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('appearance' in $$props) $$invalidate(3, appearance = $$props.appearance);
    		if ('width' in $$props) $$invalidate(14, width = $$props.width);
    		if ('height' in $$props) $$invalidate(15, height = $$props.height);
    		if ('padding' in $$props) $$invalidate(16, padding = $$props.padding);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('longPressDuration' in $$props) $$invalidate(17, longPressDuration = $$props.longPressDuration);
    		if ('noStyle' in $$props) $$invalidate(5, noStyle = $$props.noStyle);
    		if ('customClasses' in $$props) $$invalidate(18, customClasses = $$props.customClasses);
    		if ('onShouldClose' in $$props) $$invalidate(19, onShouldClose = $$props.onShouldClose);
    		if ('action' in $$props) $$invalidate(20, action = $$props.action);
    		if ('canFocus' in $$props) $$invalidate(6, canFocus = $$props.canFocus);
    		if ('buttonEl' in $$props) $$invalidate(7, buttonEl = $$props.buttonEl);
    		if ('pressTimeout' in $$props) pressTimeout = $$props.pressTimeout;
    		if ('isToggleDown' in $$props) isToggleDown = $$props.isToggleDown;
    		if ('style' in $$props) $$invalidate(8, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*width, height, padding*/ 114688) {
    			{
    				let css = "";
    				if (width) css += `width: ${width}px;`;
    				if (height) css += `height: ${height}px;`;
    				if (padding > -1) css += `padding: ${padding}px;`;
    				$$invalidate(8, style = css || undefined);
    			}
    		}
    	};

    	return [
    		isDown,
    		isEnabled,
    		canToggle,
    		appearance,
    		type,
    		noStyle,
    		canFocus,
    		buttonEl,
    		style,
    		onMouseDown,
    		onKeyDown,
    		onKeyUp,
    		isControlled,
    		hasToggleLock,
    		width,
    		height,
    		padding,
    		longPressDuration,
    		customClasses,
    		onShouldClose,
    		action,
    		focus,
    		blur,
    		click,
    		containsEvent,
    		setIsDown,
    		getIsDown,
    		clearCustomClasses,
    		applyCustomDownStyle,
    		$$scope,
    		slots,
    		change_handler,
    		mousedown_handler,
    		mouseover_handler,
    		mouseout_handler,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		keyup_handler,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				isEnabled: 1,
    				canToggle: 2,
    				isControlled: 12,
    				hasToggleLock: 13,
    				isDown: 0,
    				appearance: 3,
    				width: 14,
    				height: 15,
    				padding: 16,
    				type: 4,
    				longPressDuration: 17,
    				noStyle: 5,
    				customClasses: 18,
    				onShouldClose: 19,
    				action: 20,
    				canFocus: 6,
    				focus: 21,
    				blur: 22,
    				click: 23,
    				containsEvent: 24,
    				setIsDown: 25,
    				getIsDown: 26,
    				clearCustomClasses: 27,
    				applyCustomDownStyle: 28
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canToggle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canToggle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isControlled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isControlled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasToggleLock() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasToggleLock(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDown() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDown(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appearance() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appearance(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get longPressDuration() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set longPressDuration(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noStyle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noStyle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onShouldClose() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onShouldClose(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canFocus() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canFocus(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[21];
    	}

    	set focus(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[22];
    	}

    	set blur(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get click() {
    		return this.$$.ctx[23];
    	}

    	set click(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containsEvent() {
    		return this.$$.ctx[24];
    	}

    	set containsEvent(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setIsDown() {
    		return this.$$.ctx[25];
    	}

    	set setIsDown(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getIsDown() {
    		return this.$$.ctx[26];
    	}

    	set getIsDown(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearCustomClasses() {
    		return this.$$.ctx[27];
    	}

    	set clearCustomClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get applyCustomDownStyle() {
    		return this.$$.ctx[28];
    	}

    	set applyCustomDownStyle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\PushButton.svelte generated by Svelte v3.44.2 */

    // (49:2) {#if label}
    function create_if_block_1$5(ctx) {
    	let label_1;
    	let current;

    	label_1 = new Label({
    			props: { text: /*label*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_1_changes = {};
    			if (dirty & /*label*/ 16) label_1_changes.text = /*label*/ ctx[4];
    			label_1.$set(label_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(49:2) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (52:2) {#if iconSrc || iconName}
    function create_if_block$b(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: /*iconSrc*/ ctx[5],
    				name: /*iconName*/ ctx[6],
    				width: /*iconSize*/ ctx[9] > -1
    				? /*iconSize*/ ctx[9]
    				: /*iconWidth*/ ctx[7],
    				height: /*iconSize*/ ctx[9] > -1
    				? /*iconSize*/ ctx[9]
    				: /*iconHeight*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*iconSrc*/ 32) icon_changes.src = /*iconSrc*/ ctx[5];
    			if (dirty & /*iconName*/ 64) icon_changes.name = /*iconName*/ ctx[6];

    			if (dirty & /*iconSize, iconWidth*/ 640) icon_changes.width = /*iconSize*/ ctx[9] > -1
    			? /*iconSize*/ ctx[9]
    			: /*iconWidth*/ ctx[7];

    			if (dirty & /*iconSize, iconHeight*/ 768) icon_changes.height = /*iconSize*/ ctx[9] > -1
    			? /*iconSize*/ ctx[9]
    			: /*iconHeight*/ ctx[8];

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(52:2) {#if iconSrc || iconName}",
    		ctx
    	});

    	return block;
    }

    // (24:0) <Button    type="pushbutton"    {...{      isEnabled,      canToggle,      isDown,      isControlled,      noStyle,      action,      padding,      canFocus,    }}    appearance="{isRound ? 'round' : 'box'}"    on:mousedown    on:mouseup    on:keydown    on:keyup    on:change    on:down    on:up    on:longpress    on:toggle    on:push    on:click    on:change>
    function create_default_slot$9(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*label*/ ctx[4] && create_if_block_1$5(ctx);
    	let if_block1 = (/*iconSrc*/ ctx[5] || /*iconName*/ ctx[6]) && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*label*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*label*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*iconSrc*/ ctx[5] || /*iconName*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*iconSrc, iconName*/ 96) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(24:0) <Button    type=\\\"pushbutton\\\"    {...{      isEnabled,      canToggle,      isDown,      isControlled,      noStyle,      action,      padding,      canFocus,    }}    appearance=\\\"{isRound ? 'round' : 'box'}\\\"    on:mousedown    on:mouseup    on:keydown    on:keyup    on:change    on:down    on:up    on:longpress    on:toggle    on:push    on:click    on:change>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let button;
    	let current;

    	const button_spread_levels = [
    		{ type: "pushbutton" },
    		{
    			isEnabled: /*isEnabled*/ ctx[0],
    			canToggle: /*canToggle*/ ctx[1],
    			isDown: /*isDown*/ ctx[3],
    			isControlled: /*isControlled*/ ctx[2],
    			noStyle: /*noStyle*/ ctx[10],
    			action: /*action*/ ctx[12],
    			padding: /*padding*/ ctx[13],
    			canFocus: /*canFocus*/ ctx[14]
    		},
    		{
    			appearance: /*isRound*/ ctx[11] ? 'round' : 'box'
    		}
    	];

    	let button_props = {
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < button_spread_levels.length; i += 1) {
    		button_props = assign(button_props, button_spread_levels[i]);
    	}

    	button = new Button({ props: button_props, $$inline: true });
    	button.$on("mousedown", /*mousedown_handler*/ ctx[15]);
    	button.$on("mouseup", /*mouseup_handler*/ ctx[16]);
    	button.$on("keydown", /*keydown_handler*/ ctx[17]);
    	button.$on("keyup", /*keyup_handler*/ ctx[18]);
    	button.$on("change", /*change_handler*/ ctx[19]);
    	button.$on("down", /*down_handler*/ ctx[20]);
    	button.$on("up", /*up_handler*/ ctx[21]);
    	button.$on("longpress", /*longpress_handler*/ ctx[22]);
    	button.$on("toggle", /*toggle_handler*/ ctx[23]);
    	button.$on("push", /*push_handler*/ ctx[24]);
    	button.$on("click", /*click_handler*/ ctx[25]);
    	button.$on("change", /*change_handler_1*/ ctx[26]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = (dirty & /*isEnabled, canToggle, isDown, isControlled, noStyle, action, padding, canFocus, isRound*/ 31759)
    			? get_spread_update(button_spread_levels, [
    					button_spread_levels[0],
    					dirty & /*isEnabled, canToggle, isDown, isControlled, noStyle, action, padding, canFocus*/ 29711 && {
    						isEnabled: /*isEnabled*/ ctx[0],
    						canToggle: /*canToggle*/ ctx[1],
    						isDown: /*isDown*/ ctx[3],
    						isControlled: /*isControlled*/ ctx[2],
    						noStyle: /*noStyle*/ ctx[10],
    						action: /*action*/ ctx[12],
    						padding: /*padding*/ ctx[13],
    						canFocus: /*canFocus*/ ctx[14]
    					},
    					dirty & /*isRound*/ 2048 && {
    						appearance: /*isRound*/ ctx[11] ? 'round' : 'box'
    					}
    				])
    			: {};

    			if (dirty & /*$$scope, iconSrc, iconName, iconSize, iconWidth, iconHeight, label*/ 134218736) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PushButton', slots, []);
    	let { isEnabled = true } = $$props;
    	let { canToggle = false } = $$props;
    	let { isControlled = false } = $$props;
    	let { isDown = false } = $$props;
    	let { label = undefined } = $$props;
    	let { iconSrc = undefined } = $$props;
    	let { iconName = undefined } = $$props;
    	let { iconWidth = 14 } = $$props;
    	let { iconHeight = 14 } = $$props;
    	let { iconSize = -1 } = $$props;
    	let { noStyle = false } = $$props;
    	let { isRound = false } = $$props;
    	let { action = undefined } = $$props;
    	let { padding = -1 } = $$props;
    	let { canFocus = true } = $$props;

    	const writable_props = [
    		'isEnabled',
    		'canToggle',
    		'isControlled',
    		'isDown',
    		'label',
    		'iconSrc',
    		'iconName',
    		'iconWidth',
    		'iconHeight',
    		'iconSize',
    		'noStyle',
    		'isRound',
    		'action',
    		'padding',
    		'canFocus'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PushButton> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function down_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function up_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function longpress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function toggle_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function push_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('canToggle' in $$props) $$invalidate(1, canToggle = $$props.canToggle);
    		if ('isControlled' in $$props) $$invalidate(2, isControlled = $$props.isControlled);
    		if ('isDown' in $$props) $$invalidate(3, isDown = $$props.isDown);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('iconSrc' in $$props) $$invalidate(5, iconSrc = $$props.iconSrc);
    		if ('iconName' in $$props) $$invalidate(6, iconName = $$props.iconName);
    		if ('iconWidth' in $$props) $$invalidate(7, iconWidth = $$props.iconWidth);
    		if ('iconHeight' in $$props) $$invalidate(8, iconHeight = $$props.iconHeight);
    		if ('iconSize' in $$props) $$invalidate(9, iconSize = $$props.iconSize);
    		if ('noStyle' in $$props) $$invalidate(10, noStyle = $$props.noStyle);
    		if ('isRound' in $$props) $$invalidate(11, isRound = $$props.isRound);
    		if ('action' in $$props) $$invalidate(12, action = $$props.action);
    		if ('padding' in $$props) $$invalidate(13, padding = $$props.padding);
    		if ('canFocus' in $$props) $$invalidate(14, canFocus = $$props.canFocus);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Label,
    		Icon,
    		isEnabled,
    		canToggle,
    		isControlled,
    		isDown,
    		label,
    		iconSrc,
    		iconName,
    		iconWidth,
    		iconHeight,
    		iconSize,
    		noStyle,
    		isRound,
    		action,
    		padding,
    		canFocus
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('canToggle' in $$props) $$invalidate(1, canToggle = $$props.canToggle);
    		if ('isControlled' in $$props) $$invalidate(2, isControlled = $$props.isControlled);
    		if ('isDown' in $$props) $$invalidate(3, isDown = $$props.isDown);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('iconSrc' in $$props) $$invalidate(5, iconSrc = $$props.iconSrc);
    		if ('iconName' in $$props) $$invalidate(6, iconName = $$props.iconName);
    		if ('iconWidth' in $$props) $$invalidate(7, iconWidth = $$props.iconWidth);
    		if ('iconHeight' in $$props) $$invalidate(8, iconHeight = $$props.iconHeight);
    		if ('iconSize' in $$props) $$invalidate(9, iconSize = $$props.iconSize);
    		if ('noStyle' in $$props) $$invalidate(10, noStyle = $$props.noStyle);
    		if ('isRound' in $$props) $$invalidate(11, isRound = $$props.isRound);
    		if ('action' in $$props) $$invalidate(12, action = $$props.action);
    		if ('padding' in $$props) $$invalidate(13, padding = $$props.padding);
    		if ('canFocus' in $$props) $$invalidate(14, canFocus = $$props.canFocus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isEnabled,
    		canToggle,
    		isControlled,
    		isDown,
    		label,
    		iconSrc,
    		iconName,
    		iconWidth,
    		iconHeight,
    		iconSize,
    		noStyle,
    		isRound,
    		action,
    		padding,
    		canFocus,
    		mousedown_handler,
    		mouseup_handler,
    		keydown_handler,
    		keyup_handler,
    		change_handler,
    		down_handler,
    		up_handler,
    		longpress_handler,
    		toggle_handler,
    		push_handler,
    		click_handler,
    		change_handler_1
    	];
    }

    class PushButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			isEnabled: 0,
    			canToggle: 1,
    			isControlled: 2,
    			isDown: 3,
    			label: 4,
    			iconSrc: 5,
    			iconName: 6,
    			iconWidth: 7,
    			iconHeight: 8,
    			iconSize: 9,
    			noStyle: 10,
    			isRound: 11,
    			action: 12,
    			padding: 13,
    			canFocus: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PushButton",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canToggle() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canToggle(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isControlled() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isControlled(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDown() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDown(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconSrc() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconSrc(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconWidth() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconWidth(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconHeight() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconHeight(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconSize() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconSize(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noStyle() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noStyle(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRound() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRound(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canFocus() {
    		throw new Error("<PushButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canFocus(value) {
    		throw new Error("<PushButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\TabView.svelte generated by Svelte v3.44.2 */
    const file$d = "src\\gui\\components\\TabView.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].title;
    	child_ctx[11] = list[i].isClosable;
    	child_ctx[12] = list[i].icon;
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (150:8) {#if icon}
    function create_if_block_1$4(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: /*icon*/ ctx[12], height: 16 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*tabs*/ 4) icon_changes.src = /*icon*/ ctx[12];
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(150:8) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (154:8) {#if isClosable}
    function create_if_block$a(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: {
    				iconSrc: "img/icons/cross.svg",
    				iconSize: 10,
    				padding: 2,
    				canFocus: false
    			},
    			$$inline: true
    		});

    	pushbutton.$on("click", function () {
    		if (is_function(/*onCloseClick*/ ctx[4](/*i*/ ctx[14]))) /*onCloseClick*/ ctx[4](/*i*/ ctx[14]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(154:8) {#if isClosable}",
    		ctx
    	});

    	return block;
    }

    // (145:4) {#each tabs as { title, isClosable, icon }
    function create_each_block$5(key_1, ctx) {
    	let li;
    	let t0;
    	let label;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*icon*/ ctx[12] && create_if_block_1$4(ctx);

    	label = new Label({
    			props: { text: /*title*/ ctx[10] },
    			$$inline: true
    		});

    	let if_block1 = /*isClosable*/ ctx[11] && create_if_block$a(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(label.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(li, "class", "tabview-tab svelte-1ptz0c3");
    			toggle_class(li, "selected", /*i*/ ctx[14] === /*selectedIndex*/ ctx[0]);
    			add_location(li, file$d, 145, 6, 3656);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t0);
    			mount_component(label, li, null);
    			append_dev(li, t1);
    			if (if_block1) if_block1.m(li, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					li,
    					"mousedown",
    					function () {
    						if (is_function(/*onMouseDown*/ ctx[3](/*i*/ ctx[14]))) /*onMouseDown*/ ctx[3](/*i*/ ctx[14]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*icon*/ ctx[12]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*tabs*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(li, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const label_changes = {};
    			if (dirty & /*tabs*/ 4) label_changes.text = /*title*/ ctx[10];
    			label.$set(label_changes);

    			if (/*isClosable*/ ctx[11]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*tabs*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(li, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*tabs, selectedIndex*/ 5) {
    				toggle_class(li, "selected", /*i*/ ctx[14] === /*selectedIndex*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(label.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(label.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			destroy_component(label);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(145:4) {#each tabs as { title, isClosable, icon }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let li;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*tabs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[14];
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			li = element("li");
    			t1 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(li, "class", "tabview-spacer svelte-1ptz0c3");
    			add_location(li, file$d, 163, 4, 4166);
    			attr_dev(ul, "class", "svelte-1ptz0c3");
    			add_location(ul, file$d, 143, 2, 3588);
    			attr_dev(div0, "class", "tabview-content svelte-1ptz0c3");
    			add_location(div0, file$d, 165, 2, 4211);
    			attr_dev(div1, "class", "tabview svelte-1ptz0c3");
    			attr_dev(div1, "data-component", "tabview");
    			toggle_class(div1, "document", /*appearance*/ ctx[1] === 'document');
    			toggle_class(div1, "tool", /*appearance*/ ctx[1] === 'tool');
    			add_location(div1, file$d, 138, 0, 3444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t0);
    			append_dev(ul, li);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tabs, selectedIndex, onMouseDown, onCloseClick*/ 29) {
    				each_value = /*tabs*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$5, t0, get_each_context$5);
    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*appearance*/ 2) {
    				toggle_class(div1, "document", /*appearance*/ ctx[1] === 'document');
    			}

    			if (dirty & /*appearance*/ 2) {
    				toggle_class(div1, "tool", /*appearance*/ ctx[1] === 'tool');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabView', slots, ['default']);
    	let { selectedIndex = 0 } = $$props;
    	let { appearance = "document" } = $$props;
    	const dispatch = createEventDispatcher();
    	let tabs = [];
    	const id = nextId();
    	const notifications = new eventemitter3();

    	setContext("tabs", {
    		registerTab(tabDoc) {
    			$$invalidate(2, tabs = [...tabs, tabDoc]);

    			if (selectedIndex === -1) {
    				$$invalidate(0, selectedIndex = 0);
    			}

    			return tabs.length - 1;
    		},
    		unregisterTab(index) {
    			tabs.splice(index, 1);
    			$$invalidate(2, tabs = [...tabs]);
    		},
    		isVisible(index) {
    			return selectedIndex === index;
    		},
    		notifications
    	});

    	const onMouseDown = i => e => {
    		if (selectedIndex !== i) {
    			$$invalidate(0, selectedIndex = i);
    			notifications.emit("change");
    			dispatch("change", selectedIndex);
    		}
    	};

    	const onCloseClick = index => () => {
    		const onCanClose = tabs[index].onCanClose;

    		if (onCanClose) {
    			const canClose = onCanClose(index);

    			if (!canClose) {
    				return;
    			}
    		}

    		dispatch("closing", index);
    		tabs.splice(index, 1);
    		$$invalidate(2, tabs = [...tabs]);

    		if (selectedIndex === tabs.length) {
    			$$invalidate(0, selectedIndex--, selectedIndex);
    		}

    		notifications.emit("change");
    	};

    	const writable_props = ['selectedIndex', 'appearance'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('appearance' in $$props) $$invalidate(1, appearance = $$props.appearance);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		createEventDispatcher,
    		EventEmitter: eventemitter3,
    		nextId,
    		Label,
    		Icon,
    		PushButton,
    		selectedIndex,
    		appearance,
    		dispatch,
    		tabs,
    		id,
    		notifications,
    		onMouseDown,
    		onCloseClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('appearance' in $$props) $$invalidate(1, appearance = $$props.appearance);
    		if ('tabs' in $$props) $$invalidate(2, tabs = $$props.tabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedIndex, appearance, tabs, onMouseDown, onCloseClick, $$scope, slots];
    }

    class TabView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { selectedIndex: 0, appearance: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabView",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get selectedIndex() {
    		throw new Error("<TabView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<TabView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appearance() {
    		throw new Error("<TabView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appearance(value) {
    		throw new Error("<TabView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let id = 0;
    function nextId() {
        return ++id;
    }

    /* src\gui\components\ButtonGroup.svelte generated by Svelte v3.44.2 */
    const file$c = "src\\gui\\components\\ButtonGroup.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].icon;
    	child_ctx[9] = list[i].label;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (88:2) {#each options as { icon, label }
    function create_each_block$4(ctx) {
    	let li;
    	let pushbutton;
    	let t;
    	let current;

    	pushbutton = new PushButton({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[1],
    				isDown: /*selectedIndex*/ ctx[0] === /*index*/ ctx[11],
    				isControlled: true,
    				label: /*label*/ ctx[9],
    				iconSrc: /*icon*/ ctx[8]
    			},
    			$$inline: true
    		});

    	pushbutton.$on("keydown", /*onButtonKeyDown*/ ctx[4](/*index*/ ctx[11]));
    	pushbutton.$on("push", /*onButtonDown*/ ctx[3](/*index*/ ctx[11]));

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(pushbutton.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "svelte-1qku9h3");
    			add_location(li, file$c, 88, 4, 2269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(pushbutton, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pushbutton_changes = {};
    			if (dirty & /*isEnabled*/ 2) pushbutton_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*selectedIndex*/ 1) pushbutton_changes.isDown = /*selectedIndex*/ ctx[0] === /*index*/ ctx[11];
    			if (dirty & /*options*/ 4) pushbutton_changes.label = /*label*/ ctx[9];
    			if (dirty & /*options*/ 4) pushbutton_changes.iconSrc = /*icon*/ ctx[8];
    			pushbutton.$set(pushbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(pushbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(88:2) {#each options as { icon, label }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let ul;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "buttongroup svelte-1qku9h3");
    			attr_dev(ul, "data-component", "buttongroup");
    			add_location(ul, file$c, 86, 0, 2165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isEnabled, selectedIndex, options, onButtonKeyDown, onButtonDown*/ 31) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonGroup', slots, []);
    	let { isEnabled = true } = $$props;
    	let { options = [] } = $$props;
    	let { selectedIndex = -1 } = $$props;
    	let { canReset = false } = $$props;
    	const dispatch = createEventDispatcher();

    	function dispatchChange() {
    		dispatch("change", {
    			selectedIndex,
    			selectedValue: selectedIndex === -1
    			? undefined
    			: options[selectedIndex].name
    		});
    	}

    	const onButtonDown = index => function onButtonDown() {
    		if (selectedIndex == index) {
    			if (canReset) {
    				$$invalidate(0, selectedIndex = -1);
    				dispatchChange();
    			}
    		} else {
    			$$invalidate(0, selectedIndex = index);
    			dispatchChange();
    		}
    	};

    	const onButtonKeyDown = index => function onButtonKeyDown(e) {
    		if (selectedIndex == index) {
    			if (canReset) {
    				$$invalidate(0, selectedIndex = -1);
    				dispatchChange();
    				e.stopImmediatePropagation();
    			}
    		}
    	};

    	const writable_props = ['isEnabled', 'options', 'selectedIndex', 'canReset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('canReset' in $$props) $$invalidate(5, canReset = $$props.canReset);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		PushButton,
    		isEnabled,
    		options,
    		selectedIndex,
    		canReset,
    		dispatch,
    		dispatchChange,
    		onButtonDown,
    		onButtonKeyDown
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('canReset' in $$props) $$invalidate(5, canReset = $$props.canReset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedIndex, isEnabled, options, onButtonDown, onButtonKeyDown, canReset];
    }

    class ButtonGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			isEnabled: 1,
    			options: 2,
    			selectedIndex: 0,
    			canReset: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonGroup",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canReset() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canReset(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Checkbox.svelte generated by Svelte v3.44.2 */

    // (45:0) {:else}
    function create_else_block$2(ctx) {
    	let button_1;
    	let current;

    	button_1 = new Button({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[1],
    				isDown: /*isDown*/ ctx[0],
    				canToggle: true,
    				type: "checkbox",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button_1.$on("change", /*onButtonToggle*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(button_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_1_changes = {};
    			if (dirty & /*isEnabled*/ 2) button_1_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*isDown*/ 1) button_1_changes.isDown = /*isDown*/ ctx[0];

    			if (dirty & /*$$scope*/ 512) {
    				button_1_changes.$$scope = { dirty, ctx };
    			}

    			button_1.$set(button_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if label !== undefined}
    function create_if_block$9(ctx) {
    	let label_1;
    	let current;

    	label_1 = new Label({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[1],
    				text: /*label*/ ctx[2],
    				position: /*position*/ ctx[3],
    				align: "center",
    				justify: "center",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label_1.$on("mouseup", /*onLabelMouseUp*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(label_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_1_changes = {};
    			if (dirty & /*isEnabled*/ 2) label_1_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*label*/ 4) label_1_changes.text = /*label*/ ctx[2];
    			if (dirty & /*position*/ 8) label_1_changes.position = /*position*/ ctx[3];

    			if (dirty & /*$$scope, isEnabled, isDown, button*/ 531) {
    				label_1_changes.$$scope = { dirty, ctx };
    			}

    			label_1.$set(label_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(29:0) {#if label !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (46:2) <Button      isEnabled="{isEnabled}"      isDown="{isDown}"      canToggle="{true}"      type="checkbox"      on:change="{onButtonToggle}">
    function create_default_slot_2$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "cross", width: 12 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(46:2) <Button      isEnabled=\\\"{isEnabled}\\\"      isDown=\\\"{isDown}\\\"      canToggle=\\\"{true}\\\"      type=\\\"checkbox\\\"      on:change=\\\"{onButtonToggle}\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:4) <Button        bind:this="{button}"        isEnabled="{isEnabled}"        isDown="{isDown}"        canToggle="{true}"        type="checkbox"        on:change="{onButtonToggle}">
    function create_default_slot_1$3(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "cross", width: 12 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(37:4) <Button        bind:this=\\\"{button}\\\"        isEnabled=\\\"{isEnabled}\\\"        isDown=\\\"{isDown}\\\"        canToggle=\\\"{true}\\\"        type=\\\"checkbox\\\"        on:change=\\\"{onButtonToggle}\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:2) <Label      isEnabled="{isEnabled}"      text="{label}"      position="{position}"      align="center"      justify="center"      on:mouseup="{onLabelMouseUp}">
    function create_default_slot$8(ctx) {
    	let button_1;
    	let current;

    	let button_1_props = {
    		isEnabled: /*isEnabled*/ ctx[1],
    		isDown: /*isDown*/ ctx[0],
    		canToggle: true,
    		type: "checkbox",
    		$$slots: { default: [create_default_slot_1$3] },
    		$$scope: { ctx }
    	};

    	button_1 = new Button({ props: button_1_props, $$inline: true });
    	/*button_1_binding*/ ctx[7](button_1);
    	button_1.$on("change", /*onButtonToggle*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(button_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_1_changes = {};
    			if (dirty & /*isEnabled*/ 2) button_1_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*isDown*/ 1) button_1_changes.isDown = /*isDown*/ ctx[0];

    			if (dirty & /*$$scope*/ 512) {
    				button_1_changes.$$scope = { dirty, ctx };
    			}

    			button_1.$set(button_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*button_1_binding*/ ctx[7](null);
    			destroy_component(button_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(30:2) <Label      isEnabled=\\\"{isEnabled}\\\"      text=\\\"{label}\\\"      position=\\\"{position}\\\"      align=\\\"center\\\"      justify=\\\"center\\\"      on:mouseup=\\\"{onLabelMouseUp}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*label*/ ctx[2] !== undefined) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, []);
    	let { isEnabled = true } = $$props;
    	let { isDown = false } = $$props;
    	let { label = undefined } = $$props;
    	let { position = "left" } = $$props;
    	const dispatch = createEventDispatcher();
    	let button;

    	const onButtonToggle = event => {
    		dispatch("change", event.detail);
    		$$invalidate(0, isDown = event.detail);
    	};

    	const onLabelMouseUp = e => {
    		const isLabelClick = e.target.classList.contains("label-wrapper");

    		if (isEnabled && isLabelClick) {
    			$$invalidate(0, isDown = !isDown);
    			button.setIsDown(isDown);
    			dispatch("change", isDown);
    		}
    	};

    	const writable_props = ['isEnabled', 'isDown', 'label', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkbox> was created with unknown prop '${key}'`);
    	});

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(4, button);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		Icon,
    		Label,
    		isEnabled,
    		isDown,
    		label,
    		position,
    		dispatch,
    		button,
    		onButtonToggle,
    		onLabelMouseUp
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('button' in $$props) $$invalidate(4, button = $$props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isDown,
    		isEnabled,
    		label,
    		position,
    		button,
    		onButtonToggle,
    		onLabelMouseUp,
    		button_1_binding
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			isEnabled: 1,
    			isDown: 0,
    			label: 2,
    			position: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDown() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDown(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Radio.svelte generated by Svelte v3.44.2 */

    // (66:5) {#if isDown}
    function create_if_block$8(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "circle", width: 8 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(66:5) {#if isDown}",
    		ctx
    	});

    	return block;
    }

    // (53:3) <Button      bind:this="{button}"      isEnabled="{isEnabled}"      isDown="{isDown}"      canToggle="{true}"      hasToggleLock="{true}"      appearance="round"      type="radio"      width="{18}"      height="{18}"      padding="{0}"      on:keydown="{onButtonKeyDown}"      on:change="{onButtonChange}"      >
    function create_default_slot_1$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isDown*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isDown*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*isDown*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(53:3) <Button      bind:this=\\\"{button}\\\"      isEnabled=\\\"{isEnabled}\\\"      isDown=\\\"{isDown}\\\"      canToggle=\\\"{true}\\\"      hasToggleLock=\\\"{true}\\\"      appearance=\\\"round\\\"      type=\\\"radio\\\"      width=\\\"{18}\\\"      height=\\\"{18}\\\"      padding=\\\"{0}\\\"      on:keydown=\\\"{onButtonKeyDown}\\\"      on:change=\\\"{onButtonChange}\\\"      >",
    		ctx
    	});

    	return block;
    }

    // (46:0) <Label    isEnabled="{isEnabled}"    text="{label}"    position="{position}"    align="center"    justify="center"    on:mouseup="{onLabelMouseUp}"    >
    function create_default_slot$7(ctx) {
    	let button_1;
    	let current;

    	let button_1_props = {
    		isEnabled: /*isEnabled*/ ctx[1],
    		isDown: /*isDown*/ ctx[0],
    		canToggle: true,
    		hasToggleLock: true,
    		appearance: "round",
    		type: "radio",
    		width: 18,
    		height: 18,
    		padding: 0,
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	button_1 = new Button({ props: button_1_props, $$inline: true });
    	/*button_1_binding*/ ctx[9](button_1);
    	button_1.$on("keydown", /*onButtonKeyDown*/ ctx[7]);
    	button_1.$on("change", /*onButtonChange*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(button_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_1_changes = {};
    			if (dirty & /*isEnabled*/ 2) button_1_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*isDown*/ 1) button_1_changes.isDown = /*isDown*/ ctx[0];

    			if (dirty & /*$$scope, isDown*/ 2049) {
    				button_1_changes.$$scope = { dirty, ctx };
    			}

    			button_1.$set(button_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*button_1_binding*/ ctx[9](null);
    			destroy_component(button_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(46:0) <Label    isEnabled=\\\"{isEnabled}\\\"    text=\\\"{label}\\\"    position=\\\"{position}\\\"    align=\\\"center\\\"    justify=\\\"center\\\"    on:mouseup=\\\"{onLabelMouseUp}\\\"    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let label_1;
    	let current;

    	label_1 = new Label({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[1],
    				text: /*label*/ ctx[2],
    				position: /*position*/ ctx[3],
    				align: "center",
    				justify: "center",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label_1.$on("mouseup", /*onLabelMouseUp*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(label_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(label_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const label_1_changes = {};
    			if (dirty & /*isEnabled*/ 2) label_1_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*label*/ 4) label_1_changes.text = /*label*/ ctx[2];
    			if (dirty & /*position*/ 8) label_1_changes.position = /*position*/ ctx[3];

    			if (dirty & /*$$scope, isEnabled, isDown, button*/ 2067) {
    				label_1_changes.$$scope = { dirty, ctx };
    			}

    			label_1.$set(label_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio', slots, []);
    	let { isEnabled = true } = $$props;
    	let { label } = $$props;
    	let { isDown = false } = $$props;
    	let { index = -1 } = $$props;
    	let { position = "right" } = $$props;
    	const dispatch = createEventDispatcher();
    	let button;

    	function onButtonChange(event) {
    		if (event.detail.isDown) {
    			dispatch("pressed", { index });
    			$$invalidate(0, isDown = true);
    		}
    	}

    	function onLabelMouseUp() {
    		if (isEnabled && !isDown) {
    			button.click();
    			button.focus();
    			dispatch("pressed", { index });
    		}
    	}

    	function onButtonKeyDown(e) {
    		const { key } = e;

    		if (key == "ArrowUp" || key === "ArrowLeft") {
    			e.preventDefault();
    			dispatch("decrement");
    		} else if (key == "ArrowDown" || key === "ArrowRight") {
    			e.preventDefault();
    			dispatch("increment");
    		}
    	}

    	const writable_props = ['isEnabled', 'label', 'isDown', 'index', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Radio> was created with unknown prop '${key}'`);
    	});

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(4, button);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Label,
    		Button,
    		Icon,
    		isEnabled,
    		label,
    		isDown,
    		index,
    		position,
    		dispatch,
    		button,
    		onButtonChange,
    		onLabelMouseUp,
    		onButtonKeyDown
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('isDown' in $$props) $$invalidate(0, isDown = $$props.isDown);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('button' in $$props) $$invalidate(4, button = $$props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isDown,
    		isEnabled,
    		label,
    		position,
    		button,
    		onButtonChange,
    		onLabelMouseUp,
    		onButtonKeyDown,
    		index,
    		button_1_binding
    	];
    }

    class Radio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			isEnabled: 1,
    			label: 2,
    			isDown: 0,
    			index: 8,
    			position: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[2] === undefined && !('label' in props)) {
    			console.warn("<Radio> was created without expected prop 'label'");
    		}
    	}

    	get isEnabled() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDown() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDown(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\RadioGroup.svelte generated by Svelte v3.44.2 */
    const file$b = "src\\gui\\components\\RadioGroup.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].label;
    	child_ctx[9] = list[i].value;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (45:2) {#each options as { label, value }
    function create_each_block$3(ctx) {
    	let li;
    	let radio;
    	let t;
    	let current;

    	radio = new Radio({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[1],
    				position: /*position*/ ctx[3],
    				isDown: /*selectedIndex*/ ctx[0] === /*i*/ ctx[11],
    				label: /*label*/ ctx[8],
    				index: /*i*/ ctx[11]
    			},
    			$$inline: true
    		});

    	radio.$on("pressed", /*onPressed*/ ctx[4]);
    	radio.$on("decrement", /*onIncrement*/ ctx[5]);
    	radio.$on("increment", /*onDecrement*/ ctx[6]);

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(radio.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "svelte-1913m41");
    			add_location(li, file$b, 45, 4, 1208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(radio, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const radio_changes = {};
    			if (dirty & /*isEnabled*/ 2) radio_changes.isEnabled = /*isEnabled*/ ctx[1];
    			if (dirty & /*position*/ 8) radio_changes.position = /*position*/ ctx[3];
    			if (dirty & /*selectedIndex*/ 1) radio_changes.isDown = /*selectedIndex*/ ctx[0] === /*i*/ ctx[11];
    			if (dirty & /*options*/ 4) radio_changes.label = /*label*/ ctx[8];
    			radio.$set(radio_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(radio);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(45:2) {#each options as { label, value }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let ul;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "radiogroup svelte-1913m41");
    			attr_dev(ul, "data-component", "radiogroup");
    			add_location(ul, file$b, 43, 0, 1109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isEnabled, position, selectedIndex, options, onPressed, onIncrement, onDecrement*/ 127) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioGroup', slots, []);
    	let { isEnabled = true } = $$props;
    	let { options = [] } = $$props;
    	let { selectedIndex = -1 } = $$props;
    	let { position = "right" } = $$props;
    	const dispatch = createEventDispatcher();

    	function onPressed(event) {
    		const index = event.detail.index;

    		if (selectedIndex !== index) {
    			$$invalidate(0, selectedIndex = index);

    			dispatch("change", {
    				selectedIndex,
    				selectedValue: options[selectedIndex].value
    			});
    		}
    	}

    	function onIncrement() {
    		$$invalidate(0, selectedIndex = Math.max(0, selectedIndex - 1));

    		dispatch("change", {
    			selectedIndex,
    			selectedValue: options[selectedIndex].value
    		});
    	}

    	function onDecrement() {
    		$$invalidate(0, selectedIndex = Math.min(options.length - 1, selectedIndex + 1));

    		dispatch("change", {
    			selectedIndex,
    			selectedValue: options[selectedIndex].value
    		});
    	}

    	const writable_props = ['isEnabled', 'options', 'selectedIndex', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Radio,
    		isEnabled,
    		options,
    		selectedIndex,
    		position,
    		dispatch,
    		onPressed,
    		onIncrement,
    		onDecrement
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedIndex,
    		isEnabled,
    		options,
    		position,
    		onPressed,
    		onIncrement,
    		onDecrement
    	];
    }

    class RadioGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			isEnabled: 1,
    			options: 2,
    			selectedIndex: 0,
    			position: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioGroup",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\TextField.svelte generated by Svelte v3.44.2 */
    const file$a = "src\\gui\\components\\TextField.svelte";

    // (123:2) {#if hasContent}
    function create_if_block$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content");
    			add_location(div, file$a, 123, 4, 2919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(123:2) {#if hasContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let input_1;
    	let input_1_disabled_value;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasContent*/ ctx[6] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input_1 = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input_1, "style", /*style*/ ctx[5]);
    			input_1.disabled = input_1_disabled_value = !/*isEnabled*/ ctx[1];
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "spellcheck", "false");
    			attr_dev(input_1, "placeholder", /*placeholder*/ ctx[2]);
    			input_1.autofocus = /*autofocus*/ ctx[3];
    			attr_dev(input_1, "class", "svelte-hmham3");
    			toggle_class(input_1, "withSlot", /*hasContent*/ ctx[6]);
    			add_location(input_1, file$a, 104, 2, 2502);
    			attr_dev(div, "class", "textfield svelte-hmham3");
    			attr_dev(div, "data-component", "textfield");
    			toggle_class(div, "enabled", /*isEnabled*/ ctx[1]);
    			toggle_class(div, "disabled", !/*isEnabled*/ ctx[1]);
    			add_location(div, file$a, 98, 0, 2337);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input_1);
    			/*input_1_binding*/ ctx[19](input_1);
    			set_input_value(input_1, /*value*/ ctx[0]);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    			if (/*autofocus*/ ctx[3]) input_1.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[20]),
    					listen_dev(input_1, "keydown", /*keydown_handler*/ ctx[14], false, false, false),
    					listen_dev(input_1, "keydown", /*onKeyDown*/ ctx[7], false, false, false),
    					listen_dev(input_1, "keyup", /*keyup_handler*/ ctx[15], false, false, false),
    					listen_dev(input_1, "keyup", /*onKeyUp*/ ctx[8], false, false, false),
    					listen_dev(input_1, "paste", /*paste_handler*/ ctx[16], false, false, false),
    					listen_dev(input_1, "paste", /*onPaste*/ ctx[9], false, false, false),
    					listen_dev(input_1, "focus", /*focus_handler*/ ctx[17], false, false, false),
    					listen_dev(input_1, "blur", /*blur_handler*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*style*/ 32) {
    				attr_dev(input_1, "style", /*style*/ ctx[5]);
    			}

    			if (!current || dirty & /*isEnabled*/ 2 && input_1_disabled_value !== (input_1_disabled_value = !/*isEnabled*/ ctx[1])) {
    				prop_dev(input_1, "disabled", input_1_disabled_value);
    			}

    			if (!current || dirty & /*placeholder*/ 4) {
    				attr_dev(input_1, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (!current || dirty & /*autofocus*/ 8) {
    				prop_dev(input_1, "autofocus", /*autofocus*/ ctx[3]);
    			}

    			if (dirty & /*value*/ 1 && input_1.value !== /*value*/ ctx[0]) {
    				set_input_value(input_1, /*value*/ ctx[0]);
    			}

    			if (dirty & /*hasContent*/ 64) {
    				toggle_class(input_1, "withSlot", /*hasContent*/ ctx[6]);
    			}

    			if (/*hasContent*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hasContent*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*isEnabled*/ 2) {
    				toggle_class(div, "enabled", /*isEnabled*/ ctx[1]);
    			}

    			if (dirty & /*isEnabled*/ 2) {
    				toggle_class(div, "disabled", !/*isEnabled*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_1_binding*/ ctx[19](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let hasContent;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextField', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { isEnabled = true } = $$props;
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { width = 0 } = $$props;
    	let { autofocus = false } = $$props;
    	let { filter = undefined } = $$props;
    	const dispatch = createEventDispatcher();
    	let input;
    	let style = "";

    	function onKeyDown(e) {
    		if (filter && !isGeneralInputKey(e.key)) {
    			if (!filter(e.key, value, {
    				ctrl: e.ctrlKey,
    				shift: e.shiftKey,
    				alt: e.altKey,
    				cmd: e.metaKey
    			})) {
    				e.preventDefault();
    			}
    		}
    	}

    	function onKeyUp(e) {
    		const { key } = e;

    		if (key === "Enter") {
    			dispatch("accept", value);
    			input.blur();
    		} else if (key === "Escape") {
    			input.blur();
    		} else if (!isGeneralInputKey(key)) {
    			dispatch("change", value);
    		}
    	}

    	function onPaste(e) {
    		if (filter) {
    			const data = e.clipboardData.getData("text");

    			if (data.length) {
    				for (let i = 0; i < data.length; i++) {
    					if (!filter(data[i], value, {})) {
    						e.preventDefault();
    					}
    				}
    			}
    		}
    	}

    	const writable_props = ['isEnabled', 'value', 'placeholder', 'width', 'autofocus', 'filter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextField> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(4, input);
    		});
    	}

    	function input_1_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('width' in $$props) $$invalidate(10, width = $$props.width);
    		if ('autofocus' in $$props) $$invalidate(3, autofocus = $$props.autofocus);
    		if ('filter' in $$props) $$invalidate(11, filter = $$props.filter);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		isGeneralInputKey,
    		isEnabled,
    		value,
    		placeholder,
    		width,
    		autofocus,
    		filter,
    		dispatch,
    		input,
    		style,
    		onKeyDown,
    		onKeyUp,
    		onPaste,
    		hasContent
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(1, isEnabled = $$props.isEnabled);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('width' in $$props) $$invalidate(10, width = $$props.width);
    		if ('autofocus' in $$props) $$invalidate(3, autofocus = $$props.autofocus);
    		if ('filter' in $$props) $$invalidate(11, filter = $$props.filter);
    		if ('input' in $$props) $$invalidate(4, input = $$props.input);
    		if ('style' in $$props) $$invalidate(5, style = $$props.style);
    		if ('hasContent' in $$props) $$invalidate(6, hasContent = $$props.hasContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, style*/ 1056) {
    			{
    				if (width > 0) {
    					$$invalidate(5, style += `width: ${width}px;`);
    				}
    			}
    		}
    	};

    	$$invalidate(6, hasContent = $$slots.default);

    	return [
    		value,
    		isEnabled,
    		placeholder,
    		autofocus,
    		input,
    		style,
    		hasContent,
    		onKeyDown,
    		onKeyUp,
    		onPaste,
    		width,
    		filter,
    		$$scope,
    		slots,
    		keydown_handler,
    		keyup_handler,
    		paste_handler,
    		focus_handler,
    		blur_handler,
    		input_1_binding,
    		input_1_input_handler
    	];
    }

    class TextField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			isEnabled: 1,
    			value: 0,
    			placeholder: 2,
    			width: 10,
    			autofocus: 3,
    			filter: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextField",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocus() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocus(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Spinner.svelte generated by Svelte v3.44.2 */
    const file$9 = "src\\gui\\components\\Spinner.svelte";

    // (170:2) <TextField      bind:value      isEnabled="{isEnabled}"      filter="{filter}"      autofocus="{autofocus}"      on:change="{onTextChange}"      on:focus      on:blur      on:blur="{onBlur}"      on:keydown="{onKeyDown}">
    function create_default_slot$6(ctx) {
    	let div;
    	let pushbutton0;
    	let t;
    	let pushbutton1;
    	let current;

    	pushbutton0 = new PushButton({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[0],
    				iconName: "increment-up",
    				iconWidth: 10,
    				iconHeight: 10
    			},
    			$$inline: true
    		});

    	pushbutton0.$on("longpress", /*onIncUpLongpress*/ ctx[9]);
    	pushbutton0.$on("keydown", /*onIncKeydown*/ ctx[12]);
    	pushbutton0.$on("down", /*onIncUpMousedown*/ ctx[7]);
    	pushbutton0.$on("up", /*onIncMouseup*/ ctx[11]);

    	pushbutton1 = new PushButton({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[0],
    				iconName: "increment-down",
    				iconWidth: 10,
    				iconHeight: 10
    			},
    			$$inline: true
    		});

    	pushbutton1.$on("longpress", /*onIncDownLongpress*/ ctx[10]);
    	pushbutton1.$on("keydown", /*onIncKeydown*/ ctx[12]);
    	pushbutton1.$on("down", /*onIncDownMousedown*/ ctx[8]);
    	pushbutton1.$on("up", /*onIncMouseup*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(pushbutton0.$$.fragment);
    			t = space();
    			create_component(pushbutton1.$$.fragment);
    			attr_dev(div, "class", "buttons svelte-1o0fdlj");
    			add_location(div, file$9, 179, 4, 4199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(pushbutton0, div, null);
    			append_dev(div, t);
    			mount_component(pushbutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pushbutton0_changes = {};
    			if (dirty & /*isEnabled*/ 1) pushbutton0_changes.isEnabled = /*isEnabled*/ ctx[0];
    			pushbutton0.$set(pushbutton0_changes);
    			const pushbutton1_changes = {};
    			if (dirty & /*isEnabled*/ 1) pushbutton1_changes.isEnabled = /*isEnabled*/ ctx[0];
    			pushbutton1.$set(pushbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton0.$$.fragment, local);
    			transition_in(pushbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton0.$$.fragment, local);
    			transition_out(pushbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(pushbutton0);
    			destroy_component(pushbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(170:2) <TextField      bind:value      isEnabled=\\\"{isEnabled}\\\"      filter=\\\"{filter}\\\"      autofocus=\\\"{autofocus}\\\"      on:change=\\\"{onTextChange}\\\"      on:focus      on:blur      on:blur=\\\"{onBlur}\\\"      on:keydown=\\\"{onKeyDown}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let textfield;
    	let updating_value;
    	let current;

    	function textfield_value_binding(value) {
    		/*textfield_value_binding*/ ctx[14](value);
    	}

    	let textfield_props = {
    		isEnabled: /*isEnabled*/ ctx[0],
    		filter: /*filter*/ ctx[4],
    		autofocus: /*autofocus*/ ctx[1],
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[3] !== void 0) {
    		textfield_props.value = /*value*/ ctx[3];
    	}

    	textfield = new TextField({ props: textfield_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield, 'value', textfield_value_binding));
    	textfield.$on("change", /*onTextChange*/ ctx[13]);
    	textfield.$on("focus", /*focus_handler*/ ctx[15]);
    	textfield.$on("blur", /*blur_handler*/ ctx[16]);
    	textfield.$on("blur", /*onBlur*/ ctx[5]);
    	textfield.$on("keydown", /*onKeyDown*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textfield.$$.fragment);
    			attr_dev(div, "class", "spinner svelte-1o0fdlj");
    			attr_dev(div, "data-component", "spinner");
    			toggle_class(div, "digitCount1", /*digitCount*/ ctx[2] === 1);
    			toggle_class(div, "digitCount2", /*digitCount*/ ctx[2] === 2);
    			toggle_class(div, "digitCount3", /*digitCount*/ ctx[2] === 3);
    			toggle_class(div, "digitCount4", /*digitCount*/ ctx[2] === 4);
    			toggle_class(div, "digitCount5", /*digitCount*/ ctx[2] === 5);
    			toggle_class(div, "digitCount6", /*digitCount*/ ctx[2] === 6);
    			toggle_class(div, "digitCount7", /*digitCount*/ ctx[2] === 7);
    			toggle_class(div, "digitCount8", /*digitCount*/ ctx[2] === 8);
    			toggle_class(div, "digitCount9", /*digitCount*/ ctx[2] === 9);
    			toggle_class(div, "digitCount10", /*digitCount*/ ctx[2] === 10);
    			add_location(div, file$9, 156, 0, 3494);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textfield, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield_changes = {};
    			if (dirty & /*isEnabled*/ 1) textfield_changes.isEnabled = /*isEnabled*/ ctx[0];
    			if (dirty & /*autofocus*/ 2) textfield_changes.autofocus = /*autofocus*/ ctx[1];

    			if (dirty & /*$$scope, isEnabled*/ 2097153) {
    				textfield_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 8) {
    				updating_value = true;
    				textfield_changes.value = /*value*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield.$set(textfield_changes);

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount1", /*digitCount*/ ctx[2] === 1);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount2", /*digitCount*/ ctx[2] === 2);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount3", /*digitCount*/ ctx[2] === 3);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount4", /*digitCount*/ ctx[2] === 4);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount5", /*digitCount*/ ctx[2] === 5);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount6", /*digitCount*/ ctx[2] === 6);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount7", /*digitCount*/ ctx[2] === 7);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount8", /*digitCount*/ ctx[2] === 8);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount9", /*digitCount*/ ctx[2] === 9);
    			}

    			if (dirty & /*digitCount*/ 4) {
    				toggle_class(div, "digitCount10", /*digitCount*/ ctx[2] === 10);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(textfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	let { isEnabled = true } = $$props;
    	let { autofocus = false } = $$props;
    	let { digitCount = 6 } = $$props;
    	const dispatch = createEventDispatcher();
    	let value = "0";
    	let incTimeout;

    	function inc(amount) {
    		$$invalidate(3, value = String((parseFloat(value) + amount).toFixed(2)).replace(/\.00$|0+$/, ""));
    		dispatch("change", parseFloat(value));
    	}

    	function filter(key) {
    		if (key === "-") {
    			if (value === "0") {
    				$$invalidate(3, value = "-");
    			} else {
    				const num = parseFloat(value) * -1;
    				$$invalidate(3, value = String(num));
    			}

    			return false;
    		}

    		if (!isNumericInput(key) && !isDeleteKey(key)) {
    			return false;
    		}

    		if (value === "0" && key !== "." && !isDeleteKey(key)) {
    			$$invalidate(3, value = key);
    			return false;
    		}

    		return true;
    	}

    	function onBlur() {
    		if (isNaN(parseFloat(value))) {
    			$$invalidate(3, value = "0");
    		}

    		$$invalidate(3, value = value.replace(/\.$/, ""));
    	}

    	function onKeyDown(e) {
    		const { key, shiftKey, ctrlKey } = e;

    		if (isIncrementKey(key)) {
    			inc(shiftKey ? 10 : ctrlKey ? 0.01 : 1);
    		} else if (isDecrementKey(key)) {
    			inc(shiftKey ? -10 : ctrlKey ? -0.01 : -1);
    		}

    		if (isArrowKey(key)) {
    			e.preventDefault();
    		}
    	}

    	function incRepeat(amount) {
    		inc(amount);

    		incTimeout = setTimeout(
    			() => {
    				incRepeat(amount);
    			},
    			50
    		);
    	}

    	function onIncUpMousedown() {
    		inc(1);
    	}

    	function onIncDownMousedown() {
    		inc(-1);
    	}

    	function onIncUpLongpress() {
    		incRepeat(1);
    	}

    	function onIncDownLongpress() {
    		incRepeat(-1);
    	}

    	function onIncMouseup() {
    		clearTimeout(incTimeout);
    	}

    	function onIncKeydown(e) {
    		const { key } = e;

    		if (isIncrementKey(key)) {
    			onIncUpMousedown();
    		} else if (isDecrementKey(key)) {
    			onIncDownMousedown();
    		}

    		if (isArrowKey(key)) {
    			e.preventDefault();
    		}
    	}

    	function onTextChange() {
    		const num = parseFloat(value);
    		!isNaN(num) && dispatch("change", parseFloat(value));
    	}

    	const writable_props = ['isEnabled', 'autofocus', 'digitCount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	function textfield_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(3, value);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('autofocus' in $$props) $$invalidate(1, autofocus = $$props.autofocus);
    		if ('digitCount' in $$props) $$invalidate(2, digitCount = $$props.digitCount);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		isNumericInput,
    		isDeleteKey,
    		isArrowKey,
    		isIncrementKey,
    		isDecrementKey,
    		TextField,
    		PushButton,
    		isEnabled,
    		autofocus,
    		digitCount,
    		dispatch,
    		value,
    		incTimeout,
    		inc,
    		filter,
    		onBlur,
    		onKeyDown,
    		incRepeat,
    		onIncUpMousedown,
    		onIncDownMousedown,
    		onIncUpLongpress,
    		onIncDownLongpress,
    		onIncMouseup,
    		onIncKeydown,
    		onTextChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('autofocus' in $$props) $$invalidate(1, autofocus = $$props.autofocus);
    		if ('digitCount' in $$props) $$invalidate(2, digitCount = $$props.digitCount);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('incTimeout' in $$props) incTimeout = $$props.incTimeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isEnabled,
    		autofocus,
    		digitCount,
    		value,
    		filter,
    		onBlur,
    		onKeyDown,
    		onIncUpMousedown,
    		onIncDownMousedown,
    		onIncUpLongpress,
    		onIncDownLongpress,
    		onIncMouseup,
    		onIncKeydown,
    		onTextChange,
    		textfield_value_binding,
    		focus_handler,
    		blur_handler
    	];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			isEnabled: 0,
    			autofocus: 1,
    			digitCount: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get isEnabled() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocus() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocus(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get digitCount() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set digitCount(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\MenuRow.svelte generated by Svelte v3.44.2 */
    const file$8 = "src\\gui\\components\\MenuRow.svelte";

    // (54:2) {#if hasIcons}
    function create_if_block_3(ctx) {
    	let div;
    	let current;
    	let if_block = /*item*/ ctx[2].hasIcon && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "menu-icon svelte-w74lx4");
    			add_location(div, file$8, 54, 4, 1117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[2].hasIcon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*item*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(54:2) {#if hasIcons}",
    		ctx
    	});

    	return block;
    }

    // (56:6) {#if item.hasIcon}
    function create_if_block_4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[2].canToggle) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(56:6) {#if item.hasIcon}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {:else}
    function create_else_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: /*item*/ ctx[2].icon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*item*/ 4) icon_changes.src = /*item*/ ctx[2].icon;
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(61:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {#if item.canToggle}
    function create_if_block_5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*item*/ ctx[2].isChecked && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[2].isChecked) {
    				if (if_block) {
    					if (dirty & /*item*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(57:8) {#if item.canToggle}",
    		ctx
    	});

    	return block;
    }

    // (58:10) {#if item.isChecked}
    function create_if_block_6(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/icons/tick.svg", size: 16 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(58:10) {#if item.isChecked}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if hasShortCuts}
    function create_if_block_1$3(ctx) {
    	let div;
    	let if_block = /*item*/ ctx[2].hasShortcut && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "menu-shortcuts svelte-w74lx4");
    			add_location(div, file$8, 71, 4, 1539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[2].hasShortcut) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(71:2) {#if hasShortCuts}",
    		ctx
    	});

    	return block;
    }

    // (73:6) {#if item.hasShortcut}
    function create_if_block_2$1(ctx) {
    	let t_value = /*item*/ ctx[2].printShortcut + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && t_value !== (t_value = /*item*/ ctx[2].printShortcut + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(73:6) {#if item.hasShortcut}",
    		ctx
    	});

    	return block;
    }

    // (78:2) {#if item.items}
    function create_if_block$6(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/icons/play.svg", height: 10 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "menu-expand svelte-w74lx4");
    			add_location(div, file$8, 78, 4, 1687);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(78:2) {#if item.items}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t0;
    	let label;
    	let t1;
    	let t2;
    	let current;
    	let if_block0 = /*hasIcons*/ ctx[0] && create_if_block_3(ctx);

    	label = new Label({
    			props: {
    				text: /*item*/ ctx[2].label,
    				fontSize: 12,
    				isEnabled: /*item*/ ctx[2].isEnabled !== false
    			},
    			$$inline: true
    		});

    	let if_block1 = /*hasShortCuts*/ ctx[1] && create_if_block_1$3(ctx);
    	let if_block2 = /*item*/ ctx[2].items && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(label.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "menu-row svelte-w74lx4");
    			attr_dev(div, "data-component", "menurow");
    			add_location(div, file$8, 52, 0, 1046);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			mount_component(label, div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*hasIcons*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*hasIcons*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const label_changes = {};
    			if (dirty & /*item*/ 4) label_changes.text = /*item*/ ctx[2].label;
    			if (dirty & /*item*/ 4) label_changes.isEnabled = /*item*/ ctx[2].isEnabled !== false;
    			label.$set(label_changes);

    			if (/*hasShortCuts*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					if_block1.m(div, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*item*/ ctx[2].items) {
    				if (if_block2) {
    					if (dirty & /*item*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(label.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(label.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			destroy_component(label);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const staticVar$2 = 500;

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuRow', slots, []);
    	let { hasIcons = false } = $$props;
    	let { hasShortCuts = false } = $$props;
    	let { item } = $$props;
    	const writable_props = ['hasIcons', 'hasShortCuts', 'item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hasIcons' in $$props) $$invalidate(0, hasIcons = $$props.hasIcons);
    		if ('hasShortCuts' in $$props) $$invalidate(1, hasShortCuts = $$props.hasShortCuts);
    		if ('item' in $$props) $$invalidate(2, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		staticVar: staticVar$2,
    		Label,
    		Icon,
    		hasIcons,
    		hasShortCuts,
    		item
    	});

    	$$self.$inject_state = $$props => {
    		if ('hasIcons' in $$props) $$invalidate(0, hasIcons = $$props.hasIcons);
    		if ('hasShortCuts' in $$props) $$invalidate(1, hasShortCuts = $$props.hasShortCuts);
    		if ('item' in $$props) $$invalidate(2, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hasIcons, hasShortCuts, item];
    }

    class MenuRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { hasIcons: 0, hasShortCuts: 1, item: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuRow",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[2] === undefined && !('item' in props)) {
    			console.warn("<MenuRow> was created without expected prop 'item'");
    		}
    	}

    	get hasIcons() {
    		throw new Error("<MenuRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasIcons(value) {
    		throw new Error("<MenuRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasShortCuts() {
    		throw new Error("<MenuRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasShortCuts(value) {
    		throw new Error("<MenuRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<MenuRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<MenuRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Menu.svelte generated by Svelte v3.44.2 */
    const file$7 = "src\\gui\\components\\Menu.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	child_ctx[38] = i;
    	return child_ctx;
    }

    // (204:2) {#if isOpen}
    function create_if_block$5(ctx) {
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[38];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "menu-view svelte-1xwz4lg");
    			add_location(ul, file$7, 205, 6, 5754);
    			attr_dev(div, "class", "menu-position svelte-1xwz4lg");
    			add_location(div, file$7, 204, 4, 5690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			/*ul_binding*/ ctx[29](ul);
    			/*div_binding*/ ctx[30](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "mouseover", /*mouseover_handler*/ ctx[27], false, false, false),
    					listen_dev(ul, "mouseout", /*mouseout_handler*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, selectedIndex, hoverIndex, onLIMouseOver, onLIMouseUp, onLIMouseDown, stack, onSelect, hasIcons, hasShortCuts, activeIndex*/ 126055) {
    				each_value = /*items*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*ul_binding*/ ctx[29](null);
    			/*div_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(204:2) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (217:12) {#if item.isItem}
    function create_if_block_1$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeIndex*/ ctx[10] === /*i*/ ctx[38] && /*item*/ ctx[36].hasSubMenu) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(217:12) {#if item.isItem}",
    		ctx
    	});

    	return block;
    }

    // (229:14) {:else}
    function create_else_block(ctx) {
    	let menurow;
    	let current;

    	menurow = new MenuRow({
    			props: {
    				item: /*item*/ ctx[36],
    				hasIcons: /*hasIcons*/ ctx[13],
    				hasShortCuts: /*hasShortCuts*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menurow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menurow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menurow_changes = {};
    			if (dirty[0] & /*items*/ 4) menurow_changes.item = /*item*/ ctx[36];
    			if (dirty[0] & /*hasIcons*/ 8192) menurow_changes.hasIcons = /*hasIcons*/ ctx[13];
    			if (dirty[0] & /*hasShortCuts*/ 2048) menurow_changes.hasShortCuts = /*hasShortCuts*/ ctx[11];
    			menurow.$set(menurow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menurow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menurow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menurow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(229:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (218:14) {#if activeIndex === i && item.hasSubMenu}
    function create_if_block_2(ctx) {
    	let menu;
    	let current;

    	menu = new Menu({
    			props: {
    				items: /*item*/ ctx[36].items,
    				isOpen: true,
    				position: "popout",
    				stack: /*stack*/ ctx[0],
    				onSelect: /*onSelect*/ ctx[6],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_changes = {};
    			if (dirty[0] & /*items*/ 4) menu_changes.items = /*item*/ ctx[36].items;
    			if (dirty[0] & /*stack*/ 1) menu_changes.stack = /*stack*/ ctx[0];
    			if (dirty[0] & /*onSelect*/ 64) menu_changes.onSelect = /*onSelect*/ ctx[6];

    			if (dirty[0] & /*items, hasIcons, hasShortCuts*/ 10244 | dirty[1] & /*$$scope*/ 2) {
    				menu_changes.$$scope = { dirty, ctx };
    			}

    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(218:14) {#if activeIndex === i && item.hasSubMenu}",
    		ctx
    	});

    	return block;
    }

    // (219:16) <svelte:self                    items="{item.items}"                    isOpen="{true}"                    position="popout"                    stack="{stack}"                    onSelect="{onSelect}"                    >
    function create_default_slot$5(ctx) {
    	let menurow;
    	let current;

    	menurow = new MenuRow({
    			props: {
    				item: /*item*/ ctx[36],
    				hasIcons: /*hasIcons*/ ctx[13],
    				hasShortCuts: /*hasShortCuts*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menurow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menurow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menurow_changes = {};
    			if (dirty[0] & /*items*/ 4) menurow_changes.item = /*item*/ ctx[36];
    			if (dirty[0] & /*hasIcons*/ 8192) menurow_changes.hasIcons = /*hasIcons*/ ctx[13];
    			if (dirty[0] & /*hasShortCuts*/ 2048) menurow_changes.hasShortCuts = /*hasShortCuts*/ ctx[11];
    			menurow.$set(menurow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menurow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menurow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menurow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(219:16) <svelte:self                    items=\\\"{item.items}\\\"                    isOpen=\\\"{true}\\\"                    position=\\\"popout\\\"                    stack=\\\"{stack}\\\"                    onSelect=\\\"{onSelect}\\\"                    >",
    		ctx
    	});

    	return block;
    }

    // (207:8) {#each items as item, i (i)}
    function create_each_block$2(key_1, ctx) {
    	let li;
    	let t;
    	let li_data_index_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*item*/ ctx[36].isItem && create_if_block_1$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(li, "data-index", li_data_index_value = /*i*/ ctx[38]);
    			attr_dev(li, "class", "svelte-1xwz4lg");
    			toggle_class(li, "selected", /*selectedIndex*/ ctx[5] === /*i*/ ctx[38]);
    			toggle_class(li, "hover", /*hoverIndex*/ ctx[1] === /*i*/ ctx[38]);
    			toggle_class(li, "separator", /*item*/ ctx[36].isSeparator);
    			add_location(li, file$7, 208, 10, 5944);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						li,
    						"mouseover",
    						function () {
    							if (is_function(/*onLIMouseOver*/ ctx[14](/*i*/ ctx[38]))) /*onLIMouseOver*/ ctx[14](/*i*/ ctx[38]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li,
    						"mouseup",
    						function () {
    							if (is_function(/*onLIMouseUp*/ ctx[15](/*i*/ ctx[38]))) /*onLIMouseUp*/ ctx[15](/*i*/ ctx[38]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li,
    						"mousedown",
    						function () {
    							if (is_function(/*onLIMouseDown*/ ctx[16](/*i*/ ctx[38]))) /*onLIMouseDown*/ ctx[16](/*i*/ ctx[38]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*item*/ ctx[36].isItem) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*items*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*items*/ 4 && li_data_index_value !== (li_data_index_value = /*i*/ ctx[38])) {
    				attr_dev(li, "data-index", li_data_index_value);
    			}

    			if (dirty[0] & /*selectedIndex, items*/ 36) {
    				toggle_class(li, "selected", /*selectedIndex*/ ctx[5] === /*i*/ ctx[38]);
    			}

    			if (dirty[0] & /*hoverIndex, items*/ 6) {
    				toggle_class(li, "hover", /*hoverIndex*/ ctx[1] === /*i*/ ctx[38]);
    			}

    			if (dirty[0] & /*items*/ 4) {
    				toggle_class(li, "separator", /*item*/ ctx[36].isSeparator);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(207:8) {#each items as item, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);
    	let if_block = /*isOpen*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "menu svelte-1xwz4lg");
    			attr_dev(div, "data-component", "menu");
    			attr_dev(div, "data-position", /*position*/ ctx[3]);
    			toggle_class(div, "withIcons", /*hasIcons*/ ctx[13]);
    			toggle_class(div, "withSubMenus", /*hasSubMenus*/ ctx[12]);
    			toggle_class(div, "withShortCuts", /*hasShortCuts*/ ctx[11]);
    			add_location(div, file$7, 194, 0, 5441);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding_1*/ ctx[31](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isOpen*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*position*/ 8) {
    				attr_dev(div, "data-position", /*position*/ ctx[3]);
    			}

    			if (dirty[0] & /*hasIcons*/ 8192) {
    				toggle_class(div, "withIcons", /*hasIcons*/ ctx[13]);
    			}

    			if (dirty[0] & /*hasSubMenus*/ 4096) {
    				toggle_class(div, "withSubMenus", /*hasSubMenus*/ ctx[12]);
    			}

    			if (dirty[0] & /*hasShortCuts*/ 2048) {
    				toggle_class(div, "withShortCuts", /*hasShortCuts*/ ctx[11]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding_1*/ ctx[31](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let hasIcons;
    	let hasSubMenus;
    	let hasShortCuts;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, ['default']);
    	let { items } = $$props;
    	let { trigger = "mousedown" } = $$props;
    	let { position = "dropdown" } = $$props;
    	let { isOpen = false } = $$props;
    	let { selectedIndex = -1 } = $$props;
    	let { hoverIndex = selectedIndex } = $$props;
    	let { stack } = $$props;
    	let { onSelect } = $$props;
    	let id = nextId();

    	function containsEvent(e) {
    		const r = menuViewEl.getBoundingClientRect();
    		const { clientX: x, clientY: y } = e;
    		return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    	}

    	function clear(fully = false) {
    		$$invalidate(10, activeIndex = -1);

    		if (fully) {
    			$$invalidate(1, hoverIndex = selectedIndex - 1);
    		}
    	}

    	function registerStack() {
    		const isActive = stack.length === 0;
    		$$invalidate(1, hoverIndex = -1);

    		stack.push({
    			isActive,
    			setHoverIndex,
    			getHoverIndex,
    			hasCurrentSubMenu,
    			getCurrentItem,
    			getItems,
    			containsEvent
    		});
    	} // console.log("register!", stack.length);

    	function setHoverIndex(index) {
    		if (hoverIndex !== index) {
    			$$invalidate(1, hoverIndex = index);

    			if (index > -1 && index !== activeIndex) {
    				if (activeIndex > -1 && items[activeIndex].hasSubMenu) {
    					stack.pop();
    				} // console.log("leave", stack.length);

    				$$invalidate(10, activeIndex = index);

    				if (items[activeIndex].hasSubMenu) ; // console.log("enter", stack.length);
    			}
    		}

    		if (index === -1) {
    			$$invalidate(10, activeIndex = -1);
    		}
    	}

    	function getHoverIndex() {
    		return hoverIndex;
    	}

    	function hasCurrentSubMenu() {
    		return hoverIndex > -1 && items[hoverIndex].hasIteractiveSubMenu;
    	}

    	function getCurrentItem() {
    		return items[hoverIndex];
    	}

    	function getItems() {
    		return items;
    	}

    	let containerEl;
    	let menuPositionEl;
    	let menuViewEl;
    	let activeIndex = -1;

    	function clearStack() {
    		$$invalidate(0, stack.length = 0, stack);
    	} // console.log("clear");

    	function select(item) {
    		if (item.canToggle && !item.hasAction) {
    			item.isChecked = !item.isChecked;
    		}

    		onSelect(item);
    	}

    	const onLIMouseOver = index => e => {
    		if (items[index].isInteractive) {
    			setHoverIndex(index);
    		}
    	};

    	const onLIMouseUp = index => e => {
    		if (trigger === "mousedown") {
    			if (containsEvent(e) && !items[index].hasSubMenu) {
    				select(items[index]);
    			}
    		}
    	};

    	const onLIMouseDown = index => e => {
    		if (trigger === "mouseup") {
    			if (containsEvent(e) && !items[index].hasSubMenu) {
    				select(items[index]);
    			}
    		}
    	};

    	const writable_props = [
    		'items',
    		'trigger',
    		'position',
    		'isOpen',
    		'selectedIndex',
    		'hoverIndex',
    		'stack',
    		'onSelect'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuViewEl = $$value;
    			$$invalidate(8, menuViewEl);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuPositionEl = $$value;
    			(((($$invalidate(9, menuPositionEl), $$invalidate(4, isOpen)), $$invalidate(7, containerEl)), $$invalidate(8, menuViewEl)), $$invalidate(3, position));
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerEl = $$value;
    			$$invalidate(7, containerEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    		if ('trigger' in $$props) $$invalidate(17, trigger = $$props.trigger);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('isOpen' in $$props) $$invalidate(4, isOpen = $$props.isOpen);
    		if ('selectedIndex' in $$props) $$invalidate(5, selectedIndex = $$props.selectedIndex);
    		if ('hoverIndex' in $$props) $$invalidate(1, hoverIndex = $$props.hoverIndex);
    		if ('stack' in $$props) $$invalidate(0, stack = $$props.stack);
    		if ('onSelect' in $$props) $$invalidate(6, onSelect = $$props.onSelect);
    		if ('$$scope' in $$props) $$invalidate(32, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		nextId,
    		MenuRow,
    		items,
    		trigger,
    		position,
    		isOpen,
    		selectedIndex,
    		hoverIndex,
    		stack,
    		onSelect,
    		id,
    		containsEvent,
    		clear,
    		registerStack,
    		setHoverIndex,
    		getHoverIndex,
    		hasCurrentSubMenu,
    		getCurrentItem,
    		getItems,
    		containerEl,
    		menuPositionEl,
    		menuViewEl,
    		activeIndex,
    		clearStack,
    		select,
    		onLIMouseOver,
    		onLIMouseUp,
    		onLIMouseDown,
    		hasShortCuts,
    		hasSubMenus,
    		hasIcons
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    		if ('trigger' in $$props) $$invalidate(17, trigger = $$props.trigger);
    		if ('position' in $$props) $$invalidate(3, position = $$props.position);
    		if ('isOpen' in $$props) $$invalidate(4, isOpen = $$props.isOpen);
    		if ('selectedIndex' in $$props) $$invalidate(5, selectedIndex = $$props.selectedIndex);
    		if ('hoverIndex' in $$props) $$invalidate(1, hoverIndex = $$props.hoverIndex);
    		if ('stack' in $$props) $$invalidate(0, stack = $$props.stack);
    		if ('onSelect' in $$props) $$invalidate(6, onSelect = $$props.onSelect);
    		if ('id' in $$props) id = $$props.id;
    		if ('containerEl' in $$props) $$invalidate(7, containerEl = $$props.containerEl);
    		if ('menuPositionEl' in $$props) $$invalidate(9, menuPositionEl = $$props.menuPositionEl);
    		if ('menuViewEl' in $$props) $$invalidate(8, menuViewEl = $$props.menuViewEl);
    		if ('activeIndex' in $$props) $$invalidate(10, activeIndex = $$props.activeIndex);
    		if ('hasShortCuts' in $$props) $$invalidate(11, hasShortCuts = $$props.hasShortCuts);
    		if ('hasSubMenus' in $$props) $$invalidate(12, hasSubMenus = $$props.hasSubMenus);
    		if ('hasIcons' in $$props) $$invalidate(13, hasIcons = $$props.hasIcons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*isOpen, containerEl, menuViewEl, position*/ 408) {
    			{
    				if (isOpen && containerEl && menuViewEl) {
    					const containerRect = containerEl.getBoundingClientRect();
    					const innerWidth = document.body.clientWidth;
    					const innerHeight = document.body.clientHeight;
    					let top;
    					let left;

    					if (position === "dropdown") {
    						left = 0;
    						top = containerRect.height;
    					} else if (position === "popout") {
    						left = containerRect.width;
    						top = 0;
    					}

    					$$invalidate(9, menuPositionEl.style.top = `${top}px`, menuPositionEl);
    					$$invalidate(9, menuPositionEl.style.left = `${left}px`, menuPositionEl);
    					const menuViewRect = menuViewEl.getBoundingClientRect();

    					if (menuViewRect.bottom > innerHeight) {
    						$$invalidate(9, menuPositionEl.style.top = `${containerRect.height - (containerRect.bottom + menuViewRect.height - innerHeight)}px`, menuPositionEl);
    					}

    					if (menuViewRect.right > innerWidth) {
    						$$invalidate(9, menuPositionEl.style.left = `${containerRect.width - (containerRect.right + menuViewRect.width - innerWidth)}px`, menuPositionEl);
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isOpen*/ 16) {
    			{
    				if (isOpen) {
    					registerStack();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isOpen, stack*/ 17) {
    			{
    				if (isOpen === false && stack.length) {
    					clearStack();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 4) {
    			$$invalidate(13, hasIcons = items.some(item => item.hasIcon));
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 4) {
    			$$invalidate(12, hasSubMenus = items.some(item => item.hasSubMenu));
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 4) {
    			$$invalidate(11, hasShortCuts = items.some(item => item.hasShortcut));
    		}
    	};

    	return [
    		stack,
    		hoverIndex,
    		items,
    		position,
    		isOpen,
    		selectedIndex,
    		onSelect,
    		containerEl,
    		menuViewEl,
    		menuPositionEl,
    		activeIndex,
    		hasShortCuts,
    		hasSubMenus,
    		hasIcons,
    		onLIMouseOver,
    		onLIMouseUp,
    		onLIMouseDown,
    		trigger,
    		containsEvent,
    		clear,
    		registerStack,
    		setHoverIndex,
    		getHoverIndex,
    		hasCurrentSubMenu,
    		getCurrentItem,
    		getItems,
    		slots,
    		mouseover_handler,
    		mouseout_handler,
    		ul_binding,
    		div_binding,
    		div_binding_1,
    		$$scope
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				items: 2,
    				trigger: 17,
    				position: 3,
    				isOpen: 4,
    				selectedIndex: 5,
    				hoverIndex: 1,
    				stack: 0,
    				onSelect: 6,
    				containsEvent: 18,
    				clear: 19,
    				registerStack: 20,
    				setHoverIndex: 21,
    				getHoverIndex: 22,
    				hasCurrentSubMenu: 23,
    				getCurrentItem: 24,
    				getItems: 25
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[2] === undefined && !('items' in props)) {
    			console.warn("<Menu> was created without expected prop 'items'");
    		}

    		if (/*stack*/ ctx[0] === undefined && !('stack' in props)) {
    			console.warn("<Menu> was created without expected prop 'stack'");
    		}

    		if (/*onSelect*/ ctx[6] === undefined && !('onSelect' in props)) {
    			console.warn("<Menu> was created without expected prop 'onSelect'");
    		}
    	}

    	get items() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverIndex() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverIndex(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stack() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stack(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containsEvent() {
    		return this.$$.ctx[18];
    	}

    	set containsEvent(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clear() {
    		return this.$$.ctx[19];
    	}

    	set clear(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerStack() {
    		return this.$$.ctx[20];
    	}

    	set registerStack(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setHoverIndex() {
    		return this.$$.ctx[21];
    	}

    	set setHoverIndex(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getHoverIndex() {
    		return this.$$.ctx[22];
    	}

    	set getHoverIndex(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasCurrentSubMenu() {
    		return this.$$.ctx[23];
    	}

    	set hasCurrentSubMenu(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getCurrentItem() {
    		return this.$$.ctx[24];
    	}

    	set getCurrentItem(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getItems() {
    		return this.$$.ctx[25];
    	}

    	set getItems(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\MenuButton.svelte generated by Svelte v3.44.2 */

    // (242:3) <Button      bind:this="{button}"      isEnabled="{isEnabled}"      canToggle="{trigger === 'mouseup'}"      noStyle="{noStyle}"      customClasses="{customClasses}"      onShouldClose="{onShouldClose}"      on:push      on:down="{onDown}"      on:down      on:up="{onUp}"      on:up      on:toggle="{onToggle}"      on:toggle      on:keydown      on:keydown="{onKeyDown}"      on:keyup      on:keyup="{onKeyUp}"      on:focus      on:blur      on:mouseover      on:mouseout>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(242:3) <Button      bind:this=\\\"{button}\\\"      isEnabled=\\\"{isEnabled}\\\"      canToggle=\\\"{trigger === 'mouseup'}\\\"      noStyle=\\\"{noStyle}\\\"      customClasses=\\\"{customClasses}\\\"      onShouldClose=\\\"{onShouldClose}\\\"      on:push      on:down=\\\"{onDown}\\\"      on:down      on:up=\\\"{onUp}\\\"      on:up      on:toggle=\\\"{onToggle}\\\"      on:toggle      on:keydown      on:keydown=\\\"{onKeyDown}\\\"      on:keyup      on:keyup=\\\"{onKeyUp}\\\"      on:focus      on:blur      on:mouseover      on:mouseout>",
    		ctx
    	});

    	return block;
    }

    // (233:0) <Menu    bind:this="{menu}"    isOpen="{isOpen}"    items="{items}"    position="{position}"    trigger="{trigger}"    selectedIndex="{selectedIndex}"    stack="{stack}"    onSelect="{onSelect}"    >
    function create_default_slot$4(ctx) {
    	let button_1;
    	let current;

    	let button_1_props = {
    		isEnabled: /*isEnabled*/ ctx[2],
    		canToggle: /*trigger*/ ctx[4] === 'mouseup',
    		noStyle: /*noStyle*/ ctx[6],
    		customClasses: /*customClasses*/ ctx[7],
    		onShouldClose: /*onShouldClose*/ ctx[17],
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	button_1 = new Button({ props: button_1_props, $$inline: true });
    	/*button_1_binding*/ ctx[34](button_1);
    	button_1.$on("push", /*push_handler*/ ctx[35]);
    	button_1.$on("down", /*onDown*/ ctx[12]);
    	button_1.$on("down", /*down_handler*/ ctx[36]);
    	button_1.$on("up", /*onUp*/ ctx[13]);
    	button_1.$on("up", /*up_handler*/ ctx[37]);
    	button_1.$on("toggle", /*onToggle*/ ctx[14]);
    	button_1.$on("toggle", /*toggle_handler*/ ctx[38]);
    	button_1.$on("keydown", /*keydown_handler*/ ctx[39]);
    	button_1.$on("keydown", /*onKeyDown*/ ctx[15]);
    	button_1.$on("keyup", /*keyup_handler*/ ctx[40]);
    	button_1.$on("keyup", /*onKeyUp*/ ctx[16]);
    	button_1.$on("focus", /*focus_handler*/ ctx[41]);
    	button_1.$on("blur", /*blur_handler*/ ctx[42]);
    	button_1.$on("mouseover", /*mouseover_handler*/ ctx[43]);
    	button_1.$on("mouseout", /*mouseout_handler*/ ctx[44]);

    	const block = {
    		c: function create() {
    			create_component(button_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_1_changes = {};
    			if (dirty[0] & /*isEnabled*/ 4) button_1_changes.isEnabled = /*isEnabled*/ ctx[2];
    			if (dirty[0] & /*trigger*/ 16) button_1_changes.canToggle = /*trigger*/ ctx[4] === 'mouseup';
    			if (dirty[0] & /*noStyle*/ 64) button_1_changes.noStyle = /*noStyle*/ ctx[6];
    			if (dirty[0] & /*customClasses*/ 128) button_1_changes.customClasses = /*customClasses*/ ctx[7];

    			if (dirty[1] & /*$$scope*/ 32768) {
    				button_1_changes.$$scope = { dirty, ctx };
    			}

    			button_1.$set(button_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*button_1_binding*/ ctx[34](null);
    			destroy_component(button_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(233:0) <Menu    bind:this=\\\"{menu}\\\"    isOpen=\\\"{isOpen}\\\"    items=\\\"{items}\\\"    position=\\\"{position}\\\"    trigger=\\\"{trigger}\\\"    selectedIndex=\\\"{selectedIndex}\\\"    stack=\\\"{stack}\\\"    onSelect=\\\"{onSelect}\\\"    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let menu_1;
    	let current;

    	let menu_1_props = {
    		isOpen: /*isOpen*/ ctx[1],
    		items: /*items*/ ctx[3],
    		position: /*position*/ ctx[5],
    		trigger: /*trigger*/ ctx[4],
    		selectedIndex: /*selectedIndex*/ ctx[0],
    		stack: /*stack*/ ctx[8],
    		onSelect: /*onSelect*/ ctx[11],
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	menu_1 = new Menu({ props: menu_1_props, $$inline: true });
    	/*menu_1_binding*/ ctx[45](menu_1);

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_1_changes = {};
    			if (dirty[0] & /*isOpen*/ 2) menu_1_changes.isOpen = /*isOpen*/ ctx[1];
    			if (dirty[0] & /*items*/ 8) menu_1_changes.items = /*items*/ ctx[3];
    			if (dirty[0] & /*position*/ 32) menu_1_changes.position = /*position*/ ctx[5];
    			if (dirty[0] & /*trigger*/ 16) menu_1_changes.trigger = /*trigger*/ ctx[4];
    			if (dirty[0] & /*selectedIndex*/ 1) menu_1_changes.selectedIndex = /*selectedIndex*/ ctx[0];
    			if (dirty[0] & /*stack*/ 256) menu_1_changes.stack = /*stack*/ ctx[8];

    			if (dirty[0] & /*isEnabled, trigger, noStyle, customClasses, button*/ 724 | dirty[1] & /*$$scope*/ 32768) {
    				menu_1_changes.$$scope = { dirty, ctx };
    			}

    			menu_1.$set(menu_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*menu_1_binding*/ ctx[45](null);
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuButton', slots, ['default']);
    	let { isEnabled = true } = $$props;
    	let { items } = $$props;
    	let { selectedIndex = -1 } = $$props;
    	let { hoverIndex = selectedIndex } = $$props;
    	let { trigger = "mousedown" } = $$props;
    	let { position = "dropdown" } = $$props;
    	let { isOpen = false } = $$props;
    	let { noStyle = false } = $$props;
    	let { retainSelection = false } = $$props;
    	let { customClasses = {} } = $$props;
    	let id = nextId();
    	const stack = [];
    	const dispatch = createEventDispatcher();
    	let button;
    	let menu;
    	let onMouseDown;
    	let onInternalKeyDown;

    	Action.notifications.on("execute", action => {
    		if (isOpen) {
    			close();
    		}
    	});

    	function getIsOpen() {
    		return isOpen;
    	}

    	function open() {
    		$$invalidate(1, isOpen = true);
    		$$invalidate(18, hoverIndex = selectedIndex);
    		stack.length && stack[0].setHoverIndex(selectedIndex);
    		button.setIsDown(true);
    		dispatch("open");

    		setTimeout(
    			() => {
    				onMouseDown = e => {
    					if (button && !button.containsEvent(e.target)) {
    						const contains = stack.some(item => item.containsEvent(e));

    						if (!contains) {
    							close();
    						}
    					}

    					clearBlurHandlers();
    				};

    				window.addEventListener("mousedown", onMouseDown);

    				onInternalKeyDown = e => {
    					if (isModifier(e.key)) {
    						return;
    					}

    					// console.log("onInternalKeyDown", id);
    					if (button && !button.containsEvent(e.target)) {
    						close();
    					}
    				};

    				window.addEventListener("keydown", onInternalKeyDown);
    			},
    			0
    		);
    	}

    	function close(shouldDispatch = true) {
    		$$invalidate(1, isOpen = false);
    		button.setIsDown(false);

    		if (!retainSelection) {
    			$$invalidate(0, selectedIndex = $$invalidate(18, hoverIndex = -1));
    			menu.clear(true);
    		} else {
    			menu.clear();
    		}

    		shouldDispatch && dispatch("close");
    		$$invalidate(8, stack.length = 0, stack);
    		clearBlurHandlers();
    	}

    	function clearBlurHandlers() {
    		if (onMouseDown) {
    			window.removeEventListener("mousedown", onMouseDown);
    			onMouseDown = undefined;
    		}

    		if (onInternalKeyDown) {
    			window.removeEventListener("keydown", onInternalKeyDown);
    			onInternalKeyDown = undefined;
    		}
    	}

    	function getButton() {
    		return button;
    	}

    	function getHoverIndex() {
    		return hoverIndex;
    	}

    	function hasCurrentSubMenu() {
    		if (stack.length) {
    			return getActiveStack().hasCurrentSubMenu();
    		} else {
    			return false;
    		}
    	}

    	function hasPreviousSubMenu() {
    		const index = getActiveStackIndex();
    		return index > 0 && stack[index - 1].hasCurrentSubMenu();
    	}

    	function getStack() {
    		return stack;
    	}

    	function getActiveStack() {
    		const index = getActiveStackIndex();
    		return stack[index];
    	}

    	function getActiveStackIndex() {
    		for (let i = stack.length - 1; i >= 0; i--) {
    			if (stack[i].isActive) {
    				return i;
    			}
    		}
    	}

    	function getStackTop() {
    		return stack[stack.length - 1];
    	}

    	function increment(startFrom = -1) {
    		const listener = getActiveStack();
    		const currentItems = listener.getItems();
    		const nextIndex = Math.min(currentItems.length - 1, (startFrom > -1 ? startFrom : listener.getHoverIndex()) + 1);

    		if (currentItems[nextIndex].isEnabled === false || currentItems[nextIndex].label === "-") {
    			if (nextIndex < currentItems.length - 1) {
    				increment(nextIndex);
    			}
    		} else {
    			listener.setHoverIndex(nextIndex);
    		}
    	}

    	function decrement(startFrom = -1) {
    		const listener = getActiveStack();
    		const currentItems = listener.getItems();
    		const nextIndex = Math.max(0, (startFrom > -1 ? startFrom : listener.getHoverIndex()) - 1);

    		if (!currentItems[nextIndex].isInteractive) {
    			if (nextIndex > 0) {
    				decrement(nextIndex);
    			}
    		} else {
    			listener.setHoverIndex(nextIndex);
    		}
    	}

    	const onSelect = item => {
    		if (item.isInteractive) {
    			item.execute();
    			dispatch("select", item);

    			if (trigger === "mouseup") {
    				close(false);
    			}
    		}
    	};

    	const onDown = () => {
    		if (trigger === "mousedown") {
    			open();
    		}
    	};

    	const onUp = () => {
    		if (trigger === "mousedown") {
    			close();
    		}
    	};

    	const onToggle = e => {
    		if (trigger === "mouseup") {
    			if (e.detail) {
    				open();
    			} else {
    				close();
    			}
    		}
    	};

    	const onKeyDown = e => {
    		const { key } = e;

    		if (key === "ArrowUp" && isOpen) {
    			decrement();
    		} else if (key === "ArrowDown") {
    			if (!isOpen) {
    				open();
    			} else if (isOpen) {
    				increment();
    			}
    		} else if (isAcceptKey(key) && isOpen) {
    			if (getActiveStack().getHoverIndex() > -1) {
    				const item = getActiveStack().getCurrentItem();

    				if (!item.hasSubMenu) {
    					item.execute();
    					dispatch("select", item);
    				}
    			}
    		} else if (key === "Escape") {
    			close();
    		} else if (key === "ArrowLeft") {
    			if (hasPreviousSubMenu() && getStack().length) {
    				getActiveStack().setHoverIndex(-1);
    				getActiveStack().isActive = false;
    			} // console.log("back");
    		} else if (key === "ArrowRight") {
    			if (hasCurrentSubMenu()) {
    				getStackTop().isActive = true;
    				increment();
    			} // console.log("forward");
    		}
    	};

    	const onKeyUp = e => {
    		if (button && !button.getIsDown().isDown && isAcceptKey(e.key)) {
    			e.stopImmediatePropagation();
    			e.stopPropagation();
    			close();
    		}
    	};

    	const onShouldClose = () => {
    		if (getActiveStack().getHoverIndex() > -1) {
    			const item = getActiveStack().getCurrentItem();
    			return !item.hasSubMenu;
    		}

    		return true;
    	};

    	const writable_props = [
    		'isEnabled',
    		'items',
    		'selectedIndex',
    		'hoverIndex',
    		'trigger',
    		'position',
    		'isOpen',
    		'noStyle',
    		'retainSelection',
    		'customClasses'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuButton> was created with unknown prop '${key}'`);
    	});

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(9, button);
    		});
    	}

    	function push_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function down_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function up_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function toggle_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function menu_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menu = $$value;
    			$$invalidate(10, menu);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(2, isEnabled = $$props.isEnabled);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('hoverIndex' in $$props) $$invalidate(18, hoverIndex = $$props.hoverIndex);
    		if ('trigger' in $$props) $$invalidate(4, trigger = $$props.trigger);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$props.isOpen);
    		if ('noStyle' in $$props) $$invalidate(6, noStyle = $$props.noStyle);
    		if ('retainSelection' in $$props) $$invalidate(19, retainSelection = $$props.retainSelection);
    		if ('customClasses' in $$props) $$invalidate(7, customClasses = $$props.customClasses);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Action,
    		nextId,
    		Button,
    		Menu,
    		isAcceptKey,
    		isModifier,
    		isEnabled,
    		items,
    		selectedIndex,
    		hoverIndex,
    		trigger,
    		position,
    		isOpen,
    		noStyle,
    		retainSelection,
    		customClasses,
    		id,
    		stack,
    		dispatch,
    		button,
    		menu,
    		onMouseDown,
    		onInternalKeyDown,
    		getIsOpen,
    		open,
    		close,
    		clearBlurHandlers,
    		getButton,
    		getHoverIndex,
    		hasCurrentSubMenu,
    		hasPreviousSubMenu,
    		getStack,
    		getActiveStack,
    		getActiveStackIndex,
    		getStackTop,
    		increment,
    		decrement,
    		onSelect,
    		onDown,
    		onUp,
    		onToggle,
    		onKeyDown,
    		onKeyUp,
    		onShouldClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(2, isEnabled = $$props.isEnabled);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ('hoverIndex' in $$props) $$invalidate(18, hoverIndex = $$props.hoverIndex);
    		if ('trigger' in $$props) $$invalidate(4, trigger = $$props.trigger);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$props.isOpen);
    		if ('noStyle' in $$props) $$invalidate(6, noStyle = $$props.noStyle);
    		if ('retainSelection' in $$props) $$invalidate(19, retainSelection = $$props.retainSelection);
    		if ('customClasses' in $$props) $$invalidate(7, customClasses = $$props.customClasses);
    		if ('id' in $$props) id = $$props.id;
    		if ('button' in $$props) $$invalidate(9, button = $$props.button);
    		if ('menu' in $$props) $$invalidate(10, menu = $$props.menu);
    		if ('onMouseDown' in $$props) onMouseDown = $$props.onMouseDown;
    		if ('onInternalKeyDown' in $$props) onInternalKeyDown = $$props.onInternalKeyDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedIndex,
    		isOpen,
    		isEnabled,
    		items,
    		trigger,
    		position,
    		noStyle,
    		customClasses,
    		stack,
    		button,
    		menu,
    		onSelect,
    		onDown,
    		onUp,
    		onToggle,
    		onKeyDown,
    		onKeyUp,
    		onShouldClose,
    		hoverIndex,
    		retainSelection,
    		getIsOpen,
    		open,
    		close,
    		getButton,
    		getHoverIndex,
    		hasCurrentSubMenu,
    		hasPreviousSubMenu,
    		getStack,
    		getActiveStack,
    		getActiveStackIndex,
    		getStackTop,
    		increment,
    		decrement,
    		slots,
    		button_1_binding,
    		push_handler,
    		down_handler,
    		up_handler,
    		toggle_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		mouseover_handler,
    		mouseout_handler,
    		menu_1_binding,
    		$$scope
    	];
    }

    class MenuButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				isEnabled: 2,
    				items: 3,
    				selectedIndex: 0,
    				hoverIndex: 18,
    				trigger: 4,
    				position: 5,
    				isOpen: 1,
    				noStyle: 6,
    				retainSelection: 19,
    				customClasses: 7,
    				getIsOpen: 20,
    				open: 21,
    				close: 22,
    				getButton: 23,
    				getHoverIndex: 24,
    				hasCurrentSubMenu: 25,
    				hasPreviousSubMenu: 26,
    				getStack: 27,
    				getActiveStack: 28,
    				getActiveStackIndex: 29,
    				getStackTop: 30,
    				increment: 31,
    				decrement: 32
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuButton",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[3] === undefined && !('items' in props)) {
    			console.warn("<MenuButton> was created without expected prop 'items'");
    		}
    	}

    	get isEnabled() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverIndex() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverIndex(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noStyle() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noStyle(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get retainSelection() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set retainSelection(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customClasses() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customClasses(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getIsOpen() {
    		return this.$$.ctx[20];
    	}

    	set getIsOpen(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		return this.$$.ctx[21];
    	}

    	set open(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		return this.$$.ctx[22];
    	}

    	set close(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getButton() {
    		return this.$$.ctx[23];
    	}

    	set getButton(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getHoverIndex() {
    		return this.$$.ctx[24];
    	}

    	set getHoverIndex(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasCurrentSubMenu() {
    		return this.$$.ctx[25];
    	}

    	set hasCurrentSubMenu(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasPreviousSubMenu() {
    		return this.$$.ctx[26];
    	}

    	set hasPreviousSubMenu(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getStack() {
    		return this.$$.ctx[27];
    	}

    	set getStack(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getActiveStack() {
    		return this.$$.ctx[28];
    	}

    	set getActiveStack(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getActiveStackIndex() {
    		return this.$$.ctx[29];
    	}

    	set getActiveStackIndex(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getStackTop() {
    		return this.$$.ctx[30];
    	}

    	set getStackTop(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get increment() {
    		return this.$$.ctx[31];
    	}

    	set increment(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get decrement() {
    		return this.$$.ctx[32];
    	}

    	set decrement(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Select.svelte generated by Svelte v3.44.2 */
    const file$6 = "src\\gui\\components\\Select.svelte";

    // (53:2) <MenuButton      isEnabled="{isEnabled}"      items="{items}"      trigger="{'mouseup'}"      selectedIndex="{items.indexOf(selectedItem)}"      retainSelection="{true}"      on:select="{onSelect}">
    function create_default_slot$3(ctx) {
    	let div1;
    	let label;
    	let t0;
    	let div0;
    	let t1;
    	let icon;
    	let current;

    	label = new Label({
    			props: { text: String(/*prompt*/ ctx[3]) },
    			$$inline: true
    		});

    	icon = new Icon({
    			props: { src: "img/icons/select.svg", height: 12 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(label.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "select-separator svelte-1vx5h7g");
    			add_location(div0, file$6, 61, 6, 1664);
    			attr_dev(div1, "class", "select-content svelte-1vx5h7g");
    			add_location(div1, file$6, 59, 4, 1587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(label, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			mount_component(icon, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};
    			if (dirty & /*prompt*/ 8) label_changes.text = String(/*prompt*/ ctx[3]);
    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(label);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(53:2) <MenuButton      isEnabled=\\\"{isEnabled}\\\"      items=\\\"{items}\\\"      trigger=\\\"{'mouseup'}\\\"      selectedIndex=\\\"{items.indexOf(selectedItem)}\\\"      retainSelection=\\\"{true}\\\"      on:select=\\\"{onSelect}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let menubutton;
    	let current;

    	menubutton = new MenuButton({
    			props: {
    				isEnabled: /*isEnabled*/ ctx[0],
    				items: /*items*/ ctx[1],
    				trigger: 'mouseup',
    				selectedIndex: /*items*/ ctx[1].indexOf(/*selectedItem*/ ctx[2]),
    				retainSelection: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton.$on("select", /*onSelect*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menubutton.$$.fragment);
    			attr_dev(div, "class", "select svelte-1vx5h7g");
    			attr_dev(div, "data-component", "select");
    			attr_dev(div, "style", /*style*/ ctx[4]);
    			toggle_class(div, "enabled", /*isEnabled*/ ctx[0]);
    			toggle_class(div, "disabled", !/*isEnabled*/ ctx[0]);
    			add_location(div, file$6, 46, 0, 1246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menubutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menubutton_changes = {};
    			if (dirty & /*isEnabled*/ 1) menubutton_changes.isEnabled = /*isEnabled*/ ctx[0];
    			if (dirty & /*items*/ 2) menubutton_changes.items = /*items*/ ctx[1];
    			if (dirty & /*items, selectedItem*/ 6) menubutton_changes.selectedIndex = /*items*/ ctx[1].indexOf(/*selectedItem*/ ctx[2]);

    			if (dirty & /*$$scope, prompt*/ 1032) {
    				menubutton_changes.$$scope = { dirty, ctx };
    			}

    			menubutton.$set(menubutton_changes);

    			if (!current || dirty & /*style*/ 16) {
    				attr_dev(div, "style", /*style*/ ctx[4]);
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(div, "enabled", /*isEnabled*/ ctx[0]);
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(div, "disabled", !/*isEnabled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(menubutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let selectedItem;
    	let style;
    	let prompt;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	let { isEnabled = true } = $$props;
    	let { items } = $$props;
    	let { width = -1 } = $$props;
    	let { selectedIndex = -1 } = $$props;
    	let { placeholder = "" } = $$props;
    	const dispatch = createEventDispatcher();

    	const onSelect = e => {
    		const item = e.detail;

    		if (selectedItem !== item) {
    			dispatch("change", item);
    		}

    		$$invalidate(2, selectedItem = item);
    	};

    	const writable_props = ['isEnabled', 'items', 'width', 'selectedIndex', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('selectedIndex' in $$props) $$invalidate(7, selectedIndex = $$props.selectedIndex);
    		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Icon,
    		Label,
    		MenuButton,
    		isEnabled,
    		items,
    		width,
    		selectedIndex,
    		placeholder,
    		dispatch,
    		onSelect,
    		selectedItem,
    		prompt,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('selectedIndex' in $$props) $$invalidate(7, selectedIndex = $$props.selectedIndex);
    		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$props.placeholder);
    		if ('selectedItem' in $$props) $$invalidate(2, selectedItem = $$props.selectedItem);
    		if ('prompt' in $$props) $$invalidate(3, prompt = $$props.prompt);
    		if ('style' in $$props) $$invalidate(4, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedIndex, items*/ 130) {
    			$$invalidate(2, selectedItem = selectedIndex > -1 ? items[selectedIndex] : undefined);
    		}

    		if ($$self.$$.dirty & /*width*/ 64) {
    			$$invalidate(4, style = `width:${width === -1 ? "auto" : `${width}px`}`);
    		}

    		if ($$self.$$.dirty & /*selectedItem, placeholder*/ 260) {
    			$$invalidate(3, prompt = selectedItem ? selectedItem.label : placeholder);
    		}
    	};

    	return [
    		isEnabled,
    		items,
    		selectedItem,
    		prompt,
    		style,
    		onSelect,
    		width,
    		selectedIndex,
    		placeholder
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			isEnabled: 0,
    			items: 1,
    			width: 6,
    			selectedIndex: 7,
    			placeholder: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[1] === undefined && !('items' in props)) {
    			console.warn("<Select> was created without expected prop 'items'");
    		}
    	}

    	get isEnabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\ScrollBar.svelte generated by Svelte v3.44.2 */
    const file$5 = "src\\gui\\components\\ScrollBar.svelte";

    // (254:4) {#if isEnabled}
    function create_if_block$4(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "scrollbar-thumb svelte-jmfupb");
    			attr_dev(div, "style", /*thumbStyle*/ ctx[6]);
    			add_location(div, file$5, 254, 6, 7337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "mousedown", /*onThumbMouseDown*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*thumbStyle*/ 64) {
    				attr_dev(div, "style", /*thumbStyle*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(254:4) {#if isEnabled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let div2_resize_listener;
    	let div3_tabindex_value;
    	let mounted;
    	let dispose;
    	let if_block = /*isEnabled*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "scrollbar-track-upper svelte-jmfupb");
    			attr_dev(div0, "style", /*trackUpperStyle*/ ctx[5]);
    			add_location(div0, file$5, 248, 4, 7175);
    			attr_dev(div1, "class", "scrollbar-track-lower svelte-jmfupb");
    			attr_dev(div1, "style", /*trackLowerStyle*/ ctx[4]);
    			add_location(div1, file$5, 260, 4, 7479);
    			attr_dev(div2, "class", "scrollbar-track svelte-jmfupb");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[20].call(div2));
    			add_location(div2, file$5, 244, 2, 7059);
    			attr_dev(div3, "class", "scrollbar svelte-jmfupb");
    			attr_dev(div3, "style", /*style*/ ctx[7]);
    			attr_dev(div3, "data-component", "scrollbar");
    			attr_dev(div3, "data-direction", /*direction*/ ctx[1]);
    			attr_dev(div3, "tabindex", div3_tabindex_value = /*isEnabled*/ ctx[0] ? 0 : -1);
    			toggle_class(div3, "vertical", /*direction*/ ctx[1] === 'vertical');
    			toggle_class(div3, "horizontal", /*direction*/ ctx[1] === 'horizontal');
    			toggle_class(div3, "enabled", /*isEnabled*/ ctx[0]);
    			toggle_class(div3, "disabled", !/*isEnabled*/ ctx[0]);
    			add_location(div3, file$5, 232, 0, 6694);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[20].bind(div2));

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mousedown", /*onTrackUpperMouseDown*/ ctx[8], false, false, false),
    					listen_dev(div1, "mousedown", /*onTrackLowerMouseDown*/ ctx[9], false, false, false),
    					listen_dev(div3, "keydown", /*onKeyDown*/ ctx[11], false, false, false),
    					listen_dev(div3, "wheel", /*onMouseWheel*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*trackUpperStyle*/ 32) {
    				attr_dev(div0, "style", /*trackUpperStyle*/ ctx[5]);
    			}

    			if (/*isEnabled*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div2, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*trackLowerStyle*/ 16) {
    				attr_dev(div1, "style", /*trackLowerStyle*/ ctx[4]);
    			}

    			if (dirty & /*style*/ 128) {
    				attr_dev(div3, "style", /*style*/ ctx[7]);
    			}

    			if (dirty & /*direction*/ 2) {
    				attr_dev(div3, "data-direction", /*direction*/ ctx[1]);
    			}

    			if (dirty & /*isEnabled*/ 1 && div3_tabindex_value !== (div3_tabindex_value = /*isEnabled*/ ctx[0] ? 0 : -1)) {
    				attr_dev(div3, "tabindex", div3_tabindex_value);
    			}

    			if (dirty & /*direction*/ 2) {
    				toggle_class(div3, "vertical", /*direction*/ ctx[1] === 'vertical');
    			}

    			if (dirty & /*direction*/ 2) {
    				toggle_class(div3, "horizontal", /*direction*/ ctx[1] === 'horizontal');
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(div3, "enabled", /*isEnabled*/ ctx[0]);
    			}

    			if (dirty & /*isEnabled*/ 1) {
    				toggle_class(div3, "disabled", !/*isEnabled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			div2_resize_listener();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const scrollSize = 20;
    const longPressInitialDelay = 250;
    const longPressRepeatInterval = 100;

    function instance$6($$self, $$props, $$invalidate) {
    	let style;
    	let thumbPos;
    	let thumbStyle;
    	let trackUpperStyle;
    	let trackLowerStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollBar', slots, []);
    	const dispatch = createEventDispatcher();
    	let { isEnabled = true } = $$props;
    	let { direction } = $$props;
    	let { value } = $$props;
    	let { thumbSize = scrollSize } = $$props;
    	let { incrementSmall = 0.1 } = $$props;
    	let { incrementLarge = 0.3 } = $$props;
    	let { size = -1 } = $$props;
    	const isHorizontal = direction === "horizontal";
    	let trackWidth;
    	let trackHeight;
    	let trackSize;
    	let dragThumbPos;
    	let dragMousedown = { x: 0, y: 0 };
    	let longPressStartTimeout;
    	let longPressInterval;

    	function setValue(newValue) {
    		$$invalidate(13, value = Math.max(0, Math.min(1, newValue)));
    		dispatch("change", value);
    		return value;
    	}

    	function handleLongPress(increment) {
    		const clearStartTimeout = () => {
    			clearTimeout(longPressStartTimeout);
    			window.removeEventListener("mouseup", clearStartTimeout);
    		};

    		window.addEventListener("mouseup", clearStartTimeout);

    		longPressStartTimeout = setTimeout(
    			() => {
    				const clearPressInterval = () => {
    					clearInterval(longPressInterval);
    					window.removeEventListener("mouseup", clearPressInterval);
    				};

    				window.addEventListener("mouseup", clearPressInterval);

    				longPressInterval = setInterval(
    					() => {
    						setValue(value + increment);
    					},
    					longPressRepeatInterval
    				);
    			},
    			longPressInitialDelay
    		);
    	}

    	const onTrackUpperMouseDown = e => {
    		if (!isEnabled) {
    			return;
    		}

    		const increment = e.shiftKey ? incrementLarge : incrementSmall;
    		setValue(value - increment);
    		handleLongPress(increment * -1);
    	};

    	const onTrackLowerMouseDown = e => {
    		if (!isEnabled) {
    			return;
    		}

    		const increment = e.shiftKey ? incrementLarge : incrementSmall;
    		setValue(value + increment);
    		handleLongPress(increment);
    	};

    	const onThumbMouseDown = e => {
    		if (!isEnabled) {
    			return;
    		}

    		const onMouseMove = e => {
    			const delta = isHorizontal
    			? e.clientX - dragMousedown.x
    			: e.clientY - dragMousedown.y;

    			const newThumbPos = dragThumbPos + delta;
    			setValue(newThumbPos / (trackSize - thumbSize));
    		};

    		const onMouseUp = e => {
    			window.removeEventListener("mousemove", onMouseMove);
    			window.removeEventListener("mouseup", onMouseUp);
    		};

    		dragThumbPos = thumbPos;
    		dragMousedown.x = e.clientX;
    		dragMousedown.y = e.clientY;
    		window.addEventListener("mousemove", onMouseMove);
    		window.addEventListener("mouseup", onMouseUp);
    	};

    	const onKeyDown = e => {
    		if (!isEnabled) {
    			return;
    		}

    		const { key } = e;

    		if (isArrowKey(key)) {
    			if (isScrollUpKey(key)) {
    				setValue(value - incrementSmall);
    			} else if (isScrollDownKey(key)) {
    				setValue(value + incrementSmall);
    			}

    			e.preventDefault();
    		}
    	};

    	const onMouseWheel = e => {
    		const { deltaX, deltaY } = e;

    		if (isHorizontal) {
    			if (deltaX > 0) {
    				setValue(value - incrementSmall);
    			} else if (deltaX < 0) {
    				setValue(value + incrementSmall);
    			}
    		} else {
    			if (deltaY < 0) {
    				setValue(value - incrementSmall);
    			} else if (deltaY > 0) {
    				setValue(value + incrementSmall);
    			}
    		}

    		e.preventDefault();
    	};

    	const writable_props = [
    		'isEnabled',
    		'direction',
    		'value',
    		'thumbSize',
    		'incrementSmall',
    		'incrementLarge',
    		'size'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollBar> was created with unknown prop '${key}'`);
    	});

    	function div2_elementresize_handler() {
    		trackWidth = this.clientWidth;
    		trackHeight = this.clientHeight;
    		$$invalidate(2, trackWidth);
    		$$invalidate(3, trackHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    		if ('value' in $$props) $$invalidate(13, value = $$props.value);
    		if ('thumbSize' in $$props) $$invalidate(14, thumbSize = $$props.thumbSize);
    		if ('incrementSmall' in $$props) $$invalidate(15, incrementSmall = $$props.incrementSmall);
    		if ('incrementLarge' in $$props) $$invalidate(16, incrementLarge = $$props.incrementLarge);
    		if ('size' in $$props) $$invalidate(17, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		scrollSize,
    		longPressInitialDelay,
    		longPressRepeatInterval,
    		createEventDispatcher,
    		isArrowKey,
    		isScrollDownKey,
    		isScrollUpKey,
    		dispatch,
    		isEnabled,
    		direction,
    		value,
    		thumbSize,
    		incrementSmall,
    		incrementLarge,
    		size,
    		isHorizontal,
    		trackWidth,
    		trackHeight,
    		trackSize,
    		dragThumbPos,
    		dragMousedown,
    		longPressStartTimeout,
    		longPressInterval,
    		setValue,
    		handleLongPress,
    		onTrackUpperMouseDown,
    		onTrackLowerMouseDown,
    		onThumbMouseDown,
    		onKeyDown,
    		onMouseWheel,
    		thumbPos,
    		trackLowerStyle,
    		trackUpperStyle,
    		thumbStyle,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('isEnabled' in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    		if ('value' in $$props) $$invalidate(13, value = $$props.value);
    		if ('thumbSize' in $$props) $$invalidate(14, thumbSize = $$props.thumbSize);
    		if ('incrementSmall' in $$props) $$invalidate(15, incrementSmall = $$props.incrementSmall);
    		if ('incrementLarge' in $$props) $$invalidate(16, incrementLarge = $$props.incrementLarge);
    		if ('size' in $$props) $$invalidate(17, size = $$props.size);
    		if ('trackWidth' in $$props) $$invalidate(2, trackWidth = $$props.trackWidth);
    		if ('trackHeight' in $$props) $$invalidate(3, trackHeight = $$props.trackHeight);
    		if ('trackSize' in $$props) $$invalidate(18, trackSize = $$props.trackSize);
    		if ('dragThumbPos' in $$props) dragThumbPos = $$props.dragThumbPos;
    		if ('dragMousedown' in $$props) dragMousedown = $$props.dragMousedown;
    		if ('longPressStartTimeout' in $$props) longPressStartTimeout = $$props.longPressStartTimeout;
    		if ('longPressInterval' in $$props) longPressInterval = $$props.longPressInterval;
    		if ('thumbPos' in $$props) $$invalidate(19, thumbPos = $$props.thumbPos);
    		if ('trackLowerStyle' in $$props) $$invalidate(4, trackLowerStyle = $$props.trackLowerStyle);
    		if ('trackUpperStyle' in $$props) $$invalidate(5, trackUpperStyle = $$props.trackUpperStyle);
    		if ('thumbStyle' in $$props) $$invalidate(6, thumbStyle = $$props.thumbStyle);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 131072) {
    			$$invalidate(7, style = `${isHorizontal ? "width" : "height"}:${size === -1 ? "100%" : `${size}px`}`);
    		}

    		if ($$self.$$.dirty & /*trackWidth, trackHeight*/ 12) {
    			$$invalidate(18, trackSize = isHorizontal ? trackWidth : trackHeight);
    		}

    		if ($$self.$$.dirty & /*trackSize, thumbSize, value*/ 286720) {
    			$$invalidate(19, thumbPos = (trackSize - thumbSize) * value);
    		}

    		if ($$self.$$.dirty & /*thumbPos, thumbSize*/ 540672) {
    			$$invalidate(6, thumbStyle = isHorizontal
    			? `left:${thumbPos}px;width:${thumbSize}px;`
    			: `top:${thumbPos}px;height:${thumbSize}px;`);
    		}

    		if ($$self.$$.dirty & /*thumbPos*/ 524288) {
    			$$invalidate(5, trackUpperStyle = isHorizontal
    			? `width:${thumbPos}px`
    			: `height:${thumbPos}px`);
    		}

    		if ($$self.$$.dirty & /*thumbPos, thumbSize, trackSize*/ 802816) {
    			$$invalidate(4, trackLowerStyle = isHorizontal
    			? `left:${thumbPos + thumbSize}px;width:${trackSize - (thumbPos + thumbSize)}px`
    			: `top:${thumbPos + thumbSize}px;height:${trackSize - (thumbPos + thumbSize)}px`);
    		}
    	};

    	return [
    		isEnabled,
    		direction,
    		trackWidth,
    		trackHeight,
    		trackLowerStyle,
    		trackUpperStyle,
    		thumbStyle,
    		style,
    		onTrackUpperMouseDown,
    		onTrackLowerMouseDown,
    		onThumbMouseDown,
    		onKeyDown,
    		onMouseWheel,
    		value,
    		thumbSize,
    		incrementSmall,
    		incrementLarge,
    		size,
    		trackSize,
    		thumbPos,
    		div2_elementresize_handler
    	];
    }

    class ScrollBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			isEnabled: 0,
    			direction: 1,
    			value: 13,
    			thumbSize: 14,
    			incrementSmall: 15,
    			incrementLarge: 16,
    			size: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollBar",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*direction*/ ctx[1] === undefined && !('direction' in props)) {
    			console.warn("<ScrollBar> was created without expected prop 'direction'");
    		}

    		if (/*value*/ ctx[13] === undefined && !('value' in props)) {
    			console.warn("<ScrollBar> was created without expected prop 'value'");
    		}
    	}

    	get isEnabled() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbSize() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbSize(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get incrementSmall() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set incrementSmall(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get incrementLarge() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set incrementLarge(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ScrollBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ScrollBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\ScrollView.svelte generated by Svelte v3.44.2 */
    const file$4 = "src\\gui\\components\\ScrollView.svelte";

    // (131:4) {#if scroll === "vertical" || scroll === "both"}
    function create_if_block_1$1(ctx) {
    	let scrollbar;
    	let current;

    	scrollbar = new ScrollBar({
    			props: {
    				isEnabled: /*isVScrollEnabled*/ ctx[12],
    				direction: "vertical",
    				value: /*vScroll*/ ctx[1],
    				thumbSize: /*vThumbSize*/ ctx[14],
    				incrementSmall: /*vIncrementSmall*/ ctx[5],
    				incrementLarge: /*vIncrementLarge*/ ctx[6]
    			},
    			$$inline: true
    		});

    	scrollbar.$on("change", /*onVScrollChange*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(scrollbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scrollbar_changes = {};
    			if (dirty[0] & /*isVScrollEnabled*/ 4096) scrollbar_changes.isEnabled = /*isVScrollEnabled*/ ctx[12];
    			if (dirty[0] & /*vScroll*/ 2) scrollbar_changes.value = /*vScroll*/ ctx[1];
    			if (dirty[0] & /*vThumbSize*/ 16384) scrollbar_changes.thumbSize = /*vThumbSize*/ ctx[14];
    			if (dirty[0] & /*vIncrementSmall*/ 32) scrollbar_changes.incrementSmall = /*vIncrementSmall*/ ctx[5];
    			if (dirty[0] & /*vIncrementLarge*/ 64) scrollbar_changes.incrementLarge = /*vIncrementLarge*/ ctx[6];
    			scrollbar.$set(scrollbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(131:4) {#if scroll === \\\"vertical\\\" || scroll === \\\"both\\\"}",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#if scroll === "horizontal" || scroll === "both"}
    function create_if_block$3(ctx) {
    	let scrollbar;
    	let current;

    	scrollbar = new ScrollBar({
    			props: {
    				isEnabled: /*isHScrollEnabled*/ ctx[13],
    				direction: "horizontal",
    				value: /*hScroll*/ ctx[0],
    				thumbSize: /*hThumbSize*/ ctx[15],
    				incrementSmall: /*hIncrementSmall*/ ctx[3],
    				incrementLarge: /*hIncrementLarge*/ ctx[4]
    			},
    			$$inline: true
    		});

    	scrollbar.$on("change", /*onHScrollChange*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(scrollbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scrollbar_changes = {};
    			if (dirty[0] & /*isHScrollEnabled*/ 8192) scrollbar_changes.isEnabled = /*isHScrollEnabled*/ ctx[13];
    			if (dirty[0] & /*hScroll*/ 1) scrollbar_changes.value = /*hScroll*/ ctx[0];
    			if (dirty[0] & /*hThumbSize*/ 32768) scrollbar_changes.thumbSize = /*hThumbSize*/ ctx[15];
    			if (dirty[0] & /*hIncrementSmall*/ 8) scrollbar_changes.incrementSmall = /*hIncrementSmall*/ ctx[3];
    			if (dirty[0] & /*hIncrementLarge*/ 16) scrollbar_changes.incrementLarge = /*hIncrementLarge*/ ctx[4];
    			scrollbar.$set(scrollbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(142:2) {#if scroll === \\\"horizontal\\\" || scroll === \\\"both\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let div0_resize_listener;
    	let div1_resize_listener;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[30], null);
    	let if_block0 = (/*scroll*/ ctx[2] === "vertical" || /*scroll*/ ctx[2] === "both") && create_if_block_1$1(ctx);
    	let if_block1 = (/*scroll*/ ctx[2] === "horizontal" || /*scroll*/ ctx[2] === "both") && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "scrollview-view-wrapper svelte-v8iviv");
    			attr_dev(div0, "style", /*viewWrapperStyle*/ ctx[16]);
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[32].call(div0));
    			add_location(div0, file$4, 121, 8, 3806);
    			attr_dev(div1, "class", "scrollview-view svelte-v8iviv");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[33].call(div1));
    			toggle_class(div1, "center", /*align*/ ctx[7] === 'center');
    			add_location(div1, file$4, 115, 6, 3596);
    			attr_dev(div2, "class", "scrollview-content svelte-v8iviv");
    			add_location(div2, file$4, 114, 4, 3556);
    			attr_dev(div3, "class", "scrollview-row svelte-v8iviv");
    			add_location(div3, file$4, 113, 2, 3522);
    			attr_dev(div4, "class", "scrollview svelte-v8iviv");
    			attr_dev(div4, "data-component", "scrollview");
    			attr_dev(div4, "style", /*style*/ ctx[17]);
    			add_location(div4, file$4, 112, 0, 3450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[32].bind(div0));
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[33].bind(div1));
    			append_dev(div3, t0);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div4, t1);
    			if (if_block1) if_block1.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "wheel", /*onMouseWheel*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 1073741824)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[30],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[30])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[30], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*viewWrapperStyle*/ 65536) {
    				attr_dev(div0, "style", /*viewWrapperStyle*/ ctx[16]);
    			}

    			if (dirty[0] & /*align*/ 128) {
    				toggle_class(div1, "center", /*align*/ ctx[7] === 'center');
    			}

    			if (/*scroll*/ ctx[2] === "vertical" || /*scroll*/ ctx[2] === "both") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*scroll*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*scroll*/ ctx[2] === "horizontal" || /*scroll*/ ctx[2] === "both") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*scroll*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*style*/ 131072) {
    				attr_dev(div4, "style", /*style*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (default_slot) default_slot.d(detaching);
    			div0_resize_listener();
    			div1_resize_listener();
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let widthPlusScrollBars;
    	let heightPlusScrollBars;
    	let widthStyle;
    	let heightStyle;
    	let style;
    	let isHScrollEnabled;
    	let isVScrollEnabled;
    	let hasDimensions;
    	let hOffset;
    	let vOffset;
    	let viewWrapperStyle;
    	let hThumbSize;
    	let vThumbSize;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollView', slots, ['default']);
    	let { scroll = "both" } = $$props;
    	let { width = -1 } = $$props;
    	let { height = -1 } = $$props;
    	let { hScroll = 0 } = $$props;
    	let { vScroll = 0 } = $$props;
    	let { hIncrementSmall = 0.1 } = $$props;
    	let { hIncrementLarge = 0.3 } = $$props;
    	let { vIncrementSmall = 0.1 } = $$props;
    	let { vIncrementLarge = 0.3 } = $$props;
    	let { align = "origin" } = $$props;
    	const dispatch = createEventDispatcher();
    	let viewWidth = -1;
    	let viewHeight = -1;
    	let contentWidth = -1;
    	let contentHeight = -1;
    	const onVScrollChange = e => $$invalidate(1, vScroll = e.detail);
    	const onHScrollChange = e => $$invalidate(0, hScroll = e.detail);

    	const onMouseWheel = e => {
    		const { deltaX, deltaY } = e;

    		if (deltaX > 0) {
    			$$invalidate(0, hScroll = Math.max(0, hScroll - hIncrementSmall));
    		} else if (deltaX < 0) {
    			$$invalidate(0, hScroll = Math.min(1, hScroll + hIncrementSmall));
    		}

    		if (deltaY < 0) {
    			$$invalidate(1, vScroll = Math.max(0, vScroll - vIncrementSmall));
    		} else if (deltaY > 0) {
    			$$invalidate(1, vScroll = Math.min(1, vScroll + vIncrementSmall));
    		}

    		e.preventDefault();
    	};

    	const writable_props = [
    		'scroll',
    		'width',
    		'height',
    		'hScroll',
    		'vScroll',
    		'hIncrementSmall',
    		'hIncrementLarge',
    		'vIncrementSmall',
    		'vIncrementLarge',
    		'align'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollView> was created with unknown prop '${key}'`);
    	});

    	function div0_elementresize_handler() {
    		contentWidth = this.clientWidth;
    		contentHeight = this.clientHeight;
    		$$invalidate(10, contentWidth);
    		$$invalidate(11, contentHeight);
    	}

    	function div1_elementresize_handler() {
    		viewWidth = this.clientWidth;
    		viewHeight = this.clientHeight;
    		$$invalidate(8, viewWidth);
    		$$invalidate(9, viewHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('scroll' in $$props) $$invalidate(2, scroll = $$props.scroll);
    		if ('width' in $$props) $$invalidate(21, width = $$props.width);
    		if ('height' in $$props) $$invalidate(22, height = $$props.height);
    		if ('hScroll' in $$props) $$invalidate(0, hScroll = $$props.hScroll);
    		if ('vScroll' in $$props) $$invalidate(1, vScroll = $$props.vScroll);
    		if ('hIncrementSmall' in $$props) $$invalidate(3, hIncrementSmall = $$props.hIncrementSmall);
    		if ('hIncrementLarge' in $$props) $$invalidate(4, hIncrementLarge = $$props.hIncrementLarge);
    		if ('vIncrementSmall' in $$props) $$invalidate(5, vIncrementSmall = $$props.vIncrementSmall);
    		if ('vIncrementLarge' in $$props) $$invalidate(6, vIncrementLarge = $$props.vIncrementLarge);
    		if ('align' in $$props) $$invalidate(7, align = $$props.align);
    		if ('$$scope' in $$props) $$invalidate(30, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		ScrollBar,
    		scrollSize,
    		scroll,
    		width,
    		height,
    		hScroll,
    		vScroll,
    		hIncrementSmall,
    		hIncrementLarge,
    		vIncrementSmall,
    		vIncrementLarge,
    		align,
    		dispatch,
    		viewWidth,
    		viewHeight,
    		contentWidth,
    		contentHeight,
    		onVScrollChange,
    		onHScrollChange,
    		onMouseWheel,
    		hasDimensions,
    		vThumbSize,
    		hThumbSize,
    		vOffset,
    		hOffset,
    		viewWrapperStyle,
    		isVScrollEnabled,
    		isHScrollEnabled,
    		heightStyle,
    		widthStyle,
    		style,
    		heightPlusScrollBars,
    		widthPlusScrollBars
    	});

    	$$self.$inject_state = $$props => {
    		if ('scroll' in $$props) $$invalidate(2, scroll = $$props.scroll);
    		if ('width' in $$props) $$invalidate(21, width = $$props.width);
    		if ('height' in $$props) $$invalidate(22, height = $$props.height);
    		if ('hScroll' in $$props) $$invalidate(0, hScroll = $$props.hScroll);
    		if ('vScroll' in $$props) $$invalidate(1, vScroll = $$props.vScroll);
    		if ('hIncrementSmall' in $$props) $$invalidate(3, hIncrementSmall = $$props.hIncrementSmall);
    		if ('hIncrementLarge' in $$props) $$invalidate(4, hIncrementLarge = $$props.hIncrementLarge);
    		if ('vIncrementSmall' in $$props) $$invalidate(5, vIncrementSmall = $$props.vIncrementSmall);
    		if ('vIncrementLarge' in $$props) $$invalidate(6, vIncrementLarge = $$props.vIncrementLarge);
    		if ('align' in $$props) $$invalidate(7, align = $$props.align);
    		if ('viewWidth' in $$props) $$invalidate(8, viewWidth = $$props.viewWidth);
    		if ('viewHeight' in $$props) $$invalidate(9, viewHeight = $$props.viewHeight);
    		if ('contentWidth' in $$props) $$invalidate(10, contentWidth = $$props.contentWidth);
    		if ('contentHeight' in $$props) $$invalidate(11, contentHeight = $$props.contentHeight);
    		if ('hasDimensions' in $$props) $$invalidate(23, hasDimensions = $$props.hasDimensions);
    		if ('vThumbSize' in $$props) $$invalidate(14, vThumbSize = $$props.vThumbSize);
    		if ('hThumbSize' in $$props) $$invalidate(15, hThumbSize = $$props.hThumbSize);
    		if ('vOffset' in $$props) $$invalidate(24, vOffset = $$props.vOffset);
    		if ('hOffset' in $$props) $$invalidate(25, hOffset = $$props.hOffset);
    		if ('viewWrapperStyle' in $$props) $$invalidate(16, viewWrapperStyle = $$props.viewWrapperStyle);
    		if ('isVScrollEnabled' in $$props) $$invalidate(12, isVScrollEnabled = $$props.isVScrollEnabled);
    		if ('isHScrollEnabled' in $$props) $$invalidate(13, isHScrollEnabled = $$props.isHScrollEnabled);
    		if ('heightStyle' in $$props) $$invalidate(26, heightStyle = $$props.heightStyle);
    		if ('widthStyle' in $$props) $$invalidate(27, widthStyle = $$props.widthStyle);
    		if ('style' in $$props) $$invalidate(17, style = $$props.style);
    		if ('heightPlusScrollBars' in $$props) $$invalidate(28, heightPlusScrollBars = $$props.heightPlusScrollBars);
    		if ('widthPlusScrollBars' in $$props) $$invalidate(29, widthPlusScrollBars = $$props.widthPlusScrollBars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*width*/ 2097152) {
    			$$invalidate(29, widthPlusScrollBars = width + scrollSize);
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 4194304) {
    			$$invalidate(28, heightPlusScrollBars = height + scrollSize);
    		}

    		if ($$self.$$.dirty[0] & /*width, widthPlusScrollBars*/ 538968064) {
    			$$invalidate(27, widthStyle = width > -1
    			? `width:${widthPlusScrollBars}px;max-width:${widthPlusScrollBars}px;min-width:${widthPlusScrollBars}px;`
    			: ``);
    		}

    		if ($$self.$$.dirty[0] & /*height, heightPlusScrollBars*/ 272629760) {
    			$$invalidate(26, heightStyle = height > -1
    			? `height:${heightPlusScrollBars}px;max-height:${heightPlusScrollBars}px;min-height:${heightPlusScrollBars}px;`
    			: ``);
    		}

    		if ($$self.$$.dirty[0] & /*widthStyle, heightStyle*/ 201326592) {
    			$$invalidate(17, style = `${widthStyle}${heightStyle}`);
    		}

    		if ($$self.$$.dirty[0] & /*viewWidth, contentWidth*/ 1280) {
    			$$invalidate(13, isHScrollEnabled = viewWidth < contentWidth);
    		}

    		if ($$self.$$.dirty[0] & /*viewHeight, contentHeight*/ 2560) {
    			$$invalidate(12, isVScrollEnabled = viewHeight < contentHeight);
    		}

    		if ($$self.$$.dirty[0] & /*viewWidth*/ 256) {
    			$$invalidate(23, hasDimensions = viewWidth > -1);
    		}

    		if ($$self.$$.dirty[0] & /*hasDimensions, isHScrollEnabled, contentWidth, viewWidth, hScroll*/ 8398081) {
    			$$invalidate(25, hOffset = hasDimensions && isHScrollEnabled
    			? Math.round((contentWidth - viewWidth) * hScroll * -1)
    			: 0);
    		}

    		if ($$self.$$.dirty[0] & /*hasDimensions, isVScrollEnabled, contentHeight, viewHeight, vScroll*/ 8395266) {
    			$$invalidate(24, vOffset = hasDimensions && isVScrollEnabled
    			? Math.round((contentHeight - viewHeight) * vScroll * -1)
    			: 0);
    		}

    		if ($$self.$$.dirty[0] & /*hOffset, vOffset*/ 50331648) {
    			$$invalidate(16, viewWrapperStyle = `left:${hOffset}px;top:${vOffset}px;`);
    		}

    		if ($$self.$$.dirty[0] & /*hasDimensions, contentWidth, viewWidth*/ 8389888) {
    			$$invalidate(15, hThumbSize = hasDimensions
    			? Math.max(scrollSize, (contentWidth - viewWidth) * (viewWidth / contentWidth))
    			: scrollSize);
    		}

    		if ($$self.$$.dirty[0] & /*hasDimensions, contentHeight, viewHeight*/ 8391168) {
    			$$invalidate(14, vThumbSize = hasDimensions
    			? Math.max(scrollSize, (contentHeight - viewHeight) * (viewHeight / contentHeight))
    			: scrollSize);
    		}
    	};

    	return [
    		hScroll,
    		vScroll,
    		scroll,
    		hIncrementSmall,
    		hIncrementLarge,
    		vIncrementSmall,
    		vIncrementLarge,
    		align,
    		viewWidth,
    		viewHeight,
    		contentWidth,
    		contentHeight,
    		isVScrollEnabled,
    		isHScrollEnabled,
    		vThumbSize,
    		hThumbSize,
    		viewWrapperStyle,
    		style,
    		onVScrollChange,
    		onHScrollChange,
    		onMouseWheel,
    		width,
    		height,
    		hasDimensions,
    		vOffset,
    		hOffset,
    		heightStyle,
    		widthStyle,
    		heightPlusScrollBars,
    		widthPlusScrollBars,
    		$$scope,
    		slots,
    		div0_elementresize_handler,
    		div1_elementresize_handler
    	];
    }

    class ScrollView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				scroll: 2,
    				width: 21,
    				height: 22,
    				hScroll: 0,
    				vScroll: 1,
    				hIncrementSmall: 3,
    				hIncrementLarge: 4,
    				vIncrementSmall: 5,
    				vIncrementLarge: 6,
    				align: 7
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollView",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get scroll() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scroll(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hScroll() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hScroll(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vScroll() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vScroll(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hIncrementSmall() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hIncrementSmall(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hIncrementLarge() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hIncrementLarge(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vIncrementSmall() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vIncrementSmall(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vIncrementLarge() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vIncrementLarge(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<ScrollView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<ScrollView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\MenuBar.svelte generated by Svelte v3.44.2 */
    const file$3 = "src\\gui\\components\\MenuBar.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].label;
    	child_ctx[15] = list[i].items;
    	child_ctx[16] = list;
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (100:6) <MenuButton          bind:this="{menuButtons[i]}"          items="{menu}"          noStyle="{true}"          customClasses="{{ down: 'menubar-down' }}"          trigger="mouseup"          on:keydown="{onKeyDown}"          on:keyup="{onKeyUp}"          on:focus="{onFocusOrOpen(i)}"          on:open="{onFocusOrOpen(i)}"          on:select="{onSelect}">
    function create_default_slot$2(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: /*label*/ ctx[14], fontSize: 11 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};
    			if (dirty & /*items*/ 1) label_changes.text = /*label*/ ctx[14];
    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(100:6) <MenuButton          bind:this=\\\"{menuButtons[i]}\\\"          items=\\\"{menu}\\\"          noStyle=\\\"{true}\\\"          customClasses=\\\"{{ down: 'menubar-down' }}\\\"          trigger=\\\"mouseup\\\"          on:keydown=\\\"{onKeyDown}\\\"          on:keyup=\\\"{onKeyUp}\\\"          on:focus=\\\"{onFocusOrOpen(i)}\\\"          on:open=\\\"{onFocusOrOpen(i)}\\\"          on:select=\\\"{onSelect}\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:2) {#each items as { label, items: menu }
    function create_each_block$1(ctx) {
    	let li;
    	let menubutton;
    	let i = /*i*/ ctx[17];
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const assign_menubutton = () => /*menubutton_binding*/ ctx[8](menubutton, i);
    	const unassign_menubutton = () => /*menubutton_binding*/ ctx[8](null, i);

    	let menubutton_props = {
    		items: /*menu*/ ctx[15],
    		noStyle: true,
    		customClasses: { down: 'menubar-down' },
    		trigger: "mouseup",
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	menubutton = new MenuButton({ props: menubutton_props, $$inline: true });
    	assign_menubutton();
    	menubutton.$on("keydown", /*onKeyDown*/ ctx[4]);
    	menubutton.$on("keyup", /*onKeyUp*/ ctx[5]);
    	menubutton.$on("focus", /*onFocusOrOpen*/ ctx[6](/*i*/ ctx[17]));
    	menubutton.$on("open", /*onFocusOrOpen*/ ctx[6](/*i*/ ctx[17]));
    	menubutton.$on("select", /*onSelect*/ ctx[7]);
    	const assign_li = () => /*li_binding*/ ctx[9](li, i);
    	const unassign_li = () => /*li_binding*/ ctx[9](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(menubutton.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "svelte-zwvu8n");
    			add_location(li, file$3, 98, 4, 2751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(menubutton, li, null);
    			append_dev(li, t);
    			assign_li();
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "mouseover", /*onMouseOver*/ ctx[3](/*i*/ ctx[17]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (i !== /*i*/ ctx[17]) {
    				unassign_menubutton();
    				i = /*i*/ ctx[17];
    				assign_menubutton();
    			}

    			const menubutton_changes = {};
    			if (dirty & /*items*/ 1) menubutton_changes.items = /*menu*/ ctx[15];

    			if (dirty & /*$$scope, items*/ 262145) {
    				menubutton_changes.$$scope = { dirty, ctx };
    			}

    			menubutton.$set(menubutton_changes);

    			if (i !== /*i*/ ctx[17]) {
    				unassign_li();
    				i = /*i*/ ctx[17];
    				assign_li();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_menubutton();
    			destroy_component(menubutton);
    			unassign_li();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(97:2) {#each items as { label, items: menu }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let ul;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "menubar svelte-zwvu8n");
    			attr_dev(ul, "data-component", "menubar");
    			add_location(ul, file$3, 95, 0, 2592);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*liElements, onMouseOver, items, menuButtons, onKeyDown, onKeyUp, onFocusOrOpen, onSelect*/ 255) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuBar', slots, []);
    	let { items } = $$props;
    	const dispatch = createEventDispatcher();
    	let currentIndex = -1;
    	let menuButtons = [];
    	let liElements = [];

    	function getCurrentMenuButton() {
    		return menuButtons[currentIndex];
    	}

    	function setCurrentIndex(i) {
    		let currentMenuButton = getCurrentMenuButton();
    		const wasOpen = currentMenuButton && currentMenuButton.getIsOpen();

    		if (wasOpen) {
    			currentMenuButton.close();
    		}

    		currentIndex = i;
    		currentMenuButton = getCurrentMenuButton();

    		if (wasOpen) {
    			currentMenuButton.open();
    		}

    		currentMenuButton.getButton().focus();
    	}

    	const onMouseOver = i => e => {
    		if (currentIndex === -1) {
    			setCurrentIndex(i);
    		} else {
    			if (!liElements[currentIndex].contains(e.currentTarget)) {
    				setCurrentIndex(i);
    			}
    		}
    	};

    	const onKeyDown = e => {
    		const { key } = e;
    		const menuButton = getCurrentMenuButton();

    		if (key === "ArrowLeft" && currentIndex >= 0) {
    			if (!(menuButton.hasPreviousSubMenu() && menuButton.getStack().length > 1)) {
    				if (currentIndex > 0) {
    					setCurrentIndex(currentIndex - 1);
    				}
    			}
    		} else if (key === "ArrowRight" && currentIndex <= items.length - 1) {
    			if (!menuButton.hasCurrentSubMenu()) {
    				if (currentIndex < items.length - 1) {
    					setCurrentIndex(currentIndex + 1);
    				}
    			}
    		}
    	};

    	const onKeyUp = e => {
    		if (isAcceptKey(e.key)) {
    			getCurrentMenuButton().getButton().blur();
    		}
    	};

    	const onFocusOrOpen = i => () => {
    		if (currentIndex !== i) {
    			setCurrentIndex(i);
    		}
    	};

    	const onSelect = e => {
    		dispatch("select", {
    			menu: items[currentIndex],
    			item: e.detail
    		});
    	};

    	const writable_props = ['items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuBar> was created with unknown prop '${key}'`);
    	});

    	function menubutton_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuButtons[i] = $$value;
    			$$invalidate(1, menuButtons);
    		});
    	}

    	function li_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			liElements[i] = $$value;
    			$$invalidate(2, liElements);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		isAcceptKey,
    		Label,
    		MenuButton,
    		items,
    		dispatch,
    		currentIndex,
    		menuButtons,
    		liElements,
    		getCurrentMenuButton,
    		setCurrentIndex,
    		onMouseOver,
    		onKeyDown,
    		onKeyUp,
    		onFocusOrOpen,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('currentIndex' in $$props) currentIndex = $$props.currentIndex;
    		if ('menuButtons' in $$props) $$invalidate(1, menuButtons = $$props.menuButtons);
    		if ('liElements' in $$props) $$invalidate(2, liElements = $$props.liElements);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		items,
    		menuButtons,
    		liElements,
    		onMouseOver,
    		onKeyDown,
    		onKeyUp,
    		onFocusOrOpen,
    		onSelect,
    		menubutton_binding,
    		li_binding
    	];
    }

    class MenuBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuBar",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<MenuBar> was created without expected prop 'items'");
    		}
    	}

    	get items() {
    		throw new Error("<MenuBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<MenuBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Tooltip.svelte generated by Svelte v3.44.2 */
    const file$2 = "src\\gui\\components\\Tooltip.svelte";

    // (82:4) {#if isOpen}
    function create_if_block$2(ctx) {
    	let div;
    	let label;
    	let div_style_value;
    	let current;

    	label = new Label({
    			props: { text: /*text*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(label.$$.fragment);
    			attr_dev(div, "class", "tooltip-label svelte-xhfem5");
    			attr_dev(div, "style", div_style_value = `left:${/*left*/ ctx[6]}px;top:${/*top*/ ctx[5]}px;`);
    			add_location(div, file$2, 82, 6, 2306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(label, div, null);
    			/*div_binding*/ ctx[11](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};
    			if (dirty & /*text*/ 1) label_changes.text = /*text*/ ctx[0];
    			label.$set(label_changes);

    			if (!current || dirty & /*left, top*/ 96 && div_style_value !== (div_style_value = `left:${/*left*/ ctx[6]}px;top:${/*top*/ ctx[5]}px;`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(label);
    			/*div_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(82:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let if_block = /*isOpen*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "tooltip-content svelte-xhfem5");
    			add_location(div0, file$2, 79, 2, 2213);
    			attr_dev(div1, "class", "tooltip svelte-xhfem5");
    			attr_dev(div1, "data-component", "tooltip");
    			attr_dev(div1, "data-position", /*position*/ ctx[1]);
    			add_location(div1, file$2, 73, 0, 2065);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div0, t);
    			if (if_block) if_block.m(div0, null);
    			/*div0_binding*/ ctx[12](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mouseover", /*onMouseOver*/ ctx[7], false, false, false),
    					listen_dev(div1, "mouseout", /*onMouseOut*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isOpen*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*position*/ 2) {
    				attr_dev(div1, "data-position", /*position*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div0_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const staticVar$1 = 500;

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default']);
    	let { text = "foo" } = $$props;
    	let { position = "bottom" } = $$props;
    	let isOpen = false;
    	let contentEl;
    	let labelEl;
    	let timeout;
    	let top;
    	let left;

    	const onMouseOver = () => {
    		if (isOpen) {
    			return;
    		}

    		timeout = setTimeout(() => $$invalidate(2, isOpen = true), 400);
    	};

    	const onMouseOut = () => {
    		clearTimeout(timeout);
    		$$invalidate(2, isOpen = false);
    	};

    	const writable_props = ['text', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			labelEl = $$value;
    			$$invalidate(4, labelEl);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentEl = $$value;
    			$$invalidate(3, contentEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		staticVar: staticVar$1,
    		Label,
    		text,
    		position,
    		isOpen,
    		contentEl,
    		labelEl,
    		timeout,
    		top,
    		left,
    		onMouseOver,
    		onMouseOut
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
    		if ('contentEl' in $$props) $$invalidate(3, contentEl = $$props.contentEl);
    		if ('labelEl' in $$props) $$invalidate(4, labelEl = $$props.labelEl);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    		if ('top' in $$props) $$invalidate(5, top = $$props.top);
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen, contentEl, labelEl, position*/ 30) {
    			{
    				if (isOpen && contentEl && labelEl) {
    					const contentRect = contentEl.getBoundingClientRect();
    					const labelRect = labelEl.getBoundingClientRect();

    					if (position === "bottom") {
    						$$invalidate(5, top = contentRect.height);
    						$$invalidate(6, left = Math.round((contentRect.width - labelRect.width) / 2));
    					} else if (position === "top") {
    						$$invalidate(5, top = contentRect.height * -1);
    						$$invalidate(6, left = Math.round((contentRect.width - labelRect.width) / 2));
    					} else if (position === "left") {
    						$$invalidate(5, top = Math.round((contentRect.height - labelRect.height) / 2));
    						$$invalidate(6, left = labelRect.width * -1);
    					} else if (position === "right") {
    						$$invalidate(5, top = Math.round((contentRect.height - labelRect.height) / 2));
    						$$invalidate(6, left = contentRect.width);
    					}
    				}
    			}
    		}
    	};

    	return [
    		text,
    		position,
    		isOpen,
    		contentEl,
    		labelEl,
    		top,
    		left,
    		onMouseOver,
    		onMouseOut,
    		$$scope,
    		slots,
    		div_binding,
    		div0_binding
    	];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0, position: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get text() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\Panel.svelte generated by Svelte v3.44.2 */
    const file$1 = "src\\gui\\components\\Panel.svelte";

    // (40:2) {#if title}
    function create_if_block_1(ctx) {
    	let div;
    	let label;
    	let current;

    	label = new Label({
    			props: { text: /*title*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(label.$$.fragment);
    			attr_dev(div, "class", "panel-title svelte-1omvica");
    			add_location(div, file$1, 40, 4, 986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(label, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};
    			if (dirty & /*title*/ 1) label_changes.text = /*title*/ ctx[0];
    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(40:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#if menuBar}
    function create_if_block$1(ctx) {
    	let menubar;
    	let current;

    	menubar = new MenuBar({
    			props: { items: /*menuBar*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menubar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menubar_changes = {};
    			if (dirty & /*menuBar*/ 2) menubar_changes.items = /*menuBar*/ ctx[1];
    			menubar.$set(menubar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(43:2) {#if menuBar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let current;
    	let if_block0 = /*title*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = /*menuBar*/ ctx[1] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "panel-content svelte-1omvica");
    			add_location(div0, file$1, 45, 2, 1115);
    			attr_dev(div1, "class", "panel svelte-1omvica");
    			attr_dev(div1, "data-component", "panel");
    			toggle_class(div1, "withTitle", !!/*title*/ ctx[0]);
    			add_location(div1, file$1, 38, 0, 895);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*title*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*menuBar*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*menuBar*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*title*/ 1) {
    				toggle_class(div1, "withTitle", !!/*title*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const staticVar = 500;

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Panel', slots, ['default']);
    	let { title = undefined } = $$props;
    	let { menuBar = undefined } = $$props;
    	const writable_props = ['title', 'menuBar'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('menuBar' in $$props) $$invalidate(1, menuBar = $$props.menuBar);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		staticVar,
    		Label,
    		MenuBar,
    		title,
    		menuBar
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('menuBar' in $$props) $$invalidate(1, menuBar = $$props.menuBar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, menuBar, $$scope, slots];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { title: 0, menuBar: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get title() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuBar() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuBar(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\gui\components\TabDoc.svelte generated by Svelte v3.44.2 */

    // (28:0) {#if visible}
    function create_if_block(ctx) {
    	let panel;
    	let current;

    	panel = new Panel({
    			props: {
    				menuBar: /*menuBar*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(panel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const panel_changes = {};
    			if (dirty & /*menuBar*/ 1) panel_changes.menuBar = /*menuBar*/ ctx[0];

    			if (dirty & /*$$scope*/ 128) {
    				panel_changes.$$scope = { dirty, ctx };
    			}

    			panel.$set(panel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(28:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (29:2) <Panel menuBar="{menuBar}">
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(29:2) <Panel menuBar=\\\"{menuBar}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*visible*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visible*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabDoc', slots, ['default']);
    	let { title = "" } = $$props;
    	let { icon = undefined } = $$props;
    	let { isClosable = true } = $$props;
    	let { menuBar = undefined } = $$props;
    	let { onCanClose = undefined } = $$props;
    	let index = -1;
    	let visible = false;
    	const { registerTab, unregisterTab, isVisible, notifications } = getContext("tabs");

    	const onChange = () => {
    		$$invalidate(1, visible = isVisible(index));
    	};

    	onMount(() => {
    		index = registerTab({ title, icon, isClosable, onCanClose });
    		onChange();
    		notifications.on("change", onChange);
    	});

    	onDestroy(() => {
    		unregisterTab(index);
    		notifications.off("change", onChange);
    	});

    	const writable_props = ['title', 'icon', 'isClosable', 'menuBar', 'onCanClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabDoc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('isClosable' in $$props) $$invalidate(4, isClosable = $$props.isClosable);
    		if ('menuBar' in $$props) $$invalidate(0, menuBar = $$props.menuBar);
    		if ('onCanClose' in $$props) $$invalidate(5, onCanClose = $$props.onCanClose);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		onDestroy,
    		Panel,
    		title,
    		icon,
    		isClosable,
    		menuBar,
    		onCanClose,
    		index,
    		visible,
    		registerTab,
    		unregisterTab,
    		isVisible,
    		notifications,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('isClosable' in $$props) $$invalidate(4, isClosable = $$props.isClosable);
    		if ('menuBar' in $$props) $$invalidate(0, menuBar = $$props.menuBar);
    		if ('onCanClose' in $$props) $$invalidate(5, onCanClose = $$props.onCanClose);
    		if ('index' in $$props) index = $$props.index;
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuBar, visible, title, icon, isClosable, onCanClose, slots, $$scope];
    }

    class TabDoc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			title: 2,
    			icon: 3,
    			isClosable: 4,
    			menuBar: 0,
    			onCanClose: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabDoc",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get title() {
    		throw new Error("<TabDoc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<TabDoc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<TabDoc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<TabDoc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isClosable() {
    		throw new Error("<TabDoc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isClosable(value) {
    		throw new Error("<TabDoc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuBar() {
    		throw new Error("<TabDoc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuBar(value) {
    		throw new Error("<TabDoc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCanClose() {
    		throw new Error("<TabDoc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCanClose(value) {
    		throw new Error("<TabDoc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	child_ctx[68] = i;
    	return child_ctx;
    }

    // (127:4) <Area        >
    function create_default_slot_107(ctx) {
    	let label0;
    	let t;
    	let label1;
    	let current;

    	label0 = new Label({
    			props: { text: "Default" },
    			$$inline: true
    		});

    	label1 = new Label({
    			props: { isEnabled: false, text: "Disabled" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label0.$$.fragment);
    			t = space();
    			create_component(label1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(label1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(label1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_107.name,
    		type: "slot",
    		source: "(127:4) <Area        >",
    		ctx
    	});

    	return block;
    }

    // (131:6) <Events>
    function create_default_slot_106(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Is Link", isLink: true },
    			$$inline: true
    		});

    	label.$on("clicked", /*clicked_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_106.name,
    		type: "slot",
    		source: "(131:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (137:6) <Events mute="{true}">
    function create_default_slot_105(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: {
    				text: "Is Link",
    				isLink: true,
    				isEnabled: false
    			},
    			$$inline: true
    		});

    	label.$on("clicked", /*clicked_handler_1*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_105.name,
    		type: "slot",
    		source: "(137:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:4) <Area>
    function create_default_slot_104(ctx) {
    	let events0;
    	let t;
    	let events1;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_106] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_105] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t = space();
    			create_component(events1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(events1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(events1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_104.name,
    		type: "slot",
    		source: "(130:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (126:2) <Section title="Label">
    function create_default_slot_103(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_107] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_104] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_103.name,
    		type: "slot",
    		source: "(126:2) <Section title=\\\"Label\\\">",
    		ctx
    	});

    	return block;
    }

    // (148:4) <Label text="align: start"        >
    function create_default_slot_102(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_102.name,
    		type: "slot",
    		source: "(148:4) <Label text=\\\"align: start\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (150:4) <Label text="align: center" align="center"        >
    function create_default_slot_101(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_101.name,
    		type: "slot",
    		source: "(150:4) <Label text=\\\"align: center\\\" align=\\\"center\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (152:4) <Label text="align: end" align="end"        >
    function create_default_slot_100(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_100.name,
    		type: "slot",
    		source: "(152:4) <Label text=\\\"align: end\\\" align=\\\"end\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (154:4) <Label text="indent: 5" indent="{5}"        >
    function create_default_slot_99(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_99.name,
    		type: "slot",
    		source: "(154:4) <Label text=\\\"indent: 5\\\" indent=\\\"{5}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (147:2) <Section title="Label.position: left (default)">
    function create_default_slot_98(ctx) {
    	let label0;
    	let t0;
    	let label1;
    	let t1;
    	let label2;
    	let t2;
    	let label3;
    	let current;

    	label0 = new Label({
    			props: {
    				text: "align: start",
    				$$slots: { default: [create_default_slot_102] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label1 = new Label({
    			props: {
    				text: "align: center",
    				align: "center",
    				$$slots: { default: [create_default_slot_101] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label2 = new Label({
    			props: {
    				text: "align: end",
    				align: "end",
    				$$slots: { default: [create_default_slot_100] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label3 = new Label({
    			props: {
    				text: "indent: 5",
    				indent: 5,
    				$$slots: { default: [create_default_slot_99] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label0.$$.fragment);
    			t0 = space();
    			create_component(label1.$$.fragment);
    			t1 = space();
    			create_component(label2.$$.fragment);
    			t2 = space();
    			create_component(label3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(label1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(label2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(label3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label0_changes.$$scope = { dirty, ctx };
    			}

    			label0.$set(label0_changes);
    			const label1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label1_changes.$$scope = { dirty, ctx };
    			}

    			label1.$set(label1_changes);
    			const label2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label2_changes.$$scope = { dirty, ctx };
    			}

    			label2.$set(label2_changes);
    			const label3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label3_changes.$$scope = { dirty, ctx };
    			}

    			label3.$set(label3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			transition_in(label2.$$.fragment, local);
    			transition_in(label3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			transition_out(label2.$$.fragment, local);
    			transition_out(label3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(label1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(label2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(label3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_98.name,
    		type: "slot",
    		source: "(147:2) <Section title=\\\"Label.position: left (default)\\\">",
    		ctx
    	});

    	return block;
    }

    // (159:4) <Label text="align: start" position="right"        >
    function create_default_slot_97(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_97.name,
    		type: "slot",
    		source: "(159:4) <Label text=\\\"align: start\\\" position=\\\"right\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (161:4) <Label text="align: center" position="right" align="center"        >
    function create_default_slot_96(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_96.name,
    		type: "slot",
    		source: "(161:4) <Label text=\\\"align: center\\\" position=\\\"right\\\" align=\\\"center\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (163:4) <Label text="align: end" position="right" align="end"        >
    function create_default_slot_95(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_95.name,
    		type: "slot",
    		source: "(163:4) <Label text=\\\"align: end\\\" position=\\\"right\\\" align=\\\"end\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (165:4) <Label text="indent: 5" position="right" indent="{5}"        >
    function create_default_slot_94(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_94.name,
    		type: "slot",
    		source: "(165:4) <Label text=\\\"indent: 5\\\" position=\\\"right\\\" indent=\\\"{5}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (158:2) <Section title="Label.position: right">
    function create_default_slot_93(ctx) {
    	let label0;
    	let t0;
    	let label1;
    	let t1;
    	let label2;
    	let t2;
    	let label3;
    	let current;

    	label0 = new Label({
    			props: {
    				text: "align: start",
    				position: "right",
    				$$slots: { default: [create_default_slot_97] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label1 = new Label({
    			props: {
    				text: "align: center",
    				position: "right",
    				align: "center",
    				$$slots: { default: [create_default_slot_96] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label2 = new Label({
    			props: {
    				text: "align: end",
    				position: "right",
    				align: "end",
    				$$slots: { default: [create_default_slot_95] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label3 = new Label({
    			props: {
    				text: "indent: 5",
    				position: "right",
    				indent: 5,
    				$$slots: { default: [create_default_slot_94] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label0.$$.fragment);
    			t0 = space();
    			create_component(label1.$$.fragment);
    			t1 = space();
    			create_component(label2.$$.fragment);
    			t2 = space();
    			create_component(label3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(label1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(label2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(label3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label0_changes.$$scope = { dirty, ctx };
    			}

    			label0.$set(label0_changes);
    			const label1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label1_changes.$$scope = { dirty, ctx };
    			}

    			label1.$set(label1_changes);
    			const label2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label2_changes.$$scope = { dirty, ctx };
    			}

    			label2.$set(label2_changes);
    			const label3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label3_changes.$$scope = { dirty, ctx };
    			}

    			label3.$set(label3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			transition_in(label2.$$.fragment, local);
    			transition_in(label3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			transition_out(label2.$$.fragment, local);
    			transition_out(label3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(label1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(label2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(label3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_93.name,
    		type: "slot",
    		source: "(158:2) <Section title=\\\"Label.position: right\\\">",
    		ctx
    	});

    	return block;
    }

    // (170:4) <Label text="align: left" position="top"        >
    function create_default_slot_92(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_92.name,
    		type: "slot",
    		source: "(170:4) <Label text=\\\"align: left\\\" position=\\\"top\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (172:4) <Label text="align: center" position="top" align="center"        >
    function create_default_slot_91(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_91.name,
    		type: "slot",
    		source: "(172:4) <Label text=\\\"align: center\\\" position=\\\"top\\\" align=\\\"center\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (174:4) <Label text="align: end" position="top" align="end"        >
    function create_default_slot_90(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_90.name,
    		type: "slot",
    		source: "(174:4) <Label text=\\\"align: end\\\" position=\\\"top\\\" align=\\\"end\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (176:4) <Label text="indent: 5" position="top" indent="{5}"        >
    function create_default_slot_89(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_89.name,
    		type: "slot",
    		source: "(176:4) <Label text=\\\"indent: 5\\\" position=\\\"top\\\" indent=\\\"{5}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (169:2) <Section title="Label.position: top">
    function create_default_slot_88(ctx) {
    	let label0;
    	let t0;
    	let label1;
    	let t1;
    	let label2;
    	let t2;
    	let label3;
    	let current;

    	label0 = new Label({
    			props: {
    				text: "align: left",
    				position: "top",
    				$$slots: { default: [create_default_slot_92] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label1 = new Label({
    			props: {
    				text: "align: center",
    				position: "top",
    				align: "center",
    				$$slots: { default: [create_default_slot_91] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label2 = new Label({
    			props: {
    				text: "align: end",
    				position: "top",
    				align: "end",
    				$$slots: { default: [create_default_slot_90] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label3 = new Label({
    			props: {
    				text: "indent: 5",
    				position: "top",
    				indent: 5,
    				$$slots: { default: [create_default_slot_89] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label0.$$.fragment);
    			t0 = space();
    			create_component(label1.$$.fragment);
    			t1 = space();
    			create_component(label2.$$.fragment);
    			t2 = space();
    			create_component(label3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(label1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(label2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(label3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label0_changes.$$scope = { dirty, ctx };
    			}

    			label0.$set(label0_changes);
    			const label1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label1_changes.$$scope = { dirty, ctx };
    			}

    			label1.$set(label1_changes);
    			const label2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label2_changes.$$scope = { dirty, ctx };
    			}

    			label2.$set(label2_changes);
    			const label3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label3_changes.$$scope = { dirty, ctx };
    			}

    			label3.$set(label3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			transition_in(label2.$$.fragment, local);
    			transition_in(label3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			transition_out(label2.$$.fragment, local);
    			transition_out(label3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(label1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(label2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(label3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_88.name,
    		type: "slot",
    		source: "(169:2) <Section title=\\\"Label.position: top\\\">",
    		ctx
    	});

    	return block;
    }

    // (181:4) <Label text="align: left" position="bottom"        >
    function create_default_slot_87(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_87.name,
    		type: "slot",
    		source: "(181:4) <Label text=\\\"align: left\\\" position=\\\"bottom\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (183:4) <Label text="align: center" position="bottom" align="center"        >
    function create_default_slot_86(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_86.name,
    		type: "slot",
    		source: "(183:4) <Label text=\\\"align: center\\\" position=\\\"bottom\\\" align=\\\"center\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (185:4) <Label text="align: end" position="bottom" align="end"        >
    function create_default_slot_85(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_85.name,
    		type: "slot",
    		source: "(185:4) <Label text=\\\"align: end\\\" position=\\\"bottom\\\" align=\\\"end\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (187:4) <Label text="indent: 5" position="bottom" indent="{5}"        >
    function create_default_slot_84(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { src: "img/test-small.png", width: 50 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_84.name,
    		type: "slot",
    		source: "(187:4) <Label text=\\\"indent: 5\\\" position=\\\"bottom\\\" indent=\\\"{5}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (180:2) <Section title="Label.position: bottom">
    function create_default_slot_83(ctx) {
    	let label0;
    	let t0;
    	let label1;
    	let t1;
    	let label2;
    	let t2;
    	let label3;
    	let current;

    	label0 = new Label({
    			props: {
    				text: "align: left",
    				position: "bottom",
    				$$slots: { default: [create_default_slot_87] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label1 = new Label({
    			props: {
    				text: "align: center",
    				position: "bottom",
    				align: "center",
    				$$slots: { default: [create_default_slot_86] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label2 = new Label({
    			props: {
    				text: "align: end",
    				position: "bottom",
    				align: "end",
    				$$slots: { default: [create_default_slot_85] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	label3 = new Label({
    			props: {
    				text: "indent: 5",
    				position: "bottom",
    				indent: 5,
    				$$slots: { default: [create_default_slot_84] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label0.$$.fragment);
    			t0 = space();
    			create_component(label1.$$.fragment);
    			t1 = space();
    			create_component(label2.$$.fragment);
    			t2 = space();
    			create_component(label3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(label1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(label2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(label3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label0_changes.$$scope = { dirty, ctx };
    			}

    			label0.$set(label0_changes);
    			const label1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label1_changes.$$scope = { dirty, ctx };
    			}

    			label1.$set(label1_changes);
    			const label2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label2_changes.$$scope = { dirty, ctx };
    			}

    			label2.$set(label2_changes);
    			const label3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				label3_changes.$$scope = { dirty, ctx };
    			}

    			label3.$set(label3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			transition_in(label2.$$.fragment, local);
    			transition_in(label3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			transition_out(label2.$$.fragment, local);
    			transition_out(label3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(label1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(label2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(label3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_83.name,
    		type: "slot",
    		source: "(180:2) <Section title=\\\"Label.position: bottom\\\">",
    		ctx
    	});

    	return block;
    }

    // (193:6) <Events>
    function create_default_slot_82(ctx) {
    	let pushbutton;
    	let current;
    	pushbutton = new PushButton({ props: { label: "Push" }, $$inline: true });
    	pushbutton.$on("push", /*push_handler*/ ctx[10]);
    	pushbutton.$on("down", /*down_handler*/ ctx[11]);
    	pushbutton.$on("up", /*up_handler*/ ctx[12]);
    	pushbutton.$on("click", /*click_handler*/ ctx[13]);
    	pushbutton.$on("longpress", /*longpress_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_82.name,
    		type: "slot",
    		source: "(193:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (202:6) <Events mute="{true}">
    function create_default_slot_81(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: { label: "Push", isEnabled: false },
    			$$inline: true
    		});

    	pushbutton.$on("push", /*push_handler_1*/ ctx[15]);
    	pushbutton.$on("down", /*down_handler_1*/ ctx[16]);
    	pushbutton.$on("up", /*up_handler_1*/ ctx[17]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_81.name,
    		type: "slot",
    		source: "(202:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (211:6) <Events>
    function create_default_slot_80(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: { label: "No Style", noStyle: true },
    			$$inline: true
    		});

    	pushbutton.$on("push", /*push_handler_2*/ ctx[18]);
    	pushbutton.$on("down", /*down_handler_2*/ ctx[19]);
    	pushbutton.$on("up", /*up_handler_2*/ ctx[20]);
    	pushbutton.$on("longpress", /*longpress_handler_1*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_80.name,
    		type: "slot",
    		source: "(211:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (220:6) <Events mute="{true}">
    function create_default_slot_79(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: {
    				isEnabled: false,
    				label: "No Style",
    				noStyle: true
    			},
    			$$inline: true
    		});

    	pushbutton.$on("push", /*push_handler_3*/ ctx[22]);
    	pushbutton.$on("down", /*down_handler_3*/ ctx[23]);
    	pushbutton.$on("up", /*up_handler_3*/ ctx[24]);
    	pushbutton.$on("longpress", /*longpress_handler_2*/ ctx[25]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_79.name,
    		type: "slot",
    		source: "(220:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (192:4) <Area>
    function create_default_slot_78(ctx) {
    	let events0;
    	let t0;
    	let events1;
    	let t1;
    	let pushbutton;
    	let t2;
    	let events2;
    	let t3;
    	let events3;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_82] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_81] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pushbutton = new PushButton({
    			props: { label: "Push it", iconName: "tick" },
    			$$inline: true
    		});

    	events2 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_80] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events3 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_79] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(events1.$$.fragment);
    			t1 = space();
    			create_component(pushbutton.$$.fragment);
    			t2 = space();
    			create_component(events2.$$.fragment);
    			t3 = space();
    			create_component(events3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pushbutton, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(events2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(events3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    			const events2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events2_changes.$$scope = { dirty, ctx };
    			}

    			events2.$set(events2_changes);
    			const events3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events3_changes.$$scope = { dirty, ctx };
    			}

    			events3.$set(events3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(pushbutton.$$.fragment, local);
    			transition_in(events2.$$.fragment, local);
    			transition_in(events3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(pushbutton.$$.fragment, local);
    			transition_out(events2.$$.fragment, local);
    			transition_out(events3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pushbutton, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(events2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(events3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_78.name,
    		type: "slot",
    		source: "(192:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (232:6) <Events>
    function create_default_slot_77(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: {
    				label: "Toggle",
    				iconName: "tick",
    				canToggle: true
    			},
    			$$inline: true
    		});

    	pushbutton.$on("push", /*push_handler_4*/ ctx[26]);
    	pushbutton.$on("down", /*down_handler_4*/ ctx[27]);
    	pushbutton.$on("toggle", /*toggle_handler*/ ctx[28]);
    	pushbutton.$on("up", /*up_handler_4*/ ctx[29]);
    	pushbutton.$on("click", /*click_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_77.name,
    		type: "slot",
    		source: "(232:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (248:6) <Events mute="{true}">
    function create_default_slot_76(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: {
    				isEnabled: false,
    				label: "Toggle",
    				iconName: "tick",
    				canToggle: true,
    				isDown: true
    			},
    			$$inline: true
    		});

    	pushbutton.$on("toggle", /*toggle_handler_1*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_76.name,
    		type: "slot",
    		source: "(248:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (231:4) <Area>
    function create_default_slot_75(ctx) {
    	let events0;
    	let t0;
    	let pushbutton;
    	let t1;
    	let events1;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_77] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pushbutton = new PushButton({
    			props: {
    				label: "Toggle",
    				iconName: "tick",
    				canToggle: true,
    				isDown: true
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_76] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(pushbutton.$$.fragment);
    			t1 = space();
    			create_component(events1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(pushbutton, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(events1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(pushbutton.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(pushbutton.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(pushbutton, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(events1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_75.name,
    		type: "slot",
    		source: "(231:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (258:4) <Area>
    function create_default_slot_74(ctx) {
    	let pushbutton0;
    	let t;
    	let pushbutton1;
    	let current;

    	pushbutton0 = new PushButton({
    			props: {
    				iconName: "play",
    				isRound: true,
    				action: action(/*func*/ ctx[32], 'ctrl+p')
    			},
    			$$inline: true
    		});

    	pushbutton1 = new PushButton({
    			props: {
    				iconName: "record",
    				isRound: true,
    				iconSize: 25,
    				canToggle: true,
    				action: action(/*func_1*/ ctx[33], 'alt+r', { canToggle: true })
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pushbutton0.$$.fragment);
    			t = space();
    			create_component(pushbutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(pushbutton1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton0.$$.fragment, local);
    			transition_in(pushbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton0.$$.fragment, local);
    			transition_out(pushbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(pushbutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_74.name,
    		type: "slot",
    		source: "(258:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (191:2) <Section title="PushButton">
    function create_default_slot_73(ctx) {
    	let area0;
    	let t0;
    	let area1;
    	let t1;
    	let area2;
    	let current;

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_78] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_75] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_74] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t0 = space();
    			create_component(area1.$$.fragment);
    			t1 = space();
    			create_component(area2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    			const area2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area2_changes.$$scope = { dirty, ctx };
    			}

    			area2.$set(area2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(area2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(area2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_73.name,
    		type: "slot",
    		source: "(191:2) <Section title=\\\"PushButton\\\">",
    		ctx
    	});

    	return block;
    }

    // (276:6) <Events          >
    function create_default_slot_72(ctx) {
    	let buttongroup;
    	let current;

    	buttongroup = new ButtonGroup({
    			props: { options: /*buttonGroupOptions*/ ctx[4] },
    			$$inline: true
    		});

    	buttongroup.$on("change", /*change_handler*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(buttongroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttongroup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttongroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_72.name,
    		type: "slot",
    		source: "(276:6) <Events          >",
    		ctx
    	});

    	return block;
    }

    // (281:6) <Events mute="{true}"          >
    function create_default_slot_71(ctx) {
    	let buttongroup;
    	let current;

    	buttongroup = new ButtonGroup({
    			props: {
    				isEnabled: false,
    				selectedIndex: 1,
    				options: /*buttonGroupOptions*/ ctx[4]
    			},
    			$$inline: true
    		});

    	buttongroup.$on("change", /*change_handler_1*/ ctx[35]);

    	const block = {
    		c: function create() {
    			create_component(buttongroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttongroup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttongroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_71.name,
    		type: "slot",
    		source: "(281:6) <Events mute=\\\"{true}\\\"          >",
    		ctx
    	});

    	return block;
    }

    // (288:6) <Events          >
    function create_default_slot_70(ctx) {
    	let buttongroup;
    	let current;

    	buttongroup = new ButtonGroup({
    			props: {
    				options: /*buttonGroupOptions*/ ctx[4],
    				canReset: true
    			},
    			$$inline: true
    		});

    	buttongroup.$on("change", /*change_handler_2*/ ctx[36]);

    	const block = {
    		c: function create() {
    			create_component(buttongroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttongroup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttongroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_70.name,
    		type: "slot",
    		source: "(288:6) <Events          >",
    		ctx
    	});

    	return block;
    }

    // (275:4) <Area>
    function create_default_slot_69(ctx) {
    	let events0;
    	let t0;
    	let events1;
    	let t1;
    	let events2;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_72] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_71] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events2 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_70] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(events1.$$.fragment);
    			t1 = space();
    			create_component(events2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(events2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    			const events2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events2_changes.$$scope = { dirty, ctx };
    			}

    			events2.$set(events2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(events2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(events2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(events2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_69.name,
    		type: "slot",
    		source: "(275:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (274:2) <Section title="ButtonGroup">
    function create_default_slot_68(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_69] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_68.name,
    		type: "slot",
    		source: "(274:2) <Section title=\\\"ButtonGroup\\\">",
    		ctx
    	});

    	return block;
    }

    // (298:4) <Tooltip text="Tooltip">
    function create_default_slot_67(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Bottom" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_67.name,
    		type: "slot",
    		source: "(298:4) <Tooltip text=\\\"Tooltip\\\">",
    		ctx
    	});

    	return block;
    }

    // (299:4) <Tooltip text="Tooltip" position="top">
    function create_default_slot_66(ctx) {
    	let label;
    	let current;
    	label = new Label({ props: { text: "Top" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_66.name,
    		type: "slot",
    		source: "(299:4) <Tooltip text=\\\"Tooltip\\\" position=\\\"top\\\">",
    		ctx
    	});

    	return block;
    }

    // (300:4) <Tooltip text="Tooltip" position="left">
    function create_default_slot_65(ctx) {
    	let label;
    	let current;
    	label = new Label({ props: { text: "Left" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_65.name,
    		type: "slot",
    		source: "(300:4) <Tooltip text=\\\"Tooltip\\\" position=\\\"left\\\">",
    		ctx
    	});

    	return block;
    }

    // (301:4) <Tooltip text="Tooltip" position="right">
    function create_default_slot_64(ctx) {
    	let label;
    	let current;
    	label = new Label({ props: { text: "Right" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_64.name,
    		type: "slot",
    		source: "(301:4) <Tooltip text=\\\"Tooltip\\\" position=\\\"right\\\">",
    		ctx
    	});

    	return block;
    }

    // (302:4) <Tooltip text="Tooltip">
    function create_default_slot_63(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: { label: "Mouse it" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_63.name,
    		type: "slot",
    		source: "(302:4) <Tooltip text=\\\"Tooltip\\\">",
    		ctx
    	});

    	return block;
    }

    // (297:2) <Section title="Tooltip">
    function create_default_slot_62(ctx) {
    	let tooltip0;
    	let t0;
    	let tooltip1;
    	let t1;
    	let tooltip2;
    	let t2;
    	let tooltip3;
    	let t3;
    	let tooltip4;
    	let current;

    	tooltip0 = new Tooltip({
    			props: {
    				text: "Tooltip",
    				$$slots: { default: [create_default_slot_67] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip1 = new Tooltip({
    			props: {
    				text: "Tooltip",
    				position: "top",
    				$$slots: { default: [create_default_slot_66] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip2 = new Tooltip({
    			props: {
    				text: "Tooltip",
    				position: "left",
    				$$slots: { default: [create_default_slot_65] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip3 = new Tooltip({
    			props: {
    				text: "Tooltip",
    				position: "right",
    				$$slots: { default: [create_default_slot_64] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip4 = new Tooltip({
    			props: {
    				text: "Tooltip",
    				$$slots: { default: [create_default_slot_63] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip0.$$.fragment);
    			t0 = space();
    			create_component(tooltip1.$$.fragment);
    			t1 = space();
    			create_component(tooltip2.$$.fragment);
    			t2 = space();
    			create_component(tooltip3.$$.fragment);
    			t3 = space();
    			create_component(tooltip4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tooltip1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tooltip2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tooltip3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(tooltip4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tooltip0_changes.$$scope = { dirty, ctx };
    			}

    			tooltip0.$set(tooltip0_changes);
    			const tooltip1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tooltip1_changes.$$scope = { dirty, ctx };
    			}

    			tooltip1.$set(tooltip1_changes);
    			const tooltip2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tooltip2_changes.$$scope = { dirty, ctx };
    			}

    			tooltip2.$set(tooltip2_changes);
    			const tooltip3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tooltip3_changes.$$scope = { dirty, ctx };
    			}

    			tooltip3.$set(tooltip3_changes);
    			const tooltip4_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tooltip4_changes.$$scope = { dirty, ctx };
    			}

    			tooltip4.$set(tooltip4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip0.$$.fragment, local);
    			transition_in(tooltip1.$$.fragment, local);
    			transition_in(tooltip2.$$.fragment, local);
    			transition_in(tooltip3.$$.fragment, local);
    			transition_in(tooltip4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip0.$$.fragment, local);
    			transition_out(tooltip1.$$.fragment, local);
    			transition_out(tooltip2.$$.fragment, local);
    			transition_out(tooltip3.$$.fragment, local);
    			transition_out(tooltip4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tooltip1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tooltip2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tooltip3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(tooltip4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_62.name,
    		type: "slot",
    		source: "(297:2) <Section title=\\\"Tooltip\\\">",
    		ctx
    	});

    	return block;
    }

    // (307:6) <Events>
    function create_default_slot_61(ctx) {
    	let checkbox;
    	let current;
    	checkbox = new Checkbox({ $$inline: true });
    	checkbox.$on("change", /*change_handler_3*/ ctx[37]);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_61.name,
    		type: "slot",
    		source: "(307:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (311:6) <Events mute="{true}">
    function create_default_slot_60(ctx) {
    	let checkbox;
    	let current;

    	checkbox = new Checkbox({
    			props: { isEnabled: false },
    			$$inline: true
    		});

    	checkbox.$on("change", /*change_handler_4*/ ctx[38]);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_60.name,
    		type: "slot",
    		source: "(311:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (306:4) <Area>
    function create_default_slot_59(ctx) {
    	let events0;
    	let t0;
    	let checkbox0;
    	let t1;
    	let events1;
    	let t2;
    	let checkbox1;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_61] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox0 = new Checkbox({ props: { isDown: true }, $$inline: true });

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_60] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox1 = new Checkbox({
    			props: { isEnabled: false, isDown: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(checkbox0.$$.fragment);
    			t1 = space();
    			create_component(events1.$$.fragment);
    			t2 = space();
    			create_component(checkbox1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(checkbox0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(checkbox1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(checkbox0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(checkbox1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_59.name,
    		type: "slot",
    		source: "(306:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (319:6) <Events>
    function create_default_slot_58(ctx) {
    	let checkbox;
    	let current;
    	checkbox = new Checkbox({ props: { label: "Left" }, $$inline: true });
    	checkbox.$on("change", /*change_handler_5*/ ctx[39]);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_58.name,
    		type: "slot",
    		source: "(319:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (327:6) <Events mute="{true}">
    function create_default_slot_57(ctx) {
    	let checkbox;
    	let current;

    	checkbox = new Checkbox({
    			props: { label: "Disabled", isEnabled: false },
    			$$inline: true
    		});

    	checkbox.$on("change", /*change_handler_6*/ ctx[40]);

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_57.name,
    		type: "slot",
    		source: "(327:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (318:4) <Area>
    function create_default_slot_56(ctx) {
    	let events0;
    	let t0;
    	let checkbox0;
    	let t1;
    	let checkbox1;
    	let t2;
    	let checkbox2;
    	let t3;
    	let events1;
    	let t4;
    	let checkbox3;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_58] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox0 = new Checkbox({
    			props: { label: "Right", position: "right" },
    			$$inline: true
    		});

    	checkbox1 = new Checkbox({
    			props: { label: "Top", position: "top" },
    			$$inline: true
    		});

    	checkbox2 = new Checkbox({
    			props: { label: "Bottom", position: "bottom" },
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_57] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	checkbox3 = new Checkbox({
    			props: {
    				label: "Down",
    				isDown: true,
    				isEnabled: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(checkbox0.$$.fragment);
    			t1 = space();
    			create_component(checkbox1.$$.fragment);
    			t2 = space();
    			create_component(checkbox2.$$.fragment);
    			t3 = space();
    			create_component(events1.$$.fragment);
    			t4 = space();
    			create_component(checkbox3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(checkbox0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(checkbox1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(checkbox2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(checkbox3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			transition_in(checkbox2.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(checkbox3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			transition_out(checkbox2.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(checkbox3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(checkbox0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(checkbox1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(checkbox2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(checkbox3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_56.name,
    		type: "slot",
    		source: "(318:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (305:2) <Section title="Checkbox">
    function create_default_slot_55(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_59] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_56] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_55.name,
    		type: "slot",
    		source: "(305:2) <Section title=\\\"Checkbox\\\">",
    		ctx
    	});

    	return block;
    }

    // (339:6) <Events>
    function create_default_slot_54(ctx) {
    	let radiogroup;
    	let current;

    	radiogroup = new RadioGroup({
    			props: { options: /*radioOptions*/ ctx[2] },
    			$$inline: true
    		});

    	radiogroup.$on("change", /*change_handler_7*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(radiogroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(radiogroup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiogroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiogroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radiogroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_54.name,
    		type: "slot",
    		source: "(339:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (344:6) <Events mute="{true}">
    function create_default_slot_53(ctx) {
    	let radiogroup;
    	let current;

    	radiogroup = new RadioGroup({
    			props: {
    				isEnabled: false,
    				options: /*radioOptions*/ ctx[2]
    			},
    			$$inline: true
    		});

    	radiogroup.$on("change", /*change_handler_8*/ ctx[42]);

    	const block = {
    		c: function create() {
    			create_component(radiogroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(radiogroup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiogroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiogroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radiogroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_53.name,
    		type: "slot",
    		source: "(344:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (338:4) <Area>
    function create_default_slot_52(ctx) {
    	let events0;
    	let t0;
    	let events1;
    	let t1;
    	let radiogroup0;
    	let t2;
    	let radiogroup1;
    	let t3;
    	let radiogroup2;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_54] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_53] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	radiogroup0 = new RadioGroup({
    			props: {
    				options: /*radioOptions*/ ctx[2],
    				position: "left"
    			},
    			$$inline: true
    		});

    	radiogroup1 = new RadioGroup({
    			props: {
    				options: /*radioOptions*/ ctx[2],
    				position: "top"
    			},
    			$$inline: true
    		});

    	radiogroup2 = new RadioGroup({
    			props: {
    				options: /*radioOptions*/ ctx[2],
    				position: "bottom"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(events1.$$.fragment);
    			t1 = space();
    			create_component(radiogroup0.$$.fragment);
    			t2 = space();
    			create_component(radiogroup1.$$.fragment);
    			t3 = space();
    			create_component(radiogroup2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(radiogroup0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(radiogroup1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(radiogroup2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(radiogroup0.$$.fragment, local);
    			transition_in(radiogroup1.$$.fragment, local);
    			transition_in(radiogroup2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(radiogroup0.$$.fragment, local);
    			transition_out(radiogroup1.$$.fragment, local);
    			transition_out(radiogroup2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(radiogroup0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(radiogroup1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(radiogroup2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_52.name,
    		type: "slot",
    		source: "(338:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (337:2) <Section title="Radio">
    function create_default_slot_51(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_52] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_51.name,
    		type: "slot",
    		source: "(337:2) <Section title=\\\"Radio\\\">",
    		ctx
    	});

    	return block;
    }

    // (357:4) <Events>
    function create_default_slot_50(ctx) {
    	let textfield;
    	let current;
    	textfield = new TextField({ $$inline: true });
    	textfield.$on("change", /*change_handler_9*/ ctx[43]);
    	textfield.$on("accept", /*accept_handler*/ ctx[44]);
    	textfield.$on("focus", /*focus_handler*/ ctx[45]);
    	textfield.$on("blur", /*blur_handler*/ ctx[46]);

    	const block = {
    		c: function create() {
    			create_component(textfield.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textfield, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_50.name,
    		type: "slot",
    		source: "(357:4) <Events>",
    		ctx
    	});

    	return block;
    }

    // (368:4) <TextField placeholder="With Button">
    function create_default_slot_49(ctx) {
    	let pushbutton;
    	let current;

    	pushbutton = new PushButton({
    			props: { label: "Button" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pushbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pushbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pushbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_49.name,
    		type: "slot",
    		source: "(368:4) <TextField placeholder=\\\"With Button\\\">",
    		ctx
    	});

    	return block;
    }

    // (356:2) <Section title="TextField">
    function create_default_slot_48(ctx) {
    	let events;
    	let t0;
    	let textfield0;
    	let t1;
    	let textfield1;
    	let t2;
    	let textfield2;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_50] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textfield0 = new TextField({
    			props: {
    				isEnabled: false,
    				value: 'This is some text'
    			},
    			$$inline: true
    		});

    	textfield1 = new TextField({
    			props: {
    				filter: /*alphaNumericFilter*/ ctx[3],
    				placeholder: "With alpha numeric filter"
    			},
    			$$inline: true
    		});

    	textfield2 = new TextField({
    			props: {
    				placeholder: "With Button",
    				$$slots: { default: [create_default_slot_49] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    			t0 = space();
    			create_component(textfield0.$$.fragment);
    			t1 = space();
    			create_component(textfield1.$$.fragment);
    			t2 = space();
    			create_component(textfield2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(textfield0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(textfield1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(textfield2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    			const textfield2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				textfield2_changes.$$scope = { dirty, ctx };
    			}

    			textfield2.$set(textfield2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(textfield2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(textfield2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(textfield0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(textfield1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(textfield2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_48.name,
    		type: "slot",
    		source: "(356:2) <Section title=\\\"TextField\\\">",
    		ctx
    	});

    	return block;
    }

    // (374:6) <Events>
    function create_default_slot_47(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });
    	spinner.$on("change", /*change_handler_10*/ ctx[47]);
    	spinner.$on("focus", /*focus_handler_1*/ ctx[48]);
    	spinner.$on("blur", /*blur_handler_1*/ ctx[49]);

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_47.name,
    		type: "slot",
    		source: "(374:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (380:6) <Events mute="{true}">
    function create_default_slot_46(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { isEnabled: false },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_46.name,
    		type: "slot",
    		source: "(380:6) <Events mute=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (373:4) <Area>
    function create_default_slot_45(ctx) {
    	let events0;
    	let t;
    	let events1;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_47] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_46] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t = space();
    			create_component(events1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(events1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(events1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_45.name,
    		type: "slot",
    		source: "(373:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (384:4) <Area>
    function create_default_slot_44(ctx) {
    	let spinner0;
    	let t0;
    	let spinner1;
    	let t1;
    	let spinner2;
    	let t2;
    	let spinner3;
    	let t3;
    	let spinner4;
    	let t4;
    	let spinner5;
    	let t5;
    	let spinner6;
    	let t6;
    	let spinner7;
    	let t7;
    	let spinner8;
    	let t8;
    	let spinner9;
    	let current;
    	spinner0 = new Spinner({ props: { digitCount: 1 }, $$inline: true });
    	spinner1 = new Spinner({ props: { digitCount: 2 }, $$inline: true });
    	spinner2 = new Spinner({ props: { digitCount: 3 }, $$inline: true });
    	spinner3 = new Spinner({ props: { digitCount: 4 }, $$inline: true });
    	spinner4 = new Spinner({ props: { digitCount: 5 }, $$inline: true });
    	spinner5 = new Spinner({ props: { digitCount: 6 }, $$inline: true });
    	spinner6 = new Spinner({ props: { digitCount: 7 }, $$inline: true });
    	spinner7 = new Spinner({ props: { digitCount: 8 }, $$inline: true });
    	spinner8 = new Spinner({ props: { digitCount: 9 }, $$inline: true });

    	spinner9 = new Spinner({
    			props: { digitCount: 10 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner0.$$.fragment);
    			t0 = space();
    			create_component(spinner1.$$.fragment);
    			t1 = space();
    			create_component(spinner2.$$.fragment);
    			t2 = space();
    			create_component(spinner3.$$.fragment);
    			t3 = space();
    			create_component(spinner4.$$.fragment);
    			t4 = space();
    			create_component(spinner5.$$.fragment);
    			t5 = space();
    			create_component(spinner6.$$.fragment);
    			t6 = space();
    			create_component(spinner7.$$.fragment);
    			t7 = space();
    			create_component(spinner8.$$.fragment);
    			t8 = space();
    			create_component(spinner9.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spinner1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(spinner2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(spinner3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(spinner4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(spinner5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(spinner6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(spinner7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(spinner8, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(spinner9, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner0.$$.fragment, local);
    			transition_in(spinner1.$$.fragment, local);
    			transition_in(spinner2.$$.fragment, local);
    			transition_in(spinner3.$$.fragment, local);
    			transition_in(spinner4.$$.fragment, local);
    			transition_in(spinner5.$$.fragment, local);
    			transition_in(spinner6.$$.fragment, local);
    			transition_in(spinner7.$$.fragment, local);
    			transition_in(spinner8.$$.fragment, local);
    			transition_in(spinner9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner0.$$.fragment, local);
    			transition_out(spinner1.$$.fragment, local);
    			transition_out(spinner2.$$.fragment, local);
    			transition_out(spinner3.$$.fragment, local);
    			transition_out(spinner4.$$.fragment, local);
    			transition_out(spinner5.$$.fragment, local);
    			transition_out(spinner6.$$.fragment, local);
    			transition_out(spinner7.$$.fragment, local);
    			transition_out(spinner8.$$.fragment, local);
    			transition_out(spinner9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spinner1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(spinner2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(spinner3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(spinner4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(spinner5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(spinner6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(spinner7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(spinner8, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(spinner9, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_44.name,
    		type: "slot",
    		source: "(384:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (372:2) <Section title="Spinner" direction="vertical">
    function create_default_slot_43(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_45] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_44] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_43.name,
    		type: "slot",
    		source: "(372:2) <Section title=\\\"Spinner\\\" direction=\\\"vertical\\\">",
    		ctx
    	});

    	return block;
    }

    // (401:8) <MenuButton            items="{simpleMenu1}"            on:open="{(e) => log('MenuButton', 'open')}"            on:close="{(e) => log('MenuButton', 'close')}"            on:select="{(e) => log('MenuButton', 'select', e.detail)}">
    function create_default_slot_42(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "MouseDown" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_42.name,
    		type: "slot",
    		source: "(401:8) <MenuButton            items=\\\"{simpleMenu1}\\\"            on:open=\\\"{(e) => log('MenuButton', 'open')}\\\"            on:close=\\\"{(e) => log('MenuButton', 'close')}\\\"            on:select=\\\"{(e) => log('MenuButton', 'select', e.detail)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (400:6) <Events>
    function create_default_slot_41(ctx) {
    	let menubutton;
    	let current;

    	menubutton = new MenuButton({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				$$slots: { default: [create_default_slot_42] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton.$on("open", /*open_handler*/ ctx[50]);
    	menubutton.$on("close", /*close_handler*/ ctx[51]);
    	menubutton.$on("select", /*select_handler*/ ctx[52]);

    	const block = {
    		c: function create() {
    			create_component(menubutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menubutton_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) menubutton_changes.items = /*simpleMenu1*/ ctx[0];

    			if (dirty[2] & /*$$scope*/ 128) {
    				menubutton_changes.$$scope = { dirty, ctx };
    			}

    			menubutton.$set(menubutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_41.name,
    		type: "slot",
    		source: "(400:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (409:6) <MenuButton isEnabled="{false}" items="{simpleMenu1}">
    function create_default_slot_40(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "MouseDown" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_40.name,
    		type: "slot",
    		source: "(409:6) <MenuButton isEnabled=\\\"{false}\\\" items=\\\"{simpleMenu1}\\\">",
    		ctx
    	});

    	return block;
    }

    // (412:6) <MenuButton items="{simpleMenu1}" position="popout">
    function create_default_slot_39(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Popout" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_39.name,
    		type: "slot",
    		source: "(412:6) <MenuButton items=\\\"{simpleMenu1}\\\" position=\\\"popout\\\">",
    		ctx
    	});

    	return block;
    }

    // (399:4) <Area>
    function create_default_slot_38(ctx) {
    	let events;
    	let t0;
    	let menubutton0;
    	let t1;
    	let menubutton1;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_41] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton0 = new MenuButton({
    			props: {
    				isEnabled: false,
    				items: /*simpleMenu1*/ ctx[0],
    				$$slots: { default: [create_default_slot_40] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton1 = new MenuButton({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				position: "popout",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    			t0 = space();
    			create_component(menubutton0.$$.fragment);
    			t1 = space();
    			create_component(menubutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(menubutton0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(menubutton1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    			const menubutton0_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) menubutton0_changes.items = /*simpleMenu1*/ ctx[0];

    			if (dirty[2] & /*$$scope*/ 128) {
    				menubutton0_changes.$$scope = { dirty, ctx };
    			}

    			menubutton0.$set(menubutton0_changes);
    			const menubutton1_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) menubutton1_changes.items = /*simpleMenu1*/ ctx[0];

    			if (dirty[2] & /*$$scope*/ 128) {
    				menubutton1_changes.$$scope = { dirty, ctx };
    			}

    			menubutton1.$set(menubutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			transition_in(menubutton0.$$.fragment, local);
    			transition_in(menubutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			transition_out(menubutton0.$$.fragment, local);
    			transition_out(menubutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(menubutton0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(menubutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(399:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (418:8) <MenuButton            items="{simpleMenu1}"            trigger="mouseup"            on:open="{(e) => log('MenuButton', 'open')}"            on:close="{(e) => log('MenuButton', 'close')}"            on:select="{(e) => log('MenuButton', 'select', e.detail)}">
    function create_default_slot_37(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Mouseup" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(418:8) <MenuButton            items=\\\"{simpleMenu1}\\\"            trigger=\\\"mouseup\\\"            on:open=\\\"{(e) => log('MenuButton', 'open')}\\\"            on:close=\\\"{(e) => log('MenuButton', 'close')}\\\"            on:select=\\\"{(e) => log('MenuButton', 'select', e.detail)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (417:6) <Events>
    function create_default_slot_36(ctx) {
    	let menubutton;
    	let current;

    	menubutton = new MenuButton({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				trigger: "mouseup",
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton.$on("open", /*open_handler_1*/ ctx[53]);
    	menubutton.$on("close", /*close_handler_1*/ ctx[54]);
    	menubutton.$on("select", /*select_handler_1*/ ctx[55]);

    	const block = {
    		c: function create() {
    			create_component(menubutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menubutton_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) menubutton_changes.items = /*simpleMenu1*/ ctx[0];

    			if (dirty[2] & /*$$scope*/ 128) {
    				menubutton_changes.$$scope = { dirty, ctx };
    			}

    			menubutton.$set(menubutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(417:6) <Events>",
    		ctx
    	});

    	return block;
    }

    // (427:6) <MenuButton items="{simpleMenu1}" position="popout" trigger="mouseup">
    function create_default_slot_35(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Popout" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(427:6) <MenuButton items=\\\"{simpleMenu1}\\\" position=\\\"popout\\\" trigger=\\\"mouseup\\\">",
    		ctx
    	});

    	return block;
    }

    // (416:4) <Area>
    function create_default_slot_34(ctx) {
    	let events;
    	let t;
    	let menubutton;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menubutton = new MenuButton({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				position: "popout",
    				trigger: "mouseup",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    			t = space();
    			create_component(menubutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(menubutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    			const menubutton_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) menubutton_changes.items = /*simpleMenu1*/ ctx[0];

    			if (dirty[2] & /*$$scope*/ 128) {
    				menubutton_changes.$$scope = { dirty, ctx };
    			}

    			menubutton.$set(menubutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(menubutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(416:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (398:2) <Section title="MenuButton">
    function create_default_slot_33(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(398:2) <Section title=\\\"MenuButton\\\">",
    		ctx
    	});

    	return block;
    }

    // (434:4) <Events        >
    function create_default_slot_32(ctx) {
    	let select;
    	let current;

    	select = new Select({
    			props: { items: /*simpleMenu1*/ ctx[0] },
    			$$inline: true
    		});

    	select.$on("change", /*change_handler_11*/ ctx[56]);

    	const block = {
    		c: function create() {
    			create_component(select.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) select_changes.items = /*simpleMenu1*/ ctx[0];
    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(434:4) <Events        >",
    		ctx
    	});

    	return block;
    }

    // (438:4) <Events mute="{true}"        >
    function create_default_slot_31(ctx) {
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				isEnabled: false,
    				items: /*simpleMenu1*/ ctx[0],
    				selectedIndex: 1
    			},
    			$$inline: true
    		});

    	select.$on("change", /*change_handler_12*/ ctx[57]);

    	const block = {
    		c: function create() {
    			create_component(select.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) select_changes.items = /*simpleMenu1*/ ctx[0];
    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(438:4) <Events mute=\\\"{true}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (433:2) <Section title="Select">
    function create_default_slot_30(ctx) {
    	let events0;
    	let t0;
    	let events1;
    	let t1;
    	let select0;
    	let t2;
    	let select1;
    	let current;

    	events0 = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	events1 = new Events({
    			props: {
    				mute: true,
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	select0 = new Select({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				width: 100
    			},
    			$$inline: true
    		});

    	select1 = new Select({
    			props: {
    				items: /*simpleMenu1*/ ctx[0],
    				placeholder: "-- Select --"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events0.$$.fragment);
    			t0 = space();
    			create_component(events1.$$.fragment);
    			t1 = space();
    			create_component(select0.$$.fragment);
    			t2 = space();
    			create_component(select1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(events1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(select0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(select1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events0_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				events0_changes.$$scope = { dirty, ctx };
    			}

    			events0.$set(events0_changes);
    			const events1_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				events1_changes.$$scope = { dirty, ctx };
    			}

    			events1.$set(events1_changes);
    			const select0_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) select0_changes.items = /*simpleMenu1*/ ctx[0];
    			select0.$set(select0_changes);
    			const select1_changes = {};
    			if (dirty[0] & /*simpleMenu1*/ 1) select1_changes.items = /*simpleMenu1*/ ctx[0];
    			select1.$set(select1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events0.$$.fragment, local);
    			transition_in(events1.$$.fragment, local);
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events0.$$.fragment, local);
    			transition_out(events1.$$.fragment, local);
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(events1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(select0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(select1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(433:2) <Section title=\\\"Select\\\">",
    		ctx
    	});

    	return block;
    }

    // (450:6) <Events          >
    function create_default_slot_29(ctx) {
    	let scrollbar;
    	let current;

    	scrollbar = new ScrollBar({
    			props: {
    				direction: "horizontal",
    				value: 0,
    				size: 100
    			},
    			$$inline: true
    		});

    	scrollbar.$on("change", /*change_handler_13*/ ctx[58]);

    	const block = {
    		c: function create() {
    			create_component(scrollbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(450:6) <Events          >",
    		ctx
    	});

    	return block;
    }

    // (449:4) <Area direction="vertical">
    function create_default_slot_28(ctx) {
    	let events;
    	let t0;
    	let scrollbar0;
    	let t1;
    	let scrollbar1;
    	let t2;
    	let scrollbar2;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scrollbar0 = new ScrollBar({
    			props: { direction: "horizontal", value: 0.5 },
    			$$inline: true
    		});

    	scrollbar1 = new ScrollBar({
    			props: { direction: "horizontal", value: 1 },
    			$$inline: true
    		});

    	scrollbar2 = new ScrollBar({
    			props: {
    				isEnabled: false,
    				direction: "horizontal",
    				value: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    			t0 = space();
    			create_component(scrollbar0.$$.fragment);
    			t1 = space();
    			create_component(scrollbar1.$$.fragment);
    			t2 = space();
    			create_component(scrollbar2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(scrollbar0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(scrollbar1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(scrollbar2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			transition_in(scrollbar0.$$.fragment, local);
    			transition_in(scrollbar1.$$.fragment, local);
    			transition_in(scrollbar2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			transition_out(scrollbar0.$$.fragment, local);
    			transition_out(scrollbar1.$$.fragment, local);
    			transition_out(scrollbar2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(scrollbar0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(scrollbar1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(scrollbar2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(449:4) <Area direction=\\\"vertical\\\">",
    		ctx
    	});

    	return block;
    }

    // (460:4) <Area>
    function create_default_slot_27(ctx) {
    	let scrollbar0;
    	let t0;
    	let scrollbar1;
    	let t1;
    	let scrollbar2;
    	let t2;
    	let scrollbar3;
    	let current;

    	scrollbar0 = new ScrollBar({
    			props: {
    				direction: "vertical",
    				value: 0,
    				size: 100
    			},
    			$$inline: true
    		});

    	scrollbar1 = new ScrollBar({
    			props: {
    				direction: "vertical",
    				value: 0.5,
    				size: 100
    			},
    			$$inline: true
    		});

    	scrollbar2 = new ScrollBar({
    			props: {
    				direction: "vertical",
    				value: 1,
    				size: 100
    			},
    			$$inline: true
    		});

    	scrollbar3 = new ScrollBar({
    			props: {
    				isEnabled: false,
    				direction: "vertical",
    				value: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scrollbar0.$$.fragment);
    			t0 = space();
    			create_component(scrollbar1.$$.fragment);
    			t1 = space();
    			create_component(scrollbar2.$$.fragment);
    			t2 = space();
    			create_component(scrollbar3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollbar0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(scrollbar1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(scrollbar2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(scrollbar3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollbar0.$$.fragment, local);
    			transition_in(scrollbar1.$$.fragment, local);
    			transition_in(scrollbar2.$$.fragment, local);
    			transition_in(scrollbar3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollbar0.$$.fragment, local);
    			transition_out(scrollbar1.$$.fragment, local);
    			transition_out(scrollbar2.$$.fragment, local);
    			transition_out(scrollbar3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollbar0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(scrollbar1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(scrollbar2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(scrollbar3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(460:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (448:2) <Section title="ScrollBar">
    function create_default_slot_26(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				direction: "vertical",
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(448:2) <Section title=\\\"ScrollBar\\\">",
    		ctx
    	});

    	return block;
    }

    // (470:6) <ScrollView>
    function create_default_slot_25(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "img/test-debug.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "img");
    			add_location(img, file, 470, 8, 16624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(470:6) <ScrollView>",
    		ctx
    	});

    	return block;
    }

    // (469:4) <Area height="{200}">
    function create_default_slot_24(ctx) {
    	let scrollview;
    	let current;

    	scrollview = new ScrollView({
    			props: {
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scrollview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scrollview_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				scrollview_changes.$$scope = { dirty, ctx };
    			}

    			scrollview.$set(scrollview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(469:4) <Area height=\\\"{200}\\\">",
    		ctx
    	});

    	return block;
    }

    // (475:6) <ScrollView width="{200}" height="{70}">
    function create_default_slot_23(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "img/test-debug.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "img");
    			add_location(img, file, 475, 8, 16785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(475:6) <ScrollView width=\\\"{200}\\\" height=\\\"{70}\\\">",
    		ctx
    	});

    	return block;
    }

    // (474:4) <Area height="{200}">
    function create_default_slot_22(ctx) {
    	let scrollview;
    	let current;

    	scrollview = new ScrollView({
    			props: {
    				width: 200,
    				height: 70,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scrollview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scrollview_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				scrollview_changes.$$scope = { dirty, ctx };
    			}

    			scrollview.$set(scrollview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(474:4) <Area height=\\\"{200}\\\">",
    		ctx
    	});

    	return block;
    }

    // (468:2) <Section title="ScrollView">
    function create_default_slot_21(ctx) {
    	let area0;
    	let t;
    	let area1;
    	let current;

    	area0 = new Area({
    			props: {
    				height: 200,
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				height: 200,
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(468:2) <Section title=\\\"ScrollView\\\">",
    		ctx
    	});

    	return block;
    }

    // (482:4) <Events>
    function create_default_slot_20(ctx) {
    	let menubar;
    	let current;

    	menubar = new MenuBar({
    			props: { items: /*simpleMenuBar*/ ctx[5] },
    			$$inline: true
    		});

    	menubar.$on("select", /*select_handler_2*/ ctx[59]);

    	const block = {
    		c: function create() {
    			create_component(menubar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(482:4) <Events>",
    		ctx
    	});

    	return block;
    }

    // (481:2) <Section title="Menubar">
    function create_default_slot_19(ctx) {
    	let events;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(481:2) <Section title=\\\"Menubar\\\">",
    		ctx
    	});

    	return block;
    }

    // (490:4) <Panel>
    function create_default_slot_18(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(490:4) <Panel>",
    		ctx
    	});

    	return block;
    }

    // (491:4) <Panel title="Title">
    function create_default_slot_17(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(491:4) <Panel title=\\\"Title\\\">",
    		ctx
    	});

    	return block;
    }

    // (492:4) <Panel title="Title" menuBar="{simpleMenuBar}"        >
    function create_default_slot_16(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(492:4) <Panel title=\\\"Title\\\" menuBar=\\\"{simpleMenuBar}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (489:2) <Section title="Panel">
    function create_default_slot_15(ctx) {
    	let panel0;
    	let t0;
    	let panel1;
    	let t1;
    	let panel2;
    	let current;

    	panel0 = new Panel({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	panel1 = new Panel({
    			props: {
    				title: "Title",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	panel2 = new Panel({
    			props: {
    				title: "Title",
    				menuBar: /*simpleMenuBar*/ ctx[5],
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(panel0.$$.fragment);
    			t0 = space();
    			create_component(panel1.$$.fragment);
    			t1 = space();
    			create_component(panel2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(panel1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(panel2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const panel0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				panel0_changes.$$scope = { dirty, ctx };
    			}

    			panel0.$set(panel0_changes);
    			const panel1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				panel1_changes.$$scope = { dirty, ctx };
    			}

    			panel1.$set(panel1_changes);
    			const panel2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				panel2_changes.$$scope = { dirty, ctx };
    			}

    			panel2.$set(panel2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel0.$$.fragment, local);
    			transition_in(panel1.$$.fragment, local);
    			transition_in(panel2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel0.$$.fragment, local);
    			transition_out(panel1.$$.fragment, local);
    			transition_out(panel2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(panel1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(panel2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(489:2) <Section title=\\\"Panel\\\">",
    		ctx
    	});

    	return block;
    }

    // (502:10) <TabDoc title="Document.a" menuBar="{simpleMenuBar}"              >
    function create_default_slot_14(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content A..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(502:10) <TabDoc title=\\\"Document.a\\\" menuBar=\\\"{simpleMenuBar}\\\"              >",
    		ctx
    	});

    	return block;
    }

    // (504:10) <TabDoc title="Document.b">
    function create_default_slot_13(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content B..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(504:10) <TabDoc title=\\\"Document.b\\\">",
    		ctx
    	});

    	return block;
    }

    // (499:8) <TabView            on:change="{(e) => log('TabView', 'change', e.detail)}"            on:closing="{(e) => log('TabView', 'closing', e.detail)}">
    function create_default_slot_12(ctx) {
    	let tabdoc0;
    	let t;
    	let tabdoc1;
    	let current;

    	tabdoc0 = new TabDoc({
    			props: {
    				title: "Document.a",
    				menuBar: /*simpleMenuBar*/ ctx[5],
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabdoc1 = new TabDoc({
    			props: {
    				title: "Document.b",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabdoc0.$$.fragment);
    			t = space();
    			create_component(tabdoc1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabdoc0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tabdoc1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabdoc0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc0_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc0.$set(tabdoc0_changes);
    			const tabdoc1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc1_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc1.$set(tabdoc1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabdoc0.$$.fragment, local);
    			transition_in(tabdoc1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabdoc0.$$.fragment, local);
    			transition_out(tabdoc1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabdoc0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tabdoc1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(499:8) <TabView            on:change=\\\"{(e) => log('TabView', 'change', e.detail)}\\\"            on:closing=\\\"{(e) => log('TabView', 'closing', e.detail)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (498:6) <Area height="{100}">
    function create_default_slot_11(ctx) {
    	let tabview;
    	let current;

    	tabview = new TabView({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabview.$on("change", /*change_handler_14*/ ctx[60]);
    	tabview.$on("closing", /*closing_handler*/ ctx[61]);

    	const block = {
    		c: function create() {
    			create_component(tabview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabview_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabview_changes.$$scope = { dirty, ctx };
    			}

    			tabview.$set(tabview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(498:6) <Area height=\\\"{100}\\\">",
    		ctx
    	});

    	return block;
    }

    // (497:4) <Events>
    function create_default_slot_10(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				height: 100,
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(497:4) <Events>",
    		ctx
    	});

    	return block;
    }

    // (510:8) <TabDoc            title="Document.c"            isClosable="{false}"            icon="img/test-small.png">
    function create_default_slot_9(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content C..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(510:8) <TabDoc            title=\\\"Document.c\\\"            isClosable=\\\"{false}\\\"            icon=\\\"img/test-small.png\\\">",
    		ctx
    	});

    	return block;
    }

    // (514:8) <TabDoc            title="Document.d"            onCanClose="{(index) => {              log('TabDoc', 'onCanClose', index);              return false;            }}">
    function create_default_slot_8(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content D...Can't close this" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(514:8) <TabDoc            title=\\\"Document.d\\\"            onCanClose=\\\"{(index) => {              log('TabDoc', 'onCanClose', index);              return false;            }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (520:8) <TabDoc title="Document.e" isClosable="{false}"            >
    function create_default_slot_7(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content E..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(520:8) <TabDoc title=\\\"Document.e\\\" isClosable=\\\"{false}\\\"            >",
    		ctx
    	});

    	return block;
    }

    // (522:8) <TabDoc title="Document.f">
    function create_default_slot_6(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: { text: "Content F..." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(522:8) <TabDoc title=\\\"Document.f\\\">",
    		ctx
    	});

    	return block;
    }

    // (509:6) <TabView selectedIndex="{1}">
    function create_default_slot_5(ctx) {
    	let tabdoc0;
    	let t0;
    	let tabdoc1;
    	let t1;
    	let tabdoc2;
    	let t2;
    	let tabdoc3;
    	let current;

    	tabdoc0 = new TabDoc({
    			props: {
    				title: "Document.c",
    				isClosable: false,
    				icon: "img/test-small.png",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabdoc1 = new TabDoc({
    			props: {
    				title: "Document.d",
    				onCanClose: /*func_2*/ ctx[62],
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabdoc2 = new TabDoc({
    			props: {
    				title: "Document.e",
    				isClosable: false,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabdoc3 = new TabDoc({
    			props: {
    				title: "Document.f",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabdoc0.$$.fragment);
    			t0 = space();
    			create_component(tabdoc1.$$.fragment);
    			t1 = space();
    			create_component(tabdoc2.$$.fragment);
    			t2 = space();
    			create_component(tabdoc3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabdoc0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tabdoc1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tabdoc2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tabdoc3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabdoc0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc0_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc0.$set(tabdoc0_changes);
    			const tabdoc1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc1_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc1.$set(tabdoc1_changes);
    			const tabdoc2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc2_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc2.$set(tabdoc2_changes);
    			const tabdoc3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabdoc3_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc3.$set(tabdoc3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabdoc0.$$.fragment, local);
    			transition_in(tabdoc1.$$.fragment, local);
    			transition_in(tabdoc2.$$.fragment, local);
    			transition_in(tabdoc3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabdoc0.$$.fragment, local);
    			transition_out(tabdoc1.$$.fragment, local);
    			transition_out(tabdoc2.$$.fragment, local);
    			transition_out(tabdoc3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabdoc0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tabdoc1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tabdoc2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tabdoc3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(509:6) <TabView selectedIndex=\\\"{1}\\\">",
    		ctx
    	});

    	return block;
    }

    // (508:4) <Area>
    function create_default_slot_4(ctx) {
    	let tabview;
    	let current;

    	tabview = new TabView({
    			props: {
    				selectedIndex: 1,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabview_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				tabview_changes.$$scope = { dirty, ctx };
    			}

    			tabview.$set(tabview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(508:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (528:10) <TabDoc title="{tabTitle}" isClosable="{false}">
    function create_default_slot_3(ctx) {
    	let label;
    	let t0;
    	let pushbutton;
    	let t1;
    	let current;

    	label = new Label({
    			props: {
    				text: `Content for ${/*tabTitle*/ ctx[66]}`
    			},
    			$$inline: true
    		});

    	pushbutton = new PushButton({
    			props: { label: "Close" },
    			$$inline: true
    		});

    	pushbutton.$on("click", function () {
    		if (is_function(/*closeTabHandler*/ ctx[6](/*i*/ ctx[68]))) /*closeTabHandler*/ ctx[6](/*i*/ ctx[68]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t0 = space();
    			create_component(pushbutton.$$.fragment);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(pushbutton, target, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const label_changes = {};
    			if (dirty[0] & /*simpleTabs*/ 2) label_changes.text = `Content for ${/*tabTitle*/ ctx[66]}`;
    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(pushbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(pushbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(pushbutton, detaching);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(528:10) <TabDoc title=\\\"{tabTitle}\\\" isClosable=\\\"{false}\\\">",
    		ctx
    	});

    	return block;
    }

    // (527:8) {#each simpleTabs as tabTitle, i (tabTitle)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let tabdoc;
    	let current;

    	tabdoc = new TabDoc({
    			props: {
    				title: /*tabTitle*/ ctx[66],
    				isClosable: false,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(tabdoc.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(tabdoc, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tabdoc_changes = {};
    			if (dirty[0] & /*simpleTabs*/ 2) tabdoc_changes.title = /*tabTitle*/ ctx[66];

    			if (dirty[0] & /*simpleTabs*/ 2 | dirty[2] & /*$$scope*/ 128) {
    				tabdoc_changes.$$scope = { dirty, ctx };
    			}

    			tabdoc.$set(tabdoc_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabdoc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabdoc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(tabdoc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(527:8) {#each simpleTabs as tabTitle, i (tabTitle)}",
    		ctx
    	});

    	return block;
    }

    // (526:6) <TabView appearance="tool">
    function create_default_slot_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*simpleTabs*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tabTitle*/ ctx[66];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*simpleTabs, closeTabHandler*/ 66) {
    				each_value = /*simpleTabs*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(526:6) <TabView appearance=\\\"tool\\\">",
    		ctx
    	});

    	return block;
    }

    // (525:4) <Area>
    function create_default_slot_1(ctx) {
    	let tabview;
    	let current;

    	tabview = new TabView({
    			props: {
    				appearance: "tool",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabview_changes = {};

    			if (dirty[0] & /*simpleTabs*/ 2 | dirty[2] & /*$$scope*/ 128) {
    				tabview_changes.$$scope = { dirty, ctx };
    			}

    			tabview.$set(tabview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(525:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (496:2) <Section title="Tabs">
    function create_default_slot(ctx) {
    	let events;
    	let t0;
    	let area0;
    	let t1;
    	let area1;
    	let current;

    	events = new Events({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area0 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(events.$$.fragment);
    			t0 = space();
    			create_component(area0.$$.fragment);
    			t1 = space();
    			create_component(area1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(events, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(area0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const events_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				events_changes.$$scope = { dirty, ctx };
    			}

    			events.$set(events_changes);
    			const area0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty[0] & /*simpleTabs*/ 2 | dirty[2] & /*$$scope*/ 128) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(events.$$.fragment, local);
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(events.$$.fragment, local);
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(events, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(496:2) <Section title=\\\"Tabs\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let section0;
    	let t0;
    	let section1;
    	let t1;
    	let section2;
    	let t2;
    	let section3;
    	let t3;
    	let section4;
    	let t4;
    	let section5;
    	let t5;
    	let section6;
    	let t6;
    	let section7;
    	let t7;
    	let section8;
    	let t8;
    	let section9;
    	let t9;
    	let section10;
    	let t10;
    	let section11;
    	let t11;
    	let section12;
    	let t12;
    	let section13;
    	let t13;
    	let section14;
    	let t14;
    	let section15;
    	let t15;
    	let section16;
    	let t16;
    	let section17;
    	let t17;
    	let section18;
    	let t18;
    	let section19;
    	let t19;
    	let section20;
    	let current;

    	section0 = new Section({
    			props: {
    				title: "Label",
    				$$slots: { default: [create_default_slot_103] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section1 = new Section({
    			props: {
    				title: "Label.position: left (default)",
    				$$slots: { default: [create_default_slot_98] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section2 = new Section({
    			props: {
    				title: "Label.position: right",
    				$$slots: { default: [create_default_slot_93] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section3 = new Section({
    			props: {
    				title: "Label.position: top",
    				$$slots: { default: [create_default_slot_88] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section4 = new Section({
    			props: {
    				title: "Label.position: bottom",
    				$$slots: { default: [create_default_slot_83] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section5 = new Section({
    			props: {
    				title: "PushButton",
    				$$slots: { default: [create_default_slot_73] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section6 = new Section({
    			props: {
    				title: "ButtonGroup",
    				$$slots: { default: [create_default_slot_68] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section7 = new Section({
    			props: {
    				title: "Tooltip",
    				$$slots: { default: [create_default_slot_62] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section8 = new Section({
    			props: {
    				title: "Checkbox",
    				$$slots: { default: [create_default_slot_55] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section9 = new Section({
    			props: {
    				title: "Radio",
    				$$slots: { default: [create_default_slot_51] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section10 = new Section({
    			props: {
    				title: "TextField",
    				$$slots: { default: [create_default_slot_48] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section11 = new Section({
    			props: {
    				title: "Spinner",
    				direction: "vertical",
    				$$slots: { default: [create_default_slot_43] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section12 = new Section({
    			props: {
    				title: "MenuButton",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section13 = new Section({
    			props: {
    				title: "Select",
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section14 = new Section({
    			props: {
    				title: "ScrollBar",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section15 = new Section({
    			props: {
    				title: "ScrollView",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section16 = new Section({
    			props: {
    				title: "Menubar",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section17 = new Section({
    			props: {
    				title: "Panel",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section18 = new Section({
    			props: {
    				title: "Tabs",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	section19 = new Section({
    			props: { title: "Splitter" },
    			$$inline: true
    		});

    	section20 = new Section({
    			props: { title: "Window & Dialog" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(section0.$$.fragment);
    			t0 = space();
    			create_component(section1.$$.fragment);
    			t1 = space();
    			create_component(section2.$$.fragment);
    			t2 = space();
    			create_component(section3.$$.fragment);
    			t3 = space();
    			create_component(section4.$$.fragment);
    			t4 = space();
    			create_component(section5.$$.fragment);
    			t5 = space();
    			create_component(section6.$$.fragment);
    			t6 = space();
    			create_component(section7.$$.fragment);
    			t7 = space();
    			create_component(section8.$$.fragment);
    			t8 = space();
    			create_component(section9.$$.fragment);
    			t9 = space();
    			create_component(section10.$$.fragment);
    			t10 = space();
    			create_component(section11.$$.fragment);
    			t11 = space();
    			create_component(section12.$$.fragment);
    			t12 = space();
    			create_component(section13.$$.fragment);
    			t13 = space();
    			create_component(section14.$$.fragment);
    			t14 = space();
    			create_component(section15.$$.fragment);
    			t15 = space();
    			create_component(section16.$$.fragment);
    			t16 = space();
    			create_component(section17.$$.fragment);
    			t17 = space();
    			create_component(section18.$$.fragment);
    			t18 = space();
    			create_component(section19.$$.fragment);
    			t19 = space();
    			create_component(section20.$$.fragment);
    			attr_dev(main, "class", "svelte-of21fq");
    			add_location(main, file, 123, 0, 4468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(section0, main, null);
    			append_dev(main, t0);
    			mount_component(section1, main, null);
    			append_dev(main, t1);
    			mount_component(section2, main, null);
    			append_dev(main, t2);
    			mount_component(section3, main, null);
    			append_dev(main, t3);
    			mount_component(section4, main, null);
    			append_dev(main, t4);
    			mount_component(section5, main, null);
    			append_dev(main, t5);
    			mount_component(section6, main, null);
    			append_dev(main, t6);
    			mount_component(section7, main, null);
    			append_dev(main, t7);
    			mount_component(section8, main, null);
    			append_dev(main, t8);
    			mount_component(section9, main, null);
    			append_dev(main, t9);
    			mount_component(section10, main, null);
    			append_dev(main, t10);
    			mount_component(section11, main, null);
    			append_dev(main, t11);
    			mount_component(section12, main, null);
    			append_dev(main, t12);
    			mount_component(section13, main, null);
    			append_dev(main, t13);
    			mount_component(section14, main, null);
    			append_dev(main, t14);
    			mount_component(section15, main, null);
    			append_dev(main, t15);
    			mount_component(section16, main, null);
    			append_dev(main, t16);
    			mount_component(section17, main, null);
    			append_dev(main, t17);
    			mount_component(section18, main, null);
    			append_dev(main, t18);
    			mount_component(section19, main, null);
    			append_dev(main, t19);
    			mount_component(section20, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const section0_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section0_changes.$$scope = { dirty, ctx };
    			}

    			section0.$set(section0_changes);
    			const section1_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section1_changes.$$scope = { dirty, ctx };
    			}

    			section1.$set(section1_changes);
    			const section2_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section2_changes.$$scope = { dirty, ctx };
    			}

    			section2.$set(section2_changes);
    			const section3_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section3_changes.$$scope = { dirty, ctx };
    			}

    			section3.$set(section3_changes);
    			const section4_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section4_changes.$$scope = { dirty, ctx };
    			}

    			section4.$set(section4_changes);
    			const section5_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section5_changes.$$scope = { dirty, ctx };
    			}

    			section5.$set(section5_changes);
    			const section6_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section6_changes.$$scope = { dirty, ctx };
    			}

    			section6.$set(section6_changes);
    			const section7_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section7_changes.$$scope = { dirty, ctx };
    			}

    			section7.$set(section7_changes);
    			const section8_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section8_changes.$$scope = { dirty, ctx };
    			}

    			section8.$set(section8_changes);
    			const section9_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section9_changes.$$scope = { dirty, ctx };
    			}

    			section9.$set(section9_changes);
    			const section10_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section10_changes.$$scope = { dirty, ctx };
    			}

    			section10.$set(section10_changes);
    			const section11_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section11_changes.$$scope = { dirty, ctx };
    			}

    			section11.$set(section11_changes);
    			const section12_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				section12_changes.$$scope = { dirty, ctx };
    			}

    			section12.$set(section12_changes);
    			const section13_changes = {};

    			if (dirty[0] & /*simpleMenu1*/ 1 | dirty[2] & /*$$scope*/ 128) {
    				section13_changes.$$scope = { dirty, ctx };
    			}

    			section13.$set(section13_changes);
    			const section14_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section14_changes.$$scope = { dirty, ctx };
    			}

    			section14.$set(section14_changes);
    			const section15_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section15_changes.$$scope = { dirty, ctx };
    			}

    			section15.$set(section15_changes);
    			const section16_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section16_changes.$$scope = { dirty, ctx };
    			}

    			section16.$set(section16_changes);
    			const section17_changes = {};

    			if (dirty[2] & /*$$scope*/ 128) {
    				section17_changes.$$scope = { dirty, ctx };
    			}

    			section17.$set(section17_changes);
    			const section18_changes = {};

    			if (dirty[0] & /*simpleTabs*/ 2 | dirty[2] & /*$$scope*/ 128) {
    				section18_changes.$$scope = { dirty, ctx };
    			}

    			section18.$set(section18_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section0.$$.fragment, local);
    			transition_in(section1.$$.fragment, local);
    			transition_in(section2.$$.fragment, local);
    			transition_in(section3.$$.fragment, local);
    			transition_in(section4.$$.fragment, local);
    			transition_in(section5.$$.fragment, local);
    			transition_in(section6.$$.fragment, local);
    			transition_in(section7.$$.fragment, local);
    			transition_in(section8.$$.fragment, local);
    			transition_in(section9.$$.fragment, local);
    			transition_in(section10.$$.fragment, local);
    			transition_in(section11.$$.fragment, local);
    			transition_in(section12.$$.fragment, local);
    			transition_in(section13.$$.fragment, local);
    			transition_in(section14.$$.fragment, local);
    			transition_in(section15.$$.fragment, local);
    			transition_in(section16.$$.fragment, local);
    			transition_in(section17.$$.fragment, local);
    			transition_in(section18.$$.fragment, local);
    			transition_in(section19.$$.fragment, local);
    			transition_in(section20.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section0.$$.fragment, local);
    			transition_out(section1.$$.fragment, local);
    			transition_out(section2.$$.fragment, local);
    			transition_out(section3.$$.fragment, local);
    			transition_out(section4.$$.fragment, local);
    			transition_out(section5.$$.fragment, local);
    			transition_out(section6.$$.fragment, local);
    			transition_out(section7.$$.fragment, local);
    			transition_out(section8.$$.fragment, local);
    			transition_out(section9.$$.fragment, local);
    			transition_out(section10.$$.fragment, local);
    			transition_out(section11.$$.fragment, local);
    			transition_out(section12.$$.fragment, local);
    			transition_out(section13.$$.fragment, local);
    			transition_out(section14.$$.fragment, local);
    			transition_out(section15.$$.fragment, local);
    			transition_out(section16.$$.fragment, local);
    			transition_out(section17.$$.fragment, local);
    			transition_out(section18.$$.fragment, local);
    			transition_out(section19.$$.fragment, local);
    			transition_out(section20.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(section0);
    			destroy_component(section1);
    			destroy_component(section2);
    			destroy_component(section3);
    			destroy_component(section4);
    			destroy_component(section5);
    			destroy_component(section6);
    			destroy_component(section7);
    			destroy_component(section8);
    			destroy_component(section9);
    			destroy_component(section10);
    			destroy_component(section11);
    			destroy_component(section12);
    			destroy_component(section13);
    			destroy_component(section14);
    			destroy_component(section15);
    			destroy_component(section16);
    			destroy_component(section17);
    			destroy_component(section18);
    			destroy_component(section19);
    			destroy_component(section20);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const radioOptions = [
    		{ label: "Option 1", value: "a" },
    		{ label: "Option 2", value: "b" },
    		{ label: "Option 3", value: "c" }
    	];

    	const alphaNumericFilter = key => isAlphaNumeric(key);

    	const simpleMenu1 = [
    		new MenuItem({
    				label: "1. Action",
    				action: new Action(() => console.log("Action 1!"), "f5")
    			}),
    		new MenuItem({ label: "Item 1.2" }),
    		new MenuItem({ label: "1.3", icon: "img/test-small.png" }),
    		separator,
    		new MenuItem({
    				label: "1.4",
    				canToggle: true,
    				isChecked: true
    			}),
    		new MenuItem({
    				label: "1.5",
    				canToggle: true,
    				action: new Action(() => console.log("1.5!"), "f4")
    			})
    	];

    	const simpleMenu2 = [
    		new MenuItem({
    				label: "2. Action",
    				action: new Action(() => console.log("Action 2!"), "f6")
    			}),
    		new MenuItem({
    				label: "Item 2.2",
    				icon: "img/test-small.png"
    			}),
    		new MenuItem({ label: "The Item 2.3" }),
    		new MenuItem({ label: "Item 2.4" })
    	];

    	const simpleMenu3 = [
    		new MenuItem({
    				label: "3. Action",
    				action: new Action(() => console.log("Action 3!"), "ctrl+k")
    			}),
    		new MenuItem({ label: "Item 3.2" }),
    		new MenuItem({ label: "Item 3.3" }),
    		new MenuItem({ label: "Item 3.4", isEnabled: false }),
    		separator,
    		new MenuItem({ label: "Item 3.5" })
    	];

    	const simpleMenu4 = [
    		new MenuItem({
    				label: "4. Action",
    				isEnabled: false,
    				action: new Action(() => console.log("Action 4!"), "ctrl+a")
    			}),
    		new MenuItem({ label: "Item 4.2", isEnabled: false }),
    		new MenuItem({ label: "Item 4.3", isEnabled: false }),
    		new MenuItem({ label: "Item 4.4", isEnabled: false }),
    		separator,
    		new MenuItem({ label: "Item 4.5", isEnabled: false })
    	];

    	simpleMenu1[1].items = simpleMenu4;
    	simpleMenu1[2].items = simpleMenu2;
    	simpleMenu2[2].items = simpleMenu3;
    	simpleMenu2[3].items = simpleMenu3;

    	const buttonGroupOptions = [
    		{ icon: "img/icons/play.svg", name: "play" },
    		{
    			icon: "img/icons/pause.svg",
    			name: "pause"
    		},
    		{
    			icon: "img/icons/record.svg",
    			name: "record"
    		},
    		{ label: "Label", name: "foo" }
    	];

    	const simpleMenuBar = [
    		{ label: "File", items: simpleMenu1 },
    		{ label: "Edit", items: simpleMenu1 },
    		{ label: "Window", items: simpleMenu1 },
    		{ label: "Disabled", items: simpleMenu4 }
    	];

    	let simpleTabs = ["Tool A", "Tool B", "Tool C", "Tool D"];

    	const closeTabHandler = index => () => {
    		simpleTabs.splice(index, 1);
    		$$invalidate(1, simpleTabs = [...simpleTabs]);
    	};

    	function log(component, event, detail) {
    		if (detail instanceof MenuItem) {
    			detail = detail.label;
    		}

    		console.log(
    			`%c${component}🔆%c${event}%c${detail !== undefined
			? ": " + JSON.stringify(detail).replace(/,/g, ", ").replace(/:/g, ": ")
			: ""}`,
    			"color:cyan",
    			"color:yellow",
    			"color:white"
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const clicked_handler = () => log('Label', 'clicked');
    	const clicked_handler_1 = () => log('Label', 'clicked');
    	const push_handler = e => log('PushButton', 'push');
    	const down_handler = e => log('PushButton', 'down');
    	const up_handler = e => log('PushButton', 'up');
    	const click_handler = e => log('PushButton', 'click');
    	const longpress_handler = e => log('PushButton', 'longpress');
    	const push_handler_1 = e => log('PushButton', 'push');
    	const down_handler_1 = e => log('PushButton', 'down');
    	const up_handler_1 = e => log('PushButton', 'up');
    	const push_handler_2 = e => log('PushButton', 'push');
    	const down_handler_2 = e => log('PushButton', 'down');
    	const up_handler_2 = e => log('PushButton', 'up');
    	const longpress_handler_1 = e => log('PushButton', 'longpress');
    	const push_handler_3 = e => log('PushButton', 'push');
    	const down_handler_3 = e => log('PushButton', 'down');
    	const up_handler_3 = e => log('PushButton', 'up');
    	const longpress_handler_2 = e => log('PushButton', 'longpress');
    	const push_handler_4 = e => log('PushButton', 'push');
    	const down_handler_4 = e => log('PushButton', 'down');
    	const toggle_handler = e => log('PushButton', 'toggle', e.detail);
    	const up_handler_4 = e => log('PushButton', 'up');
    	const click_handler_1 = e => log('PushButton', 'click');
    	const toggle_handler_1 = e => log('PushButton', 'toggle', e.detail);
    	const func = () => log('Play', 'action');
    	const func_1 = () => log('Record', 'action');
    	const change_handler = e => log('ButtonGroup', 'change', e.detail);
    	const change_handler_1 = e => log('ButtonGroup', 'change', e.detail);
    	const change_handler_2 = e => log('ButtonGroup', 'change', e.detail);
    	const change_handler_3 = e => log('Checkbox', 'change', e.detail);
    	const change_handler_4 = e => log('Checkbox', 'change', e.detail);
    	const change_handler_5 = e => log('Checkbox', 'change', e.detail);
    	const change_handler_6 = e => log('Checkbox', 'change', e.detail);
    	const change_handler_7 = e => log('Radio', 'change', e.detail);
    	const change_handler_8 = e => log('Radio', 'change', e.detail);
    	const change_handler_9 = e => log('TextField', 'change', e.detail);
    	const accept_handler = e => log('TextField', 'accept', e.detail);
    	const focus_handler = e => log('TextField', 'focus');
    	const blur_handler = e => log('TextField', 'blur');
    	const change_handler_10 = e => log('Spinner', 'change', e.detail);
    	const focus_handler_1 = e => log('Spinner', 'focus');
    	const blur_handler_1 = e => log('Spinner', 'blur');
    	const open_handler = e => log('MenuButton', 'open');
    	const close_handler = e => log('MenuButton', 'close');
    	const select_handler = e => log('MenuButton', 'select', e.detail);
    	const open_handler_1 = e => log('MenuButton', 'open');
    	const close_handler_1 = e => log('MenuButton', 'close');
    	const select_handler_1 = e => log('MenuButton', 'select', e.detail);
    	const change_handler_11 = e => log('Select', 'change', e.detail);
    	const change_handler_12 = e => log('Select', 'change', e.detail);
    	const change_handler_13 = e => log('ScrollBar', 'change', e.detail);
    	const select_handler_2 = e => log('MenuBar', 'select', e.detail.item.label);
    	const change_handler_14 = e => log('TabView', 'change', e.detail);
    	const closing_handler = e => log('TabView', 'closing', e.detail);

    	const func_2 = index => {
    		log('TabDoc', 'onCanClose', index);
    		return false;
    	};

    	$$self.$capture_state = () => ({
    		Section,
    		Area,
    		Events,
    		isAlphaNumeric,
    		MenuItem,
    		separator,
    		Action,
    		action,
    		Label,
    		Icon,
    		PushButton,
    		ButtonGroup,
    		Checkbox,
    		RadioGroup,
    		TextField,
    		Spinner,
    		MenuButton,
    		Select,
    		ScrollBar,
    		ScrollView,
    		MenuBar,
    		Tooltip,
    		Panel,
    		TabView,
    		TabDoc,
    		radioOptions,
    		alphaNumericFilter,
    		simpleMenu1,
    		simpleMenu2,
    		simpleMenu3,
    		simpleMenu4,
    		buttonGroupOptions,
    		simpleMenuBar,
    		simpleTabs,
    		closeTabHandler,
    		log
    	});

    	$$self.$inject_state = $$props => {
    		if ('simpleTabs' in $$props) $$invalidate(1, simpleTabs = $$props.simpleTabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		simpleMenu1,
    		simpleTabs,
    		radioOptions,
    		alphaNumericFilter,
    		buttonGroupOptions,
    		simpleMenuBar,
    		closeTabHandler,
    		log,
    		clicked_handler,
    		clicked_handler_1,
    		push_handler,
    		down_handler,
    		up_handler,
    		click_handler,
    		longpress_handler,
    		push_handler_1,
    		down_handler_1,
    		up_handler_1,
    		push_handler_2,
    		down_handler_2,
    		up_handler_2,
    		longpress_handler_1,
    		push_handler_3,
    		down_handler_3,
    		up_handler_3,
    		longpress_handler_2,
    		push_handler_4,
    		down_handler_4,
    		toggle_handler,
    		up_handler_4,
    		click_handler_1,
    		toggle_handler_1,
    		func,
    		func_1,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		change_handler_4,
    		change_handler_5,
    		change_handler_6,
    		change_handler_7,
    		change_handler_8,
    		change_handler_9,
    		accept_handler,
    		focus_handler,
    		blur_handler,
    		change_handler_10,
    		focus_handler_1,
    		blur_handler_1,
    		open_handler,
    		close_handler,
    		select_handler,
    		open_handler_1,
    		close_handler_1,
    		select_handler_1,
    		change_handler_11,
    		change_handler_12,
    		change_handler_13,
    		select_handler_2,
    		change_handler_14,
    		closing_handler,
    		func_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
