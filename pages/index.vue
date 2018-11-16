<template>
  <el-container>
    <el-header>
      <el-form
        :inline="true"
        @submit.prevent.native="search">
        <el-form-item label="Keyword">
          <el-input
            v-model="keyword"
            :disabled="loading"
            placeholder="keyword"/>
        </el-form-item>
        <el-form-item label="Target books">
          <el-select
            v-model="book_number"
            :disabled="loading"
            placeholder="Select">
            <el-option
              v-for="number in book_numbers"
              :key="number"
              :value="number"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="loading"
            type="primary"
            icon="el-icon-search"
            @click="search">Search</el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <el-main>
      <el-tree
        v-loading="loading"
        :data="found_tocs"
        :empty-text="empty_text"
        :props="defaultProps"
        :render-content="renderContent"
        default-expand-all
      />
    </el-main>
  </el-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios'

export default {
  components: {
    Logo
  },
  data: function() {
    return {
      keyword: '',
      searched_keyword: '',
      found_tocs: [],
      book_numbers: [20, 40, 60, 80, 100],
      book_number: 20,
      loading: false,
      defaultProps: {
        children: 'found_lines',
        label: 'title'
      },
      empty_text: 'WEB+DB Press Search'
    }
  },
  methods: {
    search() {
      var self = this
      self.found_tocs = []
      self.loading = true
      self.searched_keyword = self.keyword
      axios
        .post('/search', {
          query: self.searched_keyword,
          number: self.book_number
        })
        .then(function(res) {
          console.log(res)
          self.found_tocs = res.data.results
          self.loading = false
        })
    },
    renderContent(h, { node, data, store }) {
      var self = this
      var keyword_reg = new RegExp('(' + self.searched_keyword + ')', 'gi')
      const highlight_title = node.label.replace(
        keyword_reg,
        '<span style="color: red">$1</span>'
      )
      return (
        <span class="el-tree-node__label" domPropsInnerHTML={highlight_title} />
      )
    }
  }
}
</script>

<style>
.el-header {
  padding-top: 10px;
}

.loading {
  padding-left: 50px;
}
</style>
