(function () {
    'use strict';

   var STORAGE_KEY = 'osr_conversations_v1';
    var CONFIG = (window.SITE_CONFIG && window.SITE_CONFIG.osr) || { apiEndpoint: '', model: 'gpt-4o-mini' };

   var SUGGESTIONS = [
         'What projects has Omar built?',
         "Tell me about Omar's cybersecurity experience.",
         'What certifications does Omar hold?',
         'How can I get in touch with Omar?'
       ];

   var els = {};
    var state = { conversations: [], activeId: null, sending: false };

   function uid() {
         return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
   }

   function escapeHtml(str) {
         return String(str).replace(/[&<>"']/g, function (c) {
                 return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
         });
   }

   function loadConversations() {
         try {
                 var raw = localStorage.getItem(STORAGE_KEY);
                 state.conversations = raw ? JSON.parse(raw) : [];
         } catch (e) {
                 state.conversations = [];
         }
         if (state.conversations.length) state.activeId = state.conversations[0].id;
   }

   function saveConversations() {
         try {
                 localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
         } catch (e) { /* storage unavailable */ }
   }

   function getActive() {
         return state.conversations.filter(function (c) { return c.id === state.activeId; })[0];
   }

   function createConversation() {
         var convo = { id: uid(), title: 'New chat', messages: [], updatedAt: Date.now() };
         state.conversations.unshift(convo);
         state.activeId = convo.id;
         saveConversations();
         return convo;
   }

   function closeSidebarMobile() {
         els.sidebar.classList.remove('open');
   }

   function renderHistory() {
         var list = els.history;
         list.innerHTML = '';
         if (!state.conversations.length) {
                 var empty = document.createElement('div');
                 empty.className = 'osr-history-empty';
                 empty.textContent = 'No conversations yet.';
                 list.appendChild(empty);
                 return;
         }
         state.conversations.forEach(function (c) {
                 var item = document.createElement('div');
                 item.className = 'osr-history-item' + (c.id === state.activeId ? ' active' : '');
                 item.textContent = c.title || 'New chat';
                 item.addEventListener('click', function () {
                           state.activeId = c.id;
                           renderHistory();
                           renderMessages();
                           closeSidebarMobile();
                 });
                 list.appendChild(item);
         });
   }

   function renderSuggestionsInto(container) {
         container.innerHTML = '';
         SUGGESTIONS.forEach(function (text) {
                 var chip = document.createElement('button');
                 chip.type = 'button';
                 chip.className = 'osr-suggestion-chip';
                 chip.textContent = text;
                 chip.addEventListener('click', function () {
                           els.input.value = text;
                           handleSend();
                 });
                 container.appendChild(chip);
         });
   }

   function renderMarkdown(text) {
         var html;
         if (window.marked) {
                 html = window.marked.parse ? window.marked.parse(text, { breaks: true }) : window.marked(text, { breaks: true });
         } else {
                 html = '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>';
         }
         if (window.DOMPurify) {
                 html = window.DOMPurify.sanitize(html);
         }
         return html;
   }

   function attachCodeCopyButtons(container) {
         var blocks = container.querySelectorAll('pre code');
         blocks.forEach(function (codeEl) {
                 var pre = codeEl.parentElement;
                 if (pre.getAttribute('data-osr-enhanced')) return;
                 pre.setAttribute('data-osr-enhanced', 'true');
                 var langMatch = /language-(\w+)/.exec(codeEl.className || '');
                 var lang = langMatch ? langMatch[1] : 'code';
                 var header = document.createElement('div');
                 header.className = 'osr-code-header';
                 var label = document.createElement('span');
                 label.textContent = lang;
                 var btn = document.createElement('button');
                 btn.type = 'button';
                 btn.className = 'osr-copy-btn';
                 btn.textContent = 'Copy';
                 btn.addEventListener('click', function () {
                           var text = codeEl.textContent;
                           if (navigator.clipboard && navigator.clipboard.writeText) {
                                       navigator.clipboard.writeText(text).then(function () {
                                                     btn.textContent = 'Copied';
                                                     btn.classList.add('copied');
                                                     setTimeout(function () {
                                                                     btn.textContent = 'Copy';
                                                                     btn.classList.remove('copied');
                                                     }, 1500);
                                       });
                           }
                 });
                 header.appendChild(label);
                 header.appendChild(btn);
                 pre.insertBefore(header, codeEl);
         });
   }

   function scrollToBottom() {
         els.messages.scrollTop = els.messages.scrollHeight;
   }

   function buildMessageEl(role, content, isMarkdown) {
         var wrap = document.createElement('div');
         wrap.className = 'osr-msg ' + role;
         var avatar = document.createElement('div');
         avatar.className = 'osr-msg-avatar';
         avatar.textContent = role === 'user' ? 'You' : 'OSR';
         var bubble = document.createElement('div');
         bubble.className = 'osr-msg-bubble';
         if (isMarkdown) {
                 bubble.innerHTML = renderMarkdown(content);
                 attachCodeCopyButtons(bubble);
         } else {
                 bubble.innerHTML = escapeHtml(content).replace(/\n/g, '<br>');
         }
         wrap.appendChild(avatar);
         wrap.appendChild(bubble);
         return wrap;
   }

   function buildTypingEl() {
         var wrap = document.createElement('div');
         wrap.className = 'osr-msg assistant';
         var avatar = document.createElement('div');
         avatar.className = 'osr-msg-avatar';
         avatar.textContent = 'OSR';
         var bubble = document.createElement('div');
         bubble.className = 'osr-msg-bubble';
         bubble.innerHTML = '<div class="osr-typing"><span></span><span></span><span></span></div>';
         wrap.appendChild(avatar);
         wrap.appendChild(bubble);
         return wrap;
   }

   function renderMessages() {
         var convo = getActive();
         els.messages.innerHTML = '';
         if (!convo || !convo.messages.length) {
                 var emptyWrap = document.createElement('div');
                 emptyWrap.className = 'osr-empty';
                 var icon = document.createElement('div');
                 icon.className = 'osr-empty-icon';
                 icon.textContent = 'OSR';
                 var heading = document.createElement('h3');
                 heading.textContent = 'How can I help you today?';
                 var sugg = document.createElement('div');
                 sugg.className = 'osr-suggestions';
                 renderSuggestionsInto(sugg);
                 emptyWrap.appendChild(icon);
                 emptyWrap.appendChild(heading);
                 emptyWrap.appendChild(sugg);
                 els.messages.appendChild(emptyWrap);
                 return;
         }
         convo.messages.forEach(function (m) {
                 els.messages.appendChild(buildMessageEl(m.role, m.content, m.role === 'assistant'));
         });
         scrollToBottom();
   }

   function setBubbleNotice(typingEl, text) {
         var bubble = typingEl.querySelector('.osr-msg-bubble');
         bubble.innerHTML = '';
         var notice = document.createElement('div');
         notice.className = 'osr-notice';
         notice.textContent = text;
         bubble.appendChild(notice);
   }

   function streamAssistantReply(convo, typingEl) {
         var endpoint = CONFIG.apiEndpoint;
         if (!endpoint) {
                 setBubbleNotice(typingEl, "OSR isn't connected to an AI backend yet. Once the API endpoint is configured in js/data/config.js (see api/chat.js for setup), I'll be able to answer here.");
                 return Promise.resolve();
         }
         return fetch(endpoint, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ messages: convo.messages, model: CONFIG.model })
         }).then(function (res) {
                 if (!res.ok || !res.body) throw new Error('bad-response');
                 var reader = res.body.getReader();
                 var decoder = new TextDecoder();
                 var acc = '';
                 var bubble = typingEl.querySelector('.osr-msg-bubble');
                 bubble.innerHTML = '';
                 function pump() {
                           return reader.read().then(function (result) {
                                       if (result.done) {
                                                     convo.messages.push({ role: 'assistant', content: acc });
                                                     convo.updatedAt = Date.now();
                                                     saveConversations();
                                                     bubble.innerHTML = renderMarkdown(acc);
                                                     attachCodeCopyButtons(bubble);
                                                     scrollToBottom();
                                                     return;
                                       }
                                       acc += decoder.decode(result.value, { stream: true });
                                       bubble.textContent = acc;
                                       scrollToBottom();
                                       return pump();
                           });
                 }
                 return pump();
         }).catch(function () {
                 setBubbleNotice(typingEl, "OSR couldn't reach the AI backend just now. Please make sure the API endpoint is deployed and reachable, then try again.");
         });
   }

   function autoResize() {
         els.input.style.height = 'auto';
         els.input.style.height = Math.min(els.input.scrollHeight, 160) + 'px';
   }

   function handleSend(e) {
         if (e && e.preventDefault) e.preventDefault();
         var text = els.input.value.trim();
         if (!text || state.sending) return;
         var convo = getActive() || createConversation();
         convo.messages.push({ role: 'user', content: text });
         if (convo.title === 'New chat') convo.title = text.slice(0, 40);
         convo.updatedAt = Date.now();
         saveConversations();
         els.input.value = '';
         autoResize();
         renderHistory();
         if (els.messages.querySelector('.osr-empty')) els.messages.innerHTML = '';
         els.messages.appendChild(buildMessageEl('user', text, false));
         scrollToBottom();
         var typingEl = buildTypingEl();
         els.messages.appendChild(typingEl);
         scrollToBottom();
         state.sending = true;
         els.send.disabled = true;
         streamAssistantReply(convo, typingEl).then(function () {
                 state.sending = false;
                 els.send.disabled = false;
                 renderHistory();
         });
   }

   function init() {
         els.widget = document.getElementById('osrWidget');
         if (!els.widget) return;
         els.sidebar = document.getElementById('osrSidebar');
         els.newChat = document.getElementById('osrNewChat');
         els.history = document.getElementById('osrHistory');
         els.historyToggle = document.getElementById('osrHistoryToggle');
         els.messages = document.getElementById('osrMessages');
         els.form = document.getElementById('osrForm');
         els.input = document.getElementById('osrInput');
         els.send = document.getElementById('osrSend');

      loadConversations();
         renderHistory();
         renderMessages();

      els.newChat.addEventListener('click', function () {
              createConversation();
              renderHistory();
              renderMessages();
              closeSidebarMobile();
              els.input.focus();
      });

      els.historyToggle.addEventListener('click', function () {
              els.sidebar.classList.toggle('open');
      });

      els.form.addEventListener('submit', handleSend);

      els.input.addEventListener('input', autoResize);
         els.input.addEventListener('keydown', function (e) {
                 if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSend();
                 }
         });

      document.addEventListener('click', function (e) {
              if (!els.sidebar.classList.contains('open')) return;
              if (els.sidebar.contains(e.target) || els.historyToggle.contains(e.target)) return;
              closeSidebarMobile();
      });
   }

   if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', init);
   } else {
         init();
   }
})();
