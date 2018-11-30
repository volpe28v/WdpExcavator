<template>
  <el-container>
    <el-main>
      <el-form
        :inline="true"
        @submit.native.prevent="search">
        <el-form-item label="Keyword">
          <el-input
            v-model="keyword"
            :disabled="loading"
            placeholder="keyword"
          />
        </el-form-item>
        <el-form-item label="Target recent">
          <el-select
            v-model="book_number"
            :disabled="loading"
            placeholder="Select">
            <el-option
              v-for="number in book_numbers"
              :key="number"
              :value="number"/>
          </el-select>
          <label class="el-form-item__label">books</label>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="loading"
            type="primary"
            icon="el-icon-search"
            native-type="submit"
          >Search</el-button>
        </el-form-item>
        <el-form-item>
          <el-tag
            v-if="found_tocs.length > 0"
            type="success">
            found
          <span v-text="found_tocs.length"/> books</el-tag>
          <el-tag
            v-if="found_tocs.length == 0"
            type="info">
          <span v-text="found_tocs.length"/> books</el-tag>
        </el-form-item>
      </el-form>

      <el-tree
        v-loading="loading"
        :data="found_tocs"
        :empty-text="empty_text"
        :props="defaultProps"
        :render-content="renderContent"
        :expand-on-click-node="false"
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
      if (data.found_lines) {
        var url = data.url + '#toc'
        return (
          <span class="custom-tree-node">
            <span class="el-tree-node__label" style="color: #409EFF">
              <a class="title-link" href={url} target="_blank">
                {node.label}
              </a>
            </span>
          </span>
        )
      } else {
        var keyword_reg = new RegExp('(' + self.searched_keyword + ')', 'gi')
        const highlight_title = node.label.replace(
          keyword_reg,
          '<span style="color: #F56C6C">$1</span>'
        )
        return (
          <span
            class="el-tree-node__label"
            domPropsInnerHTML={highlight_title}
          />
        )
      }
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.title-link {
  color: rgb(64, 158, 255);
  text-decoration: none;
}
</style>
