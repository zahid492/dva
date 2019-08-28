import {
    injectGlobal
} from "emotion";
import normailze from "emotion-normalize";

injectGlobal `
    ${normailze};
    *{
        box-sizing:border-box;
    }
    body{
        margin:0;
        font-size: 16px;
    }
`