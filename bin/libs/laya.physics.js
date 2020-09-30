var COMPILED = !0,
  goog = goog || {};
goog.global = window;
goog.isDef = function (a) {
  return void 0 !== a;
};
goog.exportPath_ = function (a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d; a.length && (d = a.shift()); )
    !a.length && goog.isDef(b) ? (c[d] = b) : (c = c[d] ? c[d] : (c[d] = {}));
};
goog.define = function (a, b) {
  var c = b;
  COMPILED ||
    (goog.global.CLOSURE_UNCOMPILED_DEFINES &&
    Object.prototype.hasOwnProperty.call(
      goog.global.CLOSURE_UNCOMPILED_DEFINES,
      a
    )
      ? (c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a])
      : goog.global.CLOSURE_DEFINES &&
        Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) &&
        (c = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, c);
};
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function (a) {
  if (!COMPILED && goog.isProvided_(a))
    throw Error('Namespace "' + a + '" already declared.');
  goog.constructNamespace_(a);
};
goog.constructNamespace_ = function (a, b) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[a];
    for (
      var c = a;
      (c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);

    )
      goog.implicitNamespaces_[c] = !0;
  }
  goog.exportPath_(a, b);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function (a) {
  if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_))
    throw Error("Invalid module identifier");
  if (!goog.isInModuleLoader_())
    throw Error("Module " + a + " has been loaded incorrectly.");
  if (goog.moduleLoaderState_.moduleName)
    throw Error("goog.module may only be called once per module.");
  goog.moduleLoaderState_.moduleName = a;
  if (!COMPILED) {
    if (goog.isProvided_(a))
      throw Error('Namespace "' + a + '" already declared.');
    delete goog.implicitNamespaces_[a];
  }
};
goog.module.get = function (a) {
  return goog.module.getInternal_(a);
};
goog.module.getInternal_ = function (a) {
  if (!COMPILED)
    return goog.isProvided_(a)
      ? a in goog.loadedModules_
        ? goog.loadedModules_[a]
        : goog.getObjectByName(a)
      : null;
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function () {
  return null != goog.moduleLoaderState_;
};
goog.module.declareLegacyNamespace = function () {
  if (!COMPILED && !goog.isInModuleLoader_())
    throw Error(
      "goog.module.declareLegacyNamespace must be called from within a goog.module"
    );
  if (!COMPILED && !goog.moduleLoaderState_.moduleName)
    throw Error(
      "goog.module must be called prior to goog.module.declareLegacyNamespace."
    );
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function (a) {
  if (goog.DISALLOW_TEST_ONLY_CODE)
    throw (
      ((a = a || ""),
      Error(
        "Importing test-only code into non-debug environment" +
          (a ? ": " + a : ".")
      ))
    );
};
goog.forwardDeclare = function (a) {};
COMPILED ||
  ((goog.isProvided_ = function (a) {
    return (
      a in goog.loadedModules_ ||
      (!goog.implicitNamespaces_[a] &&
        goog.isDefAndNotNull(goog.getObjectByName(a)))
    );
  }),
  (goog.implicitNamespaces_ = {
    "goog.module": !0,
  }));
goog.getObjectByName = function (a, b) {
  for (var c = a.split("."), d = b || goog.global, e; (e = c.shift()); )
    if (goog.isDefAndNotNull(d[e])) d = d[e];
    else return null;
  return d;
};
goog.globalize = function (a, b) {
  var c = b || goog.global,
    d;
  for (d in a) c[d] = a[d];
};
goog.addDependency = function (a, b, c, d) {
  if (goog.DEPENDENCIES_ENABLED) {
    var e;
    a = a.replace(/\\/g, "/");
    for (var f = goog.dependencies_, g = 0; (e = b[g]); g++)
      (f.nameToPath[e] = a), (f.pathIsModule[a] = !!d);
    for (d = 0; (b = c[d]); d++)
      a in f.requires || (f.requires[a] = {}), (f.requires[a][b] = !0);
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function (a) {
  goog.global.console && goog.global.console.error(a);
};
goog.require = function (a) {
  if (!COMPILED) {
    goog.ENABLE_DEBUG_LOADER &&
      goog.IS_OLD_IE_ &&
      goog.maybeProcessDeferredDep_(a);
    if (goog.isProvided_(a))
      return goog.isInModuleLoader_() ? goog.module.getInternal_(a) : null;
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) return goog.writeScripts_(b), null;
    }
    a = "goog.require could not find: " + a;
    goog.logToConsole_(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function () {};
goog.abstractMethod = function () {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function (a) {
  a.getInstance = function () {
    if (a.instance_) return a.instance_;
    goog.DEBUG &&
      (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return (a.instance_ = new a());
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED &&
  ((goog.dependencies_ = {
    pathIsModule: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {},
    deferred: {},
  }),
  (goog.inHtmlDocument_ = function () {
    var a = goog.global.document;
    return null != a && "write" in a;
  }),
  (goog.findBasePath_ = function () {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH))
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
      for (
        var a = goog.global.document.getElementsByTagName("SCRIPT"),
          b = a.length - 1;
        0 <= b;
        --b
      ) {
        var c = a[b].src,
          d = c.lastIndexOf("?"),
          d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
  }),
  (goog.importScript_ = function (a, b) {
    (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(a, b) &&
      (goog.dependencies_.written[a] = !0);
  }),
  (goog.IS_OLD_IE_ = !(
    goog.global.atob ||
    !goog.global.document ||
    !goog.global.document.all
  )),
  (goog.importModule_ = function (a) {
    goog.importScript_("", 'goog.retrieveAndExecModule_("' + a + '");') &&
      (goog.dependencies_.written[a] = !0);
  }),
  (goog.queuedModules_ = []),
  (goog.wrapModule_ = function (a, b) {
    return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON)
      ? "goog.loadModule(" +
          goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") +
          ");"
      : 'goog.loadModule(function(exports) {"use strict";' +
          b +
          "\n;return exports});\n//# sourceURL=" +
          a +
          "\n";
  }),
  (goog.loadQueuedModules_ = function () {
    var a = goog.queuedModules_.length;
    if (0 < a) {
      var b = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var c = 0; c < a; c++) goog.maybeProcessDeferredPath_(b[c]);
    }
  }),
  (goog.maybeProcessDeferredDep_ = function (a) {
    goog.isDeferredModule_(a) &&
      goog.allDepsAreAvailable_(a) &&
      ((a = goog.getPathFromDeps_(a)),
      goog.maybeProcessDeferredPath_(goog.basePath + a));
  }),
  (goog.isDeferredModule_ = function (a) {
    return (a = goog.getPathFromDeps_(a)) && goog.dependencies_.pathIsModule[a]
      ? goog.basePath + a in goog.dependencies_.deferred
      : !1;
  }),
  (goog.allDepsAreAvailable_ = function (a) {
    if ((a = goog.getPathFromDeps_(a)) && a in goog.dependencies_.requires)
      for (var b in goog.dependencies_.requires[a])
        if (!goog.isProvided_(b) && !goog.isDeferredModule_(b)) return !1;
    return !0;
  }),
  (goog.maybeProcessDeferredPath_ = function (a) {
    if (a in goog.dependencies_.deferred) {
      var b = goog.dependencies_.deferred[a];
      delete goog.dependencies_.deferred[a];
      goog.globalEval(b);
    }
  }),
  (goog.loadModuleFromUrl = function (a) {
    goog.retrieveAndExecModule_(a);
  }),
  (goog.loadModule = function (a) {
    var b = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {
        moduleName: void 0,
        declareLegacyNamespace: !1,
      };
      var c;
      if (goog.isFunction(a)) c = a.call(goog.global, {});
      else if (goog.isString(a))
        c = goog.loadModuleFromSource_.call(goog.global, a);
      else throw Error("Invalid module definition");
      var d = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(d) || !d)
        throw Error('Invalid module name "' + d + '"');
      goog.moduleLoaderState_.declareLegacyNamespace
        ? goog.constructNamespace_(d, c)
        : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(c);
      goog.loadedModules_[d] = c;
    } finally {
      goog.moduleLoaderState_ = b;
    }
  }),
  (goog.loadModuleFromSource_ = function (a) {
    eval(a);
    return {};
  }),
  (goog.writeScriptSrcNode_ = function (a) {
    goog.global.document.write(
      '<script type="text/javascript" src="' + a + '">\x3c/script>'
    );
  }),
  (goog.appendScriptSrcNode_ = function (a) {
    var b = goog.global.document,
      c = b.createElement("script");
    c.type = "text/javascript";
    c.src = a;
    c.defer = !1;
    c.async = !1;
    b.head.appendChild(c);
  }),
  (goog.writeScriptTag_ = function (a, b) {
    if (goog.inHtmlDocument_()) {
      var c = goog.global.document;
      if (
        !goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING &&
        "complete" == c.readyState
      ) {
        if (/\bdeps.js$/.test(a)) return !1;
        throw Error('Cannot write "' + a + '" after document load');
      }
      var d = goog.IS_OLD_IE_;
      void 0 === b
        ? d
          ? ((d =
              " onreadystatechange='goog.onScriptLoad_(this, " +
              ++goog.lastNonModuleScriptIndex_ +
              ")' "),
            c.write(
              '<script type="text/javascript" src="' +
                a +
                '"' +
                d +
                ">\x3c/script>"
            ))
          : goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING
          ? goog.appendScriptSrcNode_(a)
          : goog.writeScriptSrcNode_(a)
        : c.write('<script type="text/javascript">' + b + "\x3c/script>");
      return !0;
    }
    return !1;
  }),
  (goog.lastNonModuleScriptIndex_ = 0),
  (goog.onScriptLoad_ = function (a, b) {
    "complete" == a.readyState &&
      goog.lastNonModuleScriptIndex_ == b &&
      goog.loadQueuedModules_();
    return !0;
  }),
  (goog.writeScripts_ = function (a) {
    function b(a) {
      if (!(a in e.written || a in e.visited)) {
        e.visited[a] = !0;
        if (a in e.requires)
          for (var f in e.requires[a])
            if (!goog.isProvided_(f))
              if (f in e.nameToPath) b(e.nameToPath[f]);
              else throw Error("Undefined nameToPath for " + f);
        a in d || ((d[a] = !0), c.push(a));
      }
    }
    var c = [],
      d = {},
      e = goog.dependencies_;
    b(a);
    for (a = 0; a < c.length; a++) {
      var f = c[a];
      goog.dependencies_.written[f] = !0;
    }
    var g = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (a = 0; a < c.length; a++)
      if ((f = c[a]))
        e.pathIsModule[f]
          ? goog.importModule_(goog.basePath + f)
          : goog.importScript_(goog.basePath + f);
      else
        throw ((goog.moduleLoaderState_ = g), Error("Undefined script input"));
    goog.moduleLoaderState_ = g;
  }),
  (goog.getPathFromDeps_ = function (a) {
    return a in goog.dependencies_.nameToPath
      ? goog.dependencies_.nameToPath[a]
      : null;
  }),
  goog.findBasePath_(),
  goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.normalizePath_ = function (a) {
  a = a.split("/");
  for (var b = 0; b < a.length; )
    "." == a[b]
      ? a.splice(b, 1)
      : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1]
      ? a.splice(--b, 2)
      : b++;
  return a.join("/");
};
goog.loadFileSync_ = function (a) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC)
    return goog.global.CLOSURE_LOAD_FILE_SYNC(a);
  var b = new goog.global.XMLHttpRequest();
  b.open("get", a, !1);
  b.send();
  return b.responseText;
};
goog.retrieveAndExecModule_ = function (a) {
  if (!COMPILED) {
    var b = a;
    a = goog.normalizePath_(a);
    var c = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_,
      d = goog.loadFileSync_(a);
    if (null != d)
      (d = goog.wrapModule_(a, d)),
        goog.IS_OLD_IE_
          ? ((goog.dependencies_.deferred[b] = d), goog.queuedModules_.push(b))
          : c(a, d);
    else throw Error("load of " + a + "failed");
  }
};
goog.typeOf = function (a) {
  var b = typeof a;
  if ("object" == b)
    if (a) {
      if (a instanceof Array) return "array";
      if (a instanceof Object) return b;
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) return "object";
      if (
        "[object Array]" == c ||
        ("number" == typeof a.length &&
          "undefined" != typeof a.splice &&
          "undefined" != typeof a.propertyIsEnumerable &&
          !a.propertyIsEnumerable("splice"))
      )
        return "array";
      if (
        "[object Function]" == c ||
        ("undefined" != typeof a.call &&
          "undefined" != typeof a.propertyIsEnumerable &&
          !a.propertyIsEnumerable("call"))
      )
        return "function";
    } else return "null";
  else if ("function" == b && "undefined" == typeof a.call) return "object";
  return b;
};
goog.isNull = function (a) {
  return null === a;
};
goog.isDefAndNotNull = function (a) {
  return null != a;
};
goog.isArray = function (a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function (a) {
  var b = goog.typeOf(a);
  return "array" == b || ("object" == b && "number" == typeof a.length);
};
goog.isDateLike = function (a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isString = function (a) {
  return "string" == typeof a;
};
goog.isBoolean = function (a) {
  return "boolean" == typeof a;
};
goog.isNumber = function (a) {
  return "number" == typeof a;
};
goog.isFunction = function (a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function (a) {
  var b = typeof a;
  return ("object" == b && null != a) || "function" == b;
};
goog.getUid = function (a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function (a) {
  return !!a[goog.UID_PROPERTY_];
};
goog.removeUid = function (a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + ((1e9 * Math.random()) >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function (a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) return a.clone();
    var b = "array" == b ? [] : {},
      c;
    for (c in a) b[c] = goog.cloneObject(a[c]);
    return b;
  }
  return a;
};
goog.bindNative_ = function (a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function (a, b, c) {
  if (!a) throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function () {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function () {
    return a.apply(b, arguments);
  };
};
goog.bind = function (a, b, c) {
  Function.prototype.bind &&
  -1 != Function.prototype.bind.toString().indexOf("native code")
    ? (goog.bind = goog.bindNative_)
    : (goog.bind = goog.bindJs_);
  return goog.bind.apply(null, arguments);
};
goog.partial = function (a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function () {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function (a, b) {
  for (var c in b) a[c] = b[c];
};
goog.now =
  (goog.TRUSTED_SITE && Date.now) ||
  function () {
    return +new Date();
  };
goog.globalEval = function (a) {
  if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
  else if (goog.global.eval) {
    if (null == goog.evalWorksForGlobals_)
      if (
        (goog.global.eval("var _evalTest_ = 1;"),
        "undefined" != typeof goog.global._evalTest_)
      ) {
        try {
          delete goog.global._evalTest_;
        } catch (d) {}
        goog.evalWorksForGlobals_ = !0;
      } else goog.evalWorksForGlobals_ = !1;
    if (goog.evalWorksForGlobals_) goog.global.eval(a);
    else {
      var b = goog.global.document,
        c = b.createElement("SCRIPT");
      c.type = "text/javascript";
      c.defer = !1;
      c.appendChild(b.createTextNode(a));
      b.body.appendChild(c);
      b.body.removeChild(c);
    }
  } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function (a, b) {
  var c = function (a) {
      return goog.cssNameMapping_[a] || a;
    },
    d = function (a) {
      a = a.split("-");
      for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
      return b.join("-");
    },
    d = goog.cssNameMapping_
      ? "BY_WHOLE" == goog.cssNameMappingStyle_
        ? c
        : d
      : function (a) {
          return a;
        };
  return b ? a + "-" + d(b) : d(a);
};
goog.setCssNameMapping = function (a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED &&
  goog.global.CLOSURE_CSS_NAME_MAPPING &&
  (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function (a, b) {
  b &&
    (a = a.replace(/\{\$([^}]+)}/g, function (a, d) {
      return null != b && d in b ? b[d] : a;
    }));
  return a;
};
goog.getMsgWithFallback = function (a, b) {
  return a;
};
goog.exportSymbol = function (a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function (a, b, c) {
  a[b] = c;
};
goog.inherits = function (a, b) {
  function c() {}
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c();
  a.prototype.constructor = a;
  a.base = function (a, c, f) {
    for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++)
      g[h - 2] = arguments[h];
    return b.prototype[c].apply(a, g);
  };
};
goog.base = function (a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !d))
    throw Error(
      "arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C"
    );
  if (d.superClass_) {
    for (var e = Array(arguments.length - 1), f = 1; f < arguments.length; f++)
      e[f - 1] = arguments[f];
    return d.superClass_.constructor.apply(a, e);
  }
  e = Array(arguments.length - 2);
  for (f = 2; f < arguments.length; f++) e[f - 2] = arguments[f];
  for (
    var f = !1, g = a.constructor;
    g;
    g = g.superClass_ && g.superClass_.constructor
  )
    if (g.prototype[b] === d) f = !0;
    else if (f) return g.prototype[b].apply(a, e);
  if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
  throw Error(
    "goog.base called from a method of one name to a method of a different name"
  );
};
goog.scope = function (a) {
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function (a, b) {
  var c = b.constructor,
    d = b.statics;
  (c && c != Object.prototype.constructor) ||
    (c = function () {
      throw Error("cannot instantiate an interface (no constructor defined).");
    });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d &&
    (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function (a, b) {
  if (
    goog.defineClass.SEAL_CLASS_INSTANCES &&
    Object.seal instanceof Function
  ) {
    if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_])
      return a;
    var c = function () {
      var b = a.apply(this, arguments) || this;
      b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];
      this.constructor === c && Object.seal(b);
      return b;
    };
    return c;
  }
  return a;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
  " "
);
goog.defineClass.applyProperties_ = function (a, b) {
  for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++)
    (c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d]),
      Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
};
goog.tagUnsealableClass = function (a) {
  !COMPILED &&
    goog.defineClass.SEAL_CLASS_INSTANCES &&
    (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
var box2d = {
  b2Settings: {},
};
Object.defineProperty ||
  (Object.defineProperty = function (a, b, c) {
    Object.__defineGetter__ &&
      ("get" in c
        ? a.__defineGetter__(b, c.get)
        : "value" in c && a.__defineGetter__(b, c.value));
    Object.__defineSetter__ &&
      ("set" in c
        ? a.__defineSetter__(b, c.set)
        : "value" in c && a.__defineSetter__(b, c.value));
    return a;
  });
box2d.DEBUG = !0;
goog.exportSymbol("box2d.DEBUG", box2d.DEBUG);
box2d.ENABLE_ASSERTS = box2d.DEBUG;
goog.exportSymbol("box2d.ENABLE_ASSERTS", box2d.ENABLE_ASSERTS);
box2d.b2Assert = function (a, b, c) {
  if (box2d.DEBUG && !a) throw Error();
};
goog.exportSymbol("box2d.b2Assert", box2d.b2Assert);
box2d.b2_maxFloat = 1e37;
goog.exportSymbol("box2d.b2_maxFloat", box2d.b2_maxFloat);
box2d.b2_epsilon = 1e-5;
goog.exportSymbol("box2d.b2_epsilon", box2d.b2_epsilon);
box2d.b2_epsilon_sq = box2d.b2_epsilon * box2d.b2_epsilon;
goog.exportSymbol("box2d.b2_epsilon_sq", box2d.b2_epsilon_sq);
box2d.b2_pi = Math.PI;
goog.exportSymbol("box2d.b2_pi", box2d.b2_pi);
box2d.b2_maxManifoldPoints = 2;
goog.exportSymbol("box2d.b2_maxManifoldPoints", box2d.b2_maxManifoldPoints);
box2d.b2_maxPolygonVertices = 8;
goog.exportSymbol("box2d.b2_maxPolygonVertices", box2d.b2_maxPolygonVertices);
box2d.b2_aabbExtension = 0.1;
goog.exportSymbol("box2d.b2_aabbExtension", box2d.b2_aabbExtension);
box2d.b2_aabbMultiplier = 2;
goog.exportSymbol("box2d.b2_aabbMultiplier", box2d.b2_aabbMultiplier);
box2d.b2_linearSlop = 0.008;
goog.exportSymbol("box2d.b2_linearSlop", box2d.b2_linearSlop);
box2d.b2_angularSlop = (2 / 180) * box2d.b2_pi;
goog.exportSymbol("box2d.b2_angularSlop", box2d.b2_angularSlop);
box2d.b2_polygonRadius = 2 * box2d.b2_linearSlop;
goog.exportSymbol("box2d.b2_polygonRadius", box2d.b2_polygonRadius);
box2d.b2_maxSubSteps = 8;
goog.exportSymbol("box2d.b2_maxSubSteps", box2d.b2_maxSubSteps);
box2d.b2_maxTOIContacts = 32;
goog.exportSymbol("box2d.b2_maxTOIContacts", box2d.b2_maxTOIContacts);
box2d.b2_velocityThreshold = 1;
goog.exportSymbol("box2d.b2_velocityThreshold", box2d.b2_velocityThreshold);
box2d.b2_maxLinearCorrection = 0.2;
goog.exportSymbol("box2d.b2_maxLinearCorrection", box2d.b2_maxLinearCorrection);
box2d.b2_maxAngularCorrection = (8 / 180) * box2d.b2_pi;
goog.exportSymbol(
  "box2d.b2_maxAngularCorrection",
  box2d.b2_maxAngularCorrection
);
box2d.b2_maxTranslation = 2;
goog.exportSymbol("box2d.b2_maxTranslation", box2d.b2_maxTranslation);
box2d.b2_maxTranslationSquared =
  box2d.b2_maxTranslation * box2d.b2_maxTranslation;
goog.exportSymbol(
  "box2d.b2_maxTranslationSquared",
  box2d.b2_maxTranslationSquared
);
box2d.b2_maxRotation = 0.5 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_maxRotation", box2d.b2_maxRotation);
box2d.b2_maxRotationSquared = box2d.b2_maxRotation * box2d.b2_maxRotation;
goog.exportSymbol("box2d.b2_maxRotationSquared", box2d.b2_maxRotationSquared);
box2d.b2_baumgarte = 0.2;
goog.exportSymbol("box2d.b2_baumgarte", box2d.b2_baumgarte);
box2d.b2_toiBaumgarte = 0.75;
goog.exportSymbol("box2d.b2_toiBaumgarte", box2d.b2_toiBaumgarte);
box2d.b2_invalidParticleIndex = -1;
goog.exportSymbol(
  "box2d.b2_invalidParticleIndex",
  box2d.b2_invalidParticleIndex
);
box2d.b2_maxParticleIndex = 2147483647;
goog.exportSymbol("box2d.b2_maxParticleIndex", box2d.b2_maxParticleIndex);
box2d.b2_particleStride = 0.75;
goog.exportSymbol("box2d.b2_particleStride", box2d.b2_particleStride);
box2d.b2_minParticleWeight = 1;
goog.exportSymbol("box2d.b2_minParticleWeight", box2d.b2_minParticleWeight);
box2d.b2_maxParticlePressure = 0.25;
goog.exportSymbol("box2d.b2_maxParticlePressure", box2d.b2_maxParticlePressure);
box2d.b2_maxParticleForce = 0.5;
goog.exportSymbol("box2d.b2_maxParticleForce", box2d.b2_maxParticleForce);
box2d.b2_maxTriadDistance = 2;
goog.exportSymbol("box2d.b2_maxTriadDistance", box2d.b2_maxTriadDistance);
box2d.b2_maxTriadDistanceSquared =
  box2d.b2_maxTriadDistance * box2d.b2_maxTriadDistance;
goog.exportSymbol(
  "box2d.b2_maxTriadDistanceSquared",
  box2d.b2_maxTriadDistanceSquared
);
box2d.b2_minParticleSystemBufferCapacity = 256;
goog.exportSymbol(
  "box2d.b2_minParticleSystemBufferCapacity",
  box2d.b2_minParticleSystemBufferCapacity
);
box2d.b2_barrierCollisionTime = 2.5;
goog.exportSymbol(
  "box2d.b2_barrierCollisionTime",
  box2d.b2_barrierCollisionTime
);
box2d.b2_timeToSleep = 0.5;
goog.exportSymbol("box2d.b2_timeToSleep", box2d.b2_timeToSleep);
box2d.b2_linearSleepTolerance = 0.01;
goog.exportSymbol(
  "box2d.b2_linearSleepTolerance",
  box2d.b2_linearSleepTolerance
);
box2d.b2_angularSleepTolerance = (2 / 180) * box2d.b2_pi;
goog.exportSymbol(
  "box2d.b2_angularSleepTolerance",
  box2d.b2_angularSleepTolerance
);
box2d.b2Alloc = function (a) {
  return null;
};
goog.exportSymbol("box2d.b2Alloc", box2d.b2Alloc);
box2d.b2Free = function (a) {};
goog.exportSymbol("box2d.b2Free", box2d.b2Free);
box2d.b2Log = function (a) {
  goog.global.console.log.apply(null, arguments);
};
goog.exportSymbol("box2d.b2Log", box2d.b2Log);
box2d.b2Version = function (a, b, c) {
  this.major = a || 0;
  this.minor = b || 0;
  this.revision = c || 0;
};
goog.exportSymbol("box2d.b2Version", box2d.b2Version);
box2d.b2Version.prototype.major = 0;
goog.exportProperty(
  box2d.b2Version.prototype,
  "major",
  box2d.b2Version.prototype.major
);
box2d.b2Version.prototype.minor = 0;
goog.exportProperty(
  box2d.b2Version.prototype,
  "minor",
  box2d.b2Version.prototype.minor
);
box2d.b2Version.prototype.revision = 0;
goog.exportProperty(
  box2d.b2Version.prototype,
  "revision",
  box2d.b2Version.prototype.revision
);
box2d.b2Version.prototype.toString = function () {
  return this.major + "." + this.minor + "." + this.revision;
};
goog.exportProperty(
  box2d.b2Version.prototype,
  "toString",
  box2d.b2Version.prototype.toString
);
box2d.b2_version = new box2d.b2Version(2, 3, 2);
goog.exportSymbol("box2d.b2_version", box2d.b2_version);
box2d.b2_changelist = 313;
goog.exportSymbol("box2d.b2_changelist", box2d.b2_changelist);
box2d.b2ParseInt = function (a) {
  return parseInt(a, 10);
};
goog.exportSymbol("box2d.b2ParseInt", box2d.b2ParseInt);
box2d.b2ParseUInt = function (a) {
  return box2d.b2Abs(parseInt(a, 10));
};
goog.exportSymbol("box2d.b2ParseUInt", box2d.b2ParseUInt);
box2d.b2MakeArray = function (a, b) {
  a = "number" === typeof a ? a : 0;
  var c = [];
  if ("function" === typeof b) for (var d = 0; d < a; ++d) c.push(b(d));
  else for (d = 0; d < a; ++d) c.push(null);
  return c;
};
goog.exportSymbol("box2d.b2MakeArray", box2d.b2MakeArray);
box2d.b2MakeNumberArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return 0;
  });
};
goog.exportSymbol("box2d.b2MakeNumberArray", box2d.b2MakeNumberArray);
box2d.b2Color = function (a, b, c, d) {
  this.r = a;
  this.g = b;
  this.b = c;
  this.a = "number" === typeof d ? d : 1;
};
goog.exportSymbol("box2d.b2Color", box2d.b2Color);
box2d.b2Color.prototype.r = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "r", box2d.b2Color.prototype.r);
box2d.b2Color.prototype.g = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "g", box2d.b2Color.prototype.g);
box2d.b2Color.prototype.b = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "b", box2d.b2Color.prototype.b);
box2d.b2Color.prototype.a = 1;
goog.exportProperty(box2d.b2Color.prototype, "a", box2d.b2Color.prototype.a);
box2d.b2Color.prototype.SetRGB = function (a, b, c) {
  this.r = a;
  this.g = b;
  this.b = c;
  return this;
};
goog.exportProperty(
  box2d.b2Color.prototype,
  "SetRGB",
  box2d.b2Color.prototype.SetRGB
);
box2d.b2Color.prototype.MakeStyleString = function (a) {
  return box2d.b2Color.MakeStyleString(
    Math.round(Math.max(0, Math.min(255, 255 * this.r))),
    Math.round(Math.max(0, Math.min(255, 255 * this.g))),
    Math.round(Math.max(0, Math.min(255, 255 * this.b))),
    "undefined" === typeof a ? this.a : Math.max(0, Math.min(1, a))
  );
};
goog.exportProperty(
  box2d.b2Color.prototype,
  "MakeStyleString",
  box2d.b2Color.prototype.MakeStyleString
);
box2d.b2Color.MakeStyleString = function (a, b, c, d) {
  return 1 > d
    ? "rgba(" + a + "," + b + "," + c + "," + d + ")"
    : "rgb(" + a + "," + b + "," + c + ")";
};
goog.exportProperty(
  box2d.b2Color,
  "MakeStyleString",
  box2d.b2Color.MakeStyleString
);
box2d.b2Color.RED = new box2d.b2Color(1, 0, 0);
goog.exportProperty(box2d.b2Color, "RED", box2d.b2Color.RED);
box2d.b2Color.GREEN = new box2d.b2Color(0, 1, 0);
goog.exportProperty(box2d.b2Color, "GREEN", box2d.b2Color.GREEN);
box2d.b2Color.BLUE = new box2d.b2Color(0, 0, 1);
goog.exportProperty(box2d.b2Color, "BLUE", box2d.b2Color.BLUE);
box2d.b2DrawFlags = {
  e_none: 0,
  e_shapeBit: 1,
  e_jointBit: 2,
  e_aabbBit: 4,
  e_pairBit: 8,
  e_centerOfMassBit: 16,
  e_controllerBit: 32,
  e_particleBit: 64,
  e_all: 65535,
};
goog.exportSymbol("box2d.b2DrawFlags", box2d.b2DrawFlags);
goog.exportProperty(box2d.b2DrawFlags, "e_none", box2d.b2DrawFlags.e_none);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_shapeBit",
  box2d.b2DrawFlags.e_shapeBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_jointBit",
  box2d.b2DrawFlags.e_jointBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_aabbBit",
  box2d.b2DrawFlags.e_aabbBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_pairBit",
  box2d.b2DrawFlags.e_pairBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_centerOfMassBit",
  box2d.b2DrawFlags.e_centerOfMassBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_controllerBit",
  box2d.b2DrawFlags.e_controllerBit
);
goog.exportProperty(
  box2d.b2DrawFlags,
  "e_particleBit",
  box2d.b2DrawFlags.e_particleBit
);
goog.exportProperty(box2d.b2DrawFlags, "e_all", box2d.b2DrawFlags.e_all);
box2d.b2Draw = function () {};
goog.exportSymbol("box2d.b2Draw", box2d.b2Draw);
box2d.b2Draw.prototype.m_drawFlags = box2d.b2DrawFlags.e_none;
goog.exportProperty(
  box2d.b2Draw.prototype,
  "m_drawFlags",
  box2d.b2Draw.prototype.m_drawFlags
);
box2d.b2Draw.prototype.SetFlags = function (a) {
  this.m_drawFlags = a;
};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "SetFlags",
  box2d.b2Draw.prototype.SetFlags
);
box2d.b2Draw.prototype.GetFlags = function () {
  return this.m_drawFlags;
};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "GetFlags",
  box2d.b2Draw.prototype.GetFlags
);
box2d.b2Draw.prototype.AppendFlags = function (a) {
  this.m_drawFlags |= a;
};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "AppendFlags",
  box2d.b2Draw.prototype.AppendFlags
);
box2d.b2Draw.prototype.ClearFlags = function (a) {
  this.m_drawFlags &= ~a;
};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "ClearFlags",
  box2d.b2Draw.prototype.ClearFlags
);
box2d.b2Draw.prototype.PushTransform = function (a) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "PushTransform",
  box2d.b2Draw.prototype.PushTransform
);
box2d.b2Draw.prototype.PopTransform = function (a) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "PopTransform",
  box2d.b2Draw.prototype.PopTransform
);
box2d.b2Draw.prototype.DrawPolygon = function (a, b, c) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawPolygon",
  box2d.b2Draw.prototype.DrawPolygon
);
box2d.b2Draw.prototype.DrawSolidPolygon = function (a, b, c) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawSolidPolygon",
  box2d.b2Draw.prototype.DrawSolidPolygon
);
box2d.b2Draw.prototype.DrawCircle = function (a, b, c) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawCircle",
  box2d.b2Draw.prototype.DrawCircle
);
box2d.b2Draw.prototype.DrawSolidCircle = function (a, b, c, d) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawSolidCircle",
  box2d.b2Draw.prototype.DrawSolidCircle
);
box2d.b2Draw.prototype.DrawParticles = function (a, b, c, d) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawParticles",
  box2d.b2Draw.prototype.DrawParticles
);
box2d.b2Draw.prototype.DrawSegment = function (a, b, c) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawSegment",
  box2d.b2Draw.prototype.DrawSegment
);
box2d.b2Draw.prototype.DrawTransform = function (a) {};
goog.exportProperty(
  box2d.b2Draw.prototype,
  "DrawTransform",
  box2d.b2Draw.prototype.DrawTransform
);
box2d.b2GrowableStack = function (a) {
  this.m_stack = Array(a);
};
goog.exportSymbol("box2d.b2GrowableStack", box2d.b2GrowableStack);
box2d.b2GrowableStack.prototype.m_stack = null;
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "m_stack",
  box2d.b2GrowableStack.prototype.m_stack
);
box2d.b2GrowableStack.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "m_count",
  box2d.b2GrowableStack.prototype.m_count
);
box2d.b2GrowableStack.prototype.Reset = function () {
  this.m_count = 0;
  return this;
};
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "Reset",
  box2d.b2GrowableStack.prototype.Reset
);
box2d.b2GrowableStack.prototype.Push = function (a) {
  this.m_stack[this.m_count] = a;
  ++this.m_count;
};
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "Push",
  box2d.b2GrowableStack.prototype.Push
);
box2d.b2GrowableStack.prototype.Pop = function () {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_count);
  --this.m_count;
  var a = this.m_stack[this.m_count];
  this.m_stack[this.m_count] = null;
  return a;
};
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "Pop",
  box2d.b2GrowableStack.prototype.Pop
);
box2d.b2GrowableStack.prototype.GetCount = function () {
  return this.m_count;
};
goog.exportProperty(
  box2d.b2GrowableStack.prototype,
  "GetCount",
  box2d.b2GrowableStack.prototype.GetCount
);
box2d.b2Math = {};
box2d.b2_pi_over_180 = box2d.b2_pi / 180;
goog.exportSymbol("box2d.b2_pi_over_180", box2d.b2_pi_over_180);
box2d.b2_180_over_pi = 180 / box2d.b2_pi;
goog.exportSymbol("box2d.b2_180_over_pi", box2d.b2_180_over_pi);
box2d.b2_two_pi = 2 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_two_pi", box2d.b2_two_pi);
box2d.b2Abs = Math.abs;
goog.exportSymbol("box2d.b2Abs", box2d.b2Abs);
box2d.b2Min = Math.min;
goog.exportSymbol("box2d.b2Min", box2d.b2Min);
box2d.b2Max = Math.max;
goog.exportSymbol("box2d.b2Max", box2d.b2Max);
box2d.b2Clamp = function (a, b, c) {
  return Math.min(Math.max(a, b), c);
};
goog.exportSymbol("box2d.b2Clamp", box2d.b2Clamp);
box2d.b2Wrap = function (a, b, c) {
  return b < c
    ? a < b
      ? c - ((b - a) % (c - b))
      : b + ((a - b) % (c - b))
    : b === c
    ? b
    : a;
};
goog.exportSymbol("box2d.b2Wrap", box2d.b2Wrap);
box2d.b2WrapAngle = function (a) {
  return 0 > a
    ? ((a - box2d.b2_pi) % box2d.b2_two_pi) + box2d.b2_pi
    : ((a + box2d.b2_pi) % box2d.b2_two_pi) - box2d.b2_pi;
};
goog.exportSymbol("box2d.b2WrapAngle", box2d.b2WrapAngle);
box2d.b2Swap = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  var c = a[0];
  a[0] = b[0];
  b[0] = c;
};
goog.exportSymbol("box2d.b2Swap", box2d.b2Swap);
box2d.b2IsValid = function (a) {
  return isFinite(a);
};
goog.exportSymbol("box2d.b2IsValid", box2d.b2IsValid);
box2d.b2Sq = function (a) {
  return a * a;
};
goog.exportSymbol("box2d.b2Sq", box2d.b2Sq);
box2d.b2InvSqrt = function (a) {
  return 1 / Math.sqrt(a);
};
goog.exportSymbol("box2d.b2InvSqrt", box2d.b2InvSqrt);
box2d.b2Sqrt = function (a) {
  return Math.sqrt(a);
};
goog.exportSymbol("box2d.b2Sqrt", box2d.b2Sqrt);
box2d.b2Pow = function (a, b) {
  return Math.pow(a, b);
};
goog.exportSymbol("box2d.b2Pow", box2d.b2Pow);
box2d.b2DegToRad = function (a) {
  return a * box2d.b2_pi_over_180;
};
goog.exportSymbol("box2d.b2DegToRad", box2d.b2DegToRad);
box2d.b2RadToDeg = function (a) {
  return a * box2d.b2_180_over_pi;
};
goog.exportSymbol("box2d.b2RadToDeg", box2d.b2RadToDeg);
box2d.b2Cos = function (a) {
  return Math.cos(a);
};
goog.exportSymbol("box2d.b2Cos", box2d.b2Cos);
box2d.b2Sin = function (a) {
  return Math.sin(a);
};
goog.exportSymbol("box2d.b2Sin", box2d.b2Sin);
box2d.b2Acos = function (a) {
  return Math.acos(a);
};
goog.exportSymbol("box2d.b2Acos", box2d.b2Acos);
box2d.b2Asin = function (a) {
  return Math.asin(a);
};
goog.exportSymbol("box2d.b2Asin", box2d.b2Asin);
box2d.b2Atan2 = function (a, b) {
  return Math.atan2(a, b);
};
goog.exportSymbol("box2d.b2Atan2", box2d.b2Atan2);
box2d.b2NextPowerOfTwo = function (a) {
  a |= (a >> 1) & 2147483647;
  a |= (a >> 2) & 1073741823;
  a |= (a >> 4) & 268435455;
  a |= (a >> 8) & 16777215;
  return (a | ((a >> 16) & 65535)) + 1;
};
goog.exportSymbol("box2d.b2NextPowerOfTwo", box2d.b2NextPowerOfTwo);
box2d.b2IsPowerOfTwo = function (a) {
  return 0 < a && 0 === (a & (a - 1));
};
goog.exportSymbol("box2d.b2IsPowerOfTwo", box2d.b2IsPowerOfTwo);
box2d.b2Random = function () {
  return 2 * Math.random() - 1;
};
goog.exportSymbol("box2d.b2Random", box2d.b2Random);
box2d.b2RandomRange = function (a, b) {
  return (b - a) * Math.random() + a;
};
goog.exportSymbol("box2d.b2RandomRange", box2d.b2RandomRange);
box2d.b2Vec2 = function (a, b) {
  this.x = a || 0;
  this.y = b || 0;
};
goog.exportSymbol("box2d.b2Vec2", box2d.b2Vec2);
box2d.b2Vec2.prototype.x = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "x", box2d.b2Vec2.prototype.x);
box2d.b2Vec2.prototype.y = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "y", box2d.b2Vec2.prototype.y);
box2d.b2Vec2_zero = new box2d.b2Vec2();
goog.exportSymbol("box2d.b2Vec2_zero", box2d.b2Vec2_zero);
box2d.b2Vec2.ZERO = new box2d.b2Vec2();
goog.exportProperty(box2d.b2Vec2, "ZERO", box2d.b2Vec2.ZERO);
box2d.b2Vec2.UNITX = new box2d.b2Vec2(1, 0);
goog.exportProperty(box2d.b2Vec2, "UNITX", box2d.b2Vec2.UNITX);
box2d.b2Vec2.UNITY = new box2d.b2Vec2(0, 1);
goog.exportProperty(box2d.b2Vec2, "UNITY", box2d.b2Vec2.UNITY);
box2d.b2Vec2.s_t0 = new box2d.b2Vec2();
goog.exportProperty(box2d.b2Vec2, "s_t0", box2d.b2Vec2.s_t0);
box2d.b2Vec2.s_t1 = new box2d.b2Vec2();
goog.exportProperty(box2d.b2Vec2, "s_t1", box2d.b2Vec2.s_t1);
box2d.b2Vec2.s_t2 = new box2d.b2Vec2();
goog.exportProperty(box2d.b2Vec2, "s_t2", box2d.b2Vec2.s_t2);
box2d.b2Vec2.s_t3 = new box2d.b2Vec2();
goog.exportProperty(box2d.b2Vec2, "s_t3", box2d.b2Vec2.s_t3);
box2d.b2Vec2.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2Vec2();
  });
};
goog.exportProperty(box2d.b2Vec2, "MakeArray", box2d.b2Vec2.MakeArray);
box2d.b2Vec2.prototype.Clone = function () {
  return new box2d.b2Vec2(this.x, this.y);
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "Clone",
  box2d.b2Vec2.prototype.Clone
);
box2d.b2Vec2.prototype.SetZero = function () {
  this.y = this.x = 0;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SetZero",
  box2d.b2Vec2.prototype.SetZero
);
box2d.b2Vec2.prototype.Set = function (a, b) {
  this.x = a;
  this.y = b;
  return this;
};
goog.exportProperty(box2d.b2Vec2.prototype, "Set", box2d.b2Vec2.prototype.Set);
box2d.b2Vec2.prototype.Copy = function (a) {
  this.x = a.x;
  this.y = a.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "Copy",
  box2d.b2Vec2.prototype.Copy
);
box2d.b2Vec2.prototype.SelfAdd = function (a) {
  this.x += a.x;
  this.y += a.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfAdd",
  box2d.b2Vec2.prototype.SelfAdd
);
box2d.b2Vec2.prototype.SelfAddXY = function (a, b) {
  this.x += a;
  this.y += b;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfAddXY",
  box2d.b2Vec2.prototype.SelfAddXY
);
box2d.b2Vec2.prototype.SelfSub = function (a) {
  this.x -= a.x;
  this.y -= a.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfSub",
  box2d.b2Vec2.prototype.SelfSub
);
box2d.b2Vec2.prototype.SelfSubXY = function (a, b) {
  this.x -= a;
  this.y -= b;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfSubXY",
  box2d.b2Vec2.prototype.SelfSubXY
);
box2d.b2Vec2.prototype.SelfMul = function (a) {
  this.x *= a;
  this.y *= a;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfMul",
  box2d.b2Vec2.prototype.SelfMul
);
box2d.b2Vec2.prototype.SelfMulAdd = function (a, b) {
  this.x += a * b.x;
  this.y += a * b.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfMulAdd",
  box2d.b2Vec2.prototype.SelfMulAdd
);
box2d.b2Vec2.prototype.SelfMulSub = function (a, b) {
  this.x -= a * b.x;
  this.y -= a * b.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfMulSub",
  box2d.b2Vec2.prototype.SelfMulSub
);
box2d.b2Vec2.prototype.Dot = function (a) {
  return this.x * a.x + this.y * a.y;
};
goog.exportProperty(box2d.b2Vec2.prototype, "Dot", box2d.b2Vec2.prototype.Dot);
box2d.b2Vec2.prototype.Cross = function (a) {
  return this.x * a.y - this.y * a.x;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "Cross",
  box2d.b2Vec2.prototype.Cross
);
box2d.b2Vec2.prototype.Length = function () {
  var a = this.x,
    b = this.y;
  return Math.sqrt(a * a + b * b);
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "Length",
  box2d.b2Vec2.prototype.Length
);
box2d.b2Vec2.prototype.LengthSquared = function () {
  var a = this.x,
    b = this.y;
  return a * a + b * b;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "LengthSquared",
  box2d.b2Vec2.prototype.LengthSquared
);
box2d.b2Vec2.prototype.Normalize = function () {
  var a = this.Length();
  if (a >= box2d.b2_epsilon) {
    var b = 1 / a;
    this.x *= b;
    this.y *= b;
  }
  return a;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "Normalize",
  box2d.b2Vec2.prototype.Normalize
);
box2d.b2Vec2.prototype.SelfNormalize = function () {
  this.Normalize();
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfNormalize",
  box2d.b2Vec2.prototype.SelfNormalize
);
box2d.b2Vec2.prototype.SelfRotate = function (a, b) {
  var c = this.x,
    d = this.y;
  this.x = a * c - b * d;
  this.y = b * c + a * d;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfRotate",
  box2d.b2Vec2.prototype.SelfRotate
);
box2d.b2Vec2.prototype.SelfRotateAngle = function (a) {
  return this.SelfRotate(Math.cos(a), Math.sin(a));
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfRotateAngle",
  box2d.b2Vec2.prototype.SelfRotateAngle
);
box2d.b2Vec2.prototype.IsValid = function () {
  return isFinite(this.x) && isFinite(this.y);
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "IsValid",
  box2d.b2Vec2.prototype.IsValid
);
box2d.b2Vec2.prototype.SelfMin = function (a) {
  this.x = Math.min(this.x, a.x);
  this.y = Math.min(this.y, a.y);
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfMin",
  box2d.b2Vec2.prototype.SelfMin
);
box2d.b2Vec2.prototype.SelfMax = function (a) {
  this.x = Math.max(this.x, a.x);
  this.y = Math.max(this.y, a.y);
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfMax",
  box2d.b2Vec2.prototype.SelfMax
);
box2d.b2Vec2.prototype.SelfAbs = function () {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfAbs",
  box2d.b2Vec2.prototype.SelfAbs
);
box2d.b2Vec2.prototype.SelfNeg = function () {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfNeg",
  box2d.b2Vec2.prototype.SelfNeg
);
box2d.b2Vec2.prototype.SelfSkew = function () {
  var a = this.x;
  this.x = -this.y;
  this.y = a;
  return this;
};
goog.exportProperty(
  box2d.b2Vec2.prototype,
  "SelfSkew",
  box2d.b2Vec2.prototype.SelfSkew
);
box2d.b2Abs_V2 = function (a, b) {
  b.x = Math.abs(a.x);
  b.y = Math.abs(a.y);
  return b;
};
goog.exportSymbol("box2d.b2Abs_V2", box2d.b2Abs_V2);
box2d.b2Min_V2_V2 = function (a, b, c) {
  c.x = Math.min(a.x, b.x);
  c.y = Math.min(a.y, b.y);
  return c;
};
goog.exportSymbol("box2d.b2Min_V2_V2", box2d.b2Min_V2_V2);
box2d.b2Max_V2_V2 = function (a, b, c) {
  c.x = Math.max(a.x, b.x);
  c.y = Math.max(a.y, b.y);
  return c;
};
goog.exportSymbol("box2d.b2Max_V2_V2", box2d.b2Max_V2_V2);
box2d.b2Clamp_V2_V2_V2 = function (a, b, c, d) {
  d.x = Math.min(Math.max(a.x, b.x), c.x);
  d.y = Math.min(Math.max(a.y, b.y), c.y);
  return d;
};
goog.exportSymbol("box2d.b2Clamp_V2_V2_V2", box2d.b2Clamp_V2_V2_V2);
box2d.b2Dot_V2_V2 = function (a, b) {
  return a.x * b.x + a.y * b.y;
};
goog.exportSymbol("box2d.b2Dot_V2_V2", box2d.b2Dot_V2_V2);
box2d.b2Cross_V2_V2 = function (a, b) {
  return a.x * b.y - a.y * b.x;
};
goog.exportSymbol("box2d.b2Cross_V2_V2", box2d.b2Cross_V2_V2);
box2d.b2Cross_V2_S = function (a, b, c) {
  var d = a.x;
  c.x = b * a.y;
  c.y = -b * d;
  return c;
};
goog.exportSymbol("box2d.b2Cross_V2_S", box2d.b2Cross_V2_S);
box2d.b2Cross_S_V2 = function (a, b, c) {
  var d = b.x;
  c.x = -a * b.y;
  c.y = a * d;
  return c;
};
goog.exportSymbol("box2d.b2Cross_S_V2", box2d.b2Cross_S_V2);
box2d.b2Add_V2_V2 = function (a, b, c) {
  c.x = a.x + b.x;
  c.y = a.y + b.y;
  return c;
};
goog.exportSymbol("box2d.b2Add_V2_V2", box2d.b2Add_V2_V2);
box2d.b2Sub_V2_V2 = function (a, b, c) {
  c.x = a.x - b.x;
  c.y = a.y - b.y;
  return c;
};
goog.exportSymbol("box2d.b2Sub_V2_V2", box2d.b2Sub_V2_V2);
box2d.b2Add_V2_S = function (a, b, c) {
  c.x = a.x + b;
  c.y = a.y + b;
  return c;
};
goog.exportSymbol("box2d.b2Add_V2_S", box2d.b2Add_V2_S);
box2d.b2Sub_V2_S = function (a, b, c) {
  c.x = a.x - b;
  c.y = a.y - b;
  return c;
};
goog.exportSymbol("box2d.b2Sub_V2_S", box2d.b2Sub_V2_S);
box2d.b2Mul_S_V2 = function (a, b, c) {
  c.x = b.x * a;
  c.y = b.y * a;
  return c;
};
goog.exportSymbol("box2d.b2Mul_S_V2", box2d.b2Mul_S_V2);
box2d.b2Mul_V2_S = function (a, b, c) {
  c.x = a.x * b;
  c.y = a.y * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul_V2_S", box2d.b2Mul_V2_S);
box2d.b2Div_V2_S = function (a, b, c) {
  c.x = a.x / b;
  c.y = a.y / b;
  return c;
};
goog.exportSymbol("box2d.b2Div_V2_S", box2d.b2Div_V2_S);
box2d.b2AddMul_V2_S_V2 = function (a, b, c, d) {
  d.x = a.x + b * c.x;
  d.y = a.y + b * c.y;
  return d;
};
goog.exportSymbol("box2d.b2AddMul_V2_S_V2", box2d.b2AddMul_V2_S_V2);
box2d.b2SubMul_V2_S_V2 = function (a, b, c, d) {
  d.x = a.x - b * c.x;
  d.y = a.y - b * c.y;
  return d;
};
goog.exportSymbol("box2d.b2SubMul_V2_S_V2", box2d.b2SubMul_V2_S_V2);
box2d.b2AddCross_V2_S_V2 = function (a, b, c, d) {
  var e = c.x;
  d.x = a.x - b * c.y;
  d.y = a.y + b * e;
  return d;
};
goog.exportSymbol("box2d.b2AddCross_V2_S_V2", box2d.b2AddCross_V2_S_V2);
box2d.b2Mid_V2_V2 = function (a, b, c) {
  c.x = 0.5 * (a.x + b.x);
  c.y = 0.5 * (a.y + b.y);
  return c;
};
goog.exportSymbol("box2d.b2Mid_V2_V2", box2d.b2Mid_V2_V2);
box2d.b2Ext_V2_V2 = function (a, b, c) {
  c.x = 0.5 * (b.x - a.x);
  c.y = 0.5 * (b.y - a.y);
  return c;
};
goog.exportSymbol("box2d.b2Ext_V2_V2", box2d.b2Ext_V2_V2);
box2d.b2Distance = function (a, b) {
  var c = a.x - b.x,
    d = a.y - b.y;
  return Math.sqrt(c * c + d * d);
};
goog.exportSymbol("box2d.b2Distance", box2d.b2Distance);
box2d.b2DistanceSquared = function (a, b) {
  var c = a.x - b.x,
    d = a.y - b.y;
  return c * c + d * d;
};
goog.exportSymbol("box2d.b2DistanceSquared", box2d.b2DistanceSquared);
box2d.b2Vec3 = function (a, b, c) {
  this.x = a || 0;
  this.y = b || 0;
  this.z = c || 0;
};
goog.exportSymbol("box2d.b2Vec3", box2d.b2Vec3);
box2d.b2Vec3.prototype.x = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "x", box2d.b2Vec3.prototype.x);
box2d.b2Vec3.prototype.y = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "y", box2d.b2Vec3.prototype.y);
box2d.b2Vec3.prototype.z = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "z", box2d.b2Vec3.prototype.z);
box2d.b2Vec3.ZERO = new box2d.b2Vec3();
goog.exportProperty(box2d.b2Vec3, "ZERO", box2d.b2Vec3.ZERO);
box2d.b2Vec3.s_t0 = new box2d.b2Vec3();
goog.exportProperty(box2d.b2Vec3, "s_t0", box2d.b2Vec3.s_t0);
box2d.b2Vec3.prototype.Clone = function () {
  return new box2d.b2Vec3(this.x, this.y, this.z);
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "Clone",
  box2d.b2Vec3.prototype.Clone
);
box2d.b2Vec3.prototype.SetZero = function () {
  this.z = this.y = this.x = 0;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SetZero",
  box2d.b2Vec3.prototype.SetZero
);
box2d.b2Vec3.prototype.Set = function (a, b, c) {
  this.x = a;
  this.y = b;
  this.z = c;
  return this;
};
goog.exportProperty(box2d.b2Vec3.prototype, "Set", box2d.b2Vec3.prototype.Set);
box2d.b2Vec3.prototype.Copy = function (a) {
  this.x = a.x;
  this.y = a.y;
  this.z = a.z;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "Copy",
  box2d.b2Vec3.prototype.Copy
);
box2d.b2Vec3.prototype.SelfNeg = function () {
  this.x = -this.x;
  this.y = -this.y;
  this.z = -this.z;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfNeg",
  box2d.b2Vec3.prototype.SelfNeg
);
box2d.b2Vec3.prototype.SelfAdd = function (a) {
  this.x += a.x;
  this.y += a.y;
  this.z += a.z;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfAdd",
  box2d.b2Vec3.prototype.SelfAdd
);
box2d.b2Vec3.prototype.SelfAddV2 = function (a, b) {
  this.x += a.x;
  this.y += a.y;
  this.z += b;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfAddV2",
  box2d.b2Vec3.prototype.SelfAddV2
);
box2d.b2Vec3.prototype.SelfAddXYZ = function (a, b, c) {
  this.x += a;
  this.y += b;
  this.z += c;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfAddXYZ",
  box2d.b2Vec3.prototype.SelfAddXYZ
);
box2d.b2Vec3.prototype.SelfSub = function (a) {
  this.x -= a.x;
  this.y -= a.y;
  this.z -= a.z;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfSub",
  box2d.b2Vec3.prototype.SelfSub
);
box2d.b2Vec3.prototype.SelfSubV2 = function (a, b) {
  this.x -= a.x;
  this.y -= a.y;
  this.z -= b;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfSubV2",
  box2d.b2Vec3.prototype.SelfSubV2
);
box2d.b2Vec3.prototype.SelfSubXYZ = function (a, b, c) {
  this.x -= a;
  this.y -= b;
  this.z -= c;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfSubXYZ",
  box2d.b2Vec3.prototype.SelfSubXYZ
);
box2d.b2Vec3.prototype.SelfMul = function (a) {
  this.x *= a.x;
  this.y *= a.y;
  this.z *= a.z;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfMul",
  box2d.b2Vec3.prototype.SelfMul
);
box2d.b2Vec3.prototype.SelfMulV2 = function (a, b) {
  this.x *= a.x;
  this.y *= a.y;
  this.z *= b;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfMulV2",
  box2d.b2Vec3.prototype.SelfMulV2
);
box2d.b2Vec3.prototype.SelfMulXYZ = function (a, b, c) {
  this.x *= a;
  this.y *= b;
  this.z *= c;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfMulXYZ",
  box2d.b2Vec3.prototype.SelfMulXYZ
);
box2d.b2Vec3.prototype.SelfMulScalar = function (a) {
  this.x *= a;
  this.y *= a;
  this.z *= a;
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfMulScalar",
  box2d.b2Vec3.prototype.SelfMulScalar
);
box2d.b2Vec3.prototype.Length = function () {
  var a = this.x,
    b = this.y,
    c = this.z;
  return Math.sqrt(a * a + b * b + c * c);
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "Length",
  box2d.b2Vec3.prototype.Length
);
box2d.b2Vec3.prototype.LengthSquared = function () {
  var a = this.x,
    b = this.y,
    c = this.z;
  return a * a + b * b + c * c;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "LengthSquared",
  box2d.b2Vec3.prototype.LengthSquared
);
box2d.b2Vec3.prototype.Normalize = function () {
  var a = this.Length();
  if (a >= box2d.b2_epsilon) {
    var b = 1 / a;
    this.x *= b;
    this.y *= b;
    this.z *= b;
  }
  return a;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "Normalize",
  box2d.b2Vec3.prototype.Normalize
);
box2d.b2Vec3.prototype.SelfNormalize = function () {
  this.Normalize();
  return this;
};
goog.exportProperty(
  box2d.b2Vec3.prototype,
  "SelfNormalize",
  box2d.b2Vec3.prototype.SelfNormalize
);
box2d.b2Add_V3_V3 = function (a, b, c) {
  c.x = a.x + b.x;
  c.y = a.y + b.y;
  c.z = a.z + b.z;
  return c;
};
goog.exportSymbol("box2d.b2Add_V3_V3", box2d.b2Add_V3_V3);
box2d.b2Sub_V3_V3 = function (a, b, c) {
  c.x = a.x + b.x;
  c.y = a.y + b.y;
  c.z = a.z + b.z;
  return c;
};
goog.exportSymbol("box2d.b2Sub_V3_V3", box2d.b2Sub_V3_V3);
box2d.b2Dot_V3_V3 = function (a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};
goog.exportSymbol("box2d.b2Dot_V3_V3", box2d.b2Dot_V3_V3);
box2d.b2Cross_V3_V3 = function (a, b, c) {
  var d = a.x,
    e = a.y;
  a = a.z;
  var f = b.x,
    g = b.y;
  b = b.z;
  c.x = e * b - a * g;
  c.y = a * f - d * b;
  c.z = d * g - e * f;
  return c;
};
goog.exportSymbol("box2d.b2Cross_V3_V3", box2d.b2Cross_V3_V3);
box2d.b2Vec4 = function (a, b, c, d) {
  this.x = a || 0;
  this.y = b || 0;
  this.z = c || 0;
  this.w = d || 0;
};
goog.exportSymbol("box2d.b2Vec4", box2d.b2Vec4);
box2d.b2Vec4.prototype.x = 0;
goog.exportProperty(box2d.b2Vec4.prototype, "x", box2d.b2Vec4.prototype.x);
box2d.b2Vec4.prototype.y = 0;
goog.exportProperty(box2d.b2Vec4.prototype, "y", box2d.b2Vec4.prototype.y);
box2d.b2Vec4.prototype.z = 0;
goog.exportProperty(box2d.b2Vec4.prototype, "z", box2d.b2Vec4.prototype.z);
box2d.b2Vec4.prototype.w = 0;
goog.exportProperty(box2d.b2Vec4.prototype, "w", box2d.b2Vec4.prototype.w);
box2d.b2Vec4.ZERO = new box2d.b2Vec4(0, 0, 0, 0);
goog.exportProperty(box2d.b2Vec4, "ZERO", box2d.b2Vec4.ZERO);
box2d.b2Vec4.s_t0 = new box2d.b2Vec4();
goog.exportProperty(box2d.b2Vec4, "s_t0", box2d.b2Vec4.s_t0);
box2d.b2Vec4.prototype.Clone = function () {
  return new box2d.b2Vec4(this.x, this.y, this.z, this.w);
};
goog.exportProperty(
  box2d.b2Vec4.prototype,
  "Clone",
  box2d.b2Vec4.prototype.Clone
);
box2d.b2Vec4.prototype.SetZero = function () {
  this.w = this.z = this.y = this.x = 0;
  return this;
};
goog.exportProperty(
  box2d.b2Vec4.prototype,
  "SetZero",
  box2d.b2Vec4.prototype.SetZero
);
box2d.b2Vec4.prototype.Set = function (a, b, c, d) {
  this.x = a;
  this.y = b;
  this.z = c;
  this.w = d;
  return this;
};
goog.exportProperty(box2d.b2Vec4.prototype, "Set", box2d.b2Vec4.prototype.Set);
box2d.b2Vec4.prototype.Copy = function (a) {
  this.x = a.x;
  this.y = a.y;
  this.z = a.z;
  this.w = a.w;
  return this;
};
goog.exportProperty(
  box2d.b2Vec4.prototype,
  "Copy",
  box2d.b2Vec4.prototype.Copy
);
box2d.b2Mat22 = function () {
  this.ex = new box2d.b2Vec2(1, 0);
  this.ey = new box2d.b2Vec2(0, 1);
};
goog.exportSymbol("box2d.b2Mat22", box2d.b2Mat22);
box2d.b2Mat22.prototype.ex = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ex", box2d.b2Mat22.prototype.ex);
box2d.b2Mat22.prototype.ey = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ey", box2d.b2Mat22.prototype.ey);
box2d.b2Mat22.IDENTITY = new box2d.b2Mat22();
goog.exportProperty(box2d.b2Mat22, "IDENTITY", box2d.b2Mat22.IDENTITY);
box2d.b2Mat22.prototype.Clone = function () {
  return new box2d.b2Mat22().Copy(this);
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "Clone",
  box2d.b2Mat22.prototype.Clone
);
box2d.b2Mat22.prototype.SetAngle = function (a) {
  var b = Math.cos(a);
  a = Math.sin(a);
  this.ex.Set(b, a);
  this.ey.Set(-a, b);
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SetAngle",
  box2d.b2Mat22.prototype.SetAngle
);
box2d.b2Mat22.prototype.Copy = function (a) {
  this.ex.Copy(a.ex);
  this.ey.Copy(a.ey);
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "Copy",
  box2d.b2Mat22.prototype.Copy
);
box2d.b2Mat22.prototype.SetIdentity = function () {
  this.ex.Set(1, 0);
  this.ey.Set(0, 1);
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SetIdentity",
  box2d.b2Mat22.prototype.SetIdentity
);
box2d.b2Mat22.prototype.SetZero = function () {
  this.ex.SetZero();
  this.ey.SetZero();
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SetZero",
  box2d.b2Mat22.prototype.SetZero
);
box2d.b2Mat22.prototype.GetAngle = function () {
  return Math.atan2(this.ex.y, this.ex.x);
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "GetAngle",
  box2d.b2Mat22.prototype.GetAngle
);
box2d.b2Mat22.prototype.GetInverse = function (a) {
  var b = this.ex.x,
    c = this.ey.x,
    d = this.ex.y,
    e = this.ey.y,
    f = b * e - c * d;
  0 !== f && (f = 1 / f);
  a.ex.x = f * e;
  a.ey.x = -f * c;
  a.ex.y = -f * d;
  a.ey.y = f * b;
  return a;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "GetInverse",
  box2d.b2Mat22.prototype.GetInverse
);
box2d.b2Mat22.prototype.Solve = function (a, b, c) {
  var d = this.ex.x,
    e = this.ey.x,
    f = this.ex.y,
    g = this.ey.y,
    h = d * g - e * f;
  0 !== h && (h = 1 / h);
  c.x = h * (g * a - e * b);
  c.y = h * (d * b - f * a);
  return c;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "Solve",
  box2d.b2Mat22.prototype.Solve
);
box2d.b2Mat22.prototype.SelfAbs = function () {
  this.ex.SelfAbs();
  this.ey.SelfAbs();
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SelfAbs",
  box2d.b2Mat22.prototype.SelfAbs
);
box2d.b2Mat22.prototype.SelfInv = function () {
  return this.GetInverse(this);
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SelfInv",
  box2d.b2Mat22.prototype.SelfInv
);
box2d.b2Mat22.prototype.SelfAdd = function (a) {
  this.ex.SelfAdd(a.ex);
  this.ey.SelfAdd(a.ey);
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SelfAdd",
  box2d.b2Mat22.prototype.SelfAdd
);
box2d.b2Mat22.prototype.SelfSub = function (a) {
  this.ex.SelfSub(a.ex);
  this.ey.SelfSub(a.ey);
  return this;
};
goog.exportProperty(
  box2d.b2Mat22.prototype,
  "SelfSub",
  box2d.b2Mat22.prototype.SelfSub
);
box2d.b2Abs_M22 = function (a, b) {
  var c = a.ex,
    d = a.ey;
  b.ex.x = box2d.b2Abs(c.x);
  b.ex.y = box2d.b2Abs(c.y);
  b.ey.x = box2d.b2Abs(d.x);
  b.ey.y = box2d.b2Abs(d.y);
  return b;
};
goog.exportSymbol("box2d.b2Abs_M22", box2d.b2Abs_M22);
box2d.b2Mul_M22_V2 = function (a, b, c) {
  var d = a.ex;
  a = a.ey;
  var e = b.x;
  b = b.y;
  c.x = d.x * e + a.x * b;
  c.y = d.y * e + a.y * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul_M22_V2", box2d.b2Mul_M22_V2);
box2d.b2MulT_M22_V2 = function (a, b, c) {
  var d = a.ex;
  a = a.ey;
  var e = b.x;
  b = b.y;
  c.x = d.x * e + d.y * b;
  c.y = a.x * e + a.y * b;
  return c;
};
goog.exportSymbol("box2d.b2MulT_M22_V2", box2d.b2MulT_M22_V2);
box2d.b2Add_M22_M22 = function (a, b, c) {
  var d = a.ex;
  a = a.ey;
  var e = b.ex;
  b = b.ey;
  c.ex.x = d.x + e.x;
  c.ex.y = d.y + e.y;
  c.ey.x = a.x + b.x;
  c.ey.y = a.y + b.y;
  return c;
};
goog.exportSymbol("box2d.b2Add_M22_M22", box2d.b2Add_M22_M22);
box2d.b2Mul_M22_M22 = function (a, b, c) {
  var d = a.ex.x,
    e = a.ex.y,
    f = a.ey.x;
  a = a.ey.y;
  var g = b.ex.x,
    h = b.ex.y,
    k = b.ey.x;
  b = b.ey.y;
  c.ex.x = d * g + f * h;
  c.ex.y = e * g + a * h;
  c.ey.x = d * k + f * b;
  c.ey.y = e * k + a * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul_M22_M22", box2d.b2Mul_M22_M22);
box2d.b2MulT_M22_M22 = function (a, b, c) {
  var d = a.ex.x,
    e = a.ex.y,
    f = a.ey.x;
  a = a.ey.y;
  var g = b.ex.x,
    h = b.ex.y,
    k = b.ey.x;
  b = b.ey.y;
  c.ex.x = d * g + e * h;
  c.ex.y = f * g + a * h;
  c.ey.x = d * k + e * b;
  c.ey.y = f * k + a * b;
  return c;
};
goog.exportSymbol("box2d.b2MulT_M22_M22", box2d.b2MulT_M22_M22);
box2d.b2Mat33 = function () {
  this.ex = new box2d.b2Vec3(1, 0, 0);
  this.ey = new box2d.b2Vec3(0, 1, 0);
  this.ez = new box2d.b2Vec3(0, 0, 1);
};
goog.exportSymbol("box2d.b2Mat33", box2d.b2Mat33);
box2d.b2Mat33.prototype.ex = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ex", box2d.b2Mat33.prototype.ex);
box2d.b2Mat33.prototype.ey = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ey", box2d.b2Mat33.prototype.ey);
box2d.b2Mat33.prototype.ez = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ez", box2d.b2Mat33.prototype.ez);
box2d.b2Mat33.IDENTITY = new box2d.b2Mat33();
goog.exportProperty(box2d.b2Mat33, "IDENTITY", box2d.b2Mat33.IDENTITY);
box2d.b2Mat33.prototype.Clone = function () {
  return new box2d.b2Mat33().Copy(this);
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "Clone",
  box2d.b2Mat33.prototype.Clone
);
box2d.b2Mat33.prototype.Copy = function (a) {
  this.ex.Copy(a.ex);
  this.ey.Copy(a.ey);
  this.ez.Copy(a.ez);
  return this;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "Copy",
  box2d.b2Mat33.prototype.Copy
);
box2d.b2Mat33.prototype.SetIdentity = function () {
  this.ex.Set(1, 0, 0);
  this.ey.Set(0, 1, 0);
  this.ez.Set(0, 0, 1);
  return this;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "SetIdentity",
  box2d.b2Mat33.prototype.SetIdentity
);
box2d.b2Mat33.prototype.SetZero = function () {
  this.ex.SetZero();
  this.ey.SetZero();
  this.ez.SetZero();
  return this;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "SetZero",
  box2d.b2Mat33.prototype.SetZero
);
box2d.b2Mat33.prototype.SelfAdd = function (a) {
  this.ex.SelfAdd(a.ex);
  this.ey.SelfAdd(a.ey);
  this.ez.SelfAdd(a.ez);
  return this;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "SelfAdd",
  box2d.b2Mat33.prototype.SelfAdd
);
box2d.b2Mat33.prototype.Solve33 = function (a, b, c, d) {
  var e = this.ex.x,
    f = this.ex.y,
    g = this.ex.z,
    h = this.ey.x,
    k = this.ey.y,
    l = this.ey.z,
    m = this.ez.x,
    n = this.ez.y,
    p = this.ez.z,
    q = e * (k * p - l * n) + f * (l * m - h * p) + g * (h * n - k * m);
  0 !== q && (q = 1 / q);
  d.x = q * (a * (k * p - l * n) + b * (l * m - h * p) + c * (h * n - k * m));
  d.y = q * (e * (b * p - c * n) + f * (c * m - a * p) + g * (a * n - b * m));
  d.z = q * (e * (k * c - l * b) + f * (l * a - h * c) + g * (h * b - k * a));
  return d;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "Solve33",
  box2d.b2Mat33.prototype.Solve33
);
box2d.b2Mat33.prototype.Solve22 = function (a, b, c) {
  var d = this.ex.x,
    e = this.ey.x,
    f = this.ex.y,
    g = this.ey.y,
    h = d * g - e * f;
  0 !== h && (h = 1 / h);
  c.x = h * (g * a - e * b);
  c.y = h * (d * b - f * a);
  return c;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "Solve22",
  box2d.b2Mat33.prototype.Solve22
);
box2d.b2Mat33.prototype.GetInverse22 = function (a) {
  var b = this.ex.x,
    c = this.ey.x,
    d = this.ex.y,
    e = this.ey.y,
    f = b * e - c * d;
  0 !== f && (f = 1 / f);
  a.ex.x = f * e;
  a.ey.x = -f * c;
  a.ex.z = 0;
  a.ex.y = -f * d;
  a.ey.y = f * b;
  a.ey.z = 0;
  a.ez.x = 0;
  a.ez.y = 0;
  a.ez.z = 0;
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "GetInverse22",
  box2d.b2Mat33.prototype.GetInverse22
);
box2d.b2Mat33.prototype.GetSymInverse33 = function (a) {
  var b = box2d.b2Dot_V3_V3(
    this.ex,
    box2d.b2Cross_V3_V3(this.ey, this.ez, box2d.b2Vec3.s_t0)
  );
  0 !== b && (b = 1 / b);
  var c = this.ex.x,
    d = this.ey.x,
    e = this.ez.x,
    f = this.ey.y,
    g = this.ez.y,
    h = this.ez.z;
  a.ex.x = b * (f * h - g * g);
  a.ex.y = b * (e * g - d * h);
  a.ex.z = b * (d * g - e * f);
  a.ey.x = a.ex.y;
  a.ey.y = b * (c * h - e * e);
  a.ey.z = b * (e * d - c * g);
  a.ez.x = a.ex.z;
  a.ez.y = a.ey.z;
  a.ez.z = b * (c * f - d * d);
};
goog.exportProperty(
  box2d.b2Mat33.prototype,
  "GetSymInverse33",
  box2d.b2Mat33.prototype.GetSymInverse33
);
box2d.b2Mul_M33_V3 = function (a, b, c) {
  var d = b.x,
    e = b.y;
  b = b.z;
  c.x = a.ex.x * d + a.ey.x * e + a.ez.x * b;
  c.y = a.ex.y * d + a.ey.y * e + a.ez.y * b;
  c.z = a.ex.z * d + a.ey.z * e + a.ez.z * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul_M33_V3", box2d.b2Mul_M33_V3);
box2d.b2Mul_M33_X_Y_Z = function (a, b, c, d, e) {
  e.x = a.ex.x * b + a.ey.x * c + a.ez.x * d;
  e.y = a.ex.y * b + a.ey.y * c + a.ez.y * d;
  e.z = a.ex.z * b + a.ey.z * c + a.ez.z * d;
  return e;
};
goog.exportSymbol("box2d.b2Mul_M33_X_Y_Z", box2d.b2Mul_M33_X_Y_Z);
box2d.b2Mul22_M33_V2 = function (a, b, c) {
  var d = b.x;
  b = b.y;
  c.x = a.ex.x * d + a.ey.x * b;
  c.y = a.ex.y * d + a.ey.y * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul22_M33_V2", box2d.b2Mul22_M33_V2);
box2d.b2Mul_M33_X_Y = function (a, b, c, d) {
  d.x = a.ex.x * b + a.ey.x * c;
  d.y = a.ex.y * b + a.ey.y * c;
  return d;
};
goog.exportSymbol("box2d.b2Mul_M33_X_Y", box2d.b2Mul_M33_X_Y);
box2d.b2Rot = function (a) {
  a && ((this.angle = a), (this.s = Math.sin(a)), (this.c = Math.cos(a)));
};
goog.exportSymbol("box2d.b2Rot", box2d.b2Rot);
box2d.b2Rot.prototype.angle = 0;
goog.exportProperty(
  box2d.b2Rot.prototype,
  "angle",
  box2d.b2Rot.prototype.angle
);
box2d.b2Rot.prototype.s = 0;
goog.exportProperty(box2d.b2Rot.prototype, "s", box2d.b2Rot.prototype.s);
box2d.b2Rot.prototype.c = 1;
goog.exportProperty(box2d.b2Rot.prototype, "c", box2d.b2Rot.prototype.c);
box2d.b2Rot.IDENTITY = new box2d.b2Rot();
goog.exportProperty(box2d.b2Rot, "IDENTITY", box2d.b2Rot.IDENTITY);
box2d.b2Rot.prototype.Clone = function () {
  return new box2d.b2Rot().Copy(this);
};
goog.exportProperty(
  box2d.b2Rot.prototype,
  "Clone",
  box2d.b2Rot.prototype.Clone
);
box2d.b2Rot.prototype.Copy = function (a) {
  this.angle = a.angle;
  this.s = a.s;
  this.c = a.c;
  return this;
};
goog.exportProperty(box2d.b2Rot.prototype, "Copy", box2d.b2Rot.prototype.Copy);
box2d.b2Rot.prototype.Set = function (a) {
  Math.abs(this.angle - a) >= box2d.b2_epsilon &&
    ((this.angle = a), (this.s = Math.sin(a)), (this.c = Math.cos(a)));
  return this;
};
goog.exportProperty(box2d.b2Rot.prototype, "Set", box2d.b2Rot.prototype.Set);
box2d.b2Rot.prototype.SetAngle = box2d.b2Rot.prototype.Set;
goog.exportProperty(
  box2d.b2Rot.prototype,
  "SetAngle",
  box2d.b2Rot.prototype.SetAngle
);
box2d.b2Rot.prototype.SetIdentity = function () {
  this.s = this.angle = 0;
  this.c = 1;
  return this;
};
goog.exportProperty(
  box2d.b2Rot.prototype,
  "SetIdentity",
  box2d.b2Rot.prototype.SetIdentity
);
box2d.b2Rot.prototype.GetAngle = function () {
  return this.angle;
};
goog.exportProperty(
  box2d.b2Rot.prototype,
  "GetAngle",
  box2d.b2Rot.prototype.GetAngle
);
box2d.b2Rot.prototype.GetXAxis = function (a) {
  a.x = this.c;
  a.y = this.s;
  return a;
};
goog.exportProperty(
  box2d.b2Rot.prototype,
  "GetXAxis",
  box2d.b2Rot.prototype.GetXAxis
);
box2d.b2Rot.prototype.GetYAxis = function (a) {
  a.x = -this.s;
  a.y = this.c;
  return a;
};
goog.exportProperty(
  box2d.b2Rot.prototype,
  "GetYAxis",
  box2d.b2Rot.prototype.GetYAxis
);
box2d.b2Mul_R_R = function (a, b, c) {
  var d = a.c,
    e = a.s,
    f = b.c,
    g = b.s;
  c.s = e * f + d * g;
  c.c = d * f - e * g;
  c.angle = box2d.b2WrapAngle(a.angle + b.angle);
  return c;
};
goog.exportSymbol("box2d.b2Mul_R_R", box2d.b2Mul_R_R);
box2d.b2MulT_R_R = function (a, b, c) {
  var d = a.c,
    e = a.s,
    f = b.c,
    g = b.s;
  c.s = d * g - e * f;
  c.c = d * f + e * g;
  c.angle = box2d.b2WrapAngle(a.angle - b.angle);
  return c;
};
goog.exportSymbol("box2d.b2MulT_R_R", box2d.b2MulT_R_R);
box2d.b2Mul_R_V2 = function (a, b, c) {
  var d = a.c;
  a = a.s;
  var e = b.x;
  b = b.y;
  c.x = d * e - a * b;
  c.y = a * e + d * b;
  return c;
};
goog.exportSymbol("box2d.b2Mul_R_V2", box2d.b2Mul_R_V2);
box2d.b2MulT_R_V2 = function (a, b, c) {
  var d = a.c;
  a = a.s;
  var e = b.x;
  b = b.y;
  c.x = d * e + a * b;
  c.y = -a * e + d * b;
  return c;
};
goog.exportSymbol("box2d.b2MulT_R_V2", box2d.b2MulT_R_V2);
box2d.b2Transform = function () {
  this.p = new box2d.b2Vec2();
  this.q = new box2d.b2Rot();
};
goog.exportSymbol("box2d.b2Transform", box2d.b2Transform);
box2d.b2Transform.prototype.p = null;
goog.exportProperty(
  box2d.b2Transform.prototype,
  "p",
  box2d.b2Transform.prototype.p
);
box2d.b2Transform.prototype.q = null;
goog.exportProperty(
  box2d.b2Transform.prototype,
  "q",
  box2d.b2Transform.prototype.q
);
box2d.b2Transform.IDENTITY = new box2d.b2Transform();
goog.exportProperty(box2d.b2Transform, "IDENTITY", box2d.b2Transform.IDENTITY);
box2d.b2Transform.prototype.Clone = function () {
  return new box2d.b2Transform().Copy(this);
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "Clone",
  box2d.b2Transform.prototype.Clone
);
box2d.b2Transform.prototype.Copy = function (a) {
  this.p.Copy(a.p);
  this.q.Copy(a.q);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "Copy",
  box2d.b2Transform.prototype.Copy
);
box2d.b2Transform.prototype.SetIdentity = function () {
  this.p.SetZero();
  this.q.SetIdentity();
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetIdentity",
  box2d.b2Transform.prototype.SetIdentity
);
box2d.b2Transform.prototype.Set = function (a, b) {
  return this.SetPositionRotationAngle(a, b);
};
box2d.b2Transform.prototype.SetPositionRotation = function (a, b) {
  this.p.Copy(a);
  this.q.Copy(b);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetPositionRotation",
  box2d.b2Transform.prototype.SetPositionRotation
);
box2d.b2Transform.prototype.SetPositionRotationAngle = function (a, b) {
  this.p.Copy(a);
  this.q.SetAngle(b);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetPositionRotationAngle",
  box2d.b2Transform.prototype.SetPositionRotationAngle
);
box2d.b2Transform.prototype.SetPosition = function (a) {
  this.p.Copy(a);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetPosition",
  box2d.b2Transform.prototype.SetPosition
);
box2d.b2Transform.prototype.SetPositionXY = function (a, b) {
  this.p.Set(a, b);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetPositionXY",
  box2d.b2Transform.prototype.SetPositionXY
);
box2d.b2Transform.prototype.SetRotation = function (a) {
  this.q.Copy(a);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetRotation",
  box2d.b2Transform.prototype.SetRotation
);
box2d.b2Transform.prototype.SetRotationAngle = function (a) {
  this.q.SetAngle(a);
  return this;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "SetRotationAngle",
  box2d.b2Transform.prototype.SetRotationAngle
);
box2d.b2Transform.prototype.GetPosition = function () {
  return this.p;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "GetPosition",
  box2d.b2Transform.prototype.GetPosition
);
box2d.b2Transform.prototype.GetRotation = function () {
  return this.q;
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "GetRotation",
  box2d.b2Transform.prototype.GetRotation
);
box2d.b2Transform.prototype.GetRotationAngle = function () {
  return this.q.GetAngle();
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "GetRotationAngle",
  box2d.b2Transform.prototype.GetRotationAngle
);
box2d.b2Transform.prototype.GetAngle = function () {
  return this.q.GetAngle();
};
goog.exportProperty(
  box2d.b2Transform.prototype,
  "GetAngle",
  box2d.b2Transform.prototype.GetAngle
);
box2d.b2Mul_X_V2 = function (a, b, c) {
  var d = a.q.c,
    e = a.q.s,
    f = b.x;
  b = b.y;
  c.x = d * f - e * b + a.p.x;
  c.y = e * f + d * b + a.p.y;
  return c;
};
goog.exportSymbol("box2d.b2Mul_X_V2", box2d.b2Mul_X_V2);
box2d.b2MulT_X_V2 = function (a, b, c) {
  var d = a.q.c,
    e = a.q.s,
    f = b.x - a.p.x;
  a = b.y - a.p.y;
  c.x = d * f + e * a;
  c.y = -e * f + d * a;
  return c;
};
goog.exportSymbol("box2d.b2MulT_X_V2", box2d.b2MulT_X_V2);
box2d.b2Mul_X_X = function (a, b, c) {
  box2d.b2Mul_R_R(a.q, b.q, c.q);
  box2d.b2Add_V2_V2(box2d.b2Mul_R_V2(a.q, b.p, c.p), a.p, c.p);
  return c;
};
goog.exportSymbol("box2d.b2Mul_X_X", box2d.b2Mul_X_X);
box2d.b2MulT_X_X = function (a, b, c) {
  box2d.b2MulT_R_R(a.q, b.q, c.q);
  box2d.b2MulT_R_V2(a.q, box2d.b2Sub_V2_V2(b.p, a.p, c.p), c.p);
  return c;
};
goog.exportSymbol("box2d.b2MulT_X_X", box2d.b2MulT_X_X);
box2d.b2Sweep = function () {
  this.localCenter = new box2d.b2Vec2();
  this.c0 = new box2d.b2Vec2();
  this.c = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2Sweep", box2d.b2Sweep);
box2d.b2Sweep.prototype.localCenter = null;
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "localCenter",
  box2d.b2Sweep.prototype.localCenter
);
box2d.b2Sweep.prototype.c0 = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c0", box2d.b2Sweep.prototype.c0);
box2d.b2Sweep.prototype.c = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c", box2d.b2Sweep.prototype.c);
box2d.b2Sweep.prototype.a0 = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a0", box2d.b2Sweep.prototype.a0);
box2d.b2Sweep.prototype.a = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a", box2d.b2Sweep.prototype.a);
box2d.b2Sweep.prototype.alpha0 = 0;
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "alpha0",
  box2d.b2Sweep.prototype.alpha0
);
box2d.b2Sweep.prototype.Clone = function () {
  return new box2d.b2Sweep().Copy(this);
};
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "Clone",
  box2d.b2Sweep.prototype.Clone
);
box2d.b2Sweep.prototype.Copy = function (a) {
  this.localCenter.Copy(a.localCenter);
  this.c0.Copy(a.c0);
  this.c.Copy(a.c);
  this.a0 = a.a0;
  this.a = a.a;
  this.alpha0 = a.alpha0;
  return this;
};
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "Copy",
  box2d.b2Sweep.prototype.Copy
);
box2d.b2Sweep.prototype.GetTransform = function (a, b) {
  var c = 1 - b;
  a.p.x = c * this.c0.x + b * this.c.x;
  a.p.y = c * this.c0.y + b * this.c.y;
  a.q.SetAngle(c * this.a0 + b * this.a);
  a.p.SelfSub(box2d.b2Mul_R_V2(a.q, this.localCenter, box2d.b2Vec2.s_t0));
  return a;
};
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "GetTransform",
  box2d.b2Sweep.prototype.GetTransform
);
box2d.b2Sweep.prototype.Advance = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > this.alpha0);
  var b = (a - this.alpha0) / (1 - this.alpha0);
  this.c0.x += b * (this.c.x - this.c0.x);
  this.c0.y += b * (this.c.y - this.c0.y);
  this.a0 += b * (this.a - this.a0);
  this.alpha0 = a;
};
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "Advance",
  box2d.b2Sweep.prototype.Advance
);
box2d.b2Sweep.prototype.Normalize = function () {
  this.a0 = box2d.b2WrapAngle(this.a0);
  this.a = box2d.b2WrapAngle(this.a);
};
goog.exportProperty(
  box2d.b2Sweep.prototype,
  "Normalize",
  box2d.b2Sweep.prototype.Normalize
);
box2d.b2Dot = function (a, b) {
  if (a instanceof box2d.b2Vec2 && b instanceof box2d.b2Vec2)
    return box2d.b2Dot_V2_V2(a, b);
  if (a instanceof box2d.b2Vec3 && b instanceof box2d.b2Vec3)
    return box2d.b2Dot_V3_V3(a, b);
  throw Error();
};
goog.exportSymbol("box2d.b2Dot", box2d.b2Dot);
box2d.b2Cross = function (a, b, c) {
  if (a instanceof box2d.b2Vec2 && b instanceof box2d.b2Vec2)
    return box2d.b2Cross_V2_V2(a, b);
  if (
    a instanceof box2d.b2Vec2 &&
    "number" === typeof b &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Cross_V2_S(a, b, c);
  if (
    "number" === typeof a &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Cross_S_V2(a, b, c);
  if (
    a instanceof box2d.b2Vec3 &&
    b instanceof box2d.b2Vec3 &&
    c instanceof box2d.b2Vec3
  )
    return box2d.b2Cross_V3_V3(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2Cross", box2d.b2Cross);
box2d.b2Add = function (a, b, c) {
  if (
    a instanceof box2d.b2Vec2 &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Add_V2_V2(a, b, c);
  if (
    a instanceof box2d.b2Vec3 &&
    b instanceof box2d.b2Vec3 &&
    c instanceof box2d.b2Vec3
  )
    return box2d.b2Add_V3_V3(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2Add", box2d.b2Add);
box2d.b2Sub = function (a, b, c) {
  if (
    a instanceof box2d.b2Vec2 &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Sub_V2_V2(a, b, c);
  if (
    a instanceof box2d.b2Vec3 &&
    b instanceof box2d.b2Vec3 &&
    c instanceof box2d.b2Vec3
  )
    return box2d.b2Sub_V3_V3(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2Sub", box2d.b2Sub);
box2d.b2Mul = function (a, b, c) {
  if (
    a instanceof box2d.b2Mat22 &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Mul_M22_V2(a, b, c);
  if (
    a instanceof box2d.b2Mat22 &&
    b instanceof box2d.b2Mat22 &&
    c instanceof box2d.b2Mat22
  )
    return box2d.b2Mul_M22_M22(a, b, c);
  if (
    a instanceof box2d.b2Mat33 &&
    b instanceof box2d.b2Vec3 &&
    c instanceof box2d.b2Vec3
  )
    return box2d.b2Mul_M33_V3(a, b, c);
  if (
    a instanceof box2d.b2Rot &&
    b instanceof box2d.b2Rot &&
    c instanceof box2d.b2Rot
  )
    return box2d.b2Mul_R_R(a, b, c);
  if (
    a instanceof box2d.b2Rot &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Mul_R_V2(a, b, c);
  if (
    a instanceof box2d.b2Transform &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2Mul_X_V2(a, b, c);
  if (
    a instanceof box2d.b2Transform &&
    b instanceof box2d.b2Transform &&
    c instanceof box2d.b2Transform
  )
    return box2d.b2Mul_X_X(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2Mul", box2d.b2Mul);
box2d.b2Mul22 = function (a, b, c) {
  if (a instanceof box2d.b2Mat33 && b instanceof box2d.b2Vec2)
    return box2d.b2Mul22_M33_V2(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2Mul22", box2d.b2Mul22);
box2d.b2MulT = function (a, b, c) {
  if (
    a instanceof box2d.b2Mat22 &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2MulT_M22_V2(a, b, c);
  if (
    a instanceof box2d.b2Mat22 &&
    b instanceof box2d.b2Mat22 &&
    c instanceof box2d.b2Mat22
  )
    return box2d.b2MulT_M22_M22(a, b, c);
  if (
    a instanceof box2d.b2Rot &&
    b instanceof box2d.b2Rot &&
    c instanceof box2d.b2Rot
  )
    return box2d.b2MulT_R_R(a, b, c);
  if (
    a instanceof box2d.b2Rot &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2MulT_R_V2(a, b, c);
  if (
    a instanceof box2d.b2Transform &&
    b instanceof box2d.b2Vec2 &&
    c instanceof box2d.b2Vec2
  )
    return box2d.b2MulT_X_V2(a, b, c);
  if (
    a instanceof box2d.b2Transform &&
    b instanceof box2d.b2Transform &&
    c instanceof box2d.b2Transform
  )
    return box2d.b2MulT_X_X(a, b, c);
  throw Error();
};
goog.exportSymbol("box2d.b2MulT", box2d.b2MulT);
box2d.b2DistanceProxy = function () {
  this.m_buffer = box2d.b2Vec2.MakeArray(2);
};
goog.exportSymbol("box2d.b2DistanceProxy", box2d.b2DistanceProxy);
box2d.b2DistanceProxy.prototype.m_buffer = null;
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "m_buffer",
  box2d.b2DistanceProxy.prototype.m_buffer
);
box2d.b2DistanceProxy.prototype.m_vertices = null;
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "m_vertices",
  box2d.b2DistanceProxy.prototype.m_vertices
);
box2d.b2DistanceProxy.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "m_count",
  box2d.b2DistanceProxy.prototype.m_count
);
box2d.b2DistanceProxy.prototype.m_radius = 0;
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "m_radius",
  box2d.b2DistanceProxy.prototype.m_radius
);
box2d.b2DistanceProxy.prototype.Reset = function () {
  this.m_vertices = null;
  this.m_radius = this.m_count = 0;
  return this;
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "Reset",
  box2d.b2DistanceProxy.prototype.Reset
);
box2d.b2DistanceProxy.prototype.SetShape = function (a, b) {
  a.SetupDistanceProxy(this, b);
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "SetShape",
  box2d.b2DistanceProxy.prototype.SetShape
);
box2d.b2DistanceProxy.prototype.GetSupport = function (a) {
  for (
    var b = 0, c = box2d.b2Dot_V2_V2(this.m_vertices[0], a), d = 1;
    d < this.m_count;
    ++d
  ) {
    var e = box2d.b2Dot_V2_V2(this.m_vertices[d], a);
    e > c && ((b = d), (c = e));
  }
  return b;
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "GetSupport",
  box2d.b2DistanceProxy.prototype.GetSupport
);
box2d.b2DistanceProxy.prototype.GetSupportVertex = function (a, b) {
  for (
    var c = 0, d = box2d.b2Dot_V2_V2(this.m_vertices[0], a), e = 1;
    e < this.m_count;
    ++e
  ) {
    var f = box2d.b2Dot_V2_V2(this.m_vertices[e], a);
    f > d && ((c = e), (d = f));
  }
  return b.Copy(this.m_vertices[c]);
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "GetSupportVertex",
  box2d.b2DistanceProxy.prototype.GetSupportVertex
);
box2d.b2DistanceProxy.prototype.GetVertexCount = function () {
  return this.m_count;
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "GetVertexCount",
  box2d.b2DistanceProxy.prototype.GetVertexCount
);
box2d.b2DistanceProxy.prototype.GetVertex = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_count);
  return this.m_vertices[a];
};
goog.exportProperty(
  box2d.b2DistanceProxy.prototype,
  "GetVertex",
  box2d.b2DistanceProxy.prototype.GetVertex
);
box2d.b2SimplexCache = function () {
  this.indexA = box2d.b2MakeNumberArray(3);
  this.indexB = box2d.b2MakeNumberArray(3);
};
goog.exportSymbol("box2d.b2SimplexCache", box2d.b2SimplexCache);
box2d.b2SimplexCache.prototype.metric = 0;
goog.exportProperty(
  box2d.b2SimplexCache.prototype,
  "metric",
  box2d.b2SimplexCache.prototype.metric
);
box2d.b2SimplexCache.prototype.count = 0;
goog.exportProperty(
  box2d.b2SimplexCache.prototype,
  "count",
  box2d.b2SimplexCache.prototype.count
);
box2d.b2SimplexCache.prototype.indexA = null;
goog.exportProperty(
  box2d.b2SimplexCache.prototype,
  "indexA",
  box2d.b2SimplexCache.prototype.indexA
);
box2d.b2SimplexCache.prototype.indexB = null;
goog.exportProperty(
  box2d.b2SimplexCache.prototype,
  "indexB",
  box2d.b2SimplexCache.prototype.indexB
);
box2d.b2SimplexCache.prototype.Reset = function () {
  this.count = this.metric = 0;
  return this;
};
goog.exportProperty(
  box2d.b2SimplexCache.prototype,
  "Reset",
  box2d.b2SimplexCache.prototype.Reset
);
box2d.b2DistanceInput = function () {
  this.proxyA = new box2d.b2DistanceProxy();
  this.proxyB = new box2d.b2DistanceProxy();
  this.transformA = new box2d.b2Transform();
  this.transformB = new box2d.b2Transform();
};
goog.exportSymbol("box2d.b2DistanceInput", box2d.b2DistanceInput);
box2d.b2DistanceInput.prototype.proxyA = null;
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "proxyA",
  box2d.b2DistanceInput.prototype.proxyA
);
box2d.b2DistanceInput.prototype.proxyB = null;
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "proxyB",
  box2d.b2DistanceInput.prototype.proxyB
);
box2d.b2DistanceInput.prototype.transformA = null;
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "transformA",
  box2d.b2DistanceInput.prototype.transformA
);
box2d.b2DistanceInput.prototype.transformB = null;
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "transformB",
  box2d.b2DistanceInput.prototype.transformB
);
box2d.b2DistanceInput.prototype.useRadii = !1;
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "useRadii",
  box2d.b2DistanceInput.prototype.useRadii
);
box2d.b2DistanceInput.prototype.Reset = function () {
  this.proxyA.Reset();
  this.proxyB.Reset();
  this.transformA.SetIdentity();
  this.transformB.SetIdentity();
  this.useRadii = !1;
  return this;
};
goog.exportProperty(
  box2d.b2DistanceInput.prototype,
  "Reset",
  box2d.b2DistanceInput.prototype.Reset
);
box2d.b2DistanceOutput = function () {
  this.pointA = new box2d.b2Vec2();
  this.pointB = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2DistanceOutput", box2d.b2DistanceOutput);
box2d.b2DistanceOutput.prototype.pointA = null;
goog.exportProperty(
  box2d.b2DistanceOutput.prototype,
  "pointA",
  box2d.b2DistanceOutput.prototype.pointA
);
box2d.b2DistanceOutput.prototype.pointB = null;
goog.exportProperty(
  box2d.b2DistanceOutput.prototype,
  "pointB",
  box2d.b2DistanceOutput.prototype.pointB
);
box2d.b2DistanceOutput.prototype.distance = 0;
goog.exportProperty(
  box2d.b2DistanceOutput.prototype,
  "distance",
  box2d.b2DistanceOutput.prototype.distance
);
box2d.b2DistanceOutput.prototype.iterations = 0;
goog.exportProperty(
  box2d.b2DistanceOutput.prototype,
  "iterations",
  box2d.b2DistanceOutput.prototype.iterations
);
box2d.b2DistanceOutput.prototype.Reset = function () {
  this.pointA.SetZero();
  this.pointB.SetZero();
  this.iterations = this.distance = 0;
  return this;
};
goog.exportProperty(
  box2d.b2DistanceOutput.prototype,
  "Reset",
  box2d.b2DistanceOutput.prototype.Reset
);
box2d.b2_gjkCalls = 0;
goog.exportSymbol("box2d.b2_gjkCalls", box2d.b2_gjkCalls);
box2d.b2_gjkIters = 0;
goog.exportSymbol("box2d.b2_gjkIters", box2d.b2_gjkIters);
box2d.b2_gjkMaxIters = 0;
goog.exportSymbol("box2d.b2_gjkMaxIters", box2d.b2_gjkMaxIters);
box2d.b2SimplexVertex = function () {
  this.wA = new box2d.b2Vec2();
  this.wB = new box2d.b2Vec2();
  this.w = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2SimplexVertex", box2d.b2SimplexVertex);
box2d.b2SimplexVertex.prototype.wA = null;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "wA",
  box2d.b2SimplexVertex.prototype.wA
);
box2d.b2SimplexVertex.prototype.wB = null;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "wB",
  box2d.b2SimplexVertex.prototype.wB
);
box2d.b2SimplexVertex.prototype.w = null;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "w",
  box2d.b2SimplexVertex.prototype.w
);
box2d.b2SimplexVertex.prototype.a = 0;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "a",
  box2d.b2SimplexVertex.prototype.a
);
box2d.b2SimplexVertex.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "indexA",
  box2d.b2SimplexVertex.prototype.indexA
);
box2d.b2SimplexVertex.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "indexB",
  box2d.b2SimplexVertex.prototype.indexB
);
box2d.b2SimplexVertex.prototype.Copy = function (a) {
  this.wA.Copy(a.wA);
  this.wB.Copy(a.wB);
  this.w.Copy(a.w);
  this.a = a.a;
  this.indexA = a.indexA;
  this.indexB = a.indexB;
  return this;
};
goog.exportProperty(
  box2d.b2SimplexVertex.prototype,
  "Copy",
  box2d.b2SimplexVertex.prototype.Copy
);
box2d.b2Simplex = function () {
  this.m_v1 = new box2d.b2SimplexVertex();
  this.m_v2 = new box2d.b2SimplexVertex();
  this.m_v3 = new box2d.b2SimplexVertex();
  this.m_vertices = Array(3);
  this.m_vertices[0] = this.m_v1;
  this.m_vertices[1] = this.m_v2;
  this.m_vertices[2] = this.m_v3;
};
goog.exportSymbol("box2d.b2Simplex", box2d.b2Simplex);
box2d.b2Simplex.prototype.m_v1 = null;
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "m_v1",
  box2d.b2Simplex.prototype.m_v1
);
box2d.b2Simplex.prototype.m_v2 = null;
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "m_v2",
  box2d.b2Simplex.prototype.m_v2
);
box2d.b2Simplex.prototype.m_v3 = null;
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "m_v3",
  box2d.b2Simplex.prototype.m_v3
);
box2d.b2Simplex.prototype.m_vertices = null;
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "m_vertices",
  box2d.b2Simplex.prototype.m_vertices
);
box2d.b2Simplex.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "m_count",
  box2d.b2Simplex.prototype.m_count
);
box2d.b2Simplex.prototype.ReadCache = function (a, b, c, d, e) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a.count && 3 >= a.count);
  this.m_count = a.count;
  for (var f = this.m_vertices, g = 0; g < this.m_count; ++g) {
    var h = f[g];
    h.indexA = a.indexA[g];
    h.indexB = a.indexB[g];
    var k = b.GetVertex(h.indexA),
      l = d.GetVertex(h.indexB);
    box2d.b2Mul_X_V2(c, k, h.wA);
    box2d.b2Mul_X_V2(e, l, h.wB);
    box2d.b2Sub_V2_V2(h.wB, h.wA, h.w);
    h.a = 0;
  }
  1 < this.m_count &&
    ((a = a.metric),
    (g = this.GetMetric()),
    g < 0.5 * a || 2 * a < g || g < box2d.b2_epsilon) &&
    (this.m_count = 0);
  0 === this.m_count &&
    ((h = f[0]),
    (h.indexA = 0),
    (h.indexB = 0),
    (k = b.GetVertex(0)),
    (l = d.GetVertex(0)),
    box2d.b2Mul_X_V2(c, k, h.wA),
    box2d.b2Mul_X_V2(e, l, h.wB),
    box2d.b2Sub_V2_V2(h.wB, h.wA, h.w),
    (this.m_count = h.a = 1));
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "ReadCache",
  box2d.b2Simplex.prototype.ReadCache
);
box2d.b2Simplex.prototype.WriteCache = function (a) {
  a.metric = this.GetMetric();
  a.count = this.m_count;
  for (var b = this.m_vertices, c = 0; c < this.m_count; ++c)
    (a.indexA[c] = b[c].indexA), (a.indexB[c] = b[c].indexB);
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "WriteCache",
  box2d.b2Simplex.prototype.WriteCache
);
box2d.b2Simplex.prototype.GetSearchDirection = function (a) {
  switch (this.m_count) {
    case 1:
      return a.Copy(this.m_v1.w).SelfNeg();
    case 2:
      var b = box2d.b2Sub_V2_V2(this.m_v2.w, this.m_v1.w, a);
      return 0 <
        box2d.b2Cross_V2_V2(b, box2d.b2Vec2.s_t0.Copy(this.m_v1.w).SelfNeg())
        ? box2d.b2Cross_S_V2(1, b, a)
        : box2d.b2Cross_V2_S(b, 1, a);
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero();
  }
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "GetSearchDirection",
  box2d.b2Simplex.prototype.GetSearchDirection
);
box2d.b2Simplex.prototype.GetClosestPoint = function (a) {
  switch (this.m_count) {
    case 0:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero();
    case 1:
      return a.Copy(this.m_v1.w);
    case 2:
      return a.Set(
        this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x,
        this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y
      );
    case 3:
      return a.SetZero();
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero();
  }
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "GetClosestPoint",
  box2d.b2Simplex.prototype.GetClosestPoint
);
box2d.b2Simplex.prototype.GetWitnessPoints = function (a, b) {
  switch (this.m_count) {
    case 0:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
      break;
    case 1:
      a.Copy(this.m_v1.wA);
      b.Copy(this.m_v1.wB);
      break;
    case 2:
      a.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
      a.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
      b.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
      b.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
      break;
    case 3:
      b.x = a.x =
        this.m_v1.a * this.m_v1.wA.x +
        this.m_v2.a * this.m_v2.wA.x +
        this.m_v3.a * this.m_v3.wA.x;
      b.y = a.y =
        this.m_v1.a * this.m_v1.wA.y +
        this.m_v2.a * this.m_v2.wA.y +
        this.m_v3.a * this.m_v3.wA.y;
      break;
    default:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  }
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "GetWitnessPoints",
  box2d.b2Simplex.prototype.GetWitnessPoints
);
box2d.b2Simplex.prototype.GetMetric = function () {
  switch (this.m_count) {
    case 0:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0;
    case 1:
      return 0;
    case 2:
      return box2d.b2Distance(this.m_v1.w, this.m_v2.w);
    case 3:
      return box2d.b2Cross_V2_V2(
        box2d.b2Sub_V2_V2(this.m_v2.w, this.m_v1.w, box2d.b2Vec2.s_t0),
        box2d.b2Sub_V2_V2(this.m_v3.w, this.m_v1.w, box2d.b2Vec2.s_t1)
      );
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0;
  }
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "GetMetric",
  box2d.b2Simplex.prototype.GetMetric
);
box2d.b2Simplex.prototype.Solve2 = function () {
  var a = this.m_v1.w,
    b = this.m_v2.w,
    c = box2d.b2Sub_V2_V2(b, a, box2d.b2Simplex.s_e12),
    a = -box2d.b2Dot_V2_V2(a, c);
  0 >= a
    ? (this.m_count = this.m_v1.a = 1)
    : ((b = box2d.b2Dot_V2_V2(b, c)),
      0 >= b
        ? ((this.m_count = this.m_v2.a = 1), this.m_v1.Copy(this.m_v2))
        : ((c = 1 / (b + a)),
          (this.m_v1.a = b * c),
          (this.m_v2.a = a * c),
          (this.m_count = 2)));
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "Solve2",
  box2d.b2Simplex.prototype.Solve2
);
box2d.b2Simplex.prototype.Solve3 = function () {
  var a = this.m_v1.w,
    b = this.m_v2.w,
    c = this.m_v3.w,
    d = box2d.b2Sub_V2_V2(b, a, box2d.b2Simplex.s_e12),
    e = box2d.b2Dot_V2_V2(a, d),
    f = box2d.b2Dot_V2_V2(b, d),
    e = -e,
    g = box2d.b2Sub_V2_V2(c, a, box2d.b2Simplex.s_e13),
    h = box2d.b2Dot_V2_V2(a, g),
    k = box2d.b2Dot_V2_V2(c, g),
    h = -h,
    l = box2d.b2Sub_V2_V2(c, b, box2d.b2Simplex.s_e23),
    m = box2d.b2Dot_V2_V2(b, l),
    l = box2d.b2Dot_V2_V2(c, l),
    m = -m,
    g = box2d.b2Cross_V2_V2(d, g),
    d = g * box2d.b2Cross_V2_V2(b, c),
    c = g * box2d.b2Cross_V2_V2(c, a),
    a = g * box2d.b2Cross_V2_V2(a, b);
  0 >= e && 0 >= h
    ? (this.m_count = this.m_v1.a = 1)
    : 0 < f && 0 < e && 0 >= a
    ? ((k = 1 / (f + e)),
      (this.m_v1.a = f * k),
      (this.m_v2.a = e * k),
      (this.m_count = 2))
    : 0 < k && 0 < h && 0 >= c
    ? ((f = 1 / (k + h)),
      (this.m_v1.a = k * f),
      (this.m_v3.a = h * f),
      (this.m_count = 2),
      this.m_v2.Copy(this.m_v3))
    : 0 >= f && 0 >= m
    ? ((this.m_count = this.m_v2.a = 1), this.m_v1.Copy(this.m_v2))
    : 0 >= k && 0 >= l
    ? ((this.m_count = this.m_v3.a = 1), this.m_v1.Copy(this.m_v3))
    : 0 < l && 0 < m && 0 >= d
    ? ((f = 1 / (l + m)),
      (this.m_v2.a = l * f),
      (this.m_v3.a = m * f),
      (this.m_count = 2),
      this.m_v1.Copy(this.m_v3))
    : ((f = 1 / (d + c + a)),
      (this.m_v1.a = d * f),
      (this.m_v2.a = c * f),
      (this.m_v3.a = a * f),
      (this.m_count = 3));
};
goog.exportProperty(
  box2d.b2Simplex.prototype,
  "Solve3",
  box2d.b2Simplex.prototype.Solve3
);
box2d.b2Simplex.s_e12 = new box2d.b2Vec2();
box2d.b2Simplex.s_e13 = new box2d.b2Vec2();
box2d.b2Simplex.s_e23 = new box2d.b2Vec2();
box2d.b2ShapeDistance = function (a, b, c) {
  ++box2d.b2_gjkCalls;
  var d = c.proxyA,
    e = c.proxyB,
    f = c.transformA,
    g = c.transformB,
    h = box2d.b2Distance.s_simplex;
  h.ReadCache(b, d, f, e, g);
  for (
    var k = h.m_vertices,
      l = box2d.b2Distance.s_saveA,
      m = box2d.b2Distance.s_saveB,
      n = 0,
      p = 0;
    20 > p;

  ) {
    for (var n = h.m_count, q = 0; q < n; ++q)
      (l[q] = k[q].indexA), (m[q] = k[q].indexB);
    switch (h.m_count) {
      case 1:
        break;
      case 2:
        h.Solve2();
        break;
      case 3:
        h.Solve3();
        break;
      default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
    }
    if (3 === h.m_count) break;
    var r = h.GetClosestPoint(box2d.b2Distance.s_p);
    r.LengthSquared();
    q = h.GetSearchDirection(box2d.b2Distance.s_d);
    if (q.LengthSquared() < box2d.b2_epsilon_sq) break;
    r = k[h.m_count];
    r.indexA = d.GetSupport(
      box2d.b2MulT_R_V2(
        f.q,
        box2d.b2Vec2.s_t0.Copy(q).SelfNeg(),
        box2d.b2Distance.s_supportA
      )
    );
    box2d.b2Mul_X_V2(f, d.GetVertex(r.indexA), r.wA);
    r.indexB = e.GetSupport(
      box2d.b2MulT_R_V2(g.q, q, box2d.b2Distance.s_supportB)
    );
    box2d.b2Mul_X_V2(g, e.GetVertex(r.indexB), r.wB);
    box2d.b2Sub_V2_V2(r.wB, r.wA, r.w);
    ++p;
    ++box2d.b2_gjkIters;
    for (var u = !1, q = 0; q < n; ++q)
      if (r.indexA === l[q] && r.indexB === m[q]) {
        u = !0;
        break;
      }
    if (u) break;
    ++h.m_count;
  }
  box2d.b2_gjkMaxIters = box2d.b2Max(box2d.b2_gjkMaxIters, p);
  h.GetWitnessPoints(a.pointA, a.pointB);
  a.distance = box2d.b2Distance(a.pointA, a.pointB);
  a.iterations = p;
  h.WriteCache(b);
  c.useRadii &&
    ((b = d.m_radius),
    (e = e.m_radius),
    a.distance > b + e && a.distance > box2d.b2_epsilon
      ? ((a.distance -= b + e),
        (c = box2d.b2Sub_V2_V2(a.pointB, a.pointA, box2d.b2Distance.s_normal)),
        c.Normalize(),
        a.pointA.SelfMulAdd(b, c),
        a.pointB.SelfMulSub(e, c))
      : ((r = box2d.b2Mid_V2_V2(a.pointA, a.pointB, box2d.b2Distance.s_p)),
        a.pointA.Copy(r),
        a.pointB.Copy(r),
        (a.distance = 0)));
};
goog.exportSymbol("box2d.b2ShapeDistance", box2d.b2ShapeDistance);
box2d.b2Distance.s_simplex = new box2d.b2Simplex();
box2d.b2Distance.s_saveA = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_saveB = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_p = new box2d.b2Vec2();
box2d.b2Distance.s_d = new box2d.b2Vec2();
box2d.b2Distance.s_normal = new box2d.b2Vec2();
box2d.b2Distance.s_supportA = new box2d.b2Vec2();
box2d.b2Distance.s_supportB = new box2d.b2Vec2();
box2d.b2Collision = {};
box2d.b2ContactFeatureType = {
  e_vertex: 0,
  e_face: 1,
};
goog.exportSymbol("box2d.b2ContactFeatureType", box2d.b2ContactFeatureType);
goog.exportProperty(
  box2d.b2ContactFeatureType,
  "e_vertex",
  box2d.b2ContactFeatureType.e_vertex
);
goog.exportProperty(
  box2d.b2ContactFeatureType,
  "e_face",
  box2d.b2ContactFeatureType.e_face
);
box2d.b2ContactFeature = function () {};
goog.exportSymbol("box2d.b2ContactFeature", box2d.b2ContactFeature);
box2d.b2ContactFeature.prototype._key = 0;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_key",
  box2d.b2ContactFeature.prototype._key
);
box2d.b2ContactFeature.prototype._key_invalid = !1;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_key_invalid",
  box2d.b2ContactFeature.prototype._key_invalid
);
box2d.b2ContactFeature.prototype._indexA = 0;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_indexA",
  box2d.b2ContactFeature.prototype._indexA
);
box2d.b2ContactFeature.prototype._indexB = 0;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_indexB",
  box2d.b2ContactFeature.prototype._indexB
);
box2d.b2ContactFeature.prototype._typeA = 0;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_typeA",
  box2d.b2ContactFeature.prototype._typeA
);
box2d.b2ContactFeature.prototype._typeB = 0;
goog.exportProperty(
  box2d.b2ContactFeature.prototype,
  "_typeB",
  box2d.b2ContactFeature.prototype._typeB
);
Object.defineProperty(box2d.b2ContactFeature.prototype, "key", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    this._key_invalid &&
      ((this._key_invalid = !1),
      (this._key =
        this._indexA |
        (this._indexB << 8) |
        (this._typeA << 16) |
        (this._typeB << 24)));
    return this._key;
  },
  set: function (a) {
    this._key = a;
    this._indexA = this._key & 255;
    this._indexB = (this._key >> 8) & 255;
    this._typeA = (this._key >> 16) & 255;
    this._typeB = (this._key >> 24) & 255;
  },
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexA", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this._indexA;
  },
  set: function (a) {
    this._indexA = a;
    this._key_invalid = !0;
  },
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexB", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this._indexB;
  },
  set: function (a) {
    this._indexB = a;
    this._key_invalid = !0;
  },
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeA", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this._typeA;
  },
  set: function (a) {
    this._typeA = a;
    this._key_invalid = !0;
  },
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeB", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this._typeB;
  },
  set: function (a) {
    this._typeB = a;
    this._key_invalid = !0;
  },
});
box2d.b2ContactID = function () {
  this.cf = new box2d.b2ContactFeature();
};
goog.exportSymbol("box2d.b2ContactID", box2d.b2ContactID);
box2d.b2ContactID.prototype.cf = null;
goog.exportProperty(
  box2d.b2ContactID.prototype,
  "cf",
  box2d.b2ContactID.prototype.cf
);
box2d.b2ContactID.prototype.key = 0;
goog.exportProperty(
  box2d.b2ContactID.prototype,
  "key",
  box2d.b2ContactID.prototype.key
);
Object.defineProperty(box2d.b2ContactID.prototype, "key", {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this.cf.key;
  },
  set: function (a) {
    this.cf.key = a;
  },
});
box2d.b2ContactID.prototype.Copy = function (a) {
  this.key = a.key;
  return this;
};
goog.exportProperty(
  box2d.b2ContactID.prototype,
  "Copy",
  box2d.b2ContactID.prototype.Copy
);
box2d.b2ContactID.prototype.Clone = function () {
  return new box2d.b2ContactID().Copy(this);
};
goog.exportProperty(
  box2d.b2ContactID.prototype,
  "Clone",
  box2d.b2ContactID.prototype.Clone
);
box2d.b2ManifoldPoint = function () {
  this.localPoint = new box2d.b2Vec2();
  this.id = new box2d.b2ContactID();
};
goog.exportSymbol("box2d.b2ManifoldPoint", box2d.b2ManifoldPoint);
box2d.b2ManifoldPoint.prototype.localPoint = null;
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "localPoint",
  box2d.b2ManifoldPoint.prototype.localPoint
);
box2d.b2ManifoldPoint.prototype.normalImpulse = 0;
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "normalImpulse",
  box2d.b2ManifoldPoint.prototype.normalImpulse
);
box2d.b2ManifoldPoint.prototype.tangentImpulse = 0;
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "tangentImpulse",
  box2d.b2ManifoldPoint.prototype.tangentImpulse
);
box2d.b2ManifoldPoint.prototype.id = null;
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "id",
  box2d.b2ManifoldPoint.prototype.id
);
box2d.b2ManifoldPoint.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2ManifoldPoint();
  });
};
goog.exportProperty(
  box2d.b2ManifoldPoint,
  "MakeArray",
  box2d.b2ManifoldPoint.MakeArray
);
box2d.b2ManifoldPoint.prototype.Reset = function () {
  this.localPoint.SetZero();
  this.tangentImpulse = this.normalImpulse = 0;
  this.id.key = 0;
};
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "Reset",
  box2d.b2ManifoldPoint.prototype.Reset
);
box2d.b2ManifoldPoint.prototype.Copy = function (a) {
  this.localPoint.Copy(a.localPoint);
  this.normalImpulse = a.normalImpulse;
  this.tangentImpulse = a.tangentImpulse;
  this.id.Copy(a.id);
  return this;
};
goog.exportProperty(
  box2d.b2ManifoldPoint.prototype,
  "Copy",
  box2d.b2ManifoldPoint.prototype.Copy
);
box2d.b2ManifoldType = {
  e_unknown: -1,
  e_circles: 0,
  e_faceA: 1,
  e_faceB: 2,
};
goog.exportSymbol("box2d.b2ManifoldType", box2d.b2ManifoldType);
goog.exportProperty(
  box2d.b2ManifoldType,
  "e_unknown",
  box2d.b2ManifoldType.e_unknown
);
goog.exportProperty(
  box2d.b2ManifoldType,
  "e_circles",
  box2d.b2ManifoldType.e_circles
);
goog.exportProperty(
  box2d.b2ManifoldType,
  "e_faceA",
  box2d.b2ManifoldType.e_faceA
);
goog.exportProperty(
  box2d.b2ManifoldType,
  "e_faceB",
  box2d.b2ManifoldType.e_faceB
);
box2d.b2Manifold = function () {
  this.points = box2d.b2ManifoldPoint.MakeArray(box2d.b2_maxManifoldPoints);
  this.localNormal = new box2d.b2Vec2();
  this.localPoint = new box2d.b2Vec2();
  this.type = box2d.b2ManifoldType.e_unknown;
  this.pointCount = 0;
};
goog.exportSymbol("box2d.b2Manifold", box2d.b2Manifold);
box2d.b2Manifold.prototype.points = null;
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "points",
  box2d.b2Manifold.prototype.points
);
box2d.b2Manifold.prototype.localNormal = null;
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "localNormal",
  box2d.b2Manifold.prototype.localNormal
);
box2d.b2Manifold.prototype.localPoint = null;
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "localPoint",
  box2d.b2Manifold.prototype.localPoint
);
box2d.b2Manifold.prototype.type = box2d.b2ManifoldType.e_unknown;
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "type",
  box2d.b2Manifold.prototype.type
);
box2d.b2Manifold.prototype.pointCount = 0;
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "pointCount",
  box2d.b2Manifold.prototype.pointCount
);
box2d.b2Manifold.prototype.Reset = function () {
  for (var a = 0, b = box2d.b2_maxManifoldPoints; a < b; ++a)
    this.points[a].Reset();
  this.localNormal.SetZero();
  this.localPoint.SetZero();
  this.type = box2d.b2ManifoldType.e_unknown;
  this.pointCount = 0;
};
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "Reset",
  box2d.b2Manifold.prototype.Reset
);
box2d.b2Manifold.prototype.Copy = function (a) {
  this.pointCount = a.pointCount;
  for (var b = 0, c = box2d.b2_maxManifoldPoints; b < c; ++b)
    this.points[b].Copy(a.points[b]);
  this.localNormal.Copy(a.localNormal);
  this.localPoint.Copy(a.localPoint);
  this.type = a.type;
  return this;
};
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "Copy",
  box2d.b2Manifold.prototype.Copy
);
box2d.b2Manifold.prototype.Clone = function () {
  return new box2d.b2Manifold().Copy(this);
};
goog.exportProperty(
  box2d.b2Manifold.prototype,
  "Clone",
  box2d.b2Manifold.prototype.Clone
);
box2d.b2WorldManifold = function () {
  this.normal = new box2d.b2Vec2();
  this.points = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
  this.separations = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
};
goog.exportSymbol("box2d.b2WorldManifold", box2d.b2WorldManifold);
box2d.b2WorldManifold.prototype.normal = null;
goog.exportProperty(
  box2d.b2WorldManifold.prototype,
  "normal",
  box2d.b2WorldManifold.prototype.normal
);
box2d.b2WorldManifold.prototype.points = null;
goog.exportProperty(
  box2d.b2WorldManifold.prototype,
  "points",
  box2d.b2WorldManifold.prototype.points
);
box2d.b2WorldManifold.prototype.separations = null;
goog.exportProperty(
  box2d.b2WorldManifold.prototype,
  "separations",
  box2d.b2WorldManifold.prototype.separations
);
box2d.b2WorldManifold.prototype.Initialize = function (a, b, c, d, e) {
  if (0 !== a.pointCount)
    switch (a.type) {
      case box2d.b2ManifoldType.e_circles:
        this.normal.Set(1, 0);
        b = box2d.b2Mul_X_V2(
          b,
          a.localPoint,
          box2d.b2WorldManifold.prototype.Initialize.s_pointA
        );
        a = box2d.b2Mul_X_V2(
          d,
          a.points[0].localPoint,
          box2d.b2WorldManifold.prototype.Initialize.s_pointB
        );
        box2d.b2DistanceSquared(b, a) > box2d.b2_epsilon_sq &&
          box2d.b2Sub_V2_V2(a, b, this.normal).SelfNormalize();
        var f = box2d.b2AddMul_V2_S_V2(
            b,
            c,
            this.normal,
            box2d.b2WorldManifold.prototype.Initialize.s_cA
          ),
          g = box2d.b2SubMul_V2_S_V2(
            a,
            e,
            this.normal,
            box2d.b2WorldManifold.prototype.Initialize.s_cB
          );
        box2d.b2Mid_V2_V2(f, g, this.points[0]);
        this.separations[0] = box2d.b2Dot_V2_V2(
          box2d.b2Sub_V2_V2(g, f, box2d.b2Vec2.s_t0),
          this.normal
        );
        break;
      case box2d.b2ManifoldType.e_faceA:
        box2d.b2Mul_R_V2(b.q, a.localNormal, this.normal);
        for (
          var h = box2d.b2Mul_X_V2(
              b,
              a.localPoint,
              box2d.b2WorldManifold.prototype.Initialize.s_planePoint
            ),
            k = 0,
            l = a.pointCount;
          k < l;
          ++k
        ) {
          var m = box2d.b2Mul_X_V2(
              d,
              a.points[k].localPoint,
              box2d.b2WorldManifold.prototype.Initialize.s_clipPoint
            ),
            f =
              c -
              box2d.b2Dot_V2_V2(
                box2d.b2Sub_V2_V2(m, h, box2d.b2Vec2.s_t0),
                this.normal
              ),
            f = box2d.b2AddMul_V2_S_V2(
              m,
              f,
              this.normal,
              box2d.b2WorldManifold.prototype.Initialize.s_cA
            ),
            g = box2d.b2SubMul_V2_S_V2(
              m,
              e,
              this.normal,
              box2d.b2WorldManifold.prototype.Initialize.s_cB
            );
          box2d.b2Mid_V2_V2(f, g, this.points[k]);
          this.separations[k] = box2d.b2Dot_V2_V2(
            box2d.b2Sub_V2_V2(g, f, box2d.b2Vec2.s_t0),
            this.normal
          );
        }
        break;
      case box2d.b2ManifoldType.e_faceB:
        box2d.b2Mul_R_V2(d.q, a.localNormal, this.normal);
        h = box2d.b2Mul_X_V2(
          d,
          a.localPoint,
          box2d.b2WorldManifold.prototype.Initialize.s_planePoint
        );
        k = 0;
        for (l = a.pointCount; k < l; ++k)
          (m = box2d.b2Mul_X_V2(
            b,
            a.points[k].localPoint,
            box2d.b2WorldManifold.prototype.Initialize.s_clipPoint
          )),
            (f =
              e -
              box2d.b2Dot_V2_V2(
                box2d.b2Sub_V2_V2(m, h, box2d.b2Vec2.s_t0),
                this.normal
              )),
            (g = box2d.b2AddMul_V2_S_V2(
              m,
              f,
              this.normal,
              box2d.b2WorldManifold.prototype.Initialize.s_cB
            )),
            (f = box2d.b2SubMul_V2_S_V2(
              m,
              c,
              this.normal,
              box2d.b2WorldManifold.prototype.Initialize.s_cA
            )),
            box2d.b2Mid_V2_V2(f, g, this.points[k]),
            (this.separations[k] = box2d.b2Dot_V2_V2(
              box2d.b2Sub_V2_V2(f, g, box2d.b2Vec2.s_t0),
              this.normal
            ));
        this.normal.SelfNeg();
    }
};
goog.exportProperty(
  box2d.b2WorldManifold.prototype,
  "Initialize",
  box2d.b2WorldManifold.prototype.Initialize
);
box2d.b2WorldManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2();
box2d.b2WorldManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2();
box2d.b2WorldManifold.prototype.Initialize.s_cA = new box2d.b2Vec2();
box2d.b2WorldManifold.prototype.Initialize.s_cB = new box2d.b2Vec2();
box2d.b2WorldManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2();
box2d.b2WorldManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2();
box2d.b2PointState = {
  b2_nullState: 0,
  b2_addState: 1,
  b2_persistState: 2,
  b2_removeState: 3,
};
goog.exportSymbol("box2d.b2PointState", box2d.b2PointState);
goog.exportProperty(
  box2d.b2PointState,
  "b2_nullState   ",
  box2d.b2PointState.b2_nullState
);
goog.exportProperty(
  box2d.b2PointState,
  "b2_addState    ",
  box2d.b2PointState.b2_addState
);
goog.exportProperty(
  box2d.b2PointState,
  "b2_persistState",
  box2d.b2PointState.b2_persistState
);
goog.exportProperty(
  box2d.b2PointState,
  "b2_removeState ",
  box2d.b2PointState.b2_removeState
);
box2d.b2GetPointStates = function (a, b, c, d) {
  for (var e = 0, f = c.pointCount; e < f; ++e) {
    var g = c.points[e].id,
      g = g.key;
    a[e] = box2d.b2PointState.b2_removeState;
    for (var h = 0, k = d.pointCount; h < k; ++h)
      if (d.points[h].id.key === g) {
        a[e] = box2d.b2PointState.b2_persistState;
        break;
      }
  }
  for (f = box2d.b2_maxManifoldPoints; e < f; ++e)
    a[e] = box2d.b2PointState.b2_nullState;
  e = 0;
  for (f = d.pointCount; e < f; ++e)
    for (
      g = d.points[e].id,
        g = g.key,
        b[e] = box2d.b2PointState.b2_addState,
        h = 0,
        k = c.pointCount;
      h < k;
      ++h
    )
      if (c.points[h].id.key === g) {
        b[e] = box2d.b2PointState.b2_persistState;
        break;
      }
  for (f = box2d.b2_maxManifoldPoints; e < f; ++e)
    b[e] = box2d.b2PointState.b2_nullState;
};
goog.exportSymbol("box2d.b2GetPointStates", box2d.b2GetPointStates);
box2d.b2ClipVertex = function () {
  this.v = new box2d.b2Vec2();
  this.id = new box2d.b2ContactID();
};
goog.exportSymbol("box2d.b2ClipVertex", box2d.b2ClipVertex);
box2d.b2ClipVertex.prototype.v = null;
goog.exportProperty(
  box2d.b2ClipVertex.prototype,
  "v",
  box2d.b2ClipVertex.prototype.v
);
box2d.b2ClipVertex.prototype.id = null;
goog.exportProperty(
  box2d.b2ClipVertex.prototype,
  "id",
  box2d.b2ClipVertex.prototype.id
);
box2d.b2ClipVertex.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2ClipVertex();
  });
};
goog.exportProperty(
  box2d.b2ClipVertex,
  "MakeArray",
  box2d.b2ClipVertex.MakeArray
);
box2d.b2ClipVertex.prototype.Copy = function (a) {
  this.v.Copy(a.v);
  this.id.Copy(a.id);
  return this;
};
goog.exportProperty(
  box2d.b2ClipVertex.prototype,
  "Copy",
  box2d.b2ClipVertex.prototype.Copy
);
box2d.b2RayCastInput = function () {
  this.p1 = new box2d.b2Vec2();
  this.p2 = new box2d.b2Vec2();
  this.maxFraction = 1;
};
goog.exportSymbol("box2d.b2RayCastInput", box2d.b2RayCastInput);
box2d.b2RayCastInput.prototype.p1 = null;
goog.exportProperty(
  box2d.b2RayCastInput.prototype,
  "p1",
  box2d.b2RayCastInput.prototype.p1
);
box2d.b2RayCastInput.prototype.p2 = null;
goog.exportProperty(
  box2d.b2RayCastInput.prototype,
  "p2",
  box2d.b2RayCastInput.prototype.p2
);
box2d.b2RayCastInput.prototype.maxFraction = 1;
goog.exportProperty(
  box2d.b2RayCastInput.prototype,
  "maxFraction",
  box2d.b2RayCastInput.prototype.maxFraction
);
box2d.b2RayCastInput.prototype.Copy = function (a) {
  this.p1.Copy(a.p1);
  this.p2.Copy(a.p2);
  this.maxFraction = a.maxFraction;
  return this;
};
goog.exportProperty(
  box2d.b2RayCastInput.prototype,
  "Copy",
  box2d.b2RayCastInput.prototype.Copy
);
box2d.b2RayCastOutput = function () {
  this.normal = new box2d.b2Vec2();
  this.fraction = 0;
};
goog.exportSymbol("box2d.b2RayCastOutput", box2d.b2RayCastOutput);
box2d.b2RayCastOutput.prototype.normal = null;
goog.exportProperty(
  box2d.b2RayCastOutput.prototype,
  "normal",
  box2d.b2RayCastOutput.prototype.normal
);
box2d.b2RayCastOutput.prototype.fraction = 0;
goog.exportProperty(
  box2d.b2RayCastOutput.prototype,
  "fraction",
  box2d.b2RayCastOutput.prototype.fraction
);
box2d.b2RayCastOutput.prototype.Copy = function (a) {
  this.normal.Copy(a.normal);
  this.fraction = a.fraction;
  return this;
};
goog.exportProperty(
  box2d.b2RayCastOutput.prototype,
  "Copy",
  box2d.b2RayCastOutput.prototype.Copy
);
box2d.b2AABB = function () {
  this.lowerBound = new box2d.b2Vec2();
  this.upperBound = new box2d.b2Vec2();
  this.m_out_center = new box2d.b2Vec2();
  this.m_out_extent = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2AABB", box2d.b2AABB);
box2d.b2AABB.prototype.lowerBound = null;
goog.exportProperty(
  box2d.b2AABB.prototype,
  "lowerBound",
  box2d.b2AABB.prototype.lowerBound
);
box2d.b2AABB.prototype.upperBound = null;
goog.exportProperty(
  box2d.b2AABB.prototype,
  "upperBound",
  box2d.b2AABB.prototype.upperBound
);
box2d.b2AABB.prototype.m_out_center = null;
goog.exportProperty(
  box2d.b2AABB.prototype,
  "m_out_center",
  box2d.b2AABB.prototype.m_out_center
);
box2d.b2AABB.prototype.m_out_extent = null;
goog.exportProperty(
  box2d.b2AABB.prototype,
  "m_out_extent",
  box2d.b2AABB.prototype.m_out_extent
);
box2d.b2AABB.prototype.Clone = function () {
  return new box2d.b2AABB().Copy(this);
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "Clone",
  box2d.b2AABB.prototype.Clone
);
box2d.b2AABB.prototype.Copy = function (a) {
  this.lowerBound.Copy(a.lowerBound);
  this.upperBound.Copy(a.upperBound);
  return this;
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "Copy",
  box2d.b2AABB.prototype.Copy
);
box2d.b2AABB.prototype.IsValid = function () {
  var a = this.upperBound.y - this.lowerBound.y;
  return (a =
    (a = 0 <= this.upperBound.x - this.lowerBound.x && 0 <= a) &&
    this.lowerBound.IsValid() &&
    this.upperBound.IsValid());
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "IsValid",
  box2d.b2AABB.prototype.IsValid
);
box2d.b2AABB.prototype.GetCenter = function () {
  return box2d.b2Mid_V2_V2(this.lowerBound, this.upperBound, this.m_out_center);
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "GetCenter",
  box2d.b2AABB.prototype.GetCenter
);
box2d.b2AABB.prototype.GetExtents = function () {
  return box2d.b2Ext_V2_V2(this.lowerBound, this.upperBound, this.m_out_extent);
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "GetExtents",
  box2d.b2AABB.prototype.GetExtents
);
box2d.b2AABB.prototype.GetPerimeter = function () {
  return (
    2 *
    (this.upperBound.x -
      this.lowerBound.x +
      (this.upperBound.y - this.lowerBound.y))
  );
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "GetPerimeter",
  box2d.b2AABB.prototype.GetPerimeter
);
box2d.b2AABB.prototype.Combine = function (a, b) {
  switch (arguments.length) {
    case 1:
      return this.Combine1(a);
    case 2:
      return this.Combine2(a, b || new box2d.b2AABB());
    default:
      throw Error();
  }
};
box2d.b2AABB.prototype.Combine1 = function (a) {
  this.lowerBound.x = box2d.b2Min(this.lowerBound.x, a.lowerBound.x);
  this.lowerBound.y = box2d.b2Min(this.lowerBound.y, a.lowerBound.y);
  this.upperBound.x = box2d.b2Max(this.upperBound.x, a.upperBound.x);
  this.upperBound.y = box2d.b2Max(this.upperBound.y, a.upperBound.y);
  return this;
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "Combine1",
  box2d.b2AABB.prototype.Combine1
);
box2d.b2AABB.prototype.Combine2 = function (a, b) {
  this.lowerBound.x = box2d.b2Min(a.lowerBound.x, b.lowerBound.x);
  this.lowerBound.y = box2d.b2Min(a.lowerBound.y, b.lowerBound.y);
  this.upperBound.x = box2d.b2Max(a.upperBound.x, b.upperBound.x);
  this.upperBound.y = box2d.b2Max(a.upperBound.y, b.upperBound.y);
  return this;
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "Combine2",
  box2d.b2AABB.prototype.Combine2
);
box2d.b2AABB.Combine = function (a, b, c) {
  c.Combine2(a, b);
  return c;
};
goog.exportProperty(box2d.b2AABB, "Combine", box2d.b2AABB.Combine);
box2d.b2AABB.prototype.Contains = function (a) {
  var b;
  return (b =
    (b =
      (b =
        (b = this.lowerBound.x <= a.lowerBound.x) &&
        this.lowerBound.y <= a.lowerBound.y) &&
      a.upperBound.x <= this.upperBound.x) &&
    a.upperBound.y <= this.upperBound.y);
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "Contains",
  box2d.b2AABB.prototype.Contains
);
box2d.b2AABB.prototype.RayCast = function (a, b) {
  var c = -box2d.b2_maxFloat,
    d = box2d.b2_maxFloat,
    e = b.p1.x,
    f = b.p1.y,
    g = b.p2.x - b.p1.x,
    h = b.p2.y - b.p1.y,
    k = box2d.b2Abs(g),
    l = box2d.b2Abs(h),
    m = a.normal;
  if (k < box2d.b2_epsilon) {
    if (e < this.lowerBound.x || this.upperBound.x < e) return !1;
  } else if (
    ((k = 1 / g),
    (g = (this.lowerBound.x - e) * k),
    (e = (this.upperBound.x - e) * k),
    (k = -1),
    g > e && ((k = g), (g = e), (e = k), (k = 1)),
    g > c && ((m.x = k), (m.y = 0), (c = g)),
    (d = box2d.b2Min(d, e)),
    c > d)
  )
    return !1;
  if (l < box2d.b2_epsilon) {
    if (f < this.lowerBound.y || this.upperBound.y < f) return !1;
  } else if (
    ((k = 1 / h),
    (g = (this.lowerBound.y - f) * k),
    (e = (this.upperBound.y - f) * k),
    (k = -1),
    g > e && ((k = g), (g = e), (e = k), (k = 1)),
    g > c && ((m.x = 0), (m.y = k), (c = g)),
    (d = box2d.b2Min(d, e)),
    c > d)
  )
    return !1;
  if (0 > c || b.maxFraction < c) return !1;
  a.fraction = c;
  return !0;
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "RayCast",
  box2d.b2AABB.prototype.RayCast
);
box2d.b2AABB.prototype.TestOverlap = function (a) {
  var b = a.lowerBound.y - this.upperBound.y,
    c = this.lowerBound.y - a.upperBound.y;
  return 0 < a.lowerBound.x - this.upperBound.x ||
    0 < b ||
    0 < this.lowerBound.x - a.upperBound.x ||
    0 < c
    ? !1
    : !0;
};
goog.exportProperty(
  box2d.b2AABB.prototype,
  "TestOverlap",
  box2d.b2AABB.prototype.TestOverlap
);
box2d.b2TestOverlap_AABB = function (a, b) {
  var c = b.lowerBound.y - a.upperBound.y,
    d = a.lowerBound.y - b.upperBound.y;
  return 0 < b.lowerBound.x - a.upperBound.x ||
    0 < c ||
    0 < a.lowerBound.x - b.upperBound.x ||
    0 < d
    ? !1
    : !0;
};
goog.exportSymbol("box2d.b2TestOverlap_AABB", box2d.b2TestOverlap_AABB);
box2d.b2ClipSegmentToLine = function (a, b, c, d, e) {
  var f = 0,
    g = b[0];
  b = b[1];
  var h = box2d.b2Dot_V2_V2(c, g.v) - d;
  c = box2d.b2Dot_V2_V2(c, b.v) - d;
  0 >= h && a[f++].Copy(g);
  0 >= c && a[f++].Copy(b);
  0 > h * c &&
    ((c = h / (h - c)),
    (d = a[f].v),
    (d.x = g.v.x + c * (b.v.x - g.v.x)),
    (d.y = g.v.y + c * (b.v.y - g.v.y)),
    (a = a[f].id),
    (a.cf.indexA = e),
    (a.cf.indexB = g.id.cf.indexB),
    (a.cf.typeA = box2d.b2ContactFeatureType.e_vertex),
    (a.cf.typeB = box2d.b2ContactFeatureType.e_face),
    ++f);
  return f;
};
goog.exportSymbol("box2d.b2ClipSegmentToLine", box2d.b2ClipSegmentToLine);
box2d.b2TestOverlap_Shape = function (a, b, c, d, e, f) {
  var g = box2d.b2TestOverlap_Shape.s_input.Reset();
  g.proxyA.SetShape(a, b);
  g.proxyB.SetShape(c, d);
  g.transformA.Copy(e);
  g.transformB.Copy(f);
  g.useRadii = !0;
  a = box2d.b2TestOverlap_Shape.s_simplexCache.Reset();
  a.count = 0;
  b = box2d.b2TestOverlap_Shape.s_output.Reset();
  box2d.b2ShapeDistance(b, a, g);
  return b.distance < 10 * box2d.b2_epsilon;
};
goog.exportSymbol("box2d.b2TestOverlap_Shape", box2d.b2TestOverlap_Shape);
box2d.b2TestOverlap_Shape.s_input = new box2d.b2DistanceInput();
box2d.b2TestOverlap_Shape.s_simplexCache = new box2d.b2SimplexCache();
box2d.b2TestOverlap_Shape.s_output = new box2d.b2DistanceOutput();
box2d.b2TestOverlap = function (a, b, c, d, e, f) {
  if (a instanceof box2d.b2AABB && b instanceof box2d.b2AABB)
    return box2d.b2TestOverlap_AABB(a, b);
  if (
    a instanceof box2d.b2Shape &&
    "number" === typeof b &&
    c instanceof box2d.b2Shape &&
    "number" === typeof d &&
    e instanceof box2d.b2Transform &&
    f instanceof box2d.b2Transform
  )
    return box2d.b2TestOverlap_Shape(a, b, c, d, e, f);
  throw Error();
};
goog.exportSymbol("box2d.b2TestOverlap", box2d.b2TestOverlap);
box2d.b2CollideCircle = {};
box2d.b2CollideCircles = function (a, b, c, d, e) {
  a.pointCount = 0;
  c = box2d.b2Mul_X_V2(c, b.m_p, box2d.b2CollideCircles.s_pA);
  e = box2d.b2Mul_X_V2(e, d.m_p, box2d.b2CollideCircles.s_pB);
  e = box2d.b2DistanceSquared(c, e);
  c = b.m_radius + d.m_radius;
  e > c * c ||
    ((a.type = box2d.b2ManifoldType.e_circles),
    a.localPoint.Copy(b.m_p),
    a.localNormal.SetZero(),
    (a.pointCount = 1),
    a.points[0].localPoint.Copy(d.m_p),
    (a.points[0].id.key = 0));
};
goog.exportSymbol("box2d.b2CollideCircles", box2d.b2CollideCircles);
box2d.b2CollideCircles.s_pA = new box2d.b2Vec2();
box2d.b2CollideCircles.s_pB = new box2d.b2Vec2();
box2d.b2CollidePolygonAndCircle = function (a, b, c, d, e) {
  a.pointCount = 0;
  e = box2d.b2Mul_X_V2(e, d.m_p, box2d.b2CollidePolygonAndCircle.s_c);
  c = box2d.b2MulT_X_V2(c, e, box2d.b2CollidePolygonAndCircle.s_cLocal);
  var f = 0,
    g = -box2d.b2_maxFloat;
  e = b.m_radius + d.m_radius;
  var h = b.m_count,
    k = b.m_vertices;
  b = b.m_normals;
  for (var l = 0; l < h; ++l) {
    var m = box2d.b2Dot_V2_V2(
      b[l],
      box2d.b2Sub_V2_V2(c, k[l], box2d.b2Vec2.s_t0)
    );
    if (m > e) return;
    m > g && ((g = m), (f = l));
  }
  l = f;
  m = k[l];
  h = k[(l + 1) % h];
  g < box2d.b2_epsilon
    ? ((a.pointCount = 1),
      (a.type = box2d.b2ManifoldType.e_faceA),
      a.localNormal.Copy(b[f]),
      box2d.b2Mid_V2_V2(m, h, a.localPoint),
      a.points[0].localPoint.Copy(d.m_p),
      (a.points[0].id.key = 0))
    : ((g = box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(c, m, box2d.b2Vec2.s_t0),
        box2d.b2Sub_V2_V2(h, m, box2d.b2Vec2.s_t1)
      )),
      (f = box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(c, h, box2d.b2Vec2.s_t0),
        box2d.b2Sub_V2_V2(m, h, box2d.b2Vec2.s_t1)
      )),
      0 >= g
        ? box2d.b2DistanceSquared(c, m) > e * e ||
          ((a.pointCount = 1),
          (a.type = box2d.b2ManifoldType.e_faceA),
          box2d.b2Sub_V2_V2(c, m, a.localNormal).SelfNormalize(),
          a.localPoint.Copy(m),
          a.points[0].localPoint.Copy(d.m_p),
          (a.points[0].id.key = 0))
        : 0 >= f
        ? box2d.b2DistanceSquared(c, h) > e * e ||
          ((a.pointCount = 1),
          (a.type = box2d.b2ManifoldType.e_faceA),
          box2d.b2Sub_V2_V2(c, h, a.localNormal).SelfNormalize(),
          a.localPoint.Copy(h),
          a.points[0].localPoint.Copy(d.m_p),
          (a.points[0].id.key = 0))
        : ((f = box2d.b2Mid_V2_V2(
            m,
            h,
            box2d.b2CollidePolygonAndCircle.s_faceCenter
          )),
          (g = box2d.b2Dot_V2_V2(
            box2d.b2Sub_V2_V2(c, f, box2d.b2Vec2.s_t1),
            b[l]
          )),
          g > e ||
            ((a.pointCount = 1),
            (a.type = box2d.b2ManifoldType.e_faceA),
            a.localNormal.Copy(b[l]).SelfNormalize(),
            a.localPoint.Copy(f),
            a.points[0].localPoint.Copy(d.m_p),
            (a.points[0].id.key = 0))));
};
goog.exportSymbol(
  "box2d.b2CollidePolygonAndCircle",
  box2d.b2CollidePolygonAndCircle
);
box2d.b2CollidePolygonAndCircle.s_c = new box2d.b2Vec2();
box2d.b2CollidePolygonAndCircle.s_cLocal = new box2d.b2Vec2();
box2d.b2CollidePolygonAndCircle.s_faceCenter = new box2d.b2Vec2();
box2d.b2CollideEdge = {};
box2d.b2CollideEdgeAndCircle = function (a, b, c, d, e) {
  a.pointCount = 0;
  c = box2d.b2MulT_X_V2(
    c,
    box2d.b2Mul_X_V2(e, d.m_p, box2d.b2Vec2.s_t0),
    box2d.b2CollideEdgeAndCircle.s_Q
  );
  var f = b.m_vertex1,
    g = b.m_vertex2,
    h = box2d.b2Sub_V2_V2(g, f, box2d.b2CollideEdgeAndCircle.s_e),
    k = box2d.b2Dot_V2_V2(h, box2d.b2Sub_V2_V2(g, c, box2d.b2Vec2.s_t0)),
    l = box2d.b2Dot_V2_V2(h, box2d.b2Sub_V2_V2(c, f, box2d.b2Vec2.s_t0)),
    m = b.m_radius + d.m_radius;
  e = box2d.b2CollideEdgeAndCircle.s_id;
  e.cf.indexB = 0;
  e.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
  if (0 >= l) {
    var n = f,
      k = box2d.b2Sub_V2_V2(c, n, box2d.b2CollideEdgeAndCircle.s_d),
      k = box2d.b2Dot_V2_V2(k, k);
    if (!(k > m * m)) {
      if (
        b.m_hasVertex0 &&
        ((b = box2d.b2Sub_V2_V2(
          f,
          b.m_vertex0,
          box2d.b2CollideEdgeAndCircle.s_e1
        )),
        0 < box2d.b2Dot_V2_V2(b, box2d.b2Sub_V2_V2(f, c, box2d.b2Vec2.s_t0)))
      )
        return;
      e.cf.indexA = 0;
      e.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
      a.pointCount = 1;
      a.type = box2d.b2ManifoldType.e_circles;
      a.localNormal.SetZero();
      a.localPoint.Copy(n);
      a.points[0].id.Copy(e);
      a.points[0].localPoint.Copy(d.m_p);
    }
  } else if (0 >= k) {
    if (
      ((n = g),
      (k = box2d.b2Sub_V2_V2(c, n, box2d.b2CollideEdgeAndCircle.s_d)),
      (k = box2d.b2Dot_V2_V2(k, k)),
      !(k > m * m))
    ) {
      if (
        b.m_hasVertex3 &&
        ((f = box2d.b2Sub_V2_V2(
          b.m_vertex3,
          g,
          box2d.b2CollideEdgeAndCircle.s_e2
        )),
        0 < box2d.b2Dot_V2_V2(f, box2d.b2Sub_V2_V2(c, g, box2d.b2Vec2.s_t0)))
      )
        return;
      e.cf.indexA = 1;
      e.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
      a.pointCount = 1;
      a.type = box2d.b2ManifoldType.e_circles;
      a.localNormal.SetZero();
      a.localPoint.Copy(n);
      a.points[0].id.Copy(e);
      a.points[0].localPoint.Copy(d.m_p);
    }
  } else
    (b = box2d.b2Dot_V2_V2(h, h)),
      box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b),
      (n = box2d.b2CollideEdgeAndCircle.s_P),
      (n.x = (1 / b) * (k * f.x + l * g.x)),
      (n.y = (1 / b) * (k * f.y + l * g.y)),
      (k = box2d.b2Sub_V2_V2(c, n, box2d.b2CollideEdgeAndCircle.s_d)),
      (k = box2d.b2Dot_V2_V2(k, k)),
      k > m * m ||
        ((n = box2d.b2CollideEdgeAndCircle.s_n.Set(-h.y, h.x)),
        0 > box2d.b2Dot_V2_V2(n, box2d.b2Sub_V2_V2(c, f, box2d.b2Vec2.s_t0)) &&
          n.Set(-n.x, -n.y),
        n.Normalize(),
        (e.cf.indexA = 0),
        (e.cf.typeA = box2d.b2ContactFeatureType.e_face),
        (a.pointCount = 1),
        (a.type = box2d.b2ManifoldType.e_faceA),
        a.localNormal.Copy(n),
        a.localPoint.Copy(f),
        a.points[0].id.Copy(e),
        a.points[0].localPoint.Copy(d.m_p));
};
goog.exportSymbol("box2d.b2CollideEdgeAndCircle", box2d.b2CollideEdgeAndCircle);
box2d.b2CollideEdgeAndCircle.s_Q = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_e = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_d = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_e1 = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_e2 = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_P = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_n = new box2d.b2Vec2();
box2d.b2CollideEdgeAndCircle.s_id = new box2d.b2ContactID();
box2d.b2EPAxisType = {
  e_unknown: 0,
  e_edgeA: 1,
  e_edgeB: 2,
};
goog.exportSymbol("box2d.b2EPAxisType", box2d.b2EPAxisType);
goog.exportProperty(
  box2d.b2EPAxisType,
  "e_unknown",
  box2d.b2EPAxisType.e_unknown
);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeA", box2d.b2EPAxisType.e_edgeA);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeB", box2d.b2EPAxisType.e_edgeB);
box2d.b2EPAxis = function () {};
goog.exportSymbol("box2d.b2EPAxis", box2d.b2EPAxis);
box2d.b2EPAxis.prototype.type = box2d.b2EPAxisType.e_unknown;
goog.exportProperty(
  box2d.b2EPAxis.prototype,
  "type",
  box2d.b2EPAxis.prototype.type
);
box2d.b2EPAxis.prototype.index = 0;
goog.exportProperty(
  box2d.b2EPAxis.prototype,
  "index",
  box2d.b2EPAxis.prototype.index
);
box2d.b2EPAxis.prototype.separation = 0;
goog.exportProperty(
  box2d.b2EPAxis.prototype,
  "separation",
  box2d.b2EPAxis.prototype.separation
);
box2d.b2TempPolygon = function () {
  this.vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.count = 0;
};
goog.exportSymbol("box2d.b2TempPolygon", box2d.b2TempPolygon);
box2d.b2TempPolygon.prototype.vertices = null;
goog.exportProperty(
  box2d.b2TempPolygon.prototype,
  "vertices",
  box2d.b2TempPolygon.prototype.vertices
);
box2d.b2TempPolygon.prototype.normals = null;
goog.exportProperty(
  box2d.b2TempPolygon.prototype,
  "normals",
  box2d.b2TempPolygon.prototype.normals
);
box2d.b2TempPolygon.prototype.count = 0;
goog.exportProperty(
  box2d.b2TempPolygon.prototype,
  "count",
  box2d.b2TempPolygon.prototype.count
);
box2d.b2ReferenceFace = function () {
  this.i2 = this.i1 = 0;
  this.v1 = new box2d.b2Vec2();
  this.v2 = new box2d.b2Vec2();
  this.normal = new box2d.b2Vec2();
  this.sideNormal1 = new box2d.b2Vec2();
  this.sideOffset1 = 0;
  this.sideNormal2 = new box2d.b2Vec2();
  this.sideOffset2 = 0;
};
goog.exportSymbol("box2d.b2ReferenceFace", box2d.b2ReferenceFace);
box2d.b2ReferenceFace.prototype.i1 = 0;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "i1",
  box2d.b2ReferenceFace.prototype.i1
);
box2d.b2ReferenceFace.prototype.i2 = 0;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "i2",
  box2d.b2ReferenceFace.prototype.i2
);
box2d.b2ReferenceFace.prototype.v1 = null;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "v1",
  box2d.b2ReferenceFace.prototype.v1
);
box2d.b2ReferenceFace.prototype.v2 = null;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "v2",
  box2d.b2ReferenceFace.prototype.v2
);
box2d.b2ReferenceFace.prototype.normal = null;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "normal",
  box2d.b2ReferenceFace.prototype.normal
);
box2d.b2ReferenceFace.prototype.sideNormal1 = null;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "sideNormal1",
  box2d.b2ReferenceFace.prototype.sideNormal1
);
box2d.b2ReferenceFace.prototype.sideOffset1 = 0;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "sideOffset1",
  box2d.b2ReferenceFace.prototype.sideOffset1
);
box2d.b2ReferenceFace.prototype.sideNormal2 = null;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "sideNormal2",
  box2d.b2ReferenceFace.prototype.sideNormal2
);
box2d.b2ReferenceFace.prototype.sideOffset2 = 0;
goog.exportProperty(
  box2d.b2ReferenceFace.prototype,
  "sideOffset2",
  box2d.b2ReferenceFace.prototype.sideOffset2
);
box2d.b2EPColliderVertexType = {
  e_isolated: 0,
  e_concave: 1,
  e_convex: 2,
};
goog.exportSymbol("box2d.b2EPColliderVertexType", box2d.b2EPColliderVertexType);
goog.exportProperty(
  box2d.b2EPColliderVertexType,
  "e_isolated",
  box2d.b2EPColliderVertexType.e_isolated
);
goog.exportProperty(
  box2d.b2EPColliderVertexType,
  "e_concave",
  box2d.b2EPColliderVertexType.e_concave
);
goog.exportProperty(
  box2d.b2EPColliderVertexType,
  "e_convex",
  box2d.b2EPColliderVertexType.e_convex
);
box2d.b2EPCollider = function () {
  this.m_polygonB = new box2d.b2TempPolygon();
  this.m_xf = new box2d.b2Transform();
  this.m_centroidB = new box2d.b2Vec2();
  this.m_v0 = new box2d.b2Vec2();
  this.m_v1 = new box2d.b2Vec2();
  this.m_v2 = new box2d.b2Vec2();
  this.m_v3 = new box2d.b2Vec2();
  this.m_normal0 = new box2d.b2Vec2();
  this.m_normal1 = new box2d.b2Vec2();
  this.m_normal2 = new box2d.b2Vec2();
  this.m_normal = new box2d.b2Vec2();
  this.m_type2 = this.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
  this.m_lowerLimit = new box2d.b2Vec2();
  this.m_upperLimit = new box2d.b2Vec2();
  this.m_radius = 0;
  this.m_front = !1;
};
goog.exportSymbol("box2d.b2EPCollider", box2d.b2EPCollider);
box2d.b2EPCollider.prototype.m_polygonB = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_polygonB",
  box2d.b2EPCollider.prototype.m_polygonB
);
box2d.b2EPCollider.prototype.m_xf = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_xf",
  box2d.b2EPCollider.prototype.m_xf
);
box2d.b2EPCollider.prototype.m_centroidB = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_centroidB",
  box2d.b2EPCollider.prototype.m_centroidB
);
box2d.b2EPCollider.prototype.m_v0 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_v0",
  box2d.b2EPCollider.prototype.m_v0
);
box2d.b2EPCollider.prototype.m_v1 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_v1",
  box2d.b2EPCollider.prototype.m_v1
);
box2d.b2EPCollider.prototype.m_v2 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_v2",
  box2d.b2EPCollider.prototype.m_v2
);
box2d.b2EPCollider.prototype.m_v3 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_v3",
  box2d.b2EPCollider.prototype.m_v3
);
box2d.b2EPCollider.prototype.m_normal0 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_normal0",
  box2d.b2EPCollider.prototype.m_normal0
);
box2d.b2EPCollider.prototype.m_normal1 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_normal1",
  box2d.b2EPCollider.prototype.m_normal1
);
box2d.b2EPCollider.prototype.m_normal2 = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_normal2",
  box2d.b2EPCollider.prototype.m_normal2
);
box2d.b2EPCollider.prototype.m_normal = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_normal",
  box2d.b2EPCollider.prototype.m_normal
);
box2d.b2EPCollider.prototype.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_type1",
  box2d.b2EPCollider.prototype.m_type1
);
box2d.b2EPCollider.prototype.m_type2 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_type2",
  box2d.b2EPCollider.prototype.m_type2
);
box2d.b2EPCollider.prototype.m_lowerLimit = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_lowerLimit",
  box2d.b2EPCollider.prototype.m_lowerLimit
);
box2d.b2EPCollider.prototype.m_upperLimit = null;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_upperLimit",
  box2d.b2EPCollider.prototype.m_upperLimit
);
box2d.b2EPCollider.prototype.m_radius = 0;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_radius",
  box2d.b2EPCollider.prototype.m_radius
);
box2d.b2EPCollider.prototype.m_front = !1;
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "m_front",
  box2d.b2EPCollider.prototype.m_front
);
box2d.b2EPCollider.prototype.Collide = function (a, b, c, d, e) {
  box2d.b2MulT_X_X(c, e, this.m_xf);
  box2d.b2Mul_X_V2(this.m_xf, d.m_centroid, this.m_centroidB);
  this.m_v0.Copy(b.m_vertex0);
  this.m_v1.Copy(b.m_vertex1);
  this.m_v2.Copy(b.m_vertex2);
  this.m_v3.Copy(b.m_vertex3);
  c = b.m_hasVertex0;
  b = b.m_hasVertex3;
  e = box2d.b2Sub_V2_V2(this.m_v2, this.m_v1, box2d.b2EPCollider.s_edge1);
  e.Normalize();
  this.m_normal1.Set(e.y, -e.x);
  var f = box2d.b2Dot_V2_V2(
      this.m_normal1,
      box2d.b2Sub_V2_V2(this.m_centroidB, this.m_v1, box2d.b2Vec2.s_t0)
    ),
    g = 0,
    h = 0,
    k = !1,
    l = !1;
  c &&
    ((g = box2d.b2Sub_V2_V2(this.m_v1, this.m_v0, box2d.b2EPCollider.s_edge0)),
    g.Normalize(),
    this.m_normal0.Set(g.y, -g.x),
    (k = 0 <= box2d.b2Cross_V2_V2(g, e)),
    (g = box2d.b2Dot_V2_V2(
      this.m_normal0,
      box2d.b2Sub_V2_V2(this.m_centroidB, this.m_v0, box2d.b2Vec2.s_t0)
    )));
  b &&
    ((h = box2d.b2Sub_V2_V2(this.m_v3, this.m_v2, box2d.b2EPCollider.s_edge2)),
    h.Normalize(),
    this.m_normal2.Set(h.y, -h.x),
    (l = 0 < box2d.b2Cross_V2_V2(e, h)),
    (h = box2d.b2Dot_V2_V2(
      this.m_normal2,
      box2d.b2Sub_V2_V2(this.m_centroidB, this.m_v2, box2d.b2Vec2.s_t0)
    )));
  c && b
    ? k && l
      ? (this.m_front = 0 <= g || 0 <= f || 0 <= h)
        ? (this.m_normal.Copy(this.m_normal1),
          this.m_lowerLimit.Copy(this.m_normal0),
          this.m_upperLimit.Copy(this.m_normal2))
        : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(),
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg())
      : k
      ? (this.m_front = 0 <= g || (0 <= f && 0 <= h))
        ? (this.m_normal.Copy(this.m_normal1),
          this.m_lowerLimit.Copy(this.m_normal0),
          this.m_upperLimit.Copy(this.m_normal1))
        : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
          this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(),
          this.m_upperLimit.Copy(this.m_normal1).SelfNeg())
      : l
      ? (this.m_front = 0 <= h || (0 <= g && 0 <= f))
        ? (this.m_normal.Copy(this.m_normal1),
          this.m_lowerLimit.Copy(this.m_normal1),
          this.m_upperLimit.Copy(this.m_normal2))
        : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(),
          this.m_upperLimit.Copy(this.m_normal0).SelfNeg())
      : (this.m_front = 0 <= g && 0 <= f && 0 <= h)
      ? (this.m_normal.Copy(this.m_normal1),
        this.m_lowerLimit.Copy(this.m_normal1),
        this.m_upperLimit.Copy(this.m_normal1))
      : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
        this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(),
        this.m_upperLimit.Copy(this.m_normal0).SelfNeg())
    : c
    ? k
      ? ((this.m_front = 0 <= g || 0 <= f)
          ? (this.m_normal.Copy(this.m_normal1),
            this.m_lowerLimit.Copy(this.m_normal0))
          : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
            this.m_lowerLimit.Copy(this.m_normal1)),
        this.m_upperLimit.Copy(this.m_normal1).SelfNeg())
      : (this.m_front = 0 <= g && 0 <= f)
      ? (this.m_normal.Copy(this.m_normal1),
        this.m_lowerLimit.Copy(this.m_normal1),
        this.m_upperLimit.Copy(this.m_normal1).SelfNeg())
      : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
        this.m_lowerLimit.Copy(this.m_normal1),
        this.m_upperLimit.Copy(this.m_normal0).SelfNeg())
    : b
    ? l
      ? (this.m_front = 0 <= f || 0 <= h)
        ? (this.m_normal.Copy(this.m_normal1),
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(),
          this.m_upperLimit.Copy(this.m_normal2))
        : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
          this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(),
          this.m_upperLimit.Copy(this.m_normal1))
      : ((this.m_front = 0 <= f && 0 <= h)
          ? (this.m_normal.Copy(this.m_normal1),
            this.m_lowerLimit.Copy(this.m_normal1).SelfNeg())
          : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
            this.m_lowerLimit.Copy(this.m_normal2).SelfNeg()),
        this.m_upperLimit.Copy(this.m_normal1))
    : (this.m_front = 0 <= f)
    ? (this.m_normal.Copy(this.m_normal1),
      this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(),
      this.m_upperLimit.Copy(this.m_normal1).SelfNeg())
    : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
      this.m_lowerLimit.Copy(this.m_normal1),
      this.m_upperLimit.Copy(this.m_normal1));
  this.m_polygonB.count = d.m_count;
  f = 0;
  for (g = d.m_count; f < g; ++f)
    box2d.b2Mul_X_V2(this.m_xf, d.m_vertices[f], this.m_polygonB.vertices[f]),
      box2d.b2Mul_R_V2(this.m_xf.q, d.m_normals[f], this.m_polygonB.normals[f]);
  this.m_radius = 2 * box2d.b2_polygonRadius;
  a.pointCount = 0;
  c = this.ComputeEdgeSeparation(box2d.b2EPCollider.s_edgeAxis);
  if (
    !(
      c.type === box2d.b2EPAxisType.e_unknown ||
      c.separation > this.m_radius ||
      ((b = this.ComputePolygonSeparation(box2d.b2EPCollider.s_polygonAxis)),
      b.type !== box2d.b2EPAxisType.e_unknown && b.separation > this.m_radius)
    )
  ) {
    c =
      b.type === box2d.b2EPAxisType.e_unknown
        ? c
        : b.separation > 0.98 * c.separation + 0.001
        ? b
        : c;
    e = box2d.b2EPCollider.s_ie;
    b = box2d.b2EPCollider.s_rf;
    if (c.type === box2d.b2EPAxisType.e_edgeA) {
      a.type = box2d.b2ManifoldType.e_faceA;
      h = 0;
      k = box2d.b2Dot_V2_V2(this.m_normal, this.m_polygonB.normals[0]);
      f = 1;
      for (g = this.m_polygonB.count; f < g; ++f)
        (l = box2d.b2Dot_V2_V2(this.m_normal, this.m_polygonB.normals[f])),
          l < k && ((k = l), (h = f));
      g = h;
      f = (g + 1) % this.m_polygonB.count;
      h = e[0];
      h.v.Copy(this.m_polygonB.vertices[g]);
      h.id.cf.indexA = 0;
      h.id.cf.indexB = g;
      h.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
      h.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
      g = e[1];
      g.v.Copy(this.m_polygonB.vertices[f]);
      g.id.cf.indexA = 0;
      g.id.cf.indexB = f;
      g.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
      g.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
      this.m_front
        ? ((b.i1 = 0),
          (b.i2 = 1),
          b.v1.Copy(this.m_v1),
          b.v2.Copy(this.m_v2),
          b.normal.Copy(this.m_normal1))
        : ((b.i1 = 1),
          (b.i2 = 0),
          b.v1.Copy(this.m_v2),
          b.v2.Copy(this.m_v1),
          b.normal.Copy(this.m_normal1).SelfNeg());
    } else
      (a.type = box2d.b2ManifoldType.e_faceB),
        (h = e[0]),
        h.v.Copy(this.m_v1),
        (h.id.cf.indexA = 0),
        (h.id.cf.indexB = c.index),
        (h.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex),
        (h.id.cf.typeB = box2d.b2ContactFeatureType.e_face),
        (g = e[1]),
        g.v.Copy(this.m_v2),
        (g.id.cf.indexA = 0),
        (g.id.cf.indexB = c.index),
        (g.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex),
        (g.id.cf.typeB = box2d.b2ContactFeatureType.e_face),
        (b.i1 = c.index),
        (b.i2 = (b.i1 + 1) % this.m_polygonB.count),
        b.v1.Copy(this.m_polygonB.vertices[b.i1]),
        b.v2.Copy(this.m_polygonB.vertices[b.i2]),
        b.normal.Copy(this.m_polygonB.normals[b.i1]);
    b.sideNormal1.Set(b.normal.y, -b.normal.x);
    b.sideNormal2.Copy(b.sideNormal1).SelfNeg();
    b.sideOffset1 = box2d.b2Dot_V2_V2(b.sideNormal1, b.v1);
    b.sideOffset2 = box2d.b2Dot_V2_V2(b.sideNormal2, b.v2);
    f = box2d.b2EPCollider.s_clipPoints1;
    h = box2d.b2EPCollider.s_clipPoints2;
    g = 0;
    g = box2d.b2ClipSegmentToLine(f, e, b.sideNormal1, b.sideOffset1, b.i1);
    if (
      !(
        g < box2d.b2_maxManifoldPoints ||
        ((g = box2d.b2ClipSegmentToLine(
          h,
          f,
          b.sideNormal2,
          b.sideOffset2,
          b.i2
        )),
        g < box2d.b2_maxManifoldPoints)
      )
    ) {
      c.type === box2d.b2EPAxisType.e_edgeA
        ? (a.localNormal.Copy(b.normal), a.localPoint.Copy(b.v1))
        : (a.localNormal.Copy(d.m_normals[b.i1]),
          a.localPoint.Copy(d.m_vertices[b.i1]));
      f = d = 0;
      for (g = box2d.b2_maxManifoldPoints; f < g; ++f)
        box2d.b2Dot_V2_V2(
          b.normal,
          box2d.b2Sub_V2_V2(h[f].v, b.v1, box2d.b2Vec2.s_t0)
        ) <= this.m_radius &&
          ((e = a.points[d]),
          c.type === box2d.b2EPAxisType.e_edgeA
            ? (box2d.b2MulT_X_V2(this.m_xf, h[f].v, e.localPoint),
              (e.id = h[f].id))
            : (e.localPoint.Copy(h[f].v),
              (e.id.cf.typeA = h[f].id.cf.typeB),
              (e.id.cf.typeB = h[f].id.cf.typeA),
              (e.id.cf.indexA = h[f].id.cf.indexB),
              (e.id.cf.indexB = h[f].id.cf.indexA)),
          ++d);
      a.pointCount = d;
    }
  }
};
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "Collide",
  box2d.b2EPCollider.prototype.Collide
);
box2d.b2EPCollider.s_edge1 = new box2d.b2Vec2();
box2d.b2EPCollider.s_edge0 = new box2d.b2Vec2();
box2d.b2EPCollider.s_edge2 = new box2d.b2Vec2();
box2d.b2EPCollider.s_ie = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_rf = new box2d.b2ReferenceFace();
box2d.b2EPCollider.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_edgeAxis = new box2d.b2EPAxis();
box2d.b2EPCollider.s_polygonAxis = new box2d.b2EPAxis();
box2d.b2EPCollider.prototype.ComputeEdgeSeparation = function (a) {
  a.type = box2d.b2EPAxisType.e_edgeA;
  a.index = this.m_front ? 0 : 1;
  a.separation = box2d.b2_maxFloat;
  for (var b = 0, c = this.m_polygonB.count; b < c; ++b) {
    var d = box2d.b2Dot_V2_V2(
      this.m_normal,
      box2d.b2Sub_V2_V2(
        this.m_polygonB.vertices[b],
        this.m_v1,
        box2d.b2Vec2.s_t0
      )
    );
    d < a.separation && (a.separation = d);
  }
  return a;
};
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "ComputeEdgeSeparation",
  box2d.b2EPCollider.prototype.ComputeEdgeSeparation
);
box2d.b2EPCollider.prototype.ComputePolygonSeparation = function (a) {
  a.type = box2d.b2EPAxisType.e_unknown;
  a.index = -1;
  a.separation = -box2d.b2_maxFloat;
  for (
    var b = box2d.b2EPCollider.s_perp.Set(-this.m_normal.y, this.m_normal.x),
      c = 0,
      d = this.m_polygonB.count;
    c < d;
    ++c
  ) {
    var e = box2d.b2EPCollider.s_n.Copy(this.m_polygonB.normals[c]).SelfNeg(),
      f = box2d.b2Dot_V2_V2(
        e,
        box2d.b2Sub_V2_V2(
          this.m_polygonB.vertices[c],
          this.m_v1,
          box2d.b2Vec2.s_t0
        )
      ),
      g = box2d.b2Dot_V2_V2(
        e,
        box2d.b2Sub_V2_V2(
          this.m_polygonB.vertices[c],
          this.m_v2,
          box2d.b2Vec2.s_t0
        )
      ),
      f = box2d.b2Min(f, g);
    if (f > this.m_radius) {
      a.type = box2d.b2EPAxisType.e_edgeB;
      a.index = c;
      a.separation = f;
      break;
    }
    if (0 <= box2d.b2Dot_V2_V2(e, b)) {
      if (
        box2d.b2Dot_V2_V2(
          box2d.b2Sub_V2_V2(e, this.m_upperLimit, box2d.b2Vec2.s_t0),
          this.m_normal
        ) < -box2d.b2_angularSlop
      )
        continue;
    } else if (
      box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(e, this.m_lowerLimit, box2d.b2Vec2.s_t0),
        this.m_normal
      ) < -box2d.b2_angularSlop
    )
      continue;
    f > a.separation &&
      ((a.type = box2d.b2EPAxisType.e_edgeB),
      (a.index = c),
      (a.separation = f));
  }
  return a;
};
goog.exportProperty(
  box2d.b2EPCollider.prototype,
  "ComputePolygonSeparation",
  box2d.b2EPCollider.prototype.ComputePolygonSeparation
);
box2d.b2EPCollider.s_n = new box2d.b2Vec2();
box2d.b2EPCollider.s_perp = new box2d.b2Vec2();
box2d.b2CollideEdgeAndPolygon = function (a, b, c, d, e) {
  box2d.b2CollideEdgeAndPolygon.s_collider.Collide(a, b, c, d, e);
};
goog.exportSymbol(
  "box2d.b2CollideEdgeAndPolygon",
  box2d.b2CollideEdgeAndPolygon
);
box2d.b2CollideEdgeAndPolygon.s_collider = new box2d.b2EPCollider();
box2d.b2CollidePolygon = {};
box2d.b2FindMaxSeparation = function (a, b, c, d, e) {
  var f = b.m_count,
    g = d.m_count,
    h = b.m_normals;
  b = b.m_vertices;
  d = d.m_vertices;
  c = box2d.b2MulT_X_X(e, c, box2d.b2FindMaxSeparation.s_xf);
  e = 0;
  for (var k = -box2d.b2_maxFloat, l = 0; l < f; ++l) {
    for (
      var m = box2d.b2Mul_R_V2(c.q, h[l], box2d.b2FindMaxSeparation.s_n),
        n = box2d.b2Mul_X_V2(c, b[l], box2d.b2FindMaxSeparation.s_v1),
        p = box2d.b2_maxFloat,
        q = 0;
      q < g;
      ++q
    ) {
      var r = box2d.b2Dot_V2_V2(
        m,
        box2d.b2Sub_V2_V2(d[q], n, box2d.b2Vec2.s_t0)
      );
      r < p && (p = r);
    }
    p > k && ((k = p), (e = l));
  }
  a[0] = e;
  return k;
};
goog.exportSymbol("box2d.b2FindMaxSeparation", box2d.b2FindMaxSeparation);
box2d.b2FindMaxSeparation.s_xf = new box2d.b2Transform();
box2d.b2FindMaxSeparation.s_n = new box2d.b2Vec2();
box2d.b2FindMaxSeparation.s_v1 = new box2d.b2Vec2();
box2d.b2FindIncidentEdge = function (a, b, c, d, e, f) {
  var g = b.m_count,
    h = b.m_normals,
    k = e.m_count;
  b = e.m_vertices;
  e = e.m_normals;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= d && d < g);
  c = box2d.b2MulT_R_V2(
    f.q,
    box2d.b2Mul_R_V2(c.q, h[d], box2d.b2Vec2.s_t0),
    box2d.b2FindIncidentEdge.s_normal1
  );
  for (var g = 0, h = box2d.b2_maxFloat, l = 0; l < k; ++l) {
    var m = box2d.b2Dot_V2_V2(c, e[l]);
    m < h && ((h = m), (g = l));
  }
  e = g;
  k = (e + 1) % k;
  c = a[0];
  box2d.b2Mul_X_V2(f, b[e], c.v);
  c = c.id.cf;
  c.indexA = d;
  c.indexB = e;
  c.typeA = box2d.b2ContactFeatureType.e_face;
  c.typeB = box2d.b2ContactFeatureType.e_vertex;
  a = a[1];
  box2d.b2Mul_X_V2(f, b[k], a.v);
  f = a.id.cf;
  f.indexA = d;
  f.indexB = k;
  f.typeA = box2d.b2ContactFeatureType.e_face;
  f.typeB = box2d.b2ContactFeatureType.e_vertex;
};
goog.exportSymbol("box2d.b2FindIncidentEdge", box2d.b2FindIncidentEdge);
box2d.b2FindIncidentEdge.s_normal1 = new box2d.b2Vec2();
box2d.b2CollidePolygons = function (a, b, c, d, e) {
  a.pointCount = 0;
  var f = b.m_radius + d.m_radius,
    g = box2d.b2CollidePolygons.s_edgeA;
  g[0] = 0;
  var h = box2d.b2FindMaxSeparation(g, b, c, d, e);
  if (!(h > f)) {
    var k = box2d.b2CollidePolygons.s_edgeB;
    k[0] = 0;
    var l = box2d.b2FindMaxSeparation(k, d, e, b, c);
    if (!(l > f)) {
      var m = 0,
        n = 0;
      l > 0.98 * h + 0.001
        ? ((h = d),
          (d = b),
          (b = e),
          (m = k[0]),
          (a.type = box2d.b2ManifoldType.e_faceB),
          (n = 1))
        : ((h = b),
          (b = c),
          (c = e),
          (m = g[0]),
          (a.type = box2d.b2ManifoldType.e_faceA),
          (n = 0));
      g = box2d.b2CollidePolygons.s_incidentEdge;
      box2d.b2FindIncidentEdge(g, h, b, m, d, c);
      e = h.m_vertices;
      var k = m,
        h = (m + 1) % h.m_count,
        p = e[k],
        q = e[h],
        m = box2d.b2Sub_V2_V2(q, p, box2d.b2CollidePolygons.s_localTangent);
      m.Normalize();
      e = box2d.b2Cross_V2_S(m, 1, box2d.b2CollidePolygons.s_localNormal);
      d = box2d.b2Mid_V2_V2(p, q, box2d.b2CollidePolygons.s_planePoint);
      var l = box2d.b2Mul_R_V2(b.q, m, box2d.b2CollidePolygons.s_tangent),
        m = box2d.b2Cross_V2_S(l, 1, box2d.b2CollidePolygons.s_normal),
        p = box2d.b2Mul_X_V2(b, p, box2d.b2CollidePolygons.s_v11),
        r = box2d.b2Mul_X_V2(b, q, box2d.b2CollidePolygons.s_v12);
      b = box2d.b2Dot_V2_V2(m, p);
      var q = -box2d.b2Dot_V2_V2(l, p) + f,
        r = box2d.b2Dot_V2_V2(l, r) + f,
        u = box2d.b2CollidePolygons.s_clipPoints1,
        p = box2d.b2CollidePolygons.s_clipPoints2,
        t = box2d.b2CollidePolygons.s_ntangent.Copy(l).SelfNeg(),
        g = box2d.b2ClipSegmentToLine(u, g, t, q, k);
      if (!(2 > g || ((g = box2d.b2ClipSegmentToLine(p, u, l, r, h)), 2 > g))) {
        a.localNormal.Copy(e);
        a.localPoint.Copy(d);
        for (k = g = 0; k < box2d.b2_maxManifoldPoints; ++k)
          (e = p[k]),
            box2d.b2Dot_V2_V2(m, e.v) - b <= f &&
              ((h = a.points[g]),
              box2d.b2MulT_X_V2(c, e.v, h.localPoint),
              h.id.Copy(e.id),
              n &&
                ((e = h.id.cf),
                (h.id.cf.indexA = e.indexB),
                (h.id.cf.indexB = e.indexA),
                (h.id.cf.typeA = e.typeB),
                (h.id.cf.typeB = e.typeA)),
              ++g);
        a.pointCount = g;
      }
    }
  }
};
goog.exportSymbol("box2d.b2CollidePolygons", box2d.b2CollidePolygons);
box2d.b2CollidePolygons.s_incidentEdge = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_edgeA = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_edgeB = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_localTangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_localNormal = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_planePoint = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_normal = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_tangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_ntangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_v11 = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_v12 = new box2d.b2Vec2();
box2d.b2TreeNode = function (a) {
  this.m_id = a || 0;
  this.aabb = new box2d.b2AABB();
};
goog.exportSymbol("box2d.b2TreeNode", box2d.b2TreeNode);
box2d.b2TreeNode.prototype.m_id = 0;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "m_id",
  box2d.b2TreeNode.prototype.m_id
);
box2d.b2TreeNode.prototype.aabb = null;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "aabb",
  box2d.b2TreeNode.prototype.aabb
);
box2d.b2TreeNode.prototype.userData = null;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "userData",
  box2d.b2TreeNode.prototype.userData
);
box2d.b2TreeNode.prototype.parent = null;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "parent",
  box2d.b2TreeNode.prototype.parent
);
box2d.b2TreeNode.prototype.child1 = null;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "child1",
  box2d.b2TreeNode.prototype.child1
);
box2d.b2TreeNode.prototype.child2 = null;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "child2",
  box2d.b2TreeNode.prototype.child2
);
box2d.b2TreeNode.prototype.height = 0;
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "height",
  box2d.b2TreeNode.prototype.height
);
box2d.b2TreeNode.prototype.IsLeaf = function () {
  return null === this.child1;
};
goog.exportProperty(
  box2d.b2TreeNode.prototype,
  "IsLeaf",
  box2d.b2TreeNode.prototype.IsLeaf
);
box2d.b2DynamicTree = function () {};
goog.exportSymbol("box2d.b2DynamicTree", box2d.b2DynamicTree);
box2d.b2DynamicTree.prototype.m_root = null;
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "m_root",
  box2d.b2DynamicTree.prototype.m_root
);
box2d.b2DynamicTree.prototype.m_freeList = null;
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "m_freeList",
  box2d.b2DynamicTree.prototype.m_freeList
);
box2d.b2DynamicTree.prototype.m_path = 0;
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "m_path",
  box2d.b2DynamicTree.prototype.m_path
);
box2d.b2DynamicTree.prototype.m_insertionCount = 0;
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "m_insertionCount",
  box2d.b2DynamicTree.prototype.m_insertionCount
);
box2d.b2DynamicTree.s_stack = new box2d.b2GrowableStack(256);
box2d.b2DynamicTree.s_r = new box2d.b2Vec2();
box2d.b2DynamicTree.s_v = new box2d.b2Vec2();
box2d.b2DynamicTree.s_abs_v = new box2d.b2Vec2();
box2d.b2DynamicTree.s_segmentAABB = new box2d.b2AABB();
box2d.b2DynamicTree.s_subInput = new box2d.b2RayCastInput();
box2d.b2DynamicTree.s_combinedAABB = new box2d.b2AABB();
box2d.b2DynamicTree.s_aabb = new box2d.b2AABB();
box2d.b2DynamicTree.prototype.GetUserData = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
  return a.userData;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "GetUserData",
  box2d.b2DynamicTree.prototype.GetUserData
);
box2d.b2DynamicTree.prototype.GetFatAABB = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
  return a.aabb;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "GetFatAABB",
  box2d.b2DynamicTree.prototype.GetFatAABB
);
box2d.b2DynamicTree.prototype.Query = function (a, b) {
  if (null !== this.m_root) {
    var c = box2d.b2DynamicTree.s_stack.Reset();
    for (c.Push(this.m_root); 0 < c.GetCount(); ) {
      var d = c.Pop();
      if (null !== d && d.aabb.TestOverlap(b))
        if (d.IsLeaf()) {
          if (!a(d)) break;
        } else c.Push(d.child1), c.Push(d.child2);
    }
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "Query",
  box2d.b2DynamicTree.prototype.Query
);
box2d.b2DynamicTree.prototype.RayCast = function (a, b) {
  if (null !== this.m_root) {
    var c = b.p1,
      d = b.p2,
      e = box2d.b2Sub_V2_V2(d, c, box2d.b2DynamicTree.s_r);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < e.LengthSquared());
    e.Normalize();
    var e = box2d.b2Cross_S_V2(1, e, box2d.b2DynamicTree.s_v),
      f = box2d.b2Abs_V2(e, box2d.b2DynamicTree.s_abs_v),
      g = b.maxFraction,
      h = box2d.b2DynamicTree.s_segmentAABB,
      k = c.x + g * (d.x - c.x),
      l = c.y + g * (d.y - c.y);
    h.lowerBound.x = box2d.b2Min(c.x, k);
    h.lowerBound.y = box2d.b2Min(c.y, l);
    h.upperBound.x = box2d.b2Max(c.x, k);
    h.upperBound.y = box2d.b2Max(c.y, l);
    var m = box2d.b2DynamicTree.s_stack.Reset();
    for (m.Push(this.m_root); 0 < m.GetCount(); )
      if (((k = m.Pop()), null !== k && box2d.b2TestOverlap_AABB(k.aabb, h))) {
        var l = k.aabb.GetCenter(),
          n = k.aabb.GetExtents();
        if (
          !(
            0 <
            box2d.b2Abs(
              box2d.b2Dot_V2_V2(e, box2d.b2Sub_V2_V2(c, l, box2d.b2Vec2.s_t0))
            ) -
              box2d.b2Dot_V2_V2(f, n)
          )
        )
          if (k.IsLeaf()) {
            l = box2d.b2DynamicTree.s_subInput;
            l.p1.Copy(b.p1);
            l.p2.Copy(b.p2);
            l.maxFraction = g;
            k = a(l, k);
            if (0 === k) break;
            0 < k &&
              ((g = k),
              (k = c.x + g * (d.x - c.x)),
              (l = c.y + g * (d.y - c.y)),
              (h.lowerBound.x = box2d.b2Min(c.x, k)),
              (h.lowerBound.y = box2d.b2Min(c.y, l)),
              (h.upperBound.x = box2d.b2Max(c.x, k)),
              (h.upperBound.y = box2d.b2Max(c.y, l)));
          } else m.Push(k.child1), m.Push(k.child2);
      }
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "RayCast",
  box2d.b2DynamicTree.prototype.RayCast
);
box2d.b2DynamicTree.prototype.AllocateNode = function () {
  if (this.m_freeList) {
    var a = this.m_freeList;
    this.m_freeList = a.parent;
    a.parent = null;
    a.child1 = null;
    a.child2 = null;
    a.height = 0;
    a.userData = null;
    return a;
  }
  return new box2d.b2TreeNode(box2d.b2DynamicTree.prototype.s_node_id++);
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "AllocateNode",
  box2d.b2DynamicTree.prototype.AllocateNode
);
box2d.b2DynamicTree.prototype.s_node_id = 0;
box2d.b2DynamicTree.prototype.FreeNode = function (a) {
  a.parent = this.m_freeList;
  a.height = -1;
  this.m_freeList = a;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "FreeNode",
  box2d.b2DynamicTree.prototype.FreeNode
);
box2d.b2DynamicTree.prototype.CreateProxy = function (a, b) {
  var c = this.AllocateNode(),
    d = box2d.b2_aabbExtension,
    e = box2d.b2_aabbExtension;
  c.aabb.lowerBound.x = a.lowerBound.x - d;
  c.aabb.lowerBound.y = a.lowerBound.y - e;
  c.aabb.upperBound.x = a.upperBound.x + d;
  c.aabb.upperBound.y = a.upperBound.y + e;
  c.userData = b;
  c.height = 0;
  this.InsertLeaf(c);
  return c;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "CreateProxy",
  box2d.b2DynamicTree.prototype.CreateProxy
);
box2d.b2DynamicTree.prototype.DestroyProxy = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
  this.RemoveLeaf(a);
  this.FreeNode(a);
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "DestroyProxy",
  box2d.b2DynamicTree.prototype.DestroyProxy
);
box2d.b2DynamicTree.prototype.MoveProxy = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
  if (a.aabb.Contains(b)) return !1;
  this.RemoveLeaf(a);
  var d =
    box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.x ? c.x : -c.x);
  c = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.y ? c.y : -c.y);
  a.aabb.lowerBound.x = b.lowerBound.x - d;
  a.aabb.lowerBound.y = b.lowerBound.y - c;
  a.aabb.upperBound.x = b.upperBound.x + d;
  a.aabb.upperBound.y = b.upperBound.y + c;
  this.InsertLeaf(a);
  return !0;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "MoveProxy",
  box2d.b2DynamicTree.prototype.MoveProxy
);
box2d.b2DynamicTree.prototype.InsertLeaf = function (a) {
  ++this.m_insertionCount;
  if (null === this.m_root) (this.m_root = a), (this.m_root.parent = null);
  else {
    var b = a.aabb;
    b.GetCenter();
    for (var c = this.m_root, d, e; !c.IsLeaf(); ) {
      d = c.child1;
      e = c.child2;
      var f = c.aabb.GetPerimeter(),
        g = box2d.b2DynamicTree.s_combinedAABB;
      g.Combine2(c.aabb, b);
      var h = g.GetPerimeter(),
        g = 2 * h,
        h = 2 * (h - f),
        k = box2d.b2DynamicTree.s_aabb,
        l,
        m;
      d.IsLeaf()
        ? (k.Combine2(b, d.aabb), (f = k.GetPerimeter() + h))
        : (k.Combine2(b, d.aabb),
          (l = d.aabb.GetPerimeter()),
          (m = k.GetPerimeter()),
          (f = m - l + h));
      e.IsLeaf()
        ? (k.Combine2(b, e.aabb), (h = k.GetPerimeter() + h))
        : (k.Combine2(b, e.aabb),
          (l = e.aabb.GetPerimeter()),
          (m = k.GetPerimeter()),
          (h = m - l + h));
      if (g < f && g < h) break;
      c = f < h ? d : e;
    }
    d = c.parent;
    e = this.AllocateNode();
    e.parent = d;
    e.userData = null;
    e.aabb.Combine2(b, c.aabb);
    e.height = c.height + 1;
    d
      ? (d.child1 === c ? (d.child1 = e) : (d.child2 = e),
        (e.child1 = c),
        (e.child2 = a),
        (c.parent = e),
        (a.parent = e))
      : ((e.child1 = c),
        (e.child2 = a),
        (c.parent = e),
        (this.m_root = a.parent = e));
    for (c = a.parent; null !== c; )
      (c = this.Balance(c)),
        (d = c.child1),
        (e = c.child2),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== d),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== e),
        (c.height = 1 + box2d.b2Max(d.height, e.height)),
        c.aabb.Combine2(d.aabb, e.aabb),
        (c = c.parent);
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "InsertLeaf",
  box2d.b2DynamicTree.prototype.InsertLeaf
);
box2d.b2DynamicTree.prototype.RemoveLeaf = function (a) {
  if (a === this.m_root) this.m_root = null;
  else {
    var b = a.parent,
      c = b.parent;
    a = b.child1 === a ? b.child2 : b.child1;
    if (c)
      for (
        c.child1 === b ? (c.child1 = a) : (c.child2 = a),
          a.parent = c,
          this.FreeNode(b),
          b = c;
        b;

      )
        (b = this.Balance(b)),
          (c = b.child1),
          (a = b.child2),
          b.aabb.Combine2(c.aabb, a.aabb),
          (b.height = 1 + box2d.b2Max(c.height, a.height)),
          (b = b.parent);
    else (this.m_root = a), (a.parent = null), this.FreeNode(b);
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "RemoveLeaf",
  box2d.b2DynamicTree.prototype.RemoveLeaf
);
box2d.b2DynamicTree.prototype.Balance = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
  if (a.IsLeaf() || 2 > a.height) return a;
  var b = a.child1,
    c = a.child2,
    d = c.height - b.height;
  if (1 < d) {
    var d = c.child1,
      e = c.child2;
    c.child1 = a;
    c.parent = a.parent;
    a.parent = c;
    null !== c.parent
      ? c.parent.child1 === a
        ? (c.parent.child1 = c)
        : (box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent.child2 === a),
          (c.parent.child2 = c))
      : (this.m_root = c);
    d.height > e.height
      ? ((c.child2 = d),
        (a.child2 = e),
        (e.parent = a),
        a.aabb.Combine2(b.aabb, e.aabb),
        c.aabb.Combine2(a.aabb, d.aabb),
        (a.height = 1 + box2d.b2Max(b.height, e.height)),
        (c.height = 1 + box2d.b2Max(a.height, d.height)))
      : ((c.child2 = e),
        (a.child2 = d),
        (d.parent = a),
        a.aabb.Combine2(b.aabb, d.aabb),
        c.aabb.Combine2(a.aabb, e.aabb),
        (a.height = 1 + box2d.b2Max(b.height, d.height)),
        (c.height = 1 + box2d.b2Max(a.height, e.height)));
    return c;
  }
  return -1 > d
    ? ((d = b.child1),
      (e = b.child2),
      (b.child1 = a),
      (b.parent = a.parent),
      (a.parent = b),
      null !== b.parent
        ? b.parent.child1 === a
          ? (b.parent.child1 = b)
          : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent.child2 === a),
            (b.parent.child2 = b))
        : (this.m_root = b),
      d.height > e.height
        ? ((b.child2 = d),
          (a.child1 = e),
          (e.parent = a),
          a.aabb.Combine2(c.aabb, e.aabb),
          b.aabb.Combine2(a.aabb, d.aabb),
          (a.height = 1 + box2d.b2Max(c.height, e.height)),
          (b.height = 1 + box2d.b2Max(a.height, d.height)))
        : ((b.child2 = e),
          (a.child1 = d),
          (d.parent = a),
          a.aabb.Combine2(c.aabb, d.aabb),
          b.aabb.Combine2(a.aabb, e.aabb),
          (a.height = 1 + box2d.b2Max(c.height, d.height)),
          (b.height = 1 + box2d.b2Max(a.height, e.height))),
      b)
    : a;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "Balance",
  box2d.b2DynamicTree.prototype.Balance
);
box2d.b2DynamicTree.prototype.GetHeight = function () {
  return null === this.m_root ? 0 : this.m_root.height;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "GetHeight",
  box2d.b2DynamicTree.prototype.GetHeight
);
box2d.b2DynamicTree.prototype.GetAreaRatio = function () {
  if (null === this.m_root) return 0;
  var a = this.m_root.aabb.GetPerimeter(),
    b = function (a) {
      if (null === a || a.IsLeaf()) return 0;
      var d = a.aabb.GetPerimeter(),
        d = d + b(a.child1);
      return (d += b(a.child2));
    };
  return b(this.m_root) / a;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "GetAreaRatio",
  box2d.b2DynamicTree.prototype.GetAreaRatio
);
box2d.b2DynamicTree.prototype.ComputeHeightNode = function (a) {
  if (a.IsLeaf()) return 0;
  var b = this.ComputeHeightNode(a.child1);
  a = this.ComputeHeightNode(a.child2);
  return 1 + box2d.b2Max(b, a);
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "ComputeHeightNode",
  box2d.b2DynamicTree.prototype.ComputeHeightNode
);
box2d.b2DynamicTree.prototype.ComputeHeight = function () {
  return this.ComputeHeightNode(this.m_root);
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "ComputeHeight",
  box2d.b2DynamicTree.prototype.ComputeHeight
);
box2d.b2DynamicTree.prototype.ValidateStructure = function (a) {
  if (null !== a) {
    a === this.m_root &&
      box2d.ENABLE_ASSERTS &&
      box2d.b2Assert(null === a.parent);
    var b = a.child1,
      c = a.child2;
    a.IsLeaf()
      ? (box2d.ENABLE_ASSERTS && box2d.b2Assert(null === b),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(null === c),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === a.height))
      : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent === a),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent === a),
        this.ValidateStructure(b),
        this.ValidateStructure(c));
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "ValidateStructure",
  box2d.b2DynamicTree.prototype.ValidateStructure
);
box2d.b2DynamicTree.prototype.ValidateMetrics = function (a) {
  if (null !== a) {
    var b = a.child1,
      c = a.child2;
    if (a.IsLeaf())
      box2d.ENABLE_ASSERTS && box2d.b2Assert(null === b),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(null === c),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === a.height);
    else {
      var d;
      d = 1 + box2d.b2Max(b.height, c.height);
      box2d.ENABLE_ASSERTS && box2d.b2Assert(a.height === d);
      d = box2d.b2DynamicTree.s_aabb;
      d.Combine2(b.aabb, c.aabb);
      box2d.ENABLE_ASSERTS &&
        box2d.b2Assert(d.lowerBound === a.aabb.lowerBound);
      box2d.ENABLE_ASSERTS &&
        box2d.b2Assert(d.upperBound === a.aabb.upperBound);
      this.ValidateMetrics(b);
      this.ValidateMetrics(c);
    }
  }
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "ValidateMetrics",
  box2d.b2DynamicTree.prototype.ValidateMetrics
);
box2d.b2DynamicTree.prototype.Validate = function () {
  this.ValidateStructure(this.m_root);
  this.ValidateMetrics(this.m_root);
  for (var a = 0, b = this.m_freeList; null !== b; ) (b = b.parent), ++a;
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(this.GetHeight() === this.ComputeHeight());
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "Validate",
  box2d.b2DynamicTree.prototype.Validate
);
box2d.b2DynamicTree.prototype.GetMaxBalance = function () {
  var a;
  a = this.m_root;
  null === a
    ? (a = 0)
    : 1 >= a.height
    ? (a = 0)
    : (box2d.ENABLE_ASSERTS && box2d.b2Assert(!a.IsLeaf()),
      (a = box2d.b2Abs(a.child2.height - a.child1.height)),
      (a = box2d.b2Max(0, a)));
  return a;
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "GetMaxBalance",
  box2d.b2DynamicTree.prototype.GetMaxBalance
);
box2d.b2DynamicTree.prototype.RebuildBottomUp = function () {
  this.Validate();
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "RebuildBottomUp",
  box2d.b2DynamicTree.prototype.RebuildBottomUp
);
box2d.b2DynamicTree.prototype.ShiftOrigin = function (a) {
  var b = function (a, d) {
    if (null !== a && !(1 >= a.height)) {
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!a.IsLeaf());
      var e = a.child2;
      b(a.child1, d);
      b(e, d);
      a.aabb.lowerBound.SelfSub(d);
      a.aabb.upperBound.SelfSub(d);
    }
  };
  b(this.m_root, a);
};
goog.exportProperty(
  box2d.b2DynamicTree.prototype,
  "ShiftOrigin",
  box2d.b2DynamicTree.prototype.ShiftOrigin
);
box2d.b2Pair = function () {};
goog.exportSymbol("box2d.b2Pair", box2d.b2Pair);
box2d.b2Pair.prototype.proxyA = null;
goog.exportProperty(
  box2d.b2Pair.prototype,
  "proxyA",
  box2d.b2Pair.prototype.proxyA
);
box2d.b2Pair.prototype.proxyB = null;
goog.exportProperty(
  box2d.b2Pair.prototype,
  "proxyB",
  box2d.b2Pair.prototype.proxyB
);
box2d.b2BroadPhase = function () {
  this.m_tree = new box2d.b2DynamicTree();
  this.m_moveBuffer = [];
  this.m_pairBuffer = [];
};
goog.exportSymbol("box2d.b2BroadPhase", box2d.b2BroadPhase);
box2d.b2BroadPhase.prototype.m_tree = null;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_tree",
  box2d.b2BroadPhase.prototype.m_tree
);
box2d.b2BroadPhase.prototype.m_proxyCount = 0;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_proxyCount",
  box2d.b2BroadPhase.prototype.m_proxyCount
);
box2d.b2BroadPhase.prototype.m_moveCount = 0;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_moveCount",
  box2d.b2BroadPhase.prototype.m_moveCount
);
box2d.b2BroadPhase.prototype.m_moveBuffer = null;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_moveBuffer",
  box2d.b2BroadPhase.prototype.m_moveBuffer
);
box2d.b2BroadPhase.prototype.m_pairCount = 0;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_pairCount",
  box2d.b2BroadPhase.prototype.m_pairCount
);
box2d.b2BroadPhase.prototype.m_pairBuffer = null;
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "m_pairBuffer",
  box2d.b2BroadPhase.prototype.m_pairBuffer
);
box2d.b2BroadPhase.prototype.CreateProxy = function (a, b) {
  var c = this.m_tree.CreateProxy(a, b);
  ++this.m_proxyCount;
  this.BufferMove(c);
  return c;
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "CreateProxy",
  box2d.b2BroadPhase.prototype.CreateProxy
);
box2d.b2BroadPhase.prototype.DestroyProxy = function (a) {
  this.UnBufferMove(a);
  --this.m_proxyCount;
  this.m_tree.DestroyProxy(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "DestroyProxy",
  box2d.b2BroadPhase.prototype.DestroyProxy
);
box2d.b2BroadPhase.prototype.MoveProxy = function (a, b, c) {
  this.m_tree.MoveProxy(a, b, c) && this.BufferMove(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "MoveProxy",
  box2d.b2BroadPhase.prototype.MoveProxy
);
box2d.b2BroadPhase.prototype.TouchProxy = function (a) {
  this.BufferMove(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "TouchProxy",
  box2d.b2BroadPhase.prototype.TouchProxy
);
box2d.b2BroadPhase.prototype.GetFatAABB = function (a) {
  return this.m_tree.GetFatAABB(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetFatAABB",
  box2d.b2BroadPhase.prototype.GetFatAABB
);
box2d.b2BroadPhase.prototype.GetUserData = function (a) {
  return this.m_tree.GetUserData(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetUserData",
  box2d.b2BroadPhase.prototype.GetUserData
);
box2d.b2BroadPhase.prototype.TestOverlap = function (a, b) {
  var c = this.m_tree.GetFatAABB(a),
    d = this.m_tree.GetFatAABB(b);
  return box2d.b2TestOverlap_AABB(c, d);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "TestOverlap",
  box2d.b2BroadPhase.prototype.TestOverlap
);
box2d.b2BroadPhase.prototype.GetProxyCount = function () {
  return this.m_proxyCount;
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetProxyCount",
  box2d.b2BroadPhase.prototype.GetProxyCount
);
box2d.b2BroadPhase.prototype.GetTreeHeight = function () {
  return this.m_tree.GetHeight();
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetTreeHeight",
  box2d.b2BroadPhase.prototype.GetTreeHeight
);
box2d.b2BroadPhase.prototype.GetTreeBalance = function () {
  return this.m_tree.GetMaxBalance();
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetTreeBalance",
  box2d.b2BroadPhase.prototype.GetTreeBalance
);
box2d.b2BroadPhase.prototype.GetTreeQuality = function () {
  return this.m_tree.GetAreaRatio();
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "GetTreeQuality",
  box2d.b2BroadPhase.prototype.GetTreeQuality
);
box2d.b2BroadPhase.prototype.ShiftOrigin = function (a) {
  this.m_tree.ShiftOrigin(a);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "ShiftOrigin",
  box2d.b2BroadPhase.prototype.ShiftOrigin
);
box2d.b2BroadPhase.prototype.UpdatePairs = function (a) {
  for (var b = (this.m_pairCount = 0); b < this.m_moveCount; ++b) {
    var c = this.m_moveBuffer[b];
    if (null !== c) {
      var d = this,
        e = this.m_tree.GetFatAABB(c);
      this.m_tree.Query(function (a) {
        if (a.m_id === c.m_id) return !0;
        d.m_pairCount === d.m_pairBuffer.length &&
          (d.m_pairBuffer[d.m_pairCount] = new box2d.b2Pair());
        var b = d.m_pairBuffer[d.m_pairCount];
        a.m_id < c.m_id
          ? ((b.proxyA = a), (b.proxyB = c))
          : ((b.proxyA = c), (b.proxyB = a));
        ++d.m_pairCount;
        return !0;
      }, e);
    }
  }
  this.m_moveCount = 0;
  this.m_pairBuffer.length = this.m_pairCount;
  this.m_pairBuffer.sort(box2d.b2PairLessThan);
  for (b = 0; b < this.m_pairCount; ) {
    var e = this.m_pairBuffer[b],
      f = this.m_tree.GetUserData(e.proxyA),
      g = this.m_tree.GetUserData(e.proxyB);
    a.AddPair(f, g);
    for (++b; b < this.m_pairCount; ) {
      f = this.m_pairBuffer[b];
      if (f.proxyA.m_id !== e.proxyA.m_id || f.proxyB.m_id !== e.proxyB.m_id)
        break;
      ++b;
    }
  }
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "UpdatePairs",
  box2d.b2BroadPhase.prototype.UpdatePairs
);
box2d.b2BroadPhase.prototype.Query = function (a, b) {
  this.m_tree.Query(a, b);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "Query",
  box2d.b2BroadPhase.prototype.Query
);
box2d.b2BroadPhase.prototype.RayCast = function (a, b) {
  this.m_tree.RayCast(a, b);
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "RayCast",
  box2d.b2BroadPhase.prototype.RayCast
);
box2d.b2BroadPhase.prototype.BufferMove = function (a) {
  this.m_moveBuffer[this.m_moveCount] = a;
  ++this.m_moveCount;
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "BufferMove",
  box2d.b2BroadPhase.prototype.BufferMove
);
box2d.b2BroadPhase.prototype.UnBufferMove = function (a) {
  a = this.m_moveBuffer.indexOf(a);
  this.m_moveBuffer[a] = null;
};
goog.exportProperty(
  box2d.b2BroadPhase.prototype,
  "UnBufferMove",
  box2d.b2BroadPhase.prototype.UnBufferMove
);
box2d.b2PairLessThan = function (a, b) {
  return a.proxyA.m_id === b.proxyA.m_id
    ? a.proxyB.m_id - b.proxyB.m_id
    : a.proxyA.m_id - b.proxyA.m_id;
};
box2d.b2MassData = function () {
  this.center = new box2d.b2Vec2(0, 0);
};
goog.exportSymbol("box2d.b2MassData", box2d.b2MassData);
box2d.b2MassData.prototype.mass = 0;
goog.exportProperty(
  box2d.b2MassData.prototype,
  "mass",
  box2d.b2MassData.prototype.mass
);
box2d.b2MassData.prototype.center = null;
goog.exportProperty(
  box2d.b2MassData.prototype,
  "center",
  box2d.b2MassData.prototype.center
);
box2d.b2MassData.prototype.I = 0;
goog.exportProperty(
  box2d.b2MassData.prototype,
  "I",
  box2d.b2MassData.prototype.I
);
box2d.b2ShapeType = {
  e_unknown: -1,
  e_circleShape: 0,
  e_edgeShape: 1,
  e_polygonShape: 2,
  e_chainShape: 3,
  e_shapeTypeCount: 4,
};
goog.exportSymbol("box2d.b2ShapeType", box2d.b2ShapeType);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_unknown",
  box2d.b2ShapeType.e_unknown
);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_circleShape",
  box2d.b2ShapeType.e_circleShape
);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_edgeShape",
  box2d.b2ShapeType.e_edgeShape
);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_polygonShape",
  box2d.b2ShapeType.e_polygonShape
);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_chainShape",
  box2d.b2ShapeType.e_chainShape
);
goog.exportProperty(
  box2d.b2ShapeType,
  "e_shapeTypeCount",
  box2d.b2ShapeType.e_shapeTypeCount
);
box2d.b2Shape = function (a, b) {
  this.m_type = a;
  this.m_radius = b;
};
goog.exportSymbol("box2d.b2Shape", box2d.b2Shape);
box2d.b2Shape.prototype.m_type = box2d.b2ShapeType.e_unknown;
goog.exportProperty(
  box2d.b2Shape.prototype,
  "m_type",
  box2d.b2Shape.prototype.m_type
);
box2d.b2Shape.prototype.m_radius = 0;
goog.exportProperty(
  box2d.b2Shape.prototype,
  "m_radius",
  box2d.b2Shape.prototype.m_radius
);
box2d.b2Shape.prototype.Clone = function () {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  return null;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "Clone",
  box2d.b2Shape.prototype.Clone
);
box2d.b2Shape.prototype.Copy = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_type === a.m_type);
  this.m_radius = a.m_radius;
  return this;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "Copy",
  box2d.b2Shape.prototype.Copy
);
box2d.b2Shape.prototype.GetType = function () {
  //以下新增
  // if (this.m_type === null) return 0;
  //
  return this.m_type;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "GetType",
  box2d.b2Shape.prototype.GetType
);
box2d.b2Shape.prototype.GetChildCount = function () {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return 0;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "GetChildCount",
  box2d.b2Shape.prototype.GetChildCount
);
box2d.b2Shape.prototype.TestPoint = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return !1;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "TestPoint",
  box2d.b2Shape.prototype.TestPoint
);
box2d.b2Shape.prototype.ComputeDistance = function (a, b, c, d) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return 0;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "ComputeDistance",
  box2d.b2Shape.prototype.ComputeDistance
);
box2d.b2Shape.prototype.RayCast = function (a, b, c, d) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return !1;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "RayCast",
  box2d.b2Shape.prototype.RayCast
);
box2d.b2Shape.prototype.ComputeAABB = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "ComputeAABB",
  box2d.b2Shape.prototype.ComputeAABB
);
box2d.b2Shape.prototype.ComputeMass = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "ComputeMass",
  box2d.b2Shape.prototype.ComputeMass
);
box2d.b2Shape.prototype.SetupDistanceProxy = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
};
box2d.b2Shape.prototype.ComputeSubmergedArea = function (a, b, c, d) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
  return 0;
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "ComputeSubmergedArea",
  box2d.b2Shape.prototype.ComputeSubmergedArea
);
box2d.b2Shape.prototype.Dump = function () {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
};
goog.exportProperty(
  box2d.b2Shape.prototype,
  "Dump",
  box2d.b2Shape.prototype.Dump
);
box2d.b2CircleShape = function (a) {
  box2d.b2Shape.call(this, box2d.b2ShapeType.e_circleShape, a || 0);
  this.m_p = new box2d.b2Vec2();
};
goog.inherits(box2d.b2CircleShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2CircleShape", box2d.b2CircleShape);
box2d.b2CircleShape.prototype.m_p = null;
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "m_p",
  box2d.b2CircleShape.prototype.m_p
);
box2d.b2CircleShape.prototype.Clone = function () {
  return new box2d.b2CircleShape().Copy(this);
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "Clone",
  box2d.b2CircleShape.prototype.Clone
);
box2d.b2CircleShape.prototype.Copy = function (a) {
  box2d.b2Shape.prototype.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2CircleShape);
  this.m_p.Copy(a.m_p);
  return this;
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "Copy",
  box2d.b2CircleShape.prototype.Copy
);
box2d.b2CircleShape.prototype.GetChildCount = function () {
  return 1;
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "GetChildCount",
  box2d.b2CircleShape.prototype.GetChildCount
);
box2d.b2CircleShape.prototype.TestPoint = function (a, b) {
  var c = box2d.b2Mul_X_V2(
      a,
      this.m_p,
      box2d.b2CircleShape.prototype.TestPoint.s_center
    ),
    c = box2d.b2Sub_V2_V2(b, c, box2d.b2CircleShape.prototype.TestPoint.s_d);
  return box2d.b2Dot_V2_V2(c, c) <= box2d.b2Sq(this.m_radius);
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "TestPoint",
  box2d.b2CircleShape.prototype.TestPoint
);
box2d.b2CircleShape.prototype.TestPoint.s_center = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.TestPoint.s_d = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.ComputeDistance = function (a, b, c, d) {
  a = box2d.b2Mul_X_V2(
    a,
    this.m_p,
    box2d.b2CircleShape.prototype.ComputeDistance.s_center
  );
  box2d.b2Sub_V2_V2(b, a, c);
  return c.Normalize() - this.m_radius;
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "ComputeDistance",
  box2d.b2CircleShape.prototype.ComputeDistance
);
box2d.b2CircleShape.prototype.ComputeDistance.s_center = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.RayCast = function (a, b, c, d) {
  c = box2d.b2Mul_X_V2(
    c,
    this.m_p,
    box2d.b2CircleShape.prototype.RayCast.s_position
  );
  c = box2d.b2Sub_V2_V2(b.p1, c, box2d.b2CircleShape.prototype.RayCast.s_s);
  var e = box2d.b2Dot_V2_V2(c, c) - box2d.b2Sq(this.m_radius);
  d = box2d.b2Sub_V2_V2(b.p2, b.p1, box2d.b2CircleShape.prototype.RayCast.s_r);
  var f = box2d.b2Dot_V2_V2(c, d),
    g = box2d.b2Dot_V2_V2(d, d),
    e = f * f - g * e;
  if (0 > e || g < box2d.b2_epsilon) return !1;
  f = -(f + box2d.b2Sqrt(e));
  return 0 <= f && f <= b.maxFraction * g
    ? ((f /= g),
      (a.fraction = f),
      box2d.b2AddMul_V2_S_V2(c, f, d, a.normal).SelfNormalize(),
      !0)
    : !1;
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "RayCast",
  box2d.b2CircleShape.prototype.RayCast
);
box2d.b2CircleShape.prototype.RayCast.s_position = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.RayCast.s_s = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.RayCast.s_r = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.ComputeAABB = function (a, b, c) {
  b = box2d.b2Mul_X_V2(
    b,
    this.m_p,
    box2d.b2CircleShape.prototype.ComputeAABB.s_p
  );
  a.lowerBound.Set(b.x - this.m_radius, b.y - this.m_radius);
  a.upperBound.Set(b.x + this.m_radius, b.y + this.m_radius);
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "ComputeAABB",
  box2d.b2CircleShape.prototype.ComputeAABB
);
box2d.b2CircleShape.prototype.ComputeAABB.s_p = new box2d.b2Vec2();
box2d.b2CircleShape.prototype.ComputeMass = function (a, b) {
  var c = box2d.b2Sq(this.m_radius);
  a.mass = b * box2d.b2_pi * c;
  a.center.Copy(this.m_p);
  a.I = a.mass * (0.5 * c + box2d.b2Dot_V2_V2(this.m_p, this.m_p));
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "ComputeMass",
  box2d.b2CircleShape.prototype.ComputeMass
);
box2d.b2CircleShape.prototype.SetupDistanceProxy = function (a, b) {
  a.m_vertices = a.m_buffer;
  a.m_vertices[0].Copy(this.m_p);
  a.m_count = 1;
  a.m_radius = this.m_radius;
};
box2d.b2CircleShape.prototype.ComputeSubmergedArea = function (a, b, c, d) {
  c = box2d.b2Mul_X_V2(c, this.m_p, new box2d.b2Vec2());
  var e = -(box2d.b2Dot_V2_V2(a, c) - b);
  if (e < -this.m_radius + box2d.b2_epsilon) return 0;
  if (e > this.m_radius)
    return d.Copy(c), box2d.b2_pi * this.m_radius * this.m_radius;
  b = this.m_radius * this.m_radius;
  var f = e * e,
    e =
      b * (box2d.b2Asin(e / this.m_radius) + box2d.b2_pi / 2) +
      e * box2d.b2Sqrt(b - f);
  b = ((-2 / 3) * box2d.b2Pow(b - f, 1.5)) / e;
  d.x = c.x + a.x * b;
  d.y = c.y + a.y * b;
  return e;
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "ComputeSubmergedArea",
  box2d.b2CircleShape.prototype.ComputeSubmergedArea
);
box2d.b2CircleShape.prototype.Dump = function () {
  box2d.b2Log(
    "    /*box2d.b2CircleShape*/ var shape = new box2d.b2CircleShape();\n"
  );
  box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
  box2d.b2Log("    shape.m_p.Set(%.15f, %.15f);\n", this.m_p.x, this.m_p.y);
};
goog.exportProperty(
  box2d.b2CircleShape.prototype,
  "Dump",
  box2d.b2CircleShape.prototype.Dump
);
box2d.b2EdgeShape = function () {
  box2d.b2Shape.call(
    this,
    box2d.b2ShapeType.e_edgeShape,
    box2d.b2_polygonRadius
  );
  this.m_vertex1 = new box2d.b2Vec2();
  this.m_vertex2 = new box2d.b2Vec2();
  this.m_vertex0 = new box2d.b2Vec2();
  this.m_vertex3 = new box2d.b2Vec2();
};
goog.inherits(box2d.b2EdgeShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2EdgeShape", box2d.b2EdgeShape);
box2d.b2EdgeShape.prototype.m_vertex1 = null;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_vertex1",
  box2d.b2EdgeShape.prototype.m_vertex1
);
box2d.b2EdgeShape.prototype.m_vertex2 = null;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_vertex2",
  box2d.b2EdgeShape.prototype.m_vertex2
);
box2d.b2EdgeShape.prototype.m_vertex0 = null;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_vertex0",
  box2d.b2EdgeShape.prototype.m_vertex0
);
box2d.b2EdgeShape.prototype.m_vertex3 = null;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_vertex3",
  box2d.b2EdgeShape.prototype.m_vertex3
);
box2d.b2EdgeShape.prototype.m_hasVertex0 = !1;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_hasVertex0",
  box2d.b2EdgeShape.prototype.m_hasVertex0
);
box2d.b2EdgeShape.prototype.m_hasVertex3 = !1;
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "m_hasVertex3",
  box2d.b2EdgeShape.prototype.m_hasVertex3
);
box2d.b2EdgeShape.prototype.Set = function (a, b) {
  this.m_vertex1.Copy(a);
  this.m_vertex2.Copy(b);
  this.m_hasVertex3 = this.m_hasVertex0 = !1;
  return this;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "Set",
  box2d.b2EdgeShape.prototype.Set
);
box2d.b2EdgeShape.prototype.SetAsEdge = box2d.b2EdgeShape.prototype.Set;
box2d.b2EdgeShape.prototype.Clone = function () {
  return new box2d.b2EdgeShape().Copy(this);
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "Clone",
  box2d.b2EdgeShape.prototype.Clone
);
box2d.b2EdgeShape.prototype.Copy = function (a) {
  box2d.b2Shape.prototype.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2EdgeShape);
  this.m_vertex1.Copy(a.m_vertex1);
  this.m_vertex2.Copy(a.m_vertex2);
  this.m_vertex0.Copy(a.m_vertex0);
  this.m_vertex3.Copy(a.m_vertex3);
  this.m_hasVertex0 = a.m_hasVertex0;
  this.m_hasVertex3 = a.m_hasVertex3;
  return this;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "Copy",
  box2d.b2EdgeShape.prototype.Copy
);
box2d.b2EdgeShape.prototype.GetChildCount = function () {
  return 1;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "GetChildCount",
  box2d.b2EdgeShape.prototype.GetChildCount
);
box2d.b2EdgeShape.prototype.TestPoint = function (a, b) {
  return !1;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "TestPoint",
  box2d.b2EdgeShape.prototype.TestPoint
);
box2d.b2EdgeShape.prototype.ComputeDistance = function (a, b, c, d) {
  var e = box2d.b2Mul_X_V2(
    a,
    this.m_vertex1,
    box2d.b2EdgeShape.prototype.ComputeDistance.s_v1
  );
  a = box2d.b2Mul_X_V2(
    a,
    this.m_vertex2,
    box2d.b2EdgeShape.prototype.ComputeDistance.s_v2
  );
  d = box2d.b2Sub_V2_V2(b, e, box2d.b2EdgeShape.prototype.ComputeDistance.s_d);
  var e = box2d.b2Sub_V2_V2(
      a,
      e,
      box2d.b2EdgeShape.prototype.ComputeDistance.s_s
    ),
    f = box2d.b2Dot_V2_V2(d, e);
  if (0 < f) {
    var g = box2d.b2Dot_V2_V2(e, e);
    f > g ? box2d.b2Sub_V2_V2(b, a, d) : d.SelfMulSub(f / g, e);
  }
  c.Copy(d);
  return c.Normalize();
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "ComputeDistance",
  box2d.b2EdgeShape.prototype.ComputeDistance
);
box2d.b2EdgeShape.prototype.ComputeDistance.s_v1 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeDistance.s_v2 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeDistance.s_d = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeDistance.s_s = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast = function (a, b, c, d) {
  var e = box2d.b2MulT_X_V2(c, b.p1, box2d.b2EdgeShape.prototype.RayCast.s_p1);
  d = box2d.b2MulT_X_V2(c, b.p2, box2d.b2EdgeShape.prototype.RayCast.s_p2);
  var f = box2d.b2Sub_V2_V2(d, e, box2d.b2EdgeShape.prototype.RayCast.s_d);
  d = this.m_vertex1;
  var g = this.m_vertex2,
    h = box2d.b2Sub_V2_V2(g, d, box2d.b2EdgeShape.prototype.RayCast.s_e),
    k = a.normal.Set(h.y, -h.x).SelfNormalize(),
    h = box2d.b2Dot_V2_V2(k, box2d.b2Sub_V2_V2(d, e, box2d.b2Vec2.s_t0)),
    k = box2d.b2Dot_V2_V2(k, f);
  if (0 === k) return !1;
  k = h / k;
  if (0 > k || b.maxFraction < k) return !1;
  b = box2d.b2AddMul_V2_S_V2(e, k, f, box2d.b2EdgeShape.prototype.RayCast.s_q);
  e = box2d.b2Sub_V2_V2(g, d, box2d.b2EdgeShape.prototype.RayCast.s_r);
  g = box2d.b2Dot_V2_V2(e, e);
  if (0 === g) return !1;
  d = box2d.b2Dot_V2_V2(box2d.b2Sub_V2_V2(b, d, box2d.b2Vec2.s_t0), e) / g;
  if (0 > d || 1 < d) return !1;
  a.fraction = k;
  box2d.b2Mul_R_V2(c.q, a.normal, a.normal);
  0 < h && a.normal.SelfNeg();
  return !0;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "RayCast",
  box2d.b2EdgeShape.prototype.RayCast
);
box2d.b2EdgeShape.prototype.RayCast.s_p1 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast.s_p2 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast.s_d = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast.s_e = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast.s_q = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.RayCast.s_r = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeAABB = function (a, b, c) {
  c = box2d.b2Mul_X_V2(
    b,
    this.m_vertex1,
    box2d.b2EdgeShape.prototype.ComputeAABB.s_v1
  );
  b = box2d.b2Mul_X_V2(
    b,
    this.m_vertex2,
    box2d.b2EdgeShape.prototype.ComputeAABB.s_v2
  );
  box2d.b2Min_V2_V2(c, b, a.lowerBound);
  box2d.b2Max_V2_V2(c, b, a.upperBound);
  b = this.m_radius;
  a.lowerBound.SelfSubXY(b, b);
  a.upperBound.SelfAddXY(b, b);
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "ComputeAABB",
  box2d.b2EdgeShape.prototype.ComputeAABB
);
box2d.b2EdgeShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2();
box2d.b2EdgeShape.prototype.ComputeMass = function (a, b) {
  a.mass = 0;
  box2d.b2Mid_V2_V2(this.m_vertex1, this.m_vertex2, a.center);
  a.I = 0;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "ComputeMass",
  box2d.b2EdgeShape.prototype.ComputeMass
);
box2d.b2EdgeShape.prototype.SetupDistanceProxy = function (a, b) {
  a.m_vertices = a.m_buffer;
  a.m_vertices[0].Copy(this.m_vertex1);
  a.m_vertices[1].Copy(this.m_vertex2);
  a.m_count = 2;
  a.m_radius = this.m_radius;
};
box2d.b2EdgeShape.prototype.ComputeSubmergedArea = function (a, b, c, d) {
  d.SetZero();
  return 0;
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "ComputeSubmergedArea",
  box2d.b2EdgeShape.prototype.ComputeSubmergedArea
);
box2d.b2EdgeShape.prototype.Dump = function () {
  box2d.b2Log(
    "    /*box2d.b2EdgeShape*/ var shape = new box2d.b2EdgeShape();\n"
  );
  box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
  box2d.b2Log(
    "    shape.m_vertex0.Set(%.15f, %.15f);\n",
    this.m_vertex0.x,
    this.m_vertex0.y
  );
  box2d.b2Log(
    "    shape.m_vertex1.Set(%.15f, %.15f);\n",
    this.m_vertex1.x,
    this.m_vertex1.y
  );
  box2d.b2Log(
    "    shape.m_vertex2.Set(%.15f, %.15f);\n",
    this.m_vertex2.x,
    this.m_vertex2.y
  );
  box2d.b2Log(
    "    shape.m_vertex3.Set(%.15f, %.15f);\n",
    this.m_vertex3.x,
    this.m_vertex3.y
  );
  box2d.b2Log("    shape.m_hasVertex0 = %s;\n", this.m_hasVertex0);
  box2d.b2Log("    shape.m_hasVertex3 = %s;\n", this.m_hasVertex3);
};
goog.exportProperty(
  box2d.b2EdgeShape.prototype,
  "Dump",
  box2d.b2EdgeShape.prototype.Dump
);
box2d.b2ChainShape = function () {
  box2d.b2Shape.call(
    this,
    box2d.b2ShapeType.e_chainShape,
    box2d.b2_polygonRadius
  );
  this.m_prevVertex = new box2d.b2Vec2();
  this.m_nextVertex = new box2d.b2Vec2();
};
goog.inherits(box2d.b2ChainShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2ChainShape", box2d.b2ChainShape);
box2d.b2ChainShape.prototype.m_vertices = null;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_vertices",
  box2d.b2ChainShape.prototype.m_vertices
);
box2d.b2ChainShape.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_count",
  box2d.b2ChainShape.prototype.m_count
);
box2d.b2ChainShape.prototype.m_prevVertex = null;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_prevVertex",
  box2d.b2ChainShape.prototype.m_prevVertex
);
box2d.b2ChainShape.prototype.m_nextVertex = null;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_nextVertex",
  box2d.b2ChainShape.prototype.m_nextVertex
);
box2d.b2ChainShape.prototype.m_hasPrevVertex = !1;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_hasPrevVertex",
  box2d.b2ChainShape.prototype.m_hasPrevVertex
);
box2d.b2ChainShape.prototype.m_hasNextVertex = !1;
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "m_hasNextVertex",
  box2d.b2ChainShape.prototype.m_hasNextVertex
);
box2d.b2ChainShape.prototype.Clear = function () {
  this.m_vertices = null;
  this.m_count = 0;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "Clear",
  box2d.b2ChainShape.prototype.Clear
);
box2d.b2ChainShape.prototype.CreateLoop = function (a, b) {
  b = b || a.length;
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(null === this.m_vertices && 0 === this.m_count);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
  if (box2d.ENABLE_ASSERTS)
    for (var c = 1; c < b; ++c)
      box2d.b2Assert(
        box2d.b2DistanceSquared(a[c - 1], a[c]) >
          box2d.b2_linearSlop * box2d.b2_linearSlop
      );
  this.m_count = b + 1;
  this.m_vertices = box2d.b2Vec2.MakeArray(this.m_count);
  for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
  this.m_vertices[b].Copy(this.m_vertices[0]);
  this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
  this.m_nextVertex.Copy(this.m_vertices[1]);
  this.m_hasNextVertex = this.m_hasPrevVertex = !0;
  return this;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "CreateLoop",
  box2d.b2ChainShape.prototype.CreateLoop
);
box2d.b2ChainShape.prototype.CreateChain = function (a, b) {
  b = b || a.length;
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(null === this.m_vertices && 0 === this.m_count);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(2 <= b);
  if (box2d.ENABLE_ASSERTS)
    for (var c = 1; c < b; ++c)
      box2d.b2Assert(
        box2d.b2DistanceSquared(a[c - 1], a[c]) >
          box2d.b2_linearSlop * box2d.b2_linearSlop
      );
  this.m_count = b;
  this.m_vertices = box2d.b2Vec2.MakeArray(b);
  for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
  this.m_hasNextVertex = this.m_hasPrevVertex = !1;
  this.m_prevVertex.SetZero();
  this.m_nextVertex.SetZero();
  return this;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "CreateChain",
  box2d.b2ChainShape.prototype.CreateChain
);
box2d.b2ChainShape.prototype.SetPrevVertex = function (a) {
  this.m_prevVertex.Copy(a);
  this.m_hasPrevVertex = !0;
  return this;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "SetPrevVertex",
  box2d.b2ChainShape.prototype.SetPrevVertex
);
box2d.b2ChainShape.prototype.SetNextVertex = function (a) {
  this.m_nextVertex.Copy(a);
  this.m_hasNextVertex = !0;
  return this;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "SetNextVertex",
  box2d.b2ChainShape.prototype.SetNextVertex
);
box2d.b2ChainShape.prototype.Clone = function () {
  return new box2d.b2ChainShape().Copy(this);
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "Clone",
  box2d.b2ChainShape.prototype.Clone
);
box2d.b2ChainShape.prototype.Copy = function (a) {
  box2d.b2Shape.prototype.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2ChainShape);
  this.CreateChain(a.m_vertices, a.m_count);
  this.m_prevVertex.Copy(a.m_prevVertex);
  this.m_nextVertex.Copy(a.m_nextVertex);
  this.m_hasPrevVertex = a.m_hasPrevVertex;
  this.m_hasNextVertex = a.m_hasNextVertex;
  return this;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "Copy",
  box2d.b2ChainShape.prototype.Copy
);
box2d.b2ChainShape.prototype.GetChildCount = function () {
  return this.m_count - 1;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "GetChildCount",
  box2d.b2ChainShape.prototype.GetChildCount
);
box2d.b2ChainShape.prototype.GetChildEdge = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < this.m_count - 1);
  a.m_type = box2d.b2ShapeType.e_edgeShape;
  a.m_radius = this.m_radius;
  a.m_vertex1.Copy(this.m_vertices[b]);
  a.m_vertex2.Copy(this.m_vertices[b + 1]);
  0 < b
    ? (a.m_vertex0.Copy(this.m_vertices[b - 1]), (a.m_hasVertex0 = !0))
    : (a.m_vertex0.Copy(this.m_prevVertex),
      (a.m_hasVertex0 = this.m_hasPrevVertex));
  b < this.m_count - 2
    ? (a.m_vertex3.Copy(this.m_vertices[b + 2]), (a.m_hasVertex3 = !0))
    : (a.m_vertex3.Copy(this.m_nextVertex),
      (a.m_hasVertex3 = this.m_hasNextVertex));
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "GetChildEdge",
  box2d.b2ChainShape.prototype.GetChildEdge
);
box2d.b2ChainShape.prototype.TestPoint = function (a, b) {
  return !1;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "TestPoint",
  box2d.b2ChainShape.prototype.TestPoint
);
box2d.b2ChainShape.prototype.ComputeDistance = function (a, b, c, d) {
  var e = box2d.b2ChainShape.prototype.ComputeDistance.s_edgeShape;
  this.GetChildEdge(e, d);
  return e.ComputeDistance(a, b, c, 0);
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "ComputeDistance",
  box2d.b2ChainShape.prototype.ComputeDistance
);
box2d.b2ChainShape.prototype.ComputeDistance.s_edgeShape = new box2d.b2EdgeShape();
box2d.b2ChainShape.prototype.RayCast = function (a, b, c, d) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d < this.m_count);
  var e = box2d.b2ChainShape.prototype.RayCast.s_edgeShape;
  e.m_vertex1.Copy(this.m_vertices[d]);
  e.m_vertex2.Copy(this.m_vertices[(d + 1) % this.m_count]);
  return e.RayCast(a, b, c, 0);
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "RayCast",
  box2d.b2ChainShape.prototype.RayCast
);
box2d.b2ChainShape.prototype.RayCast.s_edgeShape = new box2d.b2EdgeShape();
box2d.b2ChainShape.prototype.ComputeAABB = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_count);
  var d = this.m_vertices[(c + 1) % this.m_count];
  c = box2d.b2Mul_X_V2(
    b,
    this.m_vertices[c],
    box2d.b2ChainShape.prototype.ComputeAABB.s_v1
  );
  b = box2d.b2Mul_X_V2(b, d, box2d.b2ChainShape.prototype.ComputeAABB.s_v2);
  box2d.b2Min_V2_V2(c, b, a.lowerBound);
  box2d.b2Max_V2_V2(c, b, a.upperBound);
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "ComputeAABB",
  box2d.b2ChainShape.prototype.ComputeAABB
);
box2d.b2ChainShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2();
goog.exportProperty(
  box2d.b2ChainShape.prototype.ComputeAABB,
  "s_v1",
  box2d.b2ChainShape.prototype.ComputeAABB.s_v1
);
box2d.b2ChainShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2();
goog.exportProperty(
  box2d.b2ChainShape.prototype.ComputeAABB,
  "s_v2",
  box2d.b2ChainShape.prototype.ComputeAABB.s_v2
);
box2d.b2ChainShape.prototype.ComputeMass = function (a, b) {
  a.mass = 0;
  a.center.SetZero();
  a.I = 0;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "ComputeMass",
  box2d.b2ChainShape.prototype.ComputeMass
);
box2d.b2ChainShape.prototype.SetupDistanceProxy = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < this.m_count);
  a.m_buffer[0].Copy(this.m_vertices[b]);
  b + 1 < this.m_count
    ? a.m_buffer[1].Copy(this.m_vertices[b + 1])
    : a.m_buffer[1].Copy(this.m_vertices[0]);
  a.m_vertices = a.m_buffer;
  a.m_count = 2;
  a.m_radius = this.m_radius;
};
box2d.b2ChainShape.prototype.ComputeSubmergedArea = function (a, b, c, d) {
  d.SetZero();
  return 0;
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "ComputeSubmergedArea",
  box2d.b2ChainShape.prototype.ComputeSubmergedArea
);
box2d.b2ChainShape.prototype.Dump = function () {
  box2d.b2Log(
    "    /*box2d.b2ChainShape*/ var shape = new box2d.b2ChainShape();\n"
  );
  box2d.b2Log(
    "    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n",
    box2d.b2_maxPolygonVertices
  );
  for (var a = 0; a < this.m_count; ++a)
    box2d.b2Log(
      "    vs[%d].Set(%.15f, %.15f);\n",
      a,
      this.m_vertices[a].x,
      this.m_vertices[a].y
    );
  box2d.b2Log("    shape.CreateChain(vs, %d);\n", this.m_count);
  box2d.b2Log(
    "    shape.m_prevVertex.Set(%.15f, %.15f);\n",
    this.m_prevVertex.x,
    this.m_prevVertex.y
  );
  box2d.b2Log(
    "    shape.m_nextVertex.Set(%.15f, %.15f);\n",
    this.m_nextVertex.x,
    this.m_nextVertex.y
  );
  box2d.b2Log(
    "    shape.m_hasPrevVertex = %s;\n",
    this.m_hasPrevVertex ? "true" : "false"
  );
  box2d.b2Log(
    "    shape.m_hasNextVertex = %s;\n",
    this.m_hasNextVertex ? "true" : "false"
  );
};
goog.exportProperty(
  box2d.b2ChainShape.prototype,
  "Dump",
  box2d.b2ChainShape.prototype.Dump
);
box2d.b2PolygonShape = function () {
  box2d.b2Shape.call(
    this,
    box2d.b2ShapeType.e_polygonShape,
    box2d.b2_polygonRadius
  );
  this.m_centroid = new box2d.b2Vec2(0, 0);
  this.m_vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
  this.m_normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
};
goog.inherits(box2d.b2PolygonShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2PolygonShape", box2d.b2PolygonShape);
box2d.b2PolygonShape.prototype.m_centroid = null;
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "m_centroid",
  box2d.b2PolygonShape.prototype.m_centroid
);
box2d.b2PolygonShape.prototype.m_vertices = null;
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "m_vertices",
  box2d.b2PolygonShape.prototype.m_vertices
);
box2d.b2PolygonShape.prototype.m_normals = null;
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "m_normals",
  box2d.b2PolygonShape.prototype.m_normals
);
box2d.b2PolygonShape.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "m_count",
  box2d.b2PolygonShape.prototype.m_count
);
box2d.b2PolygonShape.prototype.Clone = function () {
  return new box2d.b2PolygonShape().Copy(this);
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "Clone",
  box2d.b2PolygonShape.prototype.Clone
);
box2d.b2PolygonShape.prototype.Copy = function (a) {
  box2d.b2Shape.prototype.Copy.call(this, a);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2PolygonShape);
  this.m_centroid.Copy(a.m_centroid);
  this.m_count = a.m_count;
  for (var b = 0, c = this.m_count; b < c; ++b)
    this.m_vertices[b].Copy(a.m_vertices[b]),
      this.m_normals[b].Copy(a.m_normals[b]);
  return this;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "Copy",
  box2d.b2PolygonShape.prototype.Copy
);
box2d.b2PolygonShape.prototype.SetAsBox = function (a, b, c, d) {
  this.m_count = 4;
  this.m_vertices[0].Set(-a, -b);
  this.m_vertices[1].Set(a, -b);
  this.m_vertices[2].Set(a, b);
  this.m_vertices[3].Set(-a, b);
  this.m_normals[0].Set(0, -1);
  this.m_normals[1].Set(1, 0);
  this.m_normals[2].Set(0, 1);
  this.m_normals[3].Set(-1, 0);
  this.m_centroid.SetZero();
  if (c instanceof box2d.b2Vec2)
    for (
      d = "number" === typeof d ? d : 0,
        this.m_centroid.Copy(c),
        a = new box2d.b2Transform(),
        a.SetPosition(c),
        a.SetRotationAngle(d),
        c = 0,
        d = this.m_count;
      c < d;
      ++c
    )
      box2d.b2Mul_X_V2(a, this.m_vertices[c], this.m_vertices[c]),
        box2d.b2Mul_R_V2(a.q, this.m_normals[c], this.m_normals[c]);
  return this;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "SetAsBox",
  box2d.b2PolygonShape.prototype.SetAsBox
);
box2d.b2PolygonShape.prototype.Set = function (a, b, c) {
  b = "number" === typeof b ? b : a.length;
  c = "number" === typeof c ? c : 0;
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(3 <= b && b <= box2d.b2_maxPolygonVertices);
  if (3 > b) return this.SetAsBox(1, 1);
  b = box2d.b2Min(b, box2d.b2_maxPolygonVertices);
  for (
    var d = box2d.b2PolygonShape.prototype.Set.s_ps, e = 0, f = 0;
    f < b;
    ++f
  ) {
    for (var g = a[c + f], h = !0, k = 0; k < e; ++k)
      if (
        box2d.b2DistanceSquared(g, d[k]) <
        0.25 * box2d.b2_linearSlop * box2d.b2_linearSlop
      ) {
        h = !1;
        break;
      }
    h && d[e++].Copy(g);
  }
  b = e;
  if (3 > b)
    return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), this.SetAsBox(1, 1);
  a = 0;
  g = d[0].x;
  for (f = 1; f < b; ++f)
    if (((k = d[f].x), k > g || (k === g && d[f].y < d[a].y))) (a = f), (g = k);
  e = box2d.b2PolygonShape.prototype.Set.s_hull;
  c = 0;
  for (f = a; ; ) {
    e[c] = f;
    h = 0;
    for (k = 1; k < b; ++k)
      if (h === f) h = k;
      else {
        var l = box2d.b2Sub_V2_V2(
            d[h],
            d[e[c]],
            box2d.b2PolygonShape.prototype.Set.s_r
          ),
          g = box2d.b2Sub_V2_V2(
            d[k],
            d[e[c]],
            box2d.b2PolygonShape.prototype.Set.s_v
          ),
          m = box2d.b2Cross_V2_V2(l, g);
        0 > m && (h = k);
        0 === m && g.LengthSquared() > l.LengthSquared() && (h = k);
      }
    ++c;
    f = h;
    if (h === a) break;
  }
  if (3 > c)
    return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), this.SetAsBox(1, 1);
  this.m_count = c;
  for (f = 0; f < c; ++f) this.m_vertices[f].Copy(d[e[f]]);
  f = 0;
  for (b = c; f < b; ++f)
    (d = box2d.b2Sub_V2_V2(
      this.m_vertices[(f + 1) % b],
      this.m_vertices[f],
      box2d.b2Vec2.s_t0
    )),
      box2d.ENABLE_ASSERTS &&
        box2d.b2Assert(d.LengthSquared() > box2d.b2_epsilon_sq),
      box2d.b2Cross_V2_S(d, 1, this.m_normals[f]).SelfNormalize();
  box2d.b2PolygonShape.ComputeCentroid(this.m_vertices, c, this.m_centroid);
  return this;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "Set",
  box2d.b2PolygonShape.prototype.Set
);
box2d.b2PolygonShape.prototype.Set.s_ps = box2d.b2Vec2.MakeArray(
  box2d.b2_maxPolygonVertices
);
box2d.b2PolygonShape.prototype.Set.s_hull = box2d.b2MakeNumberArray(
  box2d.b2_maxPolygonVertices
);
box2d.b2PolygonShape.prototype.Set.s_r = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.Set.s_v = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.GetChildCount = function () {
  return 1;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "GetChildCount",
  box2d.b2PolygonShape.prototype.GetChildCount
);
box2d.b2PolygonShape.prototype.TestPoint = function (a, b) {
  for (
    var c = box2d.b2MulT_X_V2(
        a,
        b,
        box2d.b2PolygonShape.prototype.TestPoint.s_pLocal
      ),
      d = 0,
      e = this.m_count;
    d < e;
    ++d
  )
    if (
      0 <
      box2d.b2Dot_V2_V2(
        this.m_normals[d],
        box2d.b2Sub_V2_V2(c, this.m_vertices[d], box2d.b2Vec2.s_t0)
      )
    )
      return !1;
  return !0;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "TestPoint",
  box2d.b2PolygonShape.prototype.TestPoint
);
box2d.b2PolygonShape.prototype.TestPoint.s_pLocal = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeDistance = function (a, b, c, d) {
  b = box2d.b2MulT_X_V2(
    a,
    b,
    box2d.b2PolygonShape.prototype.ComputeDistance.s_pLocal
  );
  var e = -box2d.b2_maxFloat,
    f = box2d.b2PolygonShape.prototype.ComputeDistance.s_normalForMaxDistance.Copy(
      b
    );
  for (d = 0; d < this.m_count; ++d) {
    var g = box2d.b2Dot_V2_V2(
      this.m_normals[d],
      box2d.b2Sub_V2_V2(b, this.m_vertices[d], box2d.b2Vec2.s_t0)
    );
    g > e && ((e = g), f.Copy(this.m_normals[d]));
  }
  if (0 < e) {
    f = box2d.b2PolygonShape.prototype.ComputeDistance.s_minDistance.Copy(f);
    e *= e;
    for (d = 0; d < this.m_count; ++d) {
      var g = box2d.b2Sub_V2_V2(
          b,
          this.m_vertices[d],
          box2d.b2PolygonShape.prototype.ComputeDistance.s_distance
        ),
        h = g.LengthSquared();
      e > h && (f.Copy(g), (e = h));
    }
    box2d.b2Mul_R_V2(a.q, f, c);
    c.Normalize();
    return Math.sqrt(e);
  }
  box2d.b2Mul_R_V2(a.q, f, c);
  return e;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "ComputeDistance",
  box2d.b2PolygonShape.prototype.ComputeDistance
);
box2d.b2PolygonShape.prototype.ComputeDistance.s_pLocal = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeDistance.s_normalForMaxDistance = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeDistance.s_minDistance = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeDistance.s_distance = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.RayCast = function (a, b, c, d) {
  d = box2d.b2MulT_X_V2(c, b.p1, box2d.b2PolygonShape.prototype.RayCast.s_p1);
  for (
    var e = box2d.b2MulT_X_V2(
        c,
        b.p2,
        box2d.b2PolygonShape.prototype.RayCast.s_p2
      ),
      e = box2d.b2Sub_V2_V2(e, d, box2d.b2PolygonShape.prototype.RayCast.s_d),
      f = 0,
      g = b.maxFraction,
      h = -1,
      k = 0,
      l = this.m_count;
    k < l;
    ++k
  ) {
    var m = box2d.b2Dot_V2_V2(
        this.m_normals[k],
        box2d.b2Sub_V2_V2(this.m_vertices[k], d, box2d.b2Vec2.s_t0)
      ),
      n = box2d.b2Dot_V2_V2(this.m_normals[k], e);
    if (0 === n) {
      if (0 > m) return !1;
    } else
      0 > n && m < f * n
        ? ((f = m / n), (h = k))
        : 0 < n && m < g * n && (g = m / n);
    if (g < f) return !1;
  }
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= f && f <= b.maxFraction);
  return 0 <= h
    ? ((a.fraction = f), box2d.b2Mul_R_V2(c.q, this.m_normals[h], a.normal), !0)
    : !1;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "RayCast",
  box2d.b2PolygonShape.prototype.RayCast
);
box2d.b2PolygonShape.prototype.RayCast.s_p1 = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.RayCast.s_p2 = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.RayCast.s_d = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeAABB = function (a, b, c) {
  c = box2d.b2Mul_X_V2(b, this.m_vertices[0], a.lowerBound);
  a = a.upperBound.Copy(c);
  for (var d = 0, e = this.m_count; d < e; ++d) {
    var f = box2d.b2Mul_X_V2(
      b,
      this.m_vertices[d],
      box2d.b2PolygonShape.prototype.ComputeAABB.s_v
    );
    box2d.b2Min_V2_V2(f, c, c);
    box2d.b2Max_V2_V2(f, a, a);
  }
  b = this.m_radius;
  c.SelfSubXY(b, b);
  a.SelfAddXY(b, b);
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "ComputeAABB",
  box2d.b2PolygonShape.prototype.ComputeAABB
);
box2d.b2PolygonShape.prototype.ComputeAABB.s_v = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeMass = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= this.m_count);
  for (
    var c = box2d.b2PolygonShape.prototype.ComputeMass.s_center.SetZero(),
      d = 0,
      e = 0,
      f = box2d.b2PolygonShape.prototype.ComputeMass.s_s.SetZero(),
      g = 0,
      h = this.m_count;
    g < h;
    ++g
  )
    f.SelfAdd(this.m_vertices[g]);
  f.SelfMul(1 / this.m_count);
  for (var k = 1 / 3, g = 0, h = this.m_count; g < h; ++g) {
    var l = box2d.b2Sub_V2_V2(
        this.m_vertices[g],
        f,
        box2d.b2PolygonShape.prototype.ComputeMass.s_e1
      ),
      m = box2d.b2Sub_V2_V2(
        this.m_vertices[(g + 1) % h],
        f,
        box2d.b2PolygonShape.prototype.ComputeMass.s_e2
      ),
      n = box2d.b2Cross_V2_V2(l, m),
      p = 0.5 * n,
      d = d + p;
    c.SelfAdd(
      box2d.b2Mul_S_V2(
        p * k,
        box2d.b2Add_V2_V2(l, m, box2d.b2Vec2.s_t0),
        box2d.b2Vec2.s_t1
      )
    );
    var p = l.x,
      l = l.y,
      q = m.x,
      m = m.y,
      e = e + 0.25 * k * n * (p * p + q * p + q * q + (l * l + m * l + m * m));
  }
  a.mass = b * d;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d > box2d.b2_epsilon);
  c.SelfMul(1 / d);
  box2d.b2Add_V2_V2(c, f, a.center);
  a.I = b * e;
  a.I +=
    a.mass * (box2d.b2Dot_V2_V2(a.center, a.center) - box2d.b2Dot_V2_V2(c, c));
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "ComputeMass",
  box2d.b2PolygonShape.prototype.ComputeMass
);
box2d.b2PolygonShape.prototype.ComputeMass.s_center = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeMass.s_s = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeMass.s_e1 = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeMass.s_e2 = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.Validate = function () {
  for (var a = 0; a < this.m_count; ++a)
    for (
      var b = a,
        c = (a + 1) % this.m_count,
        d = this.m_vertices[b],
        e = box2d.b2Sub_V2_V2(
          this.m_vertices[c],
          d,
          box2d.b2PolygonShape.prototype.Validate.s_e
        ),
        f = 0;
      f < this.m_count;
      ++f
    )
      if (f !== b && f !== c) {
        var g = box2d.b2Sub_V2_V2(
          this.m_vertices[f],
          d,
          box2d.b2PolygonShape.prototype.Validate.s_v
        );
        if (0 > box2d.b2Cross_V2_V2(e, g)) return !1;
      }
  return !0;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "Validate",
  box2d.b2PolygonShape.prototype.Validate
);
box2d.b2PolygonShape.prototype.Validate.s_e = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.Validate.s_v = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.SetupDistanceProxy = function (a, b) {
  a.m_vertices = this.m_vertices;
  a.m_count = this.m_count;
  a.m_radius = this.m_radius;
};
box2d.b2PolygonShape.prototype.ComputeSubmergedArea = function (a, b, c, d) {
  var e = box2d.b2MulT_R_V2(
      c.q,
      a,
      box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL
    ),
    f = b - box2d.b2Dot_V2_V2(a, c.p),
    g = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths,
    h = 0,
    k = -1;
  b = -1;
  var l = !1;
  a = 0;
  for (var m = this.m_count; a < m; ++a) {
    g[a] = box2d.b2Dot_V2_V2(e, this.m_vertices[a]) - f;
    var n = g[a] < -box2d.b2_epsilon;
    0 < a && (n ? l || ((k = a - 1), h++) : l && ((b = a - 1), h++));
    l = n;
  }
  switch (h) {
    case 0:
      return l
        ? ((a = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md),
          this.ComputeMass(a, 1),
          box2d.b2Mul_X_V2(c, a.center, d),
          a.mass)
        : 0;
    case 1:
      -1 === k ? (k = this.m_count - 1) : (b = this.m_count - 1);
  }
  a = (k + 1) % this.m_count;
  e = (b + 1) % this.m_count;
  f = (0 - g[k]) / (g[a] - g[k]);
  g = (0 - g[b]) / (g[e] - g[b]);
  k = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec.Set(
    this.m_vertices[k].x * (1 - f) + this.m_vertices[a].x * f,
    this.m_vertices[k].y * (1 - f) + this.m_vertices[a].y * f
  );
  b = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec.Set(
    this.m_vertices[b].x * (1 - g) + this.m_vertices[e].x * g,
    this.m_vertices[b].y * (1 - g) + this.m_vertices[e].y * g
  );
  g = 0;
  f = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center.SetZero();
  h = this.m_vertices[a];
  for (l = null; a !== e; )
    (a = (a + 1) % this.m_count),
      (l = a === e ? b : this.m_vertices[a]),
      (m = 0.5 * ((h.x - k.x) * (l.y - k.y) - (h.y - k.y) * (l.x - k.x))),
      (g += m),
      (f.x += (m * (k.x + h.x + l.x)) / 3),
      (f.y += (m * (k.y + h.y + l.y)) / 3),
      (h = l);
  f.SelfMul(1 / g);
  box2d.b2Mul_X_V2(c, f, d);
  return g;
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "ComputeSubmergedArea",
  box2d.b2PolygonShape.prototype.ComputeSubmergedArea
);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths = box2d.b2MakeNumberArray(
  box2d.b2_maxPolygonVertices
);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md = new box2d.b2MassData();
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center = new box2d.b2Vec2();
box2d.b2PolygonShape.prototype.Dump = function () {
  box2d.b2Log(
    "    /*box2d.b2PolygonShape*/ var shape = new box2d.b2PolygonShape();\n"
  );
  box2d.b2Log(
    "    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n",
    box2d.b2_maxPolygonVertices
  );
  for (var a = 0; a < this.m_count; ++a)
    box2d.b2Log(
      "    vs[%d].Set(%.15f, %.15f);\n",
      a,
      this.m_vertices[a].x,
      this.m_vertices[a].y
    );
  box2d.b2Log("    shape.Set(vs, %d);\n", this.m_count);
};
goog.exportProperty(
  box2d.b2PolygonShape.prototype,
  "Dump",
  box2d.b2PolygonShape.prototype.Dump
);
box2d.b2PolygonShape.ComputeCentroid = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
  c.SetZero();
  for (
    var d = 0,
      e = box2d.b2PolygonShape.ComputeCentroid.s_pRef.SetZero(),
      f = 1 / 3,
      g = 0;
    g < b;
    ++g
  ) {
    var h = e,
      k = a[g],
      l = a[(g + 1) % b],
      m = box2d.b2Sub_V2_V2(k, h, box2d.b2PolygonShape.ComputeCentroid.s_e1),
      n = box2d.b2Sub_V2_V2(l, h, box2d.b2PolygonShape.ComputeCentroid.s_e2),
      m = 0.5 * box2d.b2Cross_V2_V2(m, n),
      d = d + m;
    c.x += m * f * (h.x + k.x + l.x);
    c.y += m * f * (h.y + k.y + l.y);
  }
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d > box2d.b2_epsilon);
  c.SelfMul(1 / d);
  return c;
};
goog.exportProperty(
  box2d.b2PolygonShape,
  "ComputeCentroid",
  box2d.b2PolygonShape.ComputeCentroid
);
box2d.b2PolygonShape.ComputeCentroid.s_pRef = new box2d.b2Vec2();
box2d.b2PolygonShape.ComputeCentroid.s_e1 = new box2d.b2Vec2();
box2d.b2PolygonShape.ComputeCentroid.s_e2 = new box2d.b2Vec2();
box2d.b2Timer = function () {
  this.m_start = new Date().getTime();
};
goog.exportSymbol("box2d.b2Timer", box2d.b2Timer);
box2d.b2Timer.prototype.m_start = 0;
goog.exportProperty(
  box2d.b2Timer.prototype,
  "m_start",
  box2d.b2Timer.prototype.m_start
);
box2d.b2Timer.prototype.Reset = function () {
  this.m_start = new Date().getTime();
  return this;
};
goog.exportProperty(
  box2d.b2Timer.prototype,
  "Reset",
  box2d.b2Timer.prototype.Reset
);
box2d.b2Timer.prototype.GetMilliseconds = function () {
  return new Date().getTime() - this.m_start;
};
goog.exportProperty(
  box2d.b2Timer.prototype,
  "GetMilliseconds",
  box2d.b2Timer.prototype.GetMilliseconds
);
box2d.b2Counter = function () {};
goog.exportSymbol("box2d.b2Counter", box2d.b2Counter);
box2d.b2Counter.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2Counter.prototype,
  "m_count",
  box2d.b2Counter.prototype.m_count
);
box2d.b2Counter.prototype.m_min_count = 0;
goog.exportProperty(
  box2d.b2Counter.prototype,
  "m_min_count",
  box2d.b2Counter.prototype.m_min_count
);
box2d.b2Counter.prototype.m_max_count = 0;
goog.exportProperty(
  box2d.b2Counter.prototype,
  "m_max_count",
  box2d.b2Counter.prototype.m_max_count
);
box2d.b2Counter.prototype.GetCount = function () {
  return this.m_count;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "GetCount",
  box2d.b2Counter.prototype.GetCount
);
box2d.b2Counter.prototype.GetMinCount = function () {
  return this.m_min_count;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "GetMinCount",
  box2d.b2Counter.prototype.GetMinCount
);
box2d.b2Counter.prototype.GetMaxCount = function () {
  return this.m_max_count;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "GetMaxCount",
  box2d.b2Counter.prototype.GetMaxCount
);
box2d.b2Counter.prototype.ResetCount = function () {
  var a = this.m_count;
  this.m_count = 0;
  return a;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "ResetCount",
  box2d.b2Counter.prototype.ResetCount
);
box2d.b2Counter.prototype.ResetMinCount = function () {
  this.m_min_count = 0;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "ResetMinCount",
  box2d.b2Counter.prototype.ResetMinCount
);
box2d.b2Counter.prototype.ResetMaxCount = function () {
  this.m_max_count = 0;
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "ResetMaxCount",
  box2d.b2Counter.prototype.ResetMaxCount
);
box2d.b2Counter.prototype.Increment = function () {
  this.m_count++;
  this.m_max_count < this.m_count && (this.m_max_count = this.m_count);
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "Increment",
  box2d.b2Counter.prototype.Increment
);
box2d.b2Counter.prototype.Decrement = function () {
  this.m_count--;
  this.m_min_count > this.m_count && (this.m_min_count = this.m_count);
};
goog.exportProperty(
  box2d.b2Counter.prototype,
  "Decrement",
  box2d.b2Counter.prototype.Decrement
);
box2d.b2_toiTime = 0;
goog.exportSymbol("box2d.b2_toiTime", box2d.b2_toiTime);
box2d.b2_toiMaxTime = 0;
goog.exportSymbol("box2d.b2_toiMaxTime", box2d.b2_toiMaxTime);
box2d.b2_toiCalls = 0;
goog.exportSymbol("box2d.b2_toiCalls", box2d.b2_toiCalls);
box2d.b2_toiIters = 0;
goog.exportSymbol("box2d.b2_toiIters", box2d.b2_toiIters);
box2d.b2_toiMaxIters = 0;
goog.exportSymbol("box2d.b2_toiMaxIters", box2d.b2_toiMaxIters);
box2d.b2_toiRootIters = 0;
goog.exportSymbol("box2d.b2_toiRootIters", box2d.b2_toiRootIters);
box2d.b2_toiMaxRootIters = 0;
goog.exportSymbol("box2d.b2_toiMaxRootIters", box2d.b2_toiMaxRootIters);
box2d.b2TOIInput = function () {
  this.proxyA = new box2d.b2DistanceProxy();
  this.proxyB = new box2d.b2DistanceProxy();
  this.sweepA = new box2d.b2Sweep();
  this.sweepB = new box2d.b2Sweep();
};
goog.exportSymbol("box2d.b2TOIInput", box2d.b2TOIInput);
box2d.b2TOIInput.prototype.proxyA = null;
goog.exportProperty(
  box2d.b2TOIInput.prototype,
  "proxyA",
  box2d.b2TOIInput.prototype.proxyA
);
box2d.b2TOIInput.prototype.proxyB = null;
goog.exportProperty(
  box2d.b2TOIInput.prototype,
  "proxyB",
  box2d.b2TOIInput.prototype.proxyB
);
box2d.b2TOIInput.prototype.sweepA = null;
goog.exportProperty(
  box2d.b2TOIInput.prototype,
  "sweepA",
  box2d.b2TOIInput.prototype.sweepA
);
box2d.b2TOIInput.prototype.sweepB = null;
goog.exportProperty(
  box2d.b2TOIInput.prototype,
  "sweepB",
  box2d.b2TOIInput.prototype.sweepB
);
box2d.b2TOIInput.prototype.tMax = 0;
goog.exportProperty(
  box2d.b2TOIInput.prototype,
  "tMax",
  box2d.b2TOIInput.prototype.tMax
);
box2d.b2TOIOutputState = {
  e_unknown: 0,
  e_failed: 1,
  e_overlapped: 2,
  e_touching: 3,
  e_separated: 4,
};
goog.exportSymbol("box2d.b2TOIOutputState", box2d.b2TOIOutputState);
goog.exportProperty(
  box2d.b2TOIOutputState,
  "e_unknown",
  box2d.b2TOIOutputState.e_unknown
);
goog.exportProperty(
  box2d.b2TOIOutputState,
  "e_failed",
  box2d.b2TOIOutputState.e_failed
);
goog.exportProperty(
  box2d.b2TOIOutputState,
  "e_overlapped",
  box2d.b2TOIOutputState.e_overlapped
);
goog.exportProperty(
  box2d.b2TOIOutputState,
  "e_touching",
  box2d.b2TOIOutputState.e_touching
);
goog.exportProperty(
  box2d.b2TOIOutputState,
  "e_separated",
  box2d.b2TOIOutputState.e_separated
);
box2d.b2TOIOutput = function () {};
goog.exportSymbol("box2d.b2TOIOutput", box2d.b2TOIOutput);
box2d.b2TOIOutput.prototype.state = box2d.b2TOIOutputState.e_unknown;
goog.exportProperty(
  box2d.b2TOIOutput.prototype,
  "state",
  box2d.b2TOIOutput.prototype.state
);
box2d.b2TOIOutput.prototype.t = 0;
goog.exportProperty(
  box2d.b2TOIOutput.prototype,
  "t",
  box2d.b2TOIOutput.prototype.t
);
box2d.b2SeparationFunctionType = {
  e_unknown: -1,
  e_points: 0,
  e_faceA: 1,
  e_faceB: 2,
};
goog.exportSymbol(
  "box2d.b2SeparationFunctionType",
  box2d.b2SeparationFunctionType
);
goog.exportProperty(
  box2d.b2SeparationFunctionType,
  "e_unknown",
  box2d.b2SeparationFunctionType.e_unknown
);
goog.exportProperty(
  box2d.b2SeparationFunctionType,
  "e_points",
  box2d.b2SeparationFunctionType.e_points
);
goog.exportProperty(
  box2d.b2SeparationFunctionType,
  "e_faceA",
  box2d.b2SeparationFunctionType.e_faceA
);
goog.exportProperty(
  box2d.b2SeparationFunctionType,
  "e_faceB",
  box2d.b2SeparationFunctionType.e_faceB
);
box2d.b2SeparationFunction = function () {
  this.m_sweepA = new box2d.b2Sweep();
  this.m_sweepB = new box2d.b2Sweep();
  this.m_localPoint = new box2d.b2Vec2();
  this.m_axis = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2SeparationFunction", box2d.b2SeparationFunction);
box2d.b2SeparationFunction.prototype.m_proxyA = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_proxyA",
  box2d.b2SeparationFunction.prototype.m_proxyA
);
box2d.b2SeparationFunction.prototype.m_proxyB = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_proxyB",
  box2d.b2SeparationFunction.prototype.m_proxyB
);
box2d.b2SeparationFunction.prototype.m_sweepA = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_sweepA",
  box2d.b2SeparationFunction.prototype.m_sweepA
);
box2d.b2SeparationFunction.prototype.m_sweepB = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_sweepB",
  box2d.b2SeparationFunction.prototype.m_sweepB
);
box2d.b2SeparationFunction.prototype.m_type =
  box2d.b2SeparationFunctionType.e_unknown;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_type",
  box2d.b2SeparationFunction.prototype.m_type
);
box2d.b2SeparationFunction.prototype.m_localPoint = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_localPoint",
  box2d.b2SeparationFunction.prototype.m_localPoint
);
box2d.b2SeparationFunction.prototype.m_axis = null;
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "m_axis",
  box2d.b2SeparationFunction.prototype.m_axis
);
box2d.b2SeparationFunction.prototype.Initialize = function (a, b, c, d, e, f) {
  this.m_proxyA = b;
  this.m_proxyB = d;
  b = a.count;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b && 3 > b);
  this.m_sweepA.Copy(c);
  this.m_sweepB.Copy(e);
  c = box2d.b2TimeOfImpact.s_xfA;
  e = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(c, f);
  this.m_sweepB.GetTransform(e, f);
  1 === b
    ? ((this.m_type = box2d.b2SeparationFunctionType.e_points),
      (b = this.m_proxyA.GetVertex(a.indexA[0])),
      (a = this.m_proxyB.GetVertex(a.indexB[0])),
      (c = box2d.b2Mul_X_V2(c, b, box2d.b2TimeOfImpact.s_pointA)),
      (e = box2d.b2Mul_X_V2(e, a, box2d.b2TimeOfImpact.s_pointB)),
      box2d.b2Sub_V2_V2(e, c, this.m_axis),
      (a = this.m_axis.Normalize()),
      this.m_localPoint.SetZero())
    : (a.indexA[0] === a.indexA[1]
        ? ((this.m_type = box2d.b2SeparationFunctionType.e_faceB),
          (b = this.m_proxyB.GetVertex(a.indexB[0])),
          (d = this.m_proxyB.GetVertex(a.indexB[1])),
          box2d
            .b2Cross_V2_S(
              box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0),
              1,
              this.m_axis
            )
            .SelfNormalize(),
          (f = box2d.b2Mul_R_V2(
            e.q,
            this.m_axis,
            box2d.b2TimeOfImpact.s_normal
          )),
          box2d.b2Mid_V2_V2(b, d, this.m_localPoint),
          (e = box2d.b2Mul_X_V2(
            e,
            this.m_localPoint,
            box2d.b2TimeOfImpact.s_pointB
          )),
          (b = this.m_proxyA.GetVertex(a.indexA[0])),
          (c = box2d.b2Mul_X_V2(c, b, box2d.b2TimeOfImpact.s_pointA)),
          (a = box2d.b2Dot_V2_V2(
            box2d.b2Sub_V2_V2(c, e, box2d.b2Vec2.s_t0),
            f
          )))
        : ((this.m_type = box2d.b2SeparationFunctionType.e_faceA),
          (b = this.m_proxyA.GetVertex(a.indexA[0])),
          (d = this.m_proxyA.GetVertex(a.indexA[1])),
          box2d
            .b2Cross_V2_S(
              box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0),
              1,
              this.m_axis
            )
            .SelfNormalize(),
          (f = box2d.b2Mul_R_V2(
            c.q,
            this.m_axis,
            box2d.b2TimeOfImpact.s_normal
          )),
          box2d.b2Mid_V2_V2(b, d, this.m_localPoint),
          (c = box2d.b2Mul_X_V2(
            c,
            this.m_localPoint,
            box2d.b2TimeOfImpact.s_pointA
          )),
          (a = this.m_proxyB.GetVertex(a.indexB[0])),
          (e = box2d.b2Mul_X_V2(e, a, box2d.b2TimeOfImpact.s_pointB)),
          (a = box2d.b2Dot_V2_V2(
            box2d.b2Sub_V2_V2(e, c, box2d.b2Vec2.s_t0),
            f
          ))),
      0 > a && (this.m_axis.SelfNeg(), (a = -a)));
  return a;
};
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "Initialize",
  box2d.b2SeparationFunction.prototype.Initialize
);
box2d.b2SeparationFunction.prototype.FindMinSeparation = function (a, b, c) {
  var d = box2d.b2TimeOfImpact.s_xfA,
    e = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(d, c);
  this.m_sweepB.GetTransform(e, c);
  switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
      var f = box2d.b2MulT_R_V2(d.q, this.m_axis, box2d.b2TimeOfImpact.s_axisA),
        g = box2d.b2MulT_R_V2(
          e.q,
          box2d.b2Vec2.s_t0.Copy(this.m_axis).SelfNeg(),
          box2d.b2TimeOfImpact.s_axisB
        );
      a[0] = this.m_proxyA.GetSupport(f);
      b[0] = this.m_proxyB.GetSupport(g);
      a = this.m_proxyA.GetVertex(a[0]);
      b = this.m_proxyB.GetVertex(b[0]);
      d = box2d.b2Mul_X_V2(d, a, box2d.b2TimeOfImpact.s_pointA);
      e = box2d.b2Mul_X_V2(e, b, box2d.b2TimeOfImpact.s_pointB);
      return (b = box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(e, d, box2d.b2Vec2.s_t0),
        this.m_axis
      ));
    case box2d.b2SeparationFunctionType.e_faceA:
      return (
        (c = box2d.b2Mul_R_V2(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal)),
        (d = box2d.b2Mul_X_V2(
          d,
          this.m_localPoint,
          box2d.b2TimeOfImpact.s_pointA
        )),
        (g = box2d.b2MulT_R_V2(
          e.q,
          box2d.b2Vec2.s_t0.Copy(c).SelfNeg(),
          box2d.b2TimeOfImpact.s_axisB
        )),
        (a[0] = -1),
        (b[0] = this.m_proxyB.GetSupport(g)),
        (b = this.m_proxyB.GetVertex(b[0])),
        (e = box2d.b2Mul_X_V2(e, b, box2d.b2TimeOfImpact.s_pointB)),
        (b = box2d.b2Dot_V2_V2(box2d.b2Sub_V2_V2(e, d, box2d.b2Vec2.s_t0), c))
      );
    case box2d.b2SeparationFunctionType.e_faceB:
      return (
        (c = box2d.b2Mul_R_V2(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal)),
        (e = box2d.b2Mul_X_V2(
          e,
          this.m_localPoint,
          box2d.b2TimeOfImpact.s_pointB
        )),
        (f = box2d.b2MulT_R_V2(
          d.q,
          box2d.b2Vec2.s_t0.Copy(c).SelfNeg(),
          box2d.b2TimeOfImpact.s_axisA
        )),
        (b[0] = -1),
        (a[0] = this.m_proxyA.GetSupport(f)),
        (a = this.m_proxyA.GetVertex(a[0])),
        (d = box2d.b2Mul_X_V2(d, a, box2d.b2TimeOfImpact.s_pointA)),
        (b = box2d.b2Dot_V2_V2(box2d.b2Sub_V2_V2(d, e, box2d.b2Vec2.s_t0), c))
      );
    default:
      return (
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), (a[0] = -1), (b[0] = -1), 0
      );
  }
};
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "FindMinSeparation",
  box2d.b2SeparationFunction.prototype.FindMinSeparation
);
box2d.b2SeparationFunction.prototype.Evaluate = function (a, b, c) {
  var d = box2d.b2TimeOfImpact.s_xfA,
    e = box2d.b2TimeOfImpact.s_xfB;
  this.m_sweepA.GetTransform(d, c);
  this.m_sweepB.GetTransform(e, c);
  switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
      return (
        (a = this.m_proxyA.GetVertex(a)),
        (b = this.m_proxyB.GetVertex(b)),
        (d = box2d.b2Mul_X_V2(d, a, box2d.b2TimeOfImpact.s_pointA)),
        (e = box2d.b2Mul_X_V2(e, b, box2d.b2TimeOfImpact.s_pointB)),
        (d = box2d.b2Dot_V2_V2(
          box2d.b2Sub_V2_V2(e, d, box2d.b2Vec2.s_t0),
          this.m_axis
        ))
      );
    case box2d.b2SeparationFunctionType.e_faceA:
      return (
        (c = box2d.b2Mul_R_V2(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal)),
        (d = box2d.b2Mul_X_V2(
          d,
          this.m_localPoint,
          box2d.b2TimeOfImpact.s_pointA
        )),
        (b = this.m_proxyB.GetVertex(b)),
        (e = box2d.b2Mul_X_V2(e, b, box2d.b2TimeOfImpact.s_pointB)),
        (d = box2d.b2Dot_V2_V2(box2d.b2Sub_V2_V2(e, d, box2d.b2Vec2.s_t0), c))
      );
    case box2d.b2SeparationFunctionType.e_faceB:
      return (
        (c = box2d.b2Mul_R_V2(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal)),
        (e = box2d.b2Mul_X_V2(
          e,
          this.m_localPoint,
          box2d.b2TimeOfImpact.s_pointB
        )),
        (a = this.m_proxyA.GetVertex(a)),
        (d = box2d.b2Mul_X_V2(d, a, box2d.b2TimeOfImpact.s_pointA)),
        (d = box2d.b2Dot_V2_V2(box2d.b2Sub_V2_V2(d, e, box2d.b2Vec2.s_t0), c))
      );
    default:
      return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0;
  }
};
goog.exportProperty(
  box2d.b2SeparationFunction.prototype,
  "Evaluate",
  box2d.b2SeparationFunction.prototype.Evaluate
);
box2d.b2TimeOfImpact = function (a, b) {
  var c = box2d.b2TimeOfImpact.s_timer.Reset();
  ++box2d.b2_toiCalls;
  a.state = box2d.b2TOIOutputState.e_unknown;
  a.t = b.tMax;
  var d = b.proxyA,
    e = b.proxyB,
    f = box2d.b2TimeOfImpact.s_sweepA.Copy(b.sweepA),
    g = box2d.b2TimeOfImpact.s_sweepB.Copy(b.sweepB);
  f.Normalize();
  g.Normalize();
  var h = b.tMax,
    k = box2d.b2Max(
      box2d.b2_linearSlop,
      d.m_radius + e.m_radius - 3 * box2d.b2_linearSlop
    ),
    l = 0.25 * box2d.b2_linearSlop;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(k > l);
  var m = 0,
    n = 0,
    p = box2d.b2TimeOfImpact.s_cache;
  p.count = 0;
  var q = box2d.b2TimeOfImpact.s_distanceInput;
  q.proxyA = b.proxyA;
  q.proxyB = b.proxyB;
  for (q.useRadii = !1; ; ) {
    var r = box2d.b2TimeOfImpact.s_xfA,
      u = box2d.b2TimeOfImpact.s_xfB;
    f.GetTransform(r, m);
    g.GetTransform(u, m);
    q.transformA.Copy(r);
    q.transformB.Copy(u);
    r = box2d.b2TimeOfImpact.s_distanceOutput;
    box2d.b2ShapeDistance(r, p, q);
    if (0 >= r.distance) {
      a.state = box2d.b2TOIOutputState.e_overlapped;
      a.t = 0;
      break;
    }
    if (r.distance < k + l) {
      a.state = box2d.b2TOIOutputState.e_touching;
      a.t = m;
      break;
    }
    r = box2d.b2TimeOfImpact.s_fcn;
    r.Initialize(p, d, f, e, g, m);
    for (var u = !1, t = h, w = 0; ; ) {
      var x = box2d.b2TimeOfImpact.s_indexA,
        v = box2d.b2TimeOfImpact.s_indexB,
        y = r.FindMinSeparation(x, v, t);
      if (y > k + l) {
        a.state = box2d.b2TOIOutputState.e_separated;
        a.t = h;
        u = !0;
        break;
      }
      if (y > k - l) {
        m = t;
        break;
      }
      var z = r.Evaluate(x[0], v[0], m);
      if (z < k - l) {
        a.state = box2d.b2TOIOutputState.e_failed;
        a.t = m;
        u = !0;
        break;
      }
      if (z <= k + l) {
        a.state = box2d.b2TOIOutputState.e_touching;
        a.t = m;
        u = !0;
        break;
      }
      for (var B = 0, E = m, F = t; ; ) {
        var G = 0,
          G = B & 1 ? E + ((k - z) * (F - E)) / (y - z) : 0.5 * (E + F);
        ++B;
        ++box2d.b2_toiRootIters;
        var H = r.Evaluate(x[0], v[0], G);
        if (box2d.b2Abs(H - k) < l) {
          t = G;
          break;
        }
        H > k ? ((E = G), (z = H)) : ((F = G), (y = H));
        if (50 === B) break;
      }
      box2d.b2_toiMaxRootIters = box2d.b2Max(box2d.b2_toiMaxRootIters, B);
      ++w;
      if (w === box2d.b2_maxPolygonVertices) break;
    }
    ++n;
    ++box2d.b2_toiIters;
    if (u) break;
    if (20 === n) {
      a.state = box2d.b2TOIOutputState.e_failed;
      a.t = m;
      break;
    }
  }
  box2d.b2_toiMaxIters = box2d.b2Max(box2d.b2_toiMaxIters, n);
  c = c.GetMilliseconds();
  box2d.b2_toiMaxTime = box2d.b2Max(box2d.b2_toiMaxTime, c);
  box2d.b2_toiTime += c;
};
goog.exportSymbol("box2d.b2TimeOfImpact", box2d.b2TimeOfImpact);
box2d.b2TimeOfImpact.s_timer = new box2d.b2Timer();
box2d.b2TimeOfImpact.s_cache = new box2d.b2SimplexCache();
box2d.b2TimeOfImpact.s_distanceInput = new box2d.b2DistanceInput();
box2d.b2TimeOfImpact.s_distanceOutput = new box2d.b2DistanceOutput();
box2d.b2TimeOfImpact.s_xfA = new box2d.b2Transform();
box2d.b2TimeOfImpact.s_xfB = new box2d.b2Transform();
box2d.b2TimeOfImpact.s_indexA = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_indexB = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_fcn = new box2d.b2SeparationFunction();
box2d.b2TimeOfImpact.s_sweepA = new box2d.b2Sweep();
box2d.b2TimeOfImpact.s_sweepB = new box2d.b2Sweep();
box2d.b2TimeOfImpact.s_pointA = new box2d.b2Vec2();
box2d.b2TimeOfImpact.s_pointB = new box2d.b2Vec2();
box2d.b2TimeOfImpact.s_normal = new box2d.b2Vec2();
box2d.b2TimeOfImpact.s_axisA = new box2d.b2Vec2();
box2d.b2TimeOfImpact.s_axisB = new box2d.b2Vec2();
box2d.b2Filter = function () {};
goog.exportSymbol("box2d.b2Filter", box2d.b2Filter);
box2d.b2Filter.prototype.categoryBits = 1;
goog.exportProperty(
  box2d.b2Filter.prototype,
  "categoryBits",
  box2d.b2Filter.prototype.categoryBits
);
box2d.b2Filter.prototype.maskBits = 65535;
goog.exportProperty(
  box2d.b2Filter.prototype,
  "maskBits",
  box2d.b2Filter.prototype.maskBits
);
box2d.b2Filter.prototype.groupIndex = 0;
goog.exportProperty(
  box2d.b2Filter.prototype,
  "groupIndex",
  box2d.b2Filter.prototype.groupIndex
);
box2d.b2Filter.prototype.Clone = function () {
  return new box2d.b2Filter().Copy(this);
};
goog.exportProperty(
  box2d.b2Filter.prototype,
  "Clone",
  box2d.b2Filter.prototype.Clone
);
box2d.b2Filter.prototype.Copy = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this !== a);
  this.categoryBits = a.categoryBits;
  this.maskBits = a.maskBits;
  this.groupIndex = a.groupIndex;
  return this;
};
goog.exportProperty(
  box2d.b2Filter.prototype,
  "Copy",
  box2d.b2Filter.prototype.Copy
);
box2d.b2FixtureDef = function () {
  this.filter = new box2d.b2Filter();
};
goog.exportSymbol("box2d.b2FixtureDef", box2d.b2FixtureDef);
box2d.b2FixtureDef.prototype.shape = null;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "shape",
  box2d.b2FixtureDef.prototype.shape
);
box2d.b2FixtureDef.prototype.userData = null;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "userData",
  box2d.b2FixtureDef.prototype.userData
);
box2d.b2FixtureDef.prototype.friction = 0.2;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "friction",
  box2d.b2FixtureDef.prototype.friction
);
box2d.b2FixtureDef.prototype.restitution = 0;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "restitution",
  box2d.b2FixtureDef.prototype.restitution
);
box2d.b2FixtureDef.prototype.density = 0;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "density",
  box2d.b2FixtureDef.prototype.density
);
box2d.b2FixtureDef.prototype.isSensor = !1;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "isSensor",
  box2d.b2FixtureDef.prototype.isSensor
);
box2d.b2FixtureDef.prototype.filter = null;
goog.exportProperty(
  box2d.b2FixtureDef.prototype,
  "filter",
  box2d.b2FixtureDef.prototype.filter
);
box2d.b2FixtureProxy = function () {
  this.aabb = new box2d.b2AABB();
};
goog.exportSymbol("box2d.b2FixtureProxy", box2d.b2FixtureProxy);
box2d.b2FixtureProxy.prototype.aabb = null;
goog.exportProperty(
  box2d.b2FixtureProxy.prototype,
  "aabb",
  box2d.b2FixtureProxy.prototype.aabb
);
box2d.b2FixtureProxy.prototype.fixture = null;
goog.exportProperty(
  box2d.b2FixtureProxy.prototype,
  "fixture",
  box2d.b2FixtureProxy.prototype.fixture
);
box2d.b2FixtureProxy.prototype.childIndex = 0;
goog.exportProperty(
  box2d.b2FixtureProxy.prototype,
  "childIndex",
  box2d.b2FixtureProxy.prototype.childIndex
);
box2d.b2FixtureProxy.prototype.proxy = null;
goog.exportProperty(
  box2d.b2FixtureProxy.prototype,
  "proxy",
  box2d.b2FixtureProxy.prototype.proxy
);
box2d.b2FixtureProxy.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2FixtureProxy();
  });
};
goog.exportProperty(
  box2d.b2FixtureProxy,
  "MakeArray",
  box2d.b2FixtureProxy.MakeArray
);
box2d.b2Fixture = function () {
  this.m_proxyCount = 0;
  this.m_filter = new box2d.b2Filter();
};
goog.exportSymbol("box2d.b2Fixture", box2d.b2Fixture);
box2d.b2Fixture.prototype.m_density = 0;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_density",
  box2d.b2Fixture.prototype.m_density
);
box2d.b2Fixture.prototype.m_next = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_next",
  box2d.b2Fixture.prototype.m_next
);
box2d.b2Fixture.prototype.m_body = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_body",
  box2d.b2Fixture.prototype.m_body
);
box2d.b2Fixture.prototype.m_shape = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_shape",
  box2d.b2Fixture.prototype.m_shape
);
box2d.b2Fixture.prototype.m_friction = 0;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_friction",
  box2d.b2Fixture.prototype.m_friction
);
box2d.b2Fixture.prototype.m_restitution = 0;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_restitution",
  box2d.b2Fixture.prototype.m_restitution
);
box2d.b2Fixture.prototype.m_proxies = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_proxies",
  box2d.b2Fixture.prototype.m_proxies
);
box2d.b2Fixture.prototype.m_proxyCount = 0;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_proxyCount",
  box2d.b2Fixture.prototype.m_proxyCount
);
box2d.b2Fixture.prototype.m_filter = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_filter",
  box2d.b2Fixture.prototype.m_filter
);
box2d.b2Fixture.prototype.m_isSensor = !1;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_isSensor",
  box2d.b2Fixture.prototype.m_isSensor
);
box2d.b2Fixture.prototype.m_userData = null;
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "m_userData",
  box2d.b2Fixture.prototype.m_userData
);
box2d.b2Fixture.prototype.GetType = function () {
  //[以下新增]
  // if (this.m_shape.GetType() === null) return 0;
  //
  return this.m_shape.GetType();
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetType",
  box2d.b2Fixture.prototype.GetType
);
box2d.b2Fixture.prototype.GetShape = function () {
  return this.m_shape;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetShape",
  box2d.b2Fixture.prototype.GetShape
);
box2d.b2Fixture.prototype.IsSensor = function () {
  return this.m_isSensor;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "IsSensor",
  box2d.b2Fixture.prototype.IsSensor
);
box2d.b2Fixture.prototype.GetFilterData = function (a) {
  a = a || new box2d.b2Filter();
  return a.Copy(this.m_filter);
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetFilterData",
  box2d.b2Fixture.prototype.GetFilterData
);
box2d.b2Fixture.prototype.GetUserData = function () {
  return this.m_userData;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetUserData",
  box2d.b2Fixture.prototype.GetUserData
);
box2d.b2Fixture.prototype.SetUserData = function (a) {
  this.m_userData = a;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetUserData",
  box2d.b2Fixture.prototype.SetUserData
);
box2d.b2Fixture.prototype.GetBody = function () {
  return this.m_body;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetBody",
  box2d.b2Fixture.prototype.GetBody
);
box2d.b2Fixture.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetNext",
  box2d.b2Fixture.prototype.GetNext
);
box2d.b2Fixture.prototype.SetDensity = function (a) {
  this.m_density = a;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetDensity",
  box2d.b2Fixture.prototype.SetDensity
);
box2d.b2Fixture.prototype.GetDensity = function () {
  return this.m_density;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetDensity",
  box2d.b2Fixture.prototype.GetDensity
);
box2d.b2Fixture.prototype.GetFriction = function () {
  return this.m_friction;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetFriction",
  box2d.b2Fixture.prototype.GetFriction
);
box2d.b2Fixture.prototype.SetFriction = function (a) {
  this.m_friction = a;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetFriction",
  box2d.b2Fixture.prototype.SetFriction
);
box2d.b2Fixture.prototype.GetRestitution = function () {
  return this.m_restitution;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetRestitution",
  box2d.b2Fixture.prototype.GetRestitution
);
box2d.b2Fixture.prototype.SetRestitution = function (a) {
  this.m_restitution = a;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetRestitution",
  box2d.b2Fixture.prototype.SetRestitution
);
box2d.b2Fixture.prototype.TestPoint = function (a) {
  return this.m_shape.TestPoint(this.m_body.GetTransform(), a);
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "TestPoint",
  box2d.b2Fixture.prototype.TestPoint
);
box2d.b2Fixture.prototype.ComputeDistance = function (a, b, c) {
  return this.m_shape.ComputeDistance(this.m_body.GetTransform(), a, b, c);
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "ComputeDistance",
  box2d.b2Fixture.prototype.ComputeDistance
);
box2d.b2Fixture.prototype.RayCast = function (a, b, c) {
  return this.m_shape.RayCast(a, b, this.m_body.GetTransform(), c);
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "RayCast",
  box2d.b2Fixture.prototype.RayCast
);
box2d.b2Fixture.prototype.GetMassData = function (a) {
  a = a || new box2d.b2MassData();
  this.m_shape.ComputeMass(a, this.m_density);
  return a;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetMassData",
  box2d.b2Fixture.prototype.GetMassData
);
box2d.b2Fixture.prototype.GetAABB = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_proxyCount);
  return this.m_proxies[a].aabb;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "GetAABB",
  box2d.b2Fixture.prototype.GetAABB
);
box2d.b2Fixture.prototype.Create = function (a, b) {
  this.m_userData = b.userData;
  this.m_friction = b.friction;
  this.m_restitution = b.restitution;
  this.m_body = a;
  this.m_next = null;
  this.m_filter.Copy(b.filter);
  this.m_isSensor = b.isSensor;
  this.m_shape = b.shape.Clone();
  this.m_proxies = box2d.b2FixtureProxy.MakeArray(this.m_shape.GetChildCount());
  this.m_proxyCount = 0;
  this.m_density = b.density;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "Create",
  box2d.b2Fixture.prototype.Create
);
box2d.b2Fixture.prototype.Destroy = function () {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === this.m_proxyCount);
  this.m_shape = null;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "Destroy",
  box2d.b2Fixture.prototype.Destroy
);
box2d.b2Fixture.prototype.CreateProxies = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === this.m_proxyCount);
  this.m_proxyCount = this.m_shape.GetChildCount();
  for (var c = 0; c < this.m_proxyCount; ++c) {
    var d = this.m_proxies[c];
    this.m_shape.ComputeAABB(d.aabb, b, c);
    d.proxy = a.CreateProxy(d.aabb, d);
    d.fixture = this;
    d.childIndex = c;
  }
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "CreateProxies",
  box2d.b2Fixture.prototype.CreateProxies
);
box2d.b2Fixture.prototype.DestroyProxies = function (a) {
  for (var b = 0; b < this.m_proxyCount; ++b) {
    var c = this.m_proxies[b];
    a.DestroyProxy(c.proxy);
    c.proxy = null;
  }
  this.m_proxyCount = 0;
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "DestroyProxies",
  box2d.b2Fixture.prototype.DestroyProxies
);
box2d.b2Fixture.prototype.Synchronize = function (a, b, c) {
  if (0 !== this.m_proxyCount)
    for (var d = 0; d < this.m_proxyCount; ++d) {
      var e = this.m_proxies[d],
        f = box2d.b2Fixture.prototype.Synchronize.s_aabb1,
        g = box2d.b2Fixture.prototype.Synchronize.s_aabb2;
      this.m_shape.ComputeAABB(f, b, d);
      this.m_shape.ComputeAABB(g, c, d);
      e.aabb.Combine2(f, g);
      f = box2d.b2Sub_V2_V2(
        c.p,
        b.p,
        box2d.b2Fixture.prototype.Synchronize.s_displacement
      );
      a.MoveProxy(e.proxy, e.aabb, f);
    }
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "Synchronize",
  box2d.b2Fixture.prototype.Synchronize
);
box2d.b2Fixture.prototype.Synchronize.s_aabb1 = new box2d.b2AABB();
box2d.b2Fixture.prototype.Synchronize.s_aabb2 = new box2d.b2AABB();
box2d.b2Fixture.prototype.Synchronize.s_displacement = new box2d.b2Vec2();
box2d.b2Fixture.prototype.SetFilterData = function (a) {
  this.m_filter.Copy(a);
  this.Refilter();
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetFilterData",
  box2d.b2Fixture.prototype.SetFilterData
);
box2d.b2Fixture.prototype.Refilter = function () {
  if (null !== this.m_body) {
    for (var a = this.m_body.GetContactList(); a; ) {
      var b = a.contact,
        c = b.GetFixtureA(),
        d = b.GetFixtureB();
      (c !== this && d !== this) || b.FlagForFiltering();
      a = a.next;
    }
    a = this.m_body.GetWorld();
    if (null !== a)
      for (
        a = a.m_contactManager.m_broadPhase, b = 0;
        b < this.m_proxyCount;
        ++b
      )
        a.TouchProxy(this.m_proxies[b].proxy);
  }
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "Refilter",
  box2d.b2Fixture.prototype.Refilter
);
box2d.b2Fixture.prototype.SetSensor = function (a) {
  a !== this.m_isSensor && (this.m_body.SetAwake(!0), (this.m_isSensor = a));
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "SetSensor",
  box2d.b2Fixture.prototype.SetSensor
);
box2d.b2Fixture.prototype.Dump = function (a) {
  box2d.DEBUG &&
    (box2d.b2Log(
      "    /*box2d.b2FixtureDef*/ var fd = new box2d.b2FixtureDef();\n"
    ),
    box2d.b2Log("    fd.friction = %.15f;\n", this.m_friction),
    box2d.b2Log("    fd.restitution = %.15f;\n", this.m_restitution),
    box2d.b2Log("    fd.density = %.15f;\n", this.m_density),
    box2d.b2Log("    fd.isSensor = %s;\n", this.m_isSensor ? "true" : "false"),
    box2d.b2Log(
      "    fd.filter.categoryBits = %d;\n",
      this.m_filter.categoryBits
    ),
    box2d.b2Log("    fd.filter.maskBits = %d;\n", this.m_filter.maskBits),
    box2d.b2Log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex),
    this.m_shape.Dump(),
    box2d.b2Log("\n"),
    box2d.b2Log("    fd.shape = shape;\n"),
    box2d.b2Log("\n"),
    box2d.b2Log("    bodies[%d].CreateFixture(fd);\n", a));
};
goog.exportProperty(
  box2d.b2Fixture.prototype,
  "Dump",
  box2d.b2Fixture.prototype.Dump
);
box2d.b2BodyType = {
  b2_unknown: -1,
  b2_staticBody: 0,
  b2_kinematicBody: 1,
  b2_dynamicBody: 2,
  b2_bulletBody: 3,
};
goog.exportSymbol("box2d.b2BodyType", box2d.b2BodyType);
goog.exportProperty(
  box2d.b2BodyType,
  "b2_unknown",
  box2d.b2BodyType.b2_unknown
);
goog.exportProperty(
  box2d.b2BodyType,
  "b2_staticBody",
  box2d.b2BodyType.b2_staticBody
);
goog.exportProperty(
  box2d.b2BodyType,
  "b2_kinematicBody",
  box2d.b2BodyType.b2_kinematicBody
);
goog.exportProperty(
  box2d.b2BodyType,
  "b2_dynamicBody",
  box2d.b2BodyType.b2_dynamicBody
);
goog.exportProperty(
  box2d.b2BodyType,
  "b2_bulletBody",
  box2d.b2BodyType.b2_bulletBody
);
box2d.b2BodyDef = function () {
  this.position = new box2d.b2Vec2(0, 0);
  this.linearVelocity = new box2d.b2Vec2(0, 0);
};
goog.exportSymbol("box2d.b2BodyDef", box2d.b2BodyDef);
box2d.b2BodyDef.prototype.type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "type",
  box2d.b2BodyDef.prototype.type
);
box2d.b2BodyDef.prototype.position = null;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "position",
  box2d.b2BodyDef.prototype.position
);
box2d.b2BodyDef.prototype.angle = 0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "angle",
  box2d.b2BodyDef.prototype.angle
);
box2d.b2BodyDef.prototype.linearVelocity = null;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "linearVelocity",
  box2d.b2BodyDef.prototype.linearVelocity
);
box2d.b2BodyDef.prototype.angularVelocity = 0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "angularVelocity",
  box2d.b2BodyDef.prototype.angularVelocity
);
box2d.b2BodyDef.prototype.linearDamping = 0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "linearDamping",
  box2d.b2BodyDef.prototype.linearDamping
);
box2d.b2BodyDef.prototype.angularDamping = 0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "angularDamping",
  box2d.b2BodyDef.prototype.angularDamping
);
box2d.b2BodyDef.prototype.allowSleep = !0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "allowSleep",
  box2d.b2BodyDef.prototype.allowSleep
);
box2d.b2BodyDef.prototype.awake = !0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "awake",
  box2d.b2BodyDef.prototype.awake
);
box2d.b2BodyDef.prototype.fixedRotation = !1;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "fixedRotation",
  box2d.b2BodyDef.prototype.fixedRotation
);
box2d.b2BodyDef.prototype.bullet = !1;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "bullet",
  box2d.b2BodyDef.prototype.bullet
);
box2d.b2BodyDef.prototype.active = !0;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "active",
  box2d.b2BodyDef.prototype.active
);
box2d.b2BodyDef.prototype.userData = null;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "userData",
  box2d.b2BodyDef.prototype.userData
);
box2d.b2BodyDef.prototype.gravityScale = 1;
goog.exportProperty(
  box2d.b2BodyDef.prototype,
  "gravityScale",
  box2d.b2BodyDef.prototype.gravityScale
);
box2d.b2Body = function (a, b) {
  this.m_xf = new box2d.b2Transform();
  this.m_out_xf = new box2d.b2Transform();
  this.m_xf0 = new box2d.b2Transform();
  this.m_sweep = new box2d.b2Sweep();
  this.m_out_sweep = new box2d.b2Sweep();
  this.m_linearVelocity = new box2d.b2Vec2();
  this.m_out_linearVelocity = new box2d.b2Vec2();
  this.m_force = new box2d.b2Vec2();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.position.IsValid());
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.linearVelocity.IsValid());
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angle));
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angularVelocity));
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.gravityScale) && 0 <= a.gravityScale);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.angularDamping) && 0 <= a.angularDamping);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.linearDamping) && 0 <= a.linearDamping);
  a.bullet && (this.m_flag_bulletFlag = !0);
  a.fixedRotation && (this.m_flag_fixedRotationFlag = !0);
  a.allowSleep && (this.m_flag_autoSleepFlag = !0);
  a.awake && (this.m_flag_awakeFlag = !0);
  a.active && (this.m_flag_activeFlag = !0);
  this.m_world = b;
  this.m_xf.p.Copy(a.position);
  this.m_xf.q.SetAngle(a.angle);
  this.m_xf0.Copy(this.m_xf);
  this.m_sweep.localCenter.SetZero();
  this.m_sweep.c0.Copy(this.m_xf.p);
  this.m_sweep.c.Copy(this.m_xf.p);
  this.m_sweep.a0 = a.angle;
  this.m_sweep.a = a.angle;
  this.m_sweep.alpha0 = 0;
  this.m_linearVelocity.Copy(a.linearVelocity);
  this.m_angularVelocity = a.angularVelocity;
  this.m_linearDamping = a.linearDamping;
  this.m_angularDamping = a.angularDamping;
  this.m_gravityScale = a.gravityScale;
  this.m_force.SetZero();
  this.m_sleepTime = this.m_torque = 0;
  this.m_type = a.type;
  this.m_invMass =
    a.type === box2d.b2BodyType.b2_dynamicBody
      ? (this.m_mass = 1)
      : (this.m_mass = 0);
  this.m_invI = this.m_I = 0;
  this.m_userData = a.userData;
  this.m_fixtureList = null;
  this.m_fixtureCount = 0;
  this.m_controllerList = null;
  this.m_controllerCount = 0;
};
goog.exportSymbol("box2d.b2Body", box2d.b2Body);
box2d.b2Body.prototype.m_flag_islandFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_islandFlag",
  box2d.b2Body.prototype.m_flag_islandFlag
);
box2d.b2Body.prototype.m_flag_awakeFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_awakeFlag",
  box2d.b2Body.prototype.m_flag_awakeFlag
);
box2d.b2Body.prototype.m_flag_autoSleepFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_autoSleepFlag",
  box2d.b2Body.prototype.m_flag_autoSleepFlag
);
box2d.b2Body.prototype.m_flag_bulletFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_bulletFlag",
  box2d.b2Body.prototype.m_flag_bulletFlag
);
box2d.b2Body.prototype.m_flag_fixedRotationFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_fixedRotationFlag",
  box2d.b2Body.prototype.m_flag_fixedRotationFlag
);
box2d.b2Body.prototype.m_flag_activeFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_activeFlag",
  box2d.b2Body.prototype.m_flag_activeFlag
);
box2d.b2Body.prototype.m_flag_toiFlag = !1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_flag_toiFlag",
  box2d.b2Body.prototype.m_flag_toiFlag
);
box2d.b2Body.prototype.m_islandIndex = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_islandIndex",
  box2d.b2Body.prototype.m_islandIndex
);
box2d.b2Body.prototype.m_world = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_world",
  box2d.b2Body.prototype.m_world
);
box2d.b2Body.prototype.m_xf = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_xf",
  box2d.b2Body.prototype.m_xf
);
box2d.b2Body.prototype.m_out_xf = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_out_xf",
  box2d.b2Body.prototype.m_out_xf
);
box2d.b2Body.prototype.m_xf0 = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_xf0",
  box2d.b2Body.prototype.m_xf0
);
box2d.b2Body.prototype.m_sweep = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_sweep",
  box2d.b2Body.prototype.m_sweep
);
box2d.b2Body.prototype.m_out_sweep = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_out_sweep",
  box2d.b2Body.prototype.m_out_sweep
);
box2d.b2Body.prototype.m_jointList = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_jointList",
  box2d.b2Body.prototype.m_jointList
);
box2d.b2Body.prototype.m_contactList = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_contactList",
  box2d.b2Body.prototype.m_contactList
);
box2d.b2Body.prototype.m_prev = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_prev",
  box2d.b2Body.prototype.m_prev
);
box2d.b2Body.prototype.m_next = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_next",
  box2d.b2Body.prototype.m_next
);
box2d.b2Body.prototype.m_linearVelocity = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_linearVelocity",
  box2d.b2Body.prototype.m_linearVelocity
);
box2d.b2Body.prototype.m_out_linearVelocity = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_out_linearVelocity",
  box2d.b2Body.prototype.m_out_linearVelocity
);
box2d.b2Body.prototype.m_angularVelocity = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_angularVelocity",
  box2d.b2Body.prototype.m_angularVelocity
);
box2d.b2Body.prototype.m_linearDamping = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_linearDamping",
  box2d.b2Body.prototype.m_linearDamping
);
box2d.b2Body.prototype.m_angularDamping = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_angularDamping",
  box2d.b2Body.prototype.m_angularDamping
);
box2d.b2Body.prototype.m_gravityScale = 1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_gravityScale",
  box2d.b2Body.prototype.m_gravityScale
);
box2d.b2Body.prototype.m_force = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_force",
  box2d.b2Body.prototype.m_force
);
box2d.b2Body.prototype.m_torque = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_torque",
  box2d.b2Body.prototype.m_torque
);
box2d.b2Body.prototype.m_sleepTime = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_sleepTime",
  box2d.b2Body.prototype.m_sleepTime
);
box2d.b2Body.prototype.m_type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_type",
  box2d.b2Body.prototype.m_type
);
box2d.b2Body.prototype.m_mass = 1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_mass",
  box2d.b2Body.prototype.m_mass
);
box2d.b2Body.prototype.m_invMass = 1;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_invMass",
  box2d.b2Body.prototype.m_invMass
);
box2d.b2Body.prototype.m_I = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_I", box2d.b2Body.prototype.m_I);
box2d.b2Body.prototype.m_invI = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_invI",
  box2d.b2Body.prototype.m_invI
);
box2d.b2Body.prototype.m_userData = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_userData",
  box2d.b2Body.prototype.m_userData
);
box2d.b2Body.prototype.m_fixtureList = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_fixtureList",
  box2d.b2Body.prototype.m_fixtureList
);
box2d.b2Body.prototype.m_fixtureCount = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_fixtureCount",
  box2d.b2Body.prototype.m_fixtureCount
);
box2d.b2Body.prototype.m_controllerList = null;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_controllerList",
  box2d.b2Body.prototype.m_controllerList
);
box2d.b2Body.prototype.m_controllerCount = 0;
goog.exportProperty(
  box2d.b2Body.prototype,
  "m_controllerCount",
  box2d.b2Body.prototype.m_controllerCount
);
box2d.b2Body.prototype.CreateFixture = function (a, b) {
  if (a instanceof box2d.b2FixtureDef) return this.CreateFixture_Def(a);
  if (a instanceof box2d.b2Shape && "number" === typeof b)
    return this.CreateFixture_Shape_Density(a, b);
  throw Error();
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "CreateFixture",
  box2d.b2Body.prototype.CreateFixture
);
box2d.b2Body.prototype.CreateFixture_Def = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (this.m_world.IsLocked()) return null;
  var b = new box2d.b2Fixture();
  b.Create(this, a);
  this.m_flag_activeFlag &&
    b.CreateProxies(this.m_world.m_contactManager.m_broadPhase, this.m_xf);
  b.m_next = this.m_fixtureList;
  this.m_fixtureList = b;
  ++this.m_fixtureCount;
  b.m_body = this;
  0 < b.m_density && this.ResetMassData();
  this.m_world.m_flag_newFixture = !0;
  return b;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "CreateFixture_Def",
  box2d.b2Body.prototype.CreateFixture_Def
);
box2d.b2Body.prototype.CreateFixture_Shape_Density = function (a, b) {
  var c = box2d.b2Body.prototype.CreateFixture_Shape_Density.s_def;
  c.shape = a;
  c.density = "number" === typeof b ? b : 0;
  return this.CreateFixture_Def(c);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "CreateFixture_Shape_Density",
  box2d.b2Body.prototype.CreateFixture_Shape_Density
);
box2d.b2Body.prototype.CreateFixture_Shape_Density.s_def = new box2d.b2FixtureDef();
box2d.b2Body.prototype.DestroyFixture = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (!this.m_world.IsLocked()) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.m_body === this);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_fixtureCount);
    for (var b = this.m_fixtureList, c = null, d = !1; null !== b; ) {
      if (b === a) {
        c ? (c.m_next = a.m_next) : (this.m_fixtureList = a.m_next);
        d = !0;
        break;
      }
      c = b;
      b = b.m_next;
    }
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d);
    for (b = this.m_contactList; b; ) {
      var c = b.contact,
        b = b.next,
        d = c.GetFixtureA(),
        e = c.GetFixtureB();
      (a !== d && a !== e) || this.m_world.m_contactManager.Destroy(c);
    }
    this.m_flag_activeFlag &&
      a.DestroyProxies(this.m_world.m_contactManager.m_broadPhase);
    a.Destroy();
    a.m_body = null;
    a.m_next = null;
    --this.m_fixtureCount;
    this.ResetMassData();
  }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "DestroyFixture",
  box2d.b2Body.prototype.DestroyFixture
);
box2d.b2Body.prototype.SetTransform = function (a, b, c) {
  if (a instanceof box2d.b2Vec2 && "number" === typeof b)
    this.SetTransform_X_Y_A(a.x, a.y, b);
  else if (a instanceof box2d.b2Transform)
    this.SetTransform_X_Y_A(a.p.x, a.p.y, a.GetAngle());
  else if (
    "number" === typeof a &&
    "number" === typeof b &&
    "number" === typeof c
  )
    this.SetTransform_X_Y_A(a, b, c);
  else throw Error();
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetTransform",
  box2d.b2Body.prototype.SetTransform
);
box2d.b2Body.prototype.SetTransform_V2_A = function (a, b) {
  this.SetTransform_X_Y_A(a.x, a.y, b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetTransform_V2_A",
  box2d.b2Body.prototype.SetTransform_V2_A
);
box2d.b2Body.prototype.SetTransform_X_Y_A = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (
    !this.m_world.IsLocked() &&
    (this.m_xf.p.x !== a || this.m_xf.p.y !== b || this.m_xf.q.GetAngle() !== c)
  )
    for (
      this.m_xf.q.SetAngle(c),
        this.m_xf.p.Set(a, b),
        this.m_xf0.Copy(this.m_xf),
        box2d.b2Mul_X_V2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c),
        this.m_sweep.a = c,
        this.m_sweep.c0.Copy(this.m_sweep.c),
        this.m_sweep.a0 = c,
        a = this.m_world.m_contactManager.m_broadPhase,
        b = this.m_fixtureList;
      b;
      b = b.m_next
    )
      b.Synchronize(a, this.m_xf, this.m_xf);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetTransform_X_Y_A",
  box2d.b2Body.prototype.SetTransform_X_Y_A
);
box2d.b2Body.prototype.SetTransform_X = function (a) {
  this.SetTransform_X_Y_A(a.p.x, a.p.y, a.GetAngle());
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetTransform_X",
  box2d.b2Body.prototype.SetTransform_X
);
box2d.b2Body.prototype.GetTransform = function (a) {
  a = a || this.m_out_xf;
  return a.Copy(this.m_xf);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetTransform",
  box2d.b2Body.prototype.GetTransform
);
box2d.b2Body.prototype.GetPosition = function (a) {
  a = a || this.m_out_xf.p;
  return a.Copy(this.m_xf.p);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetPosition",
  box2d.b2Body.prototype.GetPosition
);
box2d.b2Body.prototype.SetPosition = function (a) {
  this.SetTransform_V2_A(a, this.GetAngle());
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetPosition",
  box2d.b2Body.prototype.SetPosition
);
box2d.b2Body.prototype.SetPositionXY = function (a, b) {
  this.SetTransform_X_Y_A(a, b, this.GetAngle());
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetPositionXY",
  box2d.b2Body.prototype.SetPositionXY
);
box2d.b2Body.prototype.GetRotation = function (a) {
  a = a || this.m_out_xf.q;
  return a.Copy(this.m_xf.q);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetRotation",
  box2d.b2Body.prototype.GetRotation
);
box2d.b2Body.prototype.SetRotation = function (a) {
  this.SetTransform_V2_A(this.GetPosition(), a.GetAngle());
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetRotation",
  box2d.b2Body.prototype.SetRotation
);
box2d.b2Body.prototype.GetAngle = function () {
  return this.m_sweep.a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetAngle",
  box2d.b2Body.prototype.GetAngle
);
box2d.b2Body.prototype.SetAngle = function (a) {
  this.SetTransform_V2_A(this.GetPosition(), a);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetAngle",
  box2d.b2Body.prototype.SetAngle
);
box2d.b2Body.prototype.GetWorldCenter = function (a) {
  a = a || this.m_out_sweep.c;
  return a.Copy(this.m_sweep.c);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetWorldCenter",
  box2d.b2Body.prototype.GetWorldCenter
);
box2d.b2Body.prototype.GetLocalCenter = function (a) {
  a = a || this.m_out_sweep.localCenter;
  return a.Copy(this.m_sweep.localCenter);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLocalCenter",
  box2d.b2Body.prototype.GetLocalCenter
);
box2d.b2Body.prototype.SetLinearVelocity = function (a) {
  this.m_type !== box2d.b2BodyType.b2_staticBody &&
    (0 < box2d.b2Dot_V2_V2(a, a) && this.SetAwake(!0),
    this.m_linearVelocity.Copy(a));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetLinearVelocity",
  box2d.b2Body.prototype.SetLinearVelocity
);
box2d.b2Body.prototype.GetLinearVelocity = function (a) {
  a = a || this.m_out_linearVelocity;
  return a.Copy(this.m_linearVelocity);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLinearVelocity",
  box2d.b2Body.prototype.GetLinearVelocity
);
box2d.b2Body.prototype.SetAngularVelocity = function (a) {
  this.m_type !== box2d.b2BodyType.b2_staticBody &&
    (0 < a * a && this.SetAwake(!0), (this.m_angularVelocity = a));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetAngularVelocity",
  box2d.b2Body.prototype.SetAngularVelocity
);
box2d.b2Body.prototype.GetAngularVelocity = function () {
  return this.m_angularVelocity;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetAngularVelocity",
  box2d.b2Body.prototype.GetAngularVelocity
);
box2d.b2Body.prototype.GetDefinition = function (a) {
  a.type = this.GetType();
  a.allowSleep = this.m_flag_autoSleepFlag;
  a.angle = this.GetAngle();
  a.angularDamping = this.m_angularDamping;
  a.gravityScale = this.m_gravityScale;
  a.angularVelocity = this.m_angularVelocity;
  a.fixedRotation = this.m_flag_fixedRotationFlag;
  a.bullet = this.m_flag_bulletFlag;
  a.awake = this.m_flag_awakeFlag;
  a.linearDamping = this.m_linearDamping;
  a.linearVelocity.Copy(this.GetLinearVelocity());
  a.position.Copy(this.GetPosition());
  a.userData = this.GetUserData();
  return a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetDefinition",
  box2d.b2Body.prototype.GetDefinition
);
box2d.b2Body.prototype.ApplyForce = function (a, b, c) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (!this.m_flag_awakeFlag && this.SetAwake(!0),
    this.m_flag_awakeFlag &&
      ((this.m_force.x += a.x),
      (this.m_force.y += a.y),
      (this.m_torque +=
        (b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x)));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyForce",
  box2d.b2Body.prototype.ApplyForce
);
box2d.b2Body.prototype.ApplyForceToCenter = function (a, b) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (("boolean" === typeof b ? b : 1) &&
      !this.m_flag_awakeFlag &&
      this.SetAwake(!0),
    this.m_flag_awakeFlag &&
      ((this.m_force.x += a.x), (this.m_force.y += a.y)));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyForceToCenter",
  box2d.b2Body.prototype.ApplyForceToCenter
);
box2d.b2Body.prototype.ApplyTorque = function (a, b) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (("boolean" === typeof b ? b : 1) &&
      !this.m_flag_awakeFlag &&
      this.SetAwake(!0),
    this.m_flag_awakeFlag && (this.m_torque += a));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyTorque",
  box2d.b2Body.prototype.ApplyTorque
);
box2d.b2Body.prototype.ApplyLinearImpulse = function (a, b, c) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (("boolean" === typeof c ? c : 1) &&
      !this.m_flag_awakeFlag &&
      this.SetAwake(!0),
    this.m_flag_awakeFlag &&
      ((this.m_linearVelocity.x += this.m_invMass * a.x),
      (this.m_linearVelocity.y += this.m_invMass * a.y),
      (this.m_angularVelocity +=
        this.m_invI *
        ((b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x))));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyLinearImpulse",
  box2d.b2Body.prototype.ApplyLinearImpulse
);
box2d.b2Body.prototype.ApplyLinearImpulseToCenter = function (a, b) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (("boolean" === typeof b ? b : 1) &&
      !this.m_flag_awakeFlag &&
      this.SetAwake(!0),
    this.m_flag_awakeFlag &&
      ((this.m_linearVelocity.x += this.m_invMass * a.x),
      (this.m_linearVelocity.y += this.m_invMass * a.y)));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyLinearImpulseToCenter",
  box2d.b2Body.prototype.ApplyLinearImpulseToCenter
);
box2d.b2Body.prototype.ApplyAngularImpulse = function (a, b) {
  this.m_type === box2d.b2BodyType.b2_dynamicBody &&
    (("boolean" === typeof b ? b : 1) &&
      !this.m_flag_awakeFlag &&
      this.SetAwake(!0),
    this.m_flag_awakeFlag && (this.m_angularVelocity += this.m_invI * a));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ApplyAngularImpulse",
  box2d.b2Body.prototype.ApplyAngularImpulse
);
box2d.b2Body.prototype.GetMass = function () {
  return this.m_mass;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetMass",
  box2d.b2Body.prototype.GetMass
);
box2d.b2Body.prototype.GetInertia = function () {
  return (
    this.m_I +
    this.m_mass *
      box2d.b2Dot_V2_V2(this.m_sweep.localCenter, this.m_sweep.localCenter)
  );
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetInertia",
  box2d.b2Body.prototype.GetInertia
);
box2d.b2Body.prototype.GetMassData = function (a) {
  a.mass = this.m_mass;
  a.I =
    this.m_I +
    this.m_mass *
      box2d.b2Dot_V2_V2(this.m_sweep.localCenter, this.m_sweep.localCenter);
  a.center.Copy(this.m_sweep.localCenter);
  return a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetMassData",
  box2d.b2Body.prototype.GetMassData
);
box2d.b2Body.prototype.SetMassData = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (
    !this.m_world.IsLocked() &&
    this.m_type === box2d.b2BodyType.b2_dynamicBody
  ) {
    this.m_invI = this.m_I = this.m_invMass = 0;
    this.m_mass = a.mass;
    0 >= this.m_mass && (this.m_mass = 1);
    this.m_invMass = 1 / this.m_mass;
    0 < a.I &&
      !this.m_flag_fixedRotationFlag &&
      ((this.m_I = a.I - this.m_mass * box2d.b2Dot_V2_V2(a.center, a.center)),
      box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I),
      (this.m_invI = 1 / this.m_I));
    var b = box2d.b2Body.prototype.SetMassData.s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(a.center);
    box2d.b2Mul_X_V2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);
    box2d.b2AddCross_V2_S_V2(
      this.m_linearVelocity,
      this.m_angularVelocity,
      box2d.b2Sub_V2_V2(this.m_sweep.c, b, box2d.b2Vec2.s_t0),
      this.m_linearVelocity
    );
  }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetMassData",
  box2d.b2Body.prototype.SetMassData
);
box2d.b2Body.prototype.SetMassData.s_oldCenter = new box2d.b2Vec2();
box2d.b2Body.prototype.ResetMassData = function () {
  this.m_invI = this.m_I = this.m_invMass = this.m_mass = 0;
  this.m_sweep.localCenter.SetZero();
  if (
    this.m_type === box2d.b2BodyType.b2_staticBody ||
    this.m_type === box2d.b2BodyType.b2_kinematicBody
  )
    this.m_sweep.c0.Copy(this.m_xf.p),
      this.m_sweep.c.Copy(this.m_xf.p),
      (this.m_sweep.a0 = this.m_sweep.a);
  else {
    box2d.ENABLE_ASSERTS &&
      box2d.b2Assert(this.m_type === box2d.b2BodyType.b2_dynamicBody);
    for (
      var a = box2d.b2Body.prototype.ResetMassData.s_localCenter.SetZero(),
        b = this.m_fixtureList;
      b;
      b = b.m_next
    )
      if (0 !== b.m_density) {
        var c = b.GetMassData(box2d.b2Body.prototype.ResetMassData.s_massData);
        this.m_mass += c.mass;
        a.x += c.center.x * c.mass;
        a.y += c.center.y * c.mass;
        this.m_I += c.I;
      }
    0 < this.m_mass
      ? ((this.m_invMass = 1 / this.m_mass),
        (a.x *= this.m_invMass),
        (a.y *= this.m_invMass))
      : (this.m_invMass = this.m_mass = 1);
    0 < this.m_I && !this.m_flag_fixedRotationFlag
      ? ((this.m_I -= this.m_mass * box2d.b2Dot_V2_V2(a, a)),
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I),
        (this.m_invI = 1 / this.m_I))
      : (this.m_invI = this.m_I = 0);
    b = box2d.b2Body.prototype.ResetMassData.s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(a);
    box2d.b2Mul_X_V2(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);
    box2d.b2AddCross_V2_S_V2(
      this.m_linearVelocity,
      this.m_angularVelocity,
      box2d.b2Sub_V2_V2(this.m_sweep.c, b, box2d.b2Vec2.s_t0),
      this.m_linearVelocity
    );
  }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ResetMassData",
  box2d.b2Body.prototype.ResetMassData
);
box2d.b2Body.prototype.ResetMassData.s_localCenter = new box2d.b2Vec2();
box2d.b2Body.prototype.ResetMassData.s_oldCenter = new box2d.b2Vec2();
box2d.b2Body.prototype.ResetMassData.s_massData = new box2d.b2MassData();
box2d.b2Body.prototype.GetWorldPoint = function (a, b) {
  return box2d.b2Mul_X_V2(this.m_xf, a, b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetWorldPoint",
  box2d.b2Body.prototype.GetWorldPoint
);
box2d.b2Body.prototype.GetWorldVector = function (a, b) {
  return box2d.b2Mul_R_V2(this.m_xf.q, a, b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetWorldVector",
  box2d.b2Body.prototype.GetWorldVector
);
box2d.b2Body.prototype.GetLocalPoint = function (a, b) {
  return box2d.b2MulT_X_V2(this.m_xf, a, b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLocalPoint",
  box2d.b2Body.prototype.GetLocalPoint
);
box2d.b2Body.prototype.GetLocalVector = function (a, b) {
  return box2d.b2MulT_R_V2(this.m_xf.q, a, b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLocalVector",
  box2d.b2Body.prototype.GetLocalVector
);
box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint = function (a, b) {
  return box2d.b2AddCross_V2_S_V2(
    this.m_linearVelocity,
    this.m_angularVelocity,
    box2d.b2Sub_V2_V2(a, this.m_sweep.c, box2d.b2Vec2.s_t0),
    b
  );
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLinearVelocityFromWorldPoint",
  box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint
);
box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint = function (a, b) {
  return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(a, b), b);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLinearVelocityFromLocalPoint",
  box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint
);
box2d.b2Body.prototype.GetLinearDamping = function () {
  return this.m_linearDamping;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetLinearDamping",
  box2d.b2Body.prototype.GetLinearDamping
);
box2d.b2Body.prototype.SetLinearDamping = function (a) {
  this.m_linearDamping = a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetLinearDamping",
  box2d.b2Body.prototype.SetLinearDamping
);
box2d.b2Body.prototype.GetAngularDamping = function () {
  return this.m_angularDamping;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetAngularDamping",
  box2d.b2Body.prototype.GetAngularDamping
);
box2d.b2Body.prototype.SetAngularDamping = function (a) {
  this.m_angularDamping = a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetAngularDamping",
  box2d.b2Body.prototype.SetAngularDamping
);
box2d.b2Body.prototype.GetGravityScale = function () {
  return this.m_gravityScale;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetGravityScale",
  box2d.b2Body.prototype.GetGravityScale
);
box2d.b2Body.prototype.SetGravityScale = function (a) {
  this.m_gravityScale = a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetGravityScale",
  box2d.b2Body.prototype.SetGravityScale
);
box2d.b2Body.prototype.SetType = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (!this.m_world.IsLocked() && this.m_type !== a) {
    this.m_type = a;
    this.ResetMassData();
    this.m_type === box2d.b2BodyType.b2_staticBody &&
      (this.m_linearVelocity.SetZero(),
      (this.m_angularVelocity = 0),
      (this.m_sweep.a0 = this.m_sweep.a),
      this.m_sweep.c0.Copy(this.m_sweep.c),
      this.SynchronizeFixtures());
    this.SetAwake(!0);
    this.m_force.SetZero();
    this.m_torque = 0;
    for (a = this.m_contactList; a; ) {
      var b = a;
      a = a.next;
      this.m_world.m_contactManager.Destroy(b.contact);
    }
    this.m_contactList = null;
    a = this.m_world.m_contactManager.m_broadPhase;
    for (b = this.m_fixtureList; b; b = b.m_next)
      for (var c = b.m_proxyCount, d = 0; d < c; ++d)
        a.TouchProxy(b.m_proxies[d].proxy);
  }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetType",
  box2d.b2Body.prototype.SetType
);
box2d.b2Body.prototype.GetType = function () {
  //以下新增
  // if (this.m_type === null) return 0;
  //
  return this.m_type;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetType",
  box2d.b2Body.prototype.GetType
);
box2d.b2Body.prototype.SetBullet = function (a) {
  this.m_flag_bulletFlag = a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetBullet",
  box2d.b2Body.prototype.SetBullet
);
box2d.b2Body.prototype.IsBullet = function () {
  return this.m_flag_bulletFlag;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "IsBullet",
  box2d.b2Body.prototype.IsBullet
);
box2d.b2Body.prototype.SetSleepingAllowed = function (a) {
  a
    ? (this.m_flag_autoSleepFlag = !0)
    : ((this.m_flag_autoSleepFlag = !1), this.SetAwake(!0));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetSleepingAllowed",
  box2d.b2Body.prototype.SetSleepingAllowed
);
box2d.b2Body.prototype.IsSleepingAllowed = function () {
  return this.m_flag_autoSleepFlag;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "IsSleepingAllowed",
  box2d.b2Body.prototype.IsSleepingAllowed
);
box2d.b2Body.prototype.SetAwake = function (a) {
  a
    ? this.m_flag_awakeFlag ||
      ((this.m_flag_awakeFlag = !0), (this.m_sleepTime = 0))
    : ((this.m_flag_awakeFlag = !1),
      (this.m_sleepTime = 0),
      this.m_linearVelocity.SetZero(),
      (this.m_angularVelocity = 0),
      this.m_force.SetZero(),
      (this.m_torque = 0));
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetAwake",
  box2d.b2Body.prototype.SetAwake
);
box2d.b2Body.prototype.IsAwake = function () {
  return this.m_flag_awakeFlag;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "IsAwake",
  box2d.b2Body.prototype.IsAwake
);
box2d.b2Body.prototype.SetActive = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.m_world.IsLocked());
  if (a !== this.IsActive())
    if (a) {
      this.m_flag_activeFlag = !0;
      a = this.m_world.m_contactManager.m_broadPhase;
      for (var b = this.m_fixtureList; b; b = b.m_next)
        b.CreateProxies(a, this.m_xf);
    } else {
      this.m_flag_activeFlag = !1;
      a = this.m_world.m_contactManager.m_broadPhase;
      for (b = this.m_fixtureList; b; b = b.m_next) b.DestroyProxies(a);
      for (a = this.m_contactList; a; )
        (b = a), (a = a.next), this.m_world.m_contactManager.Destroy(b.contact);
      this.m_contactList = null;
    }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetActive",
  box2d.b2Body.prototype.SetActive
);
box2d.b2Body.prototype.IsActive = function () {
  return this.m_flag_activeFlag;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "IsActive",
  box2d.b2Body.prototype.IsActive
);
box2d.b2Body.prototype.SetFixedRotation = function (a) {
  this.m_flag_fixedRotationFlag !== a &&
    ((this.m_flag_fixedRotationFlag = a),
    (this.m_angularVelocity = 0),
    this.ResetMassData());
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetFixedRotation",
  box2d.b2Body.prototype.SetFixedRotation
);
box2d.b2Body.prototype.IsFixedRotation = function () {
  return this.m_flag_fixedRotationFlag;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "IsFixedRotation",
  box2d.b2Body.prototype.IsFixedRotation
);
box2d.b2Body.prototype.GetFixtureList = function () {
  return this.m_fixtureList;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetFixtureList",
  box2d.b2Body.prototype.GetFixtureList
);
box2d.b2Body.prototype.GetJointList = function () {
  return this.m_jointList;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetJointList",
  box2d.b2Body.prototype.GetJointList
);
box2d.b2Body.prototype.GetContactList = function () {
  return this.m_contactList;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetContactList",
  box2d.b2Body.prototype.GetContactList
);
box2d.b2Body.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetNext",
  box2d.b2Body.prototype.GetNext
);
box2d.b2Body.prototype.GetUserData = function () {
  return this.m_userData;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetUserData",
  box2d.b2Body.prototype.GetUserData
);
box2d.b2Body.prototype.SetUserData = function (a) {
  this.m_userData = a;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SetUserData",
  box2d.b2Body.prototype.SetUserData
);
box2d.b2Body.prototype.GetWorld = function () {
  return this.m_world;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetWorld",
  box2d.b2Body.prototype.GetWorld
);
box2d.b2Body.prototype.SynchronizeFixtures = function () {
  var a = box2d.b2Body.prototype.SynchronizeFixtures.s_xf1;
  a.q.SetAngle(this.m_sweep.a0);
  box2d.b2Mul_R_V2(a.q, this.m_sweep.localCenter, a.p);
  box2d.b2Sub_V2_V2(this.m_sweep.c0, a.p, a.p);
  for (
    var b = this.m_world.m_contactManager.m_broadPhase, c = this.m_fixtureList;
    c;
    c = c.m_next
  )
    c.Synchronize(b, a, this.m_xf);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SynchronizeFixtures",
  box2d.b2Body.prototype.SynchronizeFixtures
);
box2d.b2Body.prototype.SynchronizeFixtures.s_xf1 = new box2d.b2Transform();
box2d.b2Body.prototype.SynchronizeTransform = function () {
  this.m_xf.q.SetAngle(this.m_sweep.a);
  box2d.b2Mul_R_V2(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
  box2d.b2Sub_V2_V2(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "SynchronizeTransform",
  box2d.b2Body.prototype.SynchronizeTransform
);
box2d.b2Body.prototype.ShouldCollide = function (a) {
  return this.m_type === box2d.b2BodyType.b2_staticBody &&
    a.m_type === box2d.b2BodyType.b2_staticBody
    ? !1
    : this.ShouldCollideConnected(a);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ShouldCollide",
  box2d.b2Body.prototype.ShouldCollide
);
box2d.b2Body.prototype.ShouldCollideConnected = function (a) {
  for (var b = this.m_jointList; b; b = b.next)
    if (b.other === a && !b.joint.m_collideConnected) return !1;
  return !0;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "ShouldCollideConnected",
  box2d.b2Body.prototype.ShouldCollideConnected
);
box2d.b2Body.prototype.Advance = function (a) {
  this.m_sweep.Advance(a);
  this.m_sweep.c.Copy(this.m_sweep.c0);
  this.m_sweep.a = this.m_sweep.a0;
  this.m_xf.q.SetAngle(this.m_sweep.a);
  box2d.b2Mul_R_V2(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
  box2d.b2Sub_V2_V2(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "Advance",
  box2d.b2Body.prototype.Advance
);
box2d.b2Body.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_islandIndex;
    box2d.b2Log("{\n");
    box2d.b2Log("  /*box2d.b2BodyDef*/ var bd = new box2d.b2BodyDef();\n");
    var b = "";
    switch (this.m_type) {
      case box2d.b2BodyType.b2_staticBody:
        b = "box2d.b2BodyType.b2_staticBody";
        break;
      case box2d.b2BodyType.b2_kinematicBody:
        b = "box2d.b2BodyType.b2_kinematicBody";
        break;
      case box2d.b2BodyType.b2_dynamicBody:
        b = "box2d.b2BodyType.b2_dynamicBody";
        break;
      default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
    }
    box2d.b2Log("  bd.type = %s;\n", b);
    box2d.b2Log(
      "  bd.position.Set(%.15f, %.15f);\n",
      this.m_xf.p.x,
      this.m_xf.p.y
    );
    box2d.b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
    box2d.b2Log(
      "  bd.linearVelocity.Set(%.15f, %.15f);\n",
      this.m_linearVelocity.x,
      this.m_linearVelocity.y
    );
    box2d.b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
    box2d.b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
    box2d.b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
    box2d.b2Log(
      "  bd.allowSleep = %s;\n",
      this.m_flag_autoSleepFlag ? "true" : "false"
    );
    box2d.b2Log("  bd.awake = %s;\n", this.m_flag_awakeFlag ? "true" : "false");
    box2d.b2Log(
      "  bd.fixedRotation = %s;\n",
      this.m_flag_fixedRotationFlag ? "true" : "false"
    );
    box2d.b2Log(
      "  bd.bullet = %s;\n",
      this.m_flag_bulletFlag ? "true" : "false"
    );
    box2d.b2Log(
      "  bd.active = %s;\n",
      this.m_flag_activeFlag ? "true" : "false"
    );
    box2d.b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
    box2d.b2Log("\n");
    box2d.b2Log(
      "  bodies[%d] = this.m_world.CreateBody(bd);\n",
      this.m_islandIndex
    );
    box2d.b2Log("\n");
    for (b = this.m_fixtureList; b; b = b.m_next)
      box2d.b2Log("  {\n"), b.Dump(a), box2d.b2Log("  }\n");
    box2d.b2Log("}\n");
  }
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "Dump",
  box2d.b2Body.prototype.Dump
);
box2d.b2Body.prototype.GetControllerList = function () {
  return this.m_controllerList;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetControllerList",
  box2d.b2Body.prototype.GetControllerList
);
box2d.b2Body.prototype.GetControllerCount = function () {
  return this.m_controllerCount;
};
goog.exportProperty(
  box2d.b2Body.prototype,
  "GetControllerCount",
  box2d.b2Body.prototype.GetControllerCount
);
box2d.b2Profile = function () {};
goog.exportSymbol("box2d.b2Profile", box2d.b2Profile);
box2d.b2Profile.prototype.step = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "step",
  box2d.b2Profile.prototype.step
);
box2d.b2Profile.prototype.collide = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "collide",
  box2d.b2Profile.prototype.collide
);
box2d.b2Profile.prototype.solve = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "solve",
  box2d.b2Profile.prototype.solve
);
box2d.b2Profile.prototype.solveInit = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "solveInit",
  box2d.b2Profile.prototype.solveInit
);
box2d.b2Profile.prototype.solveVelocity = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "solveVelocity",
  box2d.b2Profile.prototype.solveVelocity
);
box2d.b2Profile.prototype.solvePosition = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "solvePosition",
  box2d.b2Profile.prototype.solvePosition
);
box2d.b2Profile.prototype.broadphase = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "broadphase",
  box2d.b2Profile.prototype.broadphase
);
box2d.b2Profile.prototype.solveTOI = 0;
goog.exportProperty(
  box2d.b2Profile.prototype,
  "solveTOI",
  box2d.b2Profile.prototype.solveTOI
);
box2d.b2Profile.prototype.Reset = function () {
  this.solveTOI = this.broadphase = this.solvePosition = this.solveVelocity = this.solveInit = this.solve = this.collide = this.step = 0;
  return this;
};
goog.exportProperty(
  box2d.b2Profile.prototype,
  "Reset",
  box2d.b2Profile.prototype.Reset
);
box2d.b2TimeStep = function () {};
goog.exportSymbol("box2d.b2TimeStep", box2d.b2TimeStep);
box2d.b2TimeStep.prototype.dt = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "dt",
  box2d.b2TimeStep.prototype.dt
);
box2d.b2TimeStep.prototype.inv_dt = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "inv_dt",
  box2d.b2TimeStep.prototype.inv_dt
);
box2d.b2TimeStep.prototype.dtRatio = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "dtRatio",
  box2d.b2TimeStep.prototype.dtRatio
);
box2d.b2TimeStep.prototype.velocityIterations = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "velocityIterations",
  box2d.b2TimeStep.prototype.velocityIterations
);
box2d.b2TimeStep.prototype.positionIterations = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "positionIterations",
  box2d.b2TimeStep.prototype.positionIterations
);
box2d.b2TimeStep.prototype.particleIterations = 0;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "particleIterations",
  box2d.b2TimeStep.prototype.particleIterations
);
box2d.b2TimeStep.prototype.warmStarting = !1;
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "warmStarting",
  box2d.b2TimeStep.prototype.warmStarting
);
box2d.b2TimeStep.prototype.Copy = function (a) {
  this.dt = a.dt;
  this.inv_dt = a.inv_dt;
  this.dtRatio = a.dtRatio;
  this.positionIterations = a.positionIterations;
  this.velocityIterations = a.velocityIterations;
  this.particleIterations = a.particleIterations;
  this.warmStarting = a.warmStarting;
  return this;
};
goog.exportProperty(
  box2d.b2TimeStep.prototype,
  "Copy",
  box2d.b2TimeStep.prototype.Copy
);
box2d.b2Position = function () {
  this.c = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2Position", box2d.b2Position);
box2d.b2Position.prototype.c = null;
goog.exportProperty(
  box2d.b2Position.prototype,
  "c",
  box2d.b2Position.prototype.c
);
box2d.b2Position.prototype.a = 0;
goog.exportProperty(
  box2d.b2Position.prototype,
  "a",
  box2d.b2Position.prototype.a
);
box2d.b2Position.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2Position();
  });
};
goog.exportProperty(box2d.b2Position, "MakeArray", box2d.b2Position.MakeArray);
box2d.b2Velocity = function () {
  this.v = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2Velocity", box2d.b2Velocity);
box2d.b2Velocity.prototype.v = null;
goog.exportProperty(
  box2d.b2Velocity.prototype,
  "v",
  box2d.b2Velocity.prototype.v
);
box2d.b2Velocity.prototype.w = 0;
goog.exportProperty(
  box2d.b2Velocity.prototype,
  "w",
  box2d.b2Velocity.prototype.w
);
box2d.b2Velocity.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2Velocity();
  });
};
goog.exportProperty(box2d.b2Velocity, "MakeArray", box2d.b2Velocity.MakeArray);
box2d.b2SolverData = function () {
  this.step = new box2d.b2TimeStep();
};
goog.exportSymbol("box2d.b2SolverData", box2d.b2SolverData);
box2d.b2SolverData.prototype.step = null;
goog.exportProperty(
  box2d.b2SolverData.prototype,
  "step",
  box2d.b2SolverData.prototype.step
);
box2d.b2SolverData.prototype.positions = null;
goog.exportProperty(
  box2d.b2SolverData.prototype,
  "positions",
  box2d.b2SolverData.prototype.positions
);
box2d.b2SolverData.prototype.velocities = null;
goog.exportProperty(
  box2d.b2SolverData.prototype,
  "velocities",
  box2d.b2SolverData.prototype.velocities
);
box2d.b2WorldCallbacks = {};
box2d.b2DestructionListener = function () {};
goog.exportSymbol("box2d.b2DestructionListener", box2d.b2DestructionListener);
box2d.b2DestructionListener.prototype.SayGoodbyeJoint = function (a) {};
goog.exportProperty(
  box2d.b2DestructionListener.prototype,
  "SayGoodbyeJoint",
  box2d.b2DestructionListener.prototype.SayGoodbyeJoint
);
box2d.b2DestructionListener.prototype.SayGoodbyeFixture = function (a) {};
goog.exportProperty(
  box2d.b2DestructionListener.prototype,
  "SayGoodbyeFixture",
  box2d.b2DestructionListener.prototype.SayGoodbyeFixture
);
box2d.b2DestructionListener.prototype.SayGoodbyeParticleGroup = function (a) {};
box2d.b2DestructionListener.prototype.SayGoodbyeParticle = function (a, b) {};
box2d.b2ContactFilter = function () {};
goog.exportSymbol("box2d.b2ContactFilter", box2d.b2ContactFilter);
box2d.b2ContactFilter.prototype.ShouldCollide = function (a, b) {
  var c = a.GetBody(),
    d = b.GetBody();
  if (
    (d.GetType() === box2d.b2BodyType.b2_staticBody &&
      c.GetType() === box2d.b2BodyType.b2_staticBody) ||
    !1 === d.ShouldCollideConnected(c)
  )
    return !1;
  c = a.GetFilterData();
  d = b.GetFilterData();
  return c.groupIndex === d.groupIndex && 0 !== c.groupIndex
    ? 0 < c.groupIndex
    : 0 !== (c.maskBits & d.categoryBits) &&
        0 !== (c.categoryBits & d.maskBits);
};
goog.exportProperty(
  box2d.b2ContactFilter.prototype,
  "ShouldCollide",
  box2d.b2ContactFilter.prototype.ShouldCollide
);
box2d.b2ContactFilter.prototype.ShouldCollideFixtureParticle = function (
  a,
  b,
  c
) {
  return !0;
};
goog.exportProperty(
  box2d.b2ContactFilter.prototype,
  "ShouldCollideFixtureParticle",
  box2d.b2ContactFilter.prototype.ShouldCollideFixtureParticle
);
box2d.b2ContactFilter.prototype.ShouldCollideParticleParticle = function (
  a,
  b,
  c
) {
  return !0;
};
goog.exportProperty(
  box2d.b2ContactFilter.prototype,
  "ShouldCollideParticleParticle",
  box2d.b2ContactFilter.prototype.ShouldCollideParticleParticle
);
box2d.b2ContactFilter.b2_defaultFilter = new box2d.b2ContactFilter();
box2d.b2ContactImpulse = function () {
  this.normalImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
  this.tangentImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
};
goog.exportSymbol("box2d.b2ContactImpulse", box2d.b2ContactImpulse);
box2d.b2ContactImpulse.prototype.normalImpulses = null;
goog.exportProperty(
  box2d.b2ContactImpulse.prototype,
  "normalImpulses",
  box2d.b2ContactImpulse.prototype.normalImpulses
);
box2d.b2ContactImpulse.prototype.tangentImpulses = null;
goog.exportProperty(
  box2d.b2ContactImpulse.prototype,
  "tangentImpulses",
  box2d.b2ContactImpulse.prototype.tangentImpulses
);
box2d.b2ContactImpulse.prototype.count = 0;
goog.exportProperty(
  box2d.b2ContactImpulse.prototype,
  "count",
  box2d.b2ContactImpulse.prototype.count
);
box2d.b2ContactListener = function () {};
goog.exportSymbol("box2d.b2ContactListener", box2d.b2ContactListener);
box2d.b2ContactListener.prototype.BeginContact = function (a) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "BeginContact",
  box2d.b2ContactListener.prototype.BeginContact
);
box2d.b2ContactListener.prototype.EndContact = function (a) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "EndContact",
  box2d.b2ContactListener.prototype.EndContact
);
box2d.b2ContactListener.prototype.BeginContactFixtureParticle = function (
  a,
  b
) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "BeginContactFixtureParticle",
  box2d.b2ContactListener.prototype.BeginContactFixtureParticle
);
box2d.b2ContactListener.prototype.EndContactFixtureParticle = function (
  a,
  b,
  c
) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "EndContactFixtureParticle",
  box2d.b2ContactListener.prototype.EndContactFixtureParticle
);
box2d.b2ContactListener.prototype.BeginContactParticleParticle = function (
  a,
  b
) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "BeginContactParticleParticle",
  box2d.b2ContactListener.prototype.BeginContactParticleParticle
);
box2d.b2ContactListener.prototype.EndContactParticleParticle = function (
  a,
  b,
  c
) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "EndContactParticleParticle",
  box2d.b2ContactListener.prototype.EndContactParticleParticle
);
box2d.b2ContactListener.prototype.PreSolve = function (a, b) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "PreSolve",
  box2d.b2ContactListener.prototype.PreSolve
);
box2d.b2ContactListener.prototype.PostSolve = function (a, b) {};
goog.exportProperty(
  box2d.b2ContactListener.prototype,
  "PostSolve",
  box2d.b2ContactListener.prototype.PostSolve
);
box2d.b2ContactListener.b2_defaultListener = new box2d.b2ContactListener();
goog.exportProperty(
  box2d.b2ContactListener,
  "b2_defaultListener",
  box2d.b2ContactListener.b2_defaultListener
);
box2d.b2QueryCallback = function () {};
goog.exportSymbol("box2d.b2QueryCallback", box2d.b2QueryCallback);
box2d.b2QueryCallback.prototype.ReportFixture = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2QueryCallback.prototype,
  "ReportFixture",
  box2d.b2QueryCallback.prototype.ReportFixture
);
box2d.b2QueryCallback.prototype.ReportParticle = function (a, b) {
  return !1;
};
goog.exportProperty(
  box2d.b2QueryCallback.prototype,
  "ReportParticle",
  box2d.b2QueryCallback.prototype.ReportParticle
);
box2d.b2QueryCallback.prototype.ShouldQueryParticleSystem = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2QueryCallback.prototype,
  "ShouldQueryParticleSystem",
  box2d.b2QueryCallback.prototype.ShouldQueryParticleSystem
);
box2d.b2RayCastCallback = function () {};
goog.exportSymbol("box2d.b2RayCastCallback", box2d.b2RayCastCallback);
box2d.b2RayCastCallback.prototype.ReportFixture = function (a, b, c, d) {
  return d;
};
goog.exportProperty(
  box2d.b2RayCastCallback.prototype,
  "ReportFixture",
  box2d.b2RayCastCallback.prototype.ReportFixture
);
box2d.b2RayCastCallback.prototype.ReportParticle = function (a, b, c, d, e) {
  return 0;
};
goog.exportProperty(
  box2d.b2RayCastCallback.prototype,
  "ReportParticle",
  box2d.b2RayCastCallback.prototype.ReportParticle
);
box2d.b2RayCastCallback.prototype.ShouldQueryParticleSystem = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2RayCastCallback.prototype,
  "ShouldQueryParticleSystem",
  box2d.b2RayCastCallback.prototype.ShouldQueryParticleSystem
);
box2d.b2MixFriction = function (a, b) {
  return box2d.b2Sqrt(a * b);
};
goog.exportSymbol("box2d.b2MixFriction", box2d.b2MixFriction);
box2d.b2MixRestitution = function (a, b) {
  return a > b ? a : b;
};
goog.exportSymbol("box2d.b2MixRestitution", box2d.b2MixRestitution);
box2d.b2ContactEdge = function () {};
goog.exportSymbol("box2d.b2ContactEdge", box2d.b2ContactEdge);
box2d.b2ContactEdge.prototype.other = null;
goog.exportProperty(
  box2d.b2ContactEdge.prototype,
  "other",
  box2d.b2ContactEdge.prototype.other
);
box2d.b2ContactEdge.prototype.contact = null;
goog.exportProperty(
  box2d.b2ContactEdge.prototype,
  "contact",
  box2d.b2ContactEdge.prototype.contact
);
box2d.b2ContactEdge.prototype.prev = null;
goog.exportProperty(
  box2d.b2ContactEdge.prototype,
  "prev",
  box2d.b2ContactEdge.prototype.prev
);
box2d.b2ContactEdge.prototype.next = null;
goog.exportProperty(
  box2d.b2ContactEdge.prototype,
  "next",
  box2d.b2ContactEdge.prototype.next
);
box2d.b2Contact = function () {
  this.m_nodeA = new box2d.b2ContactEdge();
  this.m_nodeB = new box2d.b2ContactEdge();
  this.m_manifold = new box2d.b2Manifold();
  this.m_oldManifold = new box2d.b2Manifold();
};
goog.exportSymbol("box2d.b2Contact", box2d.b2Contact);
box2d.b2Contact.prototype.m_flag_islandFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_islandFlag",
  box2d.b2Contact.prototype.m_flag_islandFlag
);
box2d.b2Contact.prototype.m_flag_touchingFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_touchingFlag",
  box2d.b2Contact.prototype.m_flag_touchingFlag
);
box2d.b2Contact.prototype.m_flag_enabledFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_enabledFlag",
  box2d.b2Contact.prototype.m_flag_enabledFlag
);
box2d.b2Contact.prototype.m_flag_filterFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_filterFlag",
  box2d.b2Contact.prototype.m_flag_filterFlag
);
box2d.b2Contact.prototype.m_flag_bulletHitFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_bulletHitFlag",
  box2d.b2Contact.prototype.m_flag_bulletHitFlag
);
box2d.b2Contact.prototype.m_flag_toiFlag = !1;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_flag_toiFlag",
  box2d.b2Contact.prototype.m_flag_toiFlag
);
box2d.b2Contact.prototype.m_prev = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_prev",
  box2d.b2Contact.prototype.m_prev
);
box2d.b2Contact.prototype.m_next = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_next",
  box2d.b2Contact.prototype.m_next
);
box2d.b2Contact.prototype.m_nodeA = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_nodeA",
  box2d.b2Contact.prototype.m_nodeA
);
box2d.b2Contact.prototype.m_nodeB = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_nodeB",
  box2d.b2Contact.prototype.m_nodeB
);
box2d.b2Contact.prototype.m_fixtureA = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_fixtureA",
  box2d.b2Contact.prototype.m_fixtureA
);
box2d.b2Contact.prototype.m_fixtureB = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_fixtureB",
  box2d.b2Contact.prototype.m_fixtureB
);
box2d.b2Contact.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_indexA",
  box2d.b2Contact.prototype.m_indexA
);
box2d.b2Contact.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_indexB",
  box2d.b2Contact.prototype.m_indexB
);
box2d.b2Contact.prototype.m_manifold = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_manifold",
  box2d.b2Contact.prototype.m_manifold
);
box2d.b2Contact.prototype.m_toiCount = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_toiCount",
  box2d.b2Contact.prototype.m_toiCount
);
box2d.b2Contact.prototype.m_toi = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_toi",
  box2d.b2Contact.prototype.m_toi
);
box2d.b2Contact.prototype.m_friction = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_friction",
  box2d.b2Contact.prototype.m_friction
);
box2d.b2Contact.prototype.m_restitution = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_restitution",
  box2d.b2Contact.prototype.m_restitution
);
box2d.b2Contact.prototype.m_tangentSpeed = 0;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_tangentSpeed",
  box2d.b2Contact.prototype.m_tangentSpeed
);
box2d.b2Contact.prototype.m_oldManifold = null;
goog.exportProperty(
  box2d.b2Contact.prototype,
  "m_oldManifold",
  box2d.b2Contact.prototype.m_oldManifold
);
box2d.b2Contact.prototype.GetManifold = function () {
  return this.m_manifold;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetManifold",
  box2d.b2Contact.prototype.GetManifold
);
box2d.b2Contact.prototype.GetWorldManifold = function (a) {
  var b = this.m_fixtureA.GetBody(),
    c = this.m_fixtureB.GetBody(),
    d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  a.Initialize(
    this.m_manifold,
    b.GetTransform(),
    d.m_radius,
    c.GetTransform(),
    e.m_radius
  );
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetWorldManifold",
  box2d.b2Contact.prototype.GetWorldManifold
);
box2d.b2Contact.prototype.IsTouching = function () {
  return this.m_flag_touchingFlag;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "IsTouching",
  box2d.b2Contact.prototype.IsTouching
);
box2d.b2Contact.prototype.SetEnabled = function (a) {
  this.m_flag_enabledFlag = a;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "SetEnabled",
  box2d.b2Contact.prototype.SetEnabled
);
box2d.b2Contact.prototype.IsEnabled = function () {
  return this.m_flag_enabledFlag;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "IsEnabled",
  box2d.b2Contact.prototype.IsEnabled
);
box2d.b2Contact.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetNext",
  box2d.b2Contact.prototype.GetNext
);
box2d.b2Contact.prototype.GetFixtureA = function () {
  return this.m_fixtureA;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetFixtureA",
  box2d.b2Contact.prototype.GetFixtureA
);
box2d.b2Contact.prototype.GetChildIndexA = function () {
  return this.m_indexA;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetChildIndexA",
  box2d.b2Contact.prototype.GetChildIndexA
);
box2d.b2Contact.prototype.GetFixtureB = function () {
  return this.m_fixtureB;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetFixtureB",
  box2d.b2Contact.prototype.GetFixtureB
);
box2d.b2Contact.prototype.GetChildIndexB = function () {
  return this.m_indexB;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetChildIndexB",
  box2d.b2Contact.prototype.GetChildIndexB
);
box2d.b2Contact.prototype.Evaluate = function (a, b, c) {};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "Evaluate",
  box2d.b2Contact.prototype.Evaluate
);
box2d.b2Contact.prototype.FlagForFiltering = function () {
  this.m_flag_filterFlag = !0;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "FlagForFiltering",
  box2d.b2Contact.prototype.FlagForFiltering
);
box2d.b2Contact.prototype.SetFriction = function (a) {
  this.m_friction = a;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "SetFriction",
  box2d.b2Contact.prototype.SetFriction
);
box2d.b2Contact.prototype.GetFriction = function () {
  return this.m_friction;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetFriction",
  box2d.b2Contact.prototype.GetFriction
);
box2d.b2Contact.prototype.ResetFriction = function () {
  this.m_friction = box2d.b2MixFriction(
    this.m_fixtureA.m_friction,
    this.m_fixtureB.m_friction
  );
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "ResetFriction",
  box2d.b2Contact.prototype.ResetFriction
);
box2d.b2Contact.prototype.SetRestitution = function (a) {
  this.m_restitution = a;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "SetRestitution",
  box2d.b2Contact.prototype.SetRestitution
);
box2d.b2Contact.prototype.GetRestitution = function () {
  return this.m_restitution;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetRestitution",
  box2d.b2Contact.prototype.GetRestitution
);
box2d.b2Contact.prototype.ResetRestitution = function () {
  this.m_restitution = box2d.b2MixRestitution(
    this.m_fixtureA.m_restitution,
    this.m_fixtureB.m_restitution
  );
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "ResetRestitution",
  box2d.b2Contact.prototype.ResetRestitution
);
box2d.b2Contact.prototype.SetTangentSpeed = function (a) {
  this.m_tangentSpeed = a;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "SetTangentSpeed",
  box2d.b2Contact.prototype.SetTangentSpeed
);
box2d.b2Contact.prototype.GetTangentSpeed = function () {
  return this.m_tangentSpeed;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "GetTangentSpeed",
  box2d.b2Contact.prototype.GetTangentSpeed
);
box2d.b2Contact.prototype.Reset = function (a, b, c, d) {
  this.m_flag_touchingFlag = this.m_flag_islandFlag = !1;
  this.m_flag_enabledFlag = !0;
  this.m_flag_toiFlag = this.m_flag_bulletHitFlag = this.m_flag_filterFlag = !1;
  this.m_fixtureA = a;
  this.m_fixtureB = c;
  this.m_indexA = b;
  this.m_indexB = d;
  this.m_manifold.pointCount = 0;
  this.m_next = this.m_prev = null;
  this.m_nodeA.contact = null;
  this.m_nodeA.prev = null;
  this.m_nodeA.next = null;
  this.m_nodeA.other = null;
  this.m_nodeB.contact = null;
  this.m_nodeB.prev = null;
  this.m_nodeB.next = null;
  this.m_nodeB.other = null;
  this.m_toiCount = 0;
  this.m_friction = box2d.b2MixFriction(
    this.m_fixtureA.m_friction,
    this.m_fixtureB.m_friction
  );
  this.m_restitution = box2d.b2MixRestitution(
    this.m_fixtureA.m_restitution,
    this.m_fixtureB.m_restitution
  );
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "Reset",
  box2d.b2Contact.prototype.Reset
);
box2d.b2Contact.prototype.Update = function (a) {
  var b = this.m_oldManifold;
  this.m_oldManifold = this.m_manifold;
  this.m_manifold = b;
  this.m_flag_enabledFlag = !0;
  var c = !1,
    b = this.m_flag_touchingFlag,
    d = this.m_fixtureA.IsSensor(),
    e = this.m_fixtureB.IsSensor(),
    d = d || e,
    e = this.m_fixtureA.GetBody(),
    f = this.m_fixtureB.GetBody(),
    c = e.GetTransform(),
    g = f.GetTransform();
  if (d)
    (e = this.m_fixtureA.GetShape()),
      (f = this.m_fixtureB.GetShape()),
      (c = box2d.b2TestOverlap_Shape(e, this.m_indexA, f, this.m_indexB, c, g)),
      (this.m_manifold.pointCount = 0);
  else {
    this.Evaluate(this.m_manifold, c, g);
    c = 0 < this.m_manifold.pointCount;
    for (g = 0; g < this.m_manifold.pointCount; ++g) {
      var h = this.m_manifold.points[g];
      h.normalImpulse = 0;
      h.tangentImpulse = 0;
      for (var k = h.id, l = 0; l < this.m_oldManifold.pointCount; ++l) {
        var m = this.m_oldManifold.points[l];
        if (m.id.key === k.key) {
          h.normalImpulse = m.normalImpulse;
          h.tangentImpulse = m.tangentImpulse;
          break;
        }
      }
    }
    c !== b && (e.SetAwake(!0), f.SetAwake(!0));
  }
  this.m_flag_touchingFlag = c;
  !b && c && a && a.BeginContact(this);
  b && !c && a && a.EndContact(this);
  !d && c && a && a.PreSolve(this, this.m_oldManifold);
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "Update",
  box2d.b2Contact.prototype.Update
);
box2d.b2Contact.prototype.ComputeTOI = function (a, b) {
  var c = box2d.b2Contact.prototype.ComputeTOI.s_input;
  c.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
  c.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
  c.sweepA.Copy(a);
  c.sweepB.Copy(b);
  c.tMax = box2d.b2_linearSlop;
  var d = box2d.b2Contact.prototype.ComputeTOI.s_output;
  box2d.b2TimeOfImpact(d, c);
  return d.t;
};
goog.exportProperty(
  box2d.b2Contact.prototype,
  "ComputeTOI",
  box2d.b2Contact.prototype.ComputeTOI
);
box2d.b2Contact.prototype.ComputeTOI.s_input = new box2d.b2TOIInput();
box2d.b2Contact.prototype.ComputeTOI.s_output = new box2d.b2TOIOutput();
box2d.b2ChainAndCircleContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2ChainAndCircleContact, box2d.b2Contact);
goog.exportSymbol(
  "box2d.b2ChainAndCircleContact",
  box2d.b2ChainAndCircleContact
);
box2d.b2ChainAndCircleContact.Create = function (a) {
  return new box2d.b2ChainAndCircleContact();
};
goog.exportProperty(
  box2d.b2ChainAndCircleContact,
  "Create",
  box2d.b2ChainAndCircleContact.Create
);
box2d.b2ChainAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2ChainAndCircleContact,
  "Destroy",
  box2d.b2ChainAndCircleContact.Destroy
);
box2d.b2ChainAndCircleContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2ChainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
  var f = box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge;
  (d instanceof box2d.b2ChainShape ? d : null).GetChildEdge(f, this.m_indexA);
  box2d.b2CollideEdgeAndCircle(
    a,
    f,
    b,
    e instanceof box2d.b2CircleShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2ChainAndCircleContact.prototype,
  "Evaluate",
  box2d.b2ChainAndCircleContact.prototype.Evaluate
);
box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape();
box2d.b2ChainAndPolygonContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2ChainAndPolygonContact, box2d.b2Contact);
goog.exportSymbol(
  "box2d.b2ChainAndPolygonContact",
  box2d.b2ChainAndPolygonContact
);
box2d.b2ChainAndPolygonContact.Create = function (a) {
  return new box2d.b2ChainAndPolygonContact();
};
goog.exportProperty(
  box2d.b2ChainAndPolygonContact,
  "Create",
  box2d.b2ChainAndPolygonContact.Create
);
box2d.b2ChainAndPolygonContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2ChainAndPolygonContact,
  "Destroy",
  box2d.b2ChainAndPolygonContact.Destroy
);
box2d.b2ChainAndPolygonContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2ChainShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
  var f = box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge;
  (d instanceof box2d.b2ChainShape ? d : null).GetChildEdge(f, this.m_indexA);
  box2d.b2CollideEdgeAndPolygon(
    a,
    f,
    b,
    e instanceof box2d.b2PolygonShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2ChainAndPolygonContact.prototype,
  "Evaluate",
  box2d.b2ChainAndPolygonContact.prototype.Evaluate
);
box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape();
box2d.b2CircleContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2CircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2CircleContact", box2d.b2CircleContact);
box2d.b2CircleContact.Create = function (a) {
  return new box2d.b2CircleContact();
};
goog.exportProperty(
  box2d.b2CircleContact,
  "Create",
  box2d.b2CircleContact.Create
);
box2d.b2CircleContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2CircleContact,
  "Destroy",
  box2d.b2CircleContact.Destroy
);
box2d.b2CircleContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
  box2d.b2CollideCircles(
    a,
    d instanceof box2d.b2CircleShape ? d : null,
    b,
    e instanceof box2d.b2CircleShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2CircleContact.prototype,
  "Evaluate",
  box2d.b2CircleContact.prototype.Evaluate
);
box2d.b2ContactRegister = function () {};
goog.exportSymbol("box2d.b2ContactRegister", box2d.b2ContactRegister);
box2d.b2ContactRegister.prototype.createFcn = null;
box2d.b2ContactRegister.prototype.destroyFcn = null;
box2d.b2ContactRegister.prototype.primary = !1;
box2d.b2ContactFactory = function (a) {
  this.m_allocator = a;
  this.InitializeRegisters();
};
goog.exportSymbol("box2d.b2ContactFactory", box2d.b2ContactFactory);
box2d.b2ContactFactory.prototype.m_allocator = null;
box2d.b2ContactFactory.prototype.AddType = function (a, b, c, d) {
  var e = box2d.b2MakeArray(256, function (b) {
    return a();
  });
  b = function (b) {
    return 0 < e.length ? e.pop() : a(b);
  };
  var f = function (a, b) {
    e.push(a);
  };
  this.m_registers[c][d].pool = e;
  this.m_registers[c][d].createFcn = b;
  this.m_registers[c][d].destroyFcn = f;
  this.m_registers[c][d].primary = !0;
  c !== d &&
    ((this.m_registers[d][c].pool = e),
    (this.m_registers[d][c].createFcn = b),
    (this.m_registers[d][c].destroyFcn = f),
    (this.m_registers[d][c].primary = !1));
};
goog.exportProperty(
  box2d.b2ContactFactory.prototype,
  "AddType",
  box2d.b2ContactFactory.prototype.AddType
);
box2d.b2ContactFactory.prototype.InitializeRegisters = function () {
  this.m_registers = Array(box2d.b2ShapeType.e_shapeTypeCount);
  for (var a = 0; a < box2d.b2ShapeType.e_shapeTypeCount; a++) {
    this.m_registers[a] = Array(box2d.b2ShapeType.e_shapeTypeCount);
    for (var b = 0; b < box2d.b2ShapeType.e_shapeTypeCount; b++)
      this.m_registers[a][b] = new box2d.b2ContactRegister();
  }
  this.AddType(
    box2d.b2CircleContact.Create,
    box2d.b2CircleContact.Destroy,
    box2d.b2ShapeType.e_circleShape,
    box2d.b2ShapeType.e_circleShape
  );
  this.AddType(
    box2d.b2PolygonAndCircleContact.Create,
    box2d.b2PolygonAndCircleContact.Destroy,
    box2d.b2ShapeType.e_polygonShape,
    box2d.b2ShapeType.e_circleShape
  );
  this.AddType(
    box2d.b2PolygonContact.Create,
    box2d.b2PolygonContact.Destroy,
    box2d.b2ShapeType.e_polygonShape,
    box2d.b2ShapeType.e_polygonShape
  );
  this.AddType(
    box2d.b2EdgeAndCircleContact.Create,
    box2d.b2EdgeAndCircleContact.Destroy,
    box2d.b2ShapeType.e_edgeShape,
    box2d.b2ShapeType.e_circleShape
  );
  this.AddType(
    box2d.b2EdgeAndPolygonContact.Create,
    box2d.b2EdgeAndPolygonContact.Destroy,
    box2d.b2ShapeType.e_edgeShape,
    box2d.b2ShapeType.e_polygonShape
  );
  this.AddType(
    box2d.b2ChainAndCircleContact.Create,
    box2d.b2ChainAndCircleContact.Destroy,
    box2d.b2ShapeType.e_chainShape,
    box2d.b2ShapeType.e_circleShape
  );
  this.AddType(
    box2d.b2ChainAndPolygonContact.Create,
    box2d.b2ChainAndPolygonContact.Destroy,
    box2d.b2ShapeType.e_chainShape,
    box2d.b2ShapeType.e_polygonShape
  );
};
goog.exportProperty(
  box2d.b2ContactFactory.prototype,
  "InitializeRegisters",
  box2d.b2ContactFactory.prototype.InitializeRegisters
);
box2d.b2ContactFactory.prototype.Create = function (a, b, c, d) {
  var e = a.GetType(),
    f = c.GetType();
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(0 <= e && e < box2d.b2ShapeType.e_shapeTypeCount);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(0 <= f && f < box2d.b2ShapeType.e_shapeTypeCount);
  e = this.m_registers[e][f];
  f = e.createFcn;
  return null !== f
    ? (e.primary
        ? ((e = f(this.m_allocator)), e.Reset(a, b, c, d))
        : ((e = f(this.m_allocator)), e.Reset(c, d, a, b)),
      e)
    : null;
};
goog.exportProperty(
  box2d.b2ContactFactory.prototype,
  "Create",
  box2d.b2ContactFactory.prototype.Create
);
box2d.b2ContactFactory.prototype.Destroy = function (a) {
  var b = a.m_fixtureA,
    c = a.m_fixtureB;
  0 < a.m_manifold.pointCount &&
    !b.IsSensor() &&
    !c.IsSensor() &&
    (b.GetBody().SetAwake(!0), c.GetBody().SetAwake(!0));
  b = b.GetType();
  c = c.GetType();
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
  c = this.m_registers[b][c].destroyFcn;
  c(a, this.m_allocator);
};
goog.exportProperty(
  box2d.b2ContactFactory.prototype,
  "Destroy",
  box2d.b2ContactFactory.prototype.Destroy
);
box2d.b2ContactManager = function () {
  this.m_broadPhase = new box2d.b2BroadPhase();
  this.m_contactFactory = new box2d.b2ContactFactory(this.m_allocator);
};
box2d.b2ContactManager.prototype.m_broadPhase = null;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_broadPhase",
  box2d.b2ContactManager.prototype.m_broadPhase
);
box2d.b2ContactManager.prototype.m_contactList = null;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_contactList",
  box2d.b2ContactManager.prototype.m_contactList
);
box2d.b2ContactManager.prototype.m_contactCount = 0;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_contactCount",
  box2d.b2ContactManager.prototype.m_contactCount
);
box2d.b2ContactManager.prototype.m_contactFilter =
  box2d.b2ContactFilter.b2_defaultFilter;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_contactFilter",
  box2d.b2ContactManager.prototype.m_contactFilter
);
box2d.b2ContactManager.prototype.m_contactListener =
  box2d.b2ContactListener.b2_defaultListener;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_contactListener",
  box2d.b2ContactManager.prototype.m_contactListener
);
box2d.b2ContactManager.prototype.m_allocator = null;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_allocator",
  box2d.b2ContactManager.prototype.m_allocator
);
box2d.b2ContactManager.prototype.m_contactFactory = null;
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "m_contactFactory",
  box2d.b2ContactManager.prototype.m_contactFactory
);
box2d.b2ContactManager.prototype.Destroy = function (a) {
  var b = a.GetFixtureA(),
    c = a.GetFixtureB(),
    b = b.GetBody(),
    c = c.GetBody();
  this.m_contactListener &&
    a.IsTouching() &&
    this.m_contactListener.EndContact(a);
  a.m_prev && (a.m_prev.m_next = a.m_next);
  a.m_next && (a.m_next.m_prev = a.m_prev);
  a === this.m_contactList && (this.m_contactList = a.m_next);
  a.m_nodeA.prev && (a.m_nodeA.prev.next = a.m_nodeA.next);
  a.m_nodeA.next && (a.m_nodeA.next.prev = a.m_nodeA.prev);
  a.m_nodeA === b.m_contactList && (b.m_contactList = a.m_nodeA.next);
  a.m_nodeB.prev && (a.m_nodeB.prev.next = a.m_nodeB.next);
  a.m_nodeB.next && (a.m_nodeB.next.prev = a.m_nodeB.prev);
  a.m_nodeB === c.m_contactList && (c.m_contactList = a.m_nodeB.next);
  this.m_contactFactory.Destroy(a);
  --this.m_contactCount;
};
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "Destroy",
  box2d.b2ContactManager.prototype.Destroy
);
box2d.b2ContactManager.prototype.Collide = function () {
  for (var a = this.m_contactList; a; ) {
    var b = a.GetFixtureA(),
      c = a.GetFixtureB(),
      d = a.GetChildIndexA(),
      e = a.GetChildIndexB(),
      f = b.GetBody(),
      g = c.GetBody();
    if (a.m_flag_filterFlag) {
      if (!g.ShouldCollide(f)) {
        b = a;
        a = b.m_next;
        this.Destroy(b);
        continue;
      }
      if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(b, c)) {
        b = a;
        a = b.m_next;
        this.Destroy(b);
        continue;
      }
      a.m_flag_filterFlag = !1;
    }
    f = f.IsAwake() && f.m_type !== box2d.b2BodyType.b2_staticBody;
    g = g.IsAwake() && g.m_type !== box2d.b2BodyType.b2_staticBody;
    f || g
      ? this.m_broadPhase.TestOverlap(
          b.m_proxies[d].proxy,
          c.m_proxies[e].proxy
        )
        ? (a.Update(this.m_contactListener), (a = a.m_next))
        : ((b = a), (a = b.m_next), this.Destroy(b))
      : (a = a.m_next);
  }
};
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "Collide",
  box2d.b2ContactManager.prototype.Collide
);
box2d.b2ContactManager.prototype.FindNewContacts = function () {
  this.m_broadPhase.UpdatePairs(this);
};
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "FindNewContacts",
  box2d.b2ContactManager.prototype.FindNewContacts
);
box2d.b2ContactManager.prototype.AddPair = function (a, b) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2FixtureProxy);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
  var c = a.fixture,
    d = b.fixture,
    e = a.childIndex,
    f = b.childIndex,
    g = c.GetBody(),
    h = d.GetBody();
  if (g !== h) {
    for (var k = h.GetContactList(); k; ) {
      if (k.other === g) {
        var l = k.contact.GetFixtureA(),
          m = k.contact.GetFixtureB(),
          n = k.contact.GetChildIndexA(),
          p = k.contact.GetChildIndexB();
        if (
          (l === c && m === d && n === e && p === f) ||
          (l === d && m === c && n === f && p === e)
        )
          return;
      }
      k = k.next;
    }
    !h.ShouldCollide(g) ||
      (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(c, d)) ||
      ((e = this.m_contactFactory.Create(c, e, d, f)),
      null !== e &&
        ((c = e.GetFixtureA()),
        (d = e.GetFixtureB()),
        (g = c.m_body),
        (h = d.m_body),
        (e.m_prev = null),
        (e.m_next = this.m_contactList),
        null !== this.m_contactList && (this.m_contactList.m_prev = e),
        (this.m_contactList = e),
        (e.m_nodeA.contact = e),
        (e.m_nodeA.other = h),
        (e.m_nodeA.prev = null),
        (e.m_nodeA.next = g.m_contactList),
        null !== g.m_contactList && (g.m_contactList.prev = e.m_nodeA),
        (g.m_contactList = e.m_nodeA),
        (e.m_nodeB.contact = e),
        (e.m_nodeB.other = g),
        (e.m_nodeB.prev = null),
        (e.m_nodeB.next = h.m_contactList),
        null !== h.m_contactList && (h.m_contactList.prev = e.m_nodeB),
        (h.m_contactList = e.m_nodeB),
        c.IsSensor() || d.IsSensor() || (g.SetAwake(!0), h.SetAwake(!0)),
        ++this.m_contactCount));
  }
};
goog.exportProperty(
  box2d.b2ContactManager.prototype,
  "AddPair",
  box2d.b2ContactManager.prototype.AddPair
);
box2d.b2EdgeAndCircleContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2EdgeAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2EdgeAndCircleContact", box2d.b2EdgeAndCircleContact);
box2d.b2EdgeAndCircleContact.Create = function (a) {
  return new box2d.b2EdgeAndCircleContact();
};
goog.exportProperty(
  box2d.b2EdgeAndCircleContact,
  "Create",
  box2d.b2EdgeAndCircleContact.Create
);
box2d.b2EdgeAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2EdgeAndCircleContact,
  "Destroy",
  box2d.b2EdgeAndCircleContact.Destroy
);
box2d.b2EdgeAndCircleContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2EdgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
  box2d.b2CollideEdgeAndCircle(
    a,
    d instanceof box2d.b2EdgeShape ? d : null,
    b,
    e instanceof box2d.b2CircleShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2EdgeAndCircleContact.prototype,
  "Evaluate",
  box2d.b2EdgeAndCircleContact.prototype.Evaluate
);
box2d.b2EdgeAndPolygonContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2EdgeAndPolygonContact, box2d.b2Contact);
goog.exportSymbol(
  "box2d.b2EdgeAndPolygonContact",
  box2d.b2EdgeAndPolygonContact
);
box2d.b2EdgeAndPolygonContact.Create = function (a) {
  return new box2d.b2EdgeAndPolygonContact();
};
goog.exportProperty(
  box2d.b2EdgeAndPolygonContact,
  "Create",
  box2d.b2EdgeAndPolygonContact.Create
);
box2d.b2EdgeAndPolygonContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2EdgeAndPolygonContact,
  "Destroy",
  box2d.b2EdgeAndPolygonContact.Destroy
);
box2d.b2EdgeAndPolygonContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2EdgeShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
  box2d.b2CollideEdgeAndPolygon(
    a,
    d instanceof box2d.b2EdgeShape ? d : null,
    b,
    e instanceof box2d.b2PolygonShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2EdgeAndPolygonContact.prototype,
  "Evaluate",
  box2d.b2EdgeAndPolygonContact.prototype.Evaluate
);
box2d.b2PolygonAndCircleContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2PolygonAndCircleContact, box2d.b2Contact);
goog.exportSymbol(
  "box2d.b2PolygonAndCircleContact",
  box2d.b2PolygonAndCircleContact
);
box2d.b2PolygonAndCircleContact.Create = function (a) {
  return new box2d.b2PolygonAndCircleContact();
};
goog.exportProperty(
  box2d.b2PolygonAndCircleContact,
  "Create",
  box2d.b2PolygonAndCircleContact.Create
);
box2d.b2PolygonAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2PolygonAndCircleContact,
  "Destroy",
  box2d.b2PolygonAndCircleContact.Destroy
);
box2d.b2PolygonAndCircleContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
  box2d.b2CollidePolygonAndCircle(
    a,
    d instanceof box2d.b2PolygonShape ? d : null,
    b,
    e instanceof box2d.b2CircleShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2PolygonAndCircleContact.prototype,
  "Evaluate",
  box2d.b2PolygonAndCircleContact.prototype.Evaluate
);
box2d.b2PolygonContact = function () {
  box2d.b2Contact.call(this);
};
goog.inherits(box2d.b2PolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2PolygonContact", box2d.b2PolygonContact);
box2d.b2PolygonContact.Create = function (a) {
  return new box2d.b2PolygonContact();
};
goog.exportProperty(
  box2d.b2PolygonContact,
  "Create",
  box2d.b2PolygonContact.Create
);
box2d.b2PolygonContact.Destroy = function (a, b) {};
goog.exportProperty(
  box2d.b2PolygonContact,
  "Destroy",
  box2d.b2PolygonContact.Destroy
);
box2d.b2PolygonContact.prototype.Evaluate = function (a, b, c) {
  var d = this.m_fixtureA.GetShape(),
    e = this.m_fixtureB.GetShape();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
  box2d.b2CollidePolygons(
    a,
    d instanceof box2d.b2PolygonShape ? d : null,
    b,
    e instanceof box2d.b2PolygonShape ? e : null,
    c
  );
};
goog.exportProperty(
  box2d.b2PolygonContact.prototype,
  "Evaluate",
  box2d.b2PolygonContact.prototype.Evaluate
);
box2d.g_blockSolve = !0;
box2d.b2VelocityConstraintPoint = function () {
  this.rA = new box2d.b2Vec2();
  this.rB = new box2d.b2Vec2();
};
goog.exportSymbol(
  "box2d.b2VelocityConstraintPoint",
  box2d.b2VelocityConstraintPoint
);
box2d.b2VelocityConstraintPoint.prototype.rA = null;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "rA",
  box2d.b2VelocityConstraintPoint.prototype.rA
);
box2d.b2VelocityConstraintPoint.prototype.rB = null;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "rB",
  box2d.b2VelocityConstraintPoint.prototype.rB
);
box2d.b2VelocityConstraintPoint.prototype.normalImpulse = 0;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "normalImpulse",
  box2d.b2VelocityConstraintPoint.prototype.normalImpulse
);
box2d.b2VelocityConstraintPoint.prototype.tangentImpulse = 0;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "tangentImpulse",
  box2d.b2VelocityConstraintPoint.prototype.tangentImpulse
);
box2d.b2VelocityConstraintPoint.prototype.normalMass = 0;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "normalMass",
  box2d.b2VelocityConstraintPoint.prototype.normalMass
);
box2d.b2VelocityConstraintPoint.prototype.tangentMass = 0;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "tangentMass",
  box2d.b2VelocityConstraintPoint.prototype.tangentMass
);
box2d.b2VelocityConstraintPoint.prototype.velocityBias = 0;
goog.exportProperty(
  box2d.b2VelocityConstraintPoint.prototype,
  "velocityBias",
  box2d.b2VelocityConstraintPoint.prototype.velocityBias
);
box2d.b2VelocityConstraintPoint.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2VelocityConstraintPoint();
  });
};
goog.exportProperty(
  box2d.b2VelocityConstraintPoint,
  "MakeArray",
  box2d.b2VelocityConstraintPoint.MakeArray
);
box2d.b2ContactVelocityConstraint = function () {
  this.points = box2d.b2VelocityConstraintPoint.MakeArray(
    box2d.b2_maxManifoldPoints
  );
  this.normal = new box2d.b2Vec2();
  this.tangent = new box2d.b2Vec2();
  this.normalMass = new box2d.b2Mat22();
  this.K = new box2d.b2Mat22();
};
goog.exportSymbol(
  "box2d.b2ContactVelocityConstraint",
  box2d.b2ContactVelocityConstraint
);
box2d.b2ContactVelocityConstraint.prototype.points = null;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "points",
  box2d.b2ContactVelocityConstraint.prototype.points
);
box2d.b2ContactVelocityConstraint.prototype.normal = null;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "normal",
  box2d.b2ContactVelocityConstraint.prototype.normal
);
box2d.b2ContactVelocityConstraint.prototype.tangent = null;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "tangent",
  box2d.b2ContactVelocityConstraint.prototype.tangent
);
box2d.b2ContactVelocityConstraint.prototype.normalMass = null;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "normalMass",
  box2d.b2ContactVelocityConstraint.prototype.normalMass
);
box2d.b2ContactVelocityConstraint.prototype.K = null;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "K",
  box2d.b2ContactVelocityConstraint.prototype.K
);
box2d.b2ContactVelocityConstraint.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "indexA",
  box2d.b2ContactVelocityConstraint.prototype.indexA
);
box2d.b2ContactVelocityConstraint.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "indexB",
  box2d.b2ContactVelocityConstraint.prototype.indexB
);
box2d.b2ContactVelocityConstraint.prototype.invMassA = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "invMassA",
  box2d.b2ContactVelocityConstraint.prototype.invMassA
);
box2d.b2ContactVelocityConstraint.prototype.invMassB = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "invMassB",
  box2d.b2ContactVelocityConstraint.prototype.invMassB
);
box2d.b2ContactVelocityConstraint.prototype.invIA = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "invIA",
  box2d.b2ContactVelocityConstraint.prototype.invIA
);
box2d.b2ContactVelocityConstraint.prototype.invIB = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "invIB",
  box2d.b2ContactVelocityConstraint.prototype.invIB
);
box2d.b2ContactVelocityConstraint.prototype.friction = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "friction",
  box2d.b2ContactVelocityConstraint.prototype.friction
);
box2d.b2ContactVelocityConstraint.prototype.restitution = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "restitution",
  box2d.b2ContactVelocityConstraint.prototype.restitution
);
box2d.b2ContactVelocityConstraint.prototype.tangentSpeed = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "tangentSpeed",
  box2d.b2ContactVelocityConstraint.prototype.tangentSpeed
);
box2d.b2ContactVelocityConstraint.prototype.pointCount = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "pointCount",
  box2d.b2ContactVelocityConstraint.prototype.pointCount
);
box2d.b2ContactVelocityConstraint.prototype.contactIndex = 0;
goog.exportProperty(
  box2d.b2ContactVelocityConstraint.prototype,
  "contactIndex",
  box2d.b2ContactVelocityConstraint.prototype.contactIndex
);
box2d.b2ContactVelocityConstraint.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2ContactVelocityConstraint();
  });
};
goog.exportProperty(
  box2d.b2ContactVelocityConstraint,
  "MakeArray",
  box2d.b2ContactVelocityConstraint.MakeArray
);
box2d.b2ContactPositionConstraint = function () {
  this.localPoints = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
  this.localNormal = new box2d.b2Vec2();
  this.localPoint = new box2d.b2Vec2();
  this.localCenterA = new box2d.b2Vec2();
  this.localCenterB = new box2d.b2Vec2();
};
goog.exportSymbol(
  "box2d.b2ContactPositionConstraint",
  box2d.b2ContactPositionConstraint
);
box2d.b2ContactPositionConstraint.prototype.localPoints = null;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "localPoints",
  box2d.b2ContactPositionConstraint.prototype.localPoints
);
box2d.b2ContactPositionConstraint.prototype.localNormal = null;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "localNormal",
  box2d.b2ContactPositionConstraint.prototype.localNormal
);
box2d.b2ContactPositionConstraint.prototype.localPoint = null;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "localPoint",
  box2d.b2ContactPositionConstraint.prototype.localPoint
);
box2d.b2ContactPositionConstraint.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "indexA",
  box2d.b2ContactPositionConstraint.prototype.indexA
);
box2d.b2ContactPositionConstraint.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "indexB",
  box2d.b2ContactPositionConstraint.prototype.indexB
);
box2d.b2ContactPositionConstraint.prototype.invMassA = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "invMassA",
  box2d.b2ContactPositionConstraint.prototype.invMassA
);
box2d.b2ContactPositionConstraint.prototype.invMassB = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "invMassB",
  box2d.b2ContactPositionConstraint.prototype.invMassB
);
box2d.b2ContactPositionConstraint.prototype.localCenterA = null;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "localCenterA",
  box2d.b2ContactPositionConstraint.prototype.localCenterA
);
box2d.b2ContactPositionConstraint.prototype.localCenterB = null;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "localCenterB",
  box2d.b2ContactPositionConstraint.prototype.localCenterB
);
box2d.b2ContactPositionConstraint.prototype.invIA = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "invIA",
  box2d.b2ContactPositionConstraint.prototype.invIA
);
box2d.b2ContactPositionConstraint.prototype.invIB = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "invIB",
  box2d.b2ContactPositionConstraint.prototype.invIB
);
box2d.b2ContactPositionConstraint.prototype.type =
  box2d.b2ManifoldType.e_unknown;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "type",
  box2d.b2ContactPositionConstraint.prototype.type
);
box2d.b2ContactPositionConstraint.prototype.radiusA = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "radiusA",
  box2d.b2ContactPositionConstraint.prototype.radiusA
);
box2d.b2ContactPositionConstraint.prototype.radiusB = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "radiusB",
  box2d.b2ContactPositionConstraint.prototype.radiusB
);
box2d.b2ContactPositionConstraint.prototype.pointCount = 0;
goog.exportProperty(
  box2d.b2ContactPositionConstraint.prototype,
  "pointCount",
  box2d.b2ContactPositionConstraint.prototype.pointCount
);
box2d.b2ContactPositionConstraint.MakeArray = function (a) {
  return box2d.b2MakeArray(a, function (a) {
    return new box2d.b2ContactPositionConstraint();
  });
};
goog.exportProperty(
  box2d.b2ContactPositionConstraint,
  "MakeArray",
  box2d.b2ContactPositionConstraint.MakeArray
);
box2d.b2ContactSolverDef = function () {
  this.step = new box2d.b2TimeStep();
};
goog.exportSymbol("box2d.b2ContactSolverDef", box2d.b2ContactSolverDef);
box2d.b2ContactSolverDef.prototype.step = null;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "step",
  box2d.b2ContactSolverDef.prototype.step
);
box2d.b2ContactSolverDef.prototype.contacts = null;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "contacts",
  box2d.b2ContactSolverDef.prototype.contacts
);
box2d.b2ContactSolverDef.prototype.count = 0;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "count",
  box2d.b2ContactSolverDef.prototype.count
);
box2d.b2ContactSolverDef.prototype.positions = null;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "positions",
  box2d.b2ContactSolverDef.prototype.positions
);
box2d.b2ContactSolverDef.prototype.velocities = null;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "velocities",
  box2d.b2ContactSolverDef.prototype.velocities
);
box2d.b2ContactSolverDef.prototype.allocator = null;
goog.exportProperty(
  box2d.b2ContactSolverDef.prototype,
  "allocator",
  box2d.b2ContactSolverDef.prototype.allocator
);
box2d.b2ContactSolver = function () {
  this.m_step = new box2d.b2TimeStep();
  this.m_positionConstraints = box2d.b2ContactPositionConstraint.MakeArray(
    1024
  );
  this.m_velocityConstraints = box2d.b2ContactVelocityConstraint.MakeArray(
    1024
  );
};
goog.exportSymbol("box2d.b2ContactSolver", box2d.b2ContactSolver);
box2d.b2ContactSolver.prototype.m_step = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_step",
  box2d.b2ContactSolver.prototype.m_step
);
box2d.b2ContactSolver.prototype.m_positions = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_positions",
  box2d.b2ContactSolver.prototype.m_positions
);
box2d.b2ContactSolver.prototype.m_velocities = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_velocities",
  box2d.b2ContactSolver.prototype.m_velocities
);
box2d.b2ContactSolver.prototype.m_allocator = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_allocator",
  box2d.b2ContactSolver.prototype.m_allocator
);
box2d.b2ContactSolver.prototype.m_positionConstraints = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_positionConstraints",
  box2d.b2ContactSolver.prototype.m_positionConstraints
);
box2d.b2ContactSolver.prototype.m_velocityConstraints = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_velocityConstraints",
  box2d.b2ContactSolver.prototype.m_velocityConstraints
);
box2d.b2ContactSolver.prototype.m_contacts = null;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_contacts",
  box2d.b2ContactSolver.prototype.m_contacts
);
box2d.b2ContactSolver.prototype.m_count = 0;
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "m_count",
  box2d.b2ContactSolver.prototype.m_count
);
box2d.b2ContactSolver.prototype.Initialize = function (a) {
  this.m_step.Copy(a.step);
  this.m_allocator = a.allocator;
  this.m_count = a.count;
  if (this.m_positionConstraints.length < this.m_count) {
    var b = box2d.b2Max(2 * this.m_positionConstraints.length, this.m_count);
    for (
      box2d.DEBUG &&
      window.console.log("box2d.b2ContactSolver.m_positionConstraints: " + b);
      this.m_positionConstraints.length < b;

    )
      this.m_positionConstraints[
        this.m_positionConstraints.length
      ] = new box2d.b2ContactPositionConstraint();
  }
  if (this.m_velocityConstraints.length < this.m_count)
    for (
      b = box2d.b2Max(2 * this.m_velocityConstraints.length, this.m_count),
        box2d.DEBUG &&
          window.console.log(
            "box2d.b2ContactSolver.m_velocityConstraints: " + b
          );
      this.m_velocityConstraints.length < b;

    )
      this.m_velocityConstraints[
        this.m_velocityConstraints.length
      ] = new box2d.b2ContactVelocityConstraint();
  this.m_positions = a.positions;
  this.m_velocities = a.velocities;
  this.m_contacts = a.contacts;
  var c, d, e, f, g, h, k, l;
  a = 0;
  for (b = this.m_count; a < b; ++a)
    for (
      e = this.m_contacts[a],
        f = e.m_fixtureA,
        g = e.m_fixtureB,
        c = f.GetShape(),
        d = g.GetShape(),
        c = c.m_radius,
        d = d.m_radius,
        h = f.GetBody(),
        k = g.GetBody(),
        g = e.GetManifold(),
        l = g.pointCount,
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < l),
        f = this.m_velocityConstraints[a],
        f.friction = e.m_friction,
        f.restitution = e.m_restitution,
        f.tangentSpeed = e.m_tangentSpeed,
        f.indexA = h.m_islandIndex,
        f.indexB = k.m_islandIndex,
        f.invMassA = h.m_invMass,
        f.invMassB = k.m_invMass,
        f.invIA = h.m_invI,
        f.invIB = k.m_invI,
        f.contactIndex = a,
        f.pointCount = l,
        f.K.SetZero(),
        f.normalMass.SetZero(),
        e = this.m_positionConstraints[a],
        e.indexA = h.m_islandIndex,
        e.indexB = k.m_islandIndex,
        e.invMassA = h.m_invMass,
        e.invMassB = k.m_invMass,
        e.localCenterA.Copy(h.m_sweep.localCenter),
        e.localCenterB.Copy(k.m_sweep.localCenter),
        e.invIA = h.m_invI,
        e.invIB = k.m_invI,
        e.localNormal.Copy(g.localNormal),
        e.localPoint.Copy(g.localPoint),
        e.pointCount = l,
        e.radiusA = c,
        e.radiusB = d,
        e.type = g.type,
        c = 0,
        d = l;
      c < d;
      ++c
    )
      (h = g.points[c]),
        (l = f.points[c]),
        this.m_step.warmStarting
          ? ((l.normalImpulse = this.m_step.dtRatio * h.normalImpulse),
            (l.tangentImpulse = this.m_step.dtRatio * h.tangentImpulse))
          : ((l.normalImpulse = 0), (l.tangentImpulse = 0)),
        l.rA.SetZero(),
        l.rB.SetZero(),
        (l.normalMass = 0),
        (l.tangentMass = 0),
        (l.velocityBias = 0),
        e.localPoints[c].Copy(h.localPoint);
  return this;
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "Initialize",
  box2d.b2ContactSolver.prototype.Initialize
);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints = function () {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    p,
    q,
    r,
    u,
    t,
    w,
    x,
    v,
    y = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA,
    z = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB,
    B =
      box2d.b2ContactSolver.prototype.InitializeVelocityConstraints
        .s_worldManifold;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    e = this.m_velocityConstraints[a];
    f = this.m_positionConstraints[a];
    c = f.radiusA;
    d = f.radiusB;
    g = this.m_contacts[e.contactIndex].GetManifold();
    h = e.indexA;
    k = e.indexB;
    l = e.invMassA;
    m = e.invMassB;
    n = e.invIA;
    p = e.invIB;
    q = f.localCenterA;
    r = f.localCenterB;
    f = this.m_positions[h].c;
    u = this.m_positions[h].a;
    t = this.m_velocities[h].v;
    h = this.m_velocities[h].w;
    w = this.m_positions[k].c;
    x = this.m_positions[k].a;
    v = this.m_velocities[k].v;
    k = this.m_velocities[k].w;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < g.pointCount);
    y.q.SetAngle(u);
    z.q.SetAngle(x);
    box2d.b2Sub_V2_V2(f, box2d.b2Mul_R_V2(y.q, q, box2d.b2Vec2.s_t0), y.p);
    box2d.b2Sub_V2_V2(w, box2d.b2Mul_R_V2(z.q, r, box2d.b2Vec2.s_t0), z.p);
    B.Initialize(g, y, c, z, d);
    e.normal.Copy(B.normal);
    box2d.b2Cross_V2_S(e.normal, 1, e.tangent);
    d = e.pointCount;
    for (c = 0; c < d; ++c)
      (g = e.points[c]),
        box2d.b2Sub_V2_V2(B.points[c], f, g.rA),
        box2d.b2Sub_V2_V2(B.points[c], w, g.rB),
        (q = box2d.b2Cross_V2_V2(g.rA, e.normal)),
        (r = box2d.b2Cross_V2_V2(g.rB, e.normal)),
        (q = l + m + n * q * q + p * r * r),
        (g.normalMass = 0 < q ? 1 / q : 0),
        (r = e.tangent),
        (q = box2d.b2Cross_V2_V2(g.rA, r)),
        (r = box2d.b2Cross_V2_V2(g.rB, r)),
        (q = l + m + n * q * q + p * r * r),
        (g.tangentMass = 0 < q ? 1 / q : 0),
        (g.velocityBias = 0),
        (q = box2d.b2Dot_V2_V2(
          e.normal,
          box2d.b2Sub_V2_V2(
            box2d.b2AddCross_V2_S_V2(v, k, g.rB, box2d.b2Vec2.s_t0),
            box2d.b2AddCross_V2_S_V2(t, h, g.rA, box2d.b2Vec2.s_t1),
            box2d.b2Vec2.s_t0
          )
        )),
        q < -box2d.b2_velocityThreshold &&
          (g.velocityBias += -e.restitution * q);
    2 === e.pointCount &&
      box2d.g_blockSolve &&
      ((t = e.points[0]),
      (w = e.points[1]),
      (f = box2d.b2Cross_V2_V2(t.rA, e.normal)),
      (t = box2d.b2Cross_V2_V2(t.rB, e.normal)),
      (h = box2d.b2Cross_V2_V2(w.rA, e.normal)),
      (k = box2d.b2Cross_V2_V2(w.rB, e.normal)),
      (w = l + m + n * f * f + p * t * t),
      (v = l + m + n * h * h + p * k * k),
      (l = l + m + n * f * h + p * t * k),
      w * w < 1e3 * (w * v - l * l)
        ? (e.K.ex.Set(w, l), e.K.ey.Set(l, v), e.K.GetInverse(e.normalMass))
        : (e.pointCount = 1));
  }
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "InitializeVelocityConstraints",
  box2d.b2ContactSolver.prototype.InitializeVelocityConstraints
);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_worldManifold = new box2d.b2WorldManifold();
box2d.b2ContactSolver.prototype.WarmStart = function () {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    p,
    q,
    r,
    u,
    t,
    w,
    x = box2d.b2ContactSolver.prototype.WarmStart.s_P;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    e = this.m_velocityConstraints[a];
    f = e.indexA;
    g = e.indexB;
    h = e.invMassA;
    k = e.invIA;
    l = e.invMassB;
    m = e.invIB;
    d = e.pointCount;
    n = this.m_velocities[f].v;
    p = this.m_velocities[f].w;
    q = this.m_velocities[g].v;
    r = this.m_velocities[g].w;
    u = e.normal;
    t = e.tangent;
    for (c = 0; c < d; ++c)
      (w = e.points[c]),
        box2d.b2Add_V2_V2(
          box2d.b2Mul_S_V2(w.normalImpulse, u, box2d.b2Vec2.s_t0),
          box2d.b2Mul_S_V2(w.tangentImpulse, t, box2d.b2Vec2.s_t1),
          x
        ),
        (p -= k * box2d.b2Cross_V2_V2(w.rA, x)),
        n.SelfMulSub(h, x),
        (r += m * box2d.b2Cross_V2_V2(w.rB, x)),
        q.SelfMulAdd(l, x);
    this.m_velocities[f].w = p;
    this.m_velocities[g].w = r;
  }
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "WarmStart",
  box2d.b2ContactSolver.prototype.WarmStart
);
box2d.b2ContactSolver.prototype.WarmStart.s_P = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints = function () {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    p,
    q,
    r,
    u,
    t,
    w,
    x,
    v,
    y = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv,
    z = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1,
    B = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2,
    E,
    F,
    G = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P,
    H = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a,
    I = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b,
    C = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x,
    A = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d,
    K = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1,
    J = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2,
    D = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    e = this.m_velocityConstraints[a];
    f = e.indexA;
    g = e.indexB;
    h = e.invMassA;
    k = e.invIA;
    l = e.invMassB;
    m = e.invIB;
    n = e.pointCount;
    p = this.m_velocities[f].v;
    q = this.m_velocities[f].w;
    r = this.m_velocities[g].v;
    u = this.m_velocities[g].w;
    t = e.normal;
    w = e.tangent;
    x = e.friction;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(1 === n || 2 === n);
    c = 0;
    for (d = n; c < d; ++c)
      (v = e.points[c]),
        box2d.b2Sub_V2_V2(
          box2d.b2AddCross_V2_S_V2(r, u, v.rB, box2d.b2Vec2.s_t0),
          box2d.b2AddCross_V2_S_V2(p, q, v.rA, box2d.b2Vec2.s_t1),
          y
        ),
        (E = box2d.b2Dot_V2_V2(y, w) - e.tangentSpeed),
        (E = v.tangentMass * -E),
        (F = x * v.normalImpulse),
        (F = box2d.b2Clamp(v.tangentImpulse + E, -F, F)),
        (E = F - v.tangentImpulse),
        (v.tangentImpulse = F),
        box2d.b2Mul_S_V2(E, w, G),
        p.SelfMulSub(h, G),
        (q -= k * box2d.b2Cross_V2_V2(v.rA, G)),
        r.SelfMulAdd(l, G),
        (u += m * box2d.b2Cross_V2_V2(v.rB, G));
    if (1 !== e.pointCount && box2d.g_blockSolve)
      for (
        n = e.points[0],
          v = e.points[1],
          H.Set(n.normalImpulse, v.normalImpulse),
          box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= H.x && 0 <= H.y),
          box2d.b2Sub_V2_V2(
            box2d.b2AddCross_V2_S_V2(r, u, n.rB, box2d.b2Vec2.s_t0),
            box2d.b2AddCross_V2_S_V2(p, q, n.rA, box2d.b2Vec2.s_t1),
            z
          ),
          box2d.b2Sub_V2_V2(
            box2d.b2AddCross_V2_S_V2(r, u, v.rB, box2d.b2Vec2.s_t0),
            box2d.b2AddCross_V2_S_V2(p, q, v.rA, box2d.b2Vec2.s_t1),
            B
          ),
          c = box2d.b2Dot_V2_V2(z, t),
          d = box2d.b2Dot_V2_V2(B, t),
          I.x = c - n.velocityBias,
          I.y = d - v.velocityBias,
          I.SelfSub(box2d.b2Mul_M22_V2(e.K, H, box2d.b2Vec2.s_t0));
        ;

      ) {
        box2d.b2Mul_M22_V2(e.normalMass, I, C).SelfNeg();
        if (0 <= C.x && 0 <= C.y) {
          box2d.b2Sub_V2_V2(C, H, A);
          box2d.b2Mul_S_V2(A.x, t, K);
          box2d.b2Mul_S_V2(A.y, t, J);
          box2d.b2Add_V2_V2(K, J, D);
          p.SelfMulSub(h, D);
          q -=
            k * (box2d.b2Cross_V2_V2(n.rA, K) + box2d.b2Cross_V2_V2(v.rA, J));
          r.SelfMulAdd(l, D);
          u +=
            m * (box2d.b2Cross_V2_V2(n.rB, K) + box2d.b2Cross_V2_V2(v.rB, J));
          n.normalImpulse = C.x;
          v.normalImpulse = C.y;
          break;
        }
        C.x = -n.normalMass * I.x;
        C.y = 0;
        d = e.K.ex.y * C.x + I.y;
        if (0 <= C.x && 0 <= d) {
          box2d.b2Sub_V2_V2(C, H, A);
          box2d.b2Mul_S_V2(A.x, t, K);
          box2d.b2Mul_S_V2(A.y, t, J);
          box2d.b2Add_V2_V2(K, J, D);
          p.SelfMulSub(h, D);
          q -=
            k * (box2d.b2Cross_V2_V2(n.rA, K) + box2d.b2Cross_V2_V2(v.rA, J));
          r.SelfMulAdd(l, D);
          u +=
            m * (box2d.b2Cross_V2_V2(n.rB, K) + box2d.b2Cross_V2_V2(v.rB, J));
          n.normalImpulse = C.x;
          v.normalImpulse = C.y;
          break;
        }
        C.x = 0;
        C.y = -v.normalMass * I.y;
        c = e.K.ey.x * C.y + I.x;
        if (0 <= C.y && 0 <= c) {
          box2d.b2Sub_V2_V2(C, H, A);
          box2d.b2Mul_S_V2(A.x, t, K);
          box2d.b2Mul_S_V2(A.y, t, J);
          box2d.b2Add_V2_V2(K, J, D);
          p.SelfMulSub(h, D);
          q -=
            k * (box2d.b2Cross_V2_V2(n.rA, K) + box2d.b2Cross_V2_V2(v.rA, J));
          r.SelfMulAdd(l, D);
          u +=
            m * (box2d.b2Cross_V2_V2(n.rB, K) + box2d.b2Cross_V2_V2(v.rB, J));
          n.normalImpulse = C.x;
          v.normalImpulse = C.y;
          break;
        }
        C.x = 0;
        C.y = 0;
        c = I.x;
        d = I.y;
        if (0 <= c && 0 <= d) {
          box2d.b2Sub_V2_V2(C, H, A);
          box2d.b2Mul_S_V2(A.x, t, K);
          box2d.b2Mul_S_V2(A.y, t, J);
          box2d.b2Add_V2_V2(K, J, D);
          p.SelfMulSub(h, D);
          q -=
            k * (box2d.b2Cross_V2_V2(n.rA, K) + box2d.b2Cross_V2_V2(v.rA, J));
          r.SelfMulAdd(l, D);
          u +=
            m * (box2d.b2Cross_V2_V2(n.rB, K) + box2d.b2Cross_V2_V2(v.rB, J));
          n.normalImpulse = C.x;
          v.normalImpulse = C.y;
          break;
        }
        break;
      }
    else
      for (c = 0; c < n; ++c)
        (v = e.points[c]),
          box2d.b2Sub_V2_V2(
            box2d.b2AddCross_V2_S_V2(r, u, v.rB, box2d.b2Vec2.s_t0),
            box2d.b2AddCross_V2_S_V2(p, q, v.rA, box2d.b2Vec2.s_t1),
            y
          ),
          (d = box2d.b2Dot_V2_V2(y, t)),
          (E = -v.normalMass * (d - v.velocityBias)),
          (F = box2d.b2Max(v.normalImpulse + E, 0)),
          (E = F - v.normalImpulse),
          (v.normalImpulse = F),
          box2d.b2Mul_S_V2(E, t, G),
          p.SelfMulSub(h, G),
          (q -= k * box2d.b2Cross_V2_V2(v.rA, G)),
          r.SelfMulAdd(l, G),
          (u += m * box2d.b2Cross_V2_V2(v.rB, G));
    this.m_velocities[f].w = q;
    this.m_velocities[g].w = u;
  }
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "SolveVelocityConstraints",
  box2d.b2ContactSolver.prototype.SolveVelocityConstraints
);
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1 = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2 = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1 = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2 = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2 = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.StoreImpulses = function () {
  var a, b, c, d, e, f;
  a = 0;
  for (b = this.m_count; a < b; ++a)
    for (
      e = this.m_velocityConstraints[a],
        f = this.m_contacts[e.contactIndex].GetManifold(),
        c = 0,
        d = e.pointCount;
      c < d;
      ++c
    )
      (f.points[c].normalImpulse = e.points[c].normalImpulse),
        (f.points[c].tangentImpulse = e.points[c].tangentImpulse);
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "StoreImpulses",
  box2d.b2ContactSolver.prototype.StoreImpulses
);
box2d.b2PositionSolverManifold = function () {
  this.normal = new box2d.b2Vec2();
  this.point = new box2d.b2Vec2();
};
goog.exportSymbol(
  "box2d.b2PositionSolverManifold",
  box2d.b2PositionSolverManifold
);
box2d.b2PositionSolverManifold.prototype.normal = null;
goog.exportProperty(
  box2d.b2PositionSolverManifold.prototype,
  "normal",
  box2d.b2PositionSolverManifold.prototype.normal
);
box2d.b2PositionSolverManifold.prototype.point = null;
goog.exportProperty(
  box2d.b2PositionSolverManifold.prototype,
  "point",
  box2d.b2PositionSolverManifold.prototype.point
);
box2d.b2PositionSolverManifold.prototype.separation = 0;
goog.exportProperty(
  box2d.b2PositionSolverManifold.prototype,
  "separation",
  box2d.b2PositionSolverManifold.prototype.separation
);
box2d.b2PositionSolverManifold.prototype.Initialize = function (a, b, c, d) {
  var e = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA,
    f = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB,
    g = box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint,
    h = box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < a.pointCount);
  switch (a.type) {
    case box2d.b2ManifoldType.e_circles:
      box2d.b2Mul_X_V2(b, a.localPoint, e);
      box2d.b2Mul_X_V2(c, a.localPoints[0], f);
      box2d.b2Sub_V2_V2(f, e, this.normal).SelfNormalize();
      box2d.b2Mid_V2_V2(e, f, this.point);
      this.separation =
        box2d.b2Dot_V2_V2(
          box2d.b2Sub_V2_V2(f, e, box2d.b2Vec2.s_t0),
          this.normal
        ) -
        a.radiusA -
        a.radiusB;
      break;
    case box2d.b2ManifoldType.e_faceA:
      box2d.b2Mul_R_V2(b.q, a.localNormal, this.normal);
      box2d.b2Mul_X_V2(b, a.localPoint, g);
      box2d.b2Mul_X_V2(c, a.localPoints[d], h);
      this.separation =
        box2d.b2Dot_V2_V2(
          box2d.b2Sub_V2_V2(h, g, box2d.b2Vec2.s_t0),
          this.normal
        ) -
        a.radiusA -
        a.radiusB;
      this.point.Copy(h);
      break;
    case box2d.b2ManifoldType.e_faceB:
      box2d.b2Mul_R_V2(c.q, a.localNormal, this.normal),
        box2d.b2Mul_X_V2(c, a.localPoint, g),
        box2d.b2Mul_X_V2(b, a.localPoints[d], h),
        (this.separation =
          box2d.b2Dot_V2_V2(
            box2d.b2Sub_V2_V2(h, g, box2d.b2Vec2.s_t0),
            this.normal
          ) -
          a.radiusA -
          a.radiusB),
        this.point.Copy(h),
        this.normal.SelfNeg();
  }
};
goog.exportProperty(
  box2d.b2PositionSolverManifold.prototype,
  "Initialize",
  box2d.b2PositionSolverManifold.prototype.Initialize
);
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2();
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2();
box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2();
box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolvePositionConstraints = function () {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    p,
    q,
    r,
    u,
    t,
    w = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA,
    x = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB,
    v = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm,
    y,
    z,
    B,
    E = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA,
    F = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB,
    G,
    H = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P,
    I = 0;
  a = 0;
  for (b = this.m_count; a < b; ++a) {
    e = this.m_positionConstraints[a];
    f = e.indexA;
    g = e.indexB;
    h = e.localCenterA;
    k = e.invMassA;
    l = e.invIA;
    m = e.localCenterB;
    n = e.invMassB;
    p = e.invIB;
    d = e.pointCount;
    q = this.m_positions[f].c;
    r = this.m_positions[f].a;
    u = this.m_positions[g].c;
    t = this.m_positions[g].a;
    for (c = 0; c < d; ++c)
      w.q.SetAngle(r),
        x.q.SetAngle(t),
        box2d.b2Sub_V2_V2(q, box2d.b2Mul_R_V2(w.q, h, box2d.b2Vec2.s_t0), w.p),
        box2d.b2Sub_V2_V2(u, box2d.b2Mul_R_V2(x.q, m, box2d.b2Vec2.s_t0), x.p),
        v.Initialize(e, w, x, c),
        (y = v.normal),
        (z = v.point),
        (B = v.separation),
        box2d.b2Sub_V2_V2(z, q, E),
        box2d.b2Sub_V2_V2(z, u, F),
        (I = box2d.b2Min(I, B)),
        (z = box2d.b2Clamp(
          box2d.b2_baumgarte * (B + box2d.b2_linearSlop),
          -box2d.b2_maxLinearCorrection,
          0
        )),
        (B = box2d.b2Cross_V2_V2(E, y)),
        (G = box2d.b2Cross_V2_V2(F, y)),
        (B = k + n + l * B * B + p * G * G),
        (z = 0 < B ? -z / B : 0),
        box2d.b2Mul_S_V2(z, y, H),
        q.SelfMulSub(k, H),
        (r -= l * box2d.b2Cross_V2_V2(E, H)),
        u.SelfMulAdd(n, H),
        (t += p * box2d.b2Cross_V2_V2(F, H));
    this.m_positions[f].a = r;
    this.m_positions[g].a = t;
  }
  return I > -3 * box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "SolvePositionConstraints",
  box2d.b2ContactSolver.prototype.SolvePositionConstraints
);
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm = new box2d.b2PositionSolverManifold();
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints = function (a, b) {
  var c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    p,
    q,
    r,
    u,
    t,
    w,
    x,
    v = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA,
    y = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB,
    z = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm,
    B,
    E,
    F,
    G = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA,
    H = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB,
    I,
    C = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P,
    A = 0;
  c = 0;
  for (d = this.m_count; c < d; ++c) {
    g = this.m_positionConstraints[c];
    h = g.indexA;
    k = g.indexB;
    l = g.localCenterA;
    m = g.localCenterB;
    f = g.pointCount;
    p = n = 0;
    if (h === a || h === b) (n = g.invMassA), (p = g.invIA);
    r = q = 0;
    if (k === a || k === b) (q = g.invMassB), (r = g.invIB);
    u = this.m_positions[h].c;
    t = this.m_positions[h].a;
    w = this.m_positions[k].c;
    x = this.m_positions[k].a;
    for (e = 0; e < f; ++e)
      v.q.SetAngle(t),
        y.q.SetAngle(x),
        box2d.b2Sub_V2_V2(u, box2d.b2Mul_R_V2(v.q, l, box2d.b2Vec2.s_t0), v.p),
        box2d.b2Sub_V2_V2(w, box2d.b2Mul_R_V2(y.q, m, box2d.b2Vec2.s_t0), y.p),
        z.Initialize(g, v, y, e),
        (B = z.normal),
        (E = z.point),
        (F = z.separation),
        box2d.b2Sub_V2_V2(E, u, G),
        box2d.b2Sub_V2_V2(E, w, H),
        (A = box2d.b2Min(A, F)),
        (E = box2d.b2Clamp(
          box2d.b2_toiBaumgarte * (F + box2d.b2_linearSlop),
          -box2d.b2_maxLinearCorrection,
          0
        )),
        (F = box2d.b2Cross_V2_V2(G, B)),
        (I = box2d.b2Cross_V2_V2(H, B)),
        (F = n + q + p * F * F + r * I * I),
        (E = 0 < F ? -E / F : 0),
        box2d.b2Mul_S_V2(E, B, C),
        u.SelfMulSub(n, C),
        (t -= p * box2d.b2Cross_V2_V2(G, C)),
        w.SelfMulAdd(q, C),
        (x += r * box2d.b2Cross_V2_V2(H, C));
    this.m_positions[h].a = t;
    this.m_positions[k].a = x;
  }
  return A >= -1.5 * box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2ContactSolver.prototype,
  "SolveTOIPositionConstraints",
  box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints
);
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB = new box2d.b2Transform();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm = new box2d.b2PositionSolverManifold();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB = new box2d.b2Vec2();
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2Island = function () {
  this.m_bodies = Array(1024);
  this.m_contacts = Array(1024);
  this.m_joints = Array(1024);
  this.m_positions = box2d.b2Position.MakeArray(1024);
  this.m_velocities = box2d.b2Velocity.MakeArray(1024);
};
goog.exportSymbol("box2d.b2Island", box2d.b2Island);
box2d.b2Island.prototype.m_allocator = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_allocator",
  box2d.b2Island.prototype.m_allocator
);
box2d.b2Island.prototype.m_listener = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_listener",
  box2d.b2Island.prototype.m_listener
);
box2d.b2Island.prototype.m_bodies = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_bodies",
  box2d.b2Island.prototype.m_bodies
);
box2d.b2Island.prototype.m_contacts = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_contacts",
  box2d.b2Island.prototype.m_contacts
);
box2d.b2Island.prototype.m_joints = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_joints",
  box2d.b2Island.prototype.m_joints
);
box2d.b2Island.prototype.m_positions = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_positions",
  box2d.b2Island.prototype.m_positions
);
box2d.b2Island.prototype.m_velocities = null;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_velocities",
  box2d.b2Island.prototype.m_velocities
);
box2d.b2Island.prototype.m_bodyCount = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_bodyCount",
  box2d.b2Island.prototype.m_bodyCount
);
box2d.b2Island.prototype.m_jointCount = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_jointCount",
  box2d.b2Island.prototype.m_jointCount
);
box2d.b2Island.prototype.m_contactCount = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_contactCount",
  box2d.b2Island.prototype.m_contactCount
);
box2d.b2Island.prototype.m_bodyCapacity = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_bodyCapacity",
  box2d.b2Island.prototype.m_bodyCapacity
);
box2d.b2Island.prototype.m_contactCapacity = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_contactCapacity",
  box2d.b2Island.prototype.m_contactCapacity
);
box2d.b2Island.prototype.m_jointCapacity = 0;
goog.exportProperty(
  box2d.b2Island.prototype,
  "m_jointCapacity",
  box2d.b2Island.prototype.m_jointCapacity
);
box2d.b2Island.prototype.Initialize = function (a, b, c, d, e) {
  this.m_bodyCapacity = a;
  this.m_contactCapacity = b;
  this.m_jointCapacity = c;
  this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
  this.m_allocator = d;
  for (this.m_listener = e; this.m_bodies.length < a; )
    this.m_bodies[this.m_bodies.length] = null;
  for (; this.m_contacts.length < b; )
    this.m_contacts[this.m_contacts.length] = null;
  for (; this.m_joints.length < c; ) this.m_joints[this.m_joints.length] = null;
  if (this.m_positions.length < a)
    for (
      b = box2d.b2Max(2 * this.m_positions.length, a),
        box2d.DEBUG && window.console.log("box2d.b2Island.m_positions: " + b);
      this.m_positions.length < b;

    )
      this.m_positions[this.m_positions.length] = new box2d.b2Position();
  if (this.m_velocities.length < a)
    for (
      b = box2d.b2Max(2 * this.m_velocities.length, a),
        box2d.DEBUG && window.console.log("box2d.b2Island.m_velocities: " + b);
      this.m_velocities.length < b;

    )
      this.m_velocities[this.m_velocities.length] = new box2d.b2Velocity();
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "Initialize",
  box2d.b2Island.prototype.Initialize
);
box2d.b2Island.prototype.Clear = function () {
  this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "Clear",
  box2d.b2Island.prototype.Clear
);
box2d.b2Island.prototype.AddBody = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
  a.m_islandIndex = this.m_bodyCount;
  this.m_bodies[this.m_bodyCount++] = a;
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "AddBody",
  box2d.b2Island.prototype.AddBody
);
box2d.b2Island.prototype.AddContact = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(this.m_contactCount < this.m_contactCapacity);
  this.m_contacts[this.m_contactCount++] = a;
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "AddContact",
  box2d.b2Island.prototype.AddContact
);
box2d.b2Island.prototype.AddJoint = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(this.m_jointCount < this.m_jointCapacity);
  this.m_joints[this.m_jointCount++] = a;
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "AddJoint",
  box2d.b2Island.prototype.AddJoint
);
box2d.b2Island.prototype.Solve = function (a, b, c, d) {
  for (
    var e = box2d.b2Island.s_timer.Reset(), f = b.dt, g = 0;
    g < this.m_bodyCount;
    ++g
  ) {
    var h = this.m_bodies[g],
      k = this.m_positions[g].c.Copy(h.m_sweep.c),
      l = h.m_sweep.a,
      m = this.m_velocities[g].v.Copy(h.m_linearVelocity),
      n = h.m_angularVelocity;
    h.m_sweep.c0.Copy(h.m_sweep.c);
    h.m_sweep.a0 = h.m_sweep.a;
    h.m_type === box2d.b2BodyType.b2_dynamicBody &&
      ((m.x += f * (h.m_gravityScale * c.x + h.m_invMass * h.m_force.x)),
      (m.y += f * (h.m_gravityScale * c.y + h.m_invMass * h.m_force.y)),
      (n += f * h.m_invI * h.m_torque),
      m.SelfMul(1 / (1 + f * h.m_linearDamping)),
      (n *= 1 / (1 + f * h.m_angularDamping)));
    this.m_positions[g].a = l;
    this.m_velocities[g].w = n;
  }
  e.Reset();
  h = box2d.b2Island.s_solverData;
  h.step.Copy(b);
  h.positions = this.m_positions;
  h.velocities = this.m_velocities;
  g = box2d.b2Island.s_contactSolverDef;
  g.step.Copy(b);
  g.contacts = this.m_contacts;
  g.count = this.m_contactCount;
  g.positions = this.m_positions;
  g.velocities = this.m_velocities;
  g.allocator = this.m_allocator;
  c = box2d.b2Island.s_contactSolver.Initialize(g);
  c.InitializeVelocityConstraints();
  b.warmStarting && c.WarmStart();
  for (g = 0; g < this.m_jointCount; ++g)
    this.m_joints[g].InitVelocityConstraints(h);
  a.solveInit = e.GetMilliseconds();
  e.Reset();
  for (g = 0; g < b.velocityIterations; ++g) {
    for (l = 0; l < this.m_jointCount; ++l)
      this.m_joints[l].SolveVelocityConstraints(h);
    c.SolveVelocityConstraints();
  }
  c.StoreImpulses();
  a.solveVelocity = e.GetMilliseconds();
  for (g = 0; g < this.m_bodyCount; ++g) {
    var k = this.m_positions[g].c,
      l = this.m_positions[g].a,
      m = this.m_velocities[g].v,
      n = this.m_velocities[g].w,
      p = box2d.b2Mul_S_V2(f, m, box2d.b2Island.s_translation);
    box2d.b2Dot_V2_V2(p, p) > box2d.b2_maxTranslationSquared &&
      ((p = box2d.b2_maxTranslation / p.Length()), m.SelfMul(p));
    p = f * n;
    p * p > box2d.b2_maxRotationSquared &&
      ((p = box2d.b2_maxRotation / box2d.b2Abs(p)), (n *= p));
    k.x += f * m.x;
    k.y += f * m.y;
    l += f * n;
    this.m_positions[g].a = l;
    this.m_velocities[g].w = n;
  }
  e.Reset();
  k = !1;
  for (g = 0; g < b.positionIterations; ++g) {
    m = c.SolvePositionConstraints();
    n = !0;
    for (l = 0; l < this.m_jointCount; ++l)
      (p = this.m_joints[l].SolvePositionConstraints(h)), (n = n && p);
    if (m && n) {
      k = !0;
      break;
    }
  }
  for (g = 0; g < this.m_bodyCount; ++g)
    (b = this.m_bodies[g]),
      b.m_sweep.c.Copy(this.m_positions[g].c),
      (b.m_sweep.a = this.m_positions[g].a),
      b.m_linearVelocity.Copy(this.m_velocities[g].v),
      (b.m_angularVelocity = this.m_velocities[g].w),
      b.SynchronizeTransform();
  a.solvePosition = e.GetMilliseconds();
  this.Report(c.m_velocityConstraints);
  if (d) {
    a = box2d.b2_maxFloat;
    d = box2d.b2_linearSleepTolerance * box2d.b2_linearSleepTolerance;
    e = box2d.b2_angularSleepTolerance * box2d.b2_angularSleepTolerance;
    for (g = 0; g < this.m_bodyCount; ++g)
      (h = this.m_bodies[g]),
        h.GetType() !== box2d.b2BodyType.b2_staticBody &&
          (!h.m_flag_autoSleepFlag ||
          h.m_angularVelocity * h.m_angularVelocity > e ||
          box2d.b2Dot_V2_V2(h.m_linearVelocity, h.m_linearVelocity) > d
            ? (a = h.m_sleepTime = 0)
            : ((h.m_sleepTime += f), (a = box2d.b2Min(a, h.m_sleepTime))));
    if (a >= box2d.b2_timeToSleep && k)
      for (g = 0; g < this.m_bodyCount; ++g)
        (h = this.m_bodies[g]), h.SetAwake(!1);
  }
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "Solve",
  box2d.b2Island.prototype.Solve
);
box2d.b2Island.prototype.SolveTOI = function (a, b, c) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(b < this.m_bodyCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_bodyCount);
  for (var d = 0; d < this.m_bodyCount; ++d) {
    var e = this.m_bodies[d];
    this.m_positions[d].c.Copy(e.m_sweep.c);
    this.m_positions[d].a = e.m_sweep.a;
    this.m_velocities[d].v.Copy(e.m_linearVelocity);
    this.m_velocities[d].w = e.m_angularVelocity;
  }
  d = box2d.b2Island.s_contactSolverDef;
  d.contacts = this.m_contacts;
  d.count = this.m_contactCount;
  d.allocator = this.m_allocator;
  d.step.Copy(a);
  d.positions = this.m_positions;
  d.velocities = this.m_velocities;
  e = box2d.b2Island.s_contactSolver.Initialize(d);
  for (
    d = 0;
    d < a.positionIterations && !e.SolveTOIPositionConstraints(b, c);
    ++d
  );
  this.m_bodies[b].m_sweep.c0.Copy(this.m_positions[b].c);
  this.m_bodies[b].m_sweep.a0 = this.m_positions[b].a;
  this.m_bodies[c].m_sweep.c0.Copy(this.m_positions[c].c);
  this.m_bodies[c].m_sweep.a0 = this.m_positions[c].a;
  e.InitializeVelocityConstraints();
  for (d = 0; d < a.velocityIterations; ++d) e.SolveVelocityConstraints();
  a = a.dt;
  for (d = 0; d < this.m_bodyCount; ++d) {
    b = this.m_positions[d].c;
    c = this.m_positions[d].a;
    var f = this.m_velocities[d].v,
      g = this.m_velocities[d].w,
      h = box2d.b2Mul_S_V2(a, f, box2d.b2Island.s_translation);
    box2d.b2Dot_V2_V2(h, h) > box2d.b2_maxTranslationSquared &&
      ((h = box2d.b2_maxTranslation / h.Length()), f.SelfMul(h));
    h = a * g;
    h * h > box2d.b2_maxRotationSquared &&
      ((h = box2d.b2_maxRotation / box2d.b2Abs(h)), (g *= h));
    b.SelfMulAdd(a, f);
    c += a * g;
    this.m_positions[d].a = c;
    this.m_velocities[d].w = g;
    h = this.m_bodies[d];
    h.m_sweep.c.Copy(b);
    h.m_sweep.a = c;
    h.m_linearVelocity.Copy(f);
    h.m_angularVelocity = g;
    h.SynchronizeTransform();
  }
  this.Report(e.m_velocityConstraints);
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "SolveTOI",
  box2d.b2Island.prototype.SolveTOI
);
box2d.b2Island.prototype.Report = function (a) {
  if (null !== this.m_listener)
    for (var b = 0; b < this.m_contactCount; ++b) {
      var c = this.m_contacts[b];
      if (c) {
        var d = a[b],
          e = box2d.b2Island.s_impulse;
        e.count = d.pointCount;
        for (var f = 0; f < d.pointCount; ++f)
          (e.normalImpulses[f] = d.points[f].normalImpulse),
            (e.tangentImpulses[f] = d.points[f].tangentImpulse);
        this.m_listener.PostSolve(c, e);
      }
    }
};
goog.exportProperty(
  box2d.b2Island.prototype,
  "Report",
  box2d.b2Island.prototype.Report
);
box2d.b2Island.s_timer = new box2d.b2Timer();
box2d.b2Island.s_solverData = new box2d.b2SolverData();
box2d.b2Island.s_contactSolverDef = new box2d.b2ContactSolverDef();
box2d.b2Island.s_contactSolver = new box2d.b2ContactSolver();
box2d.b2Island.s_translation = new box2d.b2Vec2();
box2d.b2Island.s_impulse = new box2d.b2ContactImpulse();
box2d.b2JointType = {
  e_unknownJoint: 0,
  e_revoluteJoint: 1,
  e_prismaticJoint: 2,
  e_distanceJoint: 3,
  e_pulleyJoint: 4,
  e_mouseJoint: 5,
  e_gearJoint: 6,
  e_wheelJoint: 7,
  e_weldJoint: 8,
  e_frictionJoint: 9,
  e_ropeJoint: 10,
  e_motorJoint: 11,
  e_areaJoint: 12,
};
goog.exportSymbol("box2d.b2JointType", box2d.b2JointType);
goog.exportProperty(
  box2d.b2JointType,
  "e_unknownJoint",
  box2d.b2JointType.e_unknownJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_revoluteJoint",
  box2d.b2JointType.e_revoluteJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_prismaticJoint",
  box2d.b2JointType.e_prismaticJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_distanceJoint",
  box2d.b2JointType.e_distanceJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_pulleyJoint",
  box2d.b2JointType.e_pulleyJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_mouseJoint",
  box2d.b2JointType.e_mouseJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_gearJoint",
  box2d.b2JointType.e_gearJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_wheelJoint",
  box2d.b2JointType.e_wheelJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_weldJoint",
  box2d.b2JointType.e_weldJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_frictionJoint",
  box2d.b2JointType.e_frictionJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_ropeJoint",
  box2d.b2JointType.e_ropeJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_motorJoint",
  box2d.b2JointType.e_motorJoint
);
goog.exportProperty(
  box2d.b2JointType,
  "e_areaJoint",
  box2d.b2JointType.e_areaJoint
);
box2d.b2LimitState = {
  e_inactiveLimit: 0,
  e_atLowerLimit: 1,
  e_atUpperLimit: 2,
  e_equalLimits: 3,
};
goog.exportSymbol("box2d.b2LimitState", box2d.b2LimitState);
goog.exportProperty(
  box2d.b2LimitState,
  "e_inactiveLimit",
  box2d.b2LimitState.e_inactiveLimit
);
goog.exportProperty(
  box2d.b2LimitState,
  "e_atLowerLimit",
  box2d.b2LimitState.e_atLowerLimit
);
goog.exportProperty(
  box2d.b2LimitState,
  "e_atUpperLimit",
  box2d.b2LimitState.e_atUpperLimit
);
goog.exportProperty(
  box2d.b2LimitState,
  "e_equalLimits",
  box2d.b2LimitState.e_equalLimits
);
box2d.b2Jacobian = function () {
  this.linear = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2Jacobian", box2d.b2Jacobian);
box2d.b2Jacobian.prototype.linear = null;
goog.exportProperty(
  box2d.b2Jacobian.prototype,
  "linear",
  box2d.b2Jacobian.prototype.linear
);
box2d.b2Jacobian.prototype.angularA = 0;
goog.exportProperty(
  box2d.b2Jacobian.prototype,
  "angularA",
  box2d.b2Jacobian.prototype.angularA
);
box2d.b2Jacobian.prototype.angularB = 0;
goog.exportProperty(
  box2d.b2Jacobian.prototype,
  "angularB",
  box2d.b2Jacobian.prototype.angularB
);
box2d.b2Jacobian.prototype.SetZero = function () {
  this.linear.SetZero();
  this.angularB = this.angularA = 0;
  return this;
};
goog.exportProperty(
  box2d.b2Jacobian.prototype,
  "SetZero",
  box2d.b2Jacobian.prototype.SetZero
);
box2d.b2Jacobian.prototype.Set = function (a, b, c) {
  this.linear.Copy(a);
  this.angularA = b;
  this.angularB = c;
  return this;
};
goog.exportProperty(
  box2d.b2Jacobian.prototype,
  "Set",
  box2d.b2Jacobian.prototype.Set
);
box2d.b2JointEdge = function () {};
goog.exportSymbol("box2d.b2JointEdge", box2d.b2JointEdge);
box2d.b2JointEdge.prototype.other = null;
goog.exportProperty(
  box2d.b2JointEdge.prototype,
  "other",
  box2d.b2JointEdge.prototype.other
);
box2d.b2JointEdge.prototype.joint = null;
goog.exportProperty(
  box2d.b2JointEdge.prototype,
  "joint",
  box2d.b2JointEdge.prototype.joint
);
box2d.b2JointEdge.prototype.prev = null;
goog.exportProperty(
  box2d.b2JointEdge.prototype,
  "prev",
  box2d.b2JointEdge.prototype.prev
);
box2d.b2JointEdge.prototype.next = null;
goog.exportProperty(
  box2d.b2JointEdge.prototype,
  "next",
  box2d.b2JointEdge.prototype.next
);
box2d.b2JointDef = function (a) {
  this.type = a;
};
goog.exportSymbol("box2d.b2JointDef", box2d.b2JointDef);
box2d.b2JointDef.prototype.type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(
  box2d.b2JointDef.prototype,
  "type",
  box2d.b2JointDef.prototype.type
);
box2d.b2JointDef.prototype.userData = null;
goog.exportProperty(
  box2d.b2JointDef.prototype,
  "userData",
  box2d.b2JointDef.prototype.userData
);
box2d.b2JointDef.prototype.bodyA = null;
goog.exportProperty(
  box2d.b2JointDef.prototype,
  "bodyA",
  box2d.b2JointDef.prototype.bodyA
);
box2d.b2JointDef.prototype.bodyB = null;
goog.exportProperty(
  box2d.b2JointDef.prototype,
  "bodyB",
  box2d.b2JointDef.prototype.bodyB
);
box2d.b2JointDef.prototype.collideConnected = !1;
goog.exportProperty(
  box2d.b2JointDef.prototype,
  "collideConnected",
  box2d.b2JointDef.prototype.collideConnected
);
box2d.b2Joint = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.bodyA !== a.bodyB);
  this.m_type = a.type;
  this.m_edgeA = new box2d.b2JointEdge();
  this.m_edgeB = new box2d.b2JointEdge();
  this.m_bodyA = a.bodyA;
  this.m_bodyB = a.bodyB;
  this.m_collideConnected = a.collideConnected;
  this.m_userData = a.userData;
};
goog.exportSymbol("box2d.b2Joint", box2d.b2Joint);
box2d.b2Joint.prototype.m_type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_type",
  box2d.b2Joint.prototype.m_type
);
box2d.b2Joint.prototype.m_prev = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_prev",
  box2d.b2Joint.prototype.m_prev
);
box2d.b2Joint.prototype.m_next = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_next",
  box2d.b2Joint.prototype.m_next
);
box2d.b2Joint.prototype.m_edgeA = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_edgeA",
  box2d.b2Joint.prototype.m_edgeA
);
box2d.b2Joint.prototype.m_edgeB = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_edgeB",
  box2d.b2Joint.prototype.m_edgeB
);
box2d.b2Joint.prototype.m_bodyA = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_bodyA",
  box2d.b2Joint.prototype.m_bodyA
);
box2d.b2Joint.prototype.m_bodyB = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_bodyB",
  box2d.b2Joint.prototype.m_bodyB
);
box2d.b2Joint.prototype.m_index = 0;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_index",
  box2d.b2Joint.prototype.m_index
);
box2d.b2Joint.prototype.m_islandFlag = !1;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_islandFlag",
  box2d.b2Joint.prototype.m_islandFlag
);
box2d.b2Joint.prototype.m_collideConnected = !1;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_collideConnected",
  box2d.b2Joint.prototype.m_collideConnected
);
box2d.b2Joint.prototype.m_userData = null;
goog.exportProperty(
  box2d.b2Joint.prototype,
  "m_userData",
  box2d.b2Joint.prototype.m_userData
);
box2d.b2Joint.prototype.GetAnchorA = function (a) {
  return a.SetZero();
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetAnchorA",
  box2d.b2Joint.prototype.GetAnchorA
);
box2d.b2Joint.prototype.GetAnchorB = function (a) {
  return a.SetZero();
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetAnchorB",
  box2d.b2Joint.prototype.GetAnchorB
);
box2d.b2Joint.prototype.GetReactionForce = function (a, b) {
  return b.SetZero();
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetReactionForce",
  box2d.b2Joint.prototype.GetReactionForce
);
box2d.b2Joint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetReactionTorque",
  box2d.b2Joint.prototype.GetReactionTorque
);
box2d.b2Joint.prototype.InitVelocityConstraints = function (a) {};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "InitVelocityConstraints",
  box2d.b2Joint.prototype.InitVelocityConstraints
);
box2d.b2Joint.prototype.SolveVelocityConstraints = function (a) {};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "SolveVelocityConstraints",
  box2d.b2Joint.prototype.SolveVelocityConstraints
);
box2d.b2Joint.prototype.SolvePositionConstraints = function (a) {
  return !1;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "SolvePositionConstraints",
  box2d.b2Joint.prototype.SolvePositionConstraints
);
box2d.b2Joint.prototype.GetType = function () {
  //以下新增
  // if (this.m_type === null) return 0;
  //
  return this.m_type;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetType",
  box2d.b2Joint.prototype.GetType
);
box2d.b2Joint.prototype.GetBodyA = function () {
  return this.m_bodyA;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetBodyA",
  box2d.b2Joint.prototype.GetBodyA
);
box2d.b2Joint.prototype.GetBodyB = function () {
  return this.m_bodyB;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetBodyB",
  box2d.b2Joint.prototype.GetBodyB
);
box2d.b2Joint.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetNext",
  box2d.b2Joint.prototype.GetNext
);
box2d.b2Joint.prototype.GetUserData = function () {
  return this.m_userData;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetUserData",
  box2d.b2Joint.prototype.GetUserData
);
box2d.b2Joint.prototype.SetUserData = function (a) {
  this.m_userData = a;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "SetUserData",
  box2d.b2Joint.prototype.SetUserData
);
box2d.b2Joint.prototype.GetCollideConnected = function () {
  return this.m_collideConnected;
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "GetCollideConnected",
  box2d.b2Joint.prototype.GetCollideConnected
);
box2d.b2Joint.prototype.Dump = function () {
  box2d.DEBUG && box2d.b2Log("// Dump is not supported for this joint type.\n");
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "Dump",
  box2d.b2Joint.prototype.Dump
);
box2d.b2Joint.prototype.IsActive = function () {
  return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "IsActive",
  box2d.b2Joint.prototype.IsActive
);
box2d.b2Joint.prototype.ShiftOrigin = function (a) {};
goog.exportProperty(
  box2d.b2Joint.prototype,
  "ShiftOrigin",
  box2d.b2Joint.prototype.ShiftOrigin
);
box2d.b2AreaJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_areaJoint);
  this.bodies = [];
};
goog.inherits(box2d.b2AreaJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2AreaJointDef", box2d.b2AreaJointDef);
box2d.b2AreaJointDef.prototype.world = null;
goog.exportProperty(
  box2d.b2AreaJointDef.prototype,
  "world",
  box2d.b2AreaJointDef.prototype.world
);
box2d.b2AreaJointDef.prototype.bodies = null;
goog.exportProperty(
  box2d.b2AreaJointDef.prototype,
  "bodies",
  box2d.b2AreaJointDef.prototype.bodies
);
box2d.b2AreaJointDef.prototype.frequencyHz = 0;
goog.exportProperty(
  box2d.b2AreaJointDef.prototype,
  "frequencyHz",
  box2d.b2AreaJointDef.prototype.frequencyHz
);
box2d.b2AreaJointDef.prototype.dampingRatio = 0;
goog.exportProperty(
  box2d.b2AreaJointDef.prototype,
  "dampingRatio",
  box2d.b2AreaJointDef.prototype.dampingRatio
);
box2d.b2AreaJointDef.prototype.AddBody = function (a) {
  this.bodies.push(a);
  1 === this.bodies.length
    ? (this.bodyA = a)
    : 2 === this.bodies.length && (this.bodyB = a);
};
goog.exportProperty(
  box2d.b2AreaJointDef.prototype,
  "AddBody",
  box2d.b2AreaJointDef.prototype.AddBody
);
box2d.b2AreaJoint = function (a) {
  box2d.b2Joint.call(this, a);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(
      3 <= a.bodies.length,
      "You cannot create an area joint with less than three bodies."
    );
  this.m_bodies = a.bodies;
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_targetLengths = box2d.b2MakeNumberArray(a.bodies.length);
  this.m_normals = box2d.b2Vec2.MakeArray(a.bodies.length);
  this.m_joints = Array(a.bodies.length);
  this.m_deltas = box2d.b2Vec2.MakeArray(a.bodies.length);
  this.m_delta = new box2d.b2Vec2();
  var b = new box2d.b2DistanceJointDef();
  b.frequencyHz = a.frequencyHz;
  b.dampingRatio = a.dampingRatio;
  for (var c = (this.m_targetArea = 0), d = this.m_bodies.length; c < d; ++c) {
    var e = this.m_bodies[c],
      f = this.m_bodies[(c + 1) % d],
      g = e.GetWorldCenter(),
      h = f.GetWorldCenter();
    this.m_targetLengths[c] = box2d.b2Distance(g, h);
    this.m_targetArea += box2d.b2Cross_V2_V2(g, h);
    b.Initialize(e, f, g, h);
    this.m_joints[c] = a.world.CreateJoint(b);
  }
  this.m_targetArea *= 0.5;
};
goog.inherits(box2d.b2AreaJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2AreaJoint", box2d.b2AreaJoint);
box2d.b2AreaJoint.prototype.m_bodies = null;
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "m_bodies",
  box2d.b2AreaJoint.prototype.m_bodies
);
box2d.b2AreaJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "m_frequencyHz",
  box2d.b2AreaJoint.prototype.m_frequencyHz
);
box2d.b2AreaJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "m_dampingRatio",
  box2d.b2AreaJoint.prototype.m_dampingRatio
);
box2d.b2AreaJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "m_impulse",
  box2d.b2AreaJoint.prototype.m_impulse
);
box2d.b2AreaJoint.prototype.m_targetLengths = null;
box2d.b2AreaJoint.prototype.m_targetArea = 0;
box2d.b2AreaJoint.prototype.m_normals = null;
box2d.b2AreaJoint.prototype.m_joints = null;
box2d.b2AreaJoint.prototype.m_deltas = null;
box2d.b2AreaJoint.prototype.m_delta = null;
box2d.b2AreaJoint.prototype.GetAnchorA = function (a) {
  return a.SetZero();
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetAnchorA",
  box2d.b2AreaJoint.prototype.GetAnchorA
);
box2d.b2AreaJoint.prototype.GetAnchorB = function (a) {
  return a.SetZero();
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetAnchorB",
  box2d.b2AreaJoint.prototype.GetAnchorB
);
box2d.b2AreaJoint.prototype.GetReactionForce = function (a, b) {
  return b.SetZero();
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetReactionForce",
  box2d.b2AreaJoint.prototype.GetReactionForce
);
box2d.b2AreaJoint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetReactionTorque",
  box2d.b2AreaJoint.prototype.GetReactionTorque
);
box2d.b2AreaJoint.prototype.SetFrequency = function (a) {
  this.m_frequencyHz = a;
  for (var b = 0, c = this.m_joints.length; b < c; ++b)
    this.m_joints[b].SetFrequency(a);
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "SetFrequency",
  box2d.b2AreaJoint.prototype.SetFrequency
);
box2d.b2AreaJoint.prototype.GetFrequency = function () {
  return this.m_frequencyHz;
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetFrequency",
  box2d.b2AreaJoint.prototype.GetFrequency
);
box2d.b2AreaJoint.prototype.SetDampingRatio = function (a) {
  this.m_dampingRatio = a;
  for (var b = 0, c = this.m_joints.length; b < c; ++b)
    this.m_joints[b].SetDampingRatio(a);
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "SetDampingRatio",
  box2d.b2AreaJoint.prototype.SetDampingRatio
);
box2d.b2AreaJoint.prototype.GetDampingRatio = function () {
  return this.m_dampingRatio;
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "GetDampingRatio",
  box2d.b2AreaJoint.prototype.GetDampingRatio
);
box2d.b2AreaJoint.prototype.Dump = function () {
  box2d.DEBUG && box2d.b2Log("Area joint dumping is not supported.\n");
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "Dump",
  box2d.b2AreaJoint.prototype.Dump
);
box2d.b2AreaJoint.prototype.InitVelocityConstraints = function (a) {
  for (var b = 0, c = this.m_bodies.length; b < c; ++b) {
    var d = this.m_deltas[b];
    box2d.b2Sub_V2_V2(
      a.positions[this.m_bodies[(b + 1) % c].m_islandIndex].c,
      a.positions[this.m_bodies[(b + c - 1) % c].m_islandIndex].c,
      d
    );
  }
  if (a.step.warmStarting)
    for (
      this.m_impulse *= a.step.dtRatio, b = 0, c = this.m_bodies.length;
      b < c;
      ++b
    ) {
      var e = this.m_bodies[b],
        f = a.velocities[e.m_islandIndex].v,
        d = this.m_deltas[b];
      f.x += e.m_invMass * d.y * 0.5 * this.m_impulse;
      f.y += e.m_invMass * -d.x * 0.5 * this.m_impulse;
    }
  else this.m_impulse = 0;
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2AreaJoint.prototype.InitVelocityConstraints
);
box2d.b2AreaJoint.prototype.SolveVelocityConstraints = function (a) {
  for (var b = 0, c = 0, d = 0, e = this.m_bodies.length; d < e; ++d)
    var f = this.m_bodies[d],
      g = a.velocities[f.m_islandIndex].v,
      h = this.m_deltas[d],
      b = b + h.LengthSquared() / f.GetMass(),
      c = c + box2d.b2Cross_V2_V2(g, h);
  b = (-2 * c) / b;
  this.m_impulse += b;
  d = 0;
  for (e = this.m_bodies.length; d < e; ++d)
    (f = this.m_bodies[d]),
      (g = a.velocities[f.m_islandIndex].v),
      (h = this.m_deltas[d]),
      (g.x += f.m_invMass * h.y * 0.5 * b),
      (g.y += f.m_invMass * -h.x * 0.5 * b);
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2AreaJoint.prototype.SolveVelocityConstraints
);
box2d.b2AreaJoint.prototype.SolvePositionConstraints = function (a) {
  for (var b = 0, c = 0, d = 0, e = this.m_bodies.length; d < e; ++d) {
    var f = this.m_bodies[d],
      f = a.positions[f.m_islandIndex].c,
      g = a.positions[this.m_bodies[(d + 1) % e].m_islandIndex].c,
      h = box2d.b2Sub_V2_V2(g, f, this.m_delta),
      k = h.Length();
    k < box2d.b2_epsilon && (k = 1);
    this.m_normals[d].x = h.y / k;
    this.m_normals[d].y = -h.x / k;
    b += k;
    c += box2d.b2Cross_V2_V2(f, g);
  }
  b = (0.5 * (this.m_targetArea - 0.5 * c)) / b;
  c = !0;
  d = 0;
  for (e = this.m_bodies.length; d < e; ++d)
    (f = this.m_bodies[d]),
      (f = a.positions[f.m_islandIndex].c),
      (h = box2d.b2Add_V2_V2(
        this.m_normals[d],
        this.m_normals[(d + 1) % e],
        this.m_delta
      )),
      h.SelfMul(b),
      (g = h.LengthSquared()),
      g > box2d.b2Sq(box2d.b2_maxLinearCorrection) &&
        h.SelfMul(box2d.b2_maxLinearCorrection / box2d.b2Sqrt(g)),
      g > box2d.b2Sq(box2d.b2_linearSlop) && (c = !1),
      (f.x += h.x),
      (f.y += h.y);
  return c;
};
goog.exportProperty(
  box2d.b2AreaJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2AreaJoint.prototype.SolvePositionConstraints
);
box2d.b2DistanceJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_distanceJoint);
  this.localAnchorA = new box2d.b2Vec2();
  this.localAnchorB = new box2d.b2Vec2();
};
goog.inherits(box2d.b2DistanceJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2DistanceJointDef", box2d.b2DistanceJointDef);
box2d.b2DistanceJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "localAnchorA",
  box2d.b2DistanceJointDef.prototype.localAnchorA
);
box2d.b2DistanceJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "localAnchorB",
  box2d.b2DistanceJointDef.prototype.localAnchorB
);
box2d.b2DistanceJointDef.prototype.length = 1;
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "length",
  box2d.b2DistanceJointDef.prototype.length
);
box2d.b2DistanceJointDef.prototype.frequencyHz = 0;
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "frequencyHz",
  box2d.b2DistanceJointDef.prototype.frequencyHz
);
box2d.b2DistanceJointDef.prototype.dampingRatio = 0;
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "dampingRatio",
  box2d.b2DistanceJointDef.prototype.dampingRatio
);
box2d.b2DistanceJointDef.prototype.Initialize = function (a, b, c, d) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(d, this.localAnchorB);
  this.length = box2d.b2Distance(c, d);
  this.dampingRatio = this.frequencyHz = 0;
};
goog.exportProperty(
  box2d.b2DistanceJointDef.prototype,
  "Initialize",
  box2d.b2DistanceJointDef.prototype.Initialize
);
box2d.b2DistanceJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_u = new box2d.b2Vec2();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_length = a.length;
};
goog.inherits(box2d.b2DistanceJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2DistanceJoint", box2d.b2DistanceJoint);
box2d.b2DistanceJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_frequencyHz",
  box2d.b2DistanceJoint.prototype.m_frequencyHz
);
box2d.b2DistanceJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_dampingRatio",
  box2d.b2DistanceJoint.prototype.m_dampingRatio
);
box2d.b2DistanceJoint.prototype.m_bias = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_bias",
  box2d.b2DistanceJoint.prototype.m_bias
);
box2d.b2DistanceJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_localAnchorA",
  box2d.b2DistanceJoint.prototype.m_localAnchorA
);
box2d.b2DistanceJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_localAnchorB",
  box2d.b2DistanceJoint.prototype.m_localAnchorB
);
box2d.b2DistanceJoint.prototype.m_gamma = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_gamma",
  box2d.b2DistanceJoint.prototype.m_gamma
);
box2d.b2DistanceJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_impulse",
  box2d.b2DistanceJoint.prototype.m_impulse
);
box2d.b2DistanceJoint.prototype.m_length = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_length",
  box2d.b2DistanceJoint.prototype.m_length
);
box2d.b2DistanceJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_indexA",
  box2d.b2DistanceJoint.prototype.m_indexA
);
box2d.b2DistanceJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_indexB",
  box2d.b2DistanceJoint.prototype.m_indexB
);
box2d.b2DistanceJoint.prototype.m_u = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_u",
  box2d.b2DistanceJoint.prototype.m_u
);
box2d.b2DistanceJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_rA",
  box2d.b2DistanceJoint.prototype.m_rA
);
box2d.b2DistanceJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_rB",
  box2d.b2DistanceJoint.prototype.m_rB
);
box2d.b2DistanceJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_localCenterA",
  box2d.b2DistanceJoint.prototype.m_localCenterA
);
box2d.b2DistanceJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_localCenterB",
  box2d.b2DistanceJoint.prototype.m_localCenterB
);
box2d.b2DistanceJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_invMassA",
  box2d.b2DistanceJoint.prototype.m_invMassA
);
box2d.b2DistanceJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_invMassB",
  box2d.b2DistanceJoint.prototype.m_invMassB
);
box2d.b2DistanceJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_invIA",
  box2d.b2DistanceJoint.prototype.m_invIA
);
box2d.b2DistanceJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_invIB",
  box2d.b2DistanceJoint.prototype.m_invIB
);
box2d.b2DistanceJoint.prototype.m_mass = 0;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_mass",
  box2d.b2DistanceJoint.prototype.m_mass
);
box2d.b2DistanceJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_qA",
  box2d.b2DistanceJoint.prototype.m_qA
);
box2d.b2DistanceJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_qB",
  box2d.b2DistanceJoint.prototype.m_qB
);
box2d.b2DistanceJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_lalcA",
  box2d.b2DistanceJoint.prototype.m_lalcA
);
box2d.b2DistanceJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "m_lalcB",
  box2d.b2DistanceJoint.prototype.m_lalcB
);
box2d.b2DistanceJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetAnchorA",
  box2d.b2DistanceJoint.prototype.GetAnchorA
);
box2d.b2DistanceJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetAnchorB",
  box2d.b2DistanceJoint.prototype.GetAnchorB
);
box2d.b2DistanceJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(
    a * this.m_impulse * this.m_u.x,
    a * this.m_impulse * this.m_u.y
  );
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetReactionForce",
  box2d.b2DistanceJoint.prototype.GetReactionForce
);
box2d.b2DistanceJoint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetReactionTorque",
  box2d.b2DistanceJoint.prototype.GetReactionTorque
);
box2d.b2DistanceJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2DistanceJoint.prototype.GetLocalAnchorA
);
box2d.b2DistanceJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2DistanceJoint.prototype.GetLocalAnchorB
);
box2d.b2DistanceJoint.prototype.SetLength = function (a) {
  this.m_length = a;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "SetLength",
  box2d.b2DistanceJoint.prototype.SetLength
);
box2d.b2DistanceJoint.prototype.GetLength = function () {
  return this.m_length;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetLength",
  box2d.b2DistanceJoint.prototype.GetLength
);
box2d.b2DistanceJoint.prototype.SetFrequency = function (a) {
  this.m_frequencyHz = a;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "SetFrequency",
  box2d.b2DistanceJoint.prototype.SetFrequency
);
box2d.b2DistanceJoint.prototype.GetFrequency = function () {
  return this.m_frequencyHz;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetFrequency",
  box2d.b2DistanceJoint.prototype.GetFrequency
);
box2d.b2DistanceJoint.prototype.SetDampingRatio = function (a) {
  this.m_dampingRatio = a;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "SetDampingRatio",
  box2d.b2DistanceJoint.prototype.SetDampingRatio
);
box2d.b2DistanceJoint.prototype.GetDampingRatio = function () {
  return this.m_dampingRatio;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "GetDampingRatio",
  box2d.b2DistanceJoint.prototype.GetDampingRatio
);
box2d.b2DistanceJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2DistanceJointDef*/ var jd = new box2d.b2DistanceJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.length = %.15f;\n", this.m_length);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "Dump",
  box2d.b2DistanceJoint.prototype.Dump
);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    k = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngle(f);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2Mul_R_V2(k, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(f, this.m_lalcB, this.m_rB);
  this.m_u.x = e.x + this.m_rB.x - b.x - this.m_rA.x;
  this.m_u.y = e.y + this.m_rB.y - b.y - this.m_rA.y;
  e = this.m_u.Length();
  e > box2d.b2_linearSlop ? this.m_u.SelfMul(1 / e) : this.m_u.SetZero();
  b = box2d.b2Cross_V2_V2(this.m_rA, this.m_u);
  k = box2d.b2Cross_V2_V2(this.m_rB, this.m_u);
  b =
    this.m_invMassA +
    this.m_invIA * b * b +
    this.m_invMassB +
    this.m_invIB * k * k;
  this.m_mass = 0 !== b ? 1 / b : 0;
  if (0 < this.m_frequencyHz) {
    var e = e - this.m_length,
      k = 2 * box2d.b2_pi * this.m_frequencyHz,
      f = this.m_mass * k * k,
      l = a.step.dt;
    this.m_gamma = l * (2 * this.m_mass * this.m_dampingRatio * k + l * f);
    this.m_gamma = 0 !== this.m_gamma ? 1 / this.m_gamma : 0;
    this.m_bias = e * l * f * this.m_gamma;
    b += this.m_gamma;
    this.m_mass = 0 !== b ? 1 / b : 0;
  } else this.m_bias = this.m_gamma = 0;
  a.step.warmStarting
    ? ((this.m_impulse *= a.step.dtRatio),
      (b = box2d.b2Mul_S_V2(
        this.m_impulse,
        this.m_u,
        box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P
      )),
      c.SelfMulSub(this.m_invMassA, b),
      (d -= this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, b)),
      g.SelfMulAdd(this.m_invMassB, b),
      (h += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, b)))
    : (this.m_impulse = 0);
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = h;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2DistanceJoint.prototype.InitVelocityConstraints
);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = box2d.b2AddCross_V2_S_V2(
      b,
      c,
      this.m_rA,
      box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA
    ),
    g = box2d.b2AddCross_V2_S_V2(
      d,
      e,
      this.m_rB,
      box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB
    ),
    f = box2d.b2Dot_V2_V2(this.m_u, box2d.b2Sub_V2_V2(g, f, box2d.b2Vec2.s_t0)),
    f = -this.m_mass * (f + this.m_bias + this.m_gamma * this.m_impulse);
  this.m_impulse += f;
  f = box2d.b2Mul_S_V2(
    f,
    this.m_u,
    box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P
  );
  b.SelfMulSub(this.m_invMassA, f);
  c -= this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, f);
  d.SelfMulAdd(this.m_invMassB, f);
  e += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, f);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2DistanceJoint.prototype.SolveVelocityConstraints
);
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2();
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2();
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2DistanceJoint.prototype.SolvePositionConstraints = function (a) {
  if (0 < this.m_frequencyHz) return !0;
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a;
  this.m_qA.SetAngle(c);
  this.m_qB.SetAngle(e);
  var f = box2d.b2Mul_R_V2(this.m_qA, this.m_lalcA, this.m_rA),
    g = box2d.b2Mul_R_V2(this.m_qB, this.m_lalcB, this.m_rB),
    h = this.m_u;
  h.x = d.x + g.x - b.x - f.x;
  h.y = d.y + g.y - b.y - f.y;
  var k = this.m_u.Normalize() - this.m_length,
    k = box2d.b2Clamp(
      k,
      -box2d.b2_maxLinearCorrection,
      box2d.b2_maxLinearCorrection
    ),
    h = box2d.b2Mul_S_V2(
      -this.m_mass * k,
      h,
      box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P
    );
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2Cross_V2_V2(f, h);
  d.SelfMulAdd(this.m_invMassB, h);
  e += this.m_invIB * box2d.b2Cross_V2_V2(g, h);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return box2d.b2Abs(k) < box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2DistanceJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2DistanceJoint.prototype.SolvePositionConstraints
);
box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2FrictionJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_frictionJoint);
  this.localAnchorA = new box2d.b2Vec2();
  this.localAnchorB = new box2d.b2Vec2();
};
goog.inherits(box2d.b2FrictionJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2FrictionJointDef", box2d.b2FrictionJointDef);
box2d.b2FrictionJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2FrictionJointDef.prototype,
  "localAnchorA",
  box2d.b2FrictionJointDef.prototype.localAnchorA
);
box2d.b2FrictionJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2FrictionJointDef.prototype,
  "localAnchorB",
  box2d.b2FrictionJointDef.prototype.localAnchorB
);
box2d.b2FrictionJointDef.prototype.maxForce = 0;
goog.exportProperty(
  box2d.b2FrictionJointDef.prototype,
  "maxForce",
  box2d.b2FrictionJointDef.prototype.maxForce
);
box2d.b2FrictionJointDef.prototype.maxTorque = 0;
goog.exportProperty(
  box2d.b2FrictionJointDef.prototype,
  "maxTorque",
  box2d.b2FrictionJointDef.prototype.maxTorque
);
box2d.b2FrictionJointDef.prototype.Initialize = function (a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
};
goog.exportProperty(
  box2d.b2FrictionJointDef.prototype,
  "Initialize",
  box2d.b2FrictionJointDef.prototype.Initialize
);
box2d.b2FrictionJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_linearImpulse = new box2d.b2Vec2().SetZero();
  this.m_maxForce = a.maxForce;
  this.m_maxTorque = a.maxTorque;
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_linearMass = new box2d.b2Mat22().SetZero();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_K = new box2d.b2Mat22();
};
goog.inherits(box2d.b2FrictionJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2FrictionJoint", box2d.b2FrictionJoint);
box2d.b2FrictionJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_localAnchorA",
  box2d.b2FrictionJoint.prototype.m_localAnchorA
);
box2d.b2FrictionJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_localAnchorB",
  box2d.b2FrictionJoint.prototype.m_localAnchorB
);
box2d.b2FrictionJoint.prototype.m_linearImpulse = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_linearImpulse",
  box2d.b2FrictionJoint.prototype.m_linearImpulse
);
box2d.b2FrictionJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_angularImpulse",
  box2d.b2FrictionJoint.prototype.m_angularImpulse
);
box2d.b2FrictionJoint.prototype.m_maxForce = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_maxForce",
  box2d.b2FrictionJoint.prototype.m_maxForce
);
box2d.b2FrictionJoint.prototype.m_maxTorque = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_maxTorque",
  box2d.b2FrictionJoint.prototype.m_maxTorque
);
box2d.b2FrictionJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_indexA",
  box2d.b2FrictionJoint.prototype.m_indexA
);
box2d.b2FrictionJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_indexB",
  box2d.b2FrictionJoint.prototype.m_indexB
);
box2d.b2FrictionJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_rA",
  box2d.b2FrictionJoint.prototype.m_rA
);
box2d.b2FrictionJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_rB",
  box2d.b2FrictionJoint.prototype.m_rB
);
box2d.b2FrictionJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_localCenterA",
  box2d.b2FrictionJoint.prototype.m_localCenterA
);
box2d.b2FrictionJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_localCenterB",
  box2d.b2FrictionJoint.prototype.m_localCenterB
);
box2d.b2FrictionJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_invMassA",
  box2d.b2FrictionJoint.prototype.m_invMassA
);
box2d.b2FrictionJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_invMassB",
  box2d.b2FrictionJoint.prototype.m_invMassB
);
box2d.b2FrictionJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_invIA",
  box2d.b2FrictionJoint.prototype.m_invIA
);
box2d.b2FrictionJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_invIB",
  box2d.b2FrictionJoint.prototype.m_invIB
);
box2d.b2FrictionJoint.prototype.m_linearMass = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_linearMass",
  box2d.b2FrictionJoint.prototype.m_linearMass
);
box2d.b2FrictionJoint.prototype.m_angularMass = 0;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_angularMass",
  box2d.b2FrictionJoint.prototype.m_angularMass
);
box2d.b2FrictionJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_qA",
  box2d.b2FrictionJoint.prototype.m_qA
);
box2d.b2FrictionJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_qB",
  box2d.b2FrictionJoint.prototype.m_qB
);
box2d.b2FrictionJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_lalcA",
  box2d.b2FrictionJoint.prototype.m_lalcA
);
box2d.b2FrictionJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_lalcB",
  box2d.b2FrictionJoint.prototype.m_lalcB
);
box2d.b2FrictionJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "m_K",
  box2d.b2FrictionJoint.prototype.m_K
);
box2d.b2FrictionJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].a,
    e = a.velocities[this.m_indexB].v,
    f = a.velocities[this.m_indexB].w,
    g = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    d = this.m_qB.SetAngle(d);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  g = box2d.b2Mul_R_V2(g, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var h = box2d.b2Mul_R_V2(d, this.m_lalcB, this.m_rB),
    d = this.m_invMassA,
    k = this.m_invMassB,
    l = this.m_invIA,
    m = this.m_invIB,
    n = this.m_K;
  n.ex.x = d + k + l * g.y * g.y + m * h.y * h.y;
  n.ex.y = -l * g.x * g.y - m * h.x * h.y;
  n.ey.x = n.ex.y;
  n.ey.y = d + k + l * g.x * g.x + m * h.x * h.x;
  n.GetInverse(this.m_linearMass);
  this.m_angularMass = l + m;
  0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
  a.step.warmStarting
    ? (this.m_linearImpulse.SelfMul(a.step.dtRatio),
      (this.m_angularImpulse *= a.step.dtRatio),
      (g = this.m_linearImpulse),
      b.SelfMulSub(d, g),
      (c -= l * (box2d.b2Cross_V2_V2(this.m_rA, g) + this.m_angularImpulse)),
      e.SelfMulAdd(k, g),
      (f += m * (box2d.b2Cross_V2_V2(this.m_rB, g) + this.m_angularImpulse)))
    : (this.m_linearImpulse.SetZero(), (this.m_angularImpulse = 0));
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = f;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2FrictionJoint.prototype.InitVelocityConstraints
);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    k = this.m_invIB,
    l = a.step.dt,
    m,
    n = -this.m_angularMass * (e - c),
    p = this.m_angularImpulse;
  m = l * this.m_maxTorque;
  this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + n, -m, m);
  n = this.m_angularImpulse - p;
  c -= h * n;
  e += k * n;
  m = box2d.b2Sub_V2_V2(
    box2d.b2AddCross_V2_S_V2(d, e, this.m_rB, box2d.b2Vec2.s_t0),
    box2d.b2AddCross_V2_S_V2(b, c, this.m_rA, box2d.b2Vec2.s_t1),
    box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot
  );
  n = box2d
    .b2Mul_M22_V2(
      this.m_linearMass,
      m,
      box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV
    )
    .SelfNeg();
  p = box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV.Copy(
    this.m_linearImpulse
  );
  this.m_linearImpulse.SelfAdd(n);
  m = l * this.m_maxForce;
  this.m_linearImpulse.LengthSquared() > m * m &&
    (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(m));
  box2d.b2Sub_V2_V2(this.m_linearImpulse, p, n);
  b.SelfMulSub(f, n);
  c -= h * box2d.b2Cross_V2_V2(this.m_rA, n);
  d.SelfMulAdd(g, n);
  e += k * box2d.b2Cross_V2_V2(this.m_rB, n);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2FrictionJoint.prototype.SolveVelocityConstraints
);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2();
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV = new box2d.b2Vec2();
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV = new box2d.b2Vec2();
box2d.b2FrictionJoint.prototype.SolvePositionConstraints = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2FrictionJoint.prototype.SolvePositionConstraints
);
box2d.b2FrictionJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetAnchorA",
  box2d.b2FrictionJoint.prototype.GetAnchorA
);
box2d.b2FrictionJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetAnchorB",
  box2d.b2FrictionJoint.prototype.GetAnchorB
);
box2d.b2FrictionJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(a * this.m_linearImpulse.x, a * this.m_linearImpulse.y);
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetReactionForce",
  box2d.b2FrictionJoint.prototype.GetReactionForce
);
box2d.b2FrictionJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_angularImpulse;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetReactionTorque",
  box2d.b2FrictionJoint.prototype.GetReactionTorque
);
box2d.b2FrictionJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2FrictionJoint.prototype.GetLocalAnchorA
);
box2d.b2FrictionJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2FrictionJoint.prototype.GetLocalAnchorB
);
box2d.b2FrictionJoint.prototype.SetMaxForce = function (a) {
  this.m_maxForce = a;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "SetMaxForce",
  box2d.b2FrictionJoint.prototype.SetMaxForce
);
box2d.b2FrictionJoint.prototype.GetMaxForce = function () {
  return this.m_maxForce;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetMaxForce",
  box2d.b2FrictionJoint.prototype.GetMaxForce
);
box2d.b2FrictionJoint.prototype.SetMaxTorque = function (a) {
  this.m_maxTorque = a;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "SetMaxTorque",
  box2d.b2FrictionJoint.prototype.SetMaxTorque
);
box2d.b2FrictionJoint.prototype.GetMaxTorque = function () {
  return this.m_maxTorque;
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "GetMaxTorque",
  box2d.b2FrictionJoint.prototype.GetMaxTorque
);
box2d.b2FrictionJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2FrictionJointDef*/ var jd = new box2d.b2FrictionJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
    box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2FrictionJoint.prototype,
  "Dump",
  box2d.b2FrictionJoint.prototype.Dump
);
box2d.b2JointFactory = {};
box2d.b2JointFactory.Create = function (a, b) {
  var c = null;
  switch (a.type) {
    case box2d.b2JointType.e_distanceJoint:
      c = new box2d.b2DistanceJoint(
        a instanceof box2d.b2DistanceJointDef ? a : null
      );
      break;
    case box2d.b2JointType.e_mouseJoint:
      c = new box2d.b2MouseJoint(a instanceof box2d.b2MouseJointDef ? a : null);
      break;
    case box2d.b2JointType.e_prismaticJoint:
      c = new box2d.b2PrismaticJoint(
        a instanceof box2d.b2PrismaticJointDef ? a : null
      );
      break;
    case box2d.b2JointType.e_revoluteJoint:
      c = new box2d.b2RevoluteJoint(
        a instanceof box2d.b2RevoluteJointDef ? a : null
      );
      break;
    case box2d.b2JointType.e_pulleyJoint:
      c = new box2d.b2PulleyJoint(
        a instanceof box2d.b2PulleyJointDef ? a : null
      );
      break;
    case box2d.b2JointType.e_gearJoint:
      c = new box2d.b2GearJoint(a instanceof box2d.b2GearJointDef ? a : null);
      break;
    case box2d.b2JointType.e_wheelJoint:
      c = new box2d.b2WheelJoint(a instanceof box2d.b2WheelJointDef ? a : null);
      break;
    case box2d.b2JointType.e_weldJoint:
      c = new box2d.b2WeldJoint(a instanceof box2d.b2WeldJointDef ? a : null);
      break;
    case box2d.b2JointType.e_frictionJoint:
      c = new box2d.b2FrictionJoint(
        a instanceof box2d.b2FrictionJointDef ? a : null
      );
      break;
    case box2d.b2JointType.e_ropeJoint:
      c = new box2d.b2RopeJoint(a instanceof box2d.b2RopeJointDef ? a : null);
      break;
    case box2d.b2JointType.e_motorJoint:
      c = new box2d.b2MotorJoint(a instanceof box2d.b2MotorJointDef ? a : null);
      break;
    case box2d.b2JointType.e_areaJoint:
      c = new box2d.b2AreaJoint(a instanceof box2d.b2AreaJointDef ? a : null);
      break;
    default:
      box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  }
  return c;
};
goog.exportSymbol("box2d.b2JointFactory.Create", box2d.b2JointFactory.Create);
box2d.b2JointFactory.Destroy = function (a, b) {};
goog.exportSymbol("box2d.b2JointFactory.Destroy", box2d.b2JointFactory.Destroy);
box2d.b2World = function (a) {
  this.m_flag_clearForces = !0;
  this.m_contactManager = new box2d.b2ContactManager();
  this.m_gravity = a.Clone();
  this.m_out_gravity = new box2d.b2Vec2();
  this.m_allowSleep = !0;
  this.m_debugDraw = this.m_destructionListener = null;
  this.m_continuousPhysics = this.m_warmStarting = !0;
  this.m_subStepping = !1;
  this.m_stepComplete = !0;
  this.m_profile = new box2d.b2Profile();
  this.m_island = new box2d.b2Island();
  this.s_stack = [];
};
goog.exportSymbol("box2d.b2World", box2d.b2World);
box2d.b2World.prototype.m_flag_newFixture = !1;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_flag_newFixture",
  box2d.b2World.prototype.m_flag_newFixture
);
box2d.b2World.prototype.m_flag_locked = !1;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_flag_locked",
  box2d.b2World.prototype.m_flag_locked
);
box2d.b2World.prototype.m_flag_clearForces = !1;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_flag_clearForces",
  box2d.b2World.prototype.m_flag_clearForces
);
box2d.b2World.prototype.m_contactManager = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_contactManager",
  box2d.b2World.prototype.m_contactManager
);
box2d.b2World.prototype.m_bodyList = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_bodyList",
  box2d.b2World.prototype.m_bodyList
);
box2d.b2World.prototype.m_jointList = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_jointList",
  box2d.b2World.prototype.m_jointList
);
box2d.b2World.prototype.m_particleSystemList = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_particleSystemList",
  box2d.b2World.prototype.m_particleSystemList
);
box2d.b2World.prototype.m_bodyCount = 0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_bodyCount",
  box2d.b2World.prototype.m_bodyCount
);
box2d.b2World.prototype.m_jointCount = 0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_jointCount",
  box2d.b2World.prototype.m_jointCount
);
box2d.b2World.prototype.m_gravity = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_gravity",
  box2d.b2World.prototype.m_gravity
);
box2d.b2World.prototype.m_out_gravity = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_out_gravity",
  box2d.b2World.prototype.m_out_gravity
);
box2d.b2World.prototype.m_allowSleep = !0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_allowSleep",
  box2d.b2World.prototype.m_allowSleep
);
box2d.b2World.prototype.m_destructionListener = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_destructionListener",
  box2d.b2World.prototype.m_destructionListener
);
box2d.b2World.prototype.m_debugDraw = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_debugDraw",
  box2d.b2World.prototype.m_debugDraw
);
box2d.b2World.prototype.m_inv_dt0 = 0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_inv_dt0",
  box2d.b2World.prototype.m_inv_dt0
);
box2d.b2World.prototype.m_warmStarting = !0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_warmStarting",
  box2d.b2World.prototype.m_warmStarting
);
box2d.b2World.prototype.m_continuousPhysics = !0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_continuousPhysics",
  box2d.b2World.prototype.m_continuousPhysics
);
box2d.b2World.prototype.m_subStepping = !1;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_subStepping",
  box2d.b2World.prototype.m_subStepping
);
box2d.b2World.prototype.m_stepComplete = !0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_stepComplete",
  box2d.b2World.prototype.m_stepComplete
);
box2d.b2World.prototype.m_profile = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_profile",
  box2d.b2World.prototype.m_profile
);
box2d.b2World.prototype.m_island = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_island",
  box2d.b2World.prototype.m_island
);
box2d.b2World.prototype.s_stack = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "s_stack",
  box2d.b2World.prototype.s_stack
);
box2d.b2World.prototype.m_controllerList = null;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_controllerList",
  box2d.b2World.prototype.m_controllerList
);
box2d.b2World.prototype.m_controllerCount = 0;
goog.exportProperty(
  box2d.b2World.prototype,
  "m_controllerCount",
  box2d.b2World.prototype.m_controllerCount
);
box2d.b2World.prototype.SetAllowSleeping = function (a) {
  if (a !== this.m_allowSleep && ((this.m_allowSleep = a), !this.m_allowSleep))
    for (a = this.m_bodyList; a; a = a.m_next) a.SetAwake(!0);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetAllowSleeping",
  box2d.b2World.prototype.SetAllowSleeping
);
box2d.b2World.prototype.GetAllowSleeping = function () {
  return this.m_allowSleep;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetAllowSleeping",
  box2d.b2World.prototype.GetAllowSleeping
);
box2d.b2World.prototype.SetWarmStarting = function (a) {
  this.m_warmStarting = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetWarmStarting",
  box2d.b2World.prototype.SetWarmStarting
);
box2d.b2World.prototype.GetWarmStarting = function () {
  return this.m_warmStarting;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetWarmStarting",
  box2d.b2World.prototype.GetWarmStarting
);
box2d.b2World.prototype.SetContinuousPhysics = function (a) {
  this.m_continuousPhysics = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetContinuousPhysics",
  box2d.b2World.prototype.SetContinuousPhysics
);
box2d.b2World.prototype.GetContinuousPhysics = function () {
  return this.m_continuousPhysics;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetContinuousPhysics",
  box2d.b2World.prototype.GetContinuousPhysics
);
box2d.b2World.prototype.SetSubStepping = function (a) {
  this.m_subStepping = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetSubStepping",
  box2d.b2World.prototype.SetSubStepping
);
box2d.b2World.prototype.GetSubStepping = function () {
  return this.m_subStepping;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetSubStepping",
  box2d.b2World.prototype.GetSubStepping
);
box2d.b2World.prototype.GetBodyList = function () {
  return this.m_bodyList;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetBodyList",
  box2d.b2World.prototype.GetBodyList
);
box2d.b2World.prototype.GetJointList = function () {
  return this.m_jointList;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetJointList",
  box2d.b2World.prototype.GetJointList
);
box2d.b2World.prototype.GetParticleSystemList = function () {
  return this.m_particleSystemList;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetParticleSystemList",
  box2d.b2World.prototype.GetParticleSystemList
);
box2d.b2World.prototype.GetContactList = function () {
  return this.m_contactManager.m_contactList;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetContactList",
  box2d.b2World.prototype.GetContactList
);
box2d.b2World.prototype.GetBodyCount = function () {
  return this.m_bodyCount;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetBodyCount",
  box2d.b2World.prototype.GetBodyCount
);
box2d.b2World.prototype.GetJointCount = function () {
  return this.m_jointCount;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetJointCount",
  box2d.b2World.prototype.GetJointCount
);
box2d.b2World.prototype.GetContactCount = function () {
  return this.m_contactManager.m_contactCount;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetContactCount",
  box2d.b2World.prototype.GetContactCount
);
box2d.b2World.prototype.SetGravity = function (a, b) {
  b = b || !0;
  if (this.m_gravity.x !== a.x || this.m_gravity.y !== a.y)
    if ((this.m_gravity.Copy(a), b))
      for (var c = this.m_bodyList; c; c = c.m_next) c.SetAwake(!0);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetGravity",
  box2d.b2World.prototype.SetGravity
);
box2d.b2World.prototype.GetGravity = function (a) {
  a = a || this.m_out_gravity;
  return a.Copy(this.m_gravity);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetGravity",
  box2d.b2World.prototype.GetGravity
);
box2d.b2World.prototype.IsLocked = function () {
  return this.m_flag_locked;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "IsLocked",
  box2d.b2World.prototype.IsLocked
);
box2d.b2World.prototype.SetAutoClearForces = function (a) {
  this.m_flag_clearForces = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetAutoClearForces",
  box2d.b2World.prototype.SetAutoClearForces
);
box2d.b2World.prototype.GetAutoClearForces = function () {
  return this.m_flag_clearForces;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetAutoClearForces",
  box2d.b2World.prototype.GetAutoClearForces
);
box2d.b2World.prototype.GetContactManager = function () {
  return this.m_contactManager;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetContactManager",
  box2d.b2World.prototype.GetContactManager
);
box2d.b2World.prototype.GetProfile = function () {
  return this.m_profile;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetProfile",
  box2d.b2World.prototype.GetProfile
);
box2d.b2World.prototype.SetDestructionListener = function (a) {
  this.m_destructionListener = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetDestructionListener",
  box2d.b2World.prototype.SetDestructionListener
);
box2d.b2World.prototype.SetContactFilter = function (a) {
  this.m_contactManager.m_contactFilter = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetContactFilter",
  box2d.b2World.prototype.SetContactFilter
);
box2d.b2World.prototype.SetContactListener = function (a) {
  this.m_contactManager.m_contactListener = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetContactListener",
  box2d.b2World.prototype.SetContactListener
);
box2d.b2World.prototype.SetDebugDraw = function (a) {
  this.m_debugDraw = a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetDebugDraw",
  box2d.b2World.prototype.SetDebugDraw
);
box2d.b2World.prototype.CreateBody = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (this.IsLocked()) return null;
  a = new box2d.b2Body(a, this);
  a.m_prev = null;
  if ((a.m_next = this.m_bodyList)) this.m_bodyList.m_prev = a;
  this.m_bodyList = a;
  ++this.m_bodyCount;
  return a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "CreateBody",
  box2d.b2World.prototype.CreateBody
);
box2d.b2World.prototype.DestroyBody = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (!this.IsLocked()) {
    for (var b = a.m_jointList; b; ) {
      var c = b,
        b = b.next;
      this.m_destructionListener &&
        this.m_destructionListener.SayGoodbyeJoint(c.joint);
      this.DestroyJoint(c.joint);
      a.m_jointList = b;
    }
    a.m_jointList = null;
    for (b = a.m_controllerList; b; )
      (c = b), (b = b.nextController), c.controller.RemoveBody(a);
    for (b = a.m_contactList; b; )
      (c = b), (b = b.next), this.m_contactManager.Destroy(c.contact);
    a.m_contactList = null;
    for (b = a.m_fixtureList; b; )
      (c = b),
        (b = b.m_next),
        this.m_destructionListener &&
          this.m_destructionListener.SayGoodbyeFixture(c),
        c.DestroyProxies(this.m_contactManager.m_broadPhase),
        c.Destroy(),
        (a.m_fixtureList = b),
        --a.m_fixtureCount;
    a.m_fixtureList = null;
    a.m_fixtureCount = 0;
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    a === this.m_bodyList && (this.m_bodyList = a.m_next);
    --this.m_bodyCount;
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DestroyBody",
  box2d.b2World.prototype.DestroyBody
);
box2d.b2World.prototype.CreateJoint = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (this.IsLocked()) return null;
  var b = box2d.b2JointFactory.Create(a, null);
  b.m_prev = null;
  if ((b.m_next = this.m_jointList)) this.m_jointList.m_prev = b;
  this.m_jointList = b;
  ++this.m_jointCount;
  b.m_edgeA.joint = b;
  b.m_edgeA.other = b.m_bodyB;
  b.m_edgeA.prev = null;
  if ((b.m_edgeA.next = b.m_bodyA.m_jointList))
    b.m_bodyA.m_jointList.prev = b.m_edgeA;
  b.m_bodyA.m_jointList = b.m_edgeA;
  b.m_edgeB.joint = b;
  b.m_edgeB.other = b.m_bodyA;
  b.m_edgeB.prev = null;
  if ((b.m_edgeB.next = b.m_bodyB.m_jointList))
    b.m_bodyB.m_jointList.prev = b.m_edgeB;
  b.m_bodyB.m_jointList = b.m_edgeB;
  var c = a.bodyA,
    d = a.bodyB;
  if (!a.collideConnected)
    for (a = d.GetContactList(); a; )
      a.other === c && a.contact.FlagForFiltering(), (a = a.next);
  return b;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "CreateJoint",
  box2d.b2World.prototype.CreateJoint
);
box2d.b2World.prototype.DestroyJoint = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (!this.IsLocked()) {
    var b = a.m_collideConnected;
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    a === this.m_jointList && (this.m_jointList = a.m_next);
    var c = a.m_bodyA,
      d = a.m_bodyB;
    c.SetAwake(!0);
    d.SetAwake(!0);
    a.m_edgeA.prev && (a.m_edgeA.prev.next = a.m_edgeA.next);
    a.m_edgeA.next && (a.m_edgeA.next.prev = a.m_edgeA.prev);
    a.m_edgeA === c.m_jointList && (c.m_jointList = a.m_edgeA.next);
    a.m_edgeA.prev = null;
    a.m_edgeA.next = null;
    a.m_edgeB.prev && (a.m_edgeB.prev.next = a.m_edgeB.next);
    a.m_edgeB.next && (a.m_edgeB.next.prev = a.m_edgeB.prev);
    a.m_edgeB === d.m_jointList && (d.m_jointList = a.m_edgeB.next);
    a.m_edgeB.prev = null;
    a.m_edgeB.next = null;
    box2d.b2JointFactory.Destroy(a, null);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_jointCount);
    --this.m_jointCount;
    if (!b)
      for (a = d.GetContactList(); a; )
        a.other === c && a.contact.FlagForFiltering(), (a = a.next);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DestroyJoint",
  box2d.b2World.prototype.DestroyJoint
);
box2d.b2World.prototype.CreateParticleSystem = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (this.IsLocked()) return null;
  a = new box2d.b2ParticleSystem(a, this);
  a.m_prev = null;
  if ((a.m_next = this.m_particleSystemList))
    this.m_particleSystemList.m_prev = a;
  return (this.m_particleSystemList = a);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "CreateParticleSystem",
  box2d.b2World.prototype.CreateParticleSystem
);
box2d.b2World.prototype.DestroyParticleSystem = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  this.IsLocked() ||
    (a.m_prev && (a.m_prev.m_next = a.m_next),
    a.m_next && (a.m_next.m_prev = a.m_prev),
    a === this.m_particleSystemList && (this.m_particleSystemList = a.m_next));
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DestroyParticleSystem",
  box2d.b2World.prototype.DestroyParticleSystem
);
box2d.b2World.prototype.Solve = function (a) {
  for (var b = this.m_bodyList; b; b = b.m_next) b.m_xf0.Copy(b.m_xf);
  for (var c = this.m_controllerList; c; c = c.m_next) c.Step(a);
  this.m_profile.solveInit = 0;
  this.m_profile.solveVelocity = 0;
  this.m_profile.solvePosition = 0;
  c = this.m_island;
  c.Initialize(
    this.m_bodyCount,
    this.m_contactManager.m_contactCount,
    this.m_jointCount,
    null,
    this.m_contactManager.m_contactListener
  );
  for (b = this.m_bodyList; b; b = b.m_next) b.m_flag_islandFlag = !1;
  for (var d = this.m_contactManager.m_contactList; d; d = d.m_next)
    d.m_flag_islandFlag = !1;
  for (d = this.m_jointList; d; d = d.m_next) d.m_islandFlag = !1;
  for (
    var d = this.m_bodyCount, e = this.s_stack, f = this.m_bodyList;
    f;
    f = f.m_next
  )
    if (
      !f.m_flag_islandFlag &&
      f.IsAwake() &&
      f.IsActive() &&
      f.GetType() !== box2d.b2BodyType.b2_staticBody
    ) {
      c.Clear();
      var g = 0;
      e[g++] = f;
      for (f.m_flag_islandFlag = !0; 0 < g; )
        if (
          ((b = e[--g]),
          box2d.ENABLE_ASSERTS && box2d.b2Assert(b.IsActive()),
          c.AddBody(b),
          b.SetAwake(!0),
          b.GetType() !== box2d.b2BodyType.b2_staticBody)
        ) {
          for (var h = b.m_contactList; h; h = h.next) {
            var k = h.contact;
            if (!k.m_flag_islandFlag && k.IsEnabled() && k.IsTouching()) {
              var l = k.m_fixtureB.m_isSensor;
              k.m_fixtureA.m_isSensor ||
                l ||
                (c.AddContact(k),
                (k.m_flag_islandFlag = !0),
                (k = h.other),
                k.m_flag_islandFlag ||
                  (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < d),
                  (e[g++] = k),
                  (k.m_flag_islandFlag = !0)));
            }
          }
          for (b = b.m_jointList; b; b = b.next)
            b.joint.m_islandFlag ||
              ((k = b.other),
              k.IsActive() &&
                (c.AddJoint(b.joint),
                (b.joint.m_islandFlag = !0),
                k.m_flag_islandFlag ||
                  (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < d),
                  (e[g++] = k),
                  (k.m_flag_islandFlag = !0))));
        }
      b = new box2d.b2Profile();
      c.Solve(b, a, this.m_gravity, this.m_allowSleep);
      this.m_profile.solveInit += b.solveInit;
      this.m_profile.solveVelocity += b.solveVelocity;
      this.m_profile.solvePosition += b.solvePosition;
      for (g = 0; g < c.m_bodyCount; ++g)
        (b = c.m_bodies[g]),
          b.GetType() === box2d.b2BodyType.b2_staticBody &&
            (b.m_flag_islandFlag = !1);
    }
  for (g = 0; g < e.length && e[g]; ++g) e[g] = null;
  a = new box2d.b2Timer();
  for (b = this.m_bodyList; b; b = b.m_next)
    b.m_flag_islandFlag &&
      b.GetType() !== box2d.b2BodyType.b2_staticBody &&
      b.SynchronizeFixtures();
  this.m_contactManager.FindNewContacts();
  this.m_profile.broadphase = a.GetMilliseconds();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "Solve",
  box2d.b2World.prototype.Solve
);
box2d.b2World.prototype.SolveTOI = function (a) {
  var b = this.m_island;
  b.Initialize(
    2 * box2d.b2_maxTOIContacts,
    box2d.b2_maxTOIContacts,
    0,
    null,
    this.m_contactManager.m_contactListener
  );
  if (this.m_stepComplete) {
    for (var c = this.m_bodyList; c; c = c.m_next)
      (c.m_flag_islandFlag = !1), (c.m_sweep.alpha0 = 0);
    for (var d = this.m_contactManager.m_contactList; d; d = d.m_next)
      (d.m_flag_toiFlag = d.m_flag_islandFlag = !1),
        (d.m_toiCount = 0),
        (d.m_toi = 1);
  }
  for (;;) {
    for (
      var e = null, c = 1, d = this.m_contactManager.m_contactList;
      d;
      d = d.m_next
    )
      if (d.IsEnabled() && !(d.m_toiCount > box2d.b2_maxSubSteps)) {
        var f = 1;
        if (d.m_flag_toiFlag) f = d.m_toi;
        else {
          var g = d.GetFixtureA(),
            h = d.GetFixtureB();
          if (g.IsSensor() || h.IsSensor()) continue;
          var f = g.GetBody(),
            k = h.GetBody(),
            l = f.m_type,
            m = k.m_type;
          box2d.ENABLE_ASSERTS &&
            box2d.b2Assert(
              l !== box2d.b2BodyType.b2_staticBody ||
                m !== box2d.b2BodyType.b2_staticBody
            );
          var n = f.IsAwake() && l !== box2d.b2BodyType.b2_staticBody,
            p = k.IsAwake() && m !== box2d.b2BodyType.b2_staticBody;
          if (!n && !p) continue;
          l = f.IsBullet() || l !== box2d.b2BodyType.b2_dynamicBody;
          m = k.IsBullet() || m !== box2d.b2BodyType.b2_dynamicBody;
          if (!l && !m) continue;
          m = f.m_sweep.alpha0;
          f.m_sweep.alpha0 < k.m_sweep.alpha0
            ? ((m = k.m_sweep.alpha0), f.m_sweep.Advance(m))
            : k.m_sweep.alpha0 < f.m_sweep.alpha0 &&
              ((m = f.m_sweep.alpha0), k.m_sweep.Advance(m));
          box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > m);
          n = d.GetChildIndexA();
          p = d.GetChildIndexB();
          l = box2d.b2World.prototype.SolveTOI.s_toi_input;
          l.proxyA.SetShape(g.GetShape(), n);
          l.proxyB.SetShape(h.GetShape(), p);
          l.sweepA.Copy(f.m_sweep);
          l.sweepB.Copy(k.m_sweep);
          l.tMax = 1;
          f = box2d.b2World.prototype.SolveTOI.s_toi_output;
          box2d.b2TimeOfImpact(f, l);
          k = f.t;
          f =
            f.state === box2d.b2TOIOutputState.e_touching
              ? box2d.b2Min(m + (1 - m) * k, 1)
              : 1;
          d.m_toi = f;
          d.m_flag_toiFlag = !0;
        }
        f < c && ((e = d), (c = f));
      }
    if (null === e || 1 - 10 * box2d.b2_epsilon < c) {
      this.m_stepComplete = !0;
      break;
    }
    g = e.GetFixtureA();
    h = e.GetFixtureB();
    f = g.GetBody();
    k = h.GetBody();
    d = box2d.b2World.prototype.SolveTOI.s_backup1.Copy(f.m_sweep);
    g = box2d.b2World.prototype.SolveTOI.s_backup2.Copy(k.m_sweep);
    f.Advance(c);
    k.Advance(c);
    e.Update(this.m_contactManager.m_contactListener);
    e.m_flag_toiFlag = !1;
    ++e.m_toiCount;
    if (e.IsEnabled() && e.IsTouching()) {
      f.SetAwake(!0);
      k.SetAwake(!0);
      b.Clear();
      b.AddBody(f);
      b.AddBody(k);
      b.AddContact(e);
      f.m_flag_islandFlag = !0;
      k.m_flag_islandFlag = !0;
      e.m_flag_islandFlag = !0;
      for (e = 0; 2 > e; ++e)
        if (
          ((d = 0 === e ? f : k), d.m_type === box2d.b2BodyType.b2_dynamicBody)
        )
          for (
            g = d.m_contactList;
            g &&
            b.m_bodyCount !== b.m_bodyCapacity &&
            b.m_contactCount !== b.m_contactCapacity;
            g = g.next
          )
            (h = g.contact),
              !h.m_flag_islandFlag &&
                ((m = g.other),
                m.m_type !== box2d.b2BodyType.b2_dynamicBody ||
                  d.IsBullet() ||
                  m.IsBullet()) &&
                ((l = h.m_fixtureB.m_isSensor),
                h.m_fixtureA.m_isSensor ||
                  l ||
                  ((l = box2d.b2World.prototype.SolveTOI.s_backup.Copy(
                    m.m_sweep
                  )),
                  m.m_flag_islandFlag || m.Advance(c),
                  h.Update(this.m_contactManager.m_contactListener),
                  h.IsEnabled()
                    ? h.IsTouching()
                      ? ((h.m_flag_islandFlag = !0),
                        b.AddContact(h),
                        m.m_flag_islandFlag ||
                          ((m.m_flag_islandFlag = !0),
                          m.m_type !== box2d.b2BodyType.b2_staticBody &&
                            m.SetAwake(!0),
                          b.AddBody(m)))
                      : (m.m_sweep.Copy(l), m.SynchronizeTransform())
                    : (m.m_sweep.Copy(l), m.SynchronizeTransform())));
      e = box2d.b2World.prototype.SolveTOI.s_subStep;
      e.dt = (1 - c) * a.dt;
      e.inv_dt = 1 / e.dt;
      e.dtRatio = 1;
      e.positionIterations = 20;
      e.velocityIterations = a.velocityIterations;
      e.particleIterations = a.particleIterations;
      e.warmStarting = !1;
      b.SolveTOI(e, f.m_islandIndex, k.m_islandIndex);
      for (e = 0; e < b.m_bodyCount; ++e)
        if (
          ((d = b.m_bodies[e]),
          (d.m_flag_islandFlag = !1),
          d.m_type === box2d.b2BodyType.b2_dynamicBody)
        )
          for (d.SynchronizeFixtures(), g = d.m_contactList; g; g = g.next)
            g.contact.m_flag_toiFlag = g.contact.m_flag_islandFlag = !1;
      this.m_contactManager.FindNewContacts();
      if (this.m_subStepping) {
        this.m_stepComplete = !1;
        break;
      }
    } else
      e.SetEnabled(!1),
        f.m_sweep.Copy(d),
        k.m_sweep.Copy(g),
        f.SynchronizeTransform(),
        k.SynchronizeTransform();
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SolveTOI",
  box2d.b2World.prototype.SolveTOI
);
box2d.b2World.prototype.SolveTOI.s_subStep = new box2d.b2TimeStep();
box2d.b2World.prototype.SolveTOI.s_backup = new box2d.b2Sweep();
box2d.b2World.prototype.SolveTOI.s_backup1 = new box2d.b2Sweep();
box2d.b2World.prototype.SolveTOI.s_backup2 = new box2d.b2Sweep();
box2d.b2World.prototype.SolveTOI.s_toi_input = new box2d.b2TOIInput();
box2d.b2World.prototype.SolveTOI.s_toi_output = new box2d.b2TOIOutput();
box2d.b2World.prototype.Step = function (a, b, c, d) {
  d = d || this.CalculateReasonableParticleIterations(a);
  var e = new box2d.b2Timer();
  this.m_flag_newFixture &&
    (this.m_contactManager.FindNewContacts(), (this.m_flag_newFixture = !1));
  this.m_flag_locked = !0;
  var f = box2d.b2World.prototype.Step.s_step;
  f.dt = a;
  f.velocityIterations = b;
  f.positionIterations = c;
  f.particleIterations = d;
  f.inv_dt = 0 < a ? 1 / a : 0;
  f.dtRatio = this.m_inv_dt0 * a;
  f.warmStarting = this.m_warmStarting;
  a = new box2d.b2Timer();
  this.m_contactManager.Collide();
  this.m_profile.collide = a.GetMilliseconds();
  if (this.m_stepComplete && 0 < f.dt) {
    a = new box2d.b2Timer();
    for (b = this.m_particleSystemList; b; b = b.m_next) b.Solve(f);
    this.Solve(f);
    this.m_profile.solve = a.GetMilliseconds();
  }
  this.m_continuousPhysics &&
    0 < f.dt &&
    ((a = new box2d.b2Timer()),
    this.SolveTOI(f),
    (this.m_profile.solveTOI = a.GetMilliseconds()));
  0 < f.dt && (this.m_inv_dt0 = f.inv_dt);
  this.m_flag_clearForces && this.ClearForces();
  this.m_flag_locked = !1;
  this.m_profile.step = e.GetMilliseconds();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "Step",
  box2d.b2World.prototype.Step
);
box2d.b2World.prototype.Step.s_step = new box2d.b2TimeStep();
box2d.b2World.prototype.ClearForces = function () {
  for (var a = this.m_bodyList; a; a = a.m_next)
    a.m_force.SetZero(), (a.m_torque = 0);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "ClearForces",
  box2d.b2World.prototype.ClearForces
);
box2d.b2World.prototype.QueryAABB = function (a, b) {
  var c = this.m_contactManager.m_broadPhase;
  c.Query(function (b) {
    b = c.GetUserData(b);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
    b = b.fixture;
    return a instanceof box2d.b2QueryCallback ? a.ReportFixture(b) : a(b);
  }, b);
  if (a instanceof box2d.b2QueryCallback)
    for (var d = this.m_particleSystemList; d; d = d.m_next)
      a.ShouldQueryParticleSystem(d) && d.QueryAABB(a, b);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "QueryAABB",
  box2d.b2World.prototype.QueryAABB
);
box2d.b2World.prototype.QueryShape = function (a, b, c, d) {
  var e = this.m_contactManager.m_broadPhase,
    f = box2d.b2World.prototype.QueryShape.s_aabb;
  b.ComputeAABB(f, c, d || 0);
  e.Query(function (d) {
    d = e.GetUserData(d);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2FixtureProxy);
    d = d.fixture;
    return box2d.b2TestOverlap_Shape(
      b,
      0,
      d.GetShape(),
      0,
      c,
      d.GetBody().GetTransform()
    )
      ? a instanceof box2d.b2QueryCallback
        ? a.ReportFixture(d)
        : a(d)
      : !0;
  }, f);
  if (a instanceof box2d.b2QueryCallback)
    for (d = this.m_particleSystemList; d; d = d.m_next)
      a.ShouldQueryParticleSystem(d) && d.QueryAABB(a, f);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "QueryShape",
  box2d.b2World.prototype.QueryShape
);
box2d.b2World.prototype.QueryShape.s_aabb = new box2d.b2AABB();
box2d.b2World.prototype.QueryPoint = function (a, b, c) {
  var d = this.m_contactManager.m_broadPhase;
  c = "number" === typeof c ? c : box2d.b2_linearSlop;
  var e = box2d.b2World.prototype.QueryPoint.s_aabb;
  e.lowerBound.Set(b.x - c, b.y - c);
  e.upperBound.Set(b.x + c, b.y + c);
  d.Query(function (c) {
    c = d.GetUserData(c);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c instanceof box2d.b2FixtureProxy);
    c = c.fixture;
    return c.TestPoint(b)
      ? a instanceof box2d.b2QueryCallback
        ? a.ReportFixture(c)
        : a(c)
      : !0;
  }, e);
  if (a instanceof box2d.b2QueryCallback)
    for (c = this.m_particleSystemList; c; c = c.m_next)
      a.ShouldQueryParticleSystem(c) && c.QueryAABB(a, e);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "QueryPoint",
  box2d.b2World.prototype.QueryPoint
);
box2d.b2World.prototype.QueryPoint.s_aabb = new box2d.b2AABB();
box2d.b2World.prototype.RayCast = function (a, b, c) {
  var d = this.m_contactManager.m_broadPhase,
    e = box2d.b2World.prototype.RayCast.s_input;
  e.maxFraction = 1;
  e.p1.Copy(b);
  e.p2.Copy(c);
  d.RayCast(function (e, g) {
    var h = d.GetUserData(g);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(h instanceof box2d.b2FixtureProxy);
    var k = h.fixture,
      l = box2d.b2World.prototype.RayCast.s_output;
    if (k.RayCast(l, e, h.childIndex)) {
      var h = l.fraction,
        m = box2d.b2World.prototype.RayCast.s_point;
      m.Set((1 - h) * b.x + h * c.x, (1 - h) * b.y + h * c.y);
      return a instanceof box2d.b2RayCastCallback
        ? a.ReportFixture(k, m, l.normal, h)
        : a(k, m, l.normal, h);
    }
    return e.maxFraction;
  }, e);
  if (a instanceof box2d.b2RayCastCallback)
    for (e = this.m_particleSystemList; e; e = e.m_next)
      a.ShouldQueryParticleSystem(e) && e.RayCast(a, b, c);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "RayCast",
  box2d.b2World.prototype.RayCast
);
box2d.b2World.prototype.RayCast.s_input = new box2d.b2RayCastInput();
box2d.b2World.prototype.RayCast.s_output = new box2d.b2RayCastOutput();
box2d.b2World.prototype.RayCast.s_point = new box2d.b2Vec2();
box2d.b2World.prototype.RayCastOne = function (a, b) {
  var c = null,
    d = 1;
  this.RayCast(
    function (a, b, g, h) {
      h < d && ((d = h), (c = a));
      return d;
    },
    a,
    b
  );
  return c;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "RayCastOne",
  box2d.b2World.prototype.RayCastOne
);
box2d.b2World.prototype.RayCastAll = function (a, b, c) {
  c.length = 0;
  this.RayCast(
    function (a, b, f, g) {
      c.push(a);
      return 1;
    },
    a,
    b
  );
  return c;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "RayCastAll",
  box2d.b2World.prototype.RayCastAll
);
box2d.b2World.prototype.DrawShape = function (a, b) {
  var c = a.GetShape();
  switch (c.m_type) {
    case box2d.b2ShapeType.e_circleShape:
      c = c instanceof box2d.b2CircleShape ? c : null;
      this.m_debugDraw.DrawSolidCircle(
        c.m_p,
        c.m_radius,
        box2d.b2Vec2.UNITX,
        b
      );
      break;
    case box2d.b2ShapeType.e_edgeShape:
      var d = c instanceof box2d.b2EdgeShape ? c : null,
        c = d.m_vertex1,
        e = d.m_vertex2;
      this.m_debugDraw.DrawSegment(c, e, b);
      break;
    case box2d.b2ShapeType.e_chainShape:
      var c = c instanceof box2d.b2ChainShape ? c : null,
        d = c.m_count,
        f = c.m_vertices,
        c = f[0];
      this.m_debugDraw.DrawCircle(c, 0.05, b);
      for (var g = 1; g < d; ++g)
        (e = f[g]),
          this.m_debugDraw.DrawSegment(c, e, b),
          this.m_debugDraw.DrawCircle(e, 0.05, b),
          (c = e);
      break;
    case box2d.b2ShapeType.e_polygonShape:
      (d = c instanceof box2d.b2PolygonShape ? c : null),
        (c = d.m_count),
        (f = d.m_vertices),
        this.m_debugDraw.DrawSolidPolygon(f, c, b);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DrawShape",
  box2d.b2World.prototype.DrawShape
);
box2d.b2World.prototype.DrawJoint = function (a) {
  var b = a.GetBodyA(),
    c = a.GetBodyB(),
    d = b.m_xf.p,
    e = c.m_xf.p,
    c = a.GetAnchorA(box2d.b2World.prototype.DrawJoint.s_p1),
    b = a.GetAnchorB(box2d.b2World.prototype.DrawJoint.s_p2),
    f = box2d.b2World.prototype.DrawJoint.s_color.SetRGB(0.5, 0.8, 0.8);
  switch (a.m_type) {
    case box2d.b2JointType.e_distanceJoint:
      this.m_debugDraw.DrawSegment(c, b, f);
      break;
    case box2d.b2JointType.e_pulleyJoint:
      d = a instanceof box2d.b2PulleyJoint ? a : null;
      a = d.GetGroundAnchorA(box2d.b2World.prototype.DrawJoint.s_s1);
      d = d.GetGroundAnchorB(box2d.b2World.prototype.DrawJoint.s_s2);
      this.m_debugDraw.DrawSegment(a, c, f);
      this.m_debugDraw.DrawSegment(d, b, f);
      this.m_debugDraw.DrawSegment(a, d, f);
      break;
    case box2d.b2JointType.e_mouseJoint:
      this.m_debugDraw.DrawSegment(c, b, f);
      break;
    default:
      this.m_debugDraw.DrawSegment(d, c, f),
        this.m_debugDraw.DrawSegment(c, b, f),
        this.m_debugDraw.DrawSegment(e, b, f);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DrawJoint",
  box2d.b2World.prototype.DrawJoint
);
box2d.b2World.prototype.DrawJoint.s_p1 = new box2d.b2Vec2();
box2d.b2World.prototype.DrawJoint.s_p2 = new box2d.b2Vec2();
box2d.b2World.prototype.DrawJoint.s_color = new box2d.b2Color(0.5, 0.8, 0.8);
box2d.b2World.prototype.DrawJoint.s_s1 = new box2d.b2Vec2();
box2d.b2World.prototype.DrawJoint.s_s2 = new box2d.b2Vec2();
box2d.b2World.prototype.DrawParticleSystem = function (a) {
  var b = a.GetParticleCount();
  if (b) {
    var c = a.GetRadius(),
      d = a.GetPositionBuffer();
    a.m_colorBuffer.data
      ? ((a = a.GetColorBuffer()), this.m_debugDraw.DrawParticles(d, c, a, b))
      : this.m_debugDraw.DrawParticles(d, c, null, b);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DrawParticleSystem",
  box2d.b2World.prototype.DrawParticleSystem
);
box2d.b2World.prototype.DrawDebugData = function () {
  if (null !== this.m_debugDraw) {
    var a = this.m_debugDraw.GetFlags(),
      b = box2d.b2World.prototype.DrawDebugData.s_color.SetRGB(0, 0, 0);
    if (a & box2d.b2DrawFlags.e_shapeBit)
      for (var c = this.m_bodyList; c; c = c.m_next) {
        var d = c.m_xf;
        this.m_debugDraw.PushTransform(d);
        for (var e = c.GetFixtureList(); e; e = e.m_next)
          c.IsActive()
            ? c.GetType() === box2d.b2BodyType.b2_staticBody
              ? b.SetRGB(0.5, 0.9, 0.5)
              : c.GetType() === box2d.b2BodyType.b2_kinematicBody
              ? b.SetRGB(0.5, 0.5, 0.9)
              : c.IsAwake()
              ? b.SetRGB(0.9, 0.7, 0.7)
              : b.SetRGB(0.6, 0.6, 0.6)
            : b.SetRGB(0.5, 0.5, 0.3),
            this.DrawShape(e, b);
        this.m_debugDraw.PopTransform(d);
      }
    if (a & box2d.b2DrawFlags.e_particleBit)
      for (c = this.m_particleSystemList; c; c = c.m_next)
        this.DrawParticleSystem(c);
    if (a & box2d.b2DrawFlags.e_jointBit)
      for (c = this.m_jointList; c; c = c.m_next) this.DrawJoint(c);
    if (a & box2d.b2DrawFlags.e_aabbBit) {
      b.SetRGB(0.9, 0.3, 0.9);
      for (
        var d = this.m_contactManager.m_broadPhase,
          f = box2d.b2World.prototype.DrawDebugData.s_vs,
          c = this.m_bodyList;
        c;
        c = c.m_next
      )
        if (c.IsActive())
          for (e = c.GetFixtureList(); e; e = e.m_next)
            for (var g = 0; g < e.m_proxyCount; ++g) {
              var h = d.GetFatAABB(e.m_proxies[g].proxy);
              f[0].Set(h.lowerBound.x, h.lowerBound.y);
              f[1].Set(h.upperBound.x, h.lowerBound.y);
              f[2].Set(h.upperBound.x, h.upperBound.y);
              f[3].Set(h.lowerBound.x, h.upperBound.y);
              this.m_debugDraw.DrawPolygon(f, 4, b);
            }
    }
    if (a & box2d.b2DrawFlags.e_centerOfMassBit)
      for (c = this.m_bodyList; c; c = c.m_next)
        (d = box2d.b2World.prototype.DrawDebugData.s_xf),
          d.q.Copy(c.m_xf.q),
          d.p.Copy(c.GetWorldCenter()),
          this.m_debugDraw.DrawTransform(d);
    if (a & box2d.b2DrawFlags.e_controllerBit)
      for (a = this.m_controllerList; a; a = a.m_next) a.Draw(this.m_debugDraw);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "DrawDebugData",
  box2d.b2World.prototype.DrawDebugData
);
box2d.b2World.prototype.DrawDebugData.s_color = new box2d.b2Color(0, 0, 0);
box2d.b2World.prototype.DrawDebugData.s_vs = box2d.b2Vec2.MakeArray(4);
box2d.b2World.prototype.DrawDebugData.s_xf = new box2d.b2Transform();
box2d.b2World.prototype.SetBroadPhase = function (a) {
  var b = this.m_contactManager.m_broadPhase;
  this.m_contactManager.m_broadPhase = a;
  for (var c = this.m_bodyList; c; c = c.m_next)
    for (var d = c.m_fixtureList; d; d = d.m_next)
      d.m_proxy = a.CreateProxy(b.GetFatAABB(d.m_proxy), d);
};
goog.exportProperty(
  box2d.b2World.prototype,
  "SetBroadPhase",
  box2d.b2World.prototype.SetBroadPhase
);
box2d.b2World.prototype.CalculateReasonableParticleIterations = function (a) {
  return null === this.m_particleSystemList
    ? 1
    : box2d.b2CalculateParticleIterations(
        this.m_gravity.Length(),
        (function (a) {
          var c = box2d.b2_maxFloat;
          for (a = a.GetParticleSystemList(); null !== a; a = a.m_next)
            c = box2d.b2Min(c, a.GetRadius());
          return c;
        })(this),
        a
      );
};
goog.exportProperty(
  box2d.b2World.prototype,
  "CalculateReasonableParticleIterations",
  box2d.b2World.prototype.CalculateReasonableParticleIterations
);
box2d.b2World.prototype.GetProxyCount = function () {
  return this.m_contactManager.m_broadPhase.GetProxyCount();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetProxyCount",
  box2d.b2World.prototype.GetProxyCount
);
box2d.b2World.prototype.GetTreeHeight = function () {
  return this.m_contactManager.m_broadPhase.GetTreeHeight();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetTreeHeight",
  box2d.b2World.prototype.GetTreeHeight
);
box2d.b2World.prototype.GetTreeBalance = function () {
  return this.m_contactManager.m_broadPhase.GetTreeBalance();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetTreeBalance",
  box2d.b2World.prototype.GetTreeBalance
);
box2d.b2World.prototype.GetTreeQuality = function () {
  return this.m_contactManager.m_broadPhase.GetTreeQuality();
};
goog.exportProperty(
  box2d.b2World.prototype,
  "GetTreeQuality",
  box2d.b2World.prototype.GetTreeQuality
);
box2d.b2World.prototype.ShiftOrigin = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!this.IsLocked());
  if (!this.IsLocked()) {
    for (var b = this.m_bodyList; b; b = b.m_next)
      b.m_xf.p.SelfSub(a), b.m_sweep.c0.SelfSub(a), b.m_sweep.c.SelfSub(a);
    for (b = this.m_jointList; b; b = b.m_next) b.ShiftOrigin(a);
    this.m_contactManager.m_broadPhase.ShiftOrigin(a);
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "ShiftOrigin",
  box2d.b2World.prototype.ShiftOrigin
);
box2d.b2World.prototype.Dump = function () {
  if (box2d.DEBUG && !this.m_flag_locked) {
    box2d.b2Log(
      "/** @type {box2d.b2Vec2} */ var g = new box2d.b2Vec2(%.15f, %.15f);\n",
      this.m_gravity.x,
      this.m_gravity.y
    );
    box2d.b2Log("this.m_world.SetGravity(g);\n");
    box2d.b2Log(
      "/** @type {Array.<box2d.b2Body>} */ var bodies = new Array(%d);\n",
      this.m_bodyCount
    );
    box2d.b2Log(
      "/** @type {Array.<box2d.b2Joint>} */ var joints = new Array(%d);\n",
      this.m_jointCount
    );
    for (var a = 0, b = this.m_bodyList; b; b = b.m_next)
      (b.m_islandIndex = a), b.Dump(), ++a;
    a = 0;
    for (b = this.m_jointList; b; b = b.m_next) (b.m_index = a), ++a;
    for (b = this.m_jointList; b; b = b.m_next)
      b.m_type !== box2d.b2JointType.e_gearJoint &&
        (box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"));
    for (b = this.m_jointList; b; b = b.m_next)
      b.m_type === box2d.b2JointType.e_gearJoint &&
        (box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"));
  }
};
goog.exportProperty(
  box2d.b2World.prototype,
  "Dump",
  box2d.b2World.prototype.Dump
);
box2d.b2World.prototype.AddController = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(
      null === a.m_world,
      "Controller can only be a member of one world"
    );
  a.m_world = this;
  a.m_next = this.m_controllerList;
  a.m_prev = null;
  this.m_controllerList && (this.m_controllerList.m_prev = a);
  this.m_controllerList = a;
  ++this.m_controllerCount;
  return a;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "AddController",
  box2d.b2World.prototype.AddController
);
box2d.b2World.prototype.RemoveController = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(
      a.m_world === this,
      "Controller is not a member of this world"
    );
  a.m_prev && (a.m_prev.m_next = a.m_next);
  a.m_next && (a.m_next.m_prev = a.m_prev);
  this.m_controllerList === a && (this.m_controllerList = a.m_next);
  --this.m_controllerCount;
  a.m_prev = null;
  a.m_next = null;
  a.m_world = null;
};
goog.exportProperty(
  box2d.b2World.prototype,
  "RemoveController",
  box2d.b2World.prototype.RemoveController
);
box2d.b2MotorJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_motorJoint);
  this.linearOffset = new box2d.b2Vec2(0, 0);
};
goog.inherits(box2d.b2MotorJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MotorJointDef", box2d.b2MotorJointDef);
box2d.b2MotorJointDef.prototype.linearOffset = null;
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "linearOffset",
  box2d.b2MotorJointDef.prototype.linearOffset
);
box2d.b2MotorJointDef.prototype.angularOffset = 0;
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "angularOffset",
  box2d.b2MotorJointDef.prototype.angularOffset
);
box2d.b2MotorJointDef.prototype.maxForce = 1;
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "maxForce",
  box2d.b2MotorJointDef.prototype.maxForce
);
box2d.b2MotorJointDef.prototype.maxTorque = 1;
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "maxTorque",
  box2d.b2MotorJointDef.prototype.maxTorque
);
box2d.b2MotorJointDef.prototype.correctionFactor = 0.3;
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "correctionFactor",
  box2d.b2MotorJointDef.prototype.correctionFactor
);
box2d.b2MotorJointDef.prototype.Initialize = function (a, b) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
  var c = this.bodyA.GetAngle();
  this.angularOffset = this.bodyB.GetAngle() - c;
};
goog.exportProperty(
  box2d.b2MotorJointDef.prototype,
  "Initialize",
  box2d.b2MotorJointDef.prototype.Initialize
);
box2d.b2MotorJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_linearOffset = a.linearOffset.Clone();
  this.m_linearImpulse = new box2d.b2Vec2(0, 0);
  this.m_maxForce = a.maxForce;
  this.m_maxTorque = a.maxTorque;
  this.m_correctionFactor = a.correctionFactor;
  this.m_rA = new box2d.b2Vec2(0, 0);
  this.m_rB = new box2d.b2Vec2(0, 0);
  this.m_localCenterA = new box2d.b2Vec2(0, 0);
  this.m_localCenterB = new box2d.b2Vec2(0, 0);
  this.m_linearError = new box2d.b2Vec2(0, 0);
  this.m_linearMass = new box2d.b2Mat22();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_K = new box2d.b2Mat22();
};
goog.inherits(box2d.b2MotorJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MotorJoint", box2d.b2MotorJoint);
box2d.b2MotorJoint.prototype.m_linearOffset = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_linearOffset",
  box2d.b2MotorJoint.prototype.m_linearOffset
);
box2d.b2MotorJoint.prototype.m_angularOffset = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_angularOffset",
  box2d.b2MotorJoint.prototype.m_angularOffset
);
box2d.b2MotorJoint.prototype.m_linearImpulse = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_linearImpulse",
  box2d.b2MotorJoint.prototype.m_linearImpulse
);
box2d.b2MotorJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_angularImpulse",
  box2d.b2MotorJoint.prototype.m_angularImpulse
);
box2d.b2MotorJoint.prototype.m_maxForce = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_maxForce",
  box2d.b2MotorJoint.prototype.m_maxForce
);
box2d.b2MotorJoint.prototype.m_maxTorque = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_maxTorque",
  box2d.b2MotorJoint.prototype.m_maxTorque
);
box2d.b2MotorJoint.prototype.m_correctionFactor = 0.3;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_correctionFactor",
  box2d.b2MotorJoint.prototype.m_correctionFactor
);
box2d.b2MotorJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_indexA",
  box2d.b2MotorJoint.prototype.m_indexA
);
box2d.b2MotorJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_indexB",
  box2d.b2MotorJoint.prototype.m_indexB
);
box2d.b2MotorJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_rA",
  box2d.b2MotorJoint.prototype.m_rA
);
box2d.b2MotorJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_rB",
  box2d.b2MotorJoint.prototype.m_rB
);
box2d.b2MotorJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_localCenterA",
  box2d.b2MotorJoint.prototype.m_localCenterA
);
box2d.b2MotorJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_localCenterB",
  box2d.b2MotorJoint.prototype.m_localCenterB
);
box2d.b2MotorJoint.prototype.m_linearError = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_linearError",
  box2d.b2MotorJoint.prototype.m_linearError
);
box2d.b2MotorJoint.prototype.m_angularError = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_angularError",
  box2d.b2MotorJoint.prototype.m_angularError
);
box2d.b2MotorJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_invMassA",
  box2d.b2MotorJoint.prototype.m_invMassA
);
box2d.b2MotorJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_invMassB",
  box2d.b2MotorJoint.prototype.m_invMassB
);
box2d.b2MotorJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_invIA",
  box2d.b2MotorJoint.prototype.m_invIA
);
box2d.b2MotorJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_invIB",
  box2d.b2MotorJoint.prototype.m_invIB
);
box2d.b2MotorJoint.prototype.m_linearMass = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_linearMass",
  box2d.b2MotorJoint.prototype.m_linearMass
);
box2d.b2MotorJoint.prototype.m_angularMass = 0;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_angularMass",
  box2d.b2MotorJoint.prototype.m_angularMass
);
box2d.b2MotorJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_qA",
  box2d.b2MotorJoint.prototype.m_qA
);
box2d.b2MotorJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_qB",
  box2d.b2MotorJoint.prototype.m_qB
);
box2d.b2MotorJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "m_K",
  box2d.b2MotorJoint.prototype.m_K
);
box2d.b2MotorJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetPosition(a);
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetAnchorA",
  box2d.b2MotorJoint.prototype.GetAnchorA
);
box2d.b2MotorJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetPosition(a);
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetAnchorB",
  box2d.b2MotorJoint.prototype.GetAnchorB
);
box2d.b2MotorJoint.prototype.GetReactionForce = function (a, b) {
  return box2d.b2Mul_S_V2(a, this.m_linearImpulse, b);
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetReactionForce",
  box2d.b2MotorJoint.prototype.GetReactionForce
);
box2d.b2MotorJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_angularImpulse;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetReactionTorque",
  box2d.b2MotorJoint.prototype.GetReactionTorque
);
box2d.b2MotorJoint.prototype.SetCorrectionFactor = function (a) {
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a && 1 >= a);
  this._correctionFactor = a;
};
box2d.b2MotorJoint.prototype.GetCorrectionFactor = function () {
  return this.m_correctionFactor;
};
box2d.b2MotorJoint.prototype.SetLinearOffset = function (a) {
  if (a.x != this.m_linearOffset.x || a.y != this.m_linearOffset.y)
    this.m_bodyA.SetAwake(!0),
      this.m_bodyB.SetAwake(!0),
      this.m_linearOffset.Copy(a);
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SetLinearOffset",
  box2d.b2MotorJoint.prototype.SetLinearOffset
);
box2d.b2MotorJoint.prototype.GetLinearOffset = function (a) {
  return a.Copy(this.m_linearOffset);
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetLinearOffset",
  box2d.b2MotorJoint.prototype.GetLinearOffset
);
box2d.b2MotorJoint.prototype.SetAngularOffset = function (a) {
  a !== this.m_angularOffset &&
    (this.m_bodyA.SetAwake(!0),
    this.m_bodyB.SetAwake(!0),
    (this.m_angularOffset = a));
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SetAngularOffset",
  box2d.b2MotorJoint.prototype.SetAngularOffset
);
box2d.b2MotorJoint.prototype.GetAngularOffset = function () {
  return this.m_angularOffset;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetAngularOffset",
  box2d.b2MotorJoint.prototype.GetAngularOffset
);
box2d.b2MotorJoint.prototype.SetMaxForce = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
  this.m_maxForce = a;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SetMaxForce",
  box2d.b2MotorJoint.prototype.SetMaxForce
);
box2d.b2MotorJoint.prototype.GetMaxForce = function () {
  return this.m_maxForce;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetMaxForce",
  box2d.b2MotorJoint.prototype.GetMaxForce
);
box2d.b2MotorJoint.prototype.SetMaxTorque = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
  this.m_maxTorque = a;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SetMaxTorque",
  box2d.b2MotorJoint.prototype.SetMaxTorque
);
box2d.b2MotorJoint.prototype.GetMaxTorque = function () {
  return this.m_maxTorque;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "GetMaxTorque",
  box2d.b2MotorJoint.prototype.GetMaxTorque
);
box2d.b2MotorJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.velocities[this.m_indexA].v,
    e = a.velocities[this.m_indexA].w,
    f = a.positions[this.m_indexB].c,
    g = a.positions[this.m_indexB].a,
    h = a.velocities[this.m_indexB].v,
    k = a.velocities[this.m_indexB].w,
    l = this.m_qA.SetAngle(c),
    m = this.m_qB.SetAngle(g),
    n = box2d.b2Mul_R_V2(
      l,
      box2d.b2Vec2.s_t0.Copy(this.m_localCenterA).SelfNeg(),
      this.m_rA
    ),
    m = box2d.b2Mul_R_V2(
      m,
      box2d.b2Vec2.s_t0.Copy(this.m_localCenterB).SelfNeg(),
      this.m_rB
    ),
    p = this.m_invMassA,
    q = this.m_invMassB,
    r = this.m_invIA,
    u = this.m_invIB,
    t = this.m_K;
  t.ex.x = p + q + r * n.y * n.y + u * m.y * m.y;
  t.ex.y = -r * n.x * n.y - u * m.x * m.y;
  t.ey.x = t.ex.y;
  t.ey.y = p + q + r * n.x * n.x + u * m.x * m.x;
  t.GetInverse(this.m_linearMass);
  this.m_angularMass = r + u;
  0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
  box2d.b2Sub_V2_V2(
    box2d.b2Sub_V2_V2(
      box2d.b2Add_V2_V2(f, m, box2d.b2Vec2.s_t0),
      box2d.b2Add_V2_V2(b, n, box2d.b2Vec2.s_t1),
      box2d.b2Vec2.s_t2
    ),
    box2d.b2Mul_R_V2(l, this.m_linearOffset, box2d.b2Vec2.s_t3),
    this.m_linearError
  );
  this.m_angularError = g - c - this.m_angularOffset;
  a.step.warmStarting
    ? (this.m_linearImpulse.SelfMul(a.step.dtRatio),
      (this.m_angularImpulse *= a.step.dtRatio),
      (b = this.m_linearImpulse),
      d.SelfMulSub(p, b),
      (e -= r * (box2d.b2Cross_V2_V2(n, b) + this.m_angularImpulse)),
      h.SelfMulAdd(q, b),
      (k += u * (box2d.b2Cross_V2_V2(m, b) + this.m_angularImpulse)))
    : (this.m_linearImpulse.SetZero(), (this.m_angularImpulse = 0));
  a.velocities[this.m_indexA].w = e;
  a.velocities[this.m_indexB].w = k;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2MotorJoint.prototype.InitVelocityConstraints
);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    k = this.m_invIB,
    l = a.step.dt,
    m = a.step.inv_dt,
    n = e - c + m * this.m_correctionFactor * this.m_angularError,
    n = -this.m_angularMass * n,
    p = this.m_angularImpulse,
    q = l * this.m_maxTorque;
  this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + n, -q, q);
  var n = this.m_angularImpulse - p,
    c = c - h * n,
    e = e + k * n,
    r = this.m_rA,
    u = this.m_rB,
    n = box2d.b2Add_V2_V2(
      box2d.b2Sub_V2_V2(
        box2d.b2Add_V2_V2(
          d,
          box2d.b2Cross_S_V2(e, u, box2d.b2Vec2.s_t0),
          box2d.b2Vec2.s_t0
        ),
        box2d.b2Add_V2_V2(
          b,
          box2d.b2Cross_S_V2(c, r, box2d.b2Vec2.s_t1),
          box2d.b2Vec2.s_t1
        ),
        box2d.b2Vec2.s_t2
      ),
      box2d.b2Mul_S_V2(
        m * this.m_correctionFactor,
        this.m_linearError,
        box2d.b2Vec2.s_t3
      ),
      box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot
    ),
    n = box2d
      .b2Mul_M22_V2(
        this.m_linearMass,
        n,
        box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse
      )
      .SelfNeg(),
    p = box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(
      this.m_linearImpulse
    );
  this.m_linearImpulse.SelfAdd(n);
  q = l * this.m_maxForce;
  this.m_linearImpulse.LengthSquared() > q * q &&
    (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(q));
  box2d.b2Sub_V2_V2(this.m_linearImpulse, p, n);
  b.SelfMulSub(f, n);
  c -= h * box2d.b2Cross_V2_V2(r, n);
  d.SelfMulAdd(g, n);
  e += k * box2d.b2Cross_V2_V2(u, n);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2MotorJoint.prototype.SolveVelocityConstraints
);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2();
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2();
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2();
box2d.b2MotorJoint.prototype.SolvePositionConstraints = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2MotorJoint.prototype.SolvePositionConstraints
);
box2d.b2MotorJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2MotorJointDef*/ var jd = new box2d.b2MotorJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.linearOffset.Set(%.15f, %.15f);\n",
      this.m_linearOffset.x,
      this.m_linearOffset.y
    );
    box2d.b2Log("  jd.angularOffset = %.15f;\n", this.m_angularOffset);
    box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
    box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
    box2d.b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2MotorJoint.prototype,
  "Dump",
  box2d.b2MotorJoint.prototype.Dump
);
box2d.b2MouseJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_mouseJoint);
  this.target = new box2d.b2Vec2();
};
goog.inherits(box2d.b2MouseJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MouseJointDef", box2d.b2MouseJointDef);
box2d.b2MouseJointDef.prototype.target = null;
goog.exportProperty(
  box2d.b2MouseJointDef.prototype,
  "target",
  box2d.b2MouseJointDef.prototype.target
);
box2d.b2MouseJointDef.prototype.maxForce = 0;
goog.exportProperty(
  box2d.b2MouseJointDef.prototype,
  "maxForce",
  box2d.b2MouseJointDef.prototype.maxForce
);
box2d.b2MouseJointDef.prototype.frequencyHz = 5;
goog.exportProperty(
  box2d.b2MouseJointDef.prototype,
  "frequencyHz",
  box2d.b2MouseJointDef.prototype.frequencyHz
);
box2d.b2MouseJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(
  box2d.b2MouseJointDef.prototype,
  "dampingRatio",
  box2d.b2MouseJointDef.prototype.dampingRatio
);
box2d.b2MouseJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorB = new box2d.b2Vec2();
  this.m_targetA = new box2d.b2Vec2();
  this.m_impulse = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_mass = new box2d.b2Mat22();
  this.m_C = new box2d.b2Vec2();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_K = new box2d.b2Mat22();
  box2d.ENABLE_ASSERTS && box2d.b2Assert(a.target.IsValid());
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.maxForce) && 0 <= a.maxForce);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.frequencyHz) && 0 <= a.frequencyHz);
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(box2d.b2IsValid(a.dampingRatio) && 0 <= a.dampingRatio);
  this.m_targetA.Copy(a.target);
  box2d.b2MulT_X_V2(
    this.m_bodyB.GetTransform(),
    this.m_targetA,
    this.m_localAnchorB
  );
  this.m_maxForce = a.maxForce;
  this.m_impulse.SetZero();
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_gamma = this.m_beta = 0;
};
goog.inherits(box2d.b2MouseJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MouseJoint", box2d.b2MouseJoint);
box2d.b2MouseJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_localAnchorB",
  box2d.b2MouseJoint.prototype.m_localAnchorB
);
box2d.b2MouseJoint.prototype.m_targetA = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_targetA",
  box2d.b2MouseJoint.prototype.m_targetA
);
box2d.b2MouseJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_frequencyHz",
  box2d.b2MouseJoint.prototype.m_frequencyHz
);
box2d.b2MouseJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_dampingRatio",
  box2d.b2MouseJoint.prototype.m_dampingRatio
);
box2d.b2MouseJoint.prototype.m_beta = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_beta",
  box2d.b2MouseJoint.prototype.m_beta
);
box2d.b2MouseJoint.prototype.m_impulse = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_impulse",
  box2d.b2MouseJoint.prototype.m_impulse
);
box2d.b2MouseJoint.prototype.m_maxForce = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_maxForce",
  box2d.b2MouseJoint.prototype.m_maxForce
);
box2d.b2MouseJoint.prototype.m_gamma = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_gamma",
  box2d.b2MouseJoint.prototype.m_gamma
);
box2d.b2MouseJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_indexA",
  box2d.b2MouseJoint.prototype.m_indexA
);
box2d.b2MouseJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_indexB",
  box2d.b2MouseJoint.prototype.m_indexB
);
box2d.b2MouseJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_rB",
  box2d.b2MouseJoint.prototype.m_rB
);
box2d.b2MouseJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_localCenterB",
  box2d.b2MouseJoint.prototype.m_localCenterB
);
box2d.b2MouseJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_invMassB",
  box2d.b2MouseJoint.prototype.m_invMassB
);
box2d.b2MouseJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_invIB",
  box2d.b2MouseJoint.prototype.m_invIB
);
box2d.b2MouseJoint.prototype.m_mass = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_mass",
  box2d.b2MouseJoint.prototype.m_mass
);
box2d.b2MouseJoint.prototype.m_C = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_C",
  box2d.b2MouseJoint.prototype.m_C
);
box2d.b2MouseJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_qB",
  box2d.b2MouseJoint.prototype.m_qB
);
box2d.b2MouseJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_lalcB",
  box2d.b2MouseJoint.prototype.m_lalcB
);
box2d.b2MouseJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "m_K",
  box2d.b2MouseJoint.prototype.m_K
);
box2d.b2MouseJoint.prototype.SetTarget = function (a) {
  this.m_bodyB.IsAwake() || this.m_bodyB.SetAwake(!0);
  this.m_targetA.Copy(a);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SetTarget",
  box2d.b2MouseJoint.prototype.SetTarget
);
box2d.b2MouseJoint.prototype.GetTarget = function (a) {
  return a.Copy(this.m_targetA);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetTarget",
  box2d.b2MouseJoint.prototype.GetTarget
);
box2d.b2MouseJoint.prototype.SetMaxForce = function (a) {
  this.m_maxForce = a;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SetMaxForce",
  box2d.b2MouseJoint.prototype.SetMaxForce
);
box2d.b2MouseJoint.prototype.GetMaxForce = function () {
  return this.m_maxForce;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetMaxForce",
  box2d.b2MouseJoint.prototype.GetMaxForce
);
box2d.b2MouseJoint.prototype.SetFrequency = function (a) {
  this.m_frequencyHz = a;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SetFrequency",
  box2d.b2MouseJoint.prototype.SetFrequency
);
box2d.b2MouseJoint.prototype.GetFrequency = function () {
  return this.m_frequencyHz;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetFrequency",
  box2d.b2MouseJoint.prototype.GetFrequency
);
box2d.b2MouseJoint.prototype.SetDampingRatio = function (a) {
  this.m_dampingRatio = a;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SetDampingRatio",
  box2d.b2MouseJoint.prototype.SetDampingRatio
);
box2d.b2MouseJoint.prototype.GetDampingRatio = function () {
  return this.m_dampingRatio;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetDampingRatio",
  box2d.b2MouseJoint.prototype.GetDampingRatio
);
box2d.b2MouseJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexB].c,
    c = a.velocities[this.m_indexB].v,
    d = a.velocities[this.m_indexB].w,
    e = this.m_qB.SetAngle(a.positions[this.m_indexB].a),
    f = this.m_bodyB.GetMass(),
    g = 2 * box2d.b2_pi * this.m_frequencyHz,
    h = 2 * f * this.m_dampingRatio * g,
    f = f * g * g,
    g = a.step.dt;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(h + g * f > box2d.b2_epsilon);
  this.m_gamma = g * (h + g * f);
  0 !== this.m_gamma && (this.m_gamma = 1 / this.m_gamma);
  this.m_beta = g * f * this.m_gamma;
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(e, this.m_lalcB, this.m_rB);
  e = this.m_K;
  e.ex.x =
    this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
  e.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
  e.ey.x = e.ex.y;
  e.ey.y =
    this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
  e.GetInverse(this.m_mass);
  this.m_C.x = b.x + this.m_rB.x - this.m_targetA.x;
  this.m_C.y = b.y + this.m_rB.y - this.m_targetA.y;
  this.m_C.SelfMul(this.m_beta);
  d *= 0.98;
  a.step.warmStarting
    ? (this.m_impulse.SelfMul(a.step.dtRatio),
      (c.x += this.m_invMassB * this.m_impulse.x),
      (c.y += this.m_invMassB * this.m_impulse.y),
      (d += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, this.m_impulse)))
    : this.m_impulse.SetZero();
  a.velocities[this.m_indexB].w = d;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2MouseJoint.prototype.InitVelocityConstraints
);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexB].v,
    c = a.velocities[this.m_indexB].w,
    d = box2d.b2AddCross_V2_S_V2(
      b,
      c,
      this.m_rB,
      box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot
    ),
    d = box2d.b2Mul_M22_V2(
      this.m_mass,
      box2d
        .b2Add_V2_V2(
          d,
          box2d.b2Add_V2_V2(
            this.m_C,
            box2d.b2Mul_S_V2(this.m_gamma, this.m_impulse, box2d.b2Vec2.s_t0),
            box2d.b2Vec2.s_t0
          ),
          box2d.b2Vec2.s_t0
        )
        .SelfNeg(),
      box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse
    ),
    e = box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(
      this.m_impulse
    );
  this.m_impulse.SelfAdd(d);
  var f = a.step.dt * this.m_maxForce;
  this.m_impulse.LengthSquared() > f * f &&
    this.m_impulse.SelfMul(f / this.m_impulse.Length());
  box2d.b2Sub_V2_V2(this.m_impulse, e, d);
  b.SelfMulAdd(this.m_invMassB, d);
  c += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, d);
  a.velocities[this.m_indexB].w = c;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2MouseJoint.prototype.SolveVelocityConstraints
);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2();
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2();
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2();
box2d.b2MouseJoint.prototype.SolvePositionConstraints = function (a) {
  return !0;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2MouseJoint.prototype.SolvePositionConstraints
);
box2d.b2MouseJoint.prototype.GetAnchorA = function (a) {
  return a.Copy(this.m_targetA);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetAnchorA",
  box2d.b2MouseJoint.prototype.GetAnchorA
);
box2d.b2MouseJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetAnchorB",
  box2d.b2MouseJoint.prototype.GetAnchorB
);
box2d.b2MouseJoint.prototype.GetReactionForce = function (a, b) {
  return box2d.b2Mul_S_V2(a, this.m_impulse, b);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetReactionForce",
  box2d.b2MouseJoint.prototype.GetReactionForce
);
box2d.b2MouseJoint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "GetReactionTorque",
  box2d.b2MouseJoint.prototype.GetReactionTorque
);
box2d.b2MouseJoint.prototype.Dump = function () {
  box2d.DEBUG && box2d.b2Log("Mouse joint dumping is not supported.\n");
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "Dump",
  box2d.b2MouseJoint.prototype.Dump
);
box2d.b2MouseJoint.prototype.ShiftOrigin = function (a) {
  this.m_targetA.SelfSub(a);
};
goog.exportProperty(
  box2d.b2MouseJoint.prototype,
  "ShiftOrigin",
  box2d.b2MouseJoint.prototype.ShiftOrigin
);
box2d.b2PrismaticJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_prismaticJoint);
  this.localAnchorA = new box2d.b2Vec2();
  this.localAnchorB = new box2d.b2Vec2();
  this.localAxisA = new box2d.b2Vec2(1, 0);
};
goog.inherits(box2d.b2PrismaticJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PrismaticJointDef", box2d.b2PrismaticJointDef);
box2d.b2PrismaticJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "localAnchorA",
  box2d.b2PrismaticJointDef.prototype.localAnchorA
);
box2d.b2PrismaticJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "localAnchorB",
  box2d.b2PrismaticJointDef.prototype.localAnchorB
);
box2d.b2PrismaticJointDef.prototype.localAxisA = null;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "localAxisA",
  box2d.b2PrismaticJointDef.prototype.localAxisA
);
box2d.b2PrismaticJointDef.prototype.referenceAngle = 0;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "referenceAngle",
  box2d.b2PrismaticJointDef.prototype.referenceAngle
);
box2d.b2PrismaticJointDef.prototype.enableLimit = !1;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "enableLimit",
  box2d.b2PrismaticJointDef.prototype.enableLimit
);
box2d.b2PrismaticJointDef.prototype.lowerTranslation = 0;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "lowerTranslation",
  box2d.b2PrismaticJointDef.prototype.lowerTranslation
);
box2d.b2PrismaticJointDef.prototype.upperTranslation = 0;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "upperTranslation",
  box2d.b2PrismaticJointDef.prototype.upperTranslation
);
box2d.b2PrismaticJointDef.prototype.enableMotor = !1;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "enableMotor",
  box2d.b2PrismaticJointDef.prototype.enableMotor
);
box2d.b2PrismaticJointDef.prototype.maxMotorForce = 0;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "maxMotorForce",
  box2d.b2PrismaticJointDef.prototype.maxMotorForce
);
box2d.b2PrismaticJointDef.prototype.motorSpeed = 0;
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "motorSpeed",
  box2d.b2PrismaticJointDef.prototype.motorSpeed
);
box2d.b2PrismaticJointDef.prototype.Initialize = function (a, b, c, d) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.bodyA.GetLocalVector(d, this.localAxisA);
  this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
goog.exportProperty(
  box2d.b2PrismaticJointDef.prototype,
  "Initialize",
  box2d.b2PrismaticJointDef.prototype.Initialize
);
box2d.b2PrismaticJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_localXAxisA = a.localAxisA.Clone().SelfNormalize();
  this.m_localYAxisA = box2d.b2Cross_S_V2(
    1,
    this.m_localXAxisA,
    new box2d.b2Vec2()
  );
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse = new box2d.b2Vec3(0, 0, 0);
  this.m_lowerTranslation = a.lowerTranslation;
  this.m_upperTranslation = a.upperTranslation;
  this.m_maxMotorForce = a.maxMotorForce;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableLimit = a.enableLimit;
  this.m_enableMotor = a.enableMotor;
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_axis = new box2d.b2Vec2(0, 0);
  this.m_perp = new box2d.b2Vec2(0, 0);
  this.m_K = new box2d.b2Mat33();
  this.m_K3 = new box2d.b2Mat33();
  this.m_K2 = new box2d.b2Mat22();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
};
goog.inherits(box2d.b2PrismaticJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PrismaticJoint", box2d.b2PrismaticJoint);
box2d.b2PrismaticJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localAnchorA",
  box2d.b2PrismaticJoint.prototype.m_localAnchorA
);
box2d.b2PrismaticJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localAnchorB",
  box2d.b2PrismaticJoint.prototype.m_localAnchorB
);
box2d.b2PrismaticJoint.prototype.m_localXAxisA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localXAxisA",
  box2d.b2PrismaticJoint.prototype.m_localXAxisA
);
box2d.b2PrismaticJoint.prototype.m_localYAxisA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localYAxisA",
  box2d.b2PrismaticJoint.prototype.m_localYAxisA
);
box2d.b2PrismaticJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_referenceAngle",
  box2d.b2PrismaticJoint.prototype.m_referenceAngle
);
box2d.b2PrismaticJoint.prototype.m_impulse = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_impulse",
  box2d.b2PrismaticJoint.prototype.m_impulse
);
box2d.b2PrismaticJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_motorImpulse",
  box2d.b2PrismaticJoint.prototype.m_motorImpulse
);
box2d.b2PrismaticJoint.prototype.m_lowerTranslation = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_lowerTranslation",
  box2d.b2PrismaticJoint.prototype.m_lowerTranslation
);
box2d.b2PrismaticJoint.prototype.m_upperTranslation = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_upperTranslation",
  box2d.b2PrismaticJoint.prototype.m_upperTranslation
);
box2d.b2PrismaticJoint.prototype.m_maxMotorForce = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_maxMotorForce",
  box2d.b2PrismaticJoint.prototype.m_maxMotorForce
);
box2d.b2PrismaticJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_motorSpeed",
  box2d.b2PrismaticJoint.prototype.m_motorSpeed
);
box2d.b2PrismaticJoint.prototype.m_enableLimit = !1;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_enableLimit",
  box2d.b2PrismaticJoint.prototype.m_enableLimit
);
box2d.b2PrismaticJoint.prototype.m_enableMotor = !1;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_enableMotor",
  box2d.b2PrismaticJoint.prototype.m_enableMotor
);
box2d.b2PrismaticJoint.prototype.m_limitState =
  box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_limitState",
  box2d.b2PrismaticJoint.prototype.m_limitState
);
box2d.b2PrismaticJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_indexA",
  box2d.b2PrismaticJoint.prototype.m_indexA
);
box2d.b2PrismaticJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_indexB",
  box2d.b2PrismaticJoint.prototype.m_indexB
);
box2d.b2PrismaticJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localCenterA",
  box2d.b2PrismaticJoint.prototype.m_localCenterA
);
box2d.b2PrismaticJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_localCenterB",
  box2d.b2PrismaticJoint.prototype.m_localCenterB
);
box2d.b2PrismaticJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_invMassA",
  box2d.b2PrismaticJoint.prototype.m_invMassA
);
box2d.b2PrismaticJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_invMassB",
  box2d.b2PrismaticJoint.prototype.m_invMassB
);
box2d.b2PrismaticJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_invIA",
  box2d.b2PrismaticJoint.prototype.m_invIA
);
box2d.b2PrismaticJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_invIB",
  box2d.b2PrismaticJoint.prototype.m_invIB
);
box2d.b2PrismaticJoint.prototype.m_axis = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_axis",
  box2d.b2PrismaticJoint.prototype.m_axis
);
box2d.b2PrismaticJoint.prototype.m_perp = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_perp",
  box2d.b2PrismaticJoint.prototype.m_perp
);
box2d.b2PrismaticJoint.prototype.m_s1 = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_s1",
  box2d.b2PrismaticJoint.prototype.m_s1
);
box2d.b2PrismaticJoint.prototype.m_s2 = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_s2",
  box2d.b2PrismaticJoint.prototype.m_s2
);
box2d.b2PrismaticJoint.prototype.m_a1 = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_a1",
  box2d.b2PrismaticJoint.prototype.m_a1
);
box2d.b2PrismaticJoint.prototype.m_a2 = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_a2",
  box2d.b2PrismaticJoint.prototype.m_a2
);
box2d.b2PrismaticJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_K",
  box2d.b2PrismaticJoint.prototype.m_K
);
box2d.b2PrismaticJoint.prototype.m_K3 = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_K3",
  box2d.b2PrismaticJoint.prototype.m_K3
);
box2d.b2PrismaticJoint.prototype.m_K2 = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_K2",
  box2d.b2PrismaticJoint.prototype.m_K2
);
box2d.b2PrismaticJoint.prototype.m_motorMass = 0;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_motorMass",
  box2d.b2PrismaticJoint.prototype.m_motorMass
);
box2d.b2PrismaticJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_qA",
  box2d.b2PrismaticJoint.prototype.m_qA
);
box2d.b2PrismaticJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_qB",
  box2d.b2PrismaticJoint.prototype.m_qB
);
box2d.b2PrismaticJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_lalcA",
  box2d.b2PrismaticJoint.prototype.m_lalcA
);
box2d.b2PrismaticJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_lalcB",
  box2d.b2PrismaticJoint.prototype.m_lalcB
);
box2d.b2PrismaticJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_rA",
  box2d.b2PrismaticJoint.prototype.m_rA
);
box2d.b2PrismaticJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "m_rB",
  box2d.b2PrismaticJoint.prototype.m_rB
);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    k = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngle(f);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var l = box2d.b2Mul_R_V2(k, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var m = box2d.b2Mul_R_V2(f, this.m_lalcB, this.m_rB),
    n = box2d.b2Add_V2_V2(
      box2d.b2Sub_V2_V2(e, b, box2d.b2Vec2.s_t0),
      box2d.b2Sub_V2_V2(m, l, box2d.b2Vec2.s_t1),
      box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d
    ),
    b = this.m_invMassA,
    e = this.m_invMassB,
    f = this.m_invIA,
    p = this.m_invIB;
  box2d.b2Mul_R_V2(k, this.m_localXAxisA, this.m_axis);
  this.m_a1 = box2d.b2Cross_V2_V2(
    box2d.b2Add_V2_V2(n, l, box2d.b2Vec2.s_t0),
    this.m_axis
  );
  this.m_a2 = box2d.b2Cross_V2_V2(m, this.m_axis);
  this.m_motorMass =
    b + e + f * this.m_a1 * this.m_a1 + p * this.m_a2 * this.m_a2;
  0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
  box2d.b2Mul_R_V2(k, this.m_localYAxisA, this.m_perp);
  this.m_s1 = box2d.b2Cross_V2_V2(
    box2d.b2Add_V2_V2(n, l, box2d.b2Vec2.s_t0),
    this.m_perp
  );
  this.m_s2 = box2d.b2Cross_V2_V2(m, this.m_perp);
  this.m_K.ex.x = b + e + f * this.m_s1 * this.m_s1 + p * this.m_s2 * this.m_s2;
  this.m_K.ex.y = f * this.m_s1 + p * this.m_s2;
  this.m_K.ex.z = f * this.m_s1 * this.m_a1 + p * this.m_s2 * this.m_a2;
  this.m_K.ey.x = this.m_K.ex.y;
  this.m_K.ey.y = f + p;
  0 === this.m_K.ey.y && (this.m_K.ey.y = 1);
  this.m_K.ey.z = f * this.m_a1 + p * this.m_a2;
  this.m_K.ez.x = this.m_K.ex.z;
  this.m_K.ez.y = this.m_K.ey.z;
  this.m_K.ez.z = b + e + f * this.m_a1 * this.m_a1 + p * this.m_a2 * this.m_a2;
  this.m_enableLimit
    ? ((k = box2d.b2Dot_V2_V2(this.m_axis, n)),
      box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) <
      2 * box2d.b2_linearSlop
        ? (this.m_limitState = box2d.b2LimitState.e_equalLimits)
        : k <= this.m_lowerTranslation
        ? this.m_limitState !== box2d.b2LimitState.e_atLowerLimit &&
          ((this.m_limitState = box2d.b2LimitState.e_atLowerLimit),
          (this.m_impulse.z = 0))
        : k >= this.m_upperTranslation
        ? this.m_limitState !== box2d.b2LimitState.e_atUpperLimit &&
          ((this.m_limitState = box2d.b2LimitState.e_atUpperLimit),
          (this.m_impulse.z = 0))
        : ((this.m_limitState = box2d.b2LimitState.e_inactiveLimit),
          (this.m_impulse.z = 0)))
    : ((this.m_limitState = box2d.b2LimitState.e_inactiveLimit),
      (this.m_impulse.z = 0));
  this.m_enableMotor || (this.m_motorImpulse = 0);
  a.step.warmStarting
    ? (this.m_impulse.SelfMulScalar(a.step.dtRatio),
      (this.m_motorImpulse *= a.step.dtRatio),
      (k = box2d.b2Add_V2_V2(
        box2d.b2Mul_S_V2(this.m_impulse.x, this.m_perp, box2d.b2Vec2.s_t0),
        box2d.b2Mul_S_V2(
          this.m_motorImpulse + this.m_impulse.z,
          this.m_axis,
          box2d.b2Vec2.s_t1
        ),
        box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P
      )),
      (l =
        this.m_impulse.x * this.m_s1 +
        this.m_impulse.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_a1),
      (m =
        this.m_impulse.x * this.m_s2 +
        this.m_impulse.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_a2),
      c.SelfMulSub(b, k),
      (d -= f * l),
      g.SelfMulAdd(e, k),
      (h += p * m))
    : (this.m_impulse.SetZero(), (this.m_motorImpulse = 0));
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = h;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2PrismaticJoint.prototype.InitVelocityConstraints
);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    k = this.m_invIB;
  if (
    this.m_enableMotor &&
    this.m_limitState !== box2d.b2LimitState.e_equalLimits
  ) {
    var l =
        box2d.b2Dot_V2_V2(
          this.m_axis,
          box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0)
        ) +
        this.m_a2 * e -
        this.m_a1 * c,
      l = this.m_motorMass * (this.m_motorSpeed - l),
      m = this.m_motorImpulse,
      n = a.step.dt * this.m_maxMotorForce;
    this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + l, -n, n);
    l = this.m_motorImpulse - m;
    m = box2d.b2Mul_S_V2(
      l,
      this.m_axis,
      box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P
    );
    n = l * this.m_a1;
    l *= this.m_a2;
    b.SelfMulSub(f, m);
    c -= h * n;
    d.SelfMulAdd(g, m);
    e += k * l;
  }
  var n =
      box2d.b2Dot_V2_V2(
        this.m_perp,
        box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0)
      ) +
      this.m_s2 * e -
      this.m_s1 * c,
    p = e - c;
  this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit
    ? ((l =
        box2d.b2Dot_V2_V2(
          this.m_axis,
          box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0)
        ) +
        this.m_a2 * e -
        this.m_a1 * c),
      (m = box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1.Copy(
        this.m_impulse
      )),
      (l = this.m_K.Solve33(
        -n,
        -p,
        -l,
        box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3
      )),
      this.m_impulse.SelfAdd(l),
      this.m_limitState === box2d.b2LimitState.e_atLowerLimit
        ? (this.m_impulse.z = box2d.b2Max(this.m_impulse.z, 0))
        : this.m_limitState === box2d.b2LimitState.e_atUpperLimit &&
          (this.m_impulse.z = box2d.b2Min(this.m_impulse.z, 0)),
      (n = this.m_K.Solve22(
        -n - (this.m_impulse.z - m.z) * this.m_K.ez.x,
        -p - (this.m_impulse.z - m.z) * this.m_K.ez.y,
        box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r
      )),
      (n.x += m.x),
      (n.y += m.y),
      (this.m_impulse.x = n.x),
      (this.m_impulse.y = n.y),
      (l.x = this.m_impulse.x - m.x),
      (l.y = this.m_impulse.y - m.y),
      (l.z = this.m_impulse.z - m.z),
      (m = box2d.b2Add_V2_V2(
        box2d.b2Mul_S_V2(l.x, this.m_perp, box2d.b2Vec2.s_t0),
        box2d.b2Mul_S_V2(l.z, this.m_axis, box2d.b2Vec2.s_t1),
        box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P
      )),
      (n = l.x * this.m_s1 + l.y + l.z * this.m_a1),
      (l = l.x * this.m_s2 + l.y + l.z * this.m_a2))
    : ((l = this.m_K.Solve22(
        -n,
        -p,
        box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2
      )),
      (this.m_impulse.x += l.x),
      (this.m_impulse.y += l.y),
      (m = box2d.b2Mul_S_V2(
        l.x,
        this.m_perp,
        box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P
      )),
      (n = l.x * this.m_s1 + l.y),
      (l = l.x * this.m_s2 + l.y));
  b.SelfMulSub(f, m);
  c -= h * n;
  d.SelfMulAdd(g, m);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e + k * l;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints
);
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1 = new box2d.b2Vec3();
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3 = new box2d.b2Vec3();
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2 = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e),
    h = this.m_invMassA,
    k = this.m_invMassB,
    l = this.m_invIA,
    m = this.m_invIB,
    n = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA),
    p = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    q = box2d.b2Sub_V2_V2(
      box2d.b2Add_V2_V2(d, p, box2d.b2Vec2.s_t0),
      box2d.b2Add_V2_V2(b, n, box2d.b2Vec2.s_t1),
      box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d
    ),
    r = box2d.b2Mul_R_V2(f, this.m_localXAxisA, this.m_axis),
    u = box2d.b2Cross_V2_V2(box2d.b2Add_V2_V2(q, n, box2d.b2Vec2.s_t0), r),
    g = box2d.b2Cross_V2_V2(p, r),
    f = box2d.b2Mul_R_V2(f, this.m_localYAxisA, this.m_perp),
    t = box2d.b2Cross_V2_V2(box2d.b2Add_V2_V2(q, n, box2d.b2Vec2.s_t0), f),
    w = box2d.b2Cross_V2_V2(p, f),
    x = box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse,
    v = box2d.b2Dot_V2_V2(f, q),
    y = e - c - this.m_referenceAngle,
    n = box2d.b2Abs(v),
    p = box2d.b2Abs(y),
    z = !1,
    B = 0;
  this.m_enableLimit &&
    ((q = box2d.b2Dot_V2_V2(r, q)),
    box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) <
    2 * box2d.b2_linearSlop
      ? ((B = box2d.b2Clamp(
          q,
          -box2d.b2_maxLinearCorrection,
          box2d.b2_maxLinearCorrection
        )),
        (n = box2d.b2Max(n, box2d.b2Abs(q))),
        (z = !0))
      : q <= this.m_lowerTranslation
      ? ((B = box2d.b2Clamp(
          q - this.m_lowerTranslation + box2d.b2_linearSlop,
          -box2d.b2_maxLinearCorrection,
          0
        )),
        (n = box2d.b2Max(n, this.m_lowerTranslation - q)),
        (z = !0))
      : q >= this.m_upperTranslation &&
        ((B = box2d.b2Clamp(
          q - this.m_upperTranslation - box2d.b2_linearSlop,
          0,
          box2d.b2_maxLinearCorrection
        )),
        (n = box2d.b2Max(n, q - this.m_upperTranslation)),
        (z = !0)));
  if (z) {
    var q = l * t + m * w,
      E = l * t * u + m * w * g,
      z = l + m;
    0 === z && (z = 1);
    var F = l * u + m * g,
      G = h + k + l * u * u + m * g * g,
      H = this.m_K3;
    H.ex.Set(h + k + l * t * t + m * w * w, q, E);
    H.ey.Set(q, z, F);
    H.ez.Set(E, F, G);
    x = H.Solve33(-v, -y, -B, x);
  } else
    (q = l * t + m * w),
      (z = l + m),
      0 === z && (z = 1),
      (B = this.m_K2),
      B.ex.Set(h + k + l * t * t + m * w * w, q),
      B.ey.Set(q, z),
      (v = B.Solve(
        -v,
        -y,
        box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1
      )),
      (x.x = v.x),
      (x.y = v.y),
      (x.z = 0);
  r = box2d.b2Add_V2_V2(
    box2d.b2Mul_S_V2(x.x, f, box2d.b2Vec2.s_t0),
    box2d.b2Mul_S_V2(x.z, r, box2d.b2Vec2.s_t1),
    box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P
  );
  u = x.x * t + x.y + x.z * u;
  g = x.x * w + x.y + x.z * g;
  b.SelfMulSub(h, r);
  c -= l * u;
  d.SelfMulAdd(k, r);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e + m * g;
  return n <= box2d.b2_linearSlop && p <= box2d.b2_angularSlop;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2PrismaticJoint.prototype.SolvePositionConstraints
);
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3();
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1 = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetAnchorA",
  box2d.b2PrismaticJoint.prototype.GetAnchorA
);
box2d.b2PrismaticJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetAnchorB",
  box2d.b2PrismaticJoint.prototype.GetAnchorB
);
box2d.b2PrismaticJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(
    a *
      (this.m_impulse.x * this.m_perp.x +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x),
    a *
      (this.m_impulse.x * this.m_perp.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y)
  );
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetReactionForce",
  box2d.b2PrismaticJoint.prototype.GetReactionForce
);
box2d.b2PrismaticJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_impulse.y;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetReactionTorque",
  box2d.b2PrismaticJoint.prototype.GetReactionTorque
);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2PrismaticJoint.prototype.GetLocalAnchorA
);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2PrismaticJoint.prototype.GetLocalAnchorB
);
box2d.b2PrismaticJoint.prototype.GetLocalAxisA = function (a) {
  return a.Copy(this.m_localXAxisA);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetLocalAxisA",
  box2d.b2PrismaticJoint.prototype.GetLocalAxisA
);
box2d.b2PrismaticJoint.prototype.GetReferenceAngle = function () {
  return this.m_referenceAngle;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetReferenceAngle",
  box2d.b2PrismaticJoint.prototype.GetReferenceAngle
);
box2d.b2PrismaticJoint.prototype.GetJointTranslation = function () {
  var a = this.m_bodyA.GetWorldPoint(
      this.m_localAnchorA,
      box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA
    ),
    b = this.m_bodyB.GetWorldPoint(
      this.m_localAnchorB,
      box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB
    ),
    a = box2d.b2Sub_V2_V2(
      b,
      a,
      box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d
    ),
    b = this.m_bodyA.GetWorldVector(
      this.m_localXAxisA,
      box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis
    );
  return box2d.b2Dot_V2_V2(a, b);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetJointTranslation",
  box2d.b2PrismaticJoint.prototype.GetJointTranslation
);
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis = new box2d.b2Vec2();
box2d.b2PrismaticJoint.prototype.GetJointSpeed = function () {
  var a = this.m_bodyA,
    b = this.m_bodyB;
  box2d.b2Sub_V2_V2(this.m_localAnchorA, a.m_sweep.localCenter, this.m_lalcA);
  var c = box2d.b2Mul_R_V2(a.m_xf.q, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, b.m_sweep.localCenter, this.m_lalcB);
  var d = box2d.b2Mul_R_V2(b.m_xf.q, this.m_lalcB, this.m_rB),
    e = box2d.b2Add_V2_V2(a.m_sweep.c, c, box2d.b2Vec2.s_t0),
    f = box2d.b2Add_V2_V2(b.m_sweep.c, d, box2d.b2Vec2.s_t1),
    e = box2d.b2Sub_V2_V2(f, e, box2d.b2Vec2.s_t2),
    f = a.GetWorldVector(this.m_localXAxisA, this.m_axis),
    g = a.m_linearVelocity,
    h = b.m_linearVelocity,
    a = a.m_angularVelocity,
    b = b.m_angularVelocity;
  return (
    box2d.b2Dot_V2_V2(e, box2d.b2Cross_S_V2(a, f, box2d.b2Vec2.s_t0)) +
    box2d.b2Dot_V2_V2(
      f,
      box2d.b2Sub_V2_V2(
        box2d.b2AddCross_V2_S_V2(h, b, d, box2d.b2Vec2.s_t0),
        box2d.b2AddCross_V2_S_V2(g, a, c, box2d.b2Vec2.s_t1),
        box2d.b2Vec2.s_t0
      )
    )
  );
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetJointSpeed",
  box2d.b2PrismaticJoint.prototype.GetJointSpeed
);
box2d.b2PrismaticJoint.prototype.IsLimitEnabled = function () {
  return this.m_enableLimit;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "IsLimitEnabled",
  box2d.b2PrismaticJoint.prototype.IsLimitEnabled
);
box2d.b2PrismaticJoint.prototype.EnableLimit = function (a) {
  a !== this.m_enableLimit &&
    (this.m_bodyA.SetAwake(!0),
    this.m_bodyB.SetAwake(!0),
    (this.m_enableLimit = a),
    (this.m_impulse.z = 0));
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "EnableLimit",
  box2d.b2PrismaticJoint.prototype.EnableLimit
);
box2d.b2PrismaticJoint.prototype.GetLowerLimit = function () {
  return this.m_lowerTranslation;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetLowerLimit",
  box2d.b2PrismaticJoint.prototype.GetLowerLimit
);
box2d.b2PrismaticJoint.prototype.GetUpperLimit = function () {
  return this.m_upperTranslation;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetUpperLimit",
  box2d.b2PrismaticJoint.prototype.GetUpperLimit
);
box2d.b2PrismaticJoint.prototype.SetLimits = function (a, b) {
  if (a !== this.m_lowerTranslation || b !== this.m_upperTranslation)
    this.m_bodyA.SetAwake(!0),
      this.m_bodyB.SetAwake(!0),
      (this.m_lowerTranslation = a),
      (this.m_upperTranslation = b),
      (this.m_impulse.z = 0);
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "SetLimits",
  box2d.b2PrismaticJoint.prototype.SetLimits
);
box2d.b2PrismaticJoint.prototype.IsMotorEnabled = function () {
  return this.m_enableMotor;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "IsMotorEnabled",
  box2d.b2PrismaticJoint.prototype.IsMotorEnabled
);
box2d.b2PrismaticJoint.prototype.EnableMotor = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_enableMotor = a;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "EnableMotor",
  box2d.b2PrismaticJoint.prototype.EnableMotor
);
box2d.b2PrismaticJoint.prototype.SetMotorSpeed = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_motorSpeed = a;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "SetMotorSpeed",
  box2d.b2PrismaticJoint.prototype.SetMotorSpeed
);
box2d.b2PrismaticJoint.prototype.GetMotorSpeed = function () {
  return this.m_motorSpeed;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetMotorSpeed",
  box2d.b2PrismaticJoint.prototype.GetMotorSpeed
);
box2d.b2PrismaticJoint.prototype.SetMaxMotorForce = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_maxMotorForce = a;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "SetMaxMotorForce",
  box2d.b2PrismaticJoint.prototype.SetMaxMotorForce
);
box2d.b2PrismaticJoint.prototype.GetMaxMotorForce = function () {
  return this.m_maxMotorForce;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetMaxMotorForce",
  box2d.b2PrismaticJoint.prototype.GetMaxMotorForce
);
box2d.b2PrismaticJoint.prototype.GetMotorForce = function (a) {
  return a * this.m_motorImpulse;
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "GetMotorForce",
  box2d.b2PrismaticJoint.prototype.GetMotorForce
);
box2d.b2PrismaticJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2PrismaticJointDef*/ var jd = new box2d.b2PrismaticJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log(
      "  jd.localAxisA.Set(%.15f, %.15f);\n",
      this.m_localXAxisA.x,
      this.m_localXAxisA.y
    );
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log(
      "  jd.enableLimit = %s;\n",
      this.m_enableLimit ? "true" : "false"
    );
    box2d.b2Log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
    box2d.b2Log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
    box2d.b2Log(
      "  jd.enableMotor = %s;\n",
      this.m_enableMotor ? "true" : "false"
    );
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2PrismaticJoint.prototype,
  "Dump",
  box2d.b2PrismaticJoint.prototype.Dump
);
box2d.b2_minPulleyLength = 2;
goog.exportSymbol("box2d.b2_minPulleyLength", box2d.b2_minPulleyLength);
box2d.b2PulleyJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_pulleyJoint);
  this.collideConnected = !0;
  this.groundAnchorA = new box2d.b2Vec2(-1, 1);
  this.groundAnchorB = new box2d.b2Vec2(1, 1);
  this.localAnchorA = new box2d.b2Vec2(-1, 0);
  this.localAnchorB = new box2d.b2Vec2(1, 0);
};
goog.inherits(box2d.b2PulleyJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PulleyJointDef", box2d.b2PulleyJointDef);
box2d.b2PulleyJointDef.prototype.groundAnchorA = null;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "groundAnchorA",
  box2d.b2PulleyJointDef.prototype.groundAnchorA
);
box2d.b2PulleyJointDef.prototype.groundAnchorB = null;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "groundAnchorB",
  box2d.b2PulleyJointDef.prototype.groundAnchorB
);
box2d.b2PulleyJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "localAnchorA",
  box2d.b2PulleyJointDef.prototype.localAnchorA
);
box2d.b2PulleyJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "localAnchorB",
  box2d.b2PulleyJointDef.prototype.localAnchorB
);
box2d.b2PulleyJointDef.prototype.lengthA = 0;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "lengthA",
  box2d.b2PulleyJointDef.prototype.lengthA
);
box2d.b2PulleyJointDef.prototype.lengthB = 0;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "lengthB",
  box2d.b2PulleyJointDef.prototype.lengthB
);
box2d.b2PulleyJointDef.prototype.ratio = 1;
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "ratio",
  box2d.b2PulleyJointDef.prototype.ratio
);
box2d.b2PulleyJointDef.prototype.Initialize = function (a, b, c, d, e, f, g) {
  this.bodyA = a;
  this.bodyB = b;
  this.groundAnchorA.Copy(c);
  this.groundAnchorB.Copy(d);
  this.bodyA.GetLocalPoint(e, this.localAnchorA);
  this.bodyB.GetLocalPoint(f, this.localAnchorB);
  this.lengthA = box2d.b2Distance(e, c);
  this.lengthB = box2d.b2Distance(f, d);
  this.ratio = g;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(this.ratio > box2d.b2_epsilon);
};
goog.exportProperty(
  box2d.b2PulleyJointDef.prototype,
  "Initialize",
  box2d.b2PulleyJointDef.prototype.Initialize
);
box2d.b2PulleyJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_groundAnchorA = new box2d.b2Vec2();
  this.m_groundAnchorB = new box2d.b2Vec2();
  this.m_localAnchorA = new box2d.b2Vec2();
  this.m_localAnchorB = new box2d.b2Vec2();
  this.m_uA = new box2d.b2Vec2();
  this.m_uB = new box2d.b2Vec2();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_groundAnchorA.Copy(a.groundAnchorA);
  this.m_groundAnchorB.Copy(a.groundAnchorB);
  this.m_localAnchorA.Copy(a.localAnchorA);
  this.m_localAnchorB.Copy(a.localAnchorB);
  this.m_lengthA = a.lengthA;
  this.m_lengthB = a.lengthB;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 !== a.ratio);
  this.m_ratio = a.ratio;
  this.m_constant = a.lengthA + this.m_ratio * a.lengthB;
  this.m_impulse = 0;
};
goog.inherits(box2d.b2PulleyJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PulleyJoint", box2d.b2PulleyJoint);
box2d.b2PulleyJoint.prototype.m_groundAnchorA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_groundAnchorA",
  box2d.b2PulleyJoint.prototype.m_groundAnchorA
);
box2d.b2PulleyJoint.prototype.m_groundAnchorB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_groundAnchorB",
  box2d.b2PulleyJoint.prototype.m_groundAnchorB
);
box2d.b2PulleyJoint.prototype.m_lengthA = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_lengthA",
  box2d.b2PulleyJoint.prototype.m_lengthA
);
box2d.b2PulleyJoint.prototype.m_lengthB = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_lengthB",
  box2d.b2PulleyJoint.prototype.m_lengthB
);
box2d.b2PulleyJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_localAnchorA",
  box2d.b2PulleyJoint.prototype.m_localAnchorA
);
box2d.b2PulleyJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_localAnchorB",
  box2d.b2PulleyJoint.prototype.m_localAnchorB
);
box2d.b2PulleyJoint.prototype.m_constant = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_constant",
  box2d.b2PulleyJoint.prototype.m_constant
);
box2d.b2PulleyJoint.prototype.m_ratio = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_ratio",
  box2d.b2PulleyJoint.prototype.m_ratio
);
box2d.b2PulleyJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_impulse",
  box2d.b2PulleyJoint.prototype.m_impulse
);
box2d.b2PulleyJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_indexA",
  box2d.b2PulleyJoint.prototype.m_indexA
);
box2d.b2PulleyJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_indexB",
  box2d.b2PulleyJoint.prototype.m_indexB
);
box2d.b2PulleyJoint.prototype.m_uA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_uA",
  box2d.b2PulleyJoint.prototype.m_uA
);
box2d.b2PulleyJoint.prototype.m_uB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_uB",
  box2d.b2PulleyJoint.prototype.m_uB
);
box2d.b2PulleyJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_rA",
  box2d.b2PulleyJoint.prototype.m_rA
);
box2d.b2PulleyJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_rB",
  box2d.b2PulleyJoint.prototype.m_rB
);
box2d.b2PulleyJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_localCenterA",
  box2d.b2PulleyJoint.prototype.m_localCenterA
);
box2d.b2PulleyJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_localCenterB",
  box2d.b2PulleyJoint.prototype.m_localCenterB
);
box2d.b2PulleyJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_invMassA",
  box2d.b2PulleyJoint.prototype.m_invMassA
);
box2d.b2PulleyJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_invMassB",
  box2d.b2PulleyJoint.prototype.m_invMassB
);
box2d.b2PulleyJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_invIA",
  box2d.b2PulleyJoint.prototype.m_invIA
);
box2d.b2PulleyJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_invIB",
  box2d.b2PulleyJoint.prototype.m_invIB
);
box2d.b2PulleyJoint.prototype.m_mass = 0;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_mass",
  box2d.b2PulleyJoint.prototype.m_mass
);
box2d.b2PulleyJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_qA",
  box2d.b2PulleyJoint.prototype.m_qA
);
box2d.b2PulleyJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_qB",
  box2d.b2PulleyJoint.prototype.m_qB
);
box2d.b2PulleyJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_lalcA",
  box2d.b2PulleyJoint.prototype.m_lalcA
);
box2d.b2PulleyJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "m_lalcB",
  box2d.b2PulleyJoint.prototype.m_lalcB
);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    k = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngle(f);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2Mul_R_V2(k, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(f, this.m_lalcB, this.m_rB);
  this.m_uA.Copy(b).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
  this.m_uB.Copy(e).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
  b = this.m_uA.Length();
  e = this.m_uB.Length();
  b > 10 * box2d.b2_linearSlop ? this.m_uA.SelfMul(1 / b) : this.m_uA.SetZero();
  e > 10 * box2d.b2_linearSlop ? this.m_uB.SelfMul(1 / e) : this.m_uB.SetZero();
  b = box2d.b2Cross_V2_V2(this.m_rA, this.m_uA);
  e = box2d.b2Cross_V2_V2(this.m_rB, this.m_uB);
  this.m_mass =
    this.m_invMassA +
    this.m_invIA * b * b +
    this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * e * e);
  0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
  a.step.warmStarting
    ? ((this.m_impulse *= a.step.dtRatio),
      (b = box2d.b2Mul_S_V2(
        -this.m_impulse,
        this.m_uA,
        box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA
      )),
      (e = box2d.b2Mul_S_V2(
        -this.m_ratio * this.m_impulse,
        this.m_uB,
        box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB
      )),
      c.SelfMulAdd(this.m_invMassA, b),
      (d += this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, b)),
      g.SelfMulAdd(this.m_invMassB, e),
      (h += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, e)))
    : (this.m_impulse = 0);
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = h;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2PulleyJoint.prototype.InitVelocityConstraints
);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = box2d.b2AddCross_V2_S_V2(
      b,
      c,
      this.m_rA,
      box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA
    ),
    g = box2d.b2AddCross_V2_S_V2(
      d,
      e,
      this.m_rB,
      box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB
    ),
    f =
      -box2d.b2Dot_V2_V2(this.m_uA, f) -
      this.m_ratio * box2d.b2Dot_V2_V2(this.m_uB, g),
    g = -this.m_mass * f;
  this.m_impulse += g;
  f = box2d.b2Mul_S_V2(
    -g,
    this.m_uA,
    box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA
  );
  g = box2d.b2Mul_S_V2(
    -this.m_ratio * g,
    this.m_uB,
    box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB
  );
  b.SelfMulAdd(this.m_invMassA, f);
  c += this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, f);
  d.SelfMulAdd(this.m_invMassB, g);
  e += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, g);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2PulleyJoint.prototype.SolveVelocityConstraints
);
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    h = this.m_uA.Copy(b).SelfAdd(f).SelfSub(this.m_groundAnchorA),
    k = this.m_uB.Copy(d).SelfAdd(g).SelfSub(this.m_groundAnchorB),
    l = h.Length(),
    m = k.Length();
  l > 10 * box2d.b2_linearSlop ? h.SelfMul(1 / l) : h.SetZero();
  m > 10 * box2d.b2_linearSlop ? k.SelfMul(1 / m) : k.SetZero();
  var n = box2d.b2Cross_V2_V2(f, h),
    p = box2d.b2Cross_V2_V2(g, k),
    n =
      this.m_invMassA +
      this.m_invIA * n * n +
      this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * p * p);
  0 < n && (n = 1 / n);
  m = this.m_constant - l - this.m_ratio * m;
  l = box2d.b2Abs(m);
  m *= -n;
  h = box2d.b2Mul_S_V2(
    -m,
    h,
    box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA
  );
  k = box2d.b2Mul_S_V2(
    -this.m_ratio * m,
    k,
    box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB
  );
  b.SelfMulAdd(this.m_invMassA, h);
  c += this.m_invIA * box2d.b2Cross_V2_V2(f, h);
  d.SelfMulAdd(this.m_invMassB, k);
  e += this.m_invIB * box2d.b2Cross_V2_V2(g, k);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return l < box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2PulleyJoint.prototype.SolvePositionConstraints
);
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetAnchorA",
  box2d.b2PulleyJoint.prototype.GetAnchorA
);
box2d.b2PulleyJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetAnchorB",
  box2d.b2PulleyJoint.prototype.GetAnchorB
);
box2d.b2PulleyJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(
    a * this.m_impulse * this.m_uB.x,
    a * this.m_impulse * this.m_uB.y
  );
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetReactionForce",
  box2d.b2PulleyJoint.prototype.GetReactionForce
);
box2d.b2PulleyJoint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetReactionTorque",
  box2d.b2PulleyJoint.prototype.GetReactionTorque
);
box2d.b2PulleyJoint.prototype.GetGroundAnchorA = function (a) {
  return a.Copy(this.m_groundAnchorA);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetGroundAnchorA",
  box2d.b2PulleyJoint.prototype.GetGroundAnchorA
);
box2d.b2PulleyJoint.prototype.GetGroundAnchorB = function (a) {
  return a.Copy(this.m_groundAnchorB);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetGroundAnchorB",
  box2d.b2PulleyJoint.prototype.GetGroundAnchorB
);
box2d.b2PulleyJoint.prototype.GetLengthA = function () {
  return this.m_lengthA;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetLengthA",
  box2d.b2PulleyJoint.prototype.GetLengthA
);
box2d.b2PulleyJoint.prototype.GetLengthB = function () {
  return this.m_lengthB;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetLengthB",
  box2d.b2PulleyJoint.prototype.GetLengthB
);
box2d.b2PulleyJoint.prototype.GetRatio = function () {
  return this.m_ratio;
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetRatio",
  box2d.b2PulleyJoint.prototype.GetRatio
);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA = function () {
  var a = this.m_bodyA.GetWorldPoint(
    this.m_localAnchorA,
    box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p
  );
  return box2d.b2Distance(a, this.m_groundAnchorA);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetCurrentLengthA",
  box2d.b2PulleyJoint.prototype.GetCurrentLengthA
);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.GetCurrentLengthB = function () {
  var a = this.m_bodyB.GetWorldPoint(
    this.m_localAnchorB,
    box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p
  );
  return box2d.b2Distance(a, this.m_groundAnchorB);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "GetCurrentLengthB",
  box2d.b2PulleyJoint.prototype.GetCurrentLengthB
);
box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p = new box2d.b2Vec2();
box2d.b2PulleyJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2PulleyJointDef*/ var jd = new box2d.b2PulleyJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.groundAnchorA.Set(%.15f, %.15f);\n",
      this.m_groundAnchorA.x,
      this.m_groundAnchorA.y
    );
    box2d.b2Log(
      "  jd.groundAnchorB.Set(%.15f, %.15f);\n",
      this.m_groundAnchorB.x,
      this.m_groundAnchorB.y
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.lengthA = %.15f;\n", this.m_lengthA);
    box2d.b2Log("  jd.lengthB = %.15f;\n", this.m_lengthB);
    box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "Dump",
  box2d.b2PulleyJoint.prototype.Dump
);
box2d.b2PulleyJoint.prototype.ShiftOrigin = function (a) {
  this.m_groundAnchorA.SelfSub(a);
  this.m_groundAnchorB.SelfSub(a);
};
goog.exportProperty(
  box2d.b2PulleyJoint.prototype,
  "ShiftOrigin",
  box2d.b2PulleyJoint.prototype.ShiftOrigin
);
box2d.b2RevoluteJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_revoluteJoint);
  this.localAnchorA = new box2d.b2Vec2(0, 0);
  this.localAnchorB = new box2d.b2Vec2(0, 0);
};
goog.inherits(box2d.b2RevoluteJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RevoluteJointDef", box2d.b2RevoluteJointDef);
box2d.b2RevoluteJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "localAnchorA",
  box2d.b2RevoluteJointDef.prototype.localAnchorA
);
box2d.b2RevoluteJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "localAnchorB",
  box2d.b2RevoluteJointDef.prototype.localAnchorB
);
box2d.b2RevoluteJointDef.prototype.referenceAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "referenceAngle",
  box2d.b2RevoluteJointDef.prototype.referenceAngle
);
box2d.b2RevoluteJointDef.prototype.enableLimit = !1;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "enableLimit",
  box2d.b2RevoluteJointDef.prototype.enableLimit
);
box2d.b2RevoluteJointDef.prototype.lowerAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "lowerAngle",
  box2d.b2RevoluteJointDef.prototype.lowerAngle
);
box2d.b2RevoluteJointDef.prototype.upperAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "upperAngle",
  box2d.b2RevoluteJointDef.prototype.upperAngle
);
box2d.b2RevoluteJointDef.prototype.enableMotor = !1;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "enableMotor",
  box2d.b2RevoluteJointDef.prototype.enableMotor
);
box2d.b2RevoluteJointDef.prototype.motorSpeed = 0;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "motorSpeed",
  box2d.b2RevoluteJointDef.prototype.motorSpeed
);
box2d.b2RevoluteJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "maxMotorTorque",
  box2d.b2RevoluteJointDef.prototype.maxMotorTorque
);
box2d.b2RevoluteJointDef.prototype.Initialize = function (a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
goog.exportProperty(
  box2d.b2RevoluteJointDef.prototype,
  "Initialize",
  box2d.b2RevoluteJointDef.prototype.Initialize
);
box2d.b2RevoluteJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = new box2d.b2Vec2();
  this.m_localAnchorB = new box2d.b2Vec2();
  this.m_impulse = new box2d.b2Vec3();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_mass = new box2d.b2Mat33();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_K = new box2d.b2Mat22();
  this.m_localAnchorA.Copy(a.localAnchorA);
  this.m_localAnchorB.Copy(a.localAnchorB);
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse.SetZero();
  this.m_motorImpulse = 0;
  this.m_lowerAngle = a.lowerAngle;
  this.m_upperAngle = a.upperAngle;
  this.m_maxMotorTorque = a.maxMotorTorque;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableLimit = a.enableLimit;
  this.m_enableMotor = a.enableMotor;
  this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
};
goog.inherits(box2d.b2RevoluteJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RevoluteJoint", box2d.b2RevoluteJoint);
box2d.b2RevoluteJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_localAnchorA",
  box2d.b2RevoluteJoint.prototype.m_localAnchorA
);
box2d.b2RevoluteJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_localAnchorB",
  box2d.b2RevoluteJoint.prototype.m_localAnchorB
);
box2d.b2RevoluteJoint.prototype.m_impulse = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_impulse",
  box2d.b2RevoluteJoint.prototype.m_impulse
);
box2d.b2RevoluteJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_motorImpulse",
  box2d.b2RevoluteJoint.prototype.m_motorImpulse
);
box2d.b2RevoluteJoint.prototype.m_enableMotor = !1;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_enableMotor",
  box2d.b2RevoluteJoint.prototype.m_enableMotor
);
box2d.b2RevoluteJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_maxMotorTorque",
  box2d.b2RevoluteJoint.prototype.m_maxMotorTorque
);
box2d.b2RevoluteJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_motorSpeed",
  box2d.b2RevoluteJoint.prototype.m_motorSpeed
);
box2d.b2RevoluteJoint.prototype.m_enableLimit = !1;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_enableLimit",
  box2d.b2RevoluteJoint.prototype.m_enableLimit
);
box2d.b2RevoluteJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_referenceAngle",
  box2d.b2RevoluteJoint.prototype.m_referenceAngle
);
box2d.b2RevoluteJoint.prototype.m_lowerAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_lowerAngle",
  box2d.b2RevoluteJoint.prototype.m_lowerAngle
);
box2d.b2RevoluteJoint.prototype.m_upperAngle = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_upperAngle",
  box2d.b2RevoluteJoint.prototype.m_upperAngle
);
box2d.b2RevoluteJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_indexA",
  box2d.b2RevoluteJoint.prototype.m_indexA
);
box2d.b2RevoluteJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_indexB",
  box2d.b2RevoluteJoint.prototype.m_indexB
);
box2d.b2RevoluteJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_rA",
  box2d.b2RevoluteJoint.prototype.m_rA
);
box2d.b2RevoluteJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_rB",
  box2d.b2RevoluteJoint.prototype.m_rB
);
box2d.b2RevoluteJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_localCenterA",
  box2d.b2RevoluteJoint.prototype.m_localCenterA
);
box2d.b2RevoluteJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_localCenterB",
  box2d.b2RevoluteJoint.prototype.m_localCenterB
);
box2d.b2RevoluteJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_invMassA",
  box2d.b2RevoluteJoint.prototype.m_invMassA
);
box2d.b2RevoluteJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_invMassB",
  box2d.b2RevoluteJoint.prototype.m_invMassB
);
box2d.b2RevoluteJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_invIA",
  box2d.b2RevoluteJoint.prototype.m_invIA
);
box2d.b2RevoluteJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_invIB",
  box2d.b2RevoluteJoint.prototype.m_invIB
);
box2d.b2RevoluteJoint.prototype.m_mass = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_mass",
  box2d.b2RevoluteJoint.prototype.m_mass
);
box2d.b2RevoluteJoint.prototype.m_motorMass = 0;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_motorMass",
  box2d.b2RevoluteJoint.prototype.m_motorMass
);
box2d.b2RevoluteJoint.prototype.m_limitState =
  box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_limitState",
  box2d.b2RevoluteJoint.prototype.m_limitState
);
box2d.b2RevoluteJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_qA",
  box2d.b2RevoluteJoint.prototype.m_qA
);
box2d.b2RevoluteJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_qB",
  box2d.b2RevoluteJoint.prototype.m_qB
);
box2d.b2RevoluteJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_lalcA",
  box2d.b2RevoluteJoint.prototype.m_lalcA
);
box2d.b2RevoluteJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_lalcB",
  box2d.b2RevoluteJoint.prototype.m_lalcB
);
box2d.b2RevoluteJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "m_K",
  box2d.b2RevoluteJoint.prototype.m_K
);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].a,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].a,
    f = a.velocities[this.m_indexB].v,
    g = a.velocities[this.m_indexB].w,
    h = this.m_qA.SetAngle(b),
    k = this.m_qB.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2Mul_R_V2(h, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(k, this.m_lalcB, this.m_rB);
  var h = this.m_invMassA,
    k = this.m_invMassB,
    l = this.m_invIA,
    m = this.m_invIB,
    n = 0 === l + m;
  this.m_mass.ex.x =
    h + k + this.m_rA.y * this.m_rA.y * l + this.m_rB.y * this.m_rB.y * m;
  this.m_mass.ey.x =
    -this.m_rA.y * this.m_rA.x * l - this.m_rB.y * this.m_rB.x * m;
  this.m_mass.ez.x = -this.m_rA.y * l - this.m_rB.y * m;
  this.m_mass.ex.y = this.m_mass.ey.x;
  this.m_mass.ey.y =
    h + k + this.m_rA.x * this.m_rA.x * l + this.m_rB.x * this.m_rB.x * m;
  this.m_mass.ez.y = this.m_rA.x * l + this.m_rB.x * m;
  this.m_mass.ex.z = this.m_mass.ez.x;
  this.m_mass.ey.z = this.m_mass.ez.y;
  this.m_mass.ez.z = l + m;
  this.m_motorMass = l + m;
  0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
  if (!this.m_enableMotor || n) this.m_motorImpulse = 0;
  this.m_enableLimit && !n
    ? ((b = e - b - this.m_referenceAngle),
      box2d.b2Abs(this.m_upperAngle - this.m_lowerAngle) <
      2 * box2d.b2_angularSlop
        ? (this.m_limitState = box2d.b2LimitState.e_equalLimits)
        : b <= this.m_lowerAngle
        ? (this.m_limitState !== box2d.b2LimitState.e_atLowerLimit &&
            (this.m_impulse.z = 0),
          (this.m_limitState = box2d.b2LimitState.e_atLowerLimit))
        : b >= this.m_upperAngle
        ? (this.m_limitState !== box2d.b2LimitState.e_atUpperLimit &&
            (this.m_impulse.z = 0),
          (this.m_limitState = box2d.b2LimitState.e_atUpperLimit))
        : ((this.m_limitState = box2d.b2LimitState.e_inactiveLimit),
          (this.m_impulse.z = 0)))
    : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit);
  a.step.warmStarting
    ? (this.m_impulse.SelfMulScalar(a.step.dtRatio),
      (this.m_motorImpulse *= a.step.dtRatio),
      (b = box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P.Set(
        this.m_impulse.x,
        this.m_impulse.y
      )),
      c.SelfMulSub(h, b),
      (d -=
        l *
        (box2d.b2Cross_V2_V2(this.m_rA, b) +
          this.m_motorImpulse +
          this.m_impulse.z)),
      f.SelfMulAdd(k, b),
      (g +=
        m *
        (box2d.b2Cross_V2_V2(this.m_rB, b) +
          this.m_motorImpulse +
          this.m_impulse.z)))
    : (this.m_impulse.SetZero(), (this.m_motorImpulse = 0));
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = g;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2RevoluteJoint.prototype.InitVelocityConstraints
);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    k = this.m_invIB,
    l = 0 === h + k;
  if (
    this.m_enableMotor &&
    this.m_limitState !== box2d.b2LimitState.e_equalLimits &&
    !l
  ) {
    var m = e - c - this.m_motorSpeed,
      m = -this.m_motorMass * m,
      n = this.m_motorImpulse,
      p = a.step.dt * this.m_maxMotorTorque;
    this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + m, -p, p);
    m = this.m_motorImpulse - n;
    c -= h * m;
    e += k * m;
  }
  this.m_enableLimit &&
  this.m_limitState !== box2d.b2LimitState.e_inactiveLimit &&
  !l
    ? ((l = box2d.b2Sub_V2_V2(
        box2d.b2AddCross_V2_S_V2(d, e, this.m_rB, box2d.b2Vec2.s_t0),
        box2d.b2AddCross_V2_S_V2(b, c, this.m_rA, box2d.b2Vec2.s_t1),
        box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1
      )),
      (m = this.m_mass
        .Solve33(
          l.x,
          l.y,
          e - c,
          box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3
        )
        .SelfNeg()),
      this.m_limitState === box2d.b2LimitState.e_equalLimits
        ? this.m_impulse.SelfAdd(m)
        : this.m_limitState === box2d.b2LimitState.e_atLowerLimit
        ? ((n = this.m_impulse.z + m.z),
          0 > n
            ? ((n = -l.x + this.m_impulse.z * this.m_mass.ez.x),
              (l = -l.y + this.m_impulse.z * this.m_mass.ez.y),
              (l = this.m_mass.Solve22(
                n,
                l,
                box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints
                  .s_reduced
              )),
              (m.x = l.x),
              (m.y = l.y),
              (m.z = -this.m_impulse.z),
              (this.m_impulse.x += l.x),
              (this.m_impulse.y += l.y),
              (this.m_impulse.z = 0))
            : this.m_impulse.SelfAdd(m))
        : this.m_limitState === box2d.b2LimitState.e_atUpperLimit &&
          ((n = this.m_impulse.z + m.z),
          0 < n
            ? ((n = -l.x + this.m_impulse.z * this.m_mass.ez.x),
              (l = -l.y + this.m_impulse.z * this.m_mass.ez.y),
              (l = this.m_mass.Solve22(
                n,
                l,
                box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints
                  .s_reduced
              )),
              (m.x = l.x),
              (m.y = l.y),
              (m.z = -this.m_impulse.z),
              (this.m_impulse.x += l.x),
              (this.m_impulse.y += l.y),
              (this.m_impulse.z = 0))
            : this.m_impulse.SelfAdd(m)),
      (l = box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P.Set(
        m.x,
        m.y
      )),
      b.SelfMulSub(f, l),
      (c -= h * (box2d.b2Cross_V2_V2(this.m_rA, l) + m.z)),
      d.SelfMulAdd(g, l),
      (e += k * (box2d.b2Cross_V2_V2(this.m_rB, l) + m.z)))
    : ((m = box2d.b2Sub_V2_V2(
        box2d.b2AddCross_V2_S_V2(d, e, this.m_rB, box2d.b2Vec2.s_t0),
        box2d.b2AddCross_V2_S_V2(b, c, this.m_rA, box2d.b2Vec2.s_t1),
        box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot
      )),
      (m = this.m_mass.Solve22(
        -m.x,
        -m.y,
        box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2
      )),
      (this.m_impulse.x += m.x),
      (this.m_impulse.y += m.y),
      b.SelfMulSub(f, m),
      (c -= h * box2d.b2Cross_V2_V2(this.m_rA, m)),
      d.SelfMulAdd(g, m),
      (e += k * box2d.b2Cross_V2_V2(this.m_rB, m)));
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints
);
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3 = new box2d.b2Vec3();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2 = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e),
    h = 0,
    k = 0,
    k = 0 === this.m_invIA + this.m_invIB;
  if (
    this.m_enableLimit &&
    this.m_limitState !== box2d.b2LimitState.e_inactiveLimit &&
    !k
  ) {
    var l = e - c - this.m_referenceAngle,
      k = 0;
    this.m_limitState === box2d.b2LimitState.e_equalLimits
      ? ((l = box2d.b2Clamp(
          l - this.m_lowerAngle,
          -box2d.b2_maxAngularCorrection,
          box2d.b2_maxAngularCorrection
        )),
        (k = -this.m_motorMass * l),
        (h = box2d.b2Abs(l)))
      : this.m_limitState === box2d.b2LimitState.e_atLowerLimit
      ? ((l -= this.m_lowerAngle),
        (h = -l),
        (l = box2d.b2Clamp(
          l + box2d.b2_angularSlop,
          -box2d.b2_maxAngularCorrection,
          0
        )),
        (k = -this.m_motorMass * l))
      : this.m_limitState === box2d.b2LimitState.e_atUpperLimit &&
        ((h = l -= this.m_upperAngle),
        (l = box2d.b2Clamp(
          l - box2d.b2_angularSlop,
          0,
          box2d.b2_maxAngularCorrection
        )),
        (k = -this.m_motorMass * l));
    c -= this.m_invIA * k;
    e += this.m_invIB * k;
  }
  f.SetAngle(c);
  g.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    l = box2d.b2Sub_V2_V2(
      box2d.b2Add_V2_V2(d, g, box2d.b2Vec2.s_t0),
      box2d.b2Add_V2_V2(b, f, box2d.b2Vec2.s_t1),
      box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C
    ),
    k = l.Length(),
    m = this.m_invMassA,
    n = this.m_invMassB,
    p = this.m_invIA,
    q = this.m_invIB,
    r = this.m_K;
  r.ex.x = m + n + p * f.y * f.y + q * g.y * g.y;
  r.ex.y = -p * f.x * f.y - q * g.x * g.y;
  r.ey.x = r.ex.y;
  r.ey.y = m + n + p * f.x * f.x + q * g.x * g.x;
  l = r
    .Solve(
      l.x,
      l.y,
      box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse
    )
    .SelfNeg();
  b.SelfMulSub(m, l);
  c -= p * box2d.b2Cross_V2_V2(f, l);
  d.SelfMulAdd(n, l);
  e += q * box2d.b2Cross_V2_V2(g, l);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return k <= box2d.b2_linearSlop && h <= box2d.b2_angularSlop;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2RevoluteJoint.prototype.SolvePositionConstraints
);
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec2();
box2d.b2RevoluteJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetAnchorA",
  box2d.b2RevoluteJoint.prototype.GetAnchorA
);
box2d.b2RevoluteJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetAnchorB",
  box2d.b2RevoluteJoint.prototype.GetAnchorB
);
box2d.b2RevoluteJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(a * this.m_impulse.x, a * this.m_impulse.y);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetReactionForce",
  box2d.b2RevoluteJoint.prototype.GetReactionForce
);
box2d.b2RevoluteJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_impulse.z;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetReactionTorque",
  box2d.b2RevoluteJoint.prototype.GetReactionTorque
);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2RevoluteJoint.prototype.GetLocalAnchorA
);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2RevoluteJoint.prototype.GetLocalAnchorB
);
box2d.b2RevoluteJoint.prototype.GetReferenceAngle = function () {
  return this.m_referenceAngle;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetReferenceAngle",
  box2d.b2RevoluteJoint.prototype.GetReferenceAngle
);
box2d.b2RevoluteJoint.prototype.GetJointAngle = function () {
  return (
    this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle
  );
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetJointAngle",
  box2d.b2RevoluteJoint.prototype.GetJointAngle
);
box2d.b2RevoluteJoint.prototype.GetJointSpeed = function () {
  return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetJointSpeed",
  box2d.b2RevoluteJoint.prototype.GetJointSpeed
);
box2d.b2RevoluteJoint.prototype.IsMotorEnabled = function () {
  return this.m_enableMotor;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "IsMotorEnabled",
  box2d.b2RevoluteJoint.prototype.IsMotorEnabled
);
box2d.b2RevoluteJoint.prototype.EnableMotor = function (a) {
  this.m_enableMotor !== a &&
    (this.m_bodyA.SetAwake(!0),
    this.m_bodyB.SetAwake(!0),
    (this.m_enableMotor = a));
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "EnableMotor",
  box2d.b2RevoluteJoint.prototype.EnableMotor
);
box2d.b2RevoluteJoint.prototype.GetMotorTorque = function (a) {
  return a * this.m_motorImpulse;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetMotorTorque",
  box2d.b2RevoluteJoint.prototype.GetMotorTorque
);
box2d.b2RevoluteJoint.prototype.GetMotorSpeed = function () {
  return this.m_motorSpeed;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetMotorSpeed",
  box2d.b2RevoluteJoint.prototype.GetMotorSpeed
);
box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque = function (a) {
  this.m_maxMotorTorque = a;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "SetMaxMotorTorque",
  box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque
);
box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque = function () {
  return this.m_maxMotorTorque;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetMaxMotorTorque",
  box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque
);
box2d.b2RevoluteJoint.prototype.IsLimitEnabled = function () {
  return this.m_enableLimit;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "IsLimitEnabled",
  box2d.b2RevoluteJoint.prototype.IsLimitEnabled
);
box2d.b2RevoluteJoint.prototype.EnableLimit = function (a) {
  a !== this.m_enableLimit &&
    (this.m_bodyA.SetAwake(!0),
    this.m_bodyB.SetAwake(!0),
    (this.m_enableLimit = a),
    (this.m_impulse.z = 0));
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "EnableLimit",
  box2d.b2RevoluteJoint.prototype.EnableLimit
);
box2d.b2RevoluteJoint.prototype.GetLowerLimit = function () {
  return this.m_lowerAngle;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetLowerLimit",
  box2d.b2RevoluteJoint.prototype.GetLowerLimit
);
box2d.b2RevoluteJoint.prototype.GetUpperLimit = function () {
  return this.m_upperAngle;
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "GetUpperLimit",
  box2d.b2RevoluteJoint.prototype.GetUpperLimit
);
box2d.b2RevoluteJoint.prototype.SetLimits = function (a, b) {
  if (a !== this.m_lowerAngle || b !== this.m_upperAngle)
    this.m_bodyA.SetAwake(!0),
      this.m_bodyB.SetAwake(!0),
      (this.m_impulse.z = 0),
      (this.m_lowerAngle = a),
      (this.m_upperAngle = b);
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "SetLimits",
  box2d.b2RevoluteJoint.prototype.SetLimits
);
box2d.b2RevoluteJoint.prototype.SetMotorSpeed = function (a) {
  this.m_motorSpeed !== a &&
    (this.m_bodyA.SetAwake(!0),
    this.m_bodyB.SetAwake(!0),
    (this.m_motorSpeed = a));
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "SetMotorSpeed",
  box2d.b2RevoluteJoint.prototype.SetMotorSpeed
);
box2d.b2RevoluteJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2RevoluteJointDef*/ var jd = new box2d.b2RevoluteJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log(
      "  jd.enableLimit = %s;\n",
      this.m_enableLimit ? "true" : "false"
    );
    box2d.b2Log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
    box2d.b2Log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
    box2d.b2Log(
      "  jd.enableMotor = %s;\n",
      this.m_enableMotor ? "true" : "false"
    );
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2RevoluteJoint.prototype,
  "Dump",
  box2d.b2RevoluteJoint.prototype.Dump
);
box2d.b2GearJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_gearJoint);
};
goog.inherits(box2d.b2GearJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2GearJointDef", box2d.b2GearJointDef);
box2d.b2GearJointDef.prototype.joint1 = null;
goog.exportProperty(
  box2d.b2GearJointDef.prototype,
  "joint1",
  box2d.b2GearJointDef.prototype.joint1
);
box2d.b2GearJointDef.prototype.joint2 = null;
goog.exportProperty(
  box2d.b2GearJointDef.prototype,
  "joint2",
  box2d.b2GearJointDef.prototype.joint2
);
box2d.b2GearJointDef.prototype.ratio = 1;
goog.exportProperty(
  box2d.b2GearJointDef.prototype,
  "ratio",
  box2d.b2GearJointDef.prototype.ratio
);
box2d.b2GearJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_joint1 = a.joint1;
  this.m_joint2 = a.joint2;
  this.m_localAnchorA = new box2d.b2Vec2();
  this.m_localAnchorB = new box2d.b2Vec2();
  this.m_localAnchorC = new box2d.b2Vec2();
  this.m_localAnchorD = new box2d.b2Vec2();
  this.m_localAxisC = new box2d.b2Vec2();
  this.m_localAxisD = new box2d.b2Vec2();
  this.m_lcA = new box2d.b2Vec2();
  this.m_lcB = new box2d.b2Vec2();
  this.m_lcC = new box2d.b2Vec2();
  this.m_lcD = new box2d.b2Vec2();
  this.m_JvAC = new box2d.b2Vec2();
  this.m_JvBD = new box2d.b2Vec2();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_qC = new box2d.b2Rot();
  this.m_qD = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_lalcC = new box2d.b2Vec2();
  this.m_lalcD = new box2d.b2Vec2();
  this.m_typeA = this.m_joint1.GetType();
  this.m_typeB = this.m_joint2.GetType();
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(
      this.m_typeA === box2d.b2JointType.e_revoluteJoint ||
        this.m_typeA === box2d.b2JointType.e_prismaticJoint
    );
  box2d.ENABLE_ASSERTS &&
    box2d.b2Assert(
      this.m_typeB === box2d.b2JointType.e_revoluteJoint ||
        this.m_typeB === box2d.b2JointType.e_prismaticJoint
    );
  var b, c;
  this.m_bodyC = this.m_joint1.GetBodyA();
  this.m_bodyA = this.m_joint1.GetBodyB();
  b = this.m_bodyA.m_xf;
  var d = this.m_bodyA.m_sweep.a;
  c = this.m_bodyC.m_xf;
  var e = this.m_bodyC.m_sweep.a;
  this.m_typeA === box2d.b2JointType.e_revoluteJoint
    ? ((c = a.joint1),
      this.m_localAnchorC.Copy(c.m_localAnchorA),
      this.m_localAnchorA.Copy(c.m_localAnchorB),
      (this.m_referenceAngleA = c.m_referenceAngle),
      this.m_localAxisC.SetZero(),
      (b = d - e - this.m_referenceAngleA))
    : ((e = a.joint1),
      this.m_localAnchorC.Copy(e.m_localAnchorA),
      this.m_localAnchorA.Copy(e.m_localAnchorB),
      (this.m_referenceAngleA = e.m_referenceAngle),
      this.m_localAxisC.Copy(e.m_localXAxisA),
      (d = this.m_localAnchorC),
      (b = box2d.b2MulT_R_V2(
        c.q,
        box2d.b2Add_V2_V2(
          box2d.b2Mul_R_V2(b.q, this.m_localAnchorA, box2d.b2Vec2.s_t0),
          box2d.b2Sub_V2_V2(b.p, c.p, box2d.b2Vec2.s_t1),
          box2d.b2Vec2.s_t0
        ),
        box2d.b2Vec2.s_t0
      )),
      (b = box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(b, d, box2d.b2Vec2.s_t0),
        this.m_localAxisC
      )));
  this.m_bodyD = this.m_joint2.GetBodyA();
  this.m_bodyB = this.m_joint2.GetBodyB();
  c = this.m_bodyB.m_xf;
  var e = this.m_bodyB.m_sweep.a,
    d = this.m_bodyD.m_xf,
    f = this.m_bodyD.m_sweep.a;
  this.m_typeB === box2d.b2JointType.e_revoluteJoint
    ? ((c = a.joint2),
      this.m_localAnchorD.Copy(c.m_localAnchorA),
      this.m_localAnchorB.Copy(c.m_localAnchorB),
      (this.m_referenceAngleB = c.m_referenceAngle),
      this.m_localAxisD.SetZero(),
      (c = e - f - this.m_referenceAngleB))
    : ((e = a.joint2),
      this.m_localAnchorD.Copy(e.m_localAnchorA),
      this.m_localAnchorB.Copy(e.m_localAnchorB),
      (this.m_referenceAngleB = e.m_referenceAngle),
      this.m_localAxisD.Copy(e.m_localXAxisA),
      (e = this.m_localAnchorD),
      (c = box2d.b2MulT_R_V2(
        d.q,
        box2d.b2Add_V2_V2(
          box2d.b2Mul_R_V2(c.q, this.m_localAnchorB, box2d.b2Vec2.s_t0),
          box2d.b2Sub_V2_V2(c.p, d.p, box2d.b2Vec2.s_t1),
          box2d.b2Vec2.s_t0
        ),
        box2d.b2Vec2.s_t0
      )),
      (c = box2d.b2Dot_V2_V2(
        box2d.b2Sub_V2_V2(c, e, box2d.b2Vec2.s_t0),
        this.m_localAxisD
      )));
  this.m_ratio = a.ratio;
  this.m_constant = b + this.m_ratio * c;
  this.m_impulse = 0;
};
goog.inherits(box2d.b2GearJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2GearJoint", box2d.b2GearJoint);
box2d.b2GearJoint.prototype.m_joint1 = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_joint1",
  box2d.b2GearJoint.prototype.m_joint1
);
box2d.b2GearJoint.prototype.m_joint2 = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_joint2",
  box2d.b2GearJoint.prototype.m_joint2
);
box2d.b2GearJoint.prototype.m_typeA = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_typeA",
  box2d.b2GearJoint.prototype.m_typeA
);
box2d.b2GearJoint.prototype.m_typeB = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_typeB",
  box2d.b2GearJoint.prototype.m_typeB
);
box2d.b2GearJoint.prototype.m_bodyC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_bodyC",
  box2d.b2GearJoint.prototype.m_bodyC
);
box2d.b2GearJoint.prototype.m_bodyD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_bodyD",
  box2d.b2GearJoint.prototype.m_bodyD
);
box2d.b2GearJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAnchorA",
  box2d.b2GearJoint.prototype.m_localAnchorA
);
box2d.b2GearJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAnchorB",
  box2d.b2GearJoint.prototype.m_localAnchorB
);
box2d.b2GearJoint.prototype.m_localAnchorC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAnchorC",
  box2d.b2GearJoint.prototype.m_localAnchorC
);
box2d.b2GearJoint.prototype.m_localAnchorD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAnchorD",
  box2d.b2GearJoint.prototype.m_localAnchorD
);
box2d.b2GearJoint.prototype.m_localAxisC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAxisC",
  box2d.b2GearJoint.prototype.m_localAxisC
);
box2d.b2GearJoint.prototype.m_localAxisD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_localAxisD",
  box2d.b2GearJoint.prototype.m_localAxisD
);
box2d.b2GearJoint.prototype.m_referenceAngleA = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_referenceAngleA",
  box2d.b2GearJoint.prototype.m_referenceAngleA
);
box2d.b2GearJoint.prototype.m_referenceAngleB = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_referenceAngleB",
  box2d.b2GearJoint.prototype.m_referenceAngleB
);
box2d.b2GearJoint.prototype.m_constant = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_constant",
  box2d.b2GearJoint.prototype.m_constant
);
box2d.b2GearJoint.prototype.m_ratio = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_ratio",
  box2d.b2GearJoint.prototype.m_ratio
);
box2d.b2GearJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_impulse",
  box2d.b2GearJoint.prototype.m_impulse
);
box2d.b2GearJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_indexA",
  box2d.b2GearJoint.prototype.m_indexA
);
box2d.b2GearJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_indexB",
  box2d.b2GearJoint.prototype.m_indexB
);
box2d.b2GearJoint.prototype.m_indexC = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_indexC",
  box2d.b2GearJoint.prototype.m_indexC
);
box2d.b2GearJoint.prototype.m_indexD = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_indexD",
  box2d.b2GearJoint.prototype.m_indexD
);
box2d.b2GearJoint.prototype.m_lcA = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lcA",
  box2d.b2GearJoint.prototype.m_lcA
);
box2d.b2GearJoint.prototype.m_lcB = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lcB",
  box2d.b2GearJoint.prototype.m_lcB
);
box2d.b2GearJoint.prototype.m_lcC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lcC",
  box2d.b2GearJoint.prototype.m_lcC
);
box2d.b2GearJoint.prototype.m_lcD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lcD",
  box2d.b2GearJoint.prototype.m_lcD
);
box2d.b2GearJoint.prototype.m_mA = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_mA",
  box2d.b2GearJoint.prototype.m_mA
);
box2d.b2GearJoint.prototype.m_mB = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_mB",
  box2d.b2GearJoint.prototype.m_mB
);
box2d.b2GearJoint.prototype.m_mC = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_mC",
  box2d.b2GearJoint.prototype.m_mC
);
box2d.b2GearJoint.prototype.m_mD = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_mD",
  box2d.b2GearJoint.prototype.m_mD
);
box2d.b2GearJoint.prototype.m_iA = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_iA",
  box2d.b2GearJoint.prototype.m_iA
);
box2d.b2GearJoint.prototype.m_iB = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_iB",
  box2d.b2GearJoint.prototype.m_iB
);
box2d.b2GearJoint.prototype.m_iC = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_iC",
  box2d.b2GearJoint.prototype.m_iC
);
box2d.b2GearJoint.prototype.m_iD = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_iD",
  box2d.b2GearJoint.prototype.m_iD
);
box2d.b2GearJoint.prototype.m_JvAC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JvAC",
  box2d.b2GearJoint.prototype.m_JvAC
);
box2d.b2GearJoint.prototype.m_JvBD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JvBD",
  box2d.b2GearJoint.prototype.m_JvBD
);
box2d.b2GearJoint.prototype.m_JwA = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JwA",
  box2d.b2GearJoint.prototype.m_JwA
);
box2d.b2GearJoint.prototype.m_JwB = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JwB",
  box2d.b2GearJoint.prototype.m_JwB
);
box2d.b2GearJoint.prototype.m_JwC = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JwC",
  box2d.b2GearJoint.prototype.m_JwC
);
box2d.b2GearJoint.prototype.m_JwD = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_JwD",
  box2d.b2GearJoint.prototype.m_JwD
);
box2d.b2GearJoint.prototype.m_mass = 0;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_mass",
  box2d.b2GearJoint.prototype.m_mass
);
box2d.b2GearJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_qA",
  box2d.b2GearJoint.prototype.m_qA
);
box2d.b2GearJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_qB",
  box2d.b2GearJoint.prototype.m_qB
);
box2d.b2GearJoint.prototype.m_qC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_qC",
  box2d.b2GearJoint.prototype.m_qC
);
box2d.b2GearJoint.prototype.m_qD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_qD",
  box2d.b2GearJoint.prototype.m_qD
);
box2d.b2GearJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lalcA",
  box2d.b2GearJoint.prototype.m_lalcA
);
box2d.b2GearJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lalcB",
  box2d.b2GearJoint.prototype.m_lalcB
);
box2d.b2GearJoint.prototype.m_lalcC = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lalcC",
  box2d.b2GearJoint.prototype.m_lalcC
);
box2d.b2GearJoint.prototype.m_lalcD = null;
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "m_lalcD",
  box2d.b2GearJoint.prototype.m_lalcD
);
box2d.b2GearJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_indexC = this.m_bodyC.m_islandIndex;
  this.m_indexD = this.m_bodyD.m_islandIndex;
  this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
  this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
  this.m_mA = this.m_bodyA.m_invMass;
  this.m_mB = this.m_bodyB.m_invMass;
  this.m_mC = this.m_bodyC.m_invMass;
  this.m_mD = this.m_bodyD.m_invMass;
  this.m_iA = this.m_bodyA.m_invI;
  this.m_iB = this.m_bodyB.m_invI;
  this.m_iC = this.m_bodyC.m_invI;
  this.m_iD = this.m_bodyD.m_invI;
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.positions[this.m_indexB].a,
    e = a.velocities[this.m_indexB].v,
    f = a.velocities[this.m_indexB].w,
    g = a.positions[this.m_indexC].a,
    h = a.velocities[this.m_indexC].v,
    k = a.velocities[this.m_indexC].w,
    l = a.positions[this.m_indexD].a,
    m = a.velocities[this.m_indexD].v,
    n = a.velocities[this.m_indexD].w,
    p = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    d = this.m_qB.SetAngle(d),
    q = this.m_qC.SetAngle(g),
    g = this.m_qD.SetAngle(l);
  this.m_mass = 0;
  this.m_typeA === box2d.b2JointType.e_revoluteJoint
    ? (this.m_JvAC.SetZero(),
      (this.m_JwC = this.m_JwA = 1),
      (this.m_mass += this.m_iA + this.m_iC))
    : ((l = box2d.b2Mul_R_V2(
        q,
        this.m_localAxisC,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u
      )),
      box2d.b2Sub_V2_V2(this.m_localAnchorC, this.m_lcC, this.m_lalcC),
      (q = box2d.b2Mul_R_V2(
        q,
        this.m_lalcC,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC
      )),
      box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_lcA, this.m_lalcA),
      (p = box2d.b2Mul_R_V2(
        p,
        this.m_lalcA,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA
      )),
      this.m_JvAC.Copy(l),
      (this.m_JwC = box2d.b2Cross_V2_V2(q, l)),
      (this.m_JwA = box2d.b2Cross_V2_V2(p, l)),
      (this.m_mass +=
        this.m_mC +
        this.m_mA +
        this.m_iC * this.m_JwC * this.m_JwC +
        this.m_iA * this.m_JwA * this.m_JwA));
  this.m_typeB === box2d.b2JointType.e_revoluteJoint
    ? (this.m_JvBD.SetZero(),
      (this.m_JwD = this.m_JwB = this.m_ratio),
      (this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD)))
    : ((l = box2d.b2Mul_R_V2(
        g,
        this.m_localAxisD,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u
      )),
      box2d.b2Sub_V2_V2(this.m_localAnchorD, this.m_lcD, this.m_lalcD),
      (p = box2d.b2Mul_R_V2(
        g,
        this.m_lalcD,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD
      )),
      box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_lcB, this.m_lalcB),
      (d = box2d.b2Mul_R_V2(
        d,
        this.m_lalcB,
        box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB
      )),
      box2d.b2Mul_S_V2(this.m_ratio, l, this.m_JvBD),
      (this.m_JwD = this.m_ratio * box2d.b2Cross_V2_V2(p, l)),
      (this.m_JwB = this.m_ratio * box2d.b2Cross_V2_V2(d, l)),
      (this.m_mass +=
        this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) +
        this.m_iD * this.m_JwD * this.m_JwD +
        this.m_iB * this.m_JwB * this.m_JwB));
  this.m_mass = 0 < this.m_mass ? 1 / this.m_mass : 0;
  a.step.warmStarting
    ? (b.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC),
      (c += this.m_iA * this.m_impulse * this.m_JwA),
      e.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD),
      (f += this.m_iB * this.m_impulse * this.m_JwB),
      h.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC),
      (k -= this.m_iC * this.m_impulse * this.m_JwC),
      m.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD),
      (n -= this.m_iD * this.m_impulse * this.m_JwD))
    : (this.m_impulse = 0);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = f;
  a.velocities[this.m_indexC].w = k;
  a.velocities[this.m_indexD].w = n;
};
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = a.velocities[this.m_indexC].v,
    g = a.velocities[this.m_indexC].w,
    h = a.velocities[this.m_indexD].v,
    k = a.velocities[this.m_indexD].w,
    l =
      box2d.b2Dot_V2_V2(
        this.m_JvAC,
        box2d.b2Sub_V2_V2(b, f, box2d.b2Vec2.s_t0)
      ) +
      box2d.b2Dot_V2_V2(
        this.m_JvBD,
        box2d.b2Sub_V2_V2(d, h, box2d.b2Vec2.s_t0)
      ),
    l =
      l + (this.m_JwA * c - this.m_JwC * g + (this.m_JwB * e - this.m_JwD * k)),
    l = -this.m_mass * l;
  this.m_impulse += l;
  b.SelfMulAdd(this.m_mA * l, this.m_JvAC);
  c += this.m_iA * l * this.m_JwA;
  d.SelfMulAdd(this.m_mB * l, this.m_JvBD);
  e += this.m_iB * l * this.m_JwB;
  f.SelfMulSub(this.m_mC * l, this.m_JvAC);
  g -= this.m_iC * l * this.m_JwC;
  h.SelfMulSub(this.m_mD * l, this.m_JvBD);
  k -= this.m_iD * l * this.m_JwD;
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
  a.velocities[this.m_indexC].w = g;
  a.velocities[this.m_indexD].w = k;
};
box2d.b2GearJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = a.positions[this.m_indexC].c,
    g = a.positions[this.m_indexC].a,
    h = a.positions[this.m_indexD].c,
    k = a.positions[this.m_indexD].a,
    l = this.m_qA.SetAngle(c),
    m = this.m_qB.SetAngle(e),
    n = this.m_qC.SetAngle(g),
    p = this.m_qD.SetAngle(k),
    q = this.m_JvAC,
    r = this.m_JvBD,
    u,
    t,
    w = 0;
  if (this.m_typeA === box2d.b2JointType.e_revoluteJoint)
    q.SetZero(),
      (l = u = 1),
      (w += this.m_iA + this.m_iC),
      (n = c - g - this.m_referenceAngleA);
  else {
    t = box2d.b2Mul_R_V2(
      n,
      this.m_localAxisC,
      box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u
    );
    u = box2d.b2Mul_R_V2(
      n,
      this.m_lalcC,
      box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC
    );
    var x = box2d.b2Mul_R_V2(
      l,
      this.m_lalcA,
      box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA
    );
    q.Copy(t);
    l = box2d.b2Cross_V2_V2(u, t);
    u = box2d.b2Cross_V2_V2(x, t);
    w += this.m_mC + this.m_mA + this.m_iC * l * l + this.m_iA * u * u;
    t = this.m_lalcC;
    n = box2d.b2MulT_R_V2(
      n,
      box2d.b2Add_V2_V2(
        x,
        box2d.b2Sub_V2_V2(b, f, box2d.b2Vec2.s_t0),
        box2d.b2Vec2.s_t0
      ),
      box2d.b2Vec2.s_t0
    );
    n = box2d.b2Dot_V2_V2(
      box2d.b2Sub_V2_V2(n, t, box2d.b2Vec2.s_t0),
      this.m_localAxisC
    );
  }
  if (this.m_typeB === box2d.b2JointType.e_revoluteJoint)
    r.SetZero(),
      (m = t = this.m_ratio),
      (w += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD)),
      (p = e - k - this.m_referenceAngleB);
  else {
    t = box2d.b2Mul_R_V2(
      p,
      this.m_localAxisD,
      box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u
    );
    var v = box2d.b2Mul_R_V2(
        p,
        this.m_lalcD,
        box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD
      ),
      x = box2d.b2Mul_R_V2(
        m,
        this.m_lalcB,
        box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB
      );
    box2d.b2Mul_S_V2(this.m_ratio, t, r);
    m = this.m_ratio * box2d.b2Cross_V2_V2(v, t);
    t = this.m_ratio * box2d.b2Cross_V2_V2(x, t);
    w +=
      this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) +
      this.m_iD * m * m +
      this.m_iB * t * t;
    v = this.m_lalcD;
    p = box2d.b2MulT_R_V2(
      p,
      box2d.b2Add_V2_V2(
        x,
        box2d.b2Sub_V2_V2(d, h, box2d.b2Vec2.s_t0),
        box2d.b2Vec2.s_t0
      ),
      box2d.b2Vec2.s_t0
    );
    p = box2d.b2Dot_V2_V2(
      box2d.b2Sub_V2_V2(p, v, box2d.b2Vec2.s_t0),
      this.m_localAxisD
    );
  }
  p = n + this.m_ratio * p - this.m_constant;
  n = 0;
  0 < w && (n = -p / w);
  b.SelfMulAdd(this.m_mA * n, q);
  c += this.m_iA * n * u;
  d.SelfMulAdd(this.m_mB * n, r);
  e += this.m_iB * n * t;
  f.SelfMulSub(this.m_mC * n, q);
  g -= this.m_iC * n * l;
  h.SelfMulSub(this.m_mD * n, r);
  k -= this.m_iD * n * m;
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  a.positions[this.m_indexC].a = g;
  a.positions[this.m_indexD].a = k;
  return 0 < box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2GearJoint.prototype.SolvePositionConstraints
);
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD = new box2d.b2Vec2();
box2d.b2GearJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetAnchorA",
  box2d.b2GearJoint.prototype.GetAnchorA
);
box2d.b2GearJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetAnchorB",
  box2d.b2GearJoint.prototype.GetAnchorB
);
box2d.b2GearJoint.prototype.GetReactionForce = function (a, b) {
  return box2d.b2Mul_S_V2(a * this.m_impulse, this.m_JvAC, b);
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetReactionForce",
  box2d.b2GearJoint.prototype.GetReactionForce
);
box2d.b2GearJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_impulse * this.m_JwA;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetReactionTorque",
  box2d.b2GearJoint.prototype.GetReactionTorque
);
box2d.b2GearJoint.prototype.GetJoint1 = function () {
  return this.m_joint1;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetJoint1",
  box2d.b2GearJoint.prototype.GetJoint1
);
box2d.b2GearJoint.prototype.GetJoint2 = function () {
  return this.m_joint2;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetJoint2",
  box2d.b2GearJoint.prototype.GetJoint2
);
box2d.b2GearJoint.prototype.GetRatio = function () {
  return this.m_ratio;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "GetRatio",
  box2d.b2GearJoint.prototype.GetRatio
);
box2d.b2GearJoint.prototype.SetRatio = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a));
  this.m_ratio = a;
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "SetRatio",
  box2d.b2GearJoint.prototype.SetRatio
);
box2d.b2GearJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex,
      c = this.m_joint1.m_index,
      d = this.m_joint2.m_index;
    box2d.b2Log(
      "  /*box2d.b2GearJointDef*/ var jd = new box2d.b2GearJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log("  jd.joint1 = joints[%d];\n", c);
    box2d.b2Log("  jd.joint2 = joints[%d];\n", d);
    box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2GearJoint.prototype,
  "Dump",
  box2d.b2GearJoint.prototype.Dump
);
box2d.b2RopeJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_ropeJoint);
  this.localAnchorA = new box2d.b2Vec2(-1, 0);
  this.localAnchorB = new box2d.b2Vec2(1, 0);
};
goog.inherits(box2d.b2RopeJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RopeJointDef", box2d.b2RopeJointDef);
box2d.b2RopeJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2RopeJointDef.prototype,
  "localAnchorA",
  box2d.b2RopeJointDef.prototype.localAnchorA
);
box2d.b2RopeJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2RopeJointDef.prototype,
  "localAnchorB",
  box2d.b2RopeJointDef.prototype.localAnchorB
);
box2d.b2RopeJointDef.prototype.maxLength = 0;
goog.exportProperty(
  box2d.b2RopeJointDef.prototype,
  "maxLength",
  box2d.b2RopeJointDef.prototype.maxLength
);
box2d.b2RopeJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_maxLength = a.maxLength;
  this.m_u = new box2d.b2Vec2();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
};
goog.inherits(box2d.b2RopeJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RopeJoint", box2d.b2RopeJoint);
box2d.b2RopeJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_localAnchorA",
  box2d.b2RopeJoint.prototype.m_localAnchorA
);
box2d.b2RopeJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_localAnchorB",
  box2d.b2RopeJoint.prototype.m_localAnchorB
);
box2d.b2RopeJoint.prototype.m_maxLength = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_maxLength",
  box2d.b2RopeJoint.prototype.m_maxLength
);
box2d.b2RopeJoint.prototype.m_length = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_length",
  box2d.b2RopeJoint.prototype.m_length
);
box2d.b2RopeJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_impulse",
  box2d.b2RopeJoint.prototype.m_impulse
);
box2d.b2RopeJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_indexA",
  box2d.b2RopeJoint.prototype.m_indexA
);
box2d.b2RopeJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_indexB",
  box2d.b2RopeJoint.prototype.m_indexB
);
box2d.b2RopeJoint.prototype.m_u = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_u",
  box2d.b2RopeJoint.prototype.m_u
);
box2d.b2RopeJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_rA",
  box2d.b2RopeJoint.prototype.m_rA
);
box2d.b2RopeJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_rB",
  box2d.b2RopeJoint.prototype.m_rB
);
box2d.b2RopeJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_localCenterA",
  box2d.b2RopeJoint.prototype.m_localCenterA
);
box2d.b2RopeJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_localCenterB",
  box2d.b2RopeJoint.prototype.m_localCenterB
);
box2d.b2RopeJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_invMassA",
  box2d.b2RopeJoint.prototype.m_invMassA
);
box2d.b2RopeJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_invMassB",
  box2d.b2RopeJoint.prototype.m_invMassB
);
box2d.b2RopeJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_invIA",
  box2d.b2RopeJoint.prototype.m_invIA
);
box2d.b2RopeJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_invIB",
  box2d.b2RopeJoint.prototype.m_invIB
);
box2d.b2RopeJoint.prototype.m_mass = 0;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_mass",
  box2d.b2RopeJoint.prototype.m_mass
);
box2d.b2RopeJoint.prototype.m_state = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_state",
  box2d.b2RopeJoint.prototype.m_state
);
box2d.b2RopeJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_qA",
  box2d.b2RopeJoint.prototype.m_qA
);
box2d.b2RopeJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_qB",
  box2d.b2RopeJoint.prototype.m_qB
);
box2d.b2RopeJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_lalcA",
  box2d.b2RopeJoint.prototype.m_lalcA
);
box2d.b2RopeJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "m_lalcB",
  box2d.b2RopeJoint.prototype.m_lalcB
);
box2d.b2RopeJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].c,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].c,
    f = a.positions[this.m_indexB].a,
    g = a.velocities[this.m_indexB].v,
    h = a.velocities[this.m_indexB].w,
    k = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    f = this.m_qB.SetAngle(f);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2Mul_R_V2(k, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(f, this.m_lalcB, this.m_rB);
  this.m_u.Copy(e).SelfAdd(this.m_rB).SelfSub(b).SelfSub(this.m_rA);
  this.m_length = this.m_u.Length();
  this.m_state =
    0 < this.m_length - this.m_maxLength
      ? box2d.b2LimitState.e_atUpperLimit
      : box2d.b2LimitState.e_inactiveLimit;
  this.m_length > box2d.b2_linearSlop
    ? (this.m_u.SelfMul(1 / this.m_length),
      (b = box2d.b2Cross_V2_V2(this.m_rA, this.m_u)),
      (e = box2d.b2Cross_V2_V2(this.m_rB, this.m_u)),
      (b =
        this.m_invMassA +
        this.m_invIA * b * b +
        this.m_invMassB +
        this.m_invIB * e * e),
      (this.m_mass = 0 !== b ? 1 / b : 0),
      a.step.warmStarting
        ? ((this.m_impulse *= a.step.dtRatio),
          (b = box2d.b2Mul_S_V2(
            this.m_impulse,
            this.m_u,
            box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P
          )),
          c.SelfMulSub(this.m_invMassA, b),
          (d -= this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, b)),
          g.SelfMulAdd(this.m_invMassB, b),
          (h += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, b)))
        : (this.m_impulse = 0),
      (a.velocities[this.m_indexA].w = d),
      (a.velocities[this.m_indexB].w = h))
    : (this.m_u.SetZero(), (this.m_impulse = this.m_mass = 0));
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2RopeJoint.prototype.InitVelocityConstraints
);
box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2RopeJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = box2d.b2AddCross_V2_S_V2(
      b,
      c,
      this.m_rA,
      box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA
    ),
    g = box2d.b2AddCross_V2_S_V2(
      d,
      e,
      this.m_rB,
      box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB
    ),
    h = this.m_length - this.m_maxLength,
    f = box2d.b2Dot_V2_V2(this.m_u, box2d.b2Sub_V2_V2(g, f, box2d.b2Vec2.s_t0));
  0 > h && (f += a.step.inv_dt * h);
  h = -this.m_mass * f;
  f = this.m_impulse;
  this.m_impulse = box2d.b2Min(0, this.m_impulse + h);
  h = this.m_impulse - f;
  h = box2d.b2Mul_S_V2(
    h,
    this.m_u,
    box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P
  );
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2Cross_V2_V2(this.m_rA, h);
  d.SelfMulAdd(this.m_invMassB, h);
  e += this.m_invIB * box2d.b2Cross_V2_V2(this.m_rB, h);
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2RopeJoint.prototype.SolveVelocityConstraints
);
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2();
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2();
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2RopeJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  f = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    h = this.m_u.Copy(d).SelfAdd(g).SelfSub(b).SelfSub(f),
    k = h.Normalize(),
    l = k - this.m_maxLength,
    l = box2d.b2Clamp(l, 0, box2d.b2_maxLinearCorrection),
    h = box2d.b2Mul_S_V2(
      -this.m_mass * l,
      h,
      box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P
    );
  b.SelfMulSub(this.m_invMassA, h);
  c -= this.m_invIA * box2d.b2Cross_V2_V2(f, h);
  d.SelfMulAdd(this.m_invMassB, h);
  e += this.m_invIB * box2d.b2Cross_V2_V2(g, h);
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return k - this.m_maxLength < box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2RopeJoint.prototype.SolvePositionConstraints
);
box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2RopeJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetAnchorA",
  box2d.b2RopeJoint.prototype.GetAnchorA
);
box2d.b2RopeJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetAnchorB",
  box2d.b2RopeJoint.prototype.GetAnchorB
);
box2d.b2RopeJoint.prototype.GetReactionForce = function (a, b) {
  return box2d.b2Mul_S_V2(a * this.m_impulse, this.m_u, b);
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetReactionForce",
  box2d.b2RopeJoint.prototype.GetReactionForce
);
box2d.b2RopeJoint.prototype.GetReactionTorque = function (a) {
  return 0;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetReactionTorque",
  box2d.b2RopeJoint.prototype.GetReactionTorque
);
box2d.b2RopeJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2RopeJoint.prototype.GetLocalAnchorA
);
box2d.b2RopeJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2RopeJoint.prototype.GetLocalAnchorB
);
box2d.b2RopeJoint.prototype.SetMaxLength = function (a) {
  this.m_maxLength = a;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "SetMaxLength",
  box2d.b2RopeJoint.prototype.SetMaxLength
);
box2d.b2RopeJoint.prototype.GetMaxLength = function () {
  return this.m_maxLength;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetMaxLength",
  box2d.b2RopeJoint.prototype.GetMaxLength
);
box2d.b2RopeJoint.prototype.GetLimitState = function () {
  return this.m_state;
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "GetLimitState",
  box2d.b2RopeJoint.prototype.GetLimitState
);
box2d.b2RopeJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2RopeJointDef*/ var jd = new box2d.b2RopeJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.maxLength = %.15f;\n", this.m_maxLength);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2RopeJoint.prototype,
  "Dump",
  box2d.b2RopeJoint.prototype.Dump
);
box2d.b2WeldJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_weldJoint);
  this.localAnchorA = new box2d.b2Vec2();
  this.localAnchorB = new box2d.b2Vec2();
};
goog.inherits(box2d.b2WeldJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WeldJointDef", box2d.b2WeldJointDef);
box2d.b2WeldJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "localAnchorA",
  box2d.b2WeldJointDef.prototype.localAnchorA
);
box2d.b2WeldJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "localAnchorB",
  box2d.b2WeldJointDef.prototype.localAnchorB
);
box2d.b2WeldJointDef.prototype.referenceAngle = 0;
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "referenceAngle",
  box2d.b2WeldJointDef.prototype.referenceAngle
);
box2d.b2WeldJointDef.prototype.frequencyHz = 0;
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "frequencyHz",
  box2d.b2WeldJointDef.prototype.frequencyHz
);
box2d.b2WeldJointDef.prototype.dampingRatio = 0;
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "dampingRatio",
  box2d.b2WeldJointDef.prototype.dampingRatio
);
box2d.b2WeldJointDef.prototype.Initialize = function (a, b, c) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
goog.exportProperty(
  box2d.b2WeldJointDef.prototype,
  "Initialize",
  box2d.b2WeldJointDef.prototype.Initialize
);
box2d.b2WeldJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_referenceAngle = a.referenceAngle;
  this.m_impulse = new box2d.b2Vec3(0, 0, 0);
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_mass = new box2d.b2Mat33();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_K = new box2d.b2Mat33();
};
goog.inherits(box2d.b2WeldJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WeldJoint", box2d.b2WeldJoint);
box2d.b2WeldJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_frequencyHz",
  box2d.b2WeldJoint.prototype.m_frequencyHz
);
box2d.b2WeldJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_dampingRatio",
  box2d.b2WeldJoint.prototype.m_dampingRatio
);
box2d.b2WeldJoint.prototype.m_bias = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_bias",
  box2d.b2WeldJoint.prototype.m_bias
);
box2d.b2WeldJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_localAnchorA",
  box2d.b2WeldJoint.prototype.m_localAnchorA
);
box2d.b2WeldJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_localAnchorB",
  box2d.b2WeldJoint.prototype.m_localAnchorB
);
box2d.b2WeldJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_referenceAngle",
  box2d.b2WeldJoint.prototype.m_referenceAngle
);
box2d.b2WeldJoint.prototype.m_gamma = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_gamma",
  box2d.b2WeldJoint.prototype.m_gamma
);
box2d.b2WeldJoint.prototype.m_impulse = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_impulse",
  box2d.b2WeldJoint.prototype.m_impulse
);
box2d.b2WeldJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_indexA",
  box2d.b2WeldJoint.prototype.m_indexA
);
box2d.b2WeldJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_indexB",
  box2d.b2WeldJoint.prototype.m_indexB
);
box2d.b2WeldJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_rA",
  box2d.b2WeldJoint.prototype.m_rA
);
box2d.b2WeldJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_rB",
  box2d.b2WeldJoint.prototype.m_rB
);
box2d.b2WeldJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_localCenterA",
  box2d.b2WeldJoint.prototype.m_localCenterA
);
box2d.b2WeldJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_localCenterB",
  box2d.b2WeldJoint.prototype.m_localCenterB
);
box2d.b2WeldJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_invMassA",
  box2d.b2WeldJoint.prototype.m_invMassA
);
box2d.b2WeldJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_invMassB",
  box2d.b2WeldJoint.prototype.m_invMassB
);
box2d.b2WeldJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_invIA",
  box2d.b2WeldJoint.prototype.m_invIA
);
box2d.b2WeldJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_invIB",
  box2d.b2WeldJoint.prototype.m_invIB
);
box2d.b2WeldJoint.prototype.m_mass = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_mass",
  box2d.b2WeldJoint.prototype.m_mass
);
box2d.b2WeldJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_qA",
  box2d.b2WeldJoint.prototype.m_qA
);
box2d.b2WeldJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_qB",
  box2d.b2WeldJoint.prototype.m_qB
);
box2d.b2WeldJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_lalcA",
  box2d.b2WeldJoint.prototype.m_lalcA
);
box2d.b2WeldJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_lalcB",
  box2d.b2WeldJoint.prototype.m_lalcB
);
box2d.b2WeldJoint.prototype.m_K = null;
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "m_K",
  box2d.b2WeldJoint.prototype.m_K
);
box2d.b2WeldJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = a.positions[this.m_indexA].a,
    c = a.velocities[this.m_indexA].v,
    d = a.velocities[this.m_indexA].w,
    e = a.positions[this.m_indexB].a,
    f = a.velocities[this.m_indexB].v,
    g = a.velocities[this.m_indexB].w,
    h = this.m_qA.SetAngle(b),
    k = this.m_qB.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  box2d.b2Mul_R_V2(h, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  box2d.b2Mul_R_V2(k, this.m_lalcB, this.m_rB);
  var h = this.m_invMassA,
    k = this.m_invMassB,
    l = this.m_invIA,
    m = this.m_invIB,
    n = this.m_K;
  n.ex.x =
    h + k + this.m_rA.y * this.m_rA.y * l + this.m_rB.y * this.m_rB.y * m;
  n.ey.x = -this.m_rA.y * this.m_rA.x * l - this.m_rB.y * this.m_rB.x * m;
  n.ez.x = -this.m_rA.y * l - this.m_rB.y * m;
  n.ex.y = n.ey.x;
  n.ey.y =
    h + k + this.m_rA.x * this.m_rA.x * l + this.m_rB.x * this.m_rB.x * m;
  n.ez.y = this.m_rA.x * l + this.m_rB.x * m;
  n.ex.z = n.ez.x;
  n.ey.z = n.ez.y;
  n.ez.z = l + m;
  if (0 < this.m_frequencyHz) {
    n.GetInverse22(this.m_mass);
    var n = l + m,
      p = 0 < n ? 1 / n : 0,
      b = e - b - this.m_referenceAngle,
      e = 2 * box2d.b2_pi * this.m_frequencyHz,
      q = p * e * e,
      r = a.step.dt;
    this.m_gamma = r * (2 * p * this.m_dampingRatio * e + r * q);
    this.m_gamma = 0 !== this.m_gamma ? 1 / this.m_gamma : 0;
    this.m_bias = b * r * q * this.m_gamma;
    n += this.m_gamma;
    this.m_mass.ez.z = 0 !== n ? 1 / n : 0;
  } else
    0 === n.ez.z ? n.GetInverse22(this.m_mass) : n.GetSymInverse33(this.m_mass),
      (this.m_bias = this.m_gamma = 0);
  a.step.warmStarting
    ? (this.m_impulse.SelfMulScalar(a.step.dtRatio),
      (n = box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P.Set(
        this.m_impulse.x,
        this.m_impulse.y
      )),
      c.SelfMulSub(h, n),
      (d -= l * (box2d.b2Cross_V2_V2(this.m_rA, n) + this.m_impulse.z)),
      f.SelfMulAdd(k, n),
      (g += m * (box2d.b2Cross_V2_V2(this.m_rB, n) + this.m_impulse.z)))
    : this.m_impulse.SetZero();
  a.velocities[this.m_indexA].w = d;
  a.velocities[this.m_indexB].w = g;
};
box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = a.velocities[this.m_indexA].v,
    c = a.velocities[this.m_indexA].w,
    d = a.velocities[this.m_indexB].v,
    e = a.velocities[this.m_indexB].w,
    f = this.m_invMassA,
    g = this.m_invMassB,
    h = this.m_invIA,
    k = this.m_invIB;
  if (0 < this.m_frequencyHz) {
    var l =
      -this.m_mass.ez.z *
      (e - c + this.m_bias + this.m_gamma * this.m_impulse.z);
    this.m_impulse.z += l;
    c -= h * l;
    e += k * l;
    l = box2d.b2Sub_V2_V2(
      box2d.b2AddCross_V2_S_V2(d, e, this.m_rB, box2d.b2Vec2.s_t0),
      box2d.b2AddCross_V2_S_V2(b, c, this.m_rA, box2d.b2Vec2.s_t1),
      box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1
    );
    l = box2d
      .b2Mul_M33_X_Y(
        this.m_mass,
        l.x,
        l.y,
        box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1
      )
      .SelfNeg();
    this.m_impulse.x += l.x;
    this.m_impulse.y += l.y;
    b.SelfMulSub(f, l);
    c -= h * box2d.b2Cross_V2_V2(this.m_rA, l);
    d.SelfMulAdd(g, l);
    e += k * box2d.b2Cross_V2_V2(this.m_rB, l);
  } else {
    var l = box2d.b2Sub_V2_V2(
        box2d.b2AddCross_V2_S_V2(d, e, this.m_rB, box2d.b2Vec2.s_t0),
        box2d.b2AddCross_V2_S_V2(b, c, this.m_rA, box2d.b2Vec2.s_t1),
        box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1
      ),
      m = box2d
        .b2Mul_M33_X_Y_Z(
          this.m_mass,
          l.x,
          l.y,
          e - c,
          box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse
        )
        .SelfNeg();
    this.m_impulse.SelfAdd(m);
    l = box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P.Set(m.x, m.y);
    b.SelfMulSub(f, l);
    c -= h * (box2d.b2Cross_V2_V2(this.m_rA, l) + m.z);
    d.SelfMulAdd(g, l);
    e += k * (box2d.b2Cross_V2_V2(this.m_rB, l) + m.z);
  }
  a.velocities[this.m_indexA].w = c;
  a.velocities[this.m_indexB].w = e;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2WeldJoint.prototype.SolveVelocityConstraints
);
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1 = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec3();
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e),
    h = this.m_invMassA,
    k = this.m_invMassB,
    l = this.m_invIA,
    m = this.m_invIB;
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var n = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var p = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    q = this.m_K;
  q.ex.x = h + k + n.y * n.y * l + p.y * p.y * m;
  q.ey.x = -n.y * n.x * l - p.y * p.x * m;
  q.ez.x = -n.y * l - p.y * m;
  q.ex.y = q.ey.x;
  q.ey.y = h + k + n.x * n.x * l + p.x * p.x * m;
  q.ez.y = n.x * l + p.x * m;
  q.ex.z = q.ez.x;
  q.ey.z = q.ez.y;
  q.ez.z = l + m;
  if (0 < this.m_frequencyHz) {
    var r = box2d.b2Sub_V2_V2(
        box2d.b2Add_V2_V2(d, p, box2d.b2Vec2.s_t0),
        box2d.b2Add_V2_V2(b, n, box2d.b2Vec2.s_t1),
        box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1
      ),
      g = r.Length(),
      f = 0,
      q = q
        .Solve22(
          r.x,
          r.y,
          box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P
        )
        .SelfNeg();
    b.SelfMulSub(h, q);
    c -= l * box2d.b2Cross_V2_V2(n, q);
    d.SelfMulAdd(k, q);
    e += m * box2d.b2Cross_V2_V2(p, q);
  } else
    (r = box2d.b2Sub_V2_V2(
      box2d.b2Add_V2_V2(d, p, box2d.b2Vec2.s_t0),
      box2d.b2Add_V2_V2(b, n, box2d.b2Vec2.s_t1),
      box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1
    )),
      (p = e - c - this.m_referenceAngle),
      (g = r.Length()),
      (f = box2d.b2Abs(p)),
      (n = box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse),
      0 < q.ez.z
        ? q.Solve33(r.x, r.y, p, n).SelfNeg()
        : ((q = q
            .Solve22(
              r.x,
              r.y,
              box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse2
            )
            .SelfNeg()),
          (n.x = q.x),
          (n.y = q.y),
          (n.z = 0)),
      (q = box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P.Set(
        n.x,
        n.y
      )),
      b.SelfMulSub(h, q),
      (c -= l * (box2d.b2Cross_V2_V2(this.m_rA, q) + n.z)),
      d.SelfMulAdd(k, q),
      (e += m * (box2d.b2Cross_V2_V2(this.m_rB, q) + n.z));
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return g <= box2d.b2_linearSlop && f <= box2d.b2_angularSlop;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2WeldJoint.prototype.SolvePositionConstraints
);
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1 = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3();
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse2 = new box2d.b2Vec2();
box2d.b2WeldJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetAnchorA",
  box2d.b2WeldJoint.prototype.GetAnchorA
);
box2d.b2WeldJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetAnchorB",
  box2d.b2WeldJoint.prototype.GetAnchorB
);
box2d.b2WeldJoint.prototype.GetReactionForce = function (a, b) {
  return b.Set(a * this.m_impulse.x, a * this.m_impulse.y);
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetReactionForce",
  box2d.b2WeldJoint.prototype.GetReactionForce
);
box2d.b2WeldJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_impulse.z;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetReactionTorque",
  box2d.b2WeldJoint.prototype.GetReactionTorque
);
box2d.b2WeldJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2WeldJoint.prototype.GetLocalAnchorA
);
box2d.b2WeldJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2WeldJoint.prototype.GetLocalAnchorB
);
box2d.b2WeldJoint.prototype.GetReferenceAngle = function () {
  return this.m_referenceAngle;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetReferenceAngle",
  box2d.b2WeldJoint.prototype.GetReferenceAngle
);
box2d.b2WeldJoint.prototype.SetFrequency = function (a) {
  this.m_frequencyHz = a;
};
box2d.b2WeldJoint.prototype.GetFrequency = function () {
  return this.m_frequencyHz;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetFrequency",
  box2d.b2WeldJoint.prototype.GetFrequency
);
box2d.b2WeldJoint.prototype.SetDampingRatio = function (a) {
  this.m_dampingRatio = a;
};
box2d.b2WeldJoint.prototype.GetDampingRatio = function () {
  return this.m_dampingRatio;
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "GetDampingRatio",
  box2d.b2WeldJoint.prototype.GetDampingRatio
);
box2d.b2WeldJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2WeldJointDef*/ var jd = new box2d.b2WeldJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2WeldJoint.prototype,
  "Dump",
  box2d.b2WeldJoint.prototype.Dump
);
box2d.b2WheelJointDef = function () {
  box2d.b2JointDef.call(this, box2d.b2JointType.e_wheelJoint);
  this.localAnchorA = new box2d.b2Vec2(0, 0);
  this.localAnchorB = new box2d.b2Vec2(0, 0);
  this.localAxisA = new box2d.b2Vec2(1, 0);
};
goog.inherits(box2d.b2WheelJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WheelJointDef", box2d.b2WheelJointDef);
box2d.b2WheelJointDef.prototype.localAnchorA = null;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "localAnchorA",
  box2d.b2WheelJointDef.prototype.localAnchorA
);
box2d.b2WheelJointDef.prototype.localAnchorB = null;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "localAnchorB",
  box2d.b2WheelJointDef.prototype.localAnchorB
);
box2d.b2WheelJointDef.prototype.localAxisA = null;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "localAxisA",
  box2d.b2WheelJointDef.prototype.localAxisA
);
box2d.b2WheelJointDef.prototype.enableMotor = !1;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "enableMotor",
  box2d.b2WheelJointDef.prototype.enableMotor
);
box2d.b2WheelJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "maxMotorTorque",
  box2d.b2WheelJointDef.prototype.maxMotorTorque
);
box2d.b2WheelJointDef.prototype.motorSpeed = 0;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "motorSpeed",
  box2d.b2WheelJointDef.prototype.motorSpeed
);
box2d.b2WheelJointDef.prototype.frequencyHz = 2;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "frequencyHz",
  box2d.b2WheelJointDef.prototype.frequencyHz
);
box2d.b2WheelJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "dampingRatio",
  box2d.b2WheelJointDef.prototype.dampingRatio
);
box2d.b2WheelJointDef.prototype.Initialize = function (a, b, c, d) {
  this.bodyA = a;
  this.bodyB = b;
  this.bodyA.GetLocalPoint(c, this.localAnchorA);
  this.bodyB.GetLocalPoint(c, this.localAnchorB);
  this.bodyA.GetLocalVector(d, this.localAxisA);
};
goog.exportProperty(
  box2d.b2WheelJointDef.prototype,
  "Initialize",
  box2d.b2WheelJointDef.prototype.Initialize
);
box2d.b2WheelJoint = function (a) {
  box2d.b2Joint.call(this, a);
  this.m_frequencyHz = a.frequencyHz;
  this.m_dampingRatio = a.dampingRatio;
  this.m_localAnchorA = a.localAnchorA.Clone();
  this.m_localAnchorB = a.localAnchorB.Clone();
  this.m_localXAxisA = a.localAxisA.Clone();
  this.m_localYAxisA = box2d.b2Cross_S_V2(
    1,
    this.m_localXAxisA,
    new box2d.b2Vec2()
  );
  this.m_maxMotorTorque = a.maxMotorTorque;
  this.m_motorSpeed = a.motorSpeed;
  this.m_enableMotor = a.enableMotor;
  this.m_localCenterA = new box2d.b2Vec2();
  this.m_localCenterB = new box2d.b2Vec2();
  this.m_ax = new box2d.b2Vec2();
  this.m_ay = new box2d.b2Vec2();
  this.m_qA = new box2d.b2Rot();
  this.m_qB = new box2d.b2Rot();
  this.m_lalcA = new box2d.b2Vec2();
  this.m_lalcB = new box2d.b2Vec2();
  this.m_rA = new box2d.b2Vec2();
  this.m_rB = new box2d.b2Vec2();
  this.m_ax.SetZero();
  this.m_ay.SetZero();
};
goog.inherits(box2d.b2WheelJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WheelJoint", box2d.b2WheelJoint);
box2d.b2WheelJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_frequencyHz",
  box2d.b2WheelJoint.prototype.m_frequencyHz
);
box2d.b2WheelJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_dampingRatio",
  box2d.b2WheelJoint.prototype.m_dampingRatio
);
box2d.b2WheelJoint.prototype.m_localAnchorA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localAnchorA",
  box2d.b2WheelJoint.prototype.m_localAnchorA
);
box2d.b2WheelJoint.prototype.m_localAnchorB = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localAnchorB",
  box2d.b2WheelJoint.prototype.m_localAnchorB
);
box2d.b2WheelJoint.prototype.m_localXAxisA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localXAxisA",
  box2d.b2WheelJoint.prototype.m_localXAxisA
);
box2d.b2WheelJoint.prototype.m_localYAxisA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localYAxisA",
  box2d.b2WheelJoint.prototype.m_localYAxisA
);
box2d.b2WheelJoint.prototype.m_impulse = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_impulse",
  box2d.b2WheelJoint.prototype.m_impulse
);
box2d.b2WheelJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_motorImpulse",
  box2d.b2WheelJoint.prototype.m_motorImpulse
);
box2d.b2WheelJoint.prototype.m_springImpulse = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_springImpulse",
  box2d.b2WheelJoint.prototype.m_springImpulse
);
box2d.b2WheelJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_maxMotorTorque",
  box2d.b2WheelJoint.prototype.m_maxMotorTorque
);
box2d.b2WheelJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_motorSpeed",
  box2d.b2WheelJoint.prototype.m_motorSpeed
);
box2d.b2WheelJoint.prototype.m_enableMotor = !1;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_enableMotor",
  box2d.b2WheelJoint.prototype.m_enableMotor
);
box2d.b2WheelJoint.prototype.m_indexA = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_indexA",
  box2d.b2WheelJoint.prototype.m_indexA
);
box2d.b2WheelJoint.prototype.m_indexB = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_indexB",
  box2d.b2WheelJoint.prototype.m_indexB
);
box2d.b2WheelJoint.prototype.m_localCenterA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localCenterA",
  box2d.b2WheelJoint.prototype.m_localCenterA
);
box2d.b2WheelJoint.prototype.m_localCenterB = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_localCenterB",
  box2d.b2WheelJoint.prototype.m_localCenterB
);
box2d.b2WheelJoint.prototype.m_invMassA = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_invMassA",
  box2d.b2WheelJoint.prototype.m_invMassA
);
box2d.b2WheelJoint.prototype.m_invMassB = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_invMassB",
  box2d.b2WheelJoint.prototype.m_invMassB
);
box2d.b2WheelJoint.prototype.m_invIA = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_invIA",
  box2d.b2WheelJoint.prototype.m_invIA
);
box2d.b2WheelJoint.prototype.m_invIB = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_invIB",
  box2d.b2WheelJoint.prototype.m_invIB
);
box2d.b2WheelJoint.prototype.m_ax = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_ax",
  box2d.b2WheelJoint.prototype.m_ax
);
box2d.b2WheelJoint.prototype.m_ay = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_ay",
  box2d.b2WheelJoint.prototype.m_ay
);
box2d.b2WheelJoint.prototype.m_sAx = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_sAx",
  box2d.b2WheelJoint.prototype.m_sAx
);
box2d.b2WheelJoint.prototype.m_sBx = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_sBx",
  box2d.b2WheelJoint.prototype.m_sBx
);
box2d.b2WheelJoint.prototype.m_sAy = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_sAy",
  box2d.b2WheelJoint.prototype.m_sAy
);
box2d.b2WheelJoint.prototype.m_sBy = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_sBy",
  box2d.b2WheelJoint.prototype.m_sBy
);
box2d.b2WheelJoint.prototype.m_mass = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_mass",
  box2d.b2WheelJoint.prototype.m_mass
);
box2d.b2WheelJoint.prototype.m_motorMass = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_motorMass",
  box2d.b2WheelJoint.prototype.m_motorMass
);
box2d.b2WheelJoint.prototype.m_springMass = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_springMass",
  box2d.b2WheelJoint.prototype.m_springMass
);
box2d.b2WheelJoint.prototype.m_bias = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_bias",
  box2d.b2WheelJoint.prototype.m_bias
);
box2d.b2WheelJoint.prototype.m_gamma = 0;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_gamma",
  box2d.b2WheelJoint.prototype.m_gamma
);
box2d.b2WheelJoint.prototype.m_qA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_qA",
  box2d.b2WheelJoint.prototype.m_qA
);
box2d.b2WheelJoint.prototype.m_qB = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_qB",
  box2d.b2WheelJoint.prototype.m_qB
);
box2d.b2WheelJoint.prototype.m_lalcA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_lalcA",
  box2d.b2WheelJoint.prototype.m_lalcA
);
box2d.b2WheelJoint.prototype.m_lalcB = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_lalcB",
  box2d.b2WheelJoint.prototype.m_lalcB
);
box2d.b2WheelJoint.prototype.m_rA = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_rA",
  box2d.b2WheelJoint.prototype.m_rA
);
box2d.b2WheelJoint.prototype.m_rB = null;
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "m_rB",
  box2d.b2WheelJoint.prototype.m_rB
);
box2d.b2WheelJoint.prototype.GetMotorSpeed = function () {
  return this.m_motorSpeed;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetMotorSpeed",
  box2d.b2WheelJoint.prototype.GetMotorSpeed
);
box2d.b2WheelJoint.prototype.GetMaxMotorTorque = function () {
  return this.m_maxMotorTorque;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetMaxMotorTorque",
  box2d.b2WheelJoint.prototype.GetMaxMotorTorque
);
box2d.b2WheelJoint.prototype.SetSpringFrequencyHz = function (a) {
  this.m_frequencyHz = a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SetSpringFrequencyHz",
  box2d.b2WheelJoint.prototype.SetSpringFrequencyHz
);
box2d.b2WheelJoint.prototype.GetSpringFrequencyHz = function () {
  return this.m_frequencyHz;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetSpringFrequencyHz",
  box2d.b2WheelJoint.prototype.GetSpringFrequencyHz
);
box2d.b2WheelJoint.prototype.SetSpringDampingRatio = function (a) {
  this.m_dampingRatio = a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SetSpringDampingRatio",
  box2d.b2WheelJoint.prototype.SetSpringDampingRatio
);
box2d.b2WheelJoint.prototype.GetSpringDampingRatio = function () {
  return this.m_dampingRatio;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetSpringDampingRatio",
  box2d.b2WheelJoint.prototype.GetSpringDampingRatio
);
box2d.b2WheelJoint.prototype.InitVelocityConstraints = function (a) {
  this.m_indexA = this.m_bodyA.m_islandIndex;
  this.m_indexB = this.m_bodyB.m_islandIndex;
  this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
  this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;
  var b = this.m_invMassA,
    c = this.m_invMassB,
    d = this.m_invIA,
    e = this.m_invIB,
    f = a.positions[this.m_indexA].c,
    g = a.velocities[this.m_indexA].v,
    h = a.velocities[this.m_indexA].w,
    k = a.positions[this.m_indexB].c,
    l = a.positions[this.m_indexB].a,
    m = a.velocities[this.m_indexB].v,
    n = a.velocities[this.m_indexB].w,
    p = this.m_qA.SetAngle(a.positions[this.m_indexA].a),
    q = this.m_qB.SetAngle(l);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  l = box2d.b2Mul_R_V2(p, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  q = box2d.b2Mul_R_V2(q, this.m_lalcB, this.m_rB);
  f = box2d.b2Sub_V2_V2(
    box2d.b2Add_V2_V2(k, q, box2d.b2Vec2.s_t0),
    box2d.b2Add_V2_V2(f, l, box2d.b2Vec2.s_t1),
    box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d
  );
  box2d.b2Mul_R_V2(p, this.m_localYAxisA, this.m_ay);
  this.m_sAy = box2d.b2Cross_V2_V2(
    box2d.b2Add_V2_V2(f, l, box2d.b2Vec2.s_t0),
    this.m_ay
  );
  this.m_sBy = box2d.b2Cross_V2_V2(q, this.m_ay);
  this.m_mass =
    b + c + d * this.m_sAy * this.m_sAy + e * this.m_sBy * this.m_sBy;
  0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
  this.m_gamma = this.m_bias = this.m_springMass = 0;
  0 < this.m_frequencyHz
    ? (box2d.b2Mul_R_V2(p, this.m_localXAxisA, this.m_ax),
      (this.m_sAx = box2d.b2Cross_V2_V2(
        box2d.b2Add_V2_V2(f, l, box2d.b2Vec2.s_t0),
        this.m_ax
      )),
      (this.m_sBx = box2d.b2Cross_V2_V2(q, this.m_ax)),
      (b = b + c + d * this.m_sAx * this.m_sAx + e * this.m_sBx * this.m_sBx),
      0 < b &&
        ((this.m_springMass = 1 / b),
        (c = box2d.b2Dot_V2_V2(f, this.m_ax)),
        (p = 2 * box2d.b2_pi * this.m_frequencyHz),
        (f = this.m_springMass * p * p),
        (k = a.step.dt),
        (this.m_gamma =
          k * (2 * this.m_springMass * this.m_dampingRatio * p + k * f)),
        0 < this.m_gamma && (this.m_gamma = 1 / this.m_gamma),
        (this.m_bias = c * k * f * this.m_gamma),
        (this.m_springMass = b + this.m_gamma),
        0 < this.m_springMass && (this.m_springMass = 1 / this.m_springMass)))
    : (this.m_springImpulse = 0);
  this.m_enableMotor
    ? ((this.m_motorMass = d + e),
      0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass))
    : (this.m_motorImpulse = this.m_motorMass = 0);
  a.step.warmStarting
    ? ((this.m_impulse *= a.step.dtRatio),
      (this.m_springImpulse *= a.step.dtRatio),
      (this.m_motorImpulse *= a.step.dtRatio),
      (d = box2d.b2Add_V2_V2(
        box2d.b2Mul_S_V2(this.m_impulse, this.m_ay, box2d.b2Vec2.s_t0),
        box2d.b2Mul_S_V2(this.m_springImpulse, this.m_ax, box2d.b2Vec2.s_t1),
        box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P
      )),
      (e =
        this.m_impulse * this.m_sAy +
        this.m_springImpulse * this.m_sAx +
        this.m_motorImpulse),
      (b =
        this.m_impulse * this.m_sBy +
        this.m_springImpulse * this.m_sBx +
        this.m_motorImpulse),
      g.SelfMulSub(this.m_invMassA, d),
      (h -= this.m_invIA * e),
      m.SelfMulAdd(this.m_invMassB, d),
      (n += this.m_invIB * b))
    : (this.m_motorImpulse = this.m_springImpulse = this.m_impulse = 0);
  a.velocities[this.m_indexA].w = h;
  a.velocities[this.m_indexB].w = n;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "InitVelocityConstraints",
  box2d.b2WheelJoint.prototype.InitVelocityConstraints
);
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2();
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2WheelJoint.prototype.SolveVelocityConstraints = function (a) {
  var b = this.m_invMassA,
    c = this.m_invMassB,
    d = this.m_invIA,
    e = this.m_invIB,
    f = a.velocities[this.m_indexA].v,
    g = a.velocities[this.m_indexA].w,
    h = a.velocities[this.m_indexB].v,
    k = a.velocities[this.m_indexB].w,
    l =
      box2d.b2Dot_V2_V2(this.m_ax, box2d.b2Sub_V2_V2(h, f, box2d.b2Vec2.s_t0)) +
      this.m_sBx * k -
      this.m_sAx * g,
    l =
      -this.m_springMass *
      (l + this.m_bias + this.m_gamma * this.m_springImpulse);
  this.m_springImpulse += l;
  var m = box2d.b2Mul_S_V2(
      l,
      this.m_ax,
      box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P
    ),
    n = l * this.m_sAx,
    l = l * this.m_sBx;
  f.SelfMulSub(b, m);
  g -= d * n;
  h.SelfMulAdd(c, m);
  k += e * l;
  l = k - g - this.m_motorSpeed;
  l *= -this.m_motorMass;
  m = this.m_motorImpulse;
  n = a.step.dt * this.m_maxMotorTorque;
  this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + l, -n, n);
  l = this.m_motorImpulse - m;
  g -= d * l;
  k += e * l;
  l =
    box2d.b2Dot_V2_V2(this.m_ay, box2d.b2Sub_V2_V2(h, f, box2d.b2Vec2.s_t0)) +
    this.m_sBy * k -
    this.m_sAy * g;
  l *= -this.m_mass;
  this.m_impulse += l;
  m = box2d.b2Mul_S_V2(
    l,
    this.m_ay,
    box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P
  );
  n = l * this.m_sAy;
  l *= this.m_sBy;
  f.SelfMulSub(b, m);
  g -= d * n;
  h.SelfMulAdd(c, m);
  a.velocities[this.m_indexA].w = g;
  a.velocities[this.m_indexB].w = k + e * l;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SolveVelocityConstraints",
  box2d.b2WheelJoint.prototype.SolveVelocityConstraints
);
box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2();
box2d.b2WheelJoint.prototype.SolvePositionConstraints = function (a) {
  var b = a.positions[this.m_indexA].c,
    c = a.positions[this.m_indexA].a,
    d = a.positions[this.m_indexB].c,
    e = a.positions[this.m_indexB].a,
    f = this.m_qA.SetAngle(c),
    g = this.m_qB.SetAngle(e);
  box2d.b2Sub_V2_V2(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
  var h = box2d.b2Mul_R_V2(f, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
  var g = box2d.b2Mul_R_V2(g, this.m_lalcB, this.m_rB),
    k = box2d.b2Add_V2_V2(
      box2d.b2Sub_V2_V2(d, b, box2d.b2Vec2.s_t0),
      box2d.b2Sub_V2_V2(g, h, box2d.b2Vec2.s_t1),
      box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d
    ),
    f = box2d.b2Mul_R_V2(f, this.m_localYAxisA, this.m_ay),
    h = box2d.b2Cross_V2_V2(box2d.b2Add_V2_V2(k, h, box2d.b2Vec2.s_t0), f),
    g = box2d.b2Cross_V2_V2(g, f),
    k = box2d.b2Dot_V2_V2(k, this.m_ay),
    l =
      this.m_invMassA +
      this.m_invMassB +
      this.m_invIA * this.m_sAy * this.m_sAy +
      this.m_invIB * this.m_sBy * this.m_sBy,
    l = 0 !== l ? -k / l : 0,
    f = box2d.b2Mul_S_V2(
      l,
      f,
      box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P
    ),
    h = l * h,
    g = l * g;
  b.SelfMulSub(this.m_invMassA, f);
  c -= this.m_invIA * h;
  d.SelfMulAdd(this.m_invMassB, f);
  e += this.m_invIB * g;
  a.positions[this.m_indexA].a = c;
  a.positions[this.m_indexB].a = e;
  return box2d.b2Abs(k) <= box2d.b2_linearSlop;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SolvePositionConstraints",
  box2d.b2WheelJoint.prototype.SolvePositionConstraints
);
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2();
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2();
box2d.b2WheelJoint.prototype.GetDefinition = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
  return a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetDefinition",
  box2d.b2WheelJoint.prototype.GetDefinition
);
box2d.b2WheelJoint.prototype.GetAnchorA = function (a) {
  return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetAnchorA",
  box2d.b2WheelJoint.prototype.GetAnchorA
);
box2d.b2WheelJoint.prototype.GetAnchorB = function (a) {
  return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetAnchorB",
  box2d.b2WheelJoint.prototype.GetAnchorB
);
box2d.b2WheelJoint.prototype.GetReactionForce = function (a, b) {
  b.x = a * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
  b.y = a * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
  return b;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetReactionForce",
  box2d.b2WheelJoint.prototype.GetReactionForce
);
box2d.b2WheelJoint.prototype.GetReactionTorque = function (a) {
  return a * this.m_motorImpulse;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetReactionTorque",
  box2d.b2WheelJoint.prototype.GetReactionTorque
);
box2d.b2WheelJoint.prototype.GetLocalAnchorA = function (a) {
  return a.Copy(this.m_localAnchorA);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetLocalAnchorA",
  box2d.b2WheelJoint.prototype.GetLocalAnchorA
);
box2d.b2WheelJoint.prototype.GetLocalAnchorB = function (a) {
  return a.Copy(this.m_localAnchorB);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetLocalAnchorB",
  box2d.b2WheelJoint.prototype.GetLocalAnchorB
);
box2d.b2WheelJoint.prototype.GetLocalAxisA = function (a) {
  return a.Copy(this.m_localXAxisA);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetLocalAxisA",
  box2d.b2WheelJoint.prototype.GetLocalAxisA
);
box2d.b2WheelJoint.prototype.GetJointTranslation = function () {
  return this.GetPrismaticJointTranslation();
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetJointTranslation",
  box2d.b2WheelJoint.prototype.GetJointTranslation
);
box2d.b2WheelJoint.prototype.GetJointSpeed = function () {
  return this.GetRevoluteJointSpeed();
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetJointSpeed",
  box2d.b2WheelJoint.prototype.GetJointSpeed
);
box2d.b2WheelJoint.prototype.GetPrismaticJointTranslation = function () {
  var a = this.m_bodyA,
    b = this.m_bodyB,
    c = a.GetWorldPoint(this.m_localAnchorA, new box2d.b2Vec2()),
    b = b.GetWorldPoint(this.m_localAnchorB, new box2d.b2Vec2()),
    c = box2d.b2Sub_V2_V2(b, c, new box2d.b2Vec2()),
    a = a.GetWorldVector(this.m_localXAxisA, new box2d.b2Vec2());
  return box2d.b2Dot_V2_V2(c, a);
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetPrismaticJointTranslation",
  box2d.b2WheelJoint.prototype.GetPrismaticJointTranslation
);
box2d.b2WheelJoint.prototype.GetPrismaticJointSpeed = function () {
  var a = this.m_bodyA,
    b = this.m_bodyB;
  box2d.b2Sub_V2_V2(this.m_localAnchorA, a.m_sweep.localCenter, this.m_lalcA);
  var c = box2d.b2Mul_R_V2(a.m_xf.q, this.m_lalcA, this.m_rA);
  box2d.b2Sub_V2_V2(this.m_localAnchorB, b.m_sweep.localCenter, this.m_lalcB);
  var d = box2d.b2Mul_R_V2(b.m_xf.q, this.m_lalcB, this.m_rB),
    e = box2d.b2Add_V2_V2(a.m_sweep.c, c, box2d.b2Vec2.s_t0),
    f = box2d.b2Add_V2_V2(b.m_sweep.c, d, box2d.b2Vec2.s_t1),
    e = box2d.b2Sub_V2_V2(f, e, box2d.b2Vec2.s_t2),
    f = a.GetWorldVector(this.m_localXAxisA, new box2d.b2Vec2()),
    g = a.m_linearVelocity,
    h = b.m_linearVelocity,
    a = a.m_angularVelocity,
    b = b.m_angularVelocity;
  return (
    box2d.b2Dot_V2_V2(e, box2d.b2Cross_S_V2(a, f, box2d.b2Vec2.s_t0)) +
    box2d.b2Dot_V2_V2(
      f,
      box2d.b2Sub_V2_V2(
        box2d.b2AddCross_V2_S_V2(h, b, d, box2d.b2Vec2.s_t0),
        box2d.b2AddCross_V2_S_V2(g, a, c, box2d.b2Vec2.s_t1),
        box2d.b2Vec2.s_t0
      )
    )
  );
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetPrismaticJointSpeed",
  box2d.b2WheelJoint.prototype.GetPrismaticJointSpeed
);
box2d.b2WheelJoint.prototype.GetRevoluteJointAngle = function () {
  return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetRevoluteJointAngle",
  box2d.b2WheelJoint.prototype.GetRevoluteJointAngle
);
box2d.b2WheelJoint.prototype.GetRevoluteJointSpeed = function () {
  return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetRevoluteJointSpeed",
  box2d.b2WheelJoint.prototype.GetRevoluteJointSpeed
);
box2d.b2WheelJoint.prototype.IsMotorEnabled = function () {
  return this.m_enableMotor;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "IsMotorEnabled",
  box2d.b2WheelJoint.prototype.IsMotorEnabled
);
box2d.b2WheelJoint.prototype.EnableMotor = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_enableMotor = a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "EnableMotor",
  box2d.b2WheelJoint.prototype.EnableMotor
);
box2d.b2WheelJoint.prototype.SetMotorSpeed = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_motorSpeed = a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SetMotorSpeed",
  box2d.b2WheelJoint.prototype.SetMotorSpeed
);
box2d.b2WheelJoint.prototype.SetMaxMotorTorque = function (a) {
  this.m_bodyA.SetAwake(!0);
  this.m_bodyB.SetAwake(!0);
  this.m_maxMotorTorque = a;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "SetMaxMotorTorque",
  box2d.b2WheelJoint.prototype.SetMaxMotorTorque
);
box2d.b2WheelJoint.prototype.GetMotorTorque = function (a) {
  return a * this.m_motorImpulse;
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "GetMotorTorque",
  box2d.b2WheelJoint.prototype.GetMotorTorque
);
box2d.b2WheelJoint.prototype.Dump = function () {
  if (box2d.DEBUG) {
    var a = this.m_bodyA.m_islandIndex,
      b = this.m_bodyB.m_islandIndex;
    box2d.b2Log(
      "  /*box2d.b2WheelJointDef*/ var jd = new box2d.b2WheelJointDef();\n"
    );
    box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
    box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
    box2d.b2Log(
      "  jd.collideConnected = %s;\n",
      this.m_collideConnected ? "true" : "false"
    );
    box2d.b2Log(
      "  jd.localAnchorA.Set(%.15f, %.15f);\n",
      this.m_localAnchorA.x,
      this.m_localAnchorA.y
    );
    box2d.b2Log(
      "  jd.localAnchorB.Set(%.15f, %.15f);\n",
      this.m_localAnchorB.x,
      this.m_localAnchorB.y
    );
    box2d.b2Log(
      "  jd.localAxisA.Set(%.15f, %.15f);\n",
      this.m_localXAxisA.x,
      this.m_localXAxisA.y
    );
    box2d.b2Log(
      "  jd.enableMotor = %s;\n",
      this.m_enableMotor ? "true" : "false"
    );
    box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
    box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
    box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
    box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
    box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
  }
};
goog.exportProperty(
  box2d.b2WheelJoint.prototype,
  "Dump",
  box2d.b2WheelJoint.prototype.Dump
);
box2d.b2Particle = {};
box2d.b2ParticleFlag = {
  b2_waterParticle: 0,
  b2_zombieParticle: 2,
  b2_wallParticle: 4,
  b2_springParticle: 8,
  b2_elasticParticle: 16,
  b2_viscousParticle: 32,
  b2_powderParticle: 64,
  b2_tensileParticle: 128,
  b2_colorMixingParticle: 256,
  b2_destructionListenerParticle: 512,
  b2_barrierParticle: 1024,
  b2_staticPressureParticle: 2048,
  b2_reactiveParticle: 4096,
  b2_repulsiveParticle: 8192,
  b2_fixtureContactListenerParticle: 16384,
  b2_particleContactListenerParticle: 32768,
  b2_fixtureContactFilterParticle: 65536,
  b2_particleContactFilterParticle: 131072,
};
goog.exportSymbol("box2d.b2ParticleFlag", box2d.b2ParticleFlag);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_waterParticle",
  box2d.b2ParticleFlag.b2_waterParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_zombieParticle",
  box2d.b2ParticleFlag.b2_zombieParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_wallParticle",
  box2d.b2ParticleFlag.b2_wallParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_springParticle",
  box2d.b2ParticleFlag.b2_springParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_elasticParticle",
  box2d.b2ParticleFlag.b2_elasticParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_viscousParticle",
  box2d.b2ParticleFlag.b2_viscousParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_powderParticle",
  box2d.b2ParticleFlag.b2_powderParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_tensileParticle",
  box2d.b2ParticleFlag.b2_tensileParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_colorMixingParticle",
  box2d.b2ParticleFlag.b2_colorMixingParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_destructionListenerParticle",
  box2d.b2ParticleFlag.b2_destructionListenerParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_barrierParticle",
  box2d.b2ParticleFlag.b2_barrierParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_staticPressureParticle",
  box2d.b2ParticleFlag.b2_staticPressureParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_reactiveParticle",
  box2d.b2ParticleFlag.b2_reactiveParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_repulsiveParticle",
  box2d.b2ParticleFlag.b2_repulsiveParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_fixtureContactListenerParticle",
  box2d.b2ParticleFlag.b2_fixtureContactListenerParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_particleContactListenerParticle",
  box2d.b2ParticleFlag.b2_particleContactListenerParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_fixtureContactFilterParticle",
  box2d.b2ParticleFlag.b2_fixtureContactFilterParticle
);
goog.exportProperty(
  box2d.b2ParticleFlag,
  "b2_particleContactFilterParticle",
  box2d.b2ParticleFlag.b2_particleContactFilterParticle
);
box2d.b2ParticleColor = function (a, b, c, d) {
  if (0 !== arguments.length)
    if (a instanceof box2d.b2Color)
      (this.r = 0 | (255 * a.r)),
        (this.g = 0 | (255 * a.g)),
        (this.b = 0 | (255 * a.b)),
        (this.a = 0 | (255 * a.a));
    else if (3 <= arguments.length)
      (this.r = 0 | a || 0),
        (this.g = 0 | b || 0),
        (this.b = 0 | c || 0),
        (this.a = 0 | d || 0);
    else throw Error();
};
goog.exportSymbol("box2d.b2ParticleColor", box2d.b2ParticleColor);
box2d.b2ParticleColor.prototype.r = 0;
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "r",
  box2d.b2ParticleColor.prototype.r
);
box2d.b2ParticleColor.prototype.g = 0;
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "g",
  box2d.b2ParticleColor.prototype.g
);
box2d.b2ParticleColor.prototype.b = 0;
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "b",
  box2d.b2ParticleColor.prototype.b
);
box2d.b2ParticleColor.prototype.a = 0;
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "a",
  box2d.b2ParticleColor.prototype.a
);
box2d.b2ParticleColor.prototype.IsZero = function () {
  return 0 === this.r && 0 === this.g && 0 === this.b && 0 === this.a;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "IsZero",
  box2d.b2ParticleColor.prototype.IsZero
);
box2d.b2ParticleColor.prototype.GetColor = function (a) {
  a.r = this.r / 255;
  a.g = this.g / 255;
  a.b = this.b / 255;
  a.a = this.a / 255;
  return a;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "GetColor",
  box2d.b2ParticleColor.prototype.GetColor
);
box2d.b2ParticleColor.prototype.Set = function (a, b, c, d) {
  if (a instanceof box2d.b2Color) this.SetColor(a);
  else if (3 <= arguments.length) this.SetRGBA(a || 0, b || 0, c || 0, d);
  else throw Error();
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Set",
  box2d.b2ParticleColor.prototype.Set
);
box2d.b2ParticleColor.prototype.SetRGBA = function (a, b, c, d) {
  this.r = a;
  this.g = b;
  this.b = c;
  this.a = "number" === typeof d ? d : 255;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SetRGBA",
  box2d.b2ParticleColor.prototype.SetRGBA
);
box2d.b2ParticleColor.prototype.SetColor = function (a) {
  this.r = 255 * a.r;
  this.g = 255 * a.g;
  this.b = 255 * a.b;
  this.a = 255 * a.a;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SetColor",
  box2d.b2ParticleColor.prototype.SetColor
);
box2d.b2ParticleColor.prototype.Copy = function (a) {
  this.r = a.r;
  this.g = a.g;
  this.b = a.b;
  this.a = a.a;
  return this;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Copy",
  box2d.b2ParticleColor.prototype.Copy
);
box2d.b2ParticleColor.prototype.Clone = function () {
  return new box2d.b2ParticleColor(this.r, this.g, this.b, this.a);
};
box2d.b2ParticleColor.prototype.SelfMul_0_1 = function (a) {
  this.r *= a;
  this.g *= a;
  this.b *= a;
  this.a *= a;
  return this;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SelfMul_0_1",
  box2d.b2ParticleColor.prototype.SelfMul_0_1
);
box2d.b2ParticleColor.prototype.SelfMul_0_255 = function (a) {
  a += 1;
  this.r = (this.r * a) >> box2d.b2ParticleColor.k_bitsPerComponent;
  this.g = (this.g * a) >> box2d.b2ParticleColor.k_bitsPerComponent;
  this.b = (this.b * a) >> box2d.b2ParticleColor.k_bitsPerComponent;
  this.a = (this.a * a) >> box2d.b2ParticleColor.k_bitsPerComponent;
  return this;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SelfMul_0_255",
  box2d.b2ParticleColor.prototype.SelfMul_0_255
);
box2d.b2ParticleColor.prototype.Mul_0_1 = function (a, b) {
  return b.Copy(this).SelfMul_0_1(a);
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Mul_0_1",
  box2d.b2ParticleColor.prototype.Mul_0_1
);
box2d.b2ParticleColor.prototype.Mul_0_255 = function (a, b) {
  return b.Copy(this).SelfMul_0_255(a);
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Mul_0_255",
  box2d.b2ParticleColor.prototype.Mul_0_255
);
box2d.b2ParticleColor.prototype.SelfAdd = function (a) {
  this.r += a.r;
  this.g += a.g;
  this.b += a.b;
  this.a += a.a;
  return this;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SelfAdd",
  box2d.b2ParticleColor.prototype.SelfAdd
);
box2d.b2ParticleColor.prototype.Add = function (a, b) {
  b.r = this.r + a.r;
  b.g = this.g + a.g;
  b.b = this.b + a.b;
  b.a = this.a + a.a;
  return b;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Add",
  box2d.b2ParticleColor.prototype.Add
);
box2d.b2ParticleColor.prototype.SelfSub = function (a) {
  this.r -= a.r;
  this.g -= a.g;
  this.b -= a.b;
  this.a -= a.a;
  return this;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "SelfSub",
  box2d.b2ParticleColor.prototype.SelfSub
);
box2d.b2ParticleColor.prototype.Sub = function (a, b) {
  b.r = this.r - a.r;
  b.g = this.g - a.g;
  b.b = this.b - a.b;
  b.a = this.a - a.a;
  return b;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Sub",
  box2d.b2ParticleColor.prototype.Sub
);
box2d.b2ParticleColor.prototype.IsEqual = function (a) {
  return this.r === a.r && this.g === a.g && this.b === a.b && this.a === a.a;
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "IsEqual",
  box2d.b2ParticleColor.prototype.IsEqual
);
box2d.b2ParticleColor.prototype.Mix = function (a, b) {
  box2d.b2ParticleColor.MixColors(this, a, b);
};
goog.exportProperty(
  box2d.b2ParticleColor.prototype,
  "Mix",
  box2d.b2ParticleColor.prototype.Mix
);
box2d.b2ParticleColor.MixColors = function (a, b, c) {
  var d = (c * (b.r - a.r)) >> box2d.b2ParticleColor.k_bitsPerComponent,
    e = (c * (b.g - a.g)) >> box2d.b2ParticleColor.k_bitsPerComponent,
    f = (c * (b.b - a.b)) >> box2d.b2ParticleColor.k_bitsPerComponent;
  c = (c * (b.a - a.a)) >> box2d.b2ParticleColor.k_bitsPerComponent;
  a.r += d;
  a.g += e;
  a.b += f;
  a.a += c;
  b.r -= d;
  b.g -= e;
  b.b -= f;
  b.a -= c;
};
goog.exportProperty(
  box2d.b2ParticleColor,
  "MixColors",
  box2d.b2ParticleColor.MixColors
);
box2d.B2PARTICLECOLOR_BITS_PER_COMPONENT = 8;
box2d.B2PARTICLECOLOR_MAX_VALUE =
  (1 << box2d.B2PARTICLECOLOR_BITS_PER_COMPONENT) - 1;
box2d.b2ParticleColor.k_maxValue = +box2d.B2PARTICLECOLOR_MAX_VALUE;
goog.exportProperty(
  box2d.b2ParticleColor,
  "k_maxValue",
  box2d.b2ParticleColor.k_maxValue
);
box2d.b2ParticleColor.k_inverseMaxValue = 1 / +box2d.B2PARTICLECOLOR_MAX_VALUE;
goog.exportProperty(
  box2d.b2ParticleColor,
  "k_inverseMaxValue",
  box2d.b2ParticleColor.k_inverseMaxValue
);
box2d.b2ParticleColor.k_bitsPerComponent =
  box2d.B2PARTICLECOLOR_BITS_PER_COMPONENT;
goog.exportProperty(
  box2d.b2ParticleColor,
  "k_bitsPerComponent",
  box2d.b2ParticleColor.k_bitsPerComponent
);
box2d.b2ParticleColor_zero = new box2d.b2ParticleColor();
box2d.b2ParticleDef = function () {
  this.position = box2d.b2Vec2_zero.Clone();
  this.velocity = box2d.b2Vec2_zero.Clone();
  this.color = box2d.b2ParticleColor_zero.Clone();
};
goog.exportSymbol("box2d.b2ParticleDef", box2d.b2ParticleDef);
box2d.b2ParticleDef.prototype.flags = 0;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "flags",
  box2d.b2ParticleDef.prototype.flags
);
box2d.b2ParticleDef.prototype.position = null;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "position",
  box2d.b2ParticleDef.prototype.position
);
box2d.b2ParticleDef.prototype.velocity = null;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "velocity",
  box2d.b2ParticleDef.prototype.velocity
);
box2d.b2ParticleDef.prototype.color = null;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "color",
  box2d.b2ParticleDef.prototype.color
);
box2d.b2ParticleDef.prototype.lifetime = 0;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "lifetime",
  box2d.b2ParticleDef.prototype.lifetime
);
box2d.b2ParticleDef.prototype.userData = null;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "userData",
  box2d.b2ParticleDef.prototype.userData
);
box2d.b2ParticleDef.prototype.group = null;
goog.exportProperty(
  box2d.b2ParticleDef.prototype,
  "group",
  box2d.b2ParticleDef.prototype.group
);
box2d.b2CalculateParticleIterations = function (a, b, c) {
  return box2d.b2Clamp(Math.ceil(Math.sqrt(a / (0.01 * b)) * c), 1, 8);
};
goog.exportSymbol(
  "box2d.b2CalculateParticleIterations",
  box2d.b2CalculateParticleIterations
);
box2d.b2ParticleHandle = function () {};
goog.exportSymbol("box2d.b2ParticleHandle", box2d.b2ParticleHandle);
box2d.b2ParticleHandle.prototype.m_index = box2d.b2_invalidParticleIndex;
box2d.b2ParticleHandle.prototype.GetIndex = function () {
  return this.m_index;
};
goog.exportProperty(
  box2d.b2ParticleHandle.prototype,
  "GetIndex",
  box2d.b2ParticleHandle.prototype.GetIndex
);
box2d.b2ParticleHandle.prototype.SetIndex = function (a) {
  this.m_index = a;
};
box2d.b2ParticleGroupFlag = {
  b2_solidParticleGroup: 1,
  b2_rigidParticleGroup: 2,
  b2_particleGroupCanBeEmpty: 4,
  b2_particleGroupWillBeDestroyed: 8,
  b2_particleGroupNeedsUpdateDepth: 16,
};
goog.exportSymbol("box2d.b2ParticleGroupFlag", box2d.b2ParticleGroupFlag);
goog.exportProperty(
  box2d.b2ParticleGroupFlag,
  "b2_solidParticleGroup",
  box2d.b2ParticleGroupFlag.b2_solidParticleGroup
);
goog.exportProperty(
  box2d.b2ParticleGroupFlag,
  "b2_rigidParticleGroup",
  box2d.b2ParticleGroupFlag.b2_rigidParticleGroup
);
goog.exportProperty(
  box2d.b2ParticleGroupFlag,
  "b2_particleGroupCanBeEmpty",
  box2d.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty
);
goog.exportProperty(
  box2d.b2ParticleGroupFlag,
  "b2_particleGroupWillBeDestroyed",
  box2d.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed
);
goog.exportProperty(
  box2d.b2ParticleGroupFlag,
  "b2_particleGroupNeedsUpdateDepth",
  box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth
);
box2d.b2ParticleGroupFlag.b2_particleGroupInternalMask =
  box2d.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed |
  box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth;
box2d.b2ParticleGroupDef = function () {
  this.position = box2d.b2Vec2_zero.Clone();
  this.linearVelocity = box2d.b2Vec2_zero.Clone();
  this.color = box2d.b2ParticleColor_zero.Clone();
};
goog.exportSymbol("box2d.b2ParticleGroupDef", box2d.b2ParticleGroupDef);
box2d.b2ParticleGroupDef.prototype.flags = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "flags",
  box2d.b2ParticleGroupDef.prototype.flags
);
box2d.b2ParticleGroupDef.prototype.groupFlags = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "groupFlags",
  box2d.b2ParticleGroupDef.prototype.groupFlags
);
box2d.b2ParticleGroupDef.prototype.position = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "position",
  box2d.b2ParticleGroupDef.prototype.position
);
box2d.b2ParticleGroupDef.prototype.angle = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "angle",
  box2d.b2ParticleGroupDef.prototype.angle
);
box2d.b2ParticleGroupDef.prototype.linearVelocity = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "linearVelocity",
  box2d.b2ParticleGroupDef.prototype.linearVelocity
);
box2d.b2ParticleGroupDef.prototype.angularVelocity = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "angularVelocity",
  box2d.b2ParticleGroupDef.prototype.angularVelocity
);
box2d.b2ParticleGroupDef.prototype.color = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "color",
  box2d.b2ParticleGroupDef.prototype.color
);
box2d.b2ParticleGroupDef.prototype.strength = 1;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "strength",
  box2d.b2ParticleGroupDef.prototype.strength
);
box2d.b2ParticleGroupDef.prototype.shape = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "shape",
  box2d.b2ParticleGroupDef.prototype.shape
);
box2d.b2ParticleGroupDef.prototype.shapes = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "shapes",
  box2d.b2ParticleGroupDef.prototype.shapes
);
box2d.b2ParticleGroupDef.prototype.shapeCount = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "shapeCount",
  box2d.b2ParticleGroupDef.prototype.shapeCount
);
box2d.b2ParticleGroupDef.prototype.stride = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "stride",
  box2d.b2ParticleGroupDef.prototype.stride
);
box2d.b2ParticleGroupDef.prototype.particleCount = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "particleCount",
  box2d.b2ParticleGroupDef.prototype.particleCount
);
box2d.b2ParticleGroupDef.prototype.positionData = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "positionData",
  box2d.b2ParticleGroupDef.prototype.positionData
);
box2d.b2ParticleGroupDef.prototype.lifetime = 0;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "lifetime",
  box2d.b2ParticleGroupDef.prototype.lifetime
);
box2d.b2ParticleGroupDef.prototype.userData = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "userData",
  box2d.b2ParticleGroupDef.prototype.userData
);
box2d.b2ParticleGroupDef.prototype.group = null;
goog.exportProperty(
  box2d.b2ParticleGroupDef.prototype,
  "group",
  box2d.b2ParticleGroupDef.prototype.group
);
box2d.b2ParticleGroup = function () {
  this.m_center = new box2d.b2Vec2();
  this.m_linearVelocity = new box2d.b2Vec2();
  this.m_transform = new box2d.b2Transform();
  this.m_transform.SetIdentity();
};
goog.exportSymbol("box2d.b2ParticleGroup", box2d.b2ParticleGroup);
box2d.b2ParticleGroup.prototype.m_system = null;
box2d.b2ParticleGroup.prototype.m_firstIndex = 0;
box2d.b2ParticleGroup.prototype.m_lastIndex = 0;
box2d.b2ParticleGroup.prototype.m_groupFlags = 0;
box2d.b2ParticleGroup.prototype.m_strength = 1;
box2d.b2ParticleGroup.prototype.m_prev = null;
box2d.b2ParticleGroup.prototype.m_next = null;
box2d.b2ParticleGroup.prototype.m_timestamp = -1;
box2d.b2ParticleGroup.prototype.m_mass = 0;
box2d.b2ParticleGroup.prototype.m_inertia = 0;
box2d.b2ParticleGroup.prototype.m_center = null;
box2d.b2ParticleGroup.prototype.m_linearVelocity = null;
box2d.b2ParticleGroup.prototype.m_angularVelocity = 0;
box2d.b2ParticleGroup.prototype.m_transform = null;
box2d.b2ParticleGroup.prototype.m_userData = null;
box2d.b2ParticleGroup.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetNext",
  box2d.b2ParticleGroup.prototype.GetNext
);
box2d.b2ParticleGroup.prototype.GetParticleSystem = function () {
  return this.m_system;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetParticleSystem",
  box2d.b2ParticleGroup.prototype.GetParticleSystem
);
box2d.b2ParticleGroup.prototype.GetParticleCount = function () {
  return this.m_lastIndex - this.m_firstIndex;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetParticleCount",
  box2d.b2ParticleGroup.prototype.GetParticleCount
);
box2d.b2ParticleGroup.prototype.GetBufferIndex = function () {
  return this.m_firstIndex;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetBufferIndex",
  box2d.b2ParticleGroup.prototype.GetBufferIndex
);
box2d.b2ParticleGroup.prototype.ContainsParticle = function (a) {
  return this.m_firstIndex <= a && a < this.m_lastIndex;
};
box2d.b2ParticleGroup.prototype.GetAllParticleFlags = function () {
  for (var a = 0, b = this.m_firstIndex; b < this.m_lastIndex; b++)
    a |= this.m_system.m_flagsBuffer.data[b];
  return a;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetAllParticleFlags",
  box2d.b2ParticleGroup.prototype.GetAllParticleFlags
);
box2d.b2ParticleGroup.prototype.GetGroupFlags = function () {
  return this.m_groupFlags;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetGroupFlags",
  box2d.b2ParticleGroup.prototype.GetGroupFlags
);
box2d.b2ParticleGroup.prototype.SetGroupFlags = function (a) {
  box2d.b2Assert(
    0 === (a & box2d.b2ParticleGroupFlag.b2_particleGroupInternalMask)
  );
  a |=
    this.m_groupFlags & box2d.b2ParticleGroupFlag.b2_particleGroupInternalMask;
  this.m_system.SetGroupFlags(this, a);
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "SetGroupFlags",
  box2d.b2ParticleGroup.prototype.SetGroupFlags
);
box2d.b2ParticleGroup.prototype.GetMass = function () {
  this.UpdateStatistics();
  return this.m_mass;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetMass",
  box2d.b2ParticleGroup.prototype.GetMass
);
box2d.b2ParticleGroup.prototype.GetInertia = function () {
  this.UpdateStatistics();
  return this.m_inertia;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetInertia",
  box2d.b2ParticleGroup.prototype.GetInertia
);
box2d.b2ParticleGroup.prototype.GetCenter = function () {
  this.UpdateStatistics();
  return this.m_center;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetCenter",
  box2d.b2ParticleGroup.prototype.GetCenter
);
box2d.b2ParticleGroup.prototype.GetLinearVelocity = function () {
  this.UpdateStatistics();
  return this.m_linearVelocity;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetLinearVelocity",
  box2d.b2ParticleGroup.prototype.GetLinearVelocity
);
box2d.b2ParticleGroup.prototype.GetAngularVelocity = function () {
  this.UpdateStatistics();
  return this.m_angularVelocity;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetAngularVelocity",
  box2d.b2ParticleGroup.prototype.GetAngularVelocity
);
box2d.b2ParticleGroup.prototype.GetTransform = function () {
  return this.m_transform;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetTransform",
  box2d.b2ParticleGroup.prototype.GetTransform
);
box2d.b2ParticleGroup.prototype.GetPosition = function () {
  return this.m_transform.p;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetPosition",
  box2d.b2ParticleGroup.prototype.GetPosition
);
box2d.b2ParticleGroup.prototype.GetAngle = function () {
  return this.m_transform.q.GetAngle();
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetAngle",
  box2d.b2ParticleGroup.prototype.GetAngle
);
box2d.b2ParticleGroup.prototype.GetLinearVelocityFromWorldPoint = function (
  a,
  b
) {
  var c = box2d.b2ParticleGroup.prototype.GetLinearVelocityFromWorldPoint.s_t0;
  this.UpdateStatistics();
  return box2d.b2AddCross_V2_S_V2(
    this.m_linearVelocity,
    this.m_angularVelocity,
    box2d.b2Sub_V2_V2(a, this.m_center, c),
    b
  );
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetLinearVelocityFromWorldPoint",
  box2d.b2ParticleGroup.prototype.GetLinearVelocityFromWorldPoint
);
box2d.b2ParticleGroup.prototype.GetLinearVelocityFromWorldPoint.s_t0 = new box2d.b2Vec2();
box2d.b2ParticleGroup.prototype.GetUserData = function () {
  return this.m_userData;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "GetUserData",
  box2d.b2ParticleGroup.prototype.GetUserData
);
box2d.b2ParticleGroup.prototype.SetUserData = function (a) {
  this.m_userData = a;
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "SetUserData",
  box2d.b2ParticleGroup.prototype.SetUserData
);
box2d.b2ParticleGroup.prototype.ApplyForce = function (a) {
  this.m_system.ApplyForce(this.m_firstIndex, this.m_lastIndex, a);
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "ApplyForce",
  box2d.b2ParticleGroup.prototype.ApplyForce
);
box2d.b2ParticleGroup.prototype.ApplyLinearImpulse = function (a) {
  this.m_system.ApplyLinearImpulse(this.m_firstIndex, this.m_lastIndex, a);
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "ApplyLinearImpulse",
  box2d.b2ParticleGroup.prototype.ApplyLinearImpulse
);
box2d.b2ParticleGroup.prototype.DestroyParticles = function (a) {
  box2d.b2Assert(!1 === this.m_system.m_world.IsLocked());
  if (!this.m_system.m_world.IsLocked())
    for (var b = this.m_firstIndex; b < this.m_lastIndex; b++)
      this.m_system.DestroyParticle(b, a);
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "DestroyParticles",
  box2d.b2ParticleGroup.prototype.DestroyParticles
);
box2d.b2ParticleGroup.prototype.UpdateStatistics = function () {
  var a = new box2d.b2Vec2(),
    b = new box2d.b2Vec2();
  if (this.m_timestamp != this.m_system.m_timestamp) {
    var c = this.m_system.GetParticleMass();
    this.m_mass = c * (this.m_lastIndex - this.m_firstIndex);
    this.m_center.SetZero();
    this.m_linearVelocity.SetZero();
    for (var d = this.m_firstIndex; d < this.m_lastIndex; d++)
      this.m_center.SelfMulAdd(c, this.m_system.m_positionBuffer.data[d]),
        this.m_linearVelocity.SelfMulAdd(
          c,
          this.m_system.m_velocityBuffer.data[d]
        );
    0 < this.m_mass &&
      ((d = 1 / this.m_mass),
      this.m_center.SelfMul(d),
      this.m_linearVelocity.SelfMul(d));
    this.m_angularVelocity = this.m_inertia = 0;
    for (d = this.m_firstIndex; d < this.m_lastIndex; d++)
      box2d.b2Sub_V2_V2(
        this.m_system.m_positionBuffer.data[d],
        this.m_center,
        a
      ),
        box2d.b2Sub_V2_V2(
          this.m_system.m_velocityBuffer.data[d],
          this.m_linearVelocity,
          b
        ),
        (this.m_inertia += c * box2d.b2Dot_V2_V2(a, a)),
        (this.m_angularVelocity += c * box2d.b2Cross_V2_V2(a, b));
    0 < this.m_inertia && (this.m_angularVelocity *= 1 / this.m_inertia);
    this.m_timestamp = this.m_system.m_timestamp;
  }
};
goog.exportProperty(
  box2d.b2ParticleGroup.prototype,
  "UpdateStatistics",
  box2d.b2ParticleGroup.prototype.UpdateStatistics
);
box2d.std_iter_swap = function (a, b, c) {
  var d = a[b];
  a[b] = a[c];
  a[c] = d;
};
box2d.std_sort = function (a, b, c, d) {
  "number" !== typeof b && (b = 0);
  "number" !== typeof c && (c = a.length - b);
  "function" !== typeof d &&
    (d = function (a, b) {
      return a < b;
    });
  for (var e = [], f = 0; ; ) {
    for (; b + 1 < c; c++) {
      var g = a[b + Math.floor(Math.random() * (c - b))];
      e[f++] = c;
      for (var h = b - 1; ; ) {
        for (; d(a[++h], g); );
        for (; d(g, a[--c]); );
        if (h >= c) break;
        box2d.std_iter_swap(a, h, c);
      }
    }
    if (0 === f) break;
    b = c;
    c = e[--f];
  }
  return a;
};
box2d.std_stable_sort = function (a, b, c, d) {
  return box2d.std_sort(a, b, c, d);
};
box2d.std_remove_if = function (a, b, c) {
  "number" !== typeof c && (c = a.length);
  for (var d = 0, e = 0; e < c; ++e)
    b(a[e]) || (e === d ? ++d : box2d.std_iter_swap(a, d++, e));
  return d;
};
box2d.std_lower_bound = function (a, b, c, d, e) {
  "function" !== typeof e &&
    (e = function (a, b) {
      return a < b;
    });
  for (c -= b; 0 < c; ) {
    var f = Math.floor(c / 2),
      g = b + f;
    e(a[g], d) ? ((b = ++g), (c -= f + 1)) : (c = f);
  }
  return b;
};
box2d.std_upper_bound = function (a, b, c, d, e) {
  "function" !== typeof e &&
    (e = function (a, b) {
      return a < b;
    });
  for (c -= b; 0 < c; ) {
    var f = Math.floor(c / 2),
      g = b + f;
    e(d, a[g]) ? (c = f) : ((b = ++g), (c -= f + 1));
  }
  return b;
};
box2d.std_rotate = function (a, b, c, d) {
  for (var e = c; b !== e; )
    box2d.std_iter_swap(a, b++, e++), e === d ? (e = c) : b === c && (c = e);
};
box2d.std_unique = function (a, b, c, d) {
  if (b === c) return c;
  for (var e = b; ++b !== c; ) d(a[e], a[b]) || box2d.std_iter_swap(a, ++e, b);
  return ++e;
};
box2d.b2GrowableBuffer = function (a) {
  this.data = [];
  this.capacity = this.count = 0;
  this.allocator = a;
};
box2d.b2GrowableBuffer.prototype.data = null;
box2d.b2GrowableBuffer.prototype.count = 0;
box2d.b2GrowableBuffer.prototype.capacity = 0;
box2d.b2GrowableBuffer.prototype.allocator = function () {
  return null;
};
box2d.b2GrowableBuffer.prototype.Append = function () {
  this.count >= this.capacity && this.Grow();
  return this.count++;
};
box2d.b2GrowableBuffer.prototype.Reserve = function (a) {
  if (!(this.capacity >= a)) {
    box2d.b2Assert(this.capacity === this.data.length);
    for (var b = this.capacity; b < a; ++b) this.data[b] = this.allocator();
    this.capacity = a;
  }
};
box2d.b2GrowableBuffer.prototype.Grow = function () {
  var a = this.capacity
    ? 2 * this.capacity
    : box2d.b2_minParticleSystemBufferCapacity;
  box2d.b2Assert(a > this.capacity);
  this.Reserve(a);
};
box2d.b2GrowableBuffer.prototype.Free = function () {
  0 !== this.data.length &&
    ((this.data = []), (this.count = this.capacity = 0));
};
box2d.b2GrowableBuffer.prototype.Shorten = function (a) {
  box2d.b2Assert(!1);
};
box2d.b2GrowableBuffer.prototype.Data = function () {
  return this.data;
};
box2d.b2GrowableBuffer.prototype.GetCount = function () {
  return this.count;
};
box2d.b2GrowableBuffer.prototype.SetCount = function (a) {
  box2d.b2Assert(0 <= a && a <= this.capacity);
  this.count = a;
};
box2d.b2GrowableBuffer.prototype.GetCapacity = function () {
  return this.capacity;
};
box2d.b2GrowableBuffer.prototype.RemoveIf = function (a) {
  for (var b = 0, c = 0; c < this.count; ++c) a(this.data[c]) || b++;
  this.count = box2d.std_remove_if(this.data, a, this.count);
  box2d.b2Assert(b === this.count);
};
box2d.b2GrowableBuffer.prototype.Unique = function (a) {
  this.count = box2d.std_unique(this.data, 0, this.count, a);
};
box2d.b2FixtureParticleQueryCallback = function (a) {
  this.m_system = a;
};
goog.inherits(box2d.b2FixtureParticleQueryCallback, box2d.b2QueryCallback);
box2d.b2FixtureParticleQueryCallback.prototype.m_system = null;
box2d.b2FixtureParticleQueryCallback.prototype.ShouldQueryParticleSystem = function (
  a
) {
  return !1;
};
box2d.b2FixtureParticleQueryCallback.prototype.ReportFixture = function (a) {
  if (a.IsSensor()) return !0;
  for (var b = a.GetShape().GetChildCount(), c = 0; c < b; c++)
    for (
      var d = a.GetAABB(c), d = this.m_system.GetInsideBoundsEnumerator(d), e;
      0 <= (e = d.GetNext());

    )
      this.ReportFixtureAndParticle(a, c, e);
  return !0;
};
goog.exportProperty(
  box2d.b2FixtureParticleQueryCallback.prototype,
  "ReportFixture",
  box2d.b2FixtureParticleQueryCallback.prototype.ReportFixture
);
box2d.b2FixtureParticleQueryCallback.prototype.ReportParticle = function (
  a,
  b
) {
  return !1;
};
goog.exportProperty(
  box2d.b2FixtureParticleQueryCallback.prototype,
  "ReportParticle",
  box2d.b2FixtureParticleQueryCallback.prototype.ReportParticle
);
box2d.b2FixtureParticleQueryCallback.prototype.ReportFixtureAndParticle = function (
  a,
  b,
  c
) {
  box2d.b2Assert(!1);
};
goog.exportProperty(
  box2d.b2FixtureParticleQueryCallback.prototype,
  "ReportFixtureAndParticle",
  box2d.b2FixtureParticleQueryCallback.prototype.ReportFixtureAndParticle
);
box2d.b2ParticleContact = function () {
  this.normal = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2ParticleContact", box2d.b2ParticleContact);
box2d.b2ParticleContact.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "indexA",
  box2d.b2ParticleContact.prototype.indexA
);
box2d.b2ParticleContact.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "indexB",
  box2d.b2ParticleContact.prototype.indexB
);
box2d.b2ParticleContact.prototype.weight = 0;
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "weight",
  box2d.b2ParticleContact.prototype.weight
);
box2d.b2ParticleContact.prototype.normal = null;
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "normal",
  box2d.b2ParticleContact.prototype.normal
);
box2d.b2ParticleContact.prototype.flags = 0;
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "flags",
  box2d.b2ParticleContact.prototype.flags
);
box2d.b2ParticleContact.prototype.SetIndices = function (a, b) {
  box2d.b2Assert(
    a <= box2d.b2_maxParticleIndex && b <= box2d.b2_maxParticleIndex
  );
  this.indexA = a;
  this.indexB = b;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "SetIndices",
  box2d.b2ParticleContact.prototype.SetIndices
);
box2d.b2ParticleContact.prototype.SetWeight = function (a) {
  this.weight = a;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "SetWeight",
  box2d.b2ParticleContact.prototype.SetWeight
);
box2d.b2ParticleContact.prototype.SetNormal = function (a) {
  this.normal.Copy(a);
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "SetNormal",
  box2d.b2ParticleContact.prototype.SetNormal
);
box2d.b2ParticleContact.prototype.SetFlags = function (a) {
  this.flags = a;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "SetFlags",
  box2d.b2ParticleContact.prototype.SetFlags
);
box2d.b2ParticleContact.prototype.GetIndexA = function () {
  return this.indexA;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "GetIndexA",
  box2d.b2ParticleContact.prototype.GetIndexA
);
box2d.b2ParticleContact.prototype.GetIndexB = function () {
  return this.indexB;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "GetIndexB",
  box2d.b2ParticleContact.prototype.GetIndexB
);
box2d.b2ParticleContact.prototype.GetWeight = function () {
  return this.weight;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "GetWeight",
  box2d.b2ParticleContact.prototype.GetWeight
);
box2d.b2ParticleContact.prototype.GetNormal = function () {
  return this.normal;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "GetNormal",
  box2d.b2ParticleContact.prototype.GetNormal
);
box2d.b2ParticleContact.prototype.GetFlags = function () {
  return this.flags;
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "GetFlags",
  box2d.b2ParticleContact.prototype.GetFlags
);
box2d.b2ParticleContact.prototype.IsEqual = function (a) {
  return (
    this.indexA === a.indexA &&
    this.indexB === a.indexB &&
    this.flags === a.flags &&
    this.weight === a.weight &&
    this.normal.x === a.normal.x &&
    this.normal.y === a.normal.y
  );
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "IsEqual",
  box2d.b2ParticleContact.prototype.IsEqual
);
box2d.b2ParticleContact.prototype.IsNotEqual = function (a) {
  return !this.IsEqual(a);
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "IsNotEqual",
  box2d.b2ParticleContact.prototype.IsNotEqual
);
box2d.b2ParticleContact.prototype.ApproximatelyEqual = function (a) {
  return (
    this.indexA === a.indexA &&
    this.indexB === a.indexB &&
    this.flags === a.flags &&
    0.01 > box2d.b2Abs(this.weight - a.weight) &&
    1e-4 > box2d.b2DistanceSquared(this.normal, a.normal)
  );
};
goog.exportProperty(
  box2d.b2ParticleContact.prototype,
  "ApproximatelyEqual",
  box2d.b2ParticleContact.prototype.ApproximatelyEqual
);
box2d.b2ParticleBodyContact = function () {
  this.normal = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2ParticleBodyContact", box2d.b2ParticleBodyContact);
box2d.b2ParticleBodyContact.prototype.index = 0;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "index",
  box2d.b2ParticleBodyContact.prototype.index
);
box2d.b2ParticleBodyContact.prototype.body = null;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "body",
  box2d.b2ParticleBodyContact.prototype.body
);
box2d.b2ParticleBodyContact.prototype.fixture = null;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "fixture",
  box2d.b2ParticleBodyContact.prototype.fixture
);
box2d.b2ParticleBodyContact.prototype.weight = 0;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "weight",
  box2d.b2ParticleBodyContact.prototype.weight
);
box2d.b2ParticleBodyContact.prototype.normal = null;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "normal",
  box2d.b2ParticleBodyContact.prototype.normal
);
box2d.b2ParticleBodyContact.prototype.mass = 0;
goog.exportProperty(
  box2d.b2ParticleBodyContact.prototype,
  "mass",
  box2d.b2ParticleBodyContact.prototype.mass
);
box2d.b2ParticlePair = function () {};
goog.exportSymbol("box2d.b2ParticlePair", box2d.b2ParticlePair);
box2d.b2ParticlePair.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2ParticlePair.prototype,
  "indexA",
  box2d.b2ParticlePair.prototype.indexA
);
box2d.b2ParticlePair.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2ParticlePair.prototype,
  "indexB",
  box2d.b2ParticlePair.prototype.indexB
);
box2d.b2ParticlePair.prototype.flags = 0;
goog.exportProperty(
  box2d.b2ParticlePair.prototype,
  "flags",
  box2d.b2ParticlePair.prototype.flags
);
box2d.b2ParticlePair.prototype.strength = 0;
goog.exportProperty(
  box2d.b2ParticlePair.prototype,
  "strength",
  box2d.b2ParticlePair.prototype.strength
);
box2d.b2ParticlePair.prototype.distance = 0;
goog.exportProperty(
  box2d.b2ParticlePair.prototype,
  "distance",
  box2d.b2ParticlePair.prototype.distance
);
box2d.b2ParticleTriad = function () {
  this.pa = new box2d.b2Vec2(0, 0);
  this.pb = new box2d.b2Vec2(0, 0);
  this.pc = new box2d.b2Vec2(0, 0);
};
goog.exportSymbol("box2d.b2ParticleTriad", box2d.b2ParticleTriad);
box2d.b2ParticleTriad.prototype.indexA = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "indexA",
  box2d.b2ParticleTriad.prototype.indexA
);
box2d.b2ParticleTriad.prototype.indexB = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "indexB",
  box2d.b2ParticleTriad.prototype.indexB
);
box2d.b2ParticleTriad.prototype.indexC = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "indexC",
  box2d.b2ParticleTriad.prototype.indexC
);
box2d.b2ParticleTriad.prototype.flags = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "flags",
  box2d.b2ParticleTriad.prototype.flags
);
box2d.b2ParticleTriad.prototype.strength = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "strength",
  box2d.b2ParticleTriad.prototype.strength
);
box2d.b2ParticleTriad.prototype.pa = null;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "pa",
  box2d.b2ParticleTriad.prototype.pa
);
box2d.b2ParticleTriad.prototype.pb = null;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "pb",
  box2d.b2ParticleTriad.prototype.pb
);
box2d.b2ParticleTriad.prototype.pc = null;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "pc",
  box2d.b2ParticleTriad.prototype.pc
);
box2d.b2ParticleTriad.prototype.ka = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "ka",
  box2d.b2ParticleTriad.prototype.ka
);
box2d.b2ParticleTriad.prototype.kb = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "kb",
  box2d.b2ParticleTriad.prototype.kb
);
box2d.b2ParticleTriad.prototype.kc = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "kc",
  box2d.b2ParticleTriad.prototype.kc
);
box2d.b2ParticleTriad.prototype.s = 0;
goog.exportProperty(
  box2d.b2ParticleTriad.prototype,
  "s",
  box2d.b2ParticleTriad.prototype.s
);
box2d.b2ParticleSystemDef = function () {};
goog.exportSymbol("box2d.b2ParticleSystemDef", box2d.b2ParticleSystemDef);
box2d.b2ParticleSystemDef.prototype.strictContactCheck = !1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "strictContactCheck",
  box2d.b2ParticleSystemDef.prototype.strictContactCheck
);
box2d.b2ParticleSystemDef.prototype.density = 1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "density",
  box2d.b2ParticleSystemDef.prototype.density
);
box2d.b2ParticleSystemDef.prototype.gravityScale = 1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "gravityScale",
  box2d.b2ParticleSystemDef.prototype.gravityScale
);
box2d.b2ParticleSystemDef.prototype.radius = 1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "radius",
  box2d.b2ParticleSystemDef.prototype.radius
);
box2d.b2ParticleSystemDef.prototype.maxCount = 0;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "maxCount",
  box2d.b2ParticleSystemDef.prototype.maxCount
);
box2d.b2ParticleSystemDef.prototype.pressureStrength = 0.005;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "pressureStrength",
  box2d.b2ParticleSystemDef.prototype.pressureStrength
);
box2d.b2ParticleSystemDef.prototype.dampingStrength = 1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "dampingStrength",
  box2d.b2ParticleSystemDef.prototype.dampingStrength
);
box2d.b2ParticleSystemDef.prototype.elasticStrength = 0.25;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "elasticStrength",
  box2d.b2ParticleSystemDef.prototype.elasticStrength
);
box2d.b2ParticleSystemDef.prototype.springStrength = 0.25;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "springStrength",
  box2d.b2ParticleSystemDef.prototype.springStrength
);
box2d.b2ParticleSystemDef.prototype.viscousStrength = 0.25;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "viscousStrength",
  box2d.b2ParticleSystemDef.prototype.viscousStrength
);
box2d.b2ParticleSystemDef.prototype.surfaceTensionPressureStrength = 0.2;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "surfaceTensionPressureStrength",
  box2d.b2ParticleSystemDef.prototype.surfaceTensionPressureStrength
);
box2d.b2ParticleSystemDef.prototype.surfaceTensionNormalStrength = 0.2;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "surfaceTensionNormalStrength",
  box2d.b2ParticleSystemDef.prototype.surfaceTensionNormalStrength
);
box2d.b2ParticleSystemDef.prototype.repulsiveStrength = 1;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "repulsiveStrength",
  box2d.b2ParticleSystemDef.prototype.repulsiveStrength
);
box2d.b2ParticleSystemDef.prototype.powderStrength = 0.5;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "powderStrength",
  box2d.b2ParticleSystemDef.prototype.powderStrength
);
box2d.b2ParticleSystemDef.prototype.ejectionStrength = 0.5;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "ejectionStrength",
  box2d.b2ParticleSystemDef.prototype.ejectionStrength
);
box2d.b2ParticleSystemDef.prototype.staticPressureStrength = 0.2;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "staticPressureStrength",
  box2d.b2ParticleSystemDef.prototype.staticPressureStrength
);
box2d.b2ParticleSystemDef.prototype.staticPressureRelaxation = 0.2;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "staticPressureRelaxation",
  box2d.b2ParticleSystemDef.prototype.staticPressureRelaxation
);
box2d.b2ParticleSystemDef.prototype.staticPressureIterations = 8;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "staticPressureIterations",
  box2d.b2ParticleSystemDef.prototype.staticPressureIterations
);
box2d.b2ParticleSystemDef.prototype.colorMixingStrength = 0.5;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "colorMixingStrength",
  box2d.b2ParticleSystemDef.prototype.colorMixingStrength
);
box2d.b2ParticleSystemDef.prototype.destroyByAge = !0;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "destroyByAge",
  box2d.b2ParticleSystemDef.prototype.destroyByAge
);
box2d.b2ParticleSystemDef.prototype.lifetimeGranularity = 1 / 60;
goog.exportProperty(
  box2d.b2ParticleSystemDef.prototype,
  "lifetimeGranularity",
  box2d.b2ParticleSystemDef.prototype.lifetimeGranularity
);
box2d.b2ParticleSystemDef.prototype.Copy = function (a) {
  this.strictContactCheck = a.strictContactCheck;
  this.density = a.density;
  this.gravityScale = a.gravityScale;
  this.radius = a.radius;
  this.maxCount = a.maxCount;
  this.pressureStrength = a.pressureStrength;
  this.dampingStrength = a.dampingStrength;
  this.elasticStrength = a.elasticStrength;
  this.springStrength = a.springStrength;
  this.viscousStrength = a.viscousStrength;
  this.surfaceTensionPressureStrength = a.surfaceTensionPressureStrength;
  this.surfaceTensionNormalStrength = a.surfaceTensionNormalStrength;
  this.repulsiveStrength = a.repulsiveStrength;
  this.powderStrength = a.powderStrength;
  this.ejectionStrength = a.ejectionStrength;
  this.staticPressureStrength = a.staticPressureStrength;
  this.staticPressureRelaxation = a.staticPressureRelaxation;
  this.staticPressureIterations = a.staticPressureIterations;
  this.colorMixingStrength = a.colorMixingStrength;
  this.destroyByAge = a.destroyByAge;
  this.lifetimeGranularity = a.lifetimeGranularity;
  return this;
};
box2d.b2ParticleSystemDef.prototype.Clone = function () {
  return new box2d.b2ParticleSystemDef().Copy(this);
};
box2d.b2ParticleSystem = function (a, b) {
  this._ctor_(a, b);
};
goog.exportSymbol("box2d.b2ParticleSystem", box2d.b2ParticleSystem);
box2d.b2ParticleSystem.prototype.m_paused = !1;
box2d.b2ParticleSystem.prototype.m_timestamp = 0;
box2d.b2ParticleSystem.prototype.m_allParticleFlags = 0;
box2d.b2ParticleSystem.prototype.m_needsUpdateAllParticleFlags = !1;
box2d.b2ParticleSystem.prototype.m_allGroupFlags = 0;
box2d.b2ParticleSystem.prototype.m_needsUpdateAllGroupFlags = !1;
box2d.b2ParticleSystem.prototype.m_hasForce = !1;
box2d.b2ParticleSystem.prototype.m_iterationIndex = 0;
box2d.b2ParticleSystem.prototype.m_inverseDensity = 0;
box2d.b2ParticleSystem.prototype.m_particleDiameter = 0;
box2d.b2ParticleSystem.prototype.m_inverseDiameter = 0;
box2d.b2ParticleSystem.prototype.m_squaredDiameter = 0;
box2d.b2ParticleSystem.prototype.m_count = 0;
box2d.b2ParticleSystem.prototype.m_internalAllocatedCapacity = 0;
box2d.b2ParticleSystem.prototype.m_handleAllocator = null;
box2d.b2ParticleSystem.prototype.m_handleIndexBuffer = null;
box2d.b2ParticleSystem.prototype.m_flagsBuffer = null;
box2d.b2ParticleSystem.prototype.m_positionBuffer = null;
box2d.b2ParticleSystem.prototype.m_velocityBuffer = null;
box2d.b2ParticleSystem.prototype.m_forceBuffer = null;
box2d.b2ParticleSystem.prototype.m_weightBuffer = null;
box2d.b2ParticleSystem.prototype.m_staticPressureBuffer = null;
box2d.b2ParticleSystem.prototype.m_accumulationBuffer = null;
box2d.b2ParticleSystem.prototype.m_accumulation2Buffer = null;
box2d.b2ParticleSystem.prototype.m_depthBuffer = null;
box2d.b2ParticleSystem.prototype.m_colorBuffer = null;
box2d.b2ParticleSystem.prototype.m_groupBuffer = null;
box2d.b2ParticleSystem.prototype.m_userDataBuffer = null;
box2d.b2ParticleSystem.prototype.m_stuckThreshold = 0;
box2d.b2ParticleSystem.prototype.m_lastBodyContactStepBuffer = null;
box2d.b2ParticleSystem.prototype.m_bodyContactCountBuffer = null;
box2d.b2ParticleSystem.prototype.m_consecutiveContactStepsBuffer = null;
box2d.b2ParticleSystem.prototype.m_stuckParticleBuffer = null;
box2d.b2ParticleSystem.prototype.m_proxyBuffer = null;
box2d.b2ParticleSystem.prototype.m_contactBuffer = null;
box2d.b2ParticleSystem.prototype.m_bodyContactBuffer = null;
box2d.b2ParticleSystem.prototype.m_pairBuffer = null;
box2d.b2ParticleSystem.prototype.m_triadBuffer = null;
box2d.b2ParticleSystem.prototype.m_expirationTimeBuffer = null;
box2d.b2ParticleSystem.prototype.m_indexByExpirationTimeBuffer = null;
box2d.b2ParticleSystem.prototype.m_timeElapsed = 0;
box2d.b2ParticleSystem.prototype.m_expirationTimeBufferRequiresSorting = !1;
box2d.b2ParticleSystem.prototype.m_groupCount = 0;
box2d.b2ParticleSystem.prototype.m_groupList = null;
box2d.b2ParticleSystem.prototype.m_def = null;
box2d.b2ParticleSystem.prototype.m_world = null;
box2d.b2ParticleSystem.prototype.m_prev = null;
box2d.b2ParticleSystem.prototype.m_next = null;
box2d.b2ParticleSystem.xTruncBits = 12;
box2d.b2ParticleSystem.yTruncBits = 12;
box2d.b2ParticleSystem.tagBits = 32;
box2d.b2ParticleSystem.yOffset = 1 << (box2d.b2ParticleSystem.yTruncBits - 1);
box2d.b2ParticleSystem.yShift =
  box2d.b2ParticleSystem.tagBits - box2d.b2ParticleSystem.yTruncBits;
box2d.b2ParticleSystem.xShift =
  box2d.b2ParticleSystem.tagBits -
  box2d.b2ParticleSystem.yTruncBits -
  box2d.b2ParticleSystem.xTruncBits;
box2d.b2ParticleSystem.xScale = 1 << box2d.b2ParticleSystem.xShift;
box2d.b2ParticleSystem.xOffset =
  box2d.b2ParticleSystem.xScale *
  (1 << (box2d.b2ParticleSystem.xTruncBits - 1));
box2d.b2ParticleSystem.yMask =
  ((1 << box2d.b2ParticleSystem.yTruncBits) - 1) <<
  box2d.b2ParticleSystem.yShift;
box2d.b2ParticleSystem.xMask = ~box2d.b2ParticleSystem.yMask;
box2d.b2ParticleSystem.computeTag = function (a, b) {
  return (
    ((((b + box2d.b2ParticleSystem.yOffset) >>> 0) <<
      box2d.b2ParticleSystem.yShift) +
      ((box2d.b2ParticleSystem.xScale * a + box2d.b2ParticleSystem.xOffset) >>>
        0)) >>>
    0
  );
};
box2d.b2ParticleSystem.computeRelativeTag = function (a, b, c) {
  return (
    (a +
      (c << box2d.b2ParticleSystem.yShift) +
      (b << box2d.b2ParticleSystem.xShift)) >>>
    0
  );
};
box2d.b2ParticleSystem.FixedSetAllocator = function () {};
box2d.b2ParticleSystem.FixedSetAllocator.prototype.Invalidate = function (a) {};
box2d.b2ParticleSystem.FixtureParticle = function (a, b) {
  this.first = a;
  this.second = b;
};
box2d.b2ParticleSystem.FixtureParticle.prototype.first = null;
box2d.b2ParticleSystem.FixtureParticle.prototype.second =
  box2d.b2_invalidParticleIndex;
box2d.b2ParticleSystem.FixtureParticleSet = function () {};
goog.inherits(
  box2d.b2ParticleSystem.FixtureParticleSet,
  box2d.b2ParticleSystem.FixedSetAllocator
);
box2d.b2ParticleSystem.FixtureParticleSet.prototype.Initialize = function (
  a,
  b
) {};
box2d.b2ParticleSystem.FixtureParticleSet.prototype.Find = function (a) {};
box2d.b2ParticleSystem.ParticlePair = function (a, b) {};
box2d.b2ParticleSystem.ParticlePair.prototype.first =
  box2d.b2_invalidParticleIndex;
box2d.b2ParticleSystem.ParticlePair.prototype.second =
  box2d.b2_invalidParticleIndex;
box2d.b2ParticleSystem.b2ParticlePairSet = function () {};
goog.inherits(
  box2d.b2ParticleSystem.b2ParticlePairSet,
  box2d.b2ParticleSystem.FixedSetAllocator
);
box2d.b2ParticleSystem.b2ParticlePairSet.prototype.Initialize = function (
  a,
  b
) {};
box2d.b2ParticleSystem.b2ParticlePairSet.prototype.Find = function (a) {};
box2d.b2ParticleSystem.ConnectionFilter = function () {};
box2d.b2ParticleSystem.ConnectionFilter.prototype.IsNecessary = function (a) {
  return !0;
};
box2d.b2ParticleSystem.ConnectionFilter.prototype.ShouldCreatePair = function (
  a,
  b
) {
  return !0;
};
box2d.b2ParticleSystem.ConnectionFilter.prototype.ShouldCreateTriad = function (
  a,
  b,
  c
) {
  return !0;
};
box2d.b2ParticleSystem.prototype._ctor_ = function (a, b) {
  this.m_handleIndexBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_flagsBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_positionBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_velocityBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_forceBuffer = [];
  this.m_weightBuffer = [];
  this.m_staticPressureBuffer = [];
  this.m_accumulationBuffer = [];
  this.m_accumulation2Buffer = [];
  this.m_depthBuffer = [];
  this.m_colorBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_groupBuffer = [];
  this.m_userDataBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_lastBodyContactStepBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_bodyContactCountBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_consecutiveContactStepsBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_stuckParticleBuffer = new box2d.b2GrowableBuffer(function () {
    return 0;
  });
  this.m_proxyBuffer = new box2d.b2GrowableBuffer(function () {
    return new box2d.b2ParticleSystem.Proxy();
  });
  this.m_contactBuffer = new box2d.b2GrowableBuffer(function () {
    return new box2d.b2ParticleContact();
  });
  this.m_bodyContactBuffer = new box2d.b2GrowableBuffer(function () {
    return new box2d.b2ParticleBodyContact();
  });
  this.m_pairBuffer = new box2d.b2GrowableBuffer(function () {
    return new box2d.b2ParticlePair();
  });
  this.m_triadBuffer = new box2d.b2GrowableBuffer(function () {
    return new box2d.b2ParticleTriad();
  });
  this.m_expirationTimeBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_indexByExpirationTimeBuffer = new box2d.b2ParticleSystem.UserOverridableBuffer();
  this.m_def = new box2d.b2ParticleSystemDef();
  box2d.b2Assert(null !== a);
  this.SetStrictContactCheck(a.strictContactCheck);
  this.SetDensity(a.density);
  this.SetGravityScale(a.gravityScale);
  this.SetRadius(a.radius);
  this.SetMaxParticleCount(a.maxCount);
  box2d.b2Assert(0 < a.lifetimeGranularity);
  this.m_def = a.Clone();
  this.m_world = b;
  this.SetDestructionByAge(this.m_def.destroyByAge);
};
box2d.b2ParticleSystem.prototype._dtor_ = function () {
  for (; this.m_groupList; ) this.DestroyParticleGroup(this.m_groupList);
  this.FreeUserOverridableBuffer(this.m_handleIndexBuffer);
  this.FreeUserOverridableBuffer(this.m_flagsBuffer);
  this.FreeUserOverridableBuffer(this.m_lastBodyContactStepBuffer);
  this.FreeUserOverridableBuffer(this.m_bodyContactCountBuffer);
  this.FreeUserOverridableBuffer(this.m_consecutiveContactStepsBuffer);
  this.FreeUserOverridableBuffer(this.m_positionBuffer);
  this.FreeUserOverridableBuffer(this.m_velocityBuffer);
  this.FreeUserOverridableBuffer(this.m_colorBuffer);
  this.FreeUserOverridableBuffer(this.m_userDataBuffer);
  this.FreeUserOverridableBuffer(this.m_expirationTimeBuffer);
  this.FreeUserOverridableBuffer(this.m_indexByExpirationTimeBuffer);
  this.FreeBuffer(this.m_forceBuffer, this.m_internalAllocatedCapacity);
  this.FreeBuffer(this.m_weightBuffer, this.m_internalAllocatedCapacity);
  this.FreeBuffer(
    this.m_staticPressureBuffer,
    this.m_internalAllocatedCapacity
  );
  this.FreeBuffer(this.m_accumulationBuffer, this.m_internalAllocatedCapacity);
  this.FreeBuffer(this.m_accumulation2Buffer, this.m_internalAllocatedCapacity);
  this.FreeBuffer(this.m_depthBuffer, this.m_internalAllocatedCapacity);
  this.FreeBuffer(this.m_groupBuffer, this.m_internalAllocatedCapacity);
};
box2d.b2ParticleSystem.prototype.Drop = function () {
  this._dtor_();
};
box2d.b2ParticleSystem.prototype.CreateParticle = function (a) {
  box2d.b2Assert(!1 === this.m_world.IsLocked());
  if (this.m_world.IsLocked()) return 0;
  this.m_count >= this.m_internalAllocatedCapacity &&
    this.ReallocateInternalAllocatedBuffers(
      this.m_count ? 2 * this.m_count : box2d.b2_minParticleSystemBufferCapacity
    );
  if (this.m_count >= this.m_internalAllocatedCapacity)
    if (this.m_def.destroyByAge)
      this.DestroyOldestParticle(0, !1), this.SolveZombie();
    else return box2d.b2_invalidParticleIndex;
  var b = this.m_count++;
  this.m_flagsBuffer.data[b] = 0;
  this.m_lastBodyContactStepBuffer.data &&
    (this.m_lastBodyContactStepBuffer.data[b] = 0);
  this.m_bodyContactCountBuffer.data &&
    (this.m_bodyContactCountBuffer.data[b] = 0);
  this.m_consecutiveContactStepsBuffer.data &&
    (this.m_consecutiveContactStepsBuffer.data[b] = 0);
  this.m_positionBuffer.data[b] = (
    this.m_positionBuffer.data[b] || new box2d.b2Vec2()
  ).Copy(a.position);
  this.m_velocityBuffer.data[b] = (
    this.m_velocityBuffer.data[b] || new box2d.b2Vec2()
  ).Copy(a.velocity);
  this.m_weightBuffer[b] = 0;
  this.m_forceBuffer[b] = (
    this.m_forceBuffer[b] || new box2d.b2Vec2()
  ).SetZero();
  this.m_staticPressureBuffer && (this.m_staticPressureBuffer[b] = 0);
  this.m_depthBuffer && (this.m_depthBuffer[b] = 0);
  if (this.m_colorBuffer.data || !a.color.IsZero())
    (this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data)),
      (this.m_colorBuffer.data[b] = (
        this.m_colorBuffer.data[b] || new box2d.b2ParticleColor()
      ).Copy(a.color));
  if (this.m_userDataBuffer.data || a.userData)
    (this.m_userDataBuffer.data = this.RequestBuffer(
      this.m_userDataBuffer.data
    )),
      (this.m_userDataBuffer.data[b] = a.userData);
  this.m_handleIndexBuffer.data && (this.m_handleIndexBuffer.data[b] = null);
  var c = this.m_proxyBuffer.data[this.m_proxyBuffer.Append()],
    d = 0 < a.lifetime;
  if (this.m_expirationTimeBuffer.data || d)
    this.SetParticleLifetime(
      b,
      d
        ? a.lifetime
        : this.ExpirationTimeToLifetime(-this.GetQuantizedTimeElapsed())
    ),
      (this.m_indexByExpirationTimeBuffer.data[b] = b);
  c.index = b;
  c = a.group;
  if ((this.m_groupBuffer[b] = c))
    c.m_firstIndex < c.m_lastIndex
      ? (this.RotateBuffer(c.m_firstIndex, c.m_lastIndex, b),
        box2d.b2Assert(c.m_lastIndex === b))
      : (c.m_firstIndex = b),
      (c.m_lastIndex = b + 1);
  this.SetParticleFlags(b, a.flags);
  return b;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticle",
  box2d.b2ParticleSystem.prototype.CreateParticle
);
box2d.b2ParticleSystem.prototype.GetParticleHandleFromIndex = function (a) {
  box2d.b2Assert(
    0 <= a && a < this.GetParticleCount() && a !== box2d.b2_invalidParticleIndex
  );
  this.m_handleIndexBuffer.data = this.RequestBuffer(
    this.m_handleIndexBuffer.data
  );
  var b = this.m_handleIndexBuffer.data[a];
  if (b) return b;
  b = new box2d.b2ParticleHandle();
  box2d.b2Assert(null !== b);
  b.SetIndex(a);
  return (this.m_handleIndexBuffer.data[a] = b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleHandleFromIndex",
  box2d.b2ParticleSystem.prototype.GetParticleHandleFromIndex
);
box2d.b2ParticleSystem.prototype.DestroyParticle = function (a, b) {
  var c = box2d.b2ParticleFlag.b2_zombieParticle;
  b && (c |= box2d.b2ParticleFlag.b2_destructionListenerParticle);
  this.SetParticleFlags(a, this.m_flagsBuffer.data[a] | c);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "DestroyParticle",
  box2d.b2ParticleSystem.prototype.DestroyParticle
);
box2d.b2ParticleSystem.prototype.DestroyOldestParticle = function (a, b) {
  var c = this.GetParticleCount();
  box2d.b2Assert(0 <= a && a < c);
  box2d.b2Assert(null !== this.m_indexByExpirationTimeBuffer.data);
  var c = this.m_indexByExpirationTimeBuffer.data[c - (a + 1)],
    d = this.m_indexByExpirationTimeBuffer.data[a];
  this.DestroyParticle(0 < this.m_expirationTimeBuffer.data[c] ? c : d, b);
};
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback = function (a, b, c, d) {
  this.m_system = a;
  this.m_shape = b;
  this.m_xf = c;
  this.m_callDestructionListener = d;
  this.m_destroyed = 0;
};
goog.inherits(
  box2d.b2ParticleSystem.DestroyParticlesInShapeCallback,
  box2d.b2QueryCallback
);
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.m_system = null;
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.m_shape = null;
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.m_xf = null;
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.m_callDestructionListener = !1;
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.m_destroyed = 0;
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.ReportFixture = function (
  a
) {
  return !1;
};
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.ReportParticle = function (
  a,
  b
) {
  if (a !== this.m_system) return !1;
  box2d.b2Assert(0 <= b && b < this.m_system.m_count);
  this.m_shape.TestPoint(this.m_xf, this.m_system.m_positionBuffer.data[b]) &&
    (this.m_system.DestroyParticle(b, this.m_callDestructionListener),
    this.m_destroyed++);
  return !0;
};
box2d.b2ParticleSystem.DestroyParticlesInShapeCallback.prototype.Destroyed = function () {
  return this.m_destroyed;
};
box2d.b2ParticleSystem.prototype.DestroyParticlesInShape = function (a, b, c) {
  var d = box2d.b2ParticleSystem.prototype.DestroyParticlesInShape.s_aabb;
  box2d.b2Assert(!1 === this.m_world.IsLocked());
  if (this.m_world.IsLocked()) return 0;
  c = new box2d.b2ParticleSystem.DestroyParticlesInShapeCallback(this, a, b, c);
  a.ComputeAABB(d, b, 0);
  this.m_world.QueryAABB(c, d);
  return c.Destroyed();
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "DestroyParticlesInShape",
  box2d.b2ParticleSystem.prototype.DestroyParticlesInShape
);
box2d.b2ParticleSystem.prototype.DestroyParticlesInShape.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.CreateParticleGroup = function (a) {
  var b = box2d.b2ParticleSystem.prototype.CreateParticleGroup.s_transform;
  box2d.b2Assert(!1 === this.m_world.IsLocked());
  if (this.m_world.IsLocked()) return null;
  b.Set(a.position, a.angle);
  var c = this.m_count;
  a.shape && this.CreateParticlesWithShapeForGroup(a.shape, a, b);
  a.shapes &&
    this.CreateParticlesWithShapesForGroup(a.shapes, a.shapeCount, a, b);
  if (a.particleCount) {
    box2d.b2Assert(null !== a.positionData);
    for (var d = 0; d < a.particleCount; d++)
      this.CreateParticleForGroup(a, b, a.positionData[d]);
  }
  var e = this.m_count,
    f = new box2d.b2ParticleGroup();
  f.m_system = this;
  f.m_firstIndex = c;
  f.m_lastIndex = e;
  f.m_strength = a.strength;
  f.m_userData = a.userData;
  f.m_transform.Copy(b);
  f.m_prev = null;
  if ((f.m_next = this.m_groupList)) this.m_groupList.m_prev = f;
  this.m_groupList = f;
  ++this.m_groupCount;
  for (d = c; d < e; d++) this.m_groupBuffer[d] = f;
  this.SetGroupFlags(f, a.groupFlags);
  b = new box2d.b2ParticleSystem.ConnectionFilter();
  this.UpdateContacts(!0);
  this.UpdatePairsAndTriads(c, e, b);
  a.group && (this.JoinParticleGroups(a.group, f), (f = a.group));
  return f;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticleGroup",
  box2d.b2ParticleSystem.prototype.CreateParticleGroup
);
box2d.b2ParticleSystem.prototype.CreateParticleGroup.s_transform = new box2d.b2Transform();
box2d.b2ParticleSystem.JoinParticleGroupsFilter = function (a) {
  this.m_threshold = a;
};
goog.inherits(
  box2d.b2ParticleSystem.JoinParticleGroupsFilter,
  box2d.b2ParticleSystem.ConnectionFilter
);
box2d.b2ParticleSystem.JoinParticleGroupsFilter.prototype.m_threshold = 0;
box2d.b2ParticleSystem.JoinParticleGroupsFilter.prototype.ShouldCreatePair = function (
  a,
  b
) {
  return (
    (a < this.m_threshold && this.m_threshold <= b) ||
    (b < this.m_threshold && this.m_threshold <= a)
  );
};
box2d.b2ParticleSystem.JoinParticleGroupsFilter.prototype.ShouldCreateTriad = function (
  a,
  b,
  c
) {
  return (
    (a < this.m_threshold || b < this.m_threshold || c < this.m_threshold) &&
    (this.m_threshold <= a || this.m_threshold <= b || this.m_threshold <= c)
  );
};
box2d.b2ParticleSystem.prototype.JoinParticleGroups = function (a, b) {
  box2d.b2Assert(!1 === this.m_world.IsLocked());
  if (!this.m_world.IsLocked()) {
    box2d.b2Assert(a !== b);
    this.RotateBuffer(b.m_firstIndex, b.m_lastIndex, this.m_count);
    box2d.b2Assert(b.m_lastIndex === this.m_count);
    this.RotateBuffer(a.m_firstIndex, a.m_lastIndex, b.m_firstIndex);
    box2d.b2Assert(a.m_lastIndex === b.m_firstIndex);
    var c = new box2d.b2ParticleSystem.JoinParticleGroupsFilter(b.m_firstIndex);
    this.UpdateContacts(!0);
    this.UpdatePairsAndTriads(a.m_firstIndex, b.m_lastIndex, c);
    for (c = b.m_firstIndex; c < b.m_lastIndex; c++) this.m_groupBuffer[c] = a;
    this.SetGroupFlags(a, a.m_groupFlags | b.m_groupFlags);
    a.m_lastIndex = b.m_lastIndex;
    b.m_firstIndex = b.m_lastIndex;
    this.DestroyParticleGroup(b);
  }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "JoinParticleGroups",
  box2d.b2ParticleSystem.prototype.JoinParticleGroups
);
box2d.b2ParticleSystem.prototype.SplitParticleGroup = function (a) {
  this.UpdateContacts(!0);
  var b = a.GetParticleCount(),
    b = box2d.b2MakeArray(b, function (a) {
      return new box2d.b2ParticleSystem.ParticleListNode();
    });
  box2d.b2ParticleSystem.InitializeParticleLists(a, b);
  this.MergeParticleListsInContact(a, b);
  var c = box2d.b2ParticleSystem.FindLongestParticleList(a, b);
  this.MergeZombieParticleListNodes(a, b, c);
  this.CreateParticleGroupsFromParticleList(a, b, c);
  this.UpdatePairsAndTriadsWithParticleList(a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SplitParticleGroup",
  box2d.b2ParticleSystem.prototype.SplitParticleGroup
);
box2d.b2ParticleSystem.prototype.GetParticleGroupList = function () {
  return this.m_groupList;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleGroupList",
  box2d.b2ParticleSystem.prototype.GetParticleGroupList
);
box2d.b2ParticleSystem.prototype.GetParticleGroupCount = function () {
  return this.m_groupCount;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleGroupCount",
  box2d.b2ParticleSystem.prototype.GetParticleGroupCount
);
box2d.b2ParticleSystem.prototype.GetParticleCount = function () {
  return this.m_count;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleCount",
  box2d.b2ParticleSystem.prototype.GetParticleCount
);
box2d.b2ParticleSystem.prototype.GetMaxParticleCount = function () {
  return this.m_def.maxCount;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetMaxParticleCount",
  box2d.b2ParticleSystem.prototype.GetMaxParticleCount
);
box2d.b2ParticleSystem.prototype.SetMaxParticleCount = function (a) {
  box2d.b2Assert(this.m_count <= a);
  this.m_def.maxCount = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetMaxParticleCount",
  box2d.b2ParticleSystem.prototype.SetMaxParticleCount
);
box2d.b2ParticleSystem.prototype.GetAllParticleFlags = function () {
  return this.m_allParticleFlags;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetAllParticleFlags",
  box2d.b2ParticleSystem.prototype.GetAllParticleFlags
);
box2d.b2ParticleSystem.prototype.GetAllGroupFlags = function () {
  return this.m_allGroupFlags;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetAllGroupFlags",
  box2d.b2ParticleSystem.prototype.GetAllGroupFlags
);
box2d.b2ParticleSystem.prototype.SetPaused = function (a) {
  this.m_paused = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetPaused",
  box2d.b2ParticleSystem.prototype.SetPaused
);
box2d.b2ParticleSystem.prototype.GetPaused = function () {
  return this.m_paused;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetPaused",
  box2d.b2ParticleSystem.prototype.GetPaused
);
box2d.b2ParticleSystem.prototype.SetDensity = function (a) {
  this.m_def.density = a;
  this.m_inverseDensity = 1 / this.m_def.density;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetDensity",
  box2d.b2ParticleSystem.prototype.SetDensity
);
box2d.b2ParticleSystem.prototype.GetDensity = function () {
  return this.m_def.density;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetDensity",
  box2d.b2ParticleSystem.prototype.GetDensity
);
box2d.b2ParticleSystem.prototype.SetGravityScale = function (a) {
  this.m_def.gravityScale = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetGravityScale",
  box2d.b2ParticleSystem.prototype.SetGravityScale
);
box2d.b2ParticleSystem.prototype.GetGravityScale = function () {
  return this.m_def.gravityScale;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetGravityScale",
  box2d.b2ParticleSystem.prototype.GetGravityScale
);
box2d.b2ParticleSystem.prototype.SetDamping = function (a) {
  this.m_def.dampingStrength = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetDamping",
  box2d.b2ParticleSystem.prototype.SetDamping
);
box2d.b2ParticleSystem.prototype.GetDamping = function () {
  return this.m_def.dampingStrength;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetDamping",
  box2d.b2ParticleSystem.prototype.GetDamping
);
box2d.b2ParticleSystem.prototype.SetStaticPressureIterations = function (a) {
  this.m_def.staticPressureIterations = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetStaticPressureIterations",
  box2d.b2ParticleSystem.prototype.SetStaticPressureIterations
);
box2d.b2ParticleSystem.prototype.GetStaticPressureIterations = function () {
  return this.m_def.staticPressureIterations;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetStaticPressureIterations",
  box2d.b2ParticleSystem.prototype.GetStaticPressureIterations
);
box2d.b2ParticleSystem.prototype.SetRadius = function (a) {
  this.m_particleDiameter = 2 * a;
  this.m_squaredDiameter = this.m_particleDiameter * this.m_particleDiameter;
  this.m_inverseDiameter = 1 / this.m_particleDiameter;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetRadius",
  box2d.b2ParticleSystem.prototype.SetRadius
);
box2d.b2ParticleSystem.prototype.GetRadius = function () {
  return this.m_particleDiameter / 2;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetRadius",
  box2d.b2ParticleSystem.prototype.GetRadius
);
box2d.b2ParticleSystem.prototype.GetPositionBuffer = function () {
  return this.m_positionBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetPositionBuffer",
  box2d.b2ParticleSystem.prototype.GetPositionBuffer
);
box2d.b2ParticleSystem.prototype.GetVelocityBuffer = function () {
  return this.m_velocityBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetVelocityBuffer",
  box2d.b2ParticleSystem.prototype.GetVelocityBuffer
);
box2d.b2ParticleSystem.prototype.GetColorBuffer = function () {
  this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data);
  return this.m_colorBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetColorBuffer",
  box2d.b2ParticleSystem.prototype.GetColorBuffer
);
box2d.b2ParticleSystem.prototype.GetGroupBuffer = function () {
  return this.m_groupBuffer;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetGroupBuffer",
  box2d.b2ParticleSystem.prototype.GetGroupBuffer
);
box2d.b2ParticleSystem.prototype.GetWeightBuffer = function () {
  return this.m_weightBuffer;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetWeightBuffer",
  box2d.b2ParticleSystem.prototype.GetWeightBuffer
);
box2d.b2ParticleSystem.prototype.GetUserDataBuffer = function () {
  this.m_userDataBuffer.data = this.RequestBuffer(this.m_userDataBuffer.data);
  return this.m_userDataBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetUserDataBuffer",
  box2d.b2ParticleSystem.prototype.GetUserDataBuffer
);
box2d.b2ParticleSystem.prototype.GetFlagsBuffer = function () {
  return this.m_flagsBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetFlagsBuffer",
  box2d.b2ParticleSystem.prototype.GetFlagsBuffer
);
box2d.b2ParticleSystem.prototype.SetParticleFlags = function (a, b) {
  this.m_flagsBuffer.data[a] & ~b && (this.m_needsUpdateAllParticleFlags = !0);
  ~this.m_allParticleFlags & b &&
    (b & box2d.b2ParticleFlag.b2_tensileParticle &&
      (this.m_accumulation2Buffer = this.RequestBuffer(
        this.m_accumulation2Buffer
      )),
    b & box2d.b2ParticleFlag.b2_colorMixingParticle &&
      (this.m_colorBuffer.data = this.RequestBuffer(this.m_colorBuffer.data)),
    (this.m_allParticleFlags |= b));
  this.m_flagsBuffer.data[a] = b;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetParticleFlags",
  box2d.b2ParticleSystem.prototype.SetParticleFlags
);
box2d.b2ParticleSystem.prototype.GetParticleFlags = function (a) {
  return this.m_flagsBuffer.data[a];
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleFlags",
  box2d.b2ParticleSystem.prototype.GetParticleFlags
);
box2d.b2ParticleSystem.prototype.SetFlagsBuffer = function (a, b) {
  this.SetUserOverridableBuffer(this.m_flagsBuffer, a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetFlagsBuffer",
  box2d.b2ParticleSystem.prototype.SetFlagsBuffer
);
box2d.b2ParticleSystem.prototype.SetPositionBuffer = function (a, b) {
  this.SetUserOverridableBuffer(this.m_positionBuffer, a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetPositionBuffer",
  box2d.b2ParticleSystem.prototype.SetPositionBuffer
);
box2d.b2ParticleSystem.prototype.SetVelocityBuffer = function (a, b) {
  this.SetUserOverridableBuffer(this.m_velocityBuffer, a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetVelocityBuffer",
  box2d.b2ParticleSystem.prototype.SetVelocityBuffer
);
box2d.b2ParticleSystem.prototype.SetColorBuffer = function (a, b) {
  this.SetUserOverridableBuffer(this.m_colorBuffer, a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetColorBuffer",
  box2d.b2ParticleSystem.prototype.SetColorBuffer
);
box2d.b2ParticleSystem.prototype.SetUserDataBuffer = function (a, b) {
  this.SetUserOverridableBuffer(this.m_userDataBuffer, a, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetUserDataBuffer",
  box2d.b2ParticleSystem.prototype.SetUserDataBuffer
);
box2d.b2ParticleSystem.prototype.GetContacts = function () {
  return this.m_contactBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetContacts",
  box2d.b2ParticleSystem.prototype.GetContacts
);
box2d.b2ParticleSystem.prototype.GetContactCount = function () {
  return this.m_contactBuffer.count;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetContactCount",
  box2d.b2ParticleSystem.prototype.GetContactCount
);
box2d.b2ParticleSystem.prototype.GetBodyContacts = function () {
  return this.m_bodyContactBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetBodyContacts",
  box2d.b2ParticleSystem.prototype.GetBodyContacts
);
box2d.b2ParticleSystem.prototype.GetBodyContactCount = function () {
  return this.m_bodyContactBuffer.count;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetBodyContactCount",
  box2d.b2ParticleSystem.prototype.GetBodyContactCount
);
box2d.b2ParticleSystem.prototype.GetPairs = function () {
  return this.m_pairBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetPairs",
  box2d.b2ParticleSystem.prototype.GetPairs
);
box2d.b2ParticleSystem.prototype.GetPairCount = function () {
  return this.m_pairBuffer.count;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetPairCount",
  box2d.b2ParticleSystem.prototype.GetPairCount
);
box2d.b2ParticleSystem.prototype.GetTriads = function () {
  return this.m_triadBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetTriads",
  box2d.b2ParticleSystem.prototype.GetTriads
);
box2d.b2ParticleSystem.prototype.GetTriadCount = function () {
  return this.m_triadBuffer.count;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetTriadCount",
  box2d.b2ParticleSystem.prototype.GetTriadCount
);
box2d.b2ParticleSystem.prototype.SetStuckThreshold = function (a) {
  this.m_stuckThreshold = a;
  0 < a &&
    ((this.m_lastBodyContactStepBuffer.data = this.RequestBuffer(
      this.m_lastBodyContactStepBuffer.data
    )),
    (this.m_bodyContactCountBuffer.data = this.RequestBuffer(
      this.m_bodyContactCountBuffer.data
    )),
    (this.m_consecutiveContactStepsBuffer.data = this.RequestBuffer(
      this.m_consecutiveContactStepsBuffer.data
    )));
};
box2d.b2ParticleSystem.prototype.GetStuckCandidates = function () {
  return this.m_stuckParticleBuffer.Data();
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetStuckCandidates",
  box2d.b2ParticleSystem.prototype.GetStuckCandidates
);
box2d.b2ParticleSystem.prototype.GetStuckCandidateCount = function () {
  return this.m_stuckParticleBuffer.GetCount();
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetStuckCandidateCount",
  box2d.b2ParticleSystem.prototype.GetStuckCandidateCount
);
box2d.b2ParticleSystem.prototype.ComputeCollisionEnergy = function () {
  for (
    var a = box2d.b2ParticleSystem.prototype.ComputeCollisionEnergy.s_v,
      b = this.m_velocityBuffer.data,
      c = 0,
      d = 0;
    d < this.m_contactBuffer.count;
    d++
  ) {
    var e = this.m_contactBuffer.data[d],
      f = e.normal,
      e = box2d.b2Sub_V2_V2(b[e.indexB], b[e.indexA], a),
      f = box2d.b2Dot_V2_V2(e, f);
    0 > f && (c += f * f);
  }
  return 0.5 * this.GetParticleMass() * c;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ComputeCollisionEnergy",
  box2d.b2ParticleSystem.prototype.ComputeCollisionEnergy
);
box2d.b2ParticleSystem.prototype.ComputeCollisionEnergy.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SetStrictContactCheck = function (a) {
  this.m_def.strictContactCheck = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetStrictContactCheck",
  box2d.b2ParticleSystem.prototype.SetStrictContactCheck
);
box2d.b2ParticleSystem.prototype.GetStrictContactCheck = function () {
  return this.m_def.strictContactCheck;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetStrictContactCheck",
  box2d.b2ParticleSystem.prototype.GetStrictContactCheck
);
box2d.b2ParticleSystem.prototype.SetParticleLifetime = function (a, b) {
  box2d.b2Assert(this.ValidateParticleIndex(a));
  var c = null === this.m_indexByExpirationTimeBuffer.data;
  this.m_expirationTimeBuffer.data = this.RequestBuffer(
    this.m_expirationTimeBuffer.data
  );
  this.m_indexByExpirationTimeBuffer.data = this.RequestBuffer(
    this.m_indexByExpirationTimeBuffer.data
  );
  if (c)
    for (var c = this.GetParticleCount(), d = 0; d < c; ++d)
      this.m_indexByExpirationTimeBuffer.data[d] = d;
  c = b / this.m_def.lifetimeGranularity;
  c = 0 < c ? this.GetQuantizedTimeElapsed() + c : c;
  c !== this.m_expirationTimeBuffer.data[a] &&
    ((this.m_expirationTimeBuffer.data[a] = c),
    (this.m_expirationTimeBufferRequiresSorting = !0));
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetParticleLifetime",
  box2d.b2ParticleSystem.prototype.SetParticleLifetime
);
box2d.b2ParticleSystem.prototype.GetParticleLifetime = function (a) {
  box2d.b2Assert(this.ValidateParticleIndex(a));
  return this.ExpirationTimeToLifetime(this.GetExpirationTimeBuffer()[a]);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetParticleLifetime",
  box2d.b2ParticleSystem.prototype.GetParticleLifetime
);
box2d.b2ParticleSystem.prototype.SetDestructionByAge = function (a) {
  a && this.GetExpirationTimeBuffer();
  this.m_def.destroyByAge = a;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "SetDestructionByAge",
  box2d.b2ParticleSystem.prototype.SetDestructionByAge
);
box2d.b2ParticleSystem.prototype.GetDestructionByAge = function () {
  return this.m_def.destroyByAge;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetDestructionByAge",
  box2d.b2ParticleSystem.prototype.GetDestructionByAge
);
box2d.b2ParticleSystem.prototype.GetExpirationTimeBuffer = function () {
  this.m_expirationTimeBuffer.data = this.RequestBuffer(
    this.m_expirationTimeBuffer.data
  );
  return this.m_expirationTimeBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetExpirationTimeBuffer",
  box2d.b2ParticleSystem.prototype.GetExpirationTimeBuffer
);
box2d.b2ParticleSystem.prototype.ExpirationTimeToLifetime = function (a) {
  return (
    (0 < a ? a - this.GetQuantizedTimeElapsed() : a) *
    this.m_def.lifetimeGranularity
  );
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ExpirationTimeToLifetime",
  box2d.b2ParticleSystem.prototype.ExpirationTimeToLifetime
);
box2d.b2ParticleSystem.prototype.GetIndexByExpirationTimeBuffer = function () {
  this.GetParticleCount()
    ? this.SetParticleLifetime(0, this.GetParticleLifetime(0))
    : (this.m_indexByExpirationTimeBuffer.data = this.RequestBuffer(
        this.m_indexByExpirationTimeBuffer.data
      ));
  return this.m_indexByExpirationTimeBuffer.data;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetIndexByExpirationTimeBuffer",
  box2d.b2ParticleSystem.prototype.GetIndexByExpirationTimeBuffer
);
box2d.b2ParticleSystem.prototype.ParticleApplyLinearImpulse = function (a, b) {
  this.ApplyLinearImpulse(a, a + 1, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ParticleApplyLinearImpulse",
  box2d.b2ParticleSystem.prototype.ParticleApplyLinearImpulse
);
box2d.b2ParticleSystem.prototype.ApplyLinearImpulse = function (a, b, c) {
  var d = this.m_velocityBuffer.data,
    e = (b - a) * this.GetParticleMass();
  for (c = c.Clone().SelfMul(1 / e); a < b; a++) d[a].SelfAdd(c);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ApplyLinearImpulse",
  box2d.b2ParticleSystem.prototype.ApplyLinearImpulse
);
box2d.b2ParticleSystem.IsSignificantForce = function (a) {
  return 0 !== a.x || 0 !== a.y;
};
box2d.b2ParticleSystem.prototype.ParticleApplyForce = function (a, b) {
  box2d.b2ParticleSystem.IsSignificantForce(b) &&
    this.ForceCanBeApplied(this.m_flagsBuffer.data[a]) &&
    (this.PrepareForceBuffer(), this.m_forceBuffer[a].SelfAdd(b));
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ParticleApplyForce",
  box2d.b2ParticleSystem.prototype.ParticleApplyForce
);
box2d.b2ParticleSystem.prototype.ApplyForce = function (a, b, c) {
  for (var d = 0, e = a; e < b; e++) d |= this.m_flagsBuffer.data[e];
  box2d.b2Assert(this.ForceCanBeApplied(d));
  c = c.Clone().SelfMul(1 / (b - a));
  if (box2d.b2ParticleSystem.IsSignificantForce(c))
    for (this.PrepareForceBuffer(), e = a; e < b; e++)
      this.m_forceBuffer[e].SelfAdd(c);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ApplyForce",
  box2d.b2ParticleSystem.prototype.ApplyForce
);
box2d.b2ParticleSystem.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "GetNext",
  box2d.b2ParticleSystem.prototype.GetNext
);
box2d.b2ParticleSystem.prototype.QueryAABB = function (a, b) {
  if (0 !== this.m_proxyBuffer.count)
    for (
      var c = this.m_proxyBuffer.count,
        d = box2d.std_lower_bound(
          this.m_proxyBuffer.data,
          0,
          c,
          box2d.b2ParticleSystem.computeTag(
            this.m_inverseDiameter * b.lowerBound.x,
            this.m_inverseDiameter * b.lowerBound.y
          ),
          box2d.b2ParticleSystem.Proxy.CompareProxyTag
        ),
        c = box2d.std_upper_bound(
          this.m_proxyBuffer.data,
          d,
          c,
          box2d.b2ParticleSystem.computeTag(
            this.m_inverseDiameter * b.upperBound.x,
            this.m_inverseDiameter * b.upperBound.y
          ),
          box2d.b2ParticleSystem.Proxy.CompareTagProxy
        ),
        e = this.m_positionBuffer.data;
      d < c;
      ++d
    ) {
      var f = this.m_proxyBuffer.data[d].index,
        g = e[f];
      if (
        b.lowerBound.x < g.x &&
        g.x < b.upperBound.x &&
        b.lowerBound.y < g.y &&
        g.y < b.upperBound.y &&
        !a.ReportParticle(this, f)
      )
        break;
    }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "QueryAABB",
  box2d.b2ParticleSystem.prototype.QueryAABB
);
box2d.b2ParticleSystem.prototype.QueryShapeAABB = function (a, b, c, d) {
  var e = box2d.b2ParticleSystem.prototype.QueryShapeAABB.s_aabb;
  b.ComputeAABB(e, c, d || 0);
  this.QueryAABB(a, e);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "QueryShapeAABB",
  box2d.b2ParticleSystem.prototype.QueryShapeAABB
);
box2d.b2ParticleSystem.prototype.QueryShapeAABB.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.QueryPointAABB = function (a, b, c) {
  var d = box2d.b2ParticleSystem.prototype.QueryPointAABB.s_aabb;
  c = "number" === typeof c ? c : box2d.b2_linearSlop;
  d.lowerBound.Set(b.x - c, b.y - c);
  d.upperBound.Set(b.x + c, b.y + c);
  this.QueryAABB(a, d);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "QueryPointAABB",
  box2d.b2ParticleSystem.prototype.QueryPointAABB
);
box2d.b2ParticleSystem.prototype.QueryPointAABB.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.RayCast = function (a, b, c) {
  var d = box2d.b2ParticleSystem.prototype.RayCast.s_aabb,
    e = box2d.b2ParticleSystem.prototype.RayCast.s_p,
    f = box2d.b2ParticleSystem.prototype.RayCast.s_v,
    g = box2d.b2ParticleSystem.prototype.RayCast.s_n,
    h = box2d.b2ParticleSystem.prototype.RayCast.s_point;
  if (0 !== this.m_proxyBuffer.count) {
    var k = this.m_positionBuffer.data;
    box2d.b2Min_V2_V2(b, c, d.lowerBound);
    box2d.b2Max_V2_V2(b, c, d.upperBound);
    var l = 1;
    c = box2d.b2Sub_V2_V2(c, b, f);
    for (
      var f = box2d.b2Dot_V2_V2(c, c), d = this.GetInsideBoundsEnumerator(d), m;
      0 <= (m = d.GetNext());

    ) {
      var n = box2d.b2Sub_V2_V2(b, k[m], e),
        p = box2d.b2Dot_V2_V2(n, c),
        q = box2d.b2Dot_V2_V2(n, n),
        q = p * p - f * (q - this.m_squaredDiameter);
      if (0 <= q) {
        var r = box2d.b2Sqrt(q),
          q = (-p - r) / f;
        if (!(q > l)) {
          if (0 > q && ((q = (-p + r) / f), 0 > q || q > l)) continue;
          n = box2d.b2AddMul_V2_S_V2(n, q, c, g);
          n.Normalize();
          m = a.ReportParticle(
            this,
            m,
            box2d.b2AddMul_V2_S_V2(b, q, c, h),
            n,
            q
          );
          l = box2d.b2Min(l, m);
          if (0 >= l) break;
        }
      }
    }
  }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "RayCast",
  box2d.b2ParticleSystem.prototype.RayCast
);
box2d.b2ParticleSystem.prototype.RayCast.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.RayCast.s_p = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.RayCast.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.RayCast.s_n = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.RayCast.s_point = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.ComputeAABB = function (a) {
  var b = this.GetParticleCount();
  box2d.b2Assert(null !== a);
  a.lowerBound.x = +box2d.b2_maxFloat;
  a.lowerBound.y = +box2d.b2_maxFloat;
  a.upperBound.x = -box2d.b2_maxFloat;
  a.upperBound.y = -box2d.b2_maxFloat;
  for (var c = this.m_positionBuffer.data, d = 0; d < b; d++) {
    var e = c[d];
    box2d.b2Min_V2_V2(a.lowerBound, e, a.lowerBound);
    box2d.b2Max_V2_V2(a.upperBound, e, a.upperBound);
  }
  a.lowerBound.x -= this.m_particleDiameter;
  a.lowerBound.y -= this.m_particleDiameter;
  a.upperBound.x += this.m_particleDiameter;
  a.upperBound.y += this.m_particleDiameter;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "ComputeAABB",
  box2d.b2ParticleSystem.prototype.ComputeAABB
);
box2d.b2ParticleSystem.UserOverridableBuffer = function () {};
box2d.b2ParticleSystem.UserOverridableBuffer.prototype.data = null;
box2d.b2ParticleSystem.UserOverridableBuffer.prototype.userSuppliedCapacity = 0;
box2d.b2ParticleSystem.Proxy = function () {};
box2d.b2ParticleSystem.Proxy.prototype.index = box2d.b2_invalidParticleIndex;
box2d.b2ParticleSystem.Proxy.prototype.tag = 0;
box2d.b2ParticleSystem.Proxy.CompareProxyProxy = function (a, b) {
  return a.tag < b.tag;
};
box2d.b2ParticleSystem.Proxy.CompareTagProxy = function (a, b) {
  return a < b.tag;
};
box2d.b2ParticleSystem.Proxy.CompareProxyTag = function (a, b) {
  return a.tag < b;
};
box2d.b2ParticleSystem.InsideBoundsEnumerator = function (a, b, c, d, e) {
  this.m_system = a;
  this.m_xLower = (b & box2d.b2ParticleSystem.xMask) >>> 0;
  this.m_xUpper = (c & box2d.b2ParticleSystem.xMask) >>> 0;
  this.m_yLower = (b & box2d.b2ParticleSystem.yMask) >>> 0;
  this.m_yUpper = (c & box2d.b2ParticleSystem.yMask) >>> 0;
  this.m_first = d;
  this.m_last = e;
  box2d.b2Assert(this.m_first <= this.m_last);
};
box2d.b2ParticleSystem.InsideBoundsEnumerator.prototype.GetNext = function () {
  for (; this.m_first < this.m_last; ) {
    var a =
        (this.m_system.m_proxyBuffer.data[this.m_first].tag &
          box2d.b2ParticleSystem.xMask) >>>
        0,
      b =
        (this.m_system.m_proxyBuffer.data[this.m_first].tag &
          box2d.b2ParticleSystem.yMask) >>>
        0;
    box2d.b2Assert(b >= this.m_yLower);
    box2d.b2Assert(b <= this.m_yUpper);
    if (a >= this.m_xLower && a <= this.m_xUpper)
      return this.m_system.m_proxyBuffer.data[this.m_first++].index;
    this.m_first++;
  }
  return box2d.b2_invalidParticleIndex;
};
box2d.b2ParticleSystem.ParticleListNode = function () {};
box2d.b2ParticleSystem.ParticleListNode.prototype.list = null;
box2d.b2ParticleSystem.ParticleListNode.prototype.next = null;
box2d.b2ParticleSystem.ParticleListNode.prototype.count = 0;
box2d.b2ParticleSystem.ParticleListNode.prototype.index = 0;
box2d.b2ParticleSystem.k_pairFlags = box2d.b2ParticleFlag.b2_springParticle;
box2d.b2ParticleSystem.k_triadFlags = box2d.b2ParticleFlag.b2_elasticParticle;
box2d.b2ParticleSystem.k_noPressureFlags =
  box2d.b2ParticleFlag.b2_powderParticle |
  box2d.b2ParticleFlag.b2_tensileParticle;
box2d.b2ParticleSystem.k_extraDampingFlags =
  box2d.b2ParticleFlag.b2_staticPressureParticle;
box2d.b2ParticleSystem.k_barrierWallFlags =
  box2d.b2ParticleFlag.b2_barrierParticle |
  box2d.b2ParticleFlag.b2_wallParticle;
box2d.b2ParticleSystem.prototype.FreeBuffer = function (a, b) {
  null !== a && (a.length = 0);
};
box2d.b2ParticleSystem.prototype.FreeUserOverridableBuffer = function (a) {
  0 == a.userSuppliedCapacity &&
    this.FreeBuffer(a.data, this.m_internalAllocatedCapacity);
};
box2d.b2ParticleSystem.prototype.ReallocateBuffer3 = function (a, b, c) {
  box2d.b2Assert(c > b);
  a = a ? a.slice() : [];
  a.length = c;
  return a;
};
box2d.b2ParticleSystem.prototype.ReallocateBuffer5 = function (a, b, c, d, e) {
  box2d.b2Assert(d > c);
  box2d.b2Assert(!b || d <= b);
  (e && !a) || b || (a = this.ReallocateBuffer3(a, c, d));
  return a;
};
box2d.b2ParticleSystem.prototype.ReallocateBuffer4 = function (a, b, c, d) {
  box2d.b2Assert(c > b);
  return this.ReallocateBuffer5(a.data, a.userSuppliedCapacity, b, c, d);
};
box2d.b2ParticleSystem.prototype.RequestBuffer = function (a) {
  a ||
    (0 === this.m_internalAllocatedCapacity &&
      this.ReallocateInternalAllocatedBuffers(
        box2d.b2_minParticleSystemBufferCapacity
      ),
    (a = []),
    (a.length = this.m_internalAllocatedCapacity));
  return a;
};
box2d.b2ParticleSystem.prototype.ReallocateHandleBuffers = function (a) {
  box2d.b2Assert(a > this.m_internalAllocatedCapacity);
  this.m_handleIndexBuffer.data = this.ReallocateBuffer4(
    this.m_handleIndexBuffer,
    this.m_internalAllocatedCapacity,
    a,
    !0
  );
};
box2d.b2ParticleSystem.prototype.ReallocateInternalAllocatedBuffers = function (
  a
) {
  function b(a, b) {
    return b && a > b ? b : a;
  }
  a = b(a, this.m_def.maxCount);
  a = b(a, this.m_flagsBuffer.userSuppliedCapacity);
  a = b(a, this.m_positionBuffer.userSuppliedCapacity);
  a = b(a, this.m_velocityBuffer.userSuppliedCapacity);
  a = b(a, this.m_colorBuffer.userSuppliedCapacity);
  a = b(a, this.m_userDataBuffer.userSuppliedCapacity);
  if (this.m_internalAllocatedCapacity < a) {
    this.ReallocateHandleBuffers(a);
    this.m_flagsBuffer.data = this.ReallocateBuffer4(
      this.m_flagsBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    var c = 0 < this.m_stuckThreshold;
    this.m_lastBodyContactStepBuffer.data = this.ReallocateBuffer4(
      this.m_lastBodyContactStepBuffer,
      this.m_internalAllocatedCapacity,
      a,
      c
    );
    this.m_bodyContactCountBuffer.data = this.ReallocateBuffer4(
      this.m_bodyContactCountBuffer,
      this.m_internalAllocatedCapacity,
      a,
      c
    );
    this.m_consecutiveContactStepsBuffer.data = this.ReallocateBuffer4(
      this.m_consecutiveContactStepsBuffer,
      this.m_internalAllocatedCapacity,
      a,
      c
    );
    this.m_positionBuffer.data = this.ReallocateBuffer4(
      this.m_positionBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_velocityBuffer.data = this.ReallocateBuffer4(
      this.m_velocityBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_forceBuffer = this.ReallocateBuffer5(
      this.m_forceBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_weightBuffer = this.ReallocateBuffer5(
      this.m_weightBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_staticPressureBuffer = this.ReallocateBuffer5(
      this.m_staticPressureBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_accumulationBuffer = this.ReallocateBuffer5(
      this.m_accumulationBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_accumulation2Buffer = this.ReallocateBuffer5(
      this.m_accumulation2Buffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_depthBuffer = this.ReallocateBuffer5(
      this.m_depthBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_colorBuffer.data = this.ReallocateBuffer4(
      this.m_colorBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_groupBuffer = this.ReallocateBuffer5(
      this.m_groupBuffer,
      0,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_userDataBuffer.data = this.ReallocateBuffer4(
      this.m_userDataBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_expirationTimeBuffer.data = this.ReallocateBuffer4(
      this.m_expirationTimeBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !0
    );
    this.m_indexByExpirationTimeBuffer.data = this.ReallocateBuffer4(
      this.m_indexByExpirationTimeBuffer,
      this.m_internalAllocatedCapacity,
      a,
      !1
    );
    this.m_internalAllocatedCapacity = a;
  }
};
box2d.b2ParticleSystem.prototype.CreateParticleForGroup = function (a, b, c) {
  var d = new box2d.b2ParticleDef();
  d.flags = a.flags;
  box2d.b2Mul_X_V2(b, c, d.position);
  box2d.b2Add_V2_V2(
    a.linearVelocity,
    box2d.b2Cross_S_V2(
      a.angularVelocity,
      box2d.b2Sub_V2_V2(d.position, a.position, box2d.b2Vec2.s_t0),
      box2d.b2Vec2.s_t0
    ),
    d.velocity
  );
  d.color.Copy(a.color);
  d.lifetime = a.lifetime;
  d.userData = a.userData;
  this.CreateParticle(d);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticleForGroup",
  box2d.b2ParticleSystem.prototype.CreateParticleForGroup
);
box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup = function (
  a,
  b,
  c
) {
  var d =
      box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup
        .s_edge,
    e = box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup.s_d,
    f = box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup.s_p,
    g = b.stride;
  0 === g && (g = this.GetParticleStride());
  for (var h = 0, k = a.GetChildCount(), l = 0; l < k; l++) {
    var m = null;
    a.GetType() === box2d.b2ShapeType.e_edgeShape
      ? (m = a)
      : (box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_chainShape),
        (m = d),
        a.GetChildEdge(m, l));
    for (
      var n = box2d.b2Sub_V2_V2(m.m_vertex2, m.m_vertex1, e), p = n.Length();
      h < p;

    ) {
      var q = box2d.b2AddMul_V2_S_V2(m.m_vertex1, h / p, n, f);
      this.CreateParticleForGroup(b, c, q);
      h += g;
    }
    h -= p;
  }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticlesStrokeShapeForGroup",
  box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup
);
box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup.s_edge = new box2d.b2EdgeShape();
box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup.s_d = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.CreateParticlesStrokeShapeForGroup.s_p = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup = function (
  a,
  b,
  c
) {
  var d =
      box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup.s_aabb,
    e = box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup.s_p,
    f = b.stride;
  0 === f && (f = this.GetParticleStride());
  var g = box2d.b2Transform.IDENTITY;
  box2d.b2Assert(1 === a.GetChildCount());
  a.ComputeAABB(d, g, 0);
  for (var h = Math.floor(d.lowerBound.y / f) * f; h < d.upperBound.y; h += f)
    for (
      var k = Math.floor(d.lowerBound.x / f) * f;
      k < d.upperBound.x;
      k += f
    ) {
      var l = e.Set(k, h);
      a.TestPoint(g, l) && this.CreateParticleForGroup(b, c, l);
    }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticlesFillShapeForGroup",
  box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup
);
box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.CreateParticlesFillShapeForGroup.s_p = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.CreateParticlesWithShapeForGroup = function (
  a,
  b,
  c
) {
  switch (a.GetType()) {
    case box2d.b2ShapeType.e_edgeShape:
    case box2d.b2ShapeType.e_chainShape:
      this.CreateParticlesStrokeShapeForGroup(a, b, c);
      break;
    case box2d.b2ShapeType.e_polygonShape:
    case box2d.b2ShapeType.e_circleShape:
      this.CreateParticlesFillShapeForGroup(a, b, c);
      break;
    default:
      box2d.b2Assert(!1);
  }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticlesWithShapeForGroup",
  box2d.b2ParticleSystem.prototype.CreateParticlesWithShapeForGroup
);
box2d.b2ParticleSystem.CompositeShape = function (a, b) {
  this.m_shapes = a;
  this.m_shapeCount = b;
};
goog.inherits(box2d.b2ParticleSystem.CompositeShape, box2d.b2Shape);
box2d.b2ParticleSystem.CompositeShape.prototype.m_shapes = null;
box2d.b2ParticleSystem.CompositeShape.prototype.m_shapeCount = 0;
box2d.b2ParticleSystem.CompositeShape.prototype.Clone = function () {
  box2d.b2Assert(!1);
  return null;
};
box2d.b2ParticleSystem.CompositeShape.prototype.GetChildCount = function () {
  return 1;
};
box2d.b2ParticleSystem.CompositeShape.prototype.TestPoint = function (a, b) {
  for (var c = 0; c < this.m_shapeCount; c++)
    if (this.m_shapes[c].TestPoint(a, b)) return !0;
  return !1;
};
goog.exportProperty(
  box2d.b2ParticleSystem.CompositeShape.prototype,
  "TestPoint",
  box2d.b2ParticleSystem.CompositeShape.prototype.TestPoint
);
box2d.b2ParticleSystem.CompositeShape.prototype.ComputeDistance = function (
  a,
  b,
  c,
  d
) {
  box2d.b2Assert(!1);
  return 0;
};
goog.exportProperty(
  box2d.b2ParticleSystem.CompositeShape.prototype,
  "ComputeDistance",
  box2d.b2ParticleSystem.CompositeShape.prototype.ComputeDistance
);
box2d.b2ParticleSystem.CompositeShape.prototype.RayCast = function (
  a,
  b,
  c,
  d
) {
  box2d.b2Assert(!1);
  return !1;
};
goog.exportProperty(
  box2d.b2ParticleSystem.CompositeShape.prototype,
  "RayCast",
  box2d.b2ParticleSystem.CompositeShape.prototype.RayCast
);
box2d.b2ParticleSystem.CompositeShape.prototype.ComputeAABB = function (
  a,
  b,
  c
) {
  var d = new box2d.b2AABB();
  a.lowerBound.x = +box2d.b2_maxFloat;
  a.lowerBound.y = +box2d.b2_maxFloat;
  a.upperBound.x = -box2d.b2_maxFloat;
  a.upperBound.y = -box2d.b2_maxFloat;
  box2d.b2Assert(0 === c);
  for (c = 0; c < this.m_shapeCount; c++)
    for (var e = this.m_shapes[c].GetChildCount(), f = 0; f < e; f++) {
      var g = d;
      this.m_shapes[c].ComputeAABB(g, b, f);
      a.Combine1(g);
    }
};
goog.exportProperty(
  box2d.b2ParticleSystem.CompositeShape.prototype,
  "ComputeAABB",
  box2d.b2ParticleSystem.CompositeShape.prototype.ComputeAABB
);
box2d.b2ParticleSystem.CompositeShape.prototype.ComputeMass = function (a, b) {
  box2d.b2Assert(!1);
};
goog.exportProperty(
  box2d.b2ParticleSystem.CompositeShape.prototype,
  "ComputeMass",
  box2d.b2ParticleSystem.CompositeShape.prototype.ComputeMass
);
box2d.b2ParticleSystem.prototype.CreateParticlesWithShapesForGroup = function (
  a,
  b,
  c,
  d
) {
  a = new box2d.b2ParticleSystem.CompositeShape(a, b);
  this.CreateParticlesFillShapeForGroup(a, c, d);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CreateParticlesWithShapesForGroup",
  box2d.b2ParticleSystem.prototype.CreateParticlesWithShapesForGroup
);
box2d.b2ParticleSystem.prototype.CloneParticle = function (a, b) {
  var c = new box2d.b2ParticleDef();
  c.flags = this.m_flagsBuffer.data[a];
  c.position.Copy(this.m_positionBuffer.data[a]);
  c.velocity.Copy(this.m_velocityBuffer.data[a]);
  this.m_colorBuffer.data && c.color.Copy(this.m_colorBuffer.data[a]);
  this.m_userDataBuffer.data && (c.userData = this.m_userDataBuffer.data[a]);
  c.group = b;
  c = this.CreateParticle(c);
  if (this.m_handleIndexBuffer.data) {
    var d = this.m_handleIndexBuffer.data[a];
    d && d.SetIndex(c);
    this.m_handleIndexBuffer.data[c] = d;
    this.m_handleIndexBuffer.data[a] = null;
  }
  this.m_lastBodyContactStepBuffer.data &&
    (this.m_lastBodyContactStepBuffer.data[
      c
    ] = this.m_lastBodyContactStepBuffer.data[a]);
  this.m_bodyContactCountBuffer.data &&
    (this.m_bodyContactCountBuffer.data[c] = this.m_bodyContactCountBuffer.data[
      a
    ]);
  this.m_consecutiveContactStepsBuffer.data &&
    (this.m_consecutiveContactStepsBuffer.data[
      c
    ] = this.m_consecutiveContactStepsBuffer.data[a]);
  this.m_hasForce && this.m_forceBuffer[c].Copy(this.m_forceBuffer[a]);
  this.m_staticPressureBuffer &&
    (this.m_staticPressureBuffer[c] = this.m_staticPressureBuffer[a]);
  this.m_depthBuffer && (this.m_depthBuffer[c] = this.m_depthBuffer[a]);
  this.m_expirationTimeBuffer.data &&
    (this.m_expirationTimeBuffer.data[c] = this.m_expirationTimeBuffer.data[a]);
  return c;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "CloneParticle",
  box2d.b2ParticleSystem.prototype.CloneParticle
);
box2d.b2ParticleSystem.prototype.DestroyParticlesInGroup = function (a, b) {
  for (var c = a.m_firstIndex; c < a.m_lastIndex; c++)
    this.DestroyParticle(c, b);
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "DestroyParticlesInGroup",
  box2d.b2ParticleSystem.prototype.DestroyParticlesInGroup
);
box2d.b2ParticleSystem.prototype.DestroyParticleGroup = function (a) {
  box2d.b2Assert(0 < this.m_groupCount);
  box2d.b2Assert(null !== a);
  this.m_world.m_destructionListener &&
    this.m_world.m_destructionListener.SayGoodbyeParticleGroup(a);
  this.SetGroupFlags(a, 0);
  for (var b = a.m_firstIndex; b < a.m_lastIndex; b++)
    this.m_groupBuffer[b] = null;
  a.m_prev && (a.m_prev.m_next = a.m_next);
  a.m_next && (a.m_next.m_prev = a.m_prev);
  a === this.m_groupList && (this.m_groupList = a.m_next);
  --this.m_groupCount;
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "DestroyParticleGroup",
  box2d.b2ParticleSystem.prototype.DestroyParticleGroup
);
box2d.b2ParticleSystem.ParticleCanBeConnected = function (a, b) {
  return (
    0 !==
      (a &
        (box2d.b2ParticleFlag.b2_wallParticle |
          box2d.b2ParticleFlag.b2_springParticle |
          box2d.b2ParticleFlag.b2_elasticParticle)) ||
    (null !== b &&
      0 !==
        (b.GetGroupFlags() & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup))
  );
};
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads = function (a, b, c) {
  var d = box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dab,
    e = box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dbc,
    f = box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dca,
    g = this.m_positionBuffer.data;
  box2d.b2Assert(a <= b);
  for (var h = 0, k = a; k < b; k++) h |= this.m_flagsBuffer.data[k];
  if (h & box2d.b2ParticleSystem.k_pairFlags)
    for (k = 0; k < this.m_contactBuffer.count; k++) {
      var l = this.m_contactBuffer.data[k],
        m = l.indexA,
        n = l.indexB,
        p = this.m_flagsBuffer.data[m],
        q = this.m_flagsBuffer.data[n],
        r = this.m_groupBuffer[m],
        u = this.m_groupBuffer[n];
      m >= a &&
        m < b &&
        n >= a &&
        n < b &&
        !((p | q) & box2d.b2ParticleFlag.b2_zombieParticle) &&
        (p | q) & box2d.b2ParticleSystem.k_pairFlags &&
        (c.IsNecessary(m) || c.IsNecessary(n)) &&
        box2d.b2ParticleSystem.ParticleCanBeConnected(p, r) &&
        box2d.b2ParticleSystem.ParticleCanBeConnected(q, u) &&
        c.ShouldCreatePair(m, n) &&
        ((p = this.m_pairBuffer.data[this.m_pairBuffer.Append()]),
        (p.indexA = m),
        (p.indexB = n),
        (p.flags = l.flags),
        (p.strength = box2d.b2Min(r ? r.m_strength : 1, u ? u.m_strength : 1)),
        (p.distance = box2d.b2Distance(g[m], g[n])));
      box2d.std_stable_sort(
        this.m_pairBuffer.data,
        0,
        this.m_pairBuffer.count,
        box2d.b2ParticleSystem.ComparePairIndices
      );
      this.m_pairBuffer.Unique(box2d.b2ParticleSystem.MatchPairIndices);
    }
  if (h & box2d.b2ParticleSystem.k_triadFlags) {
    h = new box2d.b2VoronoiDiagram(b - a);
    l = 0;
    for (k = a; k < b; k++)
      (m = this.m_flagsBuffer.data[k]),
        (n = this.m_groupBuffer[k]),
        m & box2d.b2ParticleFlag.b2_zombieParticle ||
          !box2d.b2ParticleSystem.ParticleCanBeConnected(m, n) ||
          (c.IsNecessary(k) && ++l, h.AddGenerator(g[k], k, c.IsNecessary(k)));
    if (0 === l) for (k = a; k < b; k++) c.IsNecessary(k);
    a = this.GetParticleStride();
    h.Generate(a / 2, 2 * a);
    var t = this;
    h.GetNodes(function (a, b, h) {
      var k = t.m_flagsBuffer.data[a],
        l = t.m_flagsBuffer.data[b],
        m = t.m_flagsBuffer.data[h];
      if (
        (k | l | m) & box2d.b2ParticleSystem.k_triadFlags &&
        c.ShouldCreateTriad(a, b, h)
      ) {
        var n = g[a],
          p = g[b],
          q = g[h],
          r = box2d.b2Sub_V2_V2(n, p, d),
          u = box2d.b2Sub_V2_V2(p, q, e),
          C = box2d.b2Sub_V2_V2(q, n, f),
          A = box2d.b2_maxTriadDistanceSquared * t.m_squaredDiameter;
        if (
          !(
            box2d.b2Dot_V2_V2(r, r) > A ||
            box2d.b2Dot_V2_V2(u, u) > A ||
            box2d.b2Dot_V2_V2(C, C) > A
          )
        ) {
          var K = t.m_groupBuffer[a],
            J = t.m_groupBuffer[b],
            D = t.m_groupBuffer[h],
            A = t.m_triadBuffer.data[t.m_triadBuffer.Append()];
          A.indexA = a;
          A.indexB = b;
          A.indexC = h;
          A.flags = k | l | m;
          A.strength = box2d.b2Min(
            box2d.b2Min(K ? K.m_strength : 1, J ? J.m_strength : 1),
            D ? D.m_strength : 1
          );
          a = (n.x + p.x + q.x) / 3;
          b = (n.y + p.y + q.y) / 3;
          A.pa.x = n.x - a;
          A.pa.y = n.y - b;
          A.pb.x = p.x - a;
          A.pb.y = p.y - b;
          A.pc.x = q.x - a;
          A.pc.y = q.y - b;
          A.ka = -box2d.b2Dot_V2_V2(C, r);
          A.kb = -box2d.b2Dot_V2_V2(r, u);
          A.kc = -box2d.b2Dot_V2_V2(u, C);
          A.s =
            box2d.b2Cross_V2_V2(n, p) +
            box2d.b2Cross_V2_V2(p, q) +
            box2d.b2Cross_V2_V2(q, n);
        }
      }
    });
    box2d.std_stable_sort(
      this.m_triadBuffer.data,
      0,
      this.m_triadBuffer.count,
      box2d.b2ParticleSystem.CompareTriadIndices
    );
    this.m_triadBuffer.Unique(box2d.b2ParticleSystem.MatchTriadIndices);
  }
};
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dab = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dbc = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriads.s_dca = new box2d.b2Vec2();
box2d.b2ParticleSystem.ReactiveFilter = function (a) {
  this.m_flagsBuffer = a;
};
goog.inherits(
  box2d.b2ParticleSystem.ReactiveFilter,
  box2d.b2ParticleSystem.ConnectionFilter
);
box2d.b2ParticleSystem.ReactiveFilter.prototype.m_flagsBuffer = null;
box2d.b2ParticleSystem.ReactiveFilter.prototype.IsNecessary = function (a) {
  return (
    0 !== (this.m_flagsBuffer[a] & box2d.b2ParticleFlag.b2_reactiveParticle)
  );
};
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriadsWithReactiveParticles = function () {
  var a = new box2d.b2ParticleSystem.ReactiveFilter(this.m_flagsBuffer);
  this.UpdatePairsAndTriads(0, this.m_count, a);
  for (a = 0; a < this.m_count; a++)
    this.m_flagsBuffer.data[a] &= ~box2d.b2ParticleFlag.b2_reactiveParticle;
  this.m_allParticleFlags &= ~box2d.b2ParticleFlag.b2_reactiveParticle;
};
box2d.b2ParticleSystem.ComparePairIndices = function (a, b) {
  var c = a.indexA - b.indexA;
  return 0 !== c ? 0 > c : a.indexB < b.indexB;
};
box2d.b2ParticleSystem.MatchPairIndices = function (a, b) {
  return a.indexA === b.indexA && a.indexB === b.indexB;
};
box2d.b2ParticleSystem.CompareTriadIndices = function (a, b) {
  var c = a.indexA - b.indexA;
  if (0 !== c) return 0 > c;
  c = a.indexB - b.indexB;
  return 0 !== c ? 0 > c : a.indexC < b.indexC;
};
box2d.b2ParticleSystem.MatchTriadIndices = function (a, b) {
  return (
    a.indexA === b.indexA && a.indexB === b.indexB && a.indexC === b.indexC
  );
};
box2d.b2ParticleSystem.InitializeParticleLists = function (a, b) {
  for (
    var c = a.GetBufferIndex(), d = a.GetParticleCount(), e = 0;
    e < d;
    e++
  ) {
    var f = b[e];
    f.list = f;
    f.next = null;
    f.count = 1;
    f.index = e + c;
  }
};
box2d.b2ParticleSystem.prototype.MergeParticleListsInContact = function (a, b) {
  for (var c = a.GetBufferIndex(), d = 0; d < this.m_contactBuffer.count; d++) {
    var e = this.m_contactBuffer.data[d],
      f = e.indexA,
      e = e.indexB;
    if (
      a.ContainsParticle(f) &&
      a.ContainsParticle(e) &&
      ((f = b[f - c].list), (e = b[e - c].list), f !== e)
    ) {
      if (f.count < e.count)
        var g = f,
          f = e,
          e = g;
      box2d.b2Assert(f.count >= e.count);
      box2d.b2ParticleSystem.MergeParticleLists(f, e);
    }
  }
};
box2d.b2ParticleSystem.MergeParticleLists = function (a, b) {
  box2d.b2Assert(a !== b);
  for (var c = b; ; ) {
    c.list = a;
    var d = c.next;
    if (d) c = d;
    else {
      c.next = a.next;
      break;
    }
  }
  a.next = b;
  a.count += b.count;
  b.count = 0;
};
box2d.b2ParticleSystem.FindLongestParticleList = function (a, b) {
  for (var c = a.GetParticleCount(), d = b[0], e = 0; e < c; e++) {
    var f = b[e];
    d.count < f.count && (d = f);
  }
  return d;
};
box2d.b2ParticleSystem.prototype.MergeZombieParticleListNodes = function (
  a,
  b,
  c
) {
  a = a.GetParticleCount();
  for (var d = 0; d < a; d++) {
    var e = b[d];
    e !== c &&
      this.m_flagsBuffer.data[e.index] &
        box2d.b2ParticleFlag.b2_zombieParticle &&
      box2d.b2ParticleSystem.MergeParticleListAndNode(c, e);
  }
};
box2d.b2ParticleSystem.MergeParticleListAndNode = function (a, b) {
  box2d.b2Assert(b !== a);
  box2d.b2Assert(b.list === b);
  box2d.b2Assert(1 === b.count);
  b.list = a;
  b.next = a.next;
  a.next = b;
  a.count++;
  b.count = 0;
};
box2d.b2ParticleSystem.prototype.CreateParticleGroupsFromParticleList = function (
  a,
  b,
  c
) {
  var d = a.GetParticleCount(),
    e = new box2d.b2ParticleGroupDef();
  e.groupFlags = a.GetGroupFlags();
  e.userData = a.GetUserData();
  for (a = 0; a < d; a++) {
    var f = b[a];
    if (f.count && f !== c) {
      box2d.b2Assert(f.list === f);
      for (var g = this.CreateParticleGroup(e); f; f = f.next) {
        var h = f.index;
        box2d.b2Assert(
          !(this.m_flagsBuffer.data[h] & box2d.b2ParticleFlag.b2_zombieParticle)
        );
        var k = this.CloneParticle(h, g);
        this.m_flagsBuffer.data[h] |= box2d.b2ParticleFlag.b2_zombieParticle;
        f.index = k;
      }
    }
  }
};
box2d.b2ParticleSystem.prototype.UpdatePairsAndTriadsWithParticleList = function (
  a,
  b
) {
  for (var c = a.GetBufferIndex(), d = 0; d < this.m_pairBuffer.count; d++) {
    var e = this.m_pairBuffer.data[d],
      f = e.indexA,
      g = e.indexB;
    a.ContainsParticle(f) && (e.indexA = b[f - c].index);
    a.ContainsParticle(g) && (e.indexB = b[g - c].index);
  }
  for (d = 0; d < this.m_triadBuffer.count; d++) {
    var e = this.m_triadBuffer.data[d],
      f = e.indexA,
      g = e.indexB,
      h = e.indexC;
    a.ContainsParticle(f) && (e.indexA = b[f - c].index);
    a.ContainsParticle(g) && (e.indexB = b[g - c].index);
    a.ContainsParticle(h) && (e.indexC = b[h - c].index);
  }
};
box2d.b2ParticleSystem.prototype.ComputeDepth = function () {
  for (var a = [], b = 0, c = 0; c < this.m_contactBuffer.count; c++) {
    var d = this.m_contactBuffer.data[c],
      e = d.indexA,
      f = d.indexB,
      g = this.m_groupBuffer[e],
      h = this.m_groupBuffer[f];
    g &&
      g === h &&
      g.m_groupFlags &
        box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth &&
      (a[b++] = d);
  }
  g = [];
  h = 0;
  for (c = this.m_groupList; c; c = c.GetNext())
    if (
      c.m_groupFlags &
      box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth
    )
      for (
        g[h++] = c,
          this.SetGroupFlags(
            c,
            c.m_groupFlags &
              ~box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth
          ),
          f = c.m_firstIndex;
        f < c.m_lastIndex;
        f++
      )
        this.m_accumulationBuffer[f] = 0;
  for (c = 0; c < b; c++) {
    var d = a[c],
      e = d.indexA,
      f = d.indexB,
      k = d.weight;
    this.m_accumulationBuffer[e] += k;
    this.m_accumulationBuffer[f] += k;
  }
  box2d.b2Assert(null !== this.m_depthBuffer);
  for (f = 0; f < h; f++)
    for (c = g[f], f = c.m_firstIndex; f < c.m_lastIndex; f++)
      (k = this.m_accumulationBuffer[f]),
        (this.m_depthBuffer[f] = 0.8 > k ? 0 : box2d.b2_maxFloat);
  for (var k = box2d.b2Sqrt(this.m_count) >> 0, l = 0; l < k; l++) {
    for (var m = !1, c = 0; c < b; c++) {
      var d = a[c],
        e = d.indexA,
        f = d.indexB,
        n = 1 - d.weight,
        d = this.m_depthBuffer[e],
        p = this.m_depthBuffer[f],
        q = p + n,
        n = d + n;
      d > q && ((this.m_depthBuffer[e] = q), (m = !0));
      p > n && ((this.m_depthBuffer[f] = n), (m = !0));
    }
    if (!m) break;
  }
  for (f = 0; f < h; f++)
    for (c = g[f], f = c.m_firstIndex; f < c.m_lastIndex; f++)
      this.m_depthBuffer[f] =
        this.m_depthBuffer[f] < box2d.b2_maxFloat
          ? this.m_depthBuffer[f] * this.m_particleDiameter
          : 0;
};
box2d.b2ParticleSystem.prototype.GetInsideBoundsEnumerator = function (a) {
  var b = box2d.b2ParticleSystem.computeTag(
    this.m_inverseDiameter * a.lowerBound.x - 1,
    this.m_inverseDiameter * a.lowerBound.y - 1
  );
  a = box2d.b2ParticleSystem.computeTag(
    this.m_inverseDiameter * a.upperBound.x + 1,
    this.m_inverseDiameter * a.upperBound.y + 1
  );
  var c = this.m_proxyBuffer.count,
    d = box2d.std_lower_bound(
      this.m_proxyBuffer.data,
      0,
      c,
      b,
      box2d.b2ParticleSystem.Proxy.CompareProxyTag
    ),
    e = box2d.std_upper_bound(
      this.m_proxyBuffer.data,
      0,
      c,
      a,
      box2d.b2ParticleSystem.Proxy.CompareTagProxy
    );
  box2d.b2Assert(0 <= d);
  box2d.b2Assert(d <= e);
  box2d.b2Assert(e <= c);
  return new box2d.b2ParticleSystem.InsideBoundsEnumerator(this, b, a, d, e);
};
box2d.b2ParticleSystem.prototype.UpdateAllParticleFlags = function () {
  for (var a = (this.m_allParticleFlags = 0); a < this.m_count; a++)
    this.m_allParticleFlags |= this.m_flagsBuffer.data[a];
  this.m_needsUpdateAllParticleFlags = !1;
};
box2d.b2ParticleSystem.prototype.UpdateAllGroupFlags = function () {
  this.m_allGroupFlags = 0;
  for (var a = this.m_groupList; a; a = a.GetNext())
    this.m_allGroupFlags |= a.m_groupFlags;
  this.m_needsUpdateAllGroupFlags = !1;
};
box2d.b2ParticleSystem.prototype.AddContact = function (a, b, c) {
  var d = box2d.b2ParticleSystem.prototype.AddContact.s_d,
    e = this.m_positionBuffer.data;
  box2d.b2Assert(c === this.m_contactBuffer);
  c = box2d.b2Sub_V2_V2(e[b], e[a], d);
  d = box2d.b2Dot_V2_V2(c, c);
  if (d < this.m_squaredDiameter) {
    e = box2d.b2InvSqrt(d);
    isFinite(e) || (e = 1.9817753699999998e19);
    var f = this.m_contactBuffer.data[this.m_contactBuffer.Append()];
    f.indexA = a;
    f.indexB = b;
    f.flags = this.m_flagsBuffer.data[a] | this.m_flagsBuffer.data[b];
    f.weight = 1 - d * e * this.m_inverseDiameter;
    box2d.b2Mul_S_V2(e, c, f.normal);
  }
};
box2d.b2ParticleSystem.prototype.AddContact.s_d = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.FindContacts_Reference = function (a) {
  box2d.b2Assert(a === this.m_contactBuffer);
  a = this.m_proxyBuffer.count;
  for (var b = (this.m_contactBuffer.count = 0), c = 0; b < a; b++) {
    for (
      var d = box2d.b2ParticleSystem.computeRelativeTag(
          this.m_proxyBuffer.data[b].tag,
          1,
          0
        ),
        e = b + 1;
      e < a && !(d < this.m_proxyBuffer.data[e].tag);
      e++
    )
      this.AddContact(
        this.m_proxyBuffer.data[b].index,
        this.m_proxyBuffer.data[e].index,
        this.m_contactBuffer
      );
    for (
      e = box2d.b2ParticleSystem.computeRelativeTag(
        this.m_proxyBuffer.data[b].tag,
        -1,
        1
      );
      c < a && !(e <= this.m_proxyBuffer.data[c].tag);
      c++
    );
    d = box2d.b2ParticleSystem.computeRelativeTag(
      this.m_proxyBuffer.data[b].tag,
      1,
      1
    );
    for (e = c; e < a && !(d < this.m_proxyBuffer.data[e].tag); e++)
      this.AddContact(
        this.m_proxyBuffer.data[b].index,
        this.m_proxyBuffer.data[e].index,
        this.m_contactBuffer
      );
  }
};
box2d.b2ParticleSystem.prototype.FindContacts = function (a) {
  this.FindContacts_Reference(a);
};
box2d.b2ParticleSystem.prototype.UpdateProxies_Reference = function (a) {
  box2d.b2Assert(a === this.m_proxyBuffer);
  a = this.m_positionBuffer.data;
  for (
    var b = this.m_inverseDiameter, c = 0;
    c < this.m_proxyBuffer.count;
    ++c
  ) {
    var d = this.m_proxyBuffer.data[c],
      e = a[d.index];
    d.tag = box2d.b2ParticleSystem.computeTag(b * e.x, b * e.y);
  }
};
box2d.b2ParticleSystem.prototype.UpdateProxies = function (a) {
  this.UpdateProxies_Reference(a);
};
box2d.b2ParticleSystem.prototype.SortProxies = function (a) {
  box2d.b2Assert(a === this.m_proxyBuffer);
  box2d.std_sort(
    this.m_proxyBuffer.data,
    0,
    this.m_proxyBuffer.count,
    box2d.b2ParticleSystem.Proxy.CompareProxyProxy
  );
};
box2d.b2ParticleSystem.prototype.FilterContacts = function (a) {
  var b = this.GetParticleContactFilter();
  if (null !== b) {
    box2d.b2Assert(a === this.m_contactBuffer);
    var c = this;
    this.m_contactBuffer.RemoveIf(function (a) {
      return (
        a.flags & box2d.b2ParticleFlag.b2_particleContactFilterParticle &&
        !b.ShouldCollideParticleParticle(c, a.indexA, a.indexB)
      );
    });
  }
};
box2d.b2ParticleSystem.prototype.NotifyContactListenerPreContact = function (
  a
) {
  if (null !== this.GetParticleContactListener())
    throw (a.Initialize(this.m_contactBuffer, this.m_flagsBuffer), Error());
};
box2d.b2ParticleSystem.prototype.NotifyContactListenerPostContact = function (
  a
) {
  a = this.GetParticleContactListener();
  if (null !== a) {
    for (var b = 0; b < this.m_contactBuffer.count; ++b)
      a.BeginContactParticleParticle(this, this.m_contactBuffer.data[b]);
    throw Error();
  }
};
box2d.b2ParticleSystem.b2ParticleContactIsZombie = function (a) {
  return (
    (a.flags & box2d.b2ParticleFlag.b2_zombieParticle) ===
    box2d.b2ParticleFlag.b2_zombieParticle
  );
};
box2d.b2ParticleSystem.prototype.UpdateContacts = function (a) {
  this.UpdateProxies(this.m_proxyBuffer);
  this.SortProxies(this.m_proxyBuffer);
  var b = new box2d.b2ParticleSystem.b2ParticlePairSet();
  this.NotifyContactListenerPreContact(b);
  this.FindContacts(this.m_contactBuffer);
  this.FilterContacts(this.m_contactBuffer);
  this.NotifyContactListenerPostContact(b);
  a &&
    this.m_contactBuffer.RemoveIf(
      box2d.b2ParticleSystem.b2ParticleContactIsZombie
    );
};
box2d.b2ParticleSystem.prototype.NotifyBodyContactListenerPreContact = function (
  a
) {
  if (null !== this.GetFixtureContactListener())
    throw (a.Initialize(this.m_bodyContactBuffer, this.m_flagsBuffer), Error());
};
box2d.b2ParticleSystem.prototype.NotifyBodyContactListenerPostContact = function (
  a
) {
  a = this.GetFixtureContactListener();
  if (null !== a) {
    for (var b = 0; b < this.m_bodyContactBuffer.count; b++) {
      var c = this.m_bodyContactBuffer.data[b];
      box2d.b2Assert(null !== c);
      a.BeginContactFixtureParticle(this, c);
    }
    throw Error();
  }
};
box2d.b2ParticleSystem.UpdateBodyContactsCallback = function (a, b) {
  box2d.b2FixtureParticleQueryCallback.call(this, a);
  this.m_contactFilter = b;
};
goog.inherits(
  box2d.b2ParticleSystem.UpdateBodyContactsCallback,
  box2d.b2FixtureParticleQueryCallback
);
box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype.ShouldCollideFixtureParticle = function (
  a,
  b,
  c
) {
  return this.m_contactFilter &&
    this.m_system.GetFlagsBuffer()[c] &
      box2d.b2ParticleFlag.b2_fixtureContactFilterParticle
    ? this.m_contactFilter.ShouldCollideFixtureParticle(a, this.m_system, c)
    : !0;
};
goog.exportProperty(
  box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype,
  "ShouldCollideFixtureParticle",
  box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype
    .ShouldCollideFixtureParticle
);
box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype.ReportFixtureAndParticle = function (
  a,
  b,
  c
) {
  var d =
      box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype
        .ReportFixtureAndParticle.s_rp,
    e = this.m_system.m_positionBuffer.data[c],
    f =
      box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype
        .ReportFixtureAndParticle.s_n;
  b = a.ComputeDistance(e, f, b);
  if (
    b < this.m_system.m_particleDiameter &&
    this.ShouldCollideFixtureParticle(a, this.m_system, c)
  ) {
    var g = a.GetBody(),
      h = g.GetWorldCenter(),
      k = g.GetMass(),
      l = g.GetInertia() - k * g.GetLocalCenter().LengthSquared(),
      k = 0 < k ? 1 / k : 0,
      l = 0 < l ? 1 / l : 0,
      m =
        this.m_system.m_flagsBuffer.data[c] &
        box2d.b2ParticleFlag.b2_wallParticle
          ? 0
          : this.m_system.GetParticleInvMass(),
      d = box2d.b2Sub_V2_V2(e, h, d),
      d = box2d.b2Cross_V2_V2(d, f),
      d = m + k + l * d * d,
      e = this.m_system.m_bodyContactBuffer.data[
        this.m_system.m_bodyContactBuffer.Append()
      ];
    e.index = c;
    e.body = g;
    e.fixture = a;
    e.weight = 1 - b * this.m_system.m_inverseDiameter;
    e.normal.Copy(f.SelfNeg());
    e.mass = 0 < d ? 1 / d : 0;
    this.m_system.DetectStuckParticle(c);
  }
};
goog.exportProperty(
  box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype,
  "ReportFixtureAndParticle",
  box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype
    .ReportFixtureAndParticle
);
box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype.ReportFixtureAndParticle.s_n = new box2d.b2Vec2();
box2d.b2ParticleSystem.UpdateBodyContactsCallback.prototype.ReportFixtureAndParticle.s_rp = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.UpdateBodyContacts = function () {
  var a = box2d.b2ParticleSystem.prototype.UpdateBodyContacts.s_aabb,
    b = new box2d.b2ParticleSystem.FixtureParticleSet();
  this.NotifyBodyContactListenerPreContact(b);
  if (0 < this.m_stuckThreshold)
    for (var c = this.GetParticleCount(), d = 0; d < c; d++)
      (this.m_bodyContactCountBuffer.data[d] = 0),
        this.m_timestamp > this.m_lastBodyContactStepBuffer.data[d] + 1 &&
          (this.m_consecutiveContactStepsBuffer.data[d] = 0);
  this.m_bodyContactBuffer.SetCount(0);
  this.m_stuckParticleBuffer.SetCount(0);
  this.ComputeAABB(a);
  c = new box2d.b2ParticleSystem.UpdateBodyContactsCallback(
    this,
    this.GetFixtureContactFilter()
  );
  this.m_world.QueryAABB(c, a);
  this.m_def.strictContactCheck && this.RemoveSpuriousBodyContacts();
  this.NotifyBodyContactListenerPostContact(b);
};
box2d.b2ParticleSystem.prototype.UpdateBodyContacts.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.Solve = function (a) {
  var b = box2d.b2ParticleSystem.prototype.Solve.s_subStep;
  if (
    0 !== this.m_count &&
    (this.m_expirationTimeBuffer.data && this.SolveLifetimes(a),
    this.m_allParticleFlags & box2d.b2ParticleFlag.b2_zombieParticle &&
      this.SolveZombie(),
    this.m_needsUpdateAllParticleFlags && this.UpdateAllParticleFlags(),
    this.m_needsUpdateAllGroupFlags && this.UpdateAllGroupFlags(),
    !this.m_paused)
  )
    for (
      this.m_iterationIndex = 0;
      this.m_iterationIndex < a.particleIterations;
      this.m_iterationIndex++
    ) {
      ++this.m_timestamp;
      var c = b.Copy(a);
      c.dt /= a.particleIterations;
      c.inv_dt *= a.particleIterations;
      this.UpdateContacts(!1);
      this.UpdateBodyContacts();
      this.ComputeWeight();
      this.m_allGroupFlags &
        box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth &&
        this.ComputeDepth();
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_reactiveParticle &&
        this.UpdatePairsAndTriadsWithReactiveParticles();
      this.m_hasForce && this.SolveForce(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_viscousParticle &&
        this.SolveViscous();
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_repulsiveParticle &&
        this.SolveRepulsive(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_powderParticle &&
        this.SolvePowder(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_tensileParticle &&
        this.SolveTensile(c);
      this.m_allGroupFlags & box2d.b2ParticleGroupFlag.b2_solidParticleGroup &&
        this.SolveSolid(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_colorMixingParticle &&
        this.SolveColorMixing();
      this.SolveGravity(c);
      this.m_allParticleFlags &
        box2d.b2ParticleFlag.b2_staticPressureParticle &&
        this.SolveStaticPressure(c);
      this.SolvePressure(c);
      this.SolveDamping(c);
      this.m_allParticleFlags & box2d.b2ParticleSystem.k_extraDampingFlags &&
        this.SolveExtraDamping();
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_elasticParticle &&
        this.SolveElastic(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_springParticle &&
        this.SolveSpring(c);
      this.LimitVelocity(c);
      this.m_allGroupFlags & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup &&
        this.SolveRigidDamping();
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_barrierParticle &&
        this.SolveBarrier(c);
      this.SolveCollision(c);
      this.m_allGroupFlags & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup &&
        this.SolveRigid(c);
      this.m_allParticleFlags & box2d.b2ParticleFlag.b2_wallParticle &&
        this.SolveWall();
      for (var d = 0; d < this.m_count; d++)
        this.m_positionBuffer.data[d].SelfMulAdd(
          c.dt,
          this.m_velocityBuffer.data[d]
        );
    }
};
goog.exportProperty(
  box2d.b2ParticleSystem.prototype,
  "Solve",
  box2d.b2ParticleSystem.prototype.Solve
);
box2d.b2ParticleSystem.prototype.Solve.s_subStep = new box2d.b2TimeStep();
box2d.b2ParticleSystem.SolveCollisionCallback = function (a, b) {
  box2d.b2FixtureParticleQueryCallback.call(this, a);
  this.m_step = b;
};
goog.inherits(
  box2d.b2ParticleSystem.SolveCollisionCallback,
  box2d.b2FixtureParticleQueryCallback
);
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle = function (
  a,
  b,
  c
) {
  var d =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_p1,
    e =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_output,
    f =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_input,
    g =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_p,
    h =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_v,
    k =
      box2d.b2ParticleSystem.SolveCollisionCallback.prototype
        .ReportFixtureAndParticle.s_f,
    l = a.GetBody(),
    m = this.m_system.m_positionBuffer.data[c],
    n = this.m_system.m_velocityBuffer.data[c];
  0 === this.m_system.m_iterationIndex
    ? ((d = box2d.b2MulT_X_V2(l.m_xf0, m, d)),
      a.GetShape().GetType() === box2d.b2ShapeType.e_circleShape &&
        (d.SelfSub(l.GetLocalCenter()),
        box2d.b2Mul_R_V2(l.m_xf0.q, d, d),
        box2d.b2MulT_R_V2(l.m_xf.q, d, d),
        d.SelfAdd(l.GetLocalCenter())),
      box2d.b2Mul_X_V2(l.m_xf, d, f.p1))
    : f.p1.Copy(m);
  box2d.b2AddMul_V2_S_V2(m, this.m_step.dt, n, f.p2);
  f.maxFraction = 1;
  a.RayCast(e, f, b) &&
    ((a = e.normal),
    (g.x =
      (1 - e.fraction) * f.p1.x +
      e.fraction * f.p2.x +
      box2d.b2_linearSlop * a.x),
    (g.y =
      (1 - e.fraction) * f.p1.y +
      e.fraction * f.p2.y +
      box2d.b2_linearSlop * a.y),
    (h.x = this.m_step.inv_dt * (g.x - m.x)),
    (h.y = this.m_step.inv_dt * (g.y - m.y)),
    this.m_system.m_velocityBuffer.data[c].Copy(h),
    (k.x = this.m_step.inv_dt * this.m_system.GetParticleMass() * (n.x - h.x)),
    (k.y = this.m_step.inv_dt * this.m_system.GetParticleMass() * (n.y - h.y)),
    this.m_system.ParticleApplyForce(c, k));
};
goog.exportProperty(
  box2d.b2ParticleSystem.SolveCollisionCallback.prototype,
  "ReportFixtureAndParticle",
  box2d.b2ParticleSystem.SolveCollisionCallback.prototype
    .ReportFixtureAndParticle
);
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_p1 = new box2d.b2Vec2();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_output = new box2d.b2RayCastOutput();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_input = new box2d.b2RayCastInput();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_p = new box2d.b2Vec2();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportFixtureAndParticle.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportParticle = function (
  a,
  b
) {
  return !1;
};
goog.exportProperty(
  box2d.b2ParticleSystem.SolveCollisionCallback.prototype,
  "ReportParticle",
  box2d.b2ParticleSystem.SolveCollisionCallback.prototype.ReportParticle
);
box2d.b2ParticleSystem.prototype.SolveCollision = function (a) {
  var b = this.m_positionBuffer.data,
    c = this.m_velocityBuffer.data,
    d = box2d.b2ParticleSystem.prototype.SolveCollision.s_aabb;
  d.lowerBound.x = +box2d.b2_maxFloat;
  d.lowerBound.y = +box2d.b2_maxFloat;
  d.upperBound.x = -box2d.b2_maxFloat;
  d.upperBound.y = -box2d.b2_maxFloat;
  for (var e = 0; e < this.m_count; e++) {
    var f = c[e],
      g = b[e],
      h = g.x + a.dt * f.x,
      f = g.y + a.dt * f.y;
    d.lowerBound.x = box2d.b2Min(d.lowerBound.x, box2d.b2Min(g.x, h));
    d.lowerBound.y = box2d.b2Min(d.lowerBound.y, box2d.b2Min(g.y, f));
    d.upperBound.x = box2d.b2Max(d.upperBound.x, box2d.b2Max(g.x, h));
    d.upperBound.y = box2d.b2Max(d.upperBound.y, box2d.b2Max(g.y, f));
  }
  a = new box2d.b2ParticleSystem.SolveCollisionCallback(this, a);
  this.m_world.QueryAABB(a, d);
};
box2d.b2ParticleSystem.prototype.SolveCollision.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.LimitVelocity = function (a) {
  var b = this.m_velocityBuffer.data;
  a = this.GetCriticalVelocitySquared(a);
  for (var c = 0; c < this.m_count; c++) {
    var d = b[c],
      e = box2d.b2Dot_V2_V2(d, d);
    e > a && d.SelfMul(box2d.b2Sqrt(a / e));
  }
};
box2d.b2ParticleSystem.prototype.SolveGravity = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolveGravity.s_gravity,
    c = this.m_velocityBuffer.data;
  a = box2d.b2Mul_S_V2(
    a.dt * this.m_def.gravityScale,
    this.m_world.GetGravity(),
    b
  );
  for (b = 0; b < this.m_count; b++) c[b].SelfAdd(a);
};
box2d.b2ParticleSystem.prototype.SolveGravity.s_gravity = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier = function (a) {
  for (
    var b = box2d.b2ParticleSystem.prototype.SolveBarrier.s_aabb,
      c = box2d.b2ParticleSystem.prototype.SolveBarrier.s_va,
      d = box2d.b2ParticleSystem.prototype.SolveBarrier.s_vb,
      e = box2d.b2ParticleSystem.prototype.SolveBarrier.s_pba,
      f = box2d.b2ParticleSystem.prototype.SolveBarrier.s_vba,
      g = box2d.b2ParticleSystem.prototype.SolveBarrier.s_vc,
      h = box2d.b2ParticleSystem.prototype.SolveBarrier.s_pca,
      k = box2d.b2ParticleSystem.prototype.SolveBarrier.s_vca,
      l = box2d.b2ParticleSystem.prototype.SolveBarrier.s_qba,
      m = box2d.b2ParticleSystem.prototype.SolveBarrier.s_qca,
      n = box2d.b2ParticleSystem.prototype.SolveBarrier.s_dv,
      p = box2d.b2ParticleSystem.prototype.SolveBarrier.s_f,
      q = this.m_positionBuffer.data,
      r = this.m_velocityBuffer.data,
      u = 0;
    u < this.m_count;
    u++
  )
    0 !==
      (this.m_flagsBuffer.data[u] &
        box2d.b2ParticleSystem.k_barrierWallFlags) && r[u].SetZero();
  for (
    var u = box2d.b2_barrierCollisionTime * a.dt,
      t = this.GetParticleMass(),
      w = 0;
    w < this.m_pairBuffer.count;
    w++
  ) {
    var x = this.m_pairBuffer.data[w];
    if (x.flags & box2d.b2ParticleFlag.b2_barrierParticle) {
      var v = x.indexA,
        y = x.indexB,
        x = q[v],
        z = q[y],
        B = b;
      box2d.b2Min_V2_V2(x, z, B.lowerBound);
      box2d.b2Max_V2_V2(x, z, B.upperBound);
      for (
        var E = this.m_groupBuffer[v],
          F = this.m_groupBuffer[y],
          v = this.GetLinearVelocity(E, v, x, c),
          y = this.GetLinearVelocity(F, y, z, d),
          z = box2d.b2Sub_V2_V2(z, x, e),
          y = box2d.b2Sub_V2_V2(y, v, f),
          B = this.GetInsideBoundsEnumerator(B),
          G;
        0 <= (G = B.GetNext());

      ) {
        var H = q[G],
          I = this.m_groupBuffer[G];
        if (E !== I && F !== I) {
          var C = this.GetLinearVelocity(I, G, H, g),
            A = box2d.b2Sub_V2_V2(H, x, h),
            K = box2d.b2Sub_V2_V2(C, v, k),
            J = box2d.b2Cross_V2_V2(y, K),
            D = box2d.b2Cross_V2_V2(z, K) - box2d.b2Cross_V2_V2(A, y),
            L = box2d.b2Cross_V2_V2(z, A),
            M = l,
            N = m;
          if (0 === J) {
            if (0 === D) continue;
            L = -L / D;
            if (!(0 <= L && L < u)) continue;
            box2d.b2AddMul_V2_S_V2(z, L, y, M);
            box2d.b2AddMul_V2_S_V2(A, L, K, N);
            D = box2d.b2Dot_V2_V2(M, N) / box2d.b2Dot_V2_V2(M, M);
            if (!(0 <= D && 1 >= D)) continue;
          } else {
            L = D * D - 4 * L * J;
            if (0 > L) continue;
            var O = box2d.b2Sqrt(L),
              L = (-D - O) / (2 * J),
              J = (-D + O) / (2 * J);
            L > J && ((D = L), (L = J), (J = D));
            box2d.b2AddMul_V2_S_V2(z, L, y, M);
            box2d.b2AddMul_V2_S_V2(A, L, K, N);
            D = box2d.b2Dot_V2_V2(M, N) / box2d.b2Dot_V2_V2(M, M);
            if (!(0 <= L && L < u && 0 <= D && 1 >= D)) {
              L = J;
              if (!(0 <= L && L < u)) continue;
              box2d.b2AddMul_V2_S_V2(z, L, y, M);
              box2d.b2AddMul_V2_S_V2(A, L, K, N);
              D = box2d.b2Dot_V2_V2(M, N) / box2d.b2Dot_V2_V2(M, M);
              if (!(0 <= D && 1 >= D)) continue;
            }
          }
          A = n;
          A.x = v.x + D * y.x - C.x;
          A.y = v.y + D * y.y - C.y;
          C = box2d.b2Mul_S_V2(t, A, p);
          this.IsRigidGroup(I)
            ? ((t = I.GetMass()),
              (A = I.GetInertia()),
              0 < t && I.m_linearVelocity.SelfMulAdd(1 / t, C),
              0 < A &&
                (I.m_angularVelocity +=
                  box2d.b2Cross_V2_V2(
                    box2d.b2Sub_V2_V2(H, I.GetCenter(), box2d.b2Vec2.s_t0),
                    C
                  ) / A))
            : r[G].SelfAdd(A);
          this.ParticleApplyForce(G, C.SelfMul(-a.inv_dt));
        }
      }
    }
  }
};
box2d.b2ParticleSystem.prototype.SolveBarrier.s_aabb = new box2d.b2AABB();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_va = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_vb = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_pba = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_vba = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_vc = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_pca = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_vca = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_qba = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_qca = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_dv = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveBarrier.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveStaticPressure = function (a) {
  this.m_staticPressureBuffer = this.RequestBuffer(this.m_staticPressureBuffer);
  var b = this.GetCriticalPressure(a);
  a = this.m_def.staticPressureStrength * b;
  for (
    var b = box2d.b2_maxParticlePressure * b,
      c = this.m_def.staticPressureRelaxation,
      d = 0;
    d < this.m_def.staticPressureIterations;
    d++
  ) {
    for (var e = 0; e < this.m_count; e++) this.m_accumulationBuffer[e] = 0;
    for (e = 0; e < this.m_contactBuffer.count; e++) {
      var f = this.m_contactBuffer.data[e];
      if (f.flags & box2d.b2ParticleFlag.b2_staticPressureParticle) {
        var g = f.indexA,
          h = f.indexB,
          f = f.weight;
        this.m_accumulationBuffer[g] += f * this.m_staticPressureBuffer[h];
        this.m_accumulationBuffer[h] += f * this.m_staticPressureBuffer[g];
      }
    }
    for (e = 0; e < this.m_count; e++)
      (f = this.m_weightBuffer[e]),
        (this.m_staticPressureBuffer[e] =
          this.m_flagsBuffer.data[e] &
          box2d.b2ParticleFlag.b2_staticPressureParticle
            ? box2d.b2Clamp(
                (this.m_accumulationBuffer[e] +
                  a * (f - box2d.b2_minParticleWeight)) /
                  (f + c),
                0,
                b
              )
            : 0);
  }
};
box2d.b2ParticleSystem.prototype.ComputeWeight = function () {
  for (var a = 0; a < this.m_count; a++) this.m_weightBuffer[a] = 0;
  for (a = 0; a < this.m_bodyContactBuffer.count; a++) {
    var b = this.m_bodyContactBuffer.data[a],
      c = b.index,
      b = b.weight;
    this.m_weightBuffer[c] += b;
  }
  for (a = 0; a < this.m_contactBuffer.count; a++) {
    var b = this.m_contactBuffer.data[a],
      c = b.indexA,
      d = b.indexB,
      b = b.weight;
    this.m_weightBuffer[c] += b;
    this.m_weightBuffer[d] += b;
  }
};
box2d.b2ParticleSystem.prototype.SolvePressure = function (a) {
  for (
    var b = box2d.b2ParticleSystem.prototype.SolvePressure.s_f,
      c = this.m_positionBuffer.data,
      d = this.m_velocityBuffer.data,
      e = this.GetCriticalPressure(a),
      f = this.m_def.pressureStrength * e,
      g = box2d.b2_maxParticlePressure * e,
      h = 0;
    h < this.m_count;
    h++
  ) {
    var e = this.m_weightBuffer[h],
      k = f * box2d.b2Max(0, e - box2d.b2_minParticleWeight);
    this.m_accumulationBuffer[h] = box2d.b2Min(k, g);
  }
  if (this.m_allParticleFlags & box2d.b2ParticleSystem.k_noPressureFlags)
    for (h = 0; h < this.m_count; h++)
      this.m_flagsBuffer.data[h] & box2d.b2ParticleSystem.k_noPressureFlags &&
        (this.m_accumulationBuffer[h] = 0);
  if (this.m_allParticleFlags & box2d.b2ParticleFlag.b2_staticPressureParticle)
    for (
      box2d.b2Assert(null !== this.m_staticPressureBuffer), h = 0;
      h < this.m_count;
      h++
    )
      this.m_flagsBuffer.data[h] &
        box2d.b2ParticleFlag.b2_staticPressureParticle &&
        (this.m_accumulationBuffer[h] += this.m_staticPressureBuffer[h]);
  a = a.dt / (this.m_def.density * this.m_particleDiameter);
  g = this.GetParticleInvMass();
  for (h = 0; h < this.m_bodyContactBuffer.count; h++) {
    var k = this.m_bodyContactBuffer.data[h],
      l = k.index,
      m = k.body,
      e = k.weight,
      n = k.mass,
      p = k.normal,
      q = c[l],
      k = this.m_accumulationBuffer[l] + f * e,
      e = box2d.b2Mul_S_V2(a * e * n * k, p, b);
    d[l].SelfMulSub(g, e);
    m.ApplyLinearImpulse(e, q, !0);
  }
  for (h = 0; h < this.m_contactBuffer.count; h++)
    (k = this.m_contactBuffer.data[h]),
      (l = k.indexA),
      (m = k.indexB),
      (e = k.weight),
      (p = k.normal),
      (k = this.m_accumulationBuffer[l] + this.m_accumulationBuffer[m]),
      (e = box2d.b2Mul_S_V2(a * e * k, p, b)),
      d[l].SelfSub(e),
      d[m].SelfAdd(e);
};
box2d.b2ParticleSystem.prototype.SolvePressure.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveDamping = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolveDamping.s_v,
    c = box2d.b2ParticleSystem.prototype.SolveDamping.s_f,
    d = this.m_positionBuffer.data,
    e = this.m_velocityBuffer.data,
    f = this.m_def.dampingStrength;
  a = 1 / this.GetCriticalVelocity(a);
  for (
    var g = this.GetParticleInvMass(), h = 0;
    h < this.m_bodyContactBuffer.count;
    h++
  ) {
    var k = this.m_bodyContactBuffer.data[h],
      l = k.index,
      m = k.body,
      n = k.weight,
      p = k.mass,
      q = k.normal,
      k = d[l],
      r = box2d.b2Sub_V2_V2(
        m.GetLinearVelocityFromWorldPoint(k, box2d.b2Vec2.s_t0),
        e[l],
        b
      ),
      r = box2d.b2Dot_V2_V2(r, q);
    0 > r &&
      ((n = box2d.b2Max(f * n, box2d.b2Min(-a * r, 0.5))),
      (p = box2d.b2Mul_S_V2(n * p * r, q, c)),
      e[l].SelfMulAdd(g, p),
      m.ApplyLinearImpulse(p.SelfNeg(), k, !0));
  }
  for (h = 0; h < this.m_contactBuffer.count; h++)
    (k = this.m_contactBuffer.data[h]),
      (l = k.indexA),
      (m = k.indexB),
      (n = k.weight),
      (q = k.normal),
      (r = box2d.b2Sub_V2_V2(e[m], e[l], b)),
      (r = box2d.b2Dot_V2_V2(r, q)),
      0 > r &&
        ((n = box2d.b2Max(f * n, box2d.b2Min(-a * r, 0.5))),
        (p = box2d.b2Mul_S_V2(n * r, q, c)),
        e[l].SelfAdd(p),
        e[m].SelfSub(p));
};
box2d.b2ParticleSystem.prototype.SolveDamping.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveDamping.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRigidDamping = function () {
  for (
    var a = box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_t0,
      b = box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_t1,
      c = box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_p,
      d = box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_v,
      e = [0],
      f = [0],
      g = [0],
      h = [0],
      k = [0],
      l = [0],
      m = this.m_positionBuffer.data,
      n = this.m_def.dampingStrength,
      p = 0;
    p < this.m_bodyContactBuffer.count;
    p++
  ) {
    var q = this.m_bodyContactBuffer.data[p],
      r = q.index,
      u = this.m_groupBuffer[r];
    if (this.IsRigidGroup(u)) {
      var t = q.body,
        w = q.normal,
        x = q.weight,
        q = m[r],
        v = box2d.b2Sub_V2_V2(
          t.GetLinearVelocityFromWorldPoint(q, a),
          u.GetLinearVelocityFromWorldPoint(q, b),
          d
        ),
        v = box2d.b2Dot_V2_V2(v, w);
      0 > v &&
        (this.InitDampingParameterWithRigidGroupOrParticle(
          e,
          f,
          g,
          !0,
          u,
          r,
          q,
          w
        ),
        this.InitDampingParameter(
          h,
          k,
          l,
          t.GetMass(),
          t.GetInertia() - t.GetMass() * t.GetLocalCenter().LengthSquared(),
          t.GetWorldCenter(),
          q,
          w
        ),
        (x =
          n *
          box2d.b2Min(x, 1) *
          this.ComputeDampingImpulse(e[0], f[0], g[0], h[0], k[0], l[0], v)),
        this.ApplyDamping(e[0], f[0], g[0], !0, u, r, x, w),
        t.ApplyLinearImpulse(
          box2d.b2Mul_S_V2(-x, w, box2d.b2Vec2.s_t0),
          q,
          !0
        ));
    }
  }
  for (p = 0; p < this.m_contactBuffer.count; p++) {
    var q = this.m_contactBuffer.data[p],
      r = q.indexA,
      t = q.indexB,
      w = q.normal,
      x = q.weight,
      u = this.m_groupBuffer[r],
      y = this.m_groupBuffer[t],
      z = this.IsRigidGroup(u),
      B = this.IsRigidGroup(y);
    u !== y &&
      (z || B) &&
      ((q = box2d.b2Mid_V2_V2(m[r], m[t], c)),
      (v = box2d.b2Sub_V2_V2(
        this.GetLinearVelocity(y, t, q, a),
        this.GetLinearVelocity(u, r, q, b),
        d
      )),
      (v = box2d.b2Dot_V2_V2(v, w)),
      0 > v &&
        (this.InitDampingParameterWithRigidGroupOrParticle(
          e,
          f,
          g,
          z,
          u,
          r,
          q,
          w
        ),
        this.InitDampingParameterWithRigidGroupOrParticle(
          h,
          k,
          l,
          B,
          y,
          t,
          q,
          w
        ),
        (x =
          n *
          x *
          this.ComputeDampingImpulse(e[0], f[0], g[0], h[0], k[0], l[0], v)),
        this.ApplyDamping(e[0], f[0], g[0], z, u, r, x, w),
        this.ApplyDamping(h[0], k[0], l[0], B, y, t, -x, w)));
  }
};
box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_t0 = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_t1 = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_p = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRigidDamping.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveExtraDamping = function () {
  for (
    var a = box2d.b2ParticleSystem.prototype.SolveExtraDamping.s_v,
      b = box2d.b2ParticleSystem.prototype.SolveExtraDamping.s_f,
      c = this.m_velocityBuffer.data,
      d = this.m_positionBuffer.data,
      e = this.GetParticleInvMass(),
      f = 0;
    f < this.m_bodyContactBuffer.count;
    f++
  ) {
    var g = this.m_bodyContactBuffer.data[f],
      h = g.index;
    if (
      this.m_flagsBuffer.data[h] & box2d.b2ParticleSystem.k_extraDampingFlags
    ) {
      var k = g.body,
        l = g.mass,
        m = g.normal,
        g = d[h],
        n = box2d.b2Sub_V2_V2(
          k.GetLinearVelocityFromWorldPoint(g, box2d.b2Vec2.s_t0),
          c[h],
          a
        ),
        n = box2d.b2Dot_V2_V2(n, m);
      0 > n &&
        ((l = box2d.b2Mul_S_V2(0.5 * l * n, m, b)),
        c[h].SelfMulAdd(e, l),
        k.ApplyLinearImpulse(l.SelfNeg(), g, !0));
    }
  }
};
box2d.b2ParticleSystem.prototype.SolveExtraDamping.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveExtraDamping.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveWall = function () {
  for (var a = this.m_velocityBuffer.data, b = 0; b < this.m_count; b++)
    this.m_flagsBuffer.data[b] & box2d.b2ParticleFlag.b2_wallParticle &&
      a[b].SetZero();
};
box2d.b2ParticleSystem.prototype.SolveRigid = function (a) {
  for (
    var b = box2d.b2ParticleSystem.prototype.SolveRigid.s_position,
      c = box2d.b2ParticleSystem.prototype.SolveRigid.s_rotation,
      d = box2d.b2ParticleSystem.prototype.SolveRigid.s_transform,
      e = box2d.b2ParticleSystem.prototype.SolveRigid.s_velocityTransform,
      f = this.m_positionBuffer.data,
      g = this.m_velocityBuffer.data,
      h = this.m_groupList;
    h;
    h = h.GetNext()
  )
    if (h.m_groupFlags & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup) {
      h.UpdateStatistics();
      var k = c;
      k.SetAngle(a.dt * h.m_angularVelocity);
      var l = box2d.b2Add_V2_V2(
          h.m_center,
          box2d.b2Sub_V2_V2(
            box2d.b2Mul_S_V2(a.dt, h.m_linearVelocity, box2d.b2Vec2.s_t0),
            box2d.b2Mul_R_V2(k, h.m_center, box2d.b2Vec2.s_t1),
            box2d.b2Vec2.s_t0
          ),
          b
        ),
        m = d;
      m.SetPositionRotation(l, k);
      box2d.b2Mul_X_X(m, h.m_transform, h.m_transform);
      k = e;
      k.p.x = a.inv_dt * m.p.x;
      k.p.y = a.inv_dt * m.p.y;
      k.q.s = a.inv_dt * m.q.s;
      k.q.c = a.inv_dt * (m.q.c - 1);
      for (m = h.m_firstIndex; m < h.m_lastIndex; m++)
        box2d.b2Mul_X_V2(k, f[m], g[m]);
    }
};
box2d.b2ParticleSystem.prototype.SolveRigid.s_position = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRigid.s_rotation = new box2d.b2Rot();
box2d.b2ParticleSystem.prototype.SolveRigid.s_transform = new box2d.b2Transform();
box2d.b2ParticleSystem.prototype.SolveRigid.s_velocityTransform = new box2d.b2Transform();
box2d.b2ParticleSystem.prototype.SolveElastic = function (a) {
  for (
    var b = box2d.b2ParticleSystem.prototype.SolveElastic.s_pa,
      c = box2d.b2ParticleSystem.prototype.SolveElastic.s_pb,
      d = box2d.b2ParticleSystem.prototype.SolveElastic.s_pc,
      e = box2d.b2ParticleSystem.prototype.SolveElastic.s_r,
      f = box2d.b2ParticleSystem.prototype.SolveElastic.s_t0,
      g = this.m_positionBuffer.data,
      h = this.m_velocityBuffer.data,
      k = a.inv_dt * this.m_def.elasticStrength,
      l = 0;
    l < this.m_triadBuffer.count;
    l++
  ) {
    var m = this.m_triadBuffer.data[l];
    if (m.flags & box2d.b2ParticleFlag.b2_elasticParticle) {
      var n = m.indexA,
        p = m.indexB,
        q = m.indexC,
        r = m.pa,
        u = m.pb,
        t = m.pc,
        w = b.Copy(g[n]),
        x = c.Copy(g[p]),
        v = d.Copy(g[q]),
        n = h[n],
        p = h[p],
        q = h[q];
      w.SelfMulAdd(a.dt, n);
      x.SelfMulAdd(a.dt, p);
      v.SelfMulAdd(a.dt, q);
      var y = (w.x + x.x + v.x) / 3,
        z = (w.y + x.y + v.y) / 3;
      w.x -= y;
      w.y -= z;
      x.x -= y;
      x.y -= z;
      v.x -= y;
      v.y -= z;
      y = e;
      y.s =
        box2d.b2Cross_V2_V2(r, w) +
        box2d.b2Cross_V2_V2(u, x) +
        box2d.b2Cross_V2_V2(t, v);
      y.c =
        box2d.b2Dot_V2_V2(r, w) +
        box2d.b2Dot_V2_V2(u, x) +
        box2d.b2Dot_V2_V2(t, v);
      z = box2d.b2InvSqrt(y.s * y.s + y.c * y.c);
      isFinite(z) || (z = 1.9817753699999998e19);
      y.s *= z;
      y.c *= z;
      y.angle = Math.atan2(y.s, y.c);
      m = k * m.strength;
      box2d.b2Mul_R_V2(y, r, f);
      box2d.b2Sub_V2_V2(f, w, f);
      box2d.b2Mul_S_V2(m, f, f);
      n.SelfAdd(f);
      box2d.b2Mul_R_V2(y, u, f);
      box2d.b2Sub_V2_V2(f, x, f);
      box2d.b2Mul_S_V2(m, f, f);
      p.SelfAdd(f);
      box2d.b2Mul_R_V2(y, t, f);
      box2d.b2Sub_V2_V2(f, v, f);
      box2d.b2Mul_S_V2(m, f, f);
      q.SelfAdd(f);
    }
  }
};
box2d.b2ParticleSystem.prototype.SolveElastic.s_pa = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveElastic.s_pb = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveElastic.s_pc = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveElastic.s_r = new box2d.b2Rot();
box2d.b2ParticleSystem.prototype.SolveElastic.s_t0 = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveSpring = function (a) {
  for (
    var b = box2d.b2ParticleSystem.prototype.SolveSpring.s_pa,
      c = box2d.b2ParticleSystem.prototype.SolveSpring.s_pb,
      d = box2d.b2ParticleSystem.prototype.SolveSpring.s_d,
      e = box2d.b2ParticleSystem.prototype.SolveSpring.s_f,
      f = this.m_positionBuffer.data,
      g = this.m_velocityBuffer.data,
      h = a.inv_dt * this.m_def.springStrength,
      k = 0;
    k < this.m_pairBuffer.count;
    k++
  ) {
    var l = this.m_pairBuffer.data[k];
    if (l.flags & box2d.b2ParticleFlag.b2_springParticle) {
      var m = l.indexA,
        n = l.indexB,
        p = b.Copy(f[m]),
        q = c.Copy(f[n]),
        m = g[m],
        n = g[n];
      p.SelfMulAdd(a.dt, m);
      q.SelfMulAdd(a.dt, n);
      var p = box2d.b2Sub_V2_V2(q, p, d),
        q = l.distance,
        r = p.Length(),
        l = box2d.b2Mul_S_V2((h * l.strength * (q - r)) / r, p, e);
      m.SelfSub(l);
      n.SelfAdd(l);
    }
  }
};
box2d.b2ParticleSystem.prototype.SolveSpring.s_pa = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveSpring.s_pb = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveSpring.s_d = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveSpring.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveTensile = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolveTensile.s_weightedNormal,
    c = box2d.b2ParticleSystem.prototype.SolveTensile.s_s,
    d = box2d.b2ParticleSystem.prototype.SolveTensile.s_f,
    e = this.m_velocityBuffer.data;
  box2d.b2Assert(null !== this.m_accumulation2Buffer);
  for (var f = 0; f < this.m_count; f++)
    (this.m_accumulation2Buffer[f] = box2d.b2Vec2_zero.Clone()),
      this.m_accumulation2Buffer[f].SetZero();
  for (f = 0; f < this.m_contactBuffer.count; f++) {
    var g = this.m_contactBuffer.data[f];
    if (g.flags & box2d.b2ParticleFlag.b2_tensileParticle) {
      var h = g.indexA,
        k = g.indexB,
        l = g.weight,
        g = g.normal,
        l = box2d.b2Mul_S_V2((1 - l) * l, g, b);
      this.m_accumulation2Buffer[h].SelfSub(l);
      this.m_accumulation2Buffer[k].SelfAdd(l);
    }
  }
  f = this.GetCriticalVelocity(a);
  a = this.m_def.surfaceTensionPressureStrength * f;
  for (
    var b = this.m_def.surfaceTensionNormalStrength * f,
      m = box2d.b2_maxParticleForce * f,
      f = 0;
    f < this.m_contactBuffer.count;
    f++
  )
    if (
      ((g = this.m_contactBuffer.data[f]),
      g.flags & box2d.b2ParticleFlag.b2_tensileParticle)
    ) {
      var h = g.indexA,
        k = g.indexB,
        l = g.weight,
        g = g.normal,
        n = this.m_weightBuffer[h] + this.m_weightBuffer[k],
        p = box2d.b2Sub_V2_V2(
          this.m_accumulation2Buffer[k],
          this.m_accumulation2Buffer[h],
          c
        ),
        l = box2d.b2Min(a * (n - 2) + b * box2d.b2Dot_V2_V2(p, g), m) * l,
        l = box2d.b2Mul_S_V2(l, g, d);
      e[h].SelfSub(l);
      e[k].SelfAdd(l);
    }
};
box2d.b2ParticleSystem.prototype.SolveTensile.s_weightedNormal = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveTensile.s_s = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveTensile.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveViscous = function () {
  for (
    var a = box2d.b2ParticleSystem.prototype.SolveViscous.s_v,
      b = box2d.b2ParticleSystem.prototype.SolveViscous.s_f,
      c = this.m_positionBuffer.data,
      d = this.m_velocityBuffer.data,
      e = this.m_def.viscousStrength,
      f = this.GetParticleInvMass(),
      g = 0;
    g < this.m_bodyContactBuffer.count;
    g++
  ) {
    var h = this.m_bodyContactBuffer.data[g],
      k = h.index;
    if (this.m_flagsBuffer.data[k] & box2d.b2ParticleFlag.b2_viscousParticle) {
      var l = h.body,
        m = h.weight,
        n = h.mass,
        h = c[k],
        p = box2d.b2Sub_V2_V2(
          l.GetLinearVelocityFromWorldPoint(h, box2d.b2Vec2.s_t0),
          d[k],
          a
        ),
        m = box2d.b2Mul_S_V2(e * n * m, p, b);
      d[k].SelfMulAdd(f, m);
      l.ApplyLinearImpulse(m.SelfNeg(), h, !0);
    }
  }
  for (g = 0; g < this.m_contactBuffer.count; g++)
    (h = this.m_contactBuffer.data[g]),
      h.flags & box2d.b2ParticleFlag.b2_viscousParticle &&
        ((k = h.indexA),
        (l = h.indexB),
        (m = h.weight),
        (p = box2d.b2Sub_V2_V2(d[l], d[k], a)),
        (m = box2d.b2Mul_S_V2(e * m, p, b)),
        d[k].SelfAdd(m),
        d[l].SelfSub(m));
};
box2d.b2ParticleSystem.prototype.SolveViscous.s_v = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveViscous.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveRepulsive = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolveRepulsive.s_f,
    c = this.m_velocityBuffer.data;
  a = this.m_def.repulsiveStrength * this.GetCriticalVelocity(a);
  for (var d = 0; d < this.m_contactBuffer.count; d++) {
    var e = this.m_contactBuffer.data[d];
    if (e.flags & box2d.b2ParticleFlag.b2_repulsiveParticle) {
      var f = e.indexA,
        g = e.indexB;
      this.m_groupBuffer[f] !== this.m_groupBuffer[g] &&
        ((e = box2d.b2Mul_S_V2(a * e.weight, e.normal, b)),
        c[f].SelfSub(e),
        c[g].SelfAdd(e));
    }
  }
};
box2d.b2ParticleSystem.prototype.SolveRepulsive.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolvePowder = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolvePowder.s_f,
    c = this.m_positionBuffer.data,
    d = this.m_velocityBuffer.data;
  a = this.m_def.powderStrength * this.GetCriticalVelocity(a);
  for (
    var e = 1 - box2d.b2_particleStride, f = this.GetParticleInvMass(), g = 0;
    g < this.m_bodyContactBuffer.count;
    g++
  ) {
    var h = this.m_bodyContactBuffer.data[g],
      k = h.index;
    if (this.m_flagsBuffer.data[k] & box2d.b2ParticleFlag.b2_powderParticle) {
      var l = h.weight;
      if (l > e) {
        var m = h.body,
          n = c[k],
          p = h.normal,
          h = box2d.b2Mul_S_V2(a * h.mass * (l - e), p, b);
        d[k].SelfMulSub(f, h);
        m.ApplyLinearImpulse(h, n, !0);
      }
    }
  }
  for (g = 0; g < this.m_contactBuffer.count; g++)
    (h = this.m_contactBuffer.data[g]),
      h.flags & box2d.b2ParticleFlag.b2_powderParticle &&
        ((l = h.weight),
        l > e &&
          ((k = h.indexA),
          (m = h.indexB),
          (p = h.normal),
          (h = box2d.b2Mul_S_V2(a * (l - e), p, b)),
          d[k].SelfSub(h),
          d[m].SelfAdd(h)));
};
box2d.b2ParticleSystem.prototype.SolvePowder.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveSolid = function (a) {
  var b = box2d.b2ParticleSystem.prototype.SolveSolid.s_f,
    c = this.m_velocityBuffer.data;
  this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer);
  a = a.inv_dt * this.m_def.ejectionStrength;
  for (var d = 0; d < this.m_contactBuffer.count; d++) {
    var e = this.m_contactBuffer.data[d],
      f = e.indexA,
      g = e.indexB;
    this.m_groupBuffer[f] !== this.m_groupBuffer[g] &&
      ((e = box2d.b2Mul_S_V2(
        a * (this.m_depthBuffer[f] + this.m_depthBuffer[g]) * e.weight,
        e.normal,
        b
      )),
      c[f].SelfSub(e),
      c[g].SelfAdd(e));
  }
};
box2d.b2ParticleSystem.prototype.SolveSolid.s_f = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.SolveForce = function (a) {
  var b = this.m_velocityBuffer.data;
  a = a.dt * this.GetParticleInvMass();
  for (var c = 0; c < this.m_count; c++)
    b[c].SelfMulAdd(a, this.m_forceBuffer[c]);
  this.m_hasForce = !1;
};
box2d.b2ParticleSystem.prototype.SolveColorMixing = function () {
  box2d.b2Assert(null !== this.m_colorBuffer.data);
  var a = Math.floor(128 * this.m_def.colorMixingStrength);
  if (a)
    for (var b = 0; b < this.m_contactBuffer.count; b++) {
      var c = this.m_contactBuffer.data[b],
        d = c.indexA,
        c = c.indexB;
      this.m_flagsBuffer.data[d] &
        this.m_flagsBuffer.data[c] &
        box2d.b2ParticleFlag.b2_colorMixingParticle &&
        box2d.b2ParticleColor.MixColors(
          this.m_colorBuffer.data[d],
          this.m_colorBuffer.data[c],
          a
        );
    }
};
box2d.b2ParticleSystem.prototype.SolveZombie = function () {
  for (var a = 0, b = [], c = 0; c < this.m_count; c++)
    b[c] = box2d.b2_invalidParticleIndex;
  box2d.b2Assert(b.length === this.m_count);
  for (var d = 0, c = 0; c < this.m_count; c++) {
    var e = this.m_flagsBuffer.data[c];
    if (e & box2d.b2ParticleFlag.b2_zombieParticle) {
      var f = this.m_world.m_destructionListener;
      e & box2d.b2ParticleFlag.b2_destructionListenerParticle &&
        f &&
        f.SayGoodbyeParticle(this, c);
      this.m_handleIndexBuffer.data &&
        (f = this.m_handleIndexBuffer.data[c]) &&
        (f.SetIndex(box2d.b2_invalidParticleIndex),
        (this.m_handleIndexBuffer.data[c] = null));
      b[c] = box2d.b2_invalidParticleIndex;
    } else
      (b[c] = a),
        c !== a &&
          (this.m_handleIndexBuffer.data &&
            ((f = this.m_handleIndexBuffer.data[c]) && f.SetIndex(a),
            (this.m_handleIndexBuffer.data[a] = f)),
          (this.m_flagsBuffer.data[a] = this.m_flagsBuffer.data[c]),
          this.m_lastBodyContactStepBuffer.data &&
            (this.m_lastBodyContactStepBuffer.data[
              a
            ] = this.m_lastBodyContactStepBuffer.data[c]),
          this.m_bodyContactCountBuffer.data &&
            (this.m_bodyContactCountBuffer.data[
              a
            ] = this.m_bodyContactCountBuffer.data[c]),
          this.m_consecutiveContactStepsBuffer.data &&
            (this.m_consecutiveContactStepsBuffer.data[
              a
            ] = this.m_consecutiveContactStepsBuffer.data[c]),
          this.m_positionBuffer.data[a].Copy(this.m_positionBuffer.data[c]),
          this.m_velocityBuffer.data[a].Copy(this.m_velocityBuffer.data[c]),
          (this.m_groupBuffer[a] = this.m_groupBuffer[c]),
          this.m_hasForce && this.m_forceBuffer[a].Copy(this.m_forceBuffer[c]),
          this.m_staticPressureBuffer &&
            (this.m_staticPressureBuffer[a] = this.m_staticPressureBuffer[c]),
          this.m_depthBuffer && (this.m_depthBuffer[a] = this.m_depthBuffer[c]),
          this.m_colorBuffer.data &&
            this.m_colorBuffer.data[a].Copy(this.m_colorBuffer.data[c]),
          this.m_userDataBuffer.data &&
            (this.m_userDataBuffer.data[a] = this.m_userDataBuffer.data[c]),
          this.m_expirationTimeBuffer.data &&
            (this.m_expirationTimeBuffer.data[
              a
            ] = this.m_expirationTimeBuffer.data[c])),
        a++,
        (d |= e);
  }
  for (c = 0; c < this.m_proxyBuffer.count; c++)
    (e = this.m_proxyBuffer.data[c]), (e.index = b[e.index]);
  this.m_proxyBuffer.RemoveIf(function (a) {
    return 0 > a.index;
  });
  for (c = 0; c < this.m_contactBuffer.count; c++)
    (e = this.m_contactBuffer.data[c]),
      (e.indexA = b[e.indexA]),
      (e.indexB = b[e.indexB]);
  this.m_contactBuffer.RemoveIf(function (a) {
    return 0 > a.indexA || 0 > a.indexB;
  });
  for (c = 0; c < this.m_bodyContactBuffer.count; c++)
    (e = this.m_bodyContactBuffer.data[c]), (e.index = b[e.index]);
  this.m_bodyContactBuffer.RemoveIf(function (a) {
    return 0 > a.index;
  });
  for (c = 0; c < this.m_pairBuffer.count; c++)
    (e = this.m_pairBuffer.data[c]),
      (e.indexA = b[e.indexA]),
      (e.indexB = b[e.indexB]);
  this.m_pairBuffer.RemoveIf(function (a) {
    return 0 > a.indexA || 0 > a.indexB;
  });
  for (c = 0; c < this.m_triadBuffer.count; c++)
    (e = this.m_triadBuffer.data[c]),
      (e.indexA = b[e.indexA]),
      (e.indexB = b[e.indexB]),
      (e.indexC = b[e.indexC]);
  this.m_triadBuffer.RemoveIf(function (a) {
    return 0 > a.indexA || 0 > a.indexB || 0 > a.indexC;
  });
  if (this.m_indexByExpirationTimeBuffer.data)
    for (e = c = 0; e < this.m_count; e++)
      (f = b[this.m_indexByExpirationTimeBuffer.data[e]]),
        f !== box2d.b2_invalidParticleIndex &&
          (this.m_indexByExpirationTimeBuffer.data[c++] = f);
  for (e = this.m_groupList; e; e = e.GetNext()) {
    for (var f = a, g = 0, h = !1, c = e.m_firstIndex; c < e.m_lastIndex; c++) {
      var k = b[c];
      0 <= k
        ? ((f = box2d.b2Min(f, k)), (g = box2d.b2Max(g, k + 1)))
        : (h = !0);
    }
    f < g
      ? ((e.m_firstIndex = f),
        (e.m_lastIndex = g),
        h &&
          e.m_groupFlags & box2d.b2ParticleGroupFlag.b2_solidParticleGroup &&
          this.SetGroupFlags(
            e,
            e.m_groupFlags |
              box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth
          ))
      : ((e.m_firstIndex = 0),
        (e.m_lastIndex = 0),
        e.m_groupFlags & box2d.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty ||
          this.SetGroupFlags(
            e,
            e.m_groupFlags |
              box2d.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed
          ));
  }
  this.m_count = a;
  this.m_allParticleFlags = d;
  this.m_needsUpdateAllParticleFlags = !1;
  for (e = this.m_groupList; e; )
    (a = e.GetNext()),
      e.m_groupFlags &
        box2d.b2ParticleGroupFlag.b2_particleGroupWillBeDestroyed &&
        this.DestroyParticleGroup(e),
      (e = a);
};
box2d.b2ParticleSystem.prototype.SolveLifetimes = function (a) {
  box2d.b2Assert(null !== this.m_expirationTimeBuffer.data);
  box2d.b2Assert(null !== this.m_indexByExpirationTimeBuffer.data);
  this.m_timeElapsed = this.LifetimeToExpirationTime(a.dt);
  a = this.GetQuantizedTimeElapsed();
  var b = this.m_expirationTimeBuffer.data,
    c = this.m_indexByExpirationTimeBuffer.data,
    d = this.GetParticleCount();
  this.m_expirationTimeBufferRequiresSorting &&
    (box2d.std_sort(c, 0, d, function (a, c) {
      var d = b[a],
        e = b[c],
        f = 0 >= d;
      return f === 0 >= e ? d > e : f;
    }),
    (this.m_expirationTimeBufferRequiresSorting = !1));
  for (--d; 0 <= d; --d) {
    var e = c[d],
      f = b[e];
    if (a < f || 0 >= f) break;
    this.DestroyParticle(e);
  }
};
box2d.b2ParticleSystem.prototype.RotateBuffer = function (a, b, c) {
  function d(d) {
    return d < a ? d : d < b ? d + c - b : d < c ? d + a - b : d;
  }
  if (a !== b && b !== c) {
    box2d.b2Assert(b >= a && b <= c);
    box2d.std_rotate(this.m_flagsBuffer.data, a, b, c);
    this.m_lastBodyContactStepBuffer.data &&
      box2d.std_rotate(this.m_lastBodyContactStepBuffer.data, a, b, c);
    this.m_bodyContactCountBuffer.data &&
      box2d.std_rotate(this.m_bodyContactCountBuffer.data, a, b, c);
    this.m_consecutiveContactStepsBuffer.data &&
      box2d.std_rotate(this.m_consecutiveContactStepsBuffer.data, a, b, c);
    box2d.std_rotate(this.m_positionBuffer.data, a, b, c);
    box2d.std_rotate(this.m_velocityBuffer.data, a, b, c);
    box2d.std_rotate(this.m_groupBuffer, a, b, c);
    this.m_hasForce && box2d.std_rotate(this.m_forceBuffer, a, b, c);
    this.m_staticPressureBuffer &&
      box2d.std_rotate(this.m_staticPressureBuffer, a, b, c);
    this.m_depthBuffer && box2d.std_rotate(this.m_depthBuffer, a, b, c);
    this.m_colorBuffer.data &&
      box2d.std_rotate(this.m_colorBuffer.data, a, b, c);
    this.m_userDataBuffer.data &&
      box2d.std_rotate(this.m_userDataBuffer.data, a, b, c);
    if (this.m_handleIndexBuffer.data) {
      box2d.std_rotate(this.m_handleIndexBuffer.data, a, b, c);
      for (var e = a; e < c; ++e) {
        var f = this.m_handleIndexBuffer.data[e];
        f && f.SetIndex(d(f.GetIndex()));
      }
    }
    if (this.m_expirationTimeBuffer.data) {
      box2d.std_rotate(this.m_expirationTimeBuffer.data, a, b, c);
      for (
        var f = this.GetParticleCount(),
          g = this.m_indexByExpirationTimeBuffer.data,
          e = 0;
        e < f;
        ++e
      )
        g[e] = d(g[e]);
    }
    for (e = 0; e < this.m_proxyBuffer.count; e++)
      (f = this.m_proxyBuffer.data[e]), (f.index = d(f.index));
    for (e = 0; e < this.m_contactBuffer.count; e++)
      (f = this.m_contactBuffer.data[e]),
        (f.indexA = d(f.indexA)),
        (f.indexB = d(f.indexB));
    for (e = 0; e < this.m_bodyContactBuffer.count; e++)
      (f = this.m_bodyContactBuffer.data[e]), (f.index = d(f.index));
    for (e = 0; e < this.m_pairBuffer.count; e++)
      (f = this.m_pairBuffer.data[e]),
        (f.indexA = d(f.indexA)),
        (f.indexB = d(f.indexB));
    for (e = 0; e < this.m_triadBuffer.count; e++)
      (f = this.m_triadBuffer.data[e]),
        (f.indexA = d(f.indexA)),
        (f.indexB = d(f.indexB)),
        (f.indexC = d(f.indexC));
    for (e = this.m_groupList; e; e = e.GetNext())
      (e.m_firstIndex = d(e.m_firstIndex)),
        (e.m_lastIndex = d(e.m_lastIndex - 1) + 1);
  }
};
box2d.b2ParticleSystem.prototype.GetCriticalVelocity = function (a) {
  return this.m_particleDiameter * a.inv_dt;
};
box2d.b2ParticleSystem.prototype.GetCriticalVelocitySquared = function (a) {
  a = this.GetCriticalVelocity(a);
  return a * a;
};
box2d.b2ParticleSystem.prototype.GetCriticalPressure = function (a) {
  return this.m_def.density * this.GetCriticalVelocitySquared(a);
};
box2d.b2ParticleSystem.prototype.GetParticleStride = function () {
  return box2d.b2_particleStride * this.m_particleDiameter;
};
box2d.b2ParticleSystem.prototype.GetParticleMass = function () {
  var a = this.GetParticleStride();
  return this.m_def.density * a * a;
};
box2d.b2ParticleSystem.prototype.GetParticleInvMass = function () {
  var a = (1 / box2d.b2_particleStride) * this.m_inverseDiameter;
  return this.m_inverseDensity * a * a;
};
box2d.b2ParticleSystem.prototype.GetFixtureContactFilter = function () {
  return this.m_allParticleFlags &
    box2d.b2ParticleFlag.b2_fixtureContactFilterParticle
    ? this.m_world.m_contactManager.m_contactFilter
    : null;
};
box2d.b2ParticleSystem.prototype.GetParticleContactFilter = function () {
  return this.m_allParticleFlags &
    box2d.b2ParticleFlag.b2_particleContactFilterParticle
    ? this.m_world.m_contactManager.m_contactFilter
    : null;
};
box2d.b2ParticleSystem.prototype.GetFixtureContactListener = function () {
  return this.m_allParticleFlags &
    box2d.b2ParticleFlag.b2_fixtureContactListenerParticle
    ? this.m_world.m_contactManager.m_contactListener
    : null;
};
box2d.b2ParticleSystem.prototype.GetParticleContactListener = function () {
  return this.m_allParticleFlags &
    box2d.b2ParticleFlag.b2_particleContactListenerParticle
    ? this.m_world.m_contactManager.m_contactListener
    : null;
};
box2d.b2ParticleSystem.prototype.SetUserOverridableBuffer = function (a, b, c) {
  box2d.b2Assert((null !== b && 0 < c) || (null === b && 0 === c));
  a.data = b;
  a.userSuppliedCapacity = c;
};
box2d.b2ParticleSystem.prototype.SetGroupFlags = function (a, b) {
  var c = a.m_groupFlags;
  (c ^ b) & box2d.b2ParticleGroupFlag.b2_solidParticleGroup &&
    (b |= box2d.b2ParticleGroupFlag.b2_particleGroupNeedsUpdateDepth);
  c & ~b && (this.m_needsUpdateAllGroupFlags = !0);
  ~this.m_allGroupFlags & b &&
    (b & box2d.b2ParticleGroupFlag.b2_solidParticleGroup &&
      (this.m_depthBuffer = this.RequestBuffer(this.m_depthBuffer)),
    (this.m_allGroupFlags |= b));
  a.m_groupFlags = b;
};
box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts = function () {
  box2d.std_sort(
    this.m_bodyContactBuffer.data,
    0,
    this.m_bodyContactBuffer.count,
    box2d.b2ParticleSystem.BodyContactCompare
  );
  var a = box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_n,
    b = box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_pos,
    c = box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_normal,
    d = this,
    e = -1,
    f = 0,
    g = 0;
  this.m_bodyContactBuffer.count = box2d.std_remove_if(
    this.m_bodyContactBuffer.data,
    function (h) {
      h.index !== e && ((f = 0), (e = h.index));
      if (3 < f++) return ++g, !0;
      var k = a.Copy(h.normal);
      k.SelfMul(d.m_particleDiameter * (1 - h.weight));
      k = box2d.b2Add_V2_V2(d.m_positionBuffer.data[h.index], k, b);
      if (!h.fixture.TestPoint(k)) {
        for (var l = h.fixture.GetShape().GetChildCount(), m = 0; m < l; m++)
          if (h.fixture.ComputeDistance(k, c, m) < box2d.b2_linearSlop)
            return !1;
        ++g;
        return !0;
      }
      return !1;
    },
    this.m_bodyContactBuffer.count
  );
};
box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_n = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_pos = new box2d.b2Vec2();
box2d.b2ParticleSystem.prototype.RemoveSpuriousBodyContacts.s_normal = new box2d.b2Vec2();
box2d.b2ParticleSystem.BodyContactCompare = function (a, b) {
  return a.index === b.index ? a.weight > b.weight : a.index < b.index;
};
box2d.b2ParticleSystem.prototype.DetectStuckParticle = function (a) {
  0 >= this.m_stuckThreshold ||
    (++this.m_bodyContactCountBuffer.data[a],
    2 === this.m_bodyContactCountBuffer.data[a] &&
      (++this.m_consecutiveContactStepsBuffer.data[a],
      this.m_consecutiveContactStepsBuffer.data[a] > this.m_stuckThreshold &&
        (this.m_stuckParticleBuffer.data[
          this.m_stuckParticleBuffer.Append()
        ] = a)),
    (this.m_lastBodyContactStepBuffer.data[a] = this.m_timestamp));
};
box2d.b2ParticleSystem.prototype.ValidateParticleIndex = function (a) {
  return (
    0 <= a && a < this.GetParticleCount() && a !== box2d.b2_invalidParticleIndex
  );
};
box2d.b2ParticleSystem.prototype.GetQuantizedTimeElapsed = function () {
  return Math.floor(this.m_timeElapsed / 4294967296);
};
box2d.b2ParticleSystem.prototype.LifetimeToExpirationTime = function (a) {
  return (
    this.m_timeElapsed +
    Math.floor((a / this.m_def.lifetimeGranularity) * 4294967296)
  );
};
box2d.b2ParticleSystem.prototype.ForceCanBeApplied = function (a) {
  return !(a & box2d.b2ParticleFlag.b2_wallParticle);
};
box2d.b2ParticleSystem.prototype.PrepareForceBuffer = function () {
  if (!this.m_hasForce) {
    for (var a = 0; a < this.m_count; a++) this.m_forceBuffer[a].SetZero();
    this.m_hasForce = !0;
  }
};
box2d.b2ParticleSystem.prototype.IsRigidGroup = function (a) {
  return (
    null !== a &&
    0 !== (a.m_groupFlags & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup)
  );
};
box2d.b2ParticleSystem.prototype.GetLinearVelocity = function (a, b, c, d) {
  return this.IsRigidGroup(a)
    ? a.GetLinearVelocityFromWorldPoint(c, d)
    : d.Copy(this.m_velocityBuffer.data[b]);
};
box2d.b2ParticleSystem.prototype.InitDampingParameter = function (
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h
) {
  a[0] = 0 < d ? 1 / d : 0;
  b[0] = 0 < e ? 1 / e : 0;
  c[0] = box2d.b2Cross_V2_V2(box2d.b2Sub_V2_V2(g, f, box2d.b2Vec2.s_t0), h);
};
box2d.b2ParticleSystem.prototype.InitDampingParameterWithRigidGroupOrParticle = function (
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h
) {
  d
    ? this.InitDampingParameter(
        a,
        b,
        c,
        e.GetMass(),
        e.GetInertia(),
        e.GetCenter(),
        g,
        h
      )
    : this.InitDampingParameter(
        a,
        b,
        c,
        this.m_flagsBuffer.data[f] & box2d.b2ParticleFlag.b2_wallParticle
          ? 0
          : this.GetParticleMass(),
        0,
        g,
        g,
        h
      );
};
box2d.b2ParticleSystem.prototype.ComputeDampingImpulse = function (
  a,
  b,
  c,
  d,
  e,
  f,
  g
) {
  a = a + b * c * c + d + e * f * f;
  return 0 < a ? g / a : 0;
};
box2d.b2ParticleSystem.prototype.ApplyDamping = function (
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h
) {
  d
    ? (e.m_linearVelocity.SelfMulAdd(g * a, h),
      (e.m_angularVelocity += g * c * b))
    : this.m_velocityBuffer.data[f].SelfMulAdd(g * a, h);
};
box2d.b2StackQueue = function (a) {
  this.m_buffer = box2d.b2MakeArray(a);
  this.m_end = a;
};
box2d.b2StackQueue.prototype.m_buffer = null;
box2d.b2StackQueue.prototype.m_front = 0;
box2d.b2StackQueue.prototype.m_back = 0;
box2d.b2StackQueue.prototype.m_capacity = 0;
box2d.b2StackQueue.prototype.Push = function (a) {
  if (this.m_back >= this.m_capacity) {
    for (var b = this.m_front; b < this.m_back; b++)
      this.m_buffer[b - this.m_front] = this.m_buffer[b];
    this.m_back -= this.m_front;
    this.m_front = 0;
    this.m_back >= this.m_capacity &&
      (0 < this.m_capacity
        ? (this.m_buffer.concat(box2d.b2MakeArray(this.m_capacity)),
          (this.m_capacity *= 2))
        : (this.m_buffer.concat(box2d.b2MakeArray(1)), (this.m_capacity = 1)));
  }
  this.m_buffer[this.m_back] = a;
  this.m_back++;
};
box2d.b2StackQueue.prototype.Pop = function () {
  box2d.b2Assert(this.m_front < this.m_back);
  this.m_buffer[this.m_front] = null;
  this.m_front++;
};
box2d.b2StackQueue.prototype.Empty = function () {
  box2d.b2Assert(this.m_front <= this.m_back);
  return this.m_front === this.m_back;
};
box2d.b2StackQueue.prototype.Front = function () {
  return this.m_buffer[this.m_front];
};
box2d.b2VoronoiDiagram = function (a) {
  this.m_generatorBuffer = box2d.b2MakeArray(a, function (a) {
    return new box2d.b2VoronoiDiagram.Generator();
  });
  this.m_generatorCapacity = a;
};
goog.exportSymbol("box2d.b2VoronoiDiagram", box2d.b2VoronoiDiagram);
box2d.b2VoronoiDiagram.prototype.m_generatorBuffer = null;
goog.exportProperty(
  box2d.b2VoronoiDiagram.prototype,
  "m_generatorBuffer",
  box2d.b2VoronoiDiagram.prototype.m_generatorBuffer
);
box2d.b2VoronoiDiagram.prototype.m_generatorCapacity = 0;
box2d.b2VoronoiDiagram.prototype.m_generatorCount = 0;
box2d.b2VoronoiDiagram.prototype.m_countX = 0;
box2d.b2VoronoiDiagram.prototype.m_countY = 0;
box2d.b2VoronoiDiagram.prototype.m_diagram = null;
box2d.b2VoronoiDiagram.Generator = function () {
  this.center = new box2d.b2Vec2();
};
box2d.b2VoronoiDiagram.Generator.prototype.center = null;
box2d.b2VoronoiDiagram.Generator.prototype.tag = 0;
box2d.b2VoronoiDiagram.b2VoronoiDiagramTask = function (a, b, c, d) {
  this.m_x = a;
  this.m_y = b;
  this.m_i = c;
  this.m_generator = d;
};
box2d.b2VoronoiDiagram.b2VoronoiDiagramTask.prototype.m_x = 0;
box2d.b2VoronoiDiagram.b2VoronoiDiagramTask.prototype.m_y = 0;
box2d.b2VoronoiDiagram.b2VoronoiDiagramTask.prototype.m_i = 0;
box2d.b2VoronoiDiagram.b2VoronoiDiagramTask.prototype.m_generator = null;
box2d.b2VoronoiDiagram.prototype.AddGenerator = function (a, b, c) {
  box2d.b2Assert(this.m_generatorCount < this.m_generatorCapacity);
  var d = this.m_generatorBuffer[this.m_generatorCount++];
  d.center.Copy(a);
  d.tag = b;
  d.necessary = c;
};
goog.exportProperty(
  box2d.b2VoronoiDiagram.prototype,
  "AddGenerator",
  box2d.b2VoronoiDiagram.prototype.AddGenerator
);
box2d.b2VoronoiDiagram.prototype.Generate = function (a, b) {
  box2d.b2Assert(null === this.m_diagram);
  for (
    var c = 1 / a,
      d = new box2d.b2Vec2(+box2d.b2_maxFloat, +box2d.b2_maxFloat),
      e = new box2d.b2Vec2(-box2d.b2_maxFloat, -box2d.b2_maxFloat),
      f = 0,
      g = 0;
    g < this.m_generatorCount;
    g++
  ) {
    var h = this.m_generatorBuffer[g];
    h.necessary &&
      (box2d.b2Min_V2_V2(d, h.center, d),
      box2d.b2Max_V2_V2(e, h.center, e),
      ++f);
  }
  if (0 === f) this.m_countY = this.m_countX = 0;
  else {
    d.x -= b;
    d.y -= b;
    e.x += b;
    e.y += b;
    this.m_countX = 1 + Math.floor(c * (e.x - d.x));
    this.m_countY = 1 + Math.floor(c * (e.y - d.y));
    this.m_diagram = box2d.b2MakeArray(this.m_countX * this.m_countY);
    e = new box2d.b2StackQueue(4 * this.m_countX * this.m_countY);
    for (g = 0; g < this.m_generatorCount; g++) {
      h = this.m_generatorBuffer[g];
      h.center.SelfSub(d).SelfMul(c);
      var f = Math.floor(h.center.x),
        k = Math.floor(h.center.y);
      0 <= f &&
        0 <= k &&
        f < this.m_countX &&
        k < this.m_countY &&
        e.Push(
          new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
            f,
            k,
            f + k * this.m_countX,
            h
          )
        );
    }
    for (; !e.Empty(); )
      (g = e.Front()),
        (f = g.m_x),
        (k = g.m_y),
        (c = g.m_i),
        (h = g.m_generator),
        e.Pop(),
        this.m_diagram[c] ||
          ((this.m_diagram[c] = h),
          0 < f &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f - 1,
                k,
                c - 1,
                h
              )
            ),
          0 < k &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f,
                k - 1,
                c - this.m_countX,
                h
              )
            ),
          f < this.m_countX - 1 &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f + 1,
                k,
                c + 1,
                h
              )
            ),
          k < this.m_countY - 1 &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f,
                k + 1,
                c + this.m_countX,
                h
              )
            ));
    for (k = 0; k < this.m_countY; k++)
      for (f = 0; f < this.m_countX - 1; f++)
        (c = f + k * this.m_countX),
          (d = this.m_diagram[c]),
          (g = this.m_diagram[c + 1]),
          d !== g &&
            (e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(f, k, c, g)
            ),
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f + 1,
                k,
                c + 1,
                d
              )
            ));
    for (k = 0; k < this.m_countY - 1; k++)
      for (f = 0; f < this.m_countX; f++)
        (c = f + k * this.m_countX),
          (d = this.m_diagram[c]),
          (g = this.m_diagram[c + this.m_countX]),
          d !== g &&
            (e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(f, k, c, g)
            ),
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f,
                k + 1,
                c + this.m_countX,
                d
              )
            ));
    for (; !e.Empty(); )
      if (
        ((g = e.Front()),
        (f = g.m_x),
        (k = g.m_y),
        (c = g.m_i),
        (g = g.m_generator),
        e.Pop(),
        (d = this.m_diagram[c]),
        d !== g)
      ) {
        var h = d.center.x - f,
          d = d.center.y - k,
          l = g.center.x - f,
          m = g.center.y - k;
        h * h + d * d > l * l + m * m &&
          ((this.m_diagram[c] = g),
          0 < f &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f - 1,
                k,
                c - 1,
                g
              )
            ),
          0 < k &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f,
                k - 1,
                c - this.m_countX,
                g
              )
            ),
          f < this.m_countX - 1 &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f + 1,
                k,
                c + 1,
                g
              )
            ),
          k < this.m_countY - 1 &&
            e.Push(
              new box2d.b2VoronoiDiagram.b2VoronoiDiagramTask(
                f,
                k + 1,
                c + this.m_countX,
                g
              )
            ));
      }
  }
};
goog.exportProperty(
  box2d.b2VoronoiDiagram.prototype,
  "Generate",
  box2d.b2VoronoiDiagram.prototype.Generate
);
box2d.b2VoronoiDiagram.prototype.GetNodes = function (a) {
  for (var b = 0; b < this.m_countY - 1; b++)
    for (var c = 0; c < this.m_countX - 1; c++) {
      var d = c + b * this.m_countX,
        e = this.m_diagram[d],
        f = this.m_diagram[d + 1],
        g = this.m_diagram[d + this.m_countX],
        d = this.m_diagram[d + 1 + this.m_countX];
      f !== g &&
        (e !== f &&
          e !== g &&
          (e.necessary || f.necessary || g.necessary) &&
          a(e.tag, f.tag, g.tag),
        d !== f &&
          d !== g &&
          (e.necessary || f.necessary || g.necessary) &&
          a(f.tag, d.tag, g.tag));
    }
};
goog.exportProperty(
  box2d.b2VoronoiDiagram.prototype,
  "GetNodes",
  box2d.b2VoronoiDiagram.prototype.GetNodes
);
box2d.b2RopeDef = function () {
  this.vertices = [];
  this.masses = [];
  this.gravity = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2RopeDef", box2d.b2RopeDef);
box2d.b2RopeDef.prototype.vertices = null;
box2d.b2RopeDef.prototype.count = 0;
box2d.b2RopeDef.prototype.masses = null;
box2d.b2RopeDef.prototype.gravity = null;
box2d.b2RopeDef.prototype.damping = 0.1;
box2d.b2RopeDef.prototype.k2 = 0.9;
box2d.b2RopeDef.prototype.k3 = 0.1;
box2d.b2Rope = function () {
  this.m_gravity = new box2d.b2Vec2();
};
goog.exportSymbol("box2d.b2Rope", box2d.b2Rope);
box2d.b2Rope.prototype.m_count = 0;
box2d.b2Rope.prototype.m_ps = null;
box2d.b2Rope.prototype.m_p0s = null;
box2d.b2Rope.prototype.m_vs = null;
box2d.b2Rope.prototype.m_ims = null;
box2d.b2Rope.prototype.m_Ls = null;
box2d.b2Rope.prototype.m_as = null;
box2d.b2Rope.prototype.m_gravity = null;
box2d.b2Rope.prototype.m_damping = 0;
box2d.b2Rope.prototype.m_k2 = 1;
box2d.b2Rope.prototype.m_k3 = 0.1;
box2d.b2Rope.prototype.GetVertexCount = function () {
  return this.m_count;
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "GetVertexCount",
  box2d.b2Rope.prototype.GetVertexCount
);
box2d.b2Rope.prototype.GetVertices = function () {
  return this.m_ps;
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "GetVertices",
  box2d.b2Rope.prototype.GetVertices
);
box2d.b2Rope.prototype.Initialize = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= a.count);
  this.m_count = a.count;
  this.m_ps = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_p0s = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_vs = box2d.b2Vec2.MakeArray(this.m_count);
  this.m_ims = box2d.b2MakeNumberArray(this.m_count);
  for (var b = 0; b < this.m_count; ++b) {
    this.m_ps[b].Copy(a.vertices[b]);
    this.m_p0s[b].Copy(a.vertices[b]);
    this.m_vs[b].SetZero();
    var c = a.masses[b];
    this.m_ims[b] = 0 < c ? 1 / c : 0;
  }
  var d = this.m_count - 1,
    c = this.m_count - 2;
  this.m_Ls = box2d.b2MakeNumberArray(d);
  this.m_as = box2d.b2MakeNumberArray(c);
  for (b = 0; b < d; ++b) {
    var e = this.m_ps[b],
      f = this.m_ps[b + 1];
    this.m_Ls[b] = box2d.b2Distance(e, f);
  }
  for (b = 0; b < c; ++b)
    (e = this.m_ps[b]),
      (f = this.m_ps[b + 1]),
      (d = this.m_ps[b + 2]),
      (e = box2d.b2Sub_V2_V2(f, e, box2d.b2Vec2.s_t0)),
      (d = box2d.b2Sub_V2_V2(d, f, box2d.b2Vec2.s_t1)),
      (f = box2d.b2Cross_V2_V2(e, d)),
      (e = box2d.b2Dot_V2_V2(e, d)),
      (this.m_as[b] = box2d.b2Atan2(f, e));
  this.m_gravity.Copy(a.gravity);
  this.m_damping = a.damping;
  this.m_k2 = a.k2;
  this.m_k3 = a.k3;
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "Initialize",
  box2d.b2Rope.prototype.Initialize
);
box2d.b2Rope.prototype.Step = function (a, b) {
  if (0 !== a) {
    for (var c = Math.exp(-a * this.m_damping), d = 0; d < this.m_count; ++d)
      this.m_p0s[d].Copy(this.m_ps[d]),
        0 < this.m_ims[d] && this.m_vs[d].SelfMulAdd(a, this.m_gravity),
        this.m_vs[d].SelfMul(c),
        this.m_ps[d].SelfMulAdd(a, this.m_vs[d]);
    for (d = 0; d < b; ++d) this.SolveC2(), this.SolveC3(), this.SolveC2();
    c = 1 / a;
    for (d = 0; d < this.m_count; ++d)
      box2d.b2Mul_S_V2(
        c,
        box2d.b2Sub_V2_V2(this.m_ps[d], this.m_p0s[d], box2d.b2Vec2.s_t0),
        this.m_vs[d]
      );
  }
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "Step",
  box2d.b2Rope.prototype.Step
);
box2d.b2Rope.prototype.SolveC2 = function () {
  for (var a = this.m_count - 1, b = 0; b < a; ++b) {
    var c = this.m_ps[b],
      d = this.m_ps[b + 1],
      e = box2d.b2Sub_V2_V2(d, c, box2d.b2Rope.s_d),
      f = e.Normalize(),
      g = this.m_ims[b],
      h = this.m_ims[b + 1];
    if (0 !== g + h) {
      var k = h / (g + h);
      c.SelfMulSub((g / (g + h)) * this.m_k2 * (this.m_Ls[b] - f), e);
      d.SelfMulAdd(this.m_k2 * k * (this.m_Ls[b] - f), e);
    }
  }
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "SolveC2",
  box2d.b2Rope.prototype.SolveC2
);
box2d.b2Rope.s_d = new box2d.b2Vec2();
box2d.b2Rope.prototype.SetAngle = function (a) {
  for (var b = this.m_count - 2, c = 0; c < b; ++c) this.m_as[c] = a;
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "SetAngle",
  box2d.b2Rope.prototype.SetAngle
);
box2d.b2Rope.prototype.SolveC3 = function () {
  for (var a = this.m_count - 2, b = 0; b < a; ++b) {
    var c = this.m_ps[b],
      d = this.m_ps[b + 1],
      e = this.m_ps[b + 2],
      f = this.m_ims[b],
      g = this.m_ims[b + 1],
      h = this.m_ims[b + 2],
      k = box2d.b2Sub_V2_V2(d, c, box2d.b2Rope.s_d1),
      l = box2d.b2Sub_V2_V2(e, d, box2d.b2Rope.s_d2),
      m = k.LengthSquared(),
      n = l.LengthSquared();
    if (0 !== m * n) {
      var p = box2d.b2Cross_V2_V2(k, l),
        q = box2d.b2Dot_V2_V2(k, l),
        p = box2d.b2Atan2(p, q),
        k = box2d.b2Mul_S_V2(-1 / m, k.SelfSkew(), box2d.b2Rope.s_Jd1),
        m = box2d.b2Mul_S_V2(1 / n, l.SelfSkew(), box2d.b2Rope.s_Jd2),
        l = box2d.b2Rope.s_J1.Copy(k).SelfNeg(),
        n = box2d.b2Sub_V2_V2(k, m, box2d.b2Rope.s_J2),
        k = m,
        m =
          f * box2d.b2Dot_V2_V2(l, l) +
          g * box2d.b2Dot_V2_V2(n, n) +
          h * box2d.b2Dot_V2_V2(k, k);
      if (0 !== m) {
        m = 1 / m;
        for (q = p - this.m_as[b]; q > box2d.b2_pi; )
          (p -= 2 * box2d.b2_pi), (q = p - this.m_as[b]);
        for (; q < -box2d.b2_pi; )
          (p += 2 * box2d.b2_pi), (q = p - this.m_as[b]);
        p = -this.m_k3 * m * q;
        c.SelfMulAdd(f * p, l);
        d.SelfMulAdd(g * p, n);
        e.SelfMulAdd(h * p, k);
      }
    }
  }
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "SolveC3",
  box2d.b2Rope.prototype.SolveC3
);
box2d.b2Rope.s_d1 = new box2d.b2Vec2();
box2d.b2Rope.s_d2 = new box2d.b2Vec2();
box2d.b2Rope.s_Jd1 = new box2d.b2Vec2();
box2d.b2Rope.s_Jd2 = new box2d.b2Vec2();
box2d.b2Rope.s_J1 = new box2d.b2Vec2();
box2d.b2Rope.s_J2 = new box2d.b2Vec2();
box2d.b2Rope.prototype.Draw = function (a) {
  for (
    var b = new box2d.b2Color(0.4, 0.5, 0.7), c = 0;
    c < this.m_count - 1;
    ++c
  )
    a.DrawSegment(this.m_ps[c], this.m_ps[c + 1], b);
};
goog.exportProperty(
  box2d.b2Rope.prototype,
  "Draw",
  box2d.b2Rope.prototype.Draw
);
box2d.b2ControllerEdge = function () {};
goog.exportSymbol("box2d.b2ControllerEdge", box2d.b2ControllerEdge);
box2d.b2ControllerEdge.prototype.controller = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "controller",
  box2d.b2ControllerEdge.prototype.controller
);
box2d.b2ControllerEdge.prototype.body = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "body",
  box2d.b2ControllerEdge.prototype.body
);
box2d.b2ControllerEdge.prototype.prevBody = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "prevBody",
  box2d.b2ControllerEdge.prototype.prevBody
);
box2d.b2ControllerEdge.prototype.nextBody = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "nextBody",
  box2d.b2ControllerEdge.prototype.nextBody
);
box2d.b2ControllerEdge.prototype.prevController = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "prevController",
  box2d.b2ControllerEdge.prototype.prevController
);
box2d.b2ControllerEdge.prototype.nextController = null;
goog.exportProperty(
  box2d.b2ControllerEdge.prototype,
  "nextController",
  box2d.b2ControllerEdge.prototype.nextController
);
box2d.b2Controller = function () {};
goog.exportSymbol("box2d.b2Controller", box2d.b2Controller);
box2d.b2Controller.prototype.m_world = null;
goog.exportProperty(
  box2d.b2Controller.prototype,
  "m_world",
  box2d.b2Controller.prototype.m_world
);
box2d.b2Controller.prototype.m_bodyList = null;
goog.exportProperty(
  box2d.b2Controller.prototype,
  "m_bodyList",
  box2d.b2Controller.prototype.m_bodyList
);
box2d.b2Controller.prototype.m_bodyCount = 0;
goog.exportProperty(
  box2d.b2Controller.prototype,
  "m_bodyCount",
  box2d.b2Controller.prototype.m_bodyCount
);
box2d.b2Controller.prototype.m_prev = null;
goog.exportProperty(
  box2d.b2Controller.prototype,
  "m_prev",
  box2d.b2Controller.prototype.m_prev
);
box2d.b2Controller.prototype.m_next = null;
goog.exportProperty(
  box2d.b2Controller.prototype,
  "m_next",
  box2d.b2Controller.prototype.m_next
);
box2d.b2Controller.prototype.Step = function (a) {};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "Step",
  box2d.b2Controller.prototype.Step
);
box2d.b2Controller.prototype.Draw = function (a) {};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "Draw",
  box2d.b2Controller.prototype.Draw
);
box2d.b2Controller.prototype.GetNext = function () {
  return this.m_next;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "GetNext",
  box2d.b2Controller.prototype.GetNext
);
box2d.b2Controller.prototype.GetPrev = function () {
  return this.m_prev;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "GetPrev",
  box2d.b2Controller.prototype.GetPrev
);
box2d.b2Controller.prototype.GetWorld = function () {
  return this.m_world;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "GetWorld",
  box2d.b2Controller.prototype.GetWorld
);
box2d.b2Controller.prototype.GetBodyList = function () {
  return this.m_bodyList;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "GetBodyList",
  box2d.b2Controller.prototype.GetBodyList
);
box2d.b2Controller.prototype.AddBody = function (a) {
  var b = new box2d.b2ControllerEdge();
  b.body = a;
  b.controller = this;
  b.nextBody = this.m_bodyList;
  b.prevBody = null;
  this.m_bodyList && (this.m_bodyList.prevBody = b);
  this.m_bodyList = b;
  ++this.m_bodyCount;
  b.nextController = a.m_controllerList;
  b.prevController = null;
  a.m_controllerList && (a.m_controllerList.prevController = b);
  a.m_controllerList = b;
  ++a.m_controllerCount;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "AddBody",
  box2d.b2Controller.prototype.AddBody
);
box2d.b2Controller.prototype.RemoveBody = function (a) {
  box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
  for (var b = this.m_bodyList; b && b.body !== a; ) b = b.nextBody;
  box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== b);
  b.prevBody && (b.prevBody.nextBody = b.nextBody);
  b.nextBody && (b.nextBody.prevBody = b.prevBody);
  this.m_bodyList === b && (this.m_bodyList = b.nextBody);
  --this.m_bodyCount;
  b.nextController && (b.nextController.prevController = b.prevController);
  b.prevController && (b.prevController.nextController = b.nextController);
  a.m_controllerList === b && (a.m_controllerList = b.nextController);
  --a.m_controllerCount;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "RemoveBody",
  box2d.b2Controller.prototype.RemoveBody
);
box2d.b2Controller.prototype.Clear = function () {
  for (; this.m_bodyList; ) this.RemoveBody(this.m_bodyList.body);
  this.m_bodyCount = 0;
};
goog.exportProperty(
  box2d.b2Controller.prototype,
  "Clear",
  box2d.b2Controller.prototype.Clear
);
box2d.b2BuoyancyController = function () {
  box2d.b2Controller.call(this);
  this.normal = new box2d.b2Vec2(0, 1);
  this.velocity = new box2d.b2Vec2(0, 0);
  this.gravity = new box2d.b2Vec2(0, 0);
};
goog.inherits(box2d.b2BuoyancyController, box2d.b2Controller);
goog.exportSymbol("box2d.b2BuoyancyController", box2d.b2BuoyancyController);
box2d.b2BuoyancyController.prototype.normal = null;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "normal",
  box2d.b2BuoyancyController.prototype.normal
);
box2d.b2BuoyancyController.prototype.offset = 0;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "offset",
  box2d.b2BuoyancyController.prototype.offset
);
box2d.b2BuoyancyController.prototype.density = 0;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "density",
  box2d.b2BuoyancyController.prototype.density
);
box2d.b2BuoyancyController.prototype.velocity = null;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "velocity",
  box2d.b2BuoyancyController.prototype.velocity
);
box2d.b2BuoyancyController.prototype.linearDrag = 0;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "linearDrag",
  box2d.b2BuoyancyController.prototype.linearDrag
);
box2d.b2BuoyancyController.prototype.angularDrag = 0;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "angularDrag",
  box2d.b2BuoyancyController.prototype.angularDrag
);
box2d.b2BuoyancyController.prototype.useDensity = !1;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "useDensity",
  box2d.b2BuoyancyController.prototype.useDensity
);
box2d.b2BuoyancyController.prototype.useWorldGravity = !0;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "useWorldGravity",
  box2d.b2BuoyancyController.prototype.useWorldGravity
);
box2d.b2BuoyancyController.prototype.gravity = null;
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "gravity",
  box2d.b2BuoyancyController.prototype.gravity
);
box2d.b2BuoyancyController.prototype.Step = function (a) {
  if (this.m_bodyList)
    for (
      this.useWorldGravity && this.gravity.Copy(this.GetWorld().GetGravity()),
        a = this.m_bodyList;
      a;
      a = a.nextBody
    ) {
      var b = a.body;
      if (b.IsAwake()) {
        for (
          var c = new box2d.b2Vec2(),
            d = new box2d.b2Vec2(),
            e = 0,
            f = 0,
            g = b.GetFixtureList();
          g;
          g = g.m_next
        ) {
          var h = new box2d.b2Vec2(),
            k = g
              .GetShape()
              .ComputeSubmergedArea(
                this.normal,
                this.offset,
                b.GetTransform(),
                h
              ),
            e = e + k;
          c.x += k * h.x;
          c.y += k * h.y;
          var l = 0,
            l = this.useDensity ? g.GetDensity() : 1,
            f = f + k * l;
          d.x += k * h.x * l;
          d.y += k * h.y * l;
        }
        c.x /= e;
        c.y /= e;
        d.x /= f;
        d.y /= f;
        e < box2d.b2_epsilon ||
          ((f = this.gravity.Clone().SelfNeg()),
          f.SelfMul(this.density * e),
          b.ApplyForce(f, d),
          (d = b.GetLinearVelocityFromWorldPoint(c, new box2d.b2Vec2())),
          d.SelfSub(this.velocity),
          d.SelfMul(-this.linearDrag * e),
          b.ApplyForce(d, c),
          b.ApplyTorque(
            (-b.GetInertia() / b.GetMass()) *
              e *
              b.GetAngularVelocity() *
              this.angularDrag
          ));
      }
    }
};
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "Step",
  box2d.b2BuoyancyController.prototype.Step
);
box2d.b2BuoyancyController.prototype.Draw = function (a) {
  var b = new box2d.b2Vec2(),
    c = new box2d.b2Vec2();
  b.x = this.normal.x * this.offset + 100 * this.normal.y;
  b.y = this.normal.y * this.offset - 100 * this.normal.x;
  c.x = this.normal.x * this.offset - 100 * this.normal.y;
  c.y = this.normal.y * this.offset + 100 * this.normal.x;
  var d = new box2d.b2Color(0, 0, 0.8);
  a.DrawSegment(b, c, d);
};
goog.exportProperty(
  box2d.b2BuoyancyController.prototype,
  "Draw",
  box2d.b2BuoyancyController.prototype.Draw
);
box2d.b2ConstantAccelController = function () {
  box2d.b2Controller.call(this);
  this.A = new box2d.b2Vec2(0, 0);
};
goog.inherits(box2d.b2ConstantAccelController, box2d.b2Controller);
goog.exportSymbol(
  "box2d.b2ConstantAccelController",
  box2d.b2ConstantAccelController
);
box2d.b2ConstantAccelController.prototype.A = null;
goog.exportProperty(
  box2d.b2ConstantAccelController.prototype,
  "A",
  box2d.b2ConstantAccelController.prototype.A
);
box2d.b2ConstantAccelController.prototype.Step = function (a) {
  a = box2d.b2Mul_S_V2(
    a.dt,
    this.A,
    box2d.b2ConstantAccelController.prototype.Step.s_dtA
  );
  for (var b = this.m_bodyList; b; b = b.nextBody) {
    var c = b.body;
    c.IsAwake() &&
      c.SetLinearVelocity(
        box2d.b2Add_V2_V2(c.GetLinearVelocity(), a, box2d.b2Vec2.s_t0)
      );
  }
};
goog.exportProperty(
  box2d.b2ConstantAccelController.prototype,
  "Step",
  box2d.b2ConstantAccelController.prototype.Step
);
box2d.b2ConstantAccelController.prototype.Step.s_dtA = new box2d.b2Vec2();
box2d.b2ConstantForceController = function () {
  box2d.b2Controller.call(this);
  this.F = new box2d.b2Vec2(0, 0);
};
goog.inherits(box2d.b2ConstantForceController, box2d.b2Controller);
goog.exportSymbol(
  "box2d.b2ConstantForceController",
  box2d.b2ConstantForceController
);
box2d.b2ConstantAccelController.prototype.F = null;
goog.exportProperty(
  box2d.b2ConstantAccelController.prototype,
  "F",
  box2d.b2ConstantAccelController.prototype.F
);
box2d.b2ConstantForceController.prototype.Step = function (a) {
  for (a = this.m_bodyList; a; a = a.nextBody) {
    var b = a.body;
    b.IsAwake() && b.ApplyForce(this.F, b.GetWorldCenter());
  }
};
goog.exportProperty(
  box2d.b2ConstantForceController.prototype,
  "Step",
  box2d.b2ConstantForceController.prototype.Step
);
box2d.b2GravityController = function () {
  box2d.b2Controller.call(this);
};
goog.inherits(box2d.b2GravityController, box2d.b2Controller);
goog.exportSymbol("box2d.b2GravityController", box2d.b2GravityController);
box2d.b2GravityController.prototype.G = 1;
goog.exportProperty(
  box2d.b2GravityController.prototype,
  "G",
  box2d.b2GravityController.prototype.G
);
box2d.b2GravityController.prototype.invSqr = !0;
goog.exportProperty(
  box2d.b2GravityController.prototype,
  "invSqr",
  box2d.b2GravityController.prototype.invSqr
);
box2d.b2GravityController.prototype.Step = function (a) {
  if (this.invSqr)
    for (a = this.m_bodyList; a; a = a.nextBody)
      for (
        var b = a.body,
          c = b.GetWorldCenter(),
          d = b.GetMass(),
          e = this.m_bodyList;
        e !== a;
        e = e.nextBody
      ) {
        var f = e.body,
          g = f.GetWorldCenter(),
          h = f.GetMass(),
          k = g.x - c.x,
          l = g.y - c.y,
          m = k * k + l * l;
        m < box2d.b2_epsilon ||
          ((k = box2d.b2GravityController.prototype.Step.s_f.Set(k, l)),
          k.SelfMul((this.G / m / box2d.b2Sqrt(m)) * d * h),
          b.IsAwake() && b.ApplyForce(k, c),
          f.IsAwake() && f.ApplyForce(k.SelfMul(-1), g));
      }
  else
    for (a = this.m_bodyList; a; a = a.nextBody)
      for (
        b = a.body,
          c = b.GetWorldCenter(),
          d = b.GetMass(),
          e = this.m_bodyList;
        e !== a;
        e = e.nextBody
      )
        (f = e.body),
          (g = f.GetWorldCenter()),
          (h = f.GetMass()),
          (k = g.x - c.x),
          (l = g.y - c.y),
          (m = k * k + l * l),
          m < box2d.b2_epsilon ||
            ((k = box2d.b2GravityController.prototype.Step.s_f.Set(k, l)),
            k.SelfMul((this.G / m) * d * h),
            b.IsAwake() && b.ApplyForce(k, c),
            f.IsAwake() && f.ApplyForce(k.SelfMul(-1), g));
};
goog.exportProperty(
  box2d.b2GravityController.prototype,
  "Step",
  box2d.b2GravityController.prototype.Step
);
box2d.b2GravityController.prototype.Step.s_f = new box2d.b2Vec2();
box2d.b2TensorDampingController = function () {
  box2d.b2Controller.call(this);
  this.T = new box2d.b2Mat22();
  this.maxTimestep = 0;
};
goog.inherits(box2d.b2TensorDampingController, box2d.b2Controller);
goog.exportSymbol(
  "box2d.b2TensorDampingController",
  box2d.b2TensorDampingController
);
box2d.b2TensorDampingController.prototype.T = new box2d.b2Mat22();
goog.exportProperty(
  box2d.b2TensorDampingController.prototype,
  "T",
  box2d.b2TensorDampingController.prototype.T
);
box2d.b2TensorDampingController.prototype.maxTimestep = 0;
goog.exportProperty(
  box2d.b2TensorDampingController.prototype,
  "maxTimestep",
  box2d.b2TensorDampingController.prototype.maxTimestep
);
box2d.b2TensorDampingController.prototype.Step = function (a) {
  a = a.dt;
  if (!(a <= box2d.b2_epsilon)) {
    a > this.maxTimestep && 0 < this.maxTimestep && (a = this.maxTimestep);
    for (var b = this.m_bodyList; b; b = b.nextBody) {
      var c = b.body;
      if (c.IsAwake()) {
        var d = c.GetWorldVector(
          box2d.b2Mul_M22_V2(
            this.T,
            c.GetLocalVector(c.GetLinearVelocity(), box2d.b2Vec2.s_t0),
            box2d.b2Vec2.s_t1
          ),
          box2d.b2TensorDampingController.prototype.Step.s_damping
        );
        c.SetLinearVelocity(
          box2d.b2Add_V2_V2(
            c.GetLinearVelocity(),
            box2d.b2Mul_S_V2(a, d, box2d.b2Vec2.s_t0),
            box2d.b2Vec2.s_t1
          )
        );
      }
    }
  }
};
box2d.b2TensorDampingController.prototype.Step.s_damping = new box2d.b2Vec2();
box2d.b2TensorDampingController.prototype.SetAxisAligned = function (a, b) {
  this.T.ex.x = -a;
  this.T.ex.y = 0;
  this.T.ey.x = 0;
  this.T.ey.y = -b;
  this.maxTimestep = 0 < a || 0 < b ? 1 / box2d.b2Max(a, b) : 0;
};

box2d.b2Vec2.SubVV = function (a, b, out) {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};
window.box2d = box2d;
(function (exports, Laya) {
  "use strict";

  class IPhysics {}
  IPhysics.RigidBody = null;
  IPhysics.Physics = null;

  class ColliderBase extends Laya.Component {
    constructor() {
      super(...arguments);
      this._isSensor = false;
      this._density = 10;
      this._friction = 0.2;
      this._restitution = 0;
    }
    getDef() {
      if (!this._def) {
        var def = new window.box2d.b2FixtureDef();
        def.density = this.density;
        def.friction = this.friction;
        def.isSensor = this.isSensor;
        def.restitution = this.restitution;
        def.shape = this._shape;
        this._def = def;
      }
      return this._def;
    }
    _onEnable() {
      if (this.rigidBody) {
        this.refresh();
      } else {
        Laya.Laya.systemTimer.callLater(this, this._checkRigidBody);
      }
    }
    _checkRigidBody() {
      if (!this.rigidBody) {
        var comp = this.owner.getComponent(IPhysics.RigidBody);
        if (comp) {
          this.rigidBody = comp;
          this.refresh();
        }
      }
    }
    _onDestroy() {
      if (this.rigidBody) {
        if (this.fixture) {
          if (this.fixture.GetBody() == this.rigidBody._getOriBody()) {
            this.rigidBody.body.DestroyFixture(this.fixture);
          }
          this.fixture = null;
        }
        this.rigidBody = null;
        this._shape = null;
        this._def = null;
        // alert("hello");
      }
    }
    get isSensor() {
      return this._isSensor;
    }
    set isSensor(value) {
      this._isSensor = value;
      if (this._def) {
        this._def.isSensor = value;
        this.refresh();
      }
    }
    get density() {
      return this._density;
    }
    set density(value) {
      this._density = value;
      if (this._def) {
        this._def.density = value;
        this.refresh();
      }
    }
    get friction() {
      return this._friction;
    }
    set friction(value) {
      this._friction = value;
      if (this._def) {
        this._def.friction = value;
        this.refresh();
      }
    }
    get restitution() {
      return this._restitution;
    }
    set restitution(value) {
      this._restitution = value;
      if (this._def) {
        this._def.restitution = value;
        this.refresh();
      }
    }
    refresh() {
      if (this.enabled && this.rigidBody) {
        var body = this.rigidBody.body;
        if (this.fixture) {
          if (this.fixture.GetBody() == this.rigidBody.body) {
            this.rigidBody.body.DestroyFixture(this.fixture);
          }
          this.fixture.Destroy();
          this.fixture = null;
        }
        var def = this.getDef();
        def.filter.groupIndex = this.rigidBody.group;
        def.filter.categoryBits = this.rigidBody.category;
        def.filter.maskBits = this.rigidBody.mask;
        this.fixture = body.CreateFixture(def);
        this.fixture.collider = this;
      }
    }
    resetShape(re = true) {}
    get isSingleton() {
      return false;
    }
  }
  Laya.ClassUtils.regClass("laya.physics.ColliderBase", ColliderBase);
  Laya.ClassUtils.regClass("Laya.ColliderBase", ColliderBase);

  class RigidBody extends Laya.Component {
    constructor() {
      super(...arguments);
      this._type = "dynamic";
      this._allowSleep = true;
      this._angularVelocity = 0;
      this._angularDamping = 0;
      this._linearVelocity = {
        x: 0,
        y: 0,
      };
      this._linearDamping = 0;
      this._bullet = false;
      this._allowRotation = true;
      this._gravityScale = 1;
      this.group = 0;
      this.category = 1;
      this.mask = -1;
      this.label = "RigidBody";
      this.tag = "RigidBody_Tag"; //2020/08/29新增 用於敵人判斷
    }
    _createBody() {
      if (this._body || !this.owner) return;
      var sp = this.owner;
      var box2d = window.box2d;
      var def = new box2d.b2BodyDef();
      var point = sp.localToGlobal(
        Laya.Point.TEMP.setTo(0, 0),
        false,
        IPhysics.Physics.I.worldRoot
      );
      def.position.Set(
        point.x / IPhysics.Physics.PIXEL_RATIO,
        point.y / IPhysics.Physics.PIXEL_RATIO
      );
      def.angle = Laya.Utils.toRadian(sp.rotation);
      def.allowSleep = this._allowSleep;
      def.angularDamping = this._angularDamping;
      def.angularVelocity = this._angularVelocity;
      def.bullet = this._bullet;
      def.fixedRotation = !this._allowRotation;
      def.gravityScale = this._gravityScale;
      def.linearDamping = this._linearDamping;
      var obj = this._linearVelocity;
      if ((obj && obj.x != 0) || obj.y != 0) {
        def.linearVelocity = new box2d.b2Vec2(obj.x, obj.y);
      }
      def.type = box2d.b2BodyType["b2_" + this._type + "Body"];
      this._body = IPhysics.Physics.I._createBody(def);
      this.resetCollider(false);
    }
    _onAwake() {
      this._createBody();
    }
    _onEnable() {
      var _$this = this;
      this._createBody();
      Laya.Laya.physicsTimer.frameLoop(1, this, this._sysPhysicToNode);
      var sp = this.owner;
      if (this.accessGetSetFunc(sp, "x", "set") && !sp._changeByRigidBody) {
        sp._changeByRigidBody = true;

        function setX(value) {
          _$this.accessGetSetFunc(sp, "x", "set")(value);
          _$this._sysPosToPhysic();
        }
        this._overSet(sp, "x", setX);

        function setY(value) {
          _$this.accessGetSetFunc(sp, "y", "set")(value);
          _$this._sysPosToPhysic();
        }
        this._overSet(sp, "y", setY);

        function setRotation(value) {
          _$this.accessGetSetFunc(sp, "rotation", "set")(value);
          _$this._sysNodeToPhysic();
        }
        this._overSet(sp, "rotation", setRotation);

        function setScaleX(value) {
          _$this.accessGetSetFunc(sp, "scaleX", "set")(value);
          _$this.resetCollider(true);
        }
        this._overSet(sp, "scaleX", setScaleX);

        function setScaleY(value) {
          _$this.accessGetSetFunc(sp, "scaleY", "set")(value);
          _$this.resetCollider(true);
        }
        this._overSet(sp, "scaleY", setScaleY);
      }
    }
    accessGetSetFunc(obj, prop, accessor) {
      if (["get", "set"].indexOf(accessor) === -1) {
        return;
      }
      let privateProp = `_$${accessor}_${prop}`;
      if (obj[privateProp]) {
        return obj[privateProp];
      }
      let ObjConstructor = obj.constructor;
      let des;
      while (ObjConstructor) {
        des = Object.getOwnPropertyDescriptor(ObjConstructor.prototype, prop);
        if (des && des[accessor]) {
          obj[privateProp] = des[accessor].bind(obj);
          break;
        }
        ObjConstructor = Object.getPrototypeOf(ObjConstructor);
      }
      return obj[privateProp];
    }
    resetCollider(resetShape) {
      var comps = this.owner.getComponents(ColliderBase);
      if (comps) {
        for (var i = 0, n = comps.length; i < n; i++) {
          var collider = comps[i];
          collider.rigidBody = this;
          if (resetShape) collider.resetShape();
          else collider.refresh();
        }
      }
    }
    _sysPhysicToNode() {
      if (this.type != "static" && this._body.IsAwake()) {
        var pos = this._body.GetPosition();
        var ang = this._body.GetAngle();
        var sp = this.owner;
        this.accessGetSetFunc(
          sp,
          "rotation",
          "set"
        )(Laya.Utils.toAngle(ang) - sp.parent.globalRotation);
        if (ang == 0) {
          var point = sp.parent.globalToLocal(
            Laya.Point.TEMP.setTo(
              pos.x * IPhysics.Physics.PIXEL_RATIO + sp.pivotX,
              pos.y * IPhysics.Physics.PIXEL_RATIO + sp.pivotY
            ),
            false,
            IPhysics.Physics.I.worldRoot
          );
          this.accessGetSetFunc(sp, "x", "set")(point.x);
          this.accessGetSetFunc(sp, "y", "set")(point.y);
        } else {
          point = sp.globalToLocal(
            Laya.Point.TEMP.setTo(
              pos.x * IPhysics.Physics.PIXEL_RATIO,
              pos.y * IPhysics.Physics.PIXEL_RATIO
            ),
            false,
            IPhysics.Physics.I.worldRoot
          );
          point.x += sp.pivotX;
          point.y += sp.pivotY;
          point = sp.toParentPoint(point);
          this.accessGetSetFunc(sp, "x", "set")(point.x);
          this.accessGetSetFunc(sp, "y", "set")(point.y);
        }
      }
    }
    _sysNodeToPhysic() {
      var sp = this.owner;
      this._body.SetAngle(Laya.Utils.toRadian(sp.rotation));
      var p = sp.localToGlobal(
        Laya.Point.TEMP.setTo(0, 0),
        false,
        IPhysics.Physics.I.worldRoot
      );
      this._body.SetPositionXY(
        p.x / IPhysics.Physics.PIXEL_RATIO,
        p.y / IPhysics.Physics.PIXEL_RATIO
      );
    }
    _sysPosToPhysic() {
      var sp = this.owner;
      var p = sp.localToGlobal(
        Laya.Point.TEMP.setTo(0, 0),
        false,
        IPhysics.Physics.I.worldRoot
      );
      this._body.SetPositionXY(
        p.x / IPhysics.Physics.PIXEL_RATIO,
        p.y / IPhysics.Physics.PIXEL_RATIO
      );
    }
    _overSet(sp, prop, getfun) {
      Object.defineProperty(sp, prop, {
        get: this.accessGetSetFunc(sp, prop, "get"),
        set: getfun,
        enumerable: false,
        configurable: true,
      });
    }
    _onDisable() {
      Laya.Laya.physicsTimer.clear(this, this._sysPhysicToNode);
      this._body && IPhysics.Physics.I._removeBody(this._body);
      this._body = null;
      var owner = this.owner;
      if (owner._changeByRigidBody) {
        this._overSet(owner, "x", this.accessGetSetFunc(owner, "x", "set"));
        this._overSet(owner, "y", this.accessGetSetFunc(owner, "y", "set"));
        this._overSet(
          owner,
          "rotation",
          this.accessGetSetFunc(owner, "rotation", "set")
        );
        this._overSet(
          owner,
          "scaleX",
          this.accessGetSetFunc(owner, "scaleX", "set")
        );
        this._overSet(
          owner,
          "scaleY",
          this.accessGetSetFunc(owner, "scaleY", "set")
        );
        owner._changeByRigidBody = false;
      }
    }
    getBody() {
      if (!this._body) this._onAwake();
      return this._body;
    }
    _getOriBody() {
      return this._body;
    }
    get body() {
      if (!this._body) this._onAwake();
      return this._body;
    }
    applyForce(position, force) {
      if (!this._body) this._onAwake();
      this._body.ApplyForce(force, position);
    }
    applyForceToCenter(force) {
      if (!this._body) this._onAwake();
      this._body.ApplyForceToCenter(force);
    }
    applyLinearImpulse(position, impulse) {
      if (!this._body) this._onAwake();
      this._body.ApplyLinearImpulse(impulse, position);
    }
    applyLinearImpulseToCenter(impulse) {
      if (!this._body) this._onAwake();
      this._body.ApplyLinearImpulseToCenter(impulse);
    }
    applyTorque(torque) {
      if (!this._body) this._onAwake();
      this._body.ApplyTorque(torque);
    }
    setVelocity(velocity) {
      if (!this._body) this._onAwake();
      
      this._body.SetLinearVelocity(velocity);
    }
    setAngle(value) {
      if (!this._body) this._onAwake();
      this._body.SetAngle(value);
      this._body.SetAwake(true);
    }
    getMass() {
      return this._body ? this._body.GetMass() : 0;
    }
    getCenter() {
      if (!this._body) this._onAwake();
      var p = this._body.GetLocalCenter();
      p.x = p.x * IPhysics.Physics.PIXEL_RATIO;
      p.y = p.y * IPhysics.Physics.PIXEL_RATIO;
      return p;
    }
    getWorldCenter() {
      if (!this._body) this._onAwake();
      var p = this._body.GetWorldCenter();
      p.x = p.x * IPhysics.Physics.PIXEL_RATIO;
      p.y = p.y * IPhysics.Physics.PIXEL_RATIO;
      return p;
    }
    get type() {
      return this._type;
    }
    set type(value) {
      this._type = value;
      if (this._body)
        this._body.SetType(
          window.box2d.b2BodyType["b2_" + this._type + "Body"]
        );
    }
    get gravityScale() {
      return this._gravityScale;
    }
    set gravityScale(value) {
      this._gravityScale = value;
      if (this._body) this._body.SetGravityScale(value);
    }
    get allowRotation() {
      return this._allowRotation;
    }
    set allowRotation(value) {
      this._allowRotation = value;
      if (this._body) this._body.SetFixedRotation(!value);
    }
    get allowSleep() {
      return this._allowSleep;
    }
    set allowSleep(value) {
      this._allowSleep = value;
      if (this._body) this._body.SetSleepingAllowed(value);
    }
    get angularDamping() {
      return this._angularDamping;
    }
    set angularDamping(value) {
      this._angularDamping = value;
      if (this._body) this._body.SetAngularDamping(value);
    }
    get angularVelocity() {
      if (this._body) return this._body.GetAngularVelocity();
      return this._angularVelocity;
    }
    set angularVelocity(value) {
      this._angularVelocity = value;
      if (this._body) this._body.SetAngularVelocity(value);
    }
    get linearDamping() {
      return this._linearDamping;
    }
    set linearDamping(value) {
      this._linearDamping = value;
      if (this._body) this._body.SetLinearDamping(value);
    }
    get linearVelocity() {
      if (this._body) {
        var vec = this._body.GetLinearVelocity();
        return {
          x: vec.x,
          y: vec.y,
        };
      }
      return this._linearVelocity;
    }
    set linearVelocity(value) {
      if (!value) return;
      if (value instanceof Array) {
        value = {
          x: value[0],
          y: value[1],
        };
      }
      this._linearVelocity = value;
      if (this._body)
        this._body.SetLinearVelocity(new window.box2d.b2Vec2(value.x, value.y));
    }
    get bullet() {
      return this._bullet;
    }
    set bullet(value) {
      this._bullet = value;
      if (this._body) this._body.SetBullet(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.RigidBody", RigidBody);
  Laya.ClassUtils.regClass("Laya.RigidBody", RigidBody);

  class DestructionListener {
    SayGoodbyeJoint(params) {
      params.m_userData && (params.m_userData.isDestroy = true);
    }
    SayGoodbyeFixture(params) {}
    SayGoodbyeParticleGroup(params) {}
    SayGoodbyeParticle(params) {}
  }

  class Physics extends Laya.EventDispatcher {
    constructor() {
      super();
      this.box2d = window.box2d;
      this.velocityIterations = 8;
      this.positionIterations = 3;
      this._eventList = [];
    }
    static get I() {
      return Physics._I || (Physics._I = new Physics());
    }
    static enable(options = null) {
      Physics.I.start(options);
      IPhysics.RigidBody = RigidBody;
      IPhysics.Physics = this;
    }
    start(options = null) {
      if (!this._enabled) {
        this._enabled = true;
        options || (options = {});
        var box2d = window.box2d;
        if (box2d == null) {
          console.error(
            "Can not find box2d libs, you should request box2d.js first."
          );
          return;
        }
        var gravity = new box2d.b2Vec2(
          0,
          options.gravity || 500 / Physics.PIXEL_RATIO
        );
        this.world = new box2d.b2World(gravity);
        this.world.SetDestructionListener(new DestructionListener());
        this.world.SetContactListener(new ContactListener());
        this.allowSleeping =
          options.allowSleeping == null ? true : options.allowSleeping;
        if (!options.customUpdate)
          Laya.Laya.physicsTimer.frameLoop(1, this, this._update);
        this._emptyBody = this._createBody(new window.box2d.b2BodyDef());
      }
    }
    _update() {
      this.world.Step(
        1 / 60,
        this.velocityIterations,
        this.positionIterations,
        3
      );
      var len = this._eventList.length;
      if (len > 0) {
        for (var i = 0; i < len; i += 2) {
          this._sendEvent(this._eventList[i], this._eventList[i + 1]);
        }
        this._eventList.length = 0;
      }
    }
    _sendEvent(type, contact) {
      var colliderA = contact.GetFixtureA().collider;
      var colliderB = contact.GetFixtureB().collider;
      var ownerA = colliderA.owner;
      var ownerB = colliderB.owner;
      contact.getHitInfo = function () {
        var manifold = new this.box2d.b2WorldManifold();
        this.GetWorldManifold(manifold);
        var p = manifold.points[0];
        p.x *= Physics.PIXEL_RATIO;
        p.y *= Physics.PIXEL_RATIO;
        return manifold;
      };
      if (ownerA) {
        var args = [colliderB, colliderA, contact];
        if (type === 0) {
          ownerA.event(Laya.Event.TRIGGER_ENTER, args);
          if (!ownerA["_triggered"]) {
            ownerA["_triggered"] = true;
          } else {
            ownerA.event(Laya.Event.TRIGGER_STAY, args);
          }
        } else {
          ownerA["_triggered"] = false;
          ownerA.event(Laya.Event.TRIGGER_EXIT, args);
        }
      }
      if (ownerB) {
        args = [colliderA, colliderB, contact];
        if (type === 0) {
          ownerB.event(Laya.Event.TRIGGER_ENTER, args);
          if (!ownerB["_triggered"]) {
            ownerB["_triggered"] = true;
          } else {
            ownerB.event(Laya.Event.TRIGGER_STAY, args);
          }
        } else {
          ownerB["_triggered"] = false;
          ownerB.event(Laya.Event.TRIGGER_EXIT, args);
        }
      }
    }
    _createBody(def) {
      if (this.world) {
        return this.world.CreateBody(def);
      } else {
        console.error(
          'The physical engine should be initialized first.use "Physics.enable()"'
        );
        return null;
      }
    }
    _removeBody(body) {
      if (this.world) {
        this.world.DestroyBody(body);
      } else {
        console.error(
          'The physical engine should be initialized first.use "Physics.enable()"'
        );
      }
    }
    _createJoint(def) {
      if (this.world) {
        let joint = this.world.CreateJoint(def);
        joint.m_userData = {};
        joint.m_userData.isDestroy = false;
        return joint;
      } else {
        console.error(
          'The physical engine should be initialized first.use "Physics.enable()"'
        );
        return null;
      }
    }
    _removeJoint(joint) {
      if (this.world) {
        this.world.DestroyJoint(joint);
      } else {
        console.error(
          'The physical engine should be initialized first.use "Physics.enable()"'
        );
      }
    }
    stop() {
      Laya.Laya.physicsTimer.clear(this, this._update);
    }
    get allowSleeping() {
      return this.world.GetAllowSleeping();
    }
    set allowSleeping(value) {
      this.world.SetAllowSleeping(value);
    }
    get gravity() {
      return this.world.GetGravity();
    }
    set gravity(value) {
      this.world.SetGravity(value);
    }
    getBodyCount() {
      return this.world.GetBodyCount();
    }
    getContactCount() {
      return this.world.GetContactCount();
    }
    getJointCount() {
      return this.world.GetJointCount();
    }
    get worldRoot() {
      return this._worldRoot || Laya.Laya.stage;
    }
    set worldRoot(value) {
      this._worldRoot = value;
      if (value) {
        var p = value.localToGlobal(Laya.Point.TEMP.setTo(0, 0));
        this.world.ShiftOrigin({
          x: p.x / Physics.PIXEL_RATIO,
          y: p.y / Physics.PIXEL_RATIO,
        });
      }
    }
  }
  Physics.PIXEL_RATIO = 50;
  Laya.ClassUtils.regClass("laya.physics.Physics", Physics);
  Laya.ClassUtils.regClass("Laya.Physics", Physics);
  class ContactListener {
    BeginContact(contact) {
      Physics.I._eventList.push(0, contact);
    }
    EndContact(contact) {
      Physics.I._eventList.push(1, contact);
    }
    PreSolve(contact, oldManifold) {}
    PostSolve(contact, impulse) {}
  }

  class BoxCollider extends ColliderBase {
    constructor() {
      super(...arguments);
      this._x = 0;
      this._y = 0;
      this._width = 100;
      this._height = 100;
    }
    getDef() {
      if (!this._shape) {
        this._shape = new window.box2d.b2PolygonShape();
        this._setShape(false);
      }
      this.label = this.label || "BoxCollider";
      this.tag = this.tag || "BoxCollider_Tag"; //2020/08/29新增 用於敵人判斷
      return super.getDef();
    }
    _setShape(re = true) {
      var scaleX = this.owner["scaleX"] || 1;
      var scaleY = this.owner["scaleY"] || 1;
      this._shape.SetAsBox(
        (this._width / 2 / Physics.PIXEL_RATIO) * scaleX,
        (this._height / 2 / Physics.PIXEL_RATIO) * scaleY,
        new window.box2d.b2Vec2(
          ((this._width / 2 + this._x) / Physics.PIXEL_RATIO) * scaleX,
          ((this._height / 2 + this._y) / Physics.PIXEL_RATIO) * scaleY
        )
      );
      if (re) this.refresh();
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      if (this._shape) this._setShape();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      if (this._shape) this._setShape();
    }
    get width() {
      return this._width;
    }
    set width(value) {
      if (value <= 0) throw "BoxCollider size cannot be less than 0";
      this._width = value;
      if (this._shape) this._setShape();
    }
    get height() {
      return this._height;
    }
    set height(value) {
      if (value <= 0) throw "BoxCollider size cannot be less than 0";
      this._height = value;
      if (this._shape) this._setShape();
    }
    resetShape(re = true) {
      this._setShape();
    }
  }
  Laya.ClassUtils.regClass("laya.physics.BoxCollider", BoxCollider);
  Laya.ClassUtils.regClass("Laya.BoxCollider", BoxCollider);

  class ChainCollider extends ColliderBase {
    constructor() {
      super(...arguments);
      this._x = 0;
      this._y = 0;
      this._points = "0,0,100,0";
      this._loop = false;
    }
    getDef() {
      if (!this._shape) {
        this._shape = new window.box2d.b2ChainShape();
        this._setShape(false);
      }
      this.label = this.label || "ChainCollider";
      this.tag = this.tag || "ChainCollider"; //2020/08/29新增 用於敵人判斷
      return super.getDef();
    }
    _setShape(re = true) {
      var arr = this._points.split(",");
      var len = arr.length;
      if (len % 2 == 1)
        throw "ChainCollider points lenth must a multiplier of 2";
      var ps = [];
      for (var i = 0, n = len; i < n; i += 2) {
        ps.push(
          new window.box2d.b2Vec2(
            (this._x + parseInt(arr[i])) / Physics.PIXEL_RATIO,
            (this._y + parseInt(arr[i + 1])) / Physics.PIXEL_RATIO
          )
        );
      }
      this._loop
        ? this._shape.CreateLoop(ps, len / 2)
        : this._shape.CreateChain(ps, len / 2);
      if (re) this.refresh();
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      if (this._shape) this._setShape();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      if (this._shape) this._setShape();
    }
    get points() {
      return this._points;
    }
    set points(value) {
      if (!value) throw "ChainCollider points cannot be empty";
      this._points = value;
      if (this._shape) this._setShape();
    }
    get loop() {
      return this._loop;
    }
    set loop(value) {
      this._loop = value;
      if (this._shape) this._setShape();
    }
  }
  Laya.ClassUtils.regClass("laya.physics.ChainCollider", ChainCollider);
  Laya.ClassUtils.regClass("Laya.ChainCollider", ChainCollider);

  class CircleCollider extends ColliderBase {
    constructor() {
      super(...arguments);
      this._x = 0;
      this._y = 0;
      this._radius = 50;
    }
    getDef() {
      if (!this._shape) {
        this._shape = new window.box2d.b2CircleShape();
        this._setShape(false);
      }
      this.label = this.label || "CircleCollider";
      this.tag = this.tag || "CircleCollider"; //2020/08/29新增 用於敵人判斷
      return super.getDef();
    }
    _setShape(re = true) {
      var scale = this.owner["scaleX"] || 1;
      this._shape.m_radius = (this._radius / Physics.PIXEL_RATIO) * scale;
      this._shape.m_p.Set(
        ((this._radius + this._x) / Physics.PIXEL_RATIO) * scale,
        ((this._radius + this._y) / Physics.PIXEL_RATIO) * scale
      );
      if (re) this.refresh();
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      if (this._shape) this._setShape();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      if (this._shape) this._setShape();
    }
    get radius() {
      return this._radius;
    }
    set radius(value) {
      if (value <= 0) throw "CircleCollider radius cannot be less than 0";
      this._radius = value;
      if (this._shape) this._setShape();
    }
    resetShape(re = true) {
      this._setShape();
    }
  }
  Laya.ClassUtils.regClass("laya.physics.CircleCollider", CircleCollider);
  Laya.ClassUtils.regClass("Laya.CircleCollider", CircleCollider);

  class PhysicsDebugDraw extends Laya.Sprite {
    constructor() {
      super();
      this.m_drawFlags = 99;
      if (!PhysicsDebugDraw._inited) {
        PhysicsDebugDraw._inited = true;
        PhysicsDebugDraw.init();
      }
      this._camera = {};
      this._camera.m_center = new PhysicsDebugDraw.box2d.b2Vec2(0, 0);
      this._camera.m_extent = 25;
      this._camera.m_zoom = 1;
      this._camera.m_width = 1280;
      this._camera.m_height = 800;
      this._mG = new Laya.Graphics();
      this.graphics = this._mG;
      this._textSp = new Laya.Sprite();
      this._textG = this._textSp.graphics;
      this.addChild(this._textSp);
    }
    static init() {
      PhysicsDebugDraw.box2d = Laya.Browser.window.box2d;
      PhysicsDebugDraw.DrawString_s_color = new PhysicsDebugDraw.box2d.b2Color(
        0.9,
        0.6,
        0.6
      );
      PhysicsDebugDraw.DrawStringWorld_s_p = new PhysicsDebugDraw.box2d.b2Vec2();
      PhysicsDebugDraw.DrawStringWorld_s_cc = new PhysicsDebugDraw.box2d.b2Vec2();
      PhysicsDebugDraw.DrawStringWorld_s_color = new PhysicsDebugDraw.box2d.b2Color(
        0.5,
        0.9,
        0.5
      );
    }
    render(ctx, x, y) {
      this._renderToGraphic();
      super.render(ctx, x, y);
    }
    _renderToGraphic() {
      if (this.world) {
        this._textG.clear();
        this._mG.clear();
        this._mG.save();
        this._mG.scale(Physics.PIXEL_RATIO, Physics.PIXEL_RATIO);
        this.lineWidth = 1 / Physics.PIXEL_RATIO;
        this.world.DrawDebugData();
        this._mG.restore();
      }
    }
    SetFlags(flags) {
      this.m_drawFlags = flags;
    }
    GetFlags() {
      return this.m_drawFlags;
    }
    AppendFlags(flags) {
      this.m_drawFlags |= flags;
    }
    ClearFlags(flags) {
      this.m_drawFlags &= ~flags;
    }
    PushTransform(xf) {
      this._mG.save();
      this._mG.translate(xf.p.x, xf.p.y);
      this._mG.rotate(xf.q.GetAngle());
    }
    PopTransform(xf) {
      this._mG.restore();
    }
    DrawPolygon(vertices, vertexCount, color) {
      var i, len;
      len = vertices.length;
      var points;
      points = [];
      for (i = 0; i < vertexCount; i++) {
        points.push(vertices[i].x, vertices[i].y);
      }
      this._mG.drawPoly(
        0,
        0,
        points,
        null,
        color.MakeStyleString(1),
        this.lineWidth
      );
    }
    DrawSolidPolygon(vertices, vertexCount, color) {
      var i, len;
      len = vertices.length;
      var points;
      points = [];
      for (i = 0; i < vertexCount; i++) {
        points.push(vertices[i].x, vertices[i].y);
      }
      this._mG.drawPoly(
        0,
        0,
        points,
        color.MakeStyleString(0.5),
        color.MakeStyleString(1),
        this.lineWidth
      );
    }
    DrawCircle(center, radius, color) {
      this._mG.drawCircle(
        center.x,
        center.y,
        radius,
        null,
        color.MakeStyleString(1),
        this.lineWidth
      );
    }
    DrawSolidCircle(center, radius, axis, color) {
      var cx = center.x;
      var cy = center.y;
      this._mG.drawCircle(
        cx,
        cy,
        radius,
        color.MakeStyleString(0.5),
        color.MakeStyleString(1),
        this.lineWidth
      );
      this._mG.drawLine(
        cx,
        cy,
        cx + axis.x * radius,
        cy + axis.y * radius,
        color.MakeStyleString(1),
        this.lineWidth
      );
    }
    DrawParticles(centers, radius, colors, count) {
      if (colors !== null) {
        for (var i = 0; i < count; ++i) {
          var center = centers[i];
          var color = colors[i];
          this._mG.drawCircle(
            center.x,
            center.y,
            radius,
            color.MakeStyleString(),
            null,
            this.lineWidth
          );
        }
      } else {
        for (i = 0; i < count; ++i) {
          center = centers[i];
          this._mG.drawCircle(
            center.x,
            center.y,
            radius,
            "#ffff00",
            null,
            this.lineWidth
          );
        }
      }
    }
    DrawSegment(p1, p2, color) {
      this._mG.drawLine(
        p1.x,
        p1.y,
        p2.x,
        p2.y,
        color.MakeStyleString(1),
        this.lineWidth
      );
    }
    DrawTransform(xf) {
      this.PushTransform(xf);
      this._mG.drawLine(
        0,
        0,
        1,
        0,
        PhysicsDebugDraw.box2d.b2Color.RED.MakeStyleString(1),
        this.lineWidth
      );
      this._mG.drawLine(
        0,
        0,
        0,
        1,
        PhysicsDebugDraw.box2d.b2Color.GREEN.MakeStyleString(1),
        this.lineWidth
      );
      this.PopTransform(xf);
    }
    DrawPoint(p, size, color) {
      size *= this._camera.m_zoom;
      size /= this._camera.m_extent;
      var hsize = size / 2;
      this._mG.drawRect(
        p.x - hsize,
        p.y - hsize,
        size,
        size,
        color.MakeStyleString(),
        null
      );
    }
    DrawString(x, y, message) {
      this._textG.fillText(
        message,
        x,
        y,
        "15px DroidSans",
        PhysicsDebugDraw.DrawString_s_color.MakeStyleString(),
        "left"
      );
    }
    DrawStringWorld(x, y, message) {
      this.DrawString(x, y, message);
    }
    DrawAABB(aabb, color) {
      var x = aabb.lowerBound.x;
      var y = aabb.lowerBound.y;
      var w = aabb.upperBound.x - aabb.lowerBound.x;
      var h = aabb.upperBound.y - aabb.lowerBound.y;
      this._mG.drawRect(
        x,
        y,
        w,
        h,
        null,
        color.MakeStyleString(),
        this.lineWidth
      );
    }
    static enable(flags = 99) {
      if (!PhysicsDebugDraw.I) {
        var debug = new PhysicsDebugDraw();
        debug.world = Physics.I.world;
        debug.world.SetDebugDraw(debug);
        debug.zOrder = 1000;
        debug.m_drawFlags = flags;
        Laya.Laya.stage.addChild(debug);
        PhysicsDebugDraw.I = debug;
      }
      return debug;
    }
  }
  PhysicsDebugDraw._inited = false;
  Laya.ClassUtils.regClass("laya.physics.PhysicsDebugDraw", PhysicsDebugDraw);
  Laya.ClassUtils.regClass("Laya.PhysicsDebugDraw", PhysicsDebugDraw);

  class PolygonCollider extends ColliderBase {
    constructor() {
      super(...arguments);
      this._x = 0;
      this._y = 0;
      this._points = "50,0,100,100,0,100";
    }
    getDef() {
      if (!this._shape) {
        this._shape = new window.box2d.b2PolygonShape();
        this._setShape(false);
      }
      this.label = this.label || "PolygonCollider";
      this.tag = this.tag || "PolygonCollider"; //2020/08/29新增 用於敵人判斷
      return super.getDef();
    }
    _setShape(re = true) {
      var arr = this._points.split(",");
      var len = arr.length;
      if (len < 6) throw "PolygonCollider points must be greater than 3";
      if (len % 2 == 1)
        throw "PolygonCollider points lenth must a multiplier of 2";
      var ps = [];
      for (var i = 0, n = len; i < n; i += 2) {
        ps.push(
          new window.box2d.b2Vec2(
            (this._x + parseInt(arr[i])) / Physics.PIXEL_RATIO,
            (this._y + parseInt(arr[i + 1])) / Physics.PIXEL_RATIO
          )
        );
      }
      this._shape.Set(ps, len / 2);
      if (re) this.refresh();
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      if (this._shape) this._setShape();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      if (this._shape) this._setShape();
    }
    get points() {
      return this._points;
    }
    set points(value) {
      if (!value) throw "PolygonCollider points cannot be empty";
      this._points = value;
      if (this._shape) this._setShape();
    }
  }
  Laya.ClassUtils.regClass("laya.physics.PolygonCollider", PolygonCollider);
  Laya.ClassUtils.regClass("Laya.PolygonCollider", PolygonCollider);

  class JointBase extends Laya.Component {
    get joint() {
      if (!this._joint) this._createJoint();
      return this._joint;
    }
    _onEnable() {
      this._createJoint();
    }
    _onAwake() {
      this._createJoint();
    }
    _createJoint() {}
    _onDisable() {
      if (
        this._joint &&
        this._joint.m_userData &&
        !this._joint.m_userData.isDestroy
      ) {
        Physics.I._removeJoint(this._joint);
      }
      this._joint = null;
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.JointBase", JointBase);
  Laya.ClassUtils.regClass("Laya.JointBase", JointBase);

  class DistanceJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.selfAnchor = [0, 0];
      this.otherAnchor = [0, 0];
      this.collideConnected = false;
      this._length = 0;
      this._frequency = 0;
      this._damping = 0;
    }
    _createJoint() {
      if (!this._joint) {
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          DistanceJoint._temp ||
          (DistanceJoint._temp = new box2d.b2DistanceJointDef());
        def.bodyA = this.otherBody
          ? this.otherBody.getBody()
          : Physics.I._emptyBody;
        def.bodyB = this.selfBody.getBody();
        def.localAnchorA.Set(
          this.otherAnchor[0] / Physics.PIXEL_RATIO,
          this.otherAnchor[1] / Physics.PIXEL_RATIO
        );
        def.localAnchorB.Set(
          this.selfAnchor[0] / Physics.PIXEL_RATIO,
          this.selfAnchor[1] / Physics.PIXEL_RATIO
        );
        def.frequencyHz = this._frequency;
        def.dampingRatio = this._damping;
        def.collideConnected = this.collideConnected;
        var p1 = def.bodyA.GetWorldPoint(def.localAnchorA, new box2d.b2Vec2());
        var p2 = def.bodyB.GetWorldPoint(def.localAnchorB, new box2d.b2Vec2());
        def.length =
          this._length / Physics.PIXEL_RATIO ||
          box2d.b2Vec2.SubVV(p2, p1, new box2d.b2Vec2()).Length();
        this._joint = Physics.I._createJoint(def);
      }
    }
    get length() {
      return this._length;
    }
    set length(value) {
      this._length = value;
      if (this._joint) this._joint.SetLength(value / Physics.PIXEL_RATIO);
    }
    get frequency() {
      return this._frequency;
    }
    set frequency(value) {
      this._frequency = value;
      if (this._joint) this._joint.SetFrequency(value);
    }
    get damping() {
      return this._damping;
    }
    set damping(value) {
      this._damping = value;
      if (this._joint) this._joint.SetDampingRatio(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.DistanceJoint", DistanceJoint);
  Laya.ClassUtils.regClass("Laya.DistanceJoint", DistanceJoint);

  class GearJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.collideConnected = false;
      this._ratio = 1;
    }
    _createJoint() {
      if (!this._joint) {
        if (!this.joint1) throw "Joint1 can not be empty";
        if (!this.joint2) throw "Joint2 can not be empty";
        var box2d = window.box2d;
        var def =
          GearJoint._temp || (GearJoint._temp = new box2d.b2GearJointDef());
        def.bodyA = this.joint1.owner.getComponent(RigidBody).getBody();
        def.bodyB = this.joint2.owner.getComponent(RigidBody).getBody();
        def.joint1 = this.joint1.joint;
        def.joint2 = this.joint2.joint;
        def.ratio = this._ratio;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get ratio() {
      return this._ratio;
    }
    set ratio(value) {
      this._ratio = value;
      if (this._joint) this._joint.SetRatio(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.GearJoint", GearJoint);
  Laya.ClassUtils.regClass("Laya.GearJoint", GearJoint);

  class MotorJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.collideConnected = false;
      this._linearOffset = [0, 0];
      this._angularOffset = 0;
      this._maxForce = 1000;
      this._maxTorque = 1000;
      this._correctionFactor = 0.3;
    }
    _createJoint() {
      if (!this._joint) {
        if (!this.otherBody) throw "otherBody can not be empty";
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          MotorJoint._temp || (MotorJoint._temp = new box2d.b2MotorJointDef());
        def.Initialize(this.otherBody.getBody(), this.selfBody.getBody());
        def.linearOffset = new box2d.b2Vec2(
          this._linearOffset[0] / Physics.PIXEL_RATIO,
          this._linearOffset[1] / Physics.PIXEL_RATIO
        );
        def.angularOffset = this._angularOffset;
        def.maxForce = this._maxForce;
        def.maxTorque = this._maxTorque;
        def.correctionFactor = this._correctionFactor;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get linearOffset() {
      return this._linearOffset;
    }
    set linearOffset(value) {
      this._linearOffset = value;
      if (this._joint)
        this._joint.SetLinearOffset(
          new window.box2d.b2Vec2(
            value[0] / Physics.PIXEL_RATIO,
            value[1] / Physics.PIXEL_RATIO
          )
        );
    }
    get angularOffset() {
      return this._angularOffset;
    }
    set angularOffset(value) {
      this._angularOffset = value;
      if (this._joint) this._joint.SetAngularOffset(value);
    }
    get maxForce() {
      return this._maxForce;
    }
    set maxForce(value) {
      this._maxForce = value;
      if (this._joint) this._joint.SetMaxForce(value);
    }
    get maxTorque() {
      return this._maxTorque;
    }
    set maxTorque(value) {
      this._maxTorque = value;
      if (this._joint) this._joint.SetMaxTorque(value);
    }
    get correctionFactor() {
      return this._correctionFactor;
    }
    set correctionFactor(value) {
      this._correctionFactor = value;
      if (this._joint) this._joint.SetCorrectionFactor(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.MotorJoint", MotorJoint);
  Laya.ClassUtils.regClass("Laya.MotorJoint", MotorJoint);

  class MouseJoint extends JointBase {
    constructor() {
      super(...arguments);
      this._maxForce = 10000;
      this._frequency = 5;
      this._damping = 0.7;
    }
    _onEnable() {
      this.owner.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    }
    _onAwake() {}
    onMouseDown() {
      this._createJoint();
      Laya.Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      Laya.Laya.stage.once(Laya.Event.MOUSE_UP, this, this.onStageMouseUp);
    }
    _createJoint() {
      if (!this._joint) {
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          MouseJoint._temp || (MouseJoint._temp = new box2d.b2MouseJointDef());
        if (this.anchor) {
          var anchorPos = this.selfBody.owner.localToGlobal(
            Laya.Point.TEMP.setTo(this.anchor[0], this.anchor[1]),
            false,
            Physics.I.worldRoot
          );
        } else {
          anchorPos = Physics.I.worldRoot.globalToLocal(
            Laya.Point.TEMP.setTo(
              Laya.Laya.stage.mouseX,
              Laya.Laya.stage.mouseY
            )
          );
        }
        var anchorVec = new box2d.b2Vec2(
          anchorPos.x / Physics.PIXEL_RATIO,
          anchorPos.y / Physics.PIXEL_RATIO
        );
        def.bodyA = Physics.I._emptyBody;
        def.bodyB = this.selfBody.getBody();
        def.target = anchorVec;
        def.frequencyHz = this._frequency;
        def.damping = this._damping;
        def.maxForce = this._maxForce;
        this._joint = Physics.I._createJoint(def);
      }
    }
    onStageMouseUp() {
      Laya.Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      super._onDisable();
    }
    onMouseMove() {
      this._joint.SetTarget(
        new window.box2d.b2Vec2(
          Physics.I.worldRoot.mouseX / Physics.PIXEL_RATIO,
          Physics.I.worldRoot.mouseY / Physics.PIXEL_RATIO
        )
      );
    }
    _onDisable() {
      this.owner.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
      super._onDisable();
    }
    get maxForce() {
      return this._maxForce;
    }
    set maxForce(value) {
      this._maxForce = value;
      if (this._joint) this._joint.SetMaxForce(value);
    }
    get frequency() {
      return this._frequency;
    }
    set frequency(value) {
      this._frequency = value;
      if (this._joint) this._joint.SetFrequency(value);
    }
    get damping() {
      return this._damping;
    }
    set damping(value) {
      this._damping = value;
      if (this._joint) this._joint.SetDampingRatio(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.MouseJoint", MouseJoint);
  Laya.ClassUtils.regClass("Laya.MouseJoint", MouseJoint);

  class PrismaticJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.anchor = [0, 0];
      this.axis = [1, 0];
      this.collideConnected = false;
      this._enableMotor = false;
      this._motorSpeed = 0;
      this._maxMotorForce = 10000;
      this._enableLimit = false;
      this._lowerTranslation = 0;
      this._upperTranslation = 0;
    }
    _createJoint() {
      if (!this._joint) {
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          PrismaticJoint._temp ||
          (PrismaticJoint._temp = new box2d.b2PrismaticJointDef());
        var anchorPos = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.anchor[0], this.anchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVec = new box2d.b2Vec2(
          anchorPos.x / Physics.PIXEL_RATIO,
          anchorPos.y / Physics.PIXEL_RATIO
        );
        def.Initialize(
          this.otherBody ? this.otherBody.getBody() : Physics.I._emptyBody,
          this.selfBody.getBody(),
          anchorVec,
          new box2d.b2Vec2(this.axis[0], this.axis[1])
        );
        def.enableMotor = this._enableMotor;
        def.motorSpeed = this._motorSpeed;
        def.maxMotorForce = this._maxMotorForce;
        def.enableLimit = this._enableLimit;
        def.lowerTranslation = this._lowerTranslation / Physics.PIXEL_RATIO;
        def.upperTranslation = this._upperTranslation / Physics.PIXEL_RATIO;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get enableMotor() {
      return this._enableMotor;
    }
    set enableMotor(value) {
      this._enableMotor = value;
      if (this._joint) this._joint.EnableMotor(value);
    }
    get motorSpeed() {
      return this._motorSpeed;
    }
    set motorSpeed(value) {
      this._motorSpeed = value;
      if (this._joint) this._joint.SetMotorSpeed(value);
    }
    get maxMotorForce() {
      g;
      return this._maxMotorForce;
    }
    set maxMotorForce(value) {
      this._maxMotorForce = value;
      if (this._joint) this._joint.SetMaxMotorForce(value);
    }
    get enableLimit() {
      return this._enableLimit;
    }
    set enableLimit(value) {
      this._enableLimit = value;
      if (this._joint) this._joint.EnableLimit(value);
    }
    get lowerTranslation() {
      return this._lowerTranslation;
    }
    set lowerTranslation(value) {
      this._lowerTranslation = value;
      if (this._joint) this._joint.SetLimits(value, this._upperTranslation);
    }
    get upperTranslation() {
      return this._upperTranslation;
    }
    set upperTranslation(value) {
      this._upperTranslation = value;
      if (this._joint) this._joint.SetLimits(this._lowerTranslation, value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.PrismaticJoint", PrismaticJoint);
  Laya.ClassUtils.regClass("Laya.PrismaticJoint", PrismaticJoint);

  class PulleyJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.selfAnchor = [0, 0];
      this.otherAnchor = [0, 0];
      this.selfGroundPoint = [0, 0];
      this.otherGroundPoint = [0, 0];
      this.ratio = 1.5;
      this.collideConnected = false;
    }
    _createJoint() {
      if (!this._joint) {
        if (!this.otherBody) throw "otherBody can not be empty";
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          PulleyJoint._temp ||
          (PulleyJoint._temp = new box2d.b2PulleyJointDef());
        var posA = this.otherBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.otherAnchor[0], this.otherAnchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVecA = new box2d.b2Vec2(
          posA.x / Physics.PIXEL_RATIO,
          posA.y / Physics.PIXEL_RATIO
        );
        var posB = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.selfAnchor[0], this.selfAnchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVecB = new box2d.b2Vec2(
          posB.x / Physics.PIXEL_RATIO,
          posB.y / Physics.PIXEL_RATIO
        );
        var groundA = this.otherBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(
            this.otherGroundPoint[0],
            this.otherGroundPoint[1]
          ),
          false,
          Physics.I.worldRoot
        );
        var groundVecA = new box2d.b2Vec2(
          groundA.x / Physics.PIXEL_RATIO,
          groundA.y / Physics.PIXEL_RATIO
        );
        var groundB = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(
            this.selfGroundPoint[0],
            this.selfGroundPoint[1]
          ),
          false,
          Physics.I.worldRoot
        );
        var groundVecB = new box2d.b2Vec2(
          groundB.x / Physics.PIXEL_RATIO,
          groundB.y / Physics.PIXEL_RATIO
        );
        def.Initialize(
          this.otherBody.getBody(),
          this.selfBody.getBody(),
          groundVecA,
          groundVecB,
          anchorVecA,
          anchorVecB,
          this.ratio
        );
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.PulleyJoint", PulleyJoint);
  Laya.ClassUtils.regClass("Laya.PulleyJoint", PulleyJoint);

  class RevoluteJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.anchor = [0, 0];
      this.collideConnected = false;
      this._enableMotor = false;
      this._motorSpeed = 0;
      this._maxMotorTorque = 10000;
      this._enableLimit = false;
      this._lowerAngle = 0;
      this._upperAngle = 0;
    }
    _createJoint() {
      if (!this._joint) {
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          RevoluteJoint._temp ||
          (RevoluteJoint._temp = new box2d.b2RevoluteJointDef());
        var anchorPos = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.anchor[0], this.anchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVec = new box2d.b2Vec2(
          anchorPos.x / Physics.PIXEL_RATIO,
          anchorPos.y / Physics.PIXEL_RATIO
        );
        def.Initialize(
          this.otherBody ? this.otherBody.getBody() : Physics.I._emptyBody,
          this.selfBody.getBody(),
          anchorVec
        );
        def.enableMotor = this._enableMotor;
        def.motorSpeed = this._motorSpeed;
        def.maxMotorTorque = this._maxMotorTorque;
        def.enableLimit = this._enableLimit;
        def.lowerAngle = this._lowerAngle;
        def.upperAngle = this._upperAngle;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get enableMotor() {
      return this._enableMotor;
    }
    set enableMotor(value) {
      this._enableMotor = value;
      if (this._joint) this._joint.EnableMotor(value);
    }
    get motorSpeed() {
      return this._motorSpeed;
    }
    set motorSpeed(value) {
      this._motorSpeed = value;
      if (this._joint) this._joint.SetMotorSpeed(value);
    }
    get maxMotorTorque() {
      return this._maxMotorTorque;
    }
    set maxMotorTorque(value) {
      this._maxMotorTorque = value;
      if (this._joint) this._joint.SetMaxMotorTorque(value);
    }
    get enableLimit() {
      return this._enableLimit;
    }
    set enableLimit(value) {
      this._enableLimit = value;
      if (this._joint) this._joint.EnableLimit(value);
    }
    get lowerAngle() {
      return this._lowerAngle;
    }
    set lowerAngle(value) {
      this._lowerAngle = value;
      if (this._joint) this._joint.SetLimits(value, this._upperAngle);
    }
    get upperAngle() {
      return this._upperAngle;
    }
    set upperAngle(value) {
      this._upperAngle = value;
      if (this._joint) this._joint.SetLimits(this._lowerAngle, value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.RevoluteJoint", RevoluteJoint);
  Laya.ClassUtils.regClass("Laya.RevoluteJoint", RevoluteJoint);

  class RopeJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.selfAnchor = [0, 0];
      this.otherAnchor = [0, 0];
      this.collideConnected = false;
      this._maxLength = 1;
    }
    _createJoint() {
      if (!this._joint) {
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          RopeJoint._temp || (RopeJoint._temp = new box2d.b2RopeJointDef());
        def.bodyA = this.otherBody
          ? this.otherBody.getBody()
          : Physics.I._emptyBody;
        def.bodyB = this.selfBody.getBody();
        def.localAnchorA.Set(
          this.otherAnchor[0] / Physics.PIXEL_RATIO,
          this.otherAnchor[1] / Physics.PIXEL_RATIO
        );
        def.localAnchorB.Set(
          this.selfAnchor[0] / Physics.PIXEL_RATIO,
          this.selfAnchor[1] / Physics.PIXEL_RATIO
        );
        def.maxLength = this._maxLength / Physics.PIXEL_RATIO;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get maxLength() {
      return this._maxLength;
    }
    set maxLength(value) {
      this._maxLength = value;
      if (this._joint) this._joint.SetMaxLength(value / Physics.PIXEL_RATIO);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.RopeJoint", RopeJoint);
  Laya.ClassUtils.regClass("Laya.RopeJoint", RopeJoint);

  class WeldJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.anchor = [0, 0];
      this.collideConnected = false;
      this._frequency = 5;
      this._damping = 0.7;
    }
    _createJoint() {
      if (!this._joint) {
        if (!this.otherBody) throw "otherBody can not be empty";
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          WeldJoint._temp || (WeldJoint._temp = new box2d.b2WeldJointDef());
        var anchorPos = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.anchor[0], this.anchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVec = new box2d.b2Vec2(
          anchorPos.x / Physics.PIXEL_RATIO,
          anchorPos.y / Physics.PIXEL_RATIO
        );
        def.Initialize(
          this.otherBody.getBody(),
          this.selfBody.getBody(),
          anchorVec
        );
        def.frequencyHz = this._frequency;
        def.dampingRatio = this._damping;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get frequency() {
      return this._frequency;
    }
    set frequency(value) {
      this._frequency = value;
      if (this._joint) this._joint.SetFrequency(value);
    }
    get damping() {
      return this._damping;
    }
    set damping(value) {
      this._damping = value;
      if (this._joint) this._joint.SetDampingRatio(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.WeldJoint", WeldJoint);
  Laya.ClassUtils.regClass("Laya.WeldJoint", WeldJoint);

  class WheelJoint extends JointBase {
    constructor() {
      super(...arguments);
      this.anchor = [0, 0];
      this.collideConnected = false;
      this.axis = [1, 0];
      this._frequency = 5;
      this._damping = 0.7;
      this._enableMotor = false;
      this._motorSpeed = 0;
      this._maxMotorTorque = 10000;
    }
    _createJoint() {
      if (!this._joint) {
        if (!this.otherBody) throw "otherBody can not be empty";
        this.selfBody = this.selfBody || this.owner.getComponent(RigidBody);
        if (!this.selfBody) throw "selfBody can not be empty";
        var box2d = window.box2d;
        var def =
          WheelJoint._temp || (WheelJoint._temp = new box2d.b2WheelJointDef());
        var anchorPos = this.selfBody.owner.localToGlobal(
          Laya.Point.TEMP.setTo(this.anchor[0], this.anchor[1]),
          false,
          Physics.I.worldRoot
        );
        var anchorVec = new box2d.b2Vec2(
          anchorPos.x / Physics.PIXEL_RATIO,
          anchorPos.y / Physics.PIXEL_RATIO
        );
        def.Initialize(
          this.otherBody.getBody(),
          this.selfBody.getBody(),
          anchorVec,
          new box2d.b2Vec2(this.axis[0], this.axis[1])
        );
        def.enableMotor = this._enableMotor;
        def.motorSpeed = this._motorSpeed;
        def.maxMotorTorque = this._maxMotorTorque;
        def.frequencyHz = this._frequency;
        def.dampingRatio = this._damping;
        def.collideConnected = this.collideConnected;
        this._joint = Physics.I._createJoint(def);
      }
    }
    get frequency() {
      return this._frequency;
    }
    set frequency(value) {
      this._frequency = value;
      if (this._joint) this._joint.SetSpringFrequencyHz(value);
    }
    get damping() {
      return this._damping;
    }
    set damping(value) {
      this._damping = value;
      if (this._joint) this._joint.SetSpringDampingRatio(value);
    }
    get enableMotor() {
      return this._enableMotor;
    }
    set enableMotor(value) {
      this._enableMotor = value;
      if (this._joint) this._joint.EnableMotor(value);
    }
    get motorSpeed() {
      return this._motorSpeed;
    }
    set motorSpeed(value) {
      this._motorSpeed = value;
      if (this._joint) this._joint.SetMotorSpeed(value);
    }
    get maxMotorTorque() {
      return this._maxMotorTorque;
    }
    set maxMotorTorque(value) {
      this._maxMotorTorque = value;
      if (this._joint) this._joint.SetMaxMotorTorque(value);
    }
  }
  Laya.ClassUtils.regClass("laya.physics.joint.WheelJoint", WheelJoint);
  Laya.ClassUtils.regClass("Laya.WheelJoint", WheelJoint);

  exports.BoxCollider = BoxCollider;
  exports.ChainCollider = ChainCollider;
  exports.CircleCollider = CircleCollider;
  exports.ColliderBase = ColliderBase;
  exports.DestructionListener = DestructionListener;
  exports.DistanceJoint = DistanceJoint;
  exports.GearJoint = GearJoint;
  exports.IPhysics = IPhysics;
  exports.JointBase = JointBase;
  exports.MotorJoint = MotorJoint;
  exports.MouseJoint = MouseJoint;
  exports.Physics = Physics;
  exports.PhysicsDebugDraw = PhysicsDebugDraw;
  exports.PolygonCollider = PolygonCollider;
  exports.PrismaticJoint = PrismaticJoint;
  exports.PulleyJoint = PulleyJoint;
  exports.RevoluteJoint = RevoluteJoint;
  exports.RigidBody = RigidBody;
  exports.RopeJoint = RopeJoint;
  exports.WeldJoint = WeldJoint;
  exports.WheelJoint = WheelJoint;
})((window.Laya = window.Laya || {}), Laya);
