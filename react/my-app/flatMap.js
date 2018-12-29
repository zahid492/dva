// https://zhuanlan.zhihu.com/p/25607438
// -10---20----30------------------>
// ---11-12----13------------------->
// ---------21-22---23------------------>
// ---------------31--32--33----------->

class SafeObserver {
    constructor(destination) {
        this.destination = destination;
    }

    next(value) {
        const destination = this.destination;
        if (destination.next && !this.isUnsubstribed) {
            destination.next(value);
        }
    }

    error(err) {
        const destination = this.destination;
        if (destination.error && !this.isUnsubstribed) {
            destination.error(err)
        }
    }

    complete() {
        const destination = this.destination;
        if (!this.isUnsubstribed) {
            if (destination.complete) {
                destination.complete()
            }
            this.unsubstribe();
        }
    }

    ubsubstribe() {
        this.Unsubstribed = true;
        if (this._unsubstribe) {
            this._unsubstribe()
        }
    }
}

class Observable {
    constructor(_substribe) {
        this._substribe = _substribe;
    }

    substribe(observe) {
        const safeObserver = new SafeObserver(observe);
        safeObserver._ubsubstribe = this._substribe(safeObserver);
        return () => safeObserver.ubsubstribe()
    }
}