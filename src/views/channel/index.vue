<template>
  <div>
    <div>
      <el-table
        :data="channels.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('channel.id')"
          prop="id"
        />
        <el-table-column
          :label="$t('channel.name')"
          prop="name"
        />
        <el-table-column
          :label="$t('channel.loginKey')"
          prop="loginKey"
        />
        <el-table-column
          :label="$t('channel.chargeKey')"
          prop="chargeKey"
        />
        <el-table-column
          :label="$t('channel.whiteIps')"
          prop="whiteIps"
          :formatter="handleWhiteIps"
        />
        <el-table-column
          :label="$t('channel.whiteAccounts')"
          prop="whiteAccounts"
          :formatter="handlerWhiteAccounts"
        />
        <el-table-column
          :label="$t('channel.createTime')"
          prop="createTime"
          :formatter="transfromToDate"
        />
        <el-table-column
          align="right"
        >
          // eslint-disable-next-line vue/no-unused-vars
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              :placeholder="$t('please.keyWord')"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >{{ $t("edit") }}</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >{{ $t("delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog :title="$t('channel.edit')" :visible.sync="editDialogFormVisible" label-position="left">
        <el-form ref="editForm" status-icon :model="editForm" size="mini" :rules="rules">
          <el-form-item :label="$t('channel.id')" :label-width="formLabelWidth" prop="id">
            <el-input v-model.number="editForm.id" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item :label="$t('channel.name')" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.loginKey')" :label-width="formLabelWidth" prop="loginKey">
            <el-input v-model="editForm.loginKey" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.chargeKey')" :label-width="formLabelWidth" prop="chargeKey">
            <el-input v-model="editForm.chargeKey" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.whiteIps')" :label-width="formLabelWidth">
            <el-input v-model="editForm.whiteIps" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.whiteAccounts')" :label-width="formLabelWidth">
            <el-input v-model="editForm.whiteAccounts" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">{{ $t("cancel") }}</el-button>
          <el-button type="primary" @click="handleEditChannel">{{ $t("confirm") }}</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <!-- Form -->
      <el-button type="primary" @click="addDialogFormVisible = true">{{ $t('channel.add') }}</el-button>

      <el-dialog :title="$t('channel.add')" :visible.sync="addDialogFormVisible" label-position="left">
        <el-form ref="addForm" status-icon :model="addForm" size="mini" :rules="rules">
          <el-form-item :label="$t('channel.id')" :label-width="formLabelWidth" prop="id">
            <el-input v-model.number="addForm.id" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.name')" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.loginKey')" :label-width="formLabelWidth" prop="loginKey">
            <el-input v-model="addForm.loginKey" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.chargeKey')" :label-width="formLabelWidth" prop="chargeKey">
            <el-input v-model="addForm.chargeKey" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.whiteIps')" :label-width="formLabelWidth">
            <el-input v-model="addForm.whiteIps" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('channel.whiteAccounts')" :label-width="formLabelWidth">
            <el-input v-model="addForm.whiteAccounts" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">{{ $t("cancel") }}</el-button>
          <el-button type="primary" @click="handleAddChannel">{{ $t("confirm") }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dateFormat } from '@/utils/time'

export default {
  name: 'Channel',
  data() {
    return {
      search: '',
      addDialogFormVisible: false,
      addForm: {
        name: '',
        id: '',
        loginKey: '',
        chargeKey: '',
        whiteIps: '',
        whiteAccounts: ''
      },
      editDialogFormVisible: false,
      editForm: {
        name: '',
        id: '',
        loginKey: '',
        chargeKey: '',
        whiteIps: '',
        whiteAccounts: ''
      },
      formLabelWidth: '100px',
      rules: {
        id: [
          { required: true, message: '请输入渠道标识', trigger: 'blur' },
          { type: 'number', message: '渠道标识必须为数字值' }
        ],
        name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' }
        ],
        loginKey: [
          { required: true, message: '请输入登录秘钥', trigger: 'blur' }
        ],
        chargeKey: [
          { required: true, message: '请输入充值秘钥', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['channels'])
  },
  methods: {
    handleEdit(index, row) {
      this.editForm.id = row.id
      this.editForm.name = row.name
      this.editForm.loginKey = row.loginKey
      this.editForm.chargeKey = row.chargeKey
      this.editForm.whiteIps = row.whiteIps
      this.editForm.whiteAccounts = row.whiteAccounts
      this.editDialogFormVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleAddChannel() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          var data = {
            id: this.addForm.id,
            name: this.addForm.name,
            loginKey: this.addForm.loginKey,
            chargeKey: this.addForm.chargeKey
          }
          if (this.addForm.whiteIps) {
            data.whiteIps = JSON.parse(this.addForm.whiteIps)
          }
          if (this.addForm.whiteAccounts) {
            data.whiteIps = JSON.parse(this.addForm.whiteAccounts)
          }

          this.$store.dispatch('AddChannel', data).catch(error => {
            console.log(error)
            return false
          })
          this.addDialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handleEditChannel() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          var data = {
            id: this.editForm.id,
            name: this.editForm.name,
            loginKey: this.editForm.loginKey,
            chargeKey: this.editForm.chargeKey
          }
          if (this.editForm.whiteIps) {
            data.whiteIps = JSON.parse(this.editForm.whiteIps)
          }
          if (this.editForm.whiteAccounts) {
            data.whiteIps = JSON.parse(this.editForm.whiteAccounts)
          }

          this.$store.dispatch('EditChannel', data).catch(error => {
            console.log(error)
            return false
          })
          this.editDialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handleWhiteIps(row) {
      return JSON.stringify(row.whiteIps)
    },
    handlerWhiteAccounts(row) {
      return JSON.stringify(row.whiteAccounts)
    },
    transfromToDate(row) {
      return dateFormat(row.createTime)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
  .el-form {
    width: 80%;
    margin-left: auto;
    margin-right: auto
  }
  .el-dialog {
    width: 30%;
  }
</style>
