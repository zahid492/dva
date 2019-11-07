<template>
    <div>
        静默重新授权中...
    </div>
</template>

<script>
    // import { mapActions } from 'vuex';
    import {processSilentSignInCallback} from '@/utils/index';

    export default {
        name: 'SilentRenew',
        methods: {},
        created() {
            processSilentSignInCallback();
        }
    }
</script>
