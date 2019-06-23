<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form ref="form" :model="form">
      <el-form-item>
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-col :span="14">
          <el-input v-model="form.code"  placeholder="验证码"></el-input>
        </el-col>
        <el-col :offset="2" :span="8">
          <el-button >获取验证码</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
        <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
      </el-form-item>
      <el-form-item >
        <el-button class="login-button" type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>s

<script>
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  background-color: paleturquoise;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-wrap {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .agree-checkbox {
      margin-right: 10px;
    }
    .agree-text {
      font-size: 16px;
      color: #999999;
    }
    .form-head {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      img {
        width: 200px;
      }
    }
    .login-button {
      width: 100%;
    }
  }
}
</style>
