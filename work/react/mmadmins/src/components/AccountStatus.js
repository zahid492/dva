import Api from "../services/api";
import useAsync from "../hooks/useAsync";
import service from "../services/request";
import React, {useState} from "react";
import {Button} from "antd";

const _ = window._;

export default function AccountStatus(props) {
    const {record, accounts, setAccounts, url, field, on, off, setAct} = props;
    const [recordRow, setRecordRow] = useState({});

    const changePublish = () => {
        let status = (record[field] + 1) % 2;
        let path = url + record._id;

        setRecordRow(Object.assign({}, {
            ...record,
            path,
            [field]: status,
        }));
    };

    useAsync(async () => {
        if (!_.isNil(recordRow[field])) {
            const result = await service({
                url: recordRow.path,
                method: 'post',
                headers: {
                    post: {
                        "Content-Type": 'application/json',
                    }
                },
                data: recordRow[field],

            });

            if (result) {
                let index = accounts.findIndex((v) => v._id === recordRow._id);

                let nc = [].concat(accounts);

                if (index !== -1) {
                    nc[index][field] = recordRow[field];
                }

                setAccounts(nc)
                // setAct(_.random(0, 1000))
            }

            return result;
        }

    }, [recordRow[field]]);

    return (
        <>
            {record[field] === 1 ?
                <Button type="danger" size="small" onClick={() => changePublish(0)}>{off}</Button> :
                <Button type="primary" size="small" onClick={() => changePublish(1)}>{on}</Button>}
        </>
    )
}