import {Row, Col, TimePicker} from "antd";
import React, {forwardRef, useMemo} from "react";

const _ = window._;
const moment = window.moment;

function TimerRangef(props) {
    const {className, style, onChange, value, format, disabled, ...rest} = props;

    const [startTime, setStartTime] = React.useState(value.start || moment());
    const [endTime, setEndTime] = React.useState(value.end || moment());

    const Hours = Array.from(Array(24), (v, k) => k);
    const Minutes = Array.from(Array(60), (v, k) => k);
    const Seconds = Array.from(Array(60), (v, k) => k);

    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange(Object.assign({}, {start: value.start, end: value.end}, changedValue))
        }
    };

    const disableStartHours = () => {
        if (endTime) {
            let h = endTime.hour();
            return Hours.slice(h, Hours.length - 1)
        }
        return [];
    };

    const disableStartMinute = (h) => {
        if (endTime) {
            if (h < endTime.hour()) return [];
            let m = endTime.minute();
            return Minutes.slice(m, Minutes.length - 1);
        }
        return [];
    };

    const disableStartSecond = (h, m) => {
        if (endTime) {
            if (h > endTime.hour()) return [];
            if (m > endTime.minute()) return [];
            let s = endTime.second();
            return Seconds.slice(s, Seconds.length - 1);
        }
        return [];
    };

    const disableEndHours = () => {
        if (startTime) {
            let h = startTime.hour();
            return Hours.slice(0, h)
        }
        return [];
    };

    const disableEndMinute = (h) => {
        if (startTime) {
            if (h > startTime.hour()) return [];
            let m = startTime.minute();
            return Minutes.slice(0, m);
        }
        return [];
    };

    const disableEndSecond = (h, m) => {
        if (startTime) {
            if (h > startTime.hour()) return [];
            if (m > startTime.minute()) return [];
            let s = startTime.second();
            return Seconds.slice(0, s);
        }
        return [];
    };

    return useMemo(()=>(
        <Row>
            <Col span={12}>
                <TimePicker
                    format={format}
                    disabled={disabled}
                    allowClear={false}
                    onChange={(time) => {
                        setStartTime(time);
                    }}
                    onOpenChange={(open) => {
                        if (!open) {
                            triggerChange({start: startTime});
                        }
                    }}
                    value={startTime}
                    disabledHours={disableStartHours}
                    disabledMinutes={disableStartMinute}
                />
            </Col>
            <Col span={12}>
                <TimePicker
                    format={format}
                    disabled={disabled}
                    allowClear={false}
                    onChange={(time) => {
                        setEndTime(time);
                    }}
                    onOpenChange={(open) => {
                        if (!open) {
                            triggerChange({end: endTime});
                        }
                    }}
                    value={endTime}
                    disabledHours={disableEndHours}
                    disabledMinutes={disableEndMinute}
                />
            </Col>

        </Row>
    ))
}

export const TimerRange = forwardRef((props, ref)=>{
   return <TimerRangef {...props} />
});


