const chatEl = document.querySelector('#chat');
const formEl = document.querySelector('#messageForm');
const senderEl = document.querySelector('#sender');
const messageEl = document.querySelector('#messageInput');
const templateEl = document.querySelector('#bubbleTemplate');
const clearBtn = document.querySelector('#clearBtn');

const API_URL = 'https://libretranslate.de/translate';

async function translateText({ q, source, target }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q,
      source,
      target,
      format: 'text'
    })
  });

  if (!response.ok) {
    throw new Error(`翻译请求失败：${response.status}`);
  }

  const data = await response.json();

  if (!data.translatedText) {
    throw new Error('翻译接口没有返回 translatedText');
  }

  return data.translatedText;
}

function appendBubble({ side, meta, original, translated }) {
  const node = templateEl.content.firstElementChild.cloneNode(true);
  node.classList.add(side === 'me' ? 'bubble--mine' : 'bubble--other');
  node.querySelector('.bubble__meta').textContent = meta;
  node.querySelector('.bubble__original').textContent = `原文：${original}`;
  node.querySelector('.bubble__translated').textContent = `译文：${translated}`;
  chatEl.appendChild(node);
  chatEl.scrollTop = chatEl.scrollHeight;
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  const content = messageEl.value.trim();

  if (!content) {
    return;
  }

  const sender = senderEl.value;

  try {
    let translated;

    if (sender === 'other') {
      translated = await translateText({
        q: content,
        source: 'auto',
        target: 'zh'
      });
      appendBubble({
        side: 'other',
        meta: '对方消息（自动识别语言 → 中文）',
        original: content,
        translated
      });
    } else {
      translated = await translateText({
        q: content,
        source: 'zh',
        target: 'ko'
      });
      appendBubble({
        side: 'me',
        meta: '我发送（中文 → 韩语）',
        original: content,
        translated
      });
    }

    formEl.reset();
    senderEl.value = sender;
    messageEl.focus();
  } catch (error) {
    appendBubble({
      side: sender === 'me' ? 'me' : 'other',
      meta: '翻译失败',
      original: content,
      translated: error instanceof Error ? error.message : '未知错误'
    });
  }
});

clearBtn.addEventListener('click', () => {
  chatEl.innerHTML = '';
  messageEl.focus();
});
