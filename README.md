# 绝区零调频记录导出工具

中文 | [English](https://github.com/htell1347-prog/ZenlessZoneZero-Signal-Export/tree/main/docs/README_EN.md)

项目基于genshin-wish-export修改而来，功能基本一致。

一个使用 Electron 制作的小工具，需要在 Windows 64位操作系统上运行。

通过读取游戏日志或者代理模式获取访问游戏调频记录 API 所需的 authKey，然后再使用获取到的 authKey 来读取游戏祈愿记录。

工具会在当前目录下的 `userData` 文件夹里保存数据，获取到新的调频记录时，会与本地数据合并后保存。

## 其它语言

修改`src/i18n/`目录下的 json 文件就可以翻译到对应的语言。因为如果翻译结果是使用DeepSeek V4 Pro进行翻译，觉得已有的翻译有不准确或可以改进的地方，可以随时修改发 Pull Request。

## 使用说明

1. 下载工具后解压 - 下载地址: [Github](https://github.com/htell1347-prog/ZenlessZoneZero-Signal-Export/releases/latest/download/ZenlessZoneZero%20Signal%20Export.zip)

2. 打开游戏的调频历史记录

   ![调频历史记录](/docs/signal-history.png)
3. 点击工具的“加载数据”按钮

   ![加载数据](/docs/load-data.png)

   如果没出什么问题的话，你会看到正在读取数据的提示，最终效果如下图所示

   <details>
    <summary>展开图片</summary>

   ![预览](/docs/preview.png)

   </details>

如果需要导出多个账号的数据，可以点击旁边的加号按钮。

然后游戏切换的新账号，再打开调频历史记录，工具再点击“加载数据”按钮。

## Devlopment

```
# 安装模块
yarn install

# 开发模式
yarn dev

# 构建一个可以运行的程序
yarn build
```

## License

[MIT](https://htell1347-prog/ZenlessZoneZero-Signal-Export/tree/main/LICENSE)
