<template>
  <section class="container">
    <div>
      <el-form
        :inline="true"
        @submit.prevent.native="search">
        <el-form-item>
          <el-input
            v-model="keyword"
            placeholder="keyword"/>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="search">Search</el-button>
        </el-form-item>
      </el-form>
      <div>
        <ul>
          <li
            v-for="toc in found_tocs"
            :key="toc.title">
            {{ toc.title }}
            <ul>
              <li
                v-for="line in toc.found_lines"
                :key="line">
                {{ line }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
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
      found_tocs: []
    }
  },
  methods: {
    search: function() {
      var self = this
      axios.post('/search', { query: self.keyword }).then(function(res) {
        console.log(res)
        self.found_tocs = res.data.results
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
