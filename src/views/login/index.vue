<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-col :span="14">
          <el-input v-model="form.code"  placeholder="验证码"></el-input>
        </el-col>
        <el-col :offset="2" :span="8">
          <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
          <el-button @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
        <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
      </el-form-item>
      <el-form-item >
        <el-button class="login-button" type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
const initCodeTimeSeconds = 10

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '15120025791',
        code: '',
        agree: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len: 11, message: '长度必须为11位', trigger: 'blur' }
          { pattern: /\d{11}/, message: '长度必须为11位', trigger: 'blur' }

        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6位', trigger: 'blur' }
        ],
        agree: [
          { pattern: /true/, message: '请同意用户协议' },
          { required: true, message: '请同意用户协议' }
        ]
      },
      // 倒计时定时器
      codeTimer: null,
      // 倒计时时间
      codeTimeSeconds: initCodeTimeSeconds
    }
  },
  methods: {
    handleLogin () {
      // const { mobile, code } = this.form
      // 使用 form 组件的 validate 方法触发校验 获取校验结果状态 valid 是一个布尔值
      this.$refs['form'].validate(valid => {
        // console.log(valid)
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录请求
        this.submitLogin()
      })
    },

    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => {
          // console.log(res.data)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$router.push({
            name: 'home'
          })
        })
        .catch((e) => {
          this.$message.error('登录失败，手机号或验证码错误')
        })
    },

    handleSendCode () {
      this.$refs['form'].validateField('mobile', errorMessage => {
        console.log('errorMessage =>', errorMessage)
        if (errorMessage.trim().length > 0) {
          return
        }
        // 验证通过，初始化显示验证码
        this.showGeetest()
      })
    },

    /**
     * 验证通过，初始化显示人机交互验证
     */
    showGeetest () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log('handleSendCode')
        const { data } = res.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, captchaObj => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
          // 验证码ready之后才能调用verify方法显示验证码
          // 弹出验证码内容框
            captchaObj.verify()
          }).onSuccess(() => {
            console.log(captchaObj.getValidate())
            const { geetest_challenge: challenge, geetest_validate: validate, geetest_seccode: seccode } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              // console.log(res.data)
              // 发送短信成功，开始倒计时
              this.codeCountDown()
            })
          })
        })
      })
    },

    /**
     * 验证码倒计时
     */
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer)
          // 倒计时的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds
          // 将存储定时器引用的变量重新赋值为 null
          this.codeTimer = null
        }
      }, 1000)
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
