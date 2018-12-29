// 2018-12-21
// Observable 可同时处理同步和非同步行为， observer 是一个事件，具有 3个方法。
// subscribe 函数执行时传入观察者  observer，在此函数内执行观察者的方法 (next, error, complete)
// 数组的 operator 都会完整运算出每个元素的返回值组成一个数组，再做下个 operator。
// observable operator 的运算因为元素是渐进取得的关系，每次的运算是一个元素运算到底。
//渐进式取值的观念在 Observable 中其实非常的重要，这个特性也使得 Observable
// 相较于 Array 的 operator 在做运算时来的高效很多，尤其是在处理大量资料的时候会非常明显！
// of 同步传值, from 数组，可枚举参数 Set, Iterator，String，Promise
// fromEventPattern(addHandler, removeHandler, selector) 从类观察者对象创建 Observable
// events observable 尽量不用 unsubscribe, 通常用 takeUntil

function fromEventPatternTest(){

    class Producer {
        constructor() {
            this.listeners = [];
        }
        addListener(listener) {
            if(typeof listener === 'function') {
                this.listeners.push(listener)
            } else {
                throw new Error('listener 必须是 function')
            }
        }
        removeListener(listener) {
            this.listeners.splice(this.listeners.indexOf(listener), 1)
        }
        notify(message) {
            this.listeners.forEach(listener => {
                listener(message);
            })
        }
    }

    function observer(name) {
        return {
            next: (value) => console.log(`Next ${name}: ${value}`),
            error: (err) => console.log(`Error ${name}: ${err}`),
            complete: () => console.log(`Complete ${name}`)
        };
    }

    spy.log('users');

    const egg = new Producer();

    const users = fromEventPattern(
        (h)=>egg.addListener(h),
        (h)=>egg.removeListener(h),
        (arg)=>{
            console.log(...arg);
            return arg + "!"
        }
    ).pipe(tag('users'));

    users.subscribe(observer("user"));

    egg.notify("hello man")
}

// empty 返回空的 Observable，订阅此 Observable 会立即发送 complete 消息.
// never 无穷的 Observable，永远不返回，无消息传出.

// interval 持续的行为 从零开始递增的整数，讯号发出的间隔时间。
// timer(等待时间number date，间隔时间)

// 组合筛选：
// combineAll 通过等待外部 Observable 完成然后应用 combineLatest ，将高阶 Observable 转化为一阶 Observable。

// combineLast 组合多个observable, 根据每个 observable 的最新值得出。
// 每个 observable 都至少发出一个值后才会发出初始值。

// withLatestFrom 有主从关系，在主 observable 送出值时计算。
// forkJoin 当所有 observables 完成时，发出每个 observable 的最新值。只需要 observables 发出一个值，或只需要它们完成前的最新值时。

// concat 合并多个 observable 为一个，按顺序执行（等前一个observable 完成才继续下一个）。
// concatAll 二维数组摊平为一维数组，请小心 backpressure (背压)
// concatMap == map + concatAll

// merge 把多个 observable 同时处理合并为一个 observable
// pairwise 将前一个值和当前值作为数组发出
// race 使用首先发出值的 observable 。
// zip 组合多个observable, 所有 observable 的值按顺序组合来的。必须cache 住没处理的元素。
// zipAll
// 每个 operator 都会回传一个新的 Observable, 可以通过 create 方法建各种 operator

// 过滤：
// skip 略过前几个发送的元素
// skipUntil 跳过源 observable 发出的值，直到提供的 observable 发出值。
// skpWhile 跳过源 observable 发出的值，直到提供的表达式结果为 false。
// takeUntil 发出值，直到提供的 observable 发出值，它便完成。
// takeUntil(notifier) 某件事发生时让 observable 发生 complete 信息。

// takeLast 取最后几个，必须等到整个 observable 完成才知道取最后那些元素，并且同步发送。
// takeWhile 发出值，直到提供的表达式结果为 false 。
// last = takeLast(1) 取最后一个
// startWith 在 observable 开始塞要发送的元素，一开始就同步发出。
// max min
// scan reduce 的别名

// 转换：
// buffer(closingNotifier) 缓冲源 Observable 的值直到 closingNotifier 发出
// bufferCount(bufferSize, startBufferEvery) 缓冲源 Observable 的值直到缓冲数量到达设定的 bufferSize
// bufferTime(bufferTimeSpan, bufferCreationInterval, maxBufferSize)
// 在特定时间周期内缓冲源 Observable 的值。
// bufferCount, bufferTime 第二个参数是何时开启下一个缓冲区
// 源发出 startBufferEvery 值后，或 bufferCreationInterval 时间后。
// 第一个参数是决定缓冲区的数量

// bufferToggle(openings, closingSelector) 开启开关以捕获源 observable 所发出的值，关闭开关以将缓冲的值作为数组发出。
// bufferWhen(closingSelector) 收集值，直到关闭选择器发出值才发出缓冲的值。

// exhaust 通过丢弃内部 Observable 使得 高阶 Observable 转换成一阶 Observable
// exhaustMap 映射成内部 observable，忽略其他值直到该 observable 完成。
// expand 递归调用提供的函数
// partition 根据条件拆分一个 Observable 成2个
// pluck 选择属性发出
// elementAt 只发出单个值，这个值位于源 Observable 的发送序列中的指定 index 处。
// every 返回的 Observable 发出是否源 Observable 的每项都满足指定的条件。
// find findIndex first forEach(next)
// isEmpty
// delayWhen(selector) 延迟发出值，延迟时间由提供函数决定。

// debounce(durationSelector) 去抖控值，根据选择器函数，[舍弃掉]在两次输出之间小于指定时间的发出值。
// 只有在另一个 Observable 决定的一段特定时间经过后并且没有发出另一个源值之后，才从源 Observable 中发出一个值。
// throttle(durationSelector) 节流阀控频，以某个时间间隔为阈值，在 durationSelector 完成前将抑制新值的发出
// throttle 更适合用在连续性行为

// audit(durationSelector) 和 throttle 很像, 但是发出沉默时间窗口的最后一个值, 而不是第一个
// 在durationSelector 决定的时间段里忽略源数据，然后发出源 Observable 中最新发出的值
// auditTime

// distinct(keySelector, flushes)  flushes observable 就是在送出元素时，会把 distinct 的暂存清空，
// 所以之后的暂存就会从头来过，这样就不用担心暂存的 Set 越来愈大的问题
// distinctUntilChanged(compare) 只处理跟最后一次不相同的讯息，像是多方通话、多装置。
// 只有当当前值与之前最后一个值不同时才将其发出
// distinctUntilKeyChanged(key, compare)

// retryWhen(notifier) 基于自定义的标准来重试

// ignoreElements 忽略所有通知，除了 complete 和 error
// sample 当提供的 observable 发出时从源 observable 中取样
// single 发出通过表达式的单一项。
// sequenceEqual(compareTo, comparator)

// 合并流
// mergeMap = flatMap 第三个参数限制订阅数量
// concatMap 用在可以确定内部的 observable 结束时间比
// 外部 observable 发送时间来快的情境，并且不希望有任何并行处理行为，
// 适合少数要一次一次完成到底的的 UI 动画或特别的 HTTP request 行为。
// switchMap 用在只要最后一次行为的结果，适合绝大多数的使用情境。
// mergeMap 用在并行处理多个 observable，适合需要并行处理的行为，
// 像是多个 I/O 的并行处理。

// 拆分流
// window(windowBoundaries) 每当 windowBoundaries 发出项，有缓存。
// 将源 observable 的值，分支成多个嵌套的 observable
// windowCount(windowSize, startWindowEvery) 每发出 windowSize 个值就开启。
// windowTime(windowTimeSpan, windowCreationInterval) 每个指定持续时间都会开启新窗口。
// windowToggle(openings, closingSelector) 以 openings 发出项为起始，以 closingSelector 发出为结束
// windowWhen(closingSelector) 使用关闭函数来决定何时开启新的窗口
// groupBy(keySelector)  将源 Observable 发出的值进行分组

// 组播，我们会希望第二次订阅 source 不会从头开始接收元素，
// 而是从第一次订阅到当前处理的元素开始发送，我们把这种处理方式称为组播
// AsyncSubject 会在 subject 结束后才送出最后一个值
// Subject 是希望能够让 Observable 有新订阅时，可以共用前一个订阅的执行而不要从头开始
// Subject 操作符 operator
// multicast 可以用来挂载 subject 并回传一个可连结(connectable)的 observable
// multicast(new Rx.Subject()); 必须真的等到 执行 connect() 后才会真的用 subject 订阅 source，并开始送出元素

// refCount 建立一个只要有订阅就会自动 connect 的 observable
// publish  ==  multicast(new Rx.Subject())
// publishReplay(1) == multicast(new Rx.ReplaySubject(1))
// publishBehavior(0) == multicast(new Rx.BehaviorSubject(0))
// publishLast() == multicast(new Rx.AsyncSubject(1))

// publish + refCount == share

// dematerialize 将 notification 对象转换成 notification 值。
// materialize 表示源 Observable 中的所有通知，
// 每个通知都会在 Notification 对象中标记为 它们原始的通知类型，
// 并会作为输出 Observable 的 next 通知。该操作符对于生成源 Observable 的元数据很有用，并作为 next 发送使用掉。
// timeout 在指定时间间隔内不发出值就报错
// timeoutWith
// timestamp
// bindCallback
// bindNodeCallback

// webSocket(urlConfigOrSource) 包装浏览器提供的兼容w3c的WebSocket对象

// lift 创建一个新的 Observable，以它作为源，并传递操作符的定义作为新的 observable 操作符。

// subscribeOn 使用指定的 IScheduler 异步地订阅此 Observable 的观察者。

// https://juejin.im/post/59c9c01ff265da06611f85ea
console.clear()
// 預設空的 observer
const emptyObserver = {
    next: () => {},
    error: (err) => { throw err; },
    complete: () => {}
}

class Observer {
    constructor(destinationOrNext, error, complete) {
        switch (arguments.length) {
            case 0:
                // 空的 observer
                this.destination = this.safeObserver(emptyObserver);
                break;
            case 1:
                if (!destinationOrNext) {
                    // 空的 observer
                    this.destination = this.safeObserver(emptyObserver);
                    break;
                }
                // 多一個判斷，是否傳入的 destinationOrNext 原本就是 Observer 的實例，如果是就不用在用執行 `this.safeObserver`
                if(destinationOrNext instanceof Observer){
                    this.destination = destinationOrNext;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    // 傳入了 observer 物件
                    this.destination = this.safeObserver(destinationOrNext);
                    break;
                }
            default:
                // 如果上面都不是，代表應該是傳入了一到三個 function
                this.destination = this.safeObserver(destinationOrNext, error, complete);
                break;
        }
    }
    safeObserver(observerOrNext, error, complete) {
        let next;

        if (typeof (observerOrNext) === 'function') {
            // observerOrNext 是 next function
            next = observerOrNext;
        } else if (observerOrNext) {
            // observerOrNext 是 observer 物件
            next = observerOrNext.next || () => {};
            error = observerOrNext.error || function(err) {
                throw err
            };
            complete = observerOrNext.complete || () => {};
        }
        // 最後回傳我們預期的 observer 物件
        return {
            next: next,
            error: error,
            complete: complete
        };
    }

    next(value) {
        if (!this.isStopped && this.next) {
            // 先判斷是否停止過
            try {
                this.destination.next(value); // 傳送值
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
        }
    }

    error(err) {
        if (!this.isStopped && this.error) {
            // 先判斷是否停止過
            try {
                this.destination.error(err); // 傳送錯誤
            } catch (anotherError) {
                this.unsubscribe();
                throw anotherError;
            }
            this.unsubscribe();
        }
    }

    complete() {
        if (!this.isStopped && this.complete) {
            // 先判斷是否停止過
            try {
                this.destination.complete(); // 發送停止訊息
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
            this.unsubscribe(); // 發送停止訊息後退訂
        }
    }

    unsubscribe() {
        this.isStopped = true;
    }
}

/******     上一篇的內容      ******/

// function create(subscriber) {
//     const observable = {
//         subscribe: function(observerOrNext, error, complete) {
//             const realObserver = new Observer(observerOrNext, error, complete)
//             subscriber(realObserver);
//             return realObserver;
//         }
//     };
//     return observable;
// }



class MapObserver extends Observer {
    constructor(observer, callback) {
        // 這裡會傳入原本的 observer 跟 map 的 callback
        super(observer); // 因為有繼承所以要先執行一次父層的建構式
        this.callback = callback; // 保存 callback
        this.next = this.next.bind(this); // 確保 next 的 this
    }
    next(value) {
        try {
            this.destination.next(this.callback(value));
            // this.destination 是父層 Observer 保存的 observer 物件
            // 這裡 this.callback(value) 就是 map 的操作
        } catch (err) {
            this.destination.error(err);
            return;
        }
    }
}

class Observable {
    constructor(subscribe) {
        this._subscribe = subscribe; // 把 subscribe 存到屬性中
    }
    subscribe(observerOrNext, error, complete) {
        const observer = new Observer(observerOrNext, error, complete);
        // 先用 this.operator 判斷當前的 observable 是否具有 operator
        if(this.operator) {
            this.operator.call(observer, this.source)
        } else {
            // 如果沒有 operator 再直接把 observer 丟給 _subscribe
            this._subscribe(observer);
        }
        return observer;
    }
    map(callback) {
        const observable = new Observable(); // 建立新的 observable

        observable.source = this; // 保存當前的 observable(資料源)

        observable.operator = {
            call: (observer, source) => {
                // 執行這個 operator 的行為
                const newObserver = new MapObserver(observer, callback);
                // 建立包裹後的 observer
                // 訂閱原本的資料源，並回傳
                return source.subscribe(newObserver);
            }
        }; // 儲存當前 operator 行為，並作為是否有 operator 的依據，

        return observable; // 返回這個新的 observable
    }
}

Observable.create = function(subscribe) {
    return new Observable(subscribe);
}

Observable.fromArray = function(array) {
    if(!Array.isArray(array)) {
        throw new Error('params need to be an array');
    }
    return new Observable(function(observer) {
        try{
            array.forEach(value => observer.next(value))
            observer.complete()
        } catch(err) {
            observer.error(err)
        }
    });
}

var observable = Observable.fromArray([1,2,3,4,5])
    .map(x => x + 3)
    .map(x => x + 1)

var observer = {
    next: function(value) {
        console.log(value)
    },
    complete: function() {
        console.log('complete!')
    }
}

observable.subscribe(observer);