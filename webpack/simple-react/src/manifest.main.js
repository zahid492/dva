(function (modules) {
    // webpackBootstrap 启动函数，modules 存所有模块函数的数组

    // install a JSONP callback for chunk loading
    // 从异步加载文件中安装模块，bundle 文件的包裹函数
    function webpackJsonpCallback(data) {
        // 加载的文件中，需要加载的模块的 chunk Id，对应 installedChunks
        var chunkIds = data[0];
        // 加载的文件中，需要安装的模块列表，打包的所有模块函数
        var moreModules = data[1];
        // 所有模块安装成功后，需要立即执行的模块的 index，对应 modules
        var executeModules = data[2];

        // 把 "moreModules" 添加到 modules 对象,
        // 所有 "chunkIds" 对应的模块标记为已加载，并执行回调
        var moduleId,
            chunkId,
            i = 0,
            resolves = [];

        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            // 如果该 chunkId 代表的 chunk 已加载，放入 resolves
            if (
                Object.prototype.hasOwnProperty.call(
                    installedChunks,
                    chunkId
                ) &&
                installedChunks[chunkId]
            ) {
                // 按需加载的模块取出 resolve 函数
                resolves.push(installedChunks[chunkId][0]);
            }
            // 标记为为加载完成
            installedChunks[chunkId] = 0;
        }
        // 从模块列表中取出 moduleId 对应的模块，放入全局 modules 中
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }

        // webpackJsonpCallback 代理了 jsonpArray 的 push 方法，
        // 需要执行一下老的 jsonpArray 的 push 方法
        if (parentJsonpFunction) parentJsonpFunction(data);

        // 把已加载模块挨个执行一次，执行 resolve，一般是 __webpack_require
        while (resolves.length) {
            resolves.shift()();
        }

        // add entry modules from loaded chunk to deferred list
        // 执行入口模块，用户自己的模块
        deferredModules.push.apply(deferredModules, executeModules || []);

        // run deferred modules when all chunks ready
        // 检查每个入口依赖的异步模块是否加载完，执行入口模块
        return checkDeferredModules();
    }

    function checkDeferredModules() {
        var result;
        for (var i = 0; i < deferredModules.length; i++) {
            var deferredModule = deferredModules[i];
            var fulfilled = true;
            for (var j = 1; j < deferredModule.length; j++) {
                var depId = deferredModule[j];
                if (installedChunks[depId] !== 0) fulfilled = false;
            }
            if (fulfilled) {
                deferredModules.splice(i--, 1);
                result = __webpack_require__(
                    (__webpack_require__.s = deferredModule[0])
                );
            }
        }

        return result;
    }

    // The module cache，已经加载的模块缓存起来
    var installedModules = {};

    // 保存已加载和加载中 chunk，按需加载的模块
    // undefined 是 chunk 没加载,
    // null 是 chunk preloaded/prefetched 预加载/预获取
    // Promise 是 chunk 加载中,
    // 0 是 chunk 已加载
    var installedChunks = {
        4: 0,
    };

    var deferredModules = [];

    // script path function
    function jsonpScriptSrc(chunkId) {
        return (
            __webpack_require__.p +
            '' +
            ({ '0': 'Hello' }[chunkId] || chunkId) +
            '.' +
            {
                '0': 'dff1fca5',
                '1': '73bdec98',
                '5': 'a722479e',
                '6': '87e5fd4a',
                '7': '12cff450',
            }[chunkId] +
            '.js'
        );
    }

    // modules 里的模块函数运行为模块对象，把模块的 export赋值给模块对象
    // 保存到 installedModules 中
    function __webpack_require__(moduleId) {
        // Check if module is in cache 加载过的，直接返回缓存
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = (installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {},
        });

        // 获取 moduleId 对应的函数，并传入 module 参数，执行模块函数
        modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );

        // Flag the module as loaded
        module.l = true;

        // 模块执行完，会把模块实例挂到 module.exports 上，返回模块实例
        return module.exports;
    }

    // This file contains only the entry chunk.
    // The chunk loading function for additional chunks
    // 通过建立 promise 对象来跟踪按需加载模块的加载状态，设置超时阈值
    // 不超时的话，就不需要 installedChunks，把按需模块当做普通模块处理
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];

        // JSONP chunk loading for javascript

        var installedChunkData = installedChunks[chunkId];
        // 没加载完的模块
        if (installedChunkData !== 0) {
            // 0 means "already installed".

            // a Promise means "currently loading".
            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                // setup Promise in chunk cache
                // 将正在加载的模块标记，为包含 resolve,reject,promise 的数组
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [
                        resolve,
                        reject,
                    ];
                });
                promises.push((installedChunkData[2] = promise));

                // start chunk loading
                var script = document.createElement('script');
                var onScriptComplete;

                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute('nonce', __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);

                // create error before stack unwound to get useful stacktrace later
                var error = new Error();
                onScriptComplete = function (event) {
                    // avoid mem leaks in IE.
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        // 没有加载成功
                        if (chunk) {
                            var errorType =
                                event &&
                                (event.type === 'load'
                                    ? 'missing'
                                    : event.type);
                            var realSrc =
                                event && event.target && event.target.src;
                            error.message =
                                'Loading chunk ' +
                                chunkId +
                                ' failed.\n(' +
                                errorType +
                                ': ' +
                                realSrc +
                                ')';
                            error.name = 'ChunkLoadError';
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        // 标记为没加载
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function () {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };

    // expose the modules object (__webpack_modules__) 全局暴露模块数组
    __webpack_require__.m = modules;

    // expose the module cache 全局暴露已加载的模块对象缓存
    __webpack_require__.c = installedModules;

    // define getter function for harmony exports 子模块获取方法
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter,
            });
        }
    };

    // define __esModule on exports 定义 _esModules 属性在 exports 对象上，ES6标记
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: 'Module',
            });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // create a fake namespace object 把模块模拟为命名空间对象，添加 __esModule，default 返回
    // mode & 1: value is a module id, require it
    // mode & 2: merge all properties of value into the ns
    // mode & 4: return value when already ns object
    // mode & 8|1: behave like require
    __webpack_require__.t = function (value, mode) {
        // 获取并返回对象
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        // 给对象添加属性
        if (mode & 4 && typeof value === 'object' && value && value.__esModule)
            return value;
        // 创建命名空间
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        // 定义模拟 Es 模块默认返回
        Object.defineProperty(ns, 'default', {
            enumerable: true,
            value: value,
        });
        // 命名空间即为模块对象
        if (mode & 2 && typeof value != 'string') {
            for (var key in value) {
                __webpack_require__.d(
                    ns,
                    key,
                    function (key) {
                        return value[key];
                    }.bind(null, key)
                );
            }
        }

        return ns;
    };

    // getDefaultExport function for compatibility with non-harmony modules
    // 为没有 __esModule 的模块添加默认返回方法
    __webpack_require__.n = function (module) {
        var getter =
            module && module.__esModule
                ? function getDefault() {
                      return module['default'];
                  }
                : function getModuleExports() {
                      return module;
                  };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    // __webpack_public_path__ 配置中的 publicPath 用于加载被分割出去的异步代码
    __webpack_require__.p = '';

    // on error function for async loading
    __webpack_require__.oe = function (err) {
        console.error(err);
        throw err;
    };

    // 模块的异步依赖数组
    var jsonpArray = (window['webpackJsonp'] = window['webpackJsonp'] || []);
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++)
        webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;

    // run deferred modules from other chunks
    checkDeferredModules();
})(
    /************************************************************************/
    []
);
//# sourceMappingURL=manifest.main.8ae8e683.map
