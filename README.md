# 中韩翻译气泡聊天示例

一个纯前端页面：
- 对方发来的消息（韩语或其他语言）自动翻译成中文。
- 我发送的中文自动翻译成韩语。
- 以气泡聊天形式展示“原文 + 译文”。

## 运行

直接用静态服务打开：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 说明

默认使用 `https://libretranslate.de/translate` 作为翻译接口。
如果该公共接口不可用，可在 `script.js` 中替换 `API_URL` 为你自己的翻译服务地址。
