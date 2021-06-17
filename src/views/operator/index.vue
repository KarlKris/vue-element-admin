<template>
  <el-table
    :data="operators.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      :label="$t('operator.id')"
      prop="id">
    </el-table-column>
    <el-table-column
      :label="$t('operator.name')"
      prop="name">
    </el-table-column>
    <el-table-column
      :label="$t('operator.loginKey')"
      prop="loginKey">
    </el-table-column>
    <el-table-column
      :label="$t('operator.chargeKey')"
      prop="chargeKey">
    </el-table-column>
    <el-table-column
      :label="$t('operator.whiteIps')"
      prop="whiteIps">
    </el-table-column>
    <el-table-column
      :label="$t('operator.whiteAccounts')"
      prop="whiteAccounts">
    </el-table-column>
    <el-table-column
      :label="$t('operator.createTime')"
      prop="createTime">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          :placeholder="$t('please.keyWord')"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">{{ $t('edit') }}</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">{{ $t('delete') }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Operator',
    data() {
      return {
          search: ''
      }
    },
    computed: {
    ...mapGetters(['operators'])
    },
    methods: {  
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
}
</script>


