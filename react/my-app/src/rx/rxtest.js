import {
    Observable,
    Subject,

    interval,
    from,
    fromEventPattern,
    of,

    fromEvent,
    forkJoin,
    defer,
    timer,
    merge,
    empty,
    throwError,
} from 'rxjs';
import {
    map,
    mapTo,
    multicast,
    publish,
    filter,
    tap,
    take,
    switchMap,
    switchMapTo,
    startWith,
    scan,
    takeWhile,
    concat,
    concatAll,
    concatMap,
    mergeMap,
    mergeAll,
    delay,
    takeUntil,
    observeOn,
    share,
    publishLast,
    publishBehavior,
    publishReplay,
    takeLast,
    withLatestFrom,
    bufferCount,
    bufferTime,
    bufferToggle,
    debounce,
    debounceTime,
    throttle,
    throttleTime,
    zip,
    distinct,
    distinctUntilChanged,
    retry,
    catchError,
    window,
    windowCount,
    windowTime,
    windowToggle,
    combineAll,
    sample,
    exhaustMap
} from 'rxjs/operators';

import {ajax} from 'rxjs/ajax';
import {asap} from 'rxjs/scheduler/asap';

import {create} from "rxjs-spy";
import {tag} from 'rxjs-spy/operators';

const spy = create();
const $ = window.jQuery;

export default class rxtest {
    test() {

        function observer(name) {
            return {
                next: (value) => console.log(`Next ${name}: ${JSON.stringify(value)}`),
                error: (err) => console.error(`Error ${name}: ${err}`),
                complete: () => console.log(`Complete ${name}`)
            };
        }

        spy.log('users');
        var clicks = fromEvent(document, 'click');
        var result = clicks.pipe(exhaustMap((ev) => interval(1000).pipe(take(5))));
        result.subscribe(x => console.log(x));
    }
}

