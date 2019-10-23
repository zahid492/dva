
 const maintainAction = {
    data(){
        return {
            activeNames: [],
            activeTitle:"全部折叠",
            iconFlag:true,
        }
    },
    methods:{

        // 折叠
        handleListCollapse() {
            if(this.activeNames.length>0){
                this.activeNames = [];
                this.activeTitle="全部展开";
                this.iconFlag = false;
            }else{
                this.activeNames=_.map(this.maintainsList,(v, i)=>i);
                this.activeTitle="全部折叠";
                this.iconFlag = true;
            }
        },

    }

};

 export default maintainAction;