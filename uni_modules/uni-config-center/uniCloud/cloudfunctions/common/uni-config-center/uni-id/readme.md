{
    "passwordSecret": "passwordSecret-demo", // 数据库中password字段是加密存储的，这里的passwordSecret即为加密密码所用的密钥，注意修改为自己的密钥，使用一个较长的字符串即可
    "tokenSecret": "tokenSecret-demo", // 生成token所用的密钥，注意修改为自己的，使用一个较长的字符串即可
    "tokenExpiresIn": 7200, // 全平台token过期时间，未指定过期时间的平台会使用此值
    "tokenExpiresThreshold": 600, // 新增于uni-id 1.1.7版本，checkToken时如果token有效期小于此值则自动获取新token，请注意将新token返回给前端保存，如果不配置此参数则不开启自动获取新token功能
    "bindTokenToDevice": false, // 是否将token和设备绑定，设置为true会进行ua校验，uni-id 3.0.12前默认为true，3.0.12及以后版本默认调整为false
    "passwordErrorLimit": 6, // 密码错误最大重试次数
    "passwordErrorRetryTime": 3600, // 密码错误重试次数超限之后的冻结时间
    "autoSetInviteCode": false, // 是否在用户注册时自动设置邀请码，默认不自动设置
    "forceInviteCode": false, // 是否强制用户注册时必填邀请码，默认为false（需要注意的是目前只有短信验证码注册才可以填写邀请码）,设置为true时需要在loginBySms时指定type为register来使用注册，登录时也要传入type为login
  "removePermissionAndRoleFromToken": false, // 新增于uni-id 3.0.0版本，如果配置为false则自动缓存用户的角色、权限到token中，默认值为false。详细说明见https://uniapp.dcloud.io/uniCloud/uni-id?id=cachepermissionintoken
    "app-plus": {
        "tokenExpiresIn": 2592000,
        "oauth": {
            // App微信登录所用到的appid、appsecret需要在微信开放平台获取，注意：不是公众平台而是开放平台
            "weixin": {
                "appid": "weixin appid",
                "appsecret": "weixin appsecret"
            },
            "apple": { // 使用苹果登录时需要
                "bundleId": "your bundleId"
            }
        }
    },
    "mp-weixin": {
        "tokenExpiresIn": 259200,
        "oauth": {
            // 微信小程序登录所用的appid、appsecret需要在对应的小程序管理控制台获取
            "weixin": {
                "appid": "weixin appid",
                "appsecret": "weixin appsecret"
            }
        }
    },
    "mp-alipay": {
        "tokenExpiresIn": 259200,
        "oauth": {
            // 支付宝小程序登录用到的appid、privateKey请参考支付宝小程序的文档进行设置或者获取，https://opendocs.alipay.com/open/291/105971#LDsXr
            "alipay": {
                "appid": "alipay appid",
                "privateKey": "alipay privateKey", // 私钥
                "keyType": "PKCS8" // 私钥类型，如果私钥类型不是PKCS8，需要填写此字段，否则会出现“error:0D0680A8:asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag”错误
            }
        }
    },
    "service": {
        "sms": {
            "name": "your app name", // 应用名称，对应短信模版的name
            "codeExpiresIn": 180, // 验证码过期时间，单位为秒，注意一定要是60的整数倍
            "smsKey": "your sms key", // 短信密钥key，开通短信服务处可以看到
            "smsSecret": "your sms secret" // 短信密钥secret，开通短信服务处可以看到
        },
        "univerify": {
      "appid": "your appid", // 当前应用的appid，使用云函数URL化，此项必须配置
            "apiKey": "your apiKey",// apiKey 和 apiSecret 在开发者中心获取，开发者中心：https://dev.dcloud.net.cn/uniLogin/index?type=0，文档：https://ask.dcloud.net.cn/article/37965
            "apiSecret": "your apiSecret"
        }
    }
}


{
    "passwordSecret": "passwordSecret-xhm_storagemanager",
    "tokenSecret": "tokenSecret-xhm_storagemanager",
    "tokenExpiresIn": 7200,
    "tokenExpiresThreshold": 600,
    "bindTokenToDevice": false, 
    "passwordErrorLimit": 6,
    "passwordErrorRetryTime": 3600,
    "autoSetInviteCode": false,
    "forceInviteCode": false,
	"removePermissionAndRoleFromToken": false,
    "mp-weixin": {
        "tokenExpiresIn": 259200,
        "oauth": {
            // 微信小程序登录所用的appid、appsecret需要在对应的小程序管理控制台获取
            "weixin": {
                "appid": "wx5d219092292308d7",
                "appsecret": "b9b84c4c83aa9a3219c610d83f0d9cb1"
            }
        }
    }
}