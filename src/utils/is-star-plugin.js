// 用于检测用户是否 star 了仓库，如果没有 star，将弹窗提示用户 star 。
import { Message, MessageBox } from 'element-ui'
// 使用axios代替$.ajax
import axios from 'axios'
// 应用参数
const client_id = '9addfce3712d04898b5a3dbb223db38b8d6495d2e66d07e3c0af71a708ee3b54'
const client_secret = '1f73096ce60406eba8fb297a16245eadf2777540abdf531266b406b2479e25fe'
import store from '@/store'

// 检查成功后，多少天不再检查
const allowDisparity = 1000 * 60 * 60 * 24 * 7

/**
 * 判断当前是否已 star
 * @param owner 仓库所属空间地址(企业、组织或个人的地址path)
 * @param repo  仓库路径(path)
 * @param userId
 * @param redirectUrl
 * @param productName 开源项目名
 * @param productLink 开源链接
 */
export function isStarRepo(owner, repo, userId, redirectUrl,productName,productLink) {
  const judge = process.env.VUE_APP_JUDGE_STAR
  if (['wms','admin'].includes(store.getters.name)) {
    return true;
  }
  if (!judge || judge == 0) {
    return true;
  }
  if(judge ==2 && productName=='Wms-Ruoyi-仓库库存管理'){
    return true;
  }
  const key = userId + '_' + owner + '_' + repo
  // 判断是否近期已经判断过了
  try {
    if (typeof window !== 'undefined') {
      const isStarRepo = localStorage.getItem(key)
      if (isStarRepo) {
        // 记录 star 的时间，和当前时间的差距
        const disparity = new Date().getTime() - parseInt(isStarRepo)

        // 差距小于一月，不再检测，大于一月，再检测一下
        if (disparity < allowDisparity) {
          console.log('checked ...')
          return true;
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  return getCode(owner, repo, key, redirectUrl,productName,productLink)
}

// 去请求授权
function getCode(owner, repo, key, redirectUrl,productName,productLink) {
  // 检查url中是否有code
  const code = getParam('code')
  if (code) {
    // 有 code，进一步去请求 access_token
    getAccessToken(code, redirectUrl, owner, repo, key,productName,productLink)
  } else {
    // 不存在code，弹窗提示询问
    confirmStar(redirectUrl,productName,productLink)
    return false;
  }
}

// 弹窗提示点 star
function confirmStar(redirectUrl,productName,productLink) {

  // 弹窗提示文字
  const tipStr = `
		<div>
			<p><b>嗨，同学，来支持一下 ${productName} 吧，为项目点个 star ！</b></p>
			<div>仅需两步即可完成：<br>
				<div>1、打开 ${productName} <a href=${productLink} target="_blank" style="color: red">${productName}</a>，在右上角点个 star 。</div>
				<div>2、点击下方 [ 同意授权检测 ] 按钮，同意 ${productName}  获取 API 权限进行检测。</div>
			</div>
			<p><b>本页面将在 star 后正常开放展示</b></p>
		</div>
		`
    // 弹窗提示
    MessageBox.alert(tipStr, '温馨提示', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '同意授权检测',
      showClose: false,
      dangerouslyUseHTMLString: true,
      callback: (action) => {
        if (action === 'confirm') {
          // 用户点了确认，去 gitee 官方请求授权获取
          goAuth(redirectUrl)
        }
      }
    })
}

function toStar(redirectUrl,productName,productLink,accessToken,owner,repo,key,code) {

  // 弹窗提示文字
  const tipStr = `
		<div>
			<p><b>嗨，同学，来支持一下 ${productName} 吧，为项目点个 star ！</b></p>
			<div>点击【去Star】按钮。进入${productName} 开源项目主页，在右上角点个 star 。</div>
			<p><b>本页面将在 star 后正常开放展示</b></p>
		</div>
		`
    MessageBox.confirm(tipStr, '温馨提示', {
      // if you want to disable its autofocus
      // autofocus: false,
      closeOnClickModal: false,
      confirmButtonText: '去Star',
      cancelButtonText: '我已Star',
      showClose: false,
      dangerouslyUseHTMLString: true,
      callback: (action) => {
        if (action === 'confirm') {
          // 用户点了确认，去 gitee 官方请求授权获取
          window.open(productLink)
          toStar(redirectUrl,productName,productLink,accessToken,owner,repo,key,code)
        }
        if (action === 'cancel') {
          //检测
          judgeStar(accessToken,owner,repo,key,productName,productLink,redirectUrl,code)
        }
      }
    })
}

// 跳转到 gitee 授权界面
function goAuth(redirectUrl) {
  location.href = 'https://gitee.com/oauth/authorize' +
    '?client_id=' + client_id +
    '&redirect_uri=' + redirectUrl +
    '&response_type=code' +
    '&scope=user_info'
}

// 获取 access_token
function getAccessToken(code, redirectUrl, owner, repo, key,productName,productLink) {
  // 根据 code 获取 access_token
  axios.post('https://gitee.com/oauth/token', {
    grant_type: 'authorization_code',
    code: code,
    client_id: client_id,
    redirect_uri: redirectUrl,
    client_secret: client_secret
  })
    .then(res => {
      // 拿到 access_token
      const accessToken = res.data.access_token
      judgeStar(accessToken,owner, repo, key,productName,productLink,redirectUrl,code)
    })
    .catch(e => {
      console.log('请求错误 ', e)
      // 如果请求地址有错，可能是服务器宕机了，暂停一天检测
      if (e.response && (e.response.status === 0 || e.response.status === 502)) {
        // 一天内不再检查
        const ygTime = allowDisparity - (1000 * 60 * 60 * 24)
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, new Date().getTime() - ygTime)
        }
        // 刷新 url，去掉 code 参数
        location.href = location.href.replace('?code=' + code, '')
      }

      // 无效授权，可能是 code 无效
      const errorMsg = (e.response && e.response.data.error) || JSON.stringify(e)
      if (errorMsg === 'invalid_grant') {
        console.log('无效code', code)

        let url = location.href.replace('?code=' + code, '')
        url = url.replace('&code=' + code, '')
        location.href = url
      }
    })
}


function judgeStar(accessToken,owner, repo, key,productName,productLink,redirectUrl,code){
  // 根据 access_token 判断是否 star 了仓库
  axios.get(`https://gitee.com/api/v5/user/starred/${owner}/${repo}`, {
    params: { access_token: accessToken }
  })
    .then(res => {
      // success 回调即代表已经 star，gitee API 请求体不返回任何数据
      console.log('-> stared ...')
      // 记录本次检查时间
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, new Date().getTime())
      }
      Message.success('感谢你的支持  ❤️ ❤️ ❤️ ，我们将努力变得更加完善！')
      setTimeout(()=>{
        location.href = location.href.replace('?code=' + code, '')
      },1000)
    })
    .catch(e => {
      // console.log('ff请求错误 ', e);
      // 如下返回，代表没有 star
      if (e.response && e.response.status === 404) {
        console.log('not star ...')
        toStar(redirectUrl,productName,productLink,accessToken,owner,repo,key,code);
      }
    })
}

// 获取 url 携带的参数
function getParam(name) {
  const urls = window.location.href.split('?')
  if (urls.length < 2) {
    return null
  }
  let url = urls[1]
  let obj = {} // 声明参数对象
  let arr = url.split('&') // 以&符号分割为数组
  for (let i = 0; i < arr.length; i++) {
    let arrNew = arr[i].split('=') // 以"="分割为数组
    obj[arrNew[0]] = arrNew[1]
  }

  return obj[name]
}

