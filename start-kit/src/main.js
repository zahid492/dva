// import * as Rx from 'rxjs/Rx'

import {interval} from 'rxjs/observable/interval';
import {merge} from 'rxjs/observable/merge';
import {of} from 'rxjs/observable/of';
import {delay, take, exhaustMap} from 'rxjs/operators';

let a = [1, 2, 3, 4]
let b = a.sort((a, b) => {
  return Math.random() > 0.5 ? -1 : 1;
})
console.log(b, b === a)
