<template>
    <div class="Test">
        <pre v-text="$attrs"/>
    </div>
</template>

<script>
    import callback from "../oidc/callback";

    export default {
        props: {},
        mounted() {
            const canBeStoppedCounter = function* () {
                let c = 0;
                let shouldBreak = false;
                while (true) {
                    shouldBreak = yield ++c;
                    console.log(shouldBreak);
                    if (shouldBreak) return;
                }
            }();

            console.log(canBeStoppedCounter.next());
// { value: 1, done: false }

            console.log(canBeStoppedCounter.next());
// undefined，第一次执行 yield 表达式的返回值
// { value: 2, done: false }

            console.log(canBeStoppedCounter.next(true));
// true，第二次执行 yield 表达式的返回值
// { value: undefined, done: true }


        },
        methods: {
            run: function (gen) {
                const g = gen();
                const next = (data) => {
                    let result = g.next();
                    if (result.done) return result.value;
                    result.value(next);
                };

                next();
            },
            gen: function* () {
                const num = yield this.person("boy");
                console.log(num)
            },
            persons: sex => {
                return new Promise((resolve, reject) => {
                    window.setTimeout(() => {
                        const data = {
                            sex,
                            name: 'keith',
                            height: 180
                        };
                        resolve(data)
                    }, 1000)
                })
            },
            thunkify: (fn) => {
                return function () {
                    const args = [...arguments];
                    return function (callback) {
                        let called = false;
                        args.push(() => {
                            if (called) return;
                            called = true;
                            callback.apply(this, arguments)
                        });

                        try {
                            fn.apply(this, args);
                        } catch (err) {
                            callback(err);
                        }
                    }
                }
            },

            sum: function (a, b, callback) {
                console.log(a, b)
                const total = a + b;
                console.log(total);
                console.log("callback:", total)
            }

        }
    };
</script>
