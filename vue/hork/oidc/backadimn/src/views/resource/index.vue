<template>
    <el-row class="resource-box">
        <h1> api资源管理 </h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="resource-search">
                <el-col :span="5">
                    <el-input
                            placeholder="名称/显示名称"
                            prefix-icon="el-icon-search"
                            v-model="Key">
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" size="nomal" @click="getApiList">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="editApi(0)">创建</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="apiList"
                    style="width: 100%"
                    class="resource-table"
            >
                <el-table-column
                        type="index"
                        :index="tNo"
                        label="ID"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                >
                </el-table-column>
                <el-table-column
                        prop="displayname"
                        label="显示名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="serveraddress"
                        label="服务地址"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="scopeNames"
                        label="域"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        wodth="150">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editApi(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delApi(scope.row)">删除</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getApiList()"
                    @current-change="()=>getApiList()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>

        </el-col>
    </el-row>

</template>

<script>
    import Vue from 'vue';
    import {mapGetters} from 'vuex';
    import service from "@/service/request";
    import {tIndex} from "@/service/utils"

    import {
        Row,
        Col,
        Table,
        TableColumn,
        Input,
        InputNumber,
        Pagination,
        Dialog,
        Form,
        FormItem,
        Switch,
        Select,
        Option,
        OptionGroup,
        Button,
        ButtonGroup,
    } from 'element-ui';

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    export default {
        name: 'Resource',
        data() {
            return {
                // 表格数据
                apiList: [],

                Page: 1,
                Size: 10,
                Key: "",
                count: 0,
                formLabelWidth: '120px'
            }
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            this.getApiList();
        },
        methods: {
            tNo (index){
                return tIndex(index, this.Page, this.Size)
            },
            async getApiList() {
                try {
                    let res = await service({
                        url: 'apiresources',
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key,
                            CreateUserId : this.oidcUser.sub
                        }
                    });

                    this.count = res.count;
                    this.apiList = res.data.map((v) => {
                        v.scopeNames = v.scopes.map((s) => {
                            return s.name;
                        }).join(",");
                        return v;
                    });
                } catch (e) {
                     console.error("内部错误")
                }
            },
            // 保存api，创建修改

            editApi(flag, row) {
                console.log(typeof flag, flag)

                if (flag === 1) {
                    this.$router.push("/resedit/"+row.id)
                }else{
                    this.$router.push("/resedit");
                }
            },

            delApi(row) {
                this.$confirm("删除该规则吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'apiresources/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '成功删除任务!'
                        });
                        this.getApiList();
                    } catch (e) {
                         console.error("内部错误")
                    }

                }).catch((err) => {
                    console.log(err)
                })
            },
        }

    }
</script>

<style lang="scss">

    .resource-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;

        .resource-search {
            margin: 20px 0;
        }

        .el-pagination {
            text-align: right;
            padding: 20px 0 10px;
        }

        .el-input {
            width: 100%;
        }
    }

</style>