<template>
  <el-dialog title="扫描解锁" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
    <p>使用微信扫描下方二维码，观看完广告获取验证码</p>
    <p class="red f13">注：如果第一次扫码未弹出广告，请重新扫码进入</p>
    <div class="flex-center">
      <el-image class="qr-code"
        :src="'data:image/png;base64,'+ miniImg"
        fit="fill"
      ></el-image>
      <el-input v-model="qrCode" class="left-input"/>
      <el-button @click="asyncOk" class="right-btn" type="primary" :disabled="!qrCode">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getMiniWechatImg, judgeQrCode} from "@/api/otherPlat";
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    return {
      open: false,
      miniImg: null,
      qrCode: null
    }
  },
  methods: {
    initMiniWechatImg() {
      getMiniWechatImg({scene: 2}).then(res => {
        this.miniImg = res.data
      })
    },
    show() {
      //如果是管理员的账号进入，直接过滤
      if (this.roles.includes("admin")) {
        this.$emit("confirmOk", true)
        return
      }
      this.initMiniWechatImg()
      this.open = true
    },
    async asyncOk(){
      const res = await judgeQrCode({code: this.qrCode}).then(res=>{
        return res.data
      })
      if (res) {
        this.open = false
      } else {
        this.$message.error('验证码错误')
      }
      this.$emit("confirmOk", res)
    }
  }
}
</script>

<style lang="stylus">
.qr-code
  min-width 150px
  height 150px
  margin 20px 20px 20px 0
.left-input
  .el-input__inner
    border-radius 4px 0 0 4px !important
.right-btn
  border-radius 0 4px 4px 0 !important
</style>
