// --- 1. Card Data & Configuration ---
const ASSETS_PATH = 'assets/tarot/pkt/';

const SPREADS = {
    TIME_FLOW: {
        id: 'time_flow',
        name: '时间之流',
        description: '探索过去、现在与未来的联系',
        cardCount: 3,
        positions: [
            { id: 'past', name: '过去', description: '过去的影响与根源' },
            { id: 'present', name: '现在', description: '当前的状况与挑战' },
            { id: 'future', name: '未来', description: '未来的趋势与可能' }
        ],
        promptBuilder: (cards) => `你是一位精通神秘学、荣格心理学与象征符号的资深塔罗占卜师。

${userQuestion ? `**求问者的核心问题是：** “${userQuestion}”` : "**求问者的初衷是：** 探索事物在时间维度上的演变与联系"}

我抽取了三张牌，构成了“时间之流”牌阵：

1.  **过去 (The Past):** ${cards[0].card.name} (${cards[0].reversed ? '逆位' : '正位'})
2.  **现在 (The Present):** ${cards[1].card.name} (${cards[1].reversed ? '逆位' : '正位'})
3.  **未来 (The Future):** ${cards[2].card.name} (${cards[2].reversed ? '逆位' : '正位'})

**解读要求：**
1. 请用中文（简体）进行解读。你的语言风格应当神秘、优雅、富有哲理且充满同理心。
2. **核心原则：** 所有的解读必须严密围绕求问者的**核心问题**展开，揭示时间流动如何影响该问题的现状与走向。

请按以下 Markdown 格式输出：

### 🔮 整体启示
（用一段充满意境的引言，总结这三张牌如何共同响应求问者的问题，揭示其核心能量场，100字左右）

---

### 🃏 牌阵深度解析

#### 1. 过去之因：${cards[0].card.name} ${cards[0].reversed ? '(逆)' : '(正)'}
*   **牌面意象**：（简述牌面视觉元素及其象征意义）
*   **针对问题的含义**：（解读这张牌在“过去”位置如何埋下了问题的种子，或提供了怎样的背景）

#### 2. 当下之境：${cards[1].card.name} ${cards[1].reversed ? '(逆)' : '(正)'}
*   **牌面意象**：（简述牌面视觉元素及其象征意义）
*   **针对问题的含义**：（揭示当前问题所处的真实状态、核心挑战或潜藏的机遇）

#### 3. 未来之果：${cards[2].card.name} ${cards[2].reversed ? '(逆)' : '(正)'}
*   **牌面意象**：（简述牌面视觉元素及其象征意义）
*   **针对问题的走向**：（预测在当前能量下，该问题在未来的可能演变趋势）

---

### 💡 命运指引
（综合三张牌，为求问者提供针对其问题的具体、切实且富有启发性的建议。）

> （最后附上一句简短而有力的祝福或箴言）`
    }
};

const QUESTION_DATA = {
    career: {
        name: "事业与财富",
        questions: ["我的事业前景如何？", "我应该换工作吗？", "如何提升我的财务状况？", "我的创业想法可行吗？"]
    },
    love: {
        name: "感情与关系",
        questions: ["我的感情关系会如何发展？", "如何改善当前的亲密关系？", "我是否应该开始一段新的感情？", "对方对我的真实看法？"]
    },
    growth: {
        name: "个人成长",
        questions: ["我当下的精神状态如何？", "我该如何实现自我突破？", "我的人生使命是什么？", "如何找回内心的平静？"]
    },
    custom: {
        name: "其他困惑",
        questions: []
    }
};

// Helper to generate full card list
const generateCards = () => {
    const cards = [];
    const majorNames = [
        "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
        "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
        "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
        "The Devil", "The Tower", "The Star", "The Moon", "The Sun", 
        "Judgement", "The World"
    ];
    majorNames.forEach((name, i) => {
        const id = `ar${String(i).padStart(2, '0')}`;
        cards.push({ id, name, type: 'major', img: `${ASSETS_PATH}${id}.jpg` });
    });
    const suits = [
        { code: 'wa', name: 'Wands' }, { code: 'cu', name: 'Cups' },
        { code: 'sw', name: 'Swords' }, { code: 'pe', name: 'Pentacles' }
    ];
    const ranks = [
        { code: 'ac', name: 'Ace' }, { code: '02', name: 'Two' }, { code: '03', name: 'Three' },
        { code: '04', name: 'Four' }, { code: '05', name: 'Five' }, { code: '06', name: 'Six' },
        { code: '07', name: 'Seven' }, { code: '08', name: 'Eight' }, { code: '09', name: 'Nine' },
        { code: '10', name: 'Ten' }, { code: 'pa', name: 'Page' }, { code: 'kn', name: 'Knight' },
        { code: 'qu', name: 'Queen' }, { code: 'ki', name: 'King' }
    ];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            const id = `${suit.code}${rank.code}`;
            cards.push({ id, name: `${rank.name} of ${suit.name}`, type: 'minor', img: `${ASSETS_PATH}${id}.jpg` });
        });
    });
    return cards;
};

const CN_NAMES = {
    // Major Arcana
    "The Fool": "愚者", "The Magician": "魔术师", "The High Priestess": "女祭司", "The Empress": "皇后", "The Emperor": "皇帝",
    "The Hierophant": "教皇", "The Lovers": "恋人", "The Chariot": "战车", "Strength": "力量", "The Hermit": "隐士",
    "Wheel of Fortune": "命运之轮", "Justice": "正义", "The Hanged Man": "倒吊人", "Death": "死神", "Temperance": "节制",
    "The Devil": "恶魔", "The Tower": "高塔", "The Star": "星星", "The Moon": "月亮", "The Sun": "太阳",
    "Judgement": "审判", "The World": "世界",
    // Minor Arcana
    "Wands": "权杖", "Cups": "圣杯", "Swords": "宝剑", "Pentacles": "金币",
    "Ace": "王牌", "Two": "2", "Three": "3", "Four": "4", "Five": "5", "Six": "6", "Seven": "7", "Eight": "8", "Nine": "9", "Ten": "10",
    "Page": "侍从", "Knight": "骑士", "Queen": "王后", "King": "国王"
};

function getCNName(enName) {
    if (CN_NAMES[enName]) return CN_NAMES[enName];
    if (enName.includes(" of ")) {
        const [rank, suit] = enName.split(" of ");
        return `${CN_NAMES[suit] || suit}${CN_NAMES[rank] || rank}`;
    }
    return enName;
}

const FULL_DECK = generateCards();
let currentDeck = [];
let pickedCards = [];
let assetsReady = false;
let assetsFailed = false;
let cameraReady = false;
let cameraError = false;

const STATE = {
    ENTRANCE: 'ENTRANCE',
    MYSTIC_DIALOG: 'MYSTIC_DIALOG',
    IDLE: 'IDLE',
    SPREAD_SELECTION: 'SPREAD_SELECTION',
    INTRO: 'INTRO',
    PICKING: 'PICKING',
    REVEALING: 'REVEALING',
    INTERPRETING: 'INTERPRETING'
};

let currentState = STATE.ENTRANCE;
let userQuestion = "";

async function toggleCamera(active) {
    if (!window._camera) return;
    try {
        if (active) {
            await window._camera.start();
            cameraReady = true;
            cameraError = false;
        } else {
            await window._camera.stop();
            cameraReady = false;
            // Hide hand cursor and charge ring when camera is off
            const cursor = document.getElementById('hand-cursor');
            if (cursor) cursor.style.display = 'none';
        }
        updateIdleStatus();
    } catch (e) {
        console.error("Camera toggle error:", e);
        cameraError = true;
        updateIdleStatus();
    }
}
let currentSpread = SPREADS.TIME_FLOW;
let spreadSelectionIndex = 0;
let currentIndex = 0;
let velocity = 0;
let lastHandX = -1;
let lastHandY = -1;
let fistHoldStart = 0;
let isFistHeld = false;
let lockedSelectIndex = null;
let chargeTargetIndex = null;
let chargeExtraScale = 1;
const SELECTION_HOLD_TIME = 1000;
let isPalmHeld = false;
let palmHoldStart = 0;
const INTERPRET_HOLD_TIME = 1500;
const FRICTION = 0.92;

function setAssetProgress(progress, label) {
    const pct = Math.max(0, Math.min(100, Math.round(progress)));
    const text = document.getElementById('asset-progress-text');
    const bar = document.getElementById('asset-progress-bar');
    if (text) text.innerText = label ? `${label} ${pct}%` : `${pct}%`;
    if (bar) bar.style.width = `${pct}%`;
}

function updateIdleStatus() {
    if (currentState === STATE.ENTRANCE) {
        if (!assetsReady) return;
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) enterBtn.style.display = 'inline-block';
        return;
    }
    const status = document.getElementById('status-text');
    const startBtn = document.getElementById('start-btn');
    const interpretBtn = document.getElementById('interpret-btn');
    
    if (currentState === STATE.IDLE) {
        if (assetsFailed) { if (status) status.innerText = "资源加载失败，点击重试"; return; }
        if (!assetsReady) { if (status) status.innerText = "资源加载中..."; return; }
        if (status) status.innerText = "准备就绪";
        if (startBtn) {
            startBtn.innerText = "开始抽牌";
            startBtn.style.display = 'inline-block';
        }
    } else {
        if (startBtn) startBtn.style.display = 'none';
    }

    if (currentState === STATE.INTERPRETING) {
        if (interpretBtn) interpretBtn.style.display = 'inline-block';
    } else {
        if (interpretBtn) interpretBtn.style.display = 'none';
    }
}

function preloadDeckAssets() {
    const loader = document.getElementById('asset-loader');
    const retryBtn = document.getElementById('asset-retry-btn');
    if (retryBtn) retryBtn.style.display = 'none';
    if (loader) loader.style.display = 'flex';
    assetsReady = false; assetsFailed = false;
    setAssetProgress(0); updateIdleStatus();
    const uniqueImages = Array.from(new Set(FULL_DECK.map(c => c.img).filter(Boolean)));
    const total = uniqueImages.length;
    let doneCount = 0, failCount = 0;
    if (total === 0) { assetsReady = true; if (loader) loader.style.display = 'none'; updateIdleStatus(); return; }
    uniqueImages.forEach((src) => {
        const img = new Image();
        img.onload = () => { doneCount++; check(); };
        img.onerror = () => { failCount++; check(); };
        img.src = src;
    });
    function check() {
        setAssetProgress(((doneCount + failCount) / total) * 100);
        if (doneCount + failCount === total) {
            if (failCount > 0) {
                assetsFailed = true; setAssetProgress(100, "加载失败");
                if (retryBtn) { retryBtn.style.display = 'inline-block'; retryBtn.onclick = preloadDeckAssets; }
            } else {
                assetsReady = true; setAssetProgress(100, "加载完成");
                if (loader) loader.style.display = 'none';
            }
            updateIdleStatus();
        }
    }
}

function initStars() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, stars = [];
    function resize() {
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = width; canvas.height = height;
        stars = Array.from({length: 200}, () => ({
            x: Math.random() * width, y: Math.random() * height,
            size: Math.random() * 2, opacity: Math.random(), speed: Math.random() * 0.5
        }));
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
            star.y -= star.speed; if (star.y < 0) star.y = height;
            if (Math.random() > 0.95) star.opacity = Math.random();
        });
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize); resize(); animate();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let isClickPrevented = false; // Flag to distinguish drag from click

function createCardElement(card, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.index = index;
    
    wrapper.addEventListener('click', (e) => {
        if (isClickPrevented || wrapper.classList.contains('picked')) return;
        if (currentState === STATE.PICKING) {
            selectCard(index);
        }
    });

    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const back = document.createElement('div');
    back.className = 'card-face card-back';
    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.style.backgroundImage = `url('${card.img}')`;
    inner.appendChild(back); inner.appendChild(front);
    wrapper.appendChild(inner);
    return wrapper;
}

const scene = document.getElementById('scene');
function renderDeck() {
    scene.innerHTML = '';
    if (currentState === STATE.PICKING || currentState === STATE.INTRO) {
        currentDeck.forEach((card, i) => scene.appendChild(createCardElement(card, i)));
        updateCardPositions();
    } else if (currentState === STATE.REVEALING || currentState === STATE.INTERPRETING) {
        pickedCards.forEach((item, i) => scene.appendChild(createCardElement(item.card, i)));
        updatePickedPositions();
    }
}

function updateCardPositions() {
    if (currentState !== STATE.PICKING && currentState !== STATE.INTRO) return;
    const cards = document.querySelectorAll('.card-wrapper');
    const width = window.innerWidth;
    const cardWidthPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-width')) || 200;
    const isMobile = width <= 480;
    const gap = Math.min(Math.max(cardWidthPx * (isMobile ? 0.85 : 1.15), width * (isMobile ? 0.12 : 0.18)), cardWidthPx * 2);
    const visibleSideCount = Math.ceil((width / 2) / (gap * 0.5)) + 3;
    cards.forEach((card, i) => {
        const dist = i - currentIndex;
        if (Math.abs(dist) > visibleSideCount || card.classList.contains('picked')) {
            card.style.display = 'none'; 
            card.style.pointerEvents = 'none';
            return;
        }
        card.style.display = 'block';
        card.style.pointerEvents = 'auto'; // Re-enable for visible cards

        const x = dist * gap, z = -Math.pow(Math.abs(dist), 1.3) * 50;
        let rotateY = Math.max(-45, Math.min(45, dist * 5));
        let scale = Math.abs(dist) < 0.5 ? (isMobile ? 1.06 : 1.2) - Math.abs(dist) * (isMobile ? 0.22 : 0.4) : 1 - Math.min(Math.abs(dist) * 0.08, 0.4);
        
        // Push the selected card and its neighbors forward in Z space for easier clicking
        const extraZ = Math.abs(dist) < 0.8 ? 100 : 0;
        card.style.zIndex = Math.abs(dist) < 0.5 ? 2000 : 1000 - Math.floor(Math.abs(dist) * 10);
        
        if (Math.round(currentIndex) === i) card.classList.add('selected'); else card.classList.remove('selected');
        if (isFistHeld && chargeTargetIndex === i) scale *= chargeExtraScale;
        card.style.transform = `translateX(${x}px) translateZ(${z + extraZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    });
}

function updatePickedPositions() {
    const cards = document.querySelectorAll('.card-wrapper');
    const width = window.innerWidth;
    const spread = width <= 480 ? Math.min(width * 0.18, 180) : Math.min(width * 0.3, 400);
    const positions = (currentSpread.cardCount === 1) ? [0] : [-spread, 0, spread];
    cards.forEach((card, i) => {
        const x = positions[i] || 0;
        if (i < pickedCards.length) {
            const delay = i * 800 + 1000;
            setTimeout(() => {
                card.classList.add('flipped');
                if (pickedCards[i].reversed) {
                    const front = card.querySelector('.card-front');
                    if (front) front.style.transform = 'rotateX(180deg)';
                }
                
                // Show card info after flipping
                const info = document.createElement('div');
                info.className = 'card-info-tag';
                const cnName = getCNName(pickedCards[i].card.name);
                const orientation = pickedCards[i].reversed ? '逆位' : '正位';
                info.innerHTML = `${cnName} <span style="color:#888;margin:0 5px;">|</span> ${orientation}`;
                card.appendChild(info);
                setTimeout(() => info.classList.add('visible'), 100);
            }, delay);
        }
        card.style.transform = `translateX(${x}px) scale(1.1)`; card.style.zIndex = 10;
        if (!card.querySelector('.label')) {
            const label = document.createElement('div');
            label.className = 'label'; label.innerText = currentSpread.positions[i].name;
            label.style.cssText = 'position:absolute;top:-40px;width:100%;text-align:center;color:#aaa;text-shadow:0 0 5px black;font-size:1rem;letter-spacing:2px;';
            card.appendChild(label);
        }
    });
}

function isFist(landmarks) {
    const wrist = landmarks[0];
    const avgDist = [8, 12, 16, 20].reduce((sum, idx) => sum + Math.hypot(landmarks[idx].x - wrist.x, landmarks[idx].y - wrist.y), 0) / 4;
    return avgDist < 0.23;
}

function isOpenPalm(landmarks) {
    const wrist = landmarks[0];
    const avgDist = [8, 12, 16, 20].reduce((sum, idx) => sum + Math.hypot(landmarks[idx].x - wrist.x, landmarks[idx].y - wrist.y), 0) / 4;
    return avgDist > 0.4;
}

function handleGesture(landmarks) {
    if (![STATE.ENTRANCE, STATE.PICKING, STATE.INTERPRETING, STATE.IDLE].includes(currentState)) return;
    const palm = landmarks[9], screenX = (1 - palm.x) * window.innerWidth, screenY = palm.y * window.innerHeight;
    const cursor = document.getElementById('hand-cursor');
    
    cursor.style.cssText = `display:block;left:${screenX}px;top:${screenY}px;`;

    if (currentState === STATE.ENTRANCE) {
        if (isOpenPalm(landmarks)) {
            const now = Date.now();
            if (!this._entrancePalmStart) this._entrancePalmStart = now;
            const progress = (now - this._entrancePalmStart) / 2000;
            if (progress >= 1) {
                this._entrancePalmStart = null;
                enterRoom();
            }
        } else {
            this._entrancePalmStart = null;
        }
        return;
    }

    if (currentState === STATE.SPREAD_SELECTION) {
        // Spread selection now uses click interaction, gestured disabled for this state
        return;
    }

    if ([STATE.IDLE, STATE.INTERPRETING].includes(currentState)) {
        const container = document.getElementById('charge-progress-container'), bar = document.getElementById('charge-progress-bar');
        if (isOpenPalm(landmarks)) {
            if (!isPalmHeld) { isPalmHeld = true; palmHoldStart = Date.now(); container.style.display = 'block'; }
            const progress = Math.min((Date.now() - palmHoldStart) / INTERPRET_HOLD_TIME, 1);
            bar.style.width = (progress * 100) + '%';
            if (progress >= 1) {
                if (currentState === STATE.IDLE) startGame();
                else { const t = localStorage.getItem('deepseek_token'); if (t) getAIInterpretation(t); }
                isPalmHeld = false; container.style.display = 'none';
            }
        } else { isPalmHeld = false; container.style.display = 'none'; }
        return;
    }

    if (currentState === STATE.PICKING) {
        const width = window.innerWidth;
        if (screenX < width * 0.33) { velocity = -0.15; }
        else if (screenX > width * 0.66) { velocity = 0.15; }
        else {
            velocity = 0;
            if (isFist(landmarks)) {
                if (!isFistHeld) { isFistHeld = true; fistHoldStart = Date.now(); lockedSelectIndex = Math.round(currentIndex); chargeTargetIndex = lockedSelectIndex; }
                const progress = Math.min((Date.now() - fistHoldStart) / SELECTION_HOLD_TIME, 1);
                chargeExtraScale = 1 + progress * 0.15;
                if (progress >= 1) { selectCard(); isFistHeld = false; }
            } else { isFistHeld = false; chargeExtraScale = 1; }
        }
    }
}

function gameLoop() {
    if (currentState === STATE.INTRO) {
        currentIndex += (Math.floor(currentDeck.length / 2) - currentIndex) * 0.05;
        if (Math.abs(Math.floor(currentDeck.length / 2) - currentIndex) < 0.1) { 
            currentIndex = Math.floor(currentDeck.length / 2); 
            currentState = STATE.PICKING; 
            document.getElementById('picked-zone').style.display = 'flex'; 
            
            // Show interaction guide
            const guide = document.getElementById('interaction-guide');
            if (guide) {
                guide.style.display = 'block';
                setTimeout(() => guide.style.opacity = '1', 100);
                // Auto hide after 8 seconds if no card picked
                setTimeout(() => {
                    if (pickedCards.length === 0) hideInteractionGuide();
                }, 8000);
            }
        }
        updateCardPositions();
    } else if (currentState === STATE.PICKING) {
        currentIndex = Math.max(0, Math.min(currentDeck.length - 1, currentIndex + velocity));
        velocity *= FRICTION;
        updateCardPositions();
    }
    requestAnimationFrame(gameLoop);
}

function hideInteractionGuide() {
    const guide = document.getElementById('interaction-guide');
    if (guide && guide.style.display !== 'none') {
        guide.style.opacity = '0';
        setTimeout(() => guide.style.display = 'none', 1000);
    }
}

function findClosestValidCard() {
    const wrappers = document.querySelectorAll('.card-wrapper:not(.picked)');
    if (wrappers.length === 0) return;
    
    let closestIdx = -1;
    let minDiff = Infinity;
    
    wrappers.forEach(el => {
        const idx = parseInt(el.dataset.index);
        const diff = Math.abs(idx - currentIndex);
        if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
        }
    });
    
    if (closestIdx !== -1) {
        currentIndex = closestIdx;
    }
}

function selectCard(targetIdx = null) {
    hideInteractionGuide();
    
    const idx = targetIdx !== null ? targetIdx : Math.round(currentIndex);
    if (idx < 0 || idx >= currentDeck.length) return;
    
    const targetWrapper = document.querySelector(`.card-wrapper[data-index="${idx}"]`);
    if (!targetWrapper || targetWrapper.classList.contains('picked')) {
        if (targetIdx === null) findClosestValidCard();
        return;
    }

    const card = currentDeck[idx];
    const isReversed = Math.random() < 0.3;
    const positionInfo = currentSpread.positions[pickedCards.length];
    
    targetWrapper.classList.add('picked');
    targetWrapper.style.opacity = '0';
    targetWrapper.style.pointerEvents = 'none';

    pickedCards.push({ card, reversed: isReversed, position: positionInfo.name });
    
    document.getElementById('status-text').innerText = `${userQuestion} (${pickedCards.length}/${currentSpread.cardCount})`;
    
    const slot = document.getElementById(`slot-${pickedCards.length - 1}`);
    if (slot) { 
        slot.classList.add('filled'); 
        const cnName = getCNName(card.name);
        const orientation = isReversed ? '逆位' : '正位';
        
        slot.innerHTML = `
            <div class="mini-card-container" style="width:100%; height:100%; perspective:800px; position:relative;">
                <div class="mini-card-inner" style="width:100%; height:100%; position:absolute; transform-style:preserve-3d; transition:transform 1s cubic-bezier(0.4, 0, 0.2, 1); transform:rotateY(0deg);">
                    <div class="mini-card-back" style="position:absolute; inset:0; backface-visibility:hidden; background:rgba(30,30,50,0.9); border:1px solid var(--accent-gold); border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--accent-gold); font-size:1.2rem; z-index:2;">✦</div>
                    <div class="mini-card-front" style="position:absolute; inset:0; backface-visibility:hidden; transform:rotateY(180deg) ${isReversed ? 'rotateZ(180deg)' : ''}; background:#fff url('${card.img}') no-repeat center; background-size:cover; border-radius:6px; border:1px solid var(--accent-gold); z-index:1;"></div>
                </div>
                <div class="mini-card-label" style="position:absolute; bottom:-35px; left:50%; transform:translateX(-50%); width:max-content; text-align:center; font-size:0.85rem; color:var(--accent-gold); opacity:0; transition:opacity 0.5s; white-space:nowrap; text-shadow:0 0 5px black;">${positionInfo.name}: ${cnName} (${orientation})</div>
            </div>
        `;

        // Trigger flip animation after a tiny delay
        setTimeout(() => {
            const inner = slot.querySelector('.mini-card-inner');
            const label = slot.querySelector('.mini-card-label');
            if (inner) inner.style.transform = 'rotateY(180deg)';
            if (label) label.style.opacity = '1';
        }, 50);
    }
    
    if (pickedCards.length === currentSpread.cardCount) setTimeout(finishPicking, 600);
}

function finishPicking() {
    currentState = STATE.REVEALING; 
    document.getElementById('status-text').innerText = "三牌已定，正在感应神谕...";
    
    // 1. Move spread to center and zoom
    const pickedZone = document.getElementById('picked-zone');
    pickedZone.classList.add('zoomed-center');
    
    // 2. Clear background scene
    scene.innerHTML = '';
    
    // 3. Show Mystic Loader
    const loader = document.getElementById('mystic-loader');
    if (loader) loader.style.display = 'flex';

    // 4. Transition to Interpretation after some ritual time
    setTimeout(async () => {
        if (loader) loader.style.display = 'none';
        
        currentState = STATE.INTERPRETING;
        
        // Stop camera when interpretation starts
        await toggleCamera(false);

        // Keep cards in center
        // pickedZone.classList.remove('zoomed-center');
        // pickedZone.classList.add('interpreting-top');
        
        // Keep game container size
        // const gameContainer = document.getElementById('game-container');
        // if (gameContainer) gameContainer.style.height = '40vh';

        // Auto-trigger AI
        const t = localStorage.getItem('deepseek_token');
        if (t) {
            getAIInterpretation(t);
        } else {
            document.getElementById('status-text').innerText = "神谕感应中断：请先配置 API Key";
            updateIdleStatus();
        }
    }, 2500);
}

function startGame() {
    if (!assetsReady) return;
    document.getElementById('start-btn').style.display = 'none';
    
    document.getElementById('status-text').innerText = userQuestion;
    currentSpread = SPREADS.TIME_FLOW;
    
    const modal = document.getElementById('spread-selection-modal');
    if (modal) modal.classList.remove('visible');
    
    // Ritual Hint step
    const hint = document.getElementById('ritual-hint');
    if (hint) {
        hint.innerText = "默念你的问题，开始抽取卡牌...";
        hint.classList.add('visible');
        setTimeout(async () => {
            hint.classList.remove('visible');
            // Start camera before intro
            await toggleCamera(true);
            // After hint fades, start the card animation
            currentDeck = shuffle([...FULL_DECK]); pickedCards = [];
            currentState = STATE.INTRO; currentIndex = currentDeck.length + 5;
            renderDeck();
        }, 2500);
    } else {
        toggleCamera(true).then(() => {
            currentDeck = shuffle([...FULL_DECK]); pickedCards = [];
            currentState = STATE.INTRO; currentIndex = currentDeck.length + 5;
            renderDeck();
        });
    }
}

function startPicking() { startGame(); }

async function getAIInterpretation(token) {
    const content = document.getElementById('interpretation-content');
    const inlineContainer = document.getElementById('interpretation-inline');
    const interpretBtn = document.getElementById('interpret-btn');
    const postActions = document.getElementById('post-interpretation-actions');
    
    // Hide the button immediately to avoid blocking content
    if (interpretBtn) interpretBtn.style.display = 'none';
    if (postActions) postActions.style.display = 'none';

    // Keep card labels and info tags visible as requested by user
    
    content.innerHTML = '正在连接命运之轮...';
    if (inlineContainer) inlineContainer.classList.add('visible');
    
    // Smooth scroll to the interpretation area, moved further down to clear the center cards
    window.scrollTo({
        top: window.innerHeight * 0.75,
        behavior: 'smooth'
    });
    
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: currentSpread.promptBuilder(pickedCards) }], stream: true })
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            for (const line of lines) {
                const jsonStr = line.replace('data: ', '');
                if (jsonStr === '[DONE]') break;
                try {
                    const json = JSON.parse(jsonStr);
                    const delta = json.choices[0].delta.content;
                    if (delta) { 
                        fullText += delta; 
                        content.innerHTML = window.marked ? window.marked.parse(fullText) : fullText; 
                    }
                } catch (e) {}
            }
        }
        // Show reset button after completion
        if (postActions) postActions.style.display = 'block';
    } catch (e) { 
        content.innerHTML = '神谕连接失败: ' + e.message; 
        if (postActions) postActions.style.display = 'block';
    }
}

function resetToNewQuestion() {
    // 1. Reset variables
    userQuestion = "";
    pickedCards = [];
    currentIndex = 0;
    velocity = 0;
    
    // 2. Clear UI elements
    document.getElementById('interpretation-content').innerHTML = "";
    document.getElementById('interpretation-inline').classList.remove('visible');
    document.getElementById('post-interpretation-actions').style.display = 'none';
    document.getElementById('status-text').innerText = "准备就绪";
    document.getElementById('picked-zone').style.opacity = '1';
    document.getElementById('picked-zone').style.display = 'none';
    document.querySelectorAll('.picked-slot').forEach(slot => {
        slot.classList.remove('filled');
        slot.innerHTML = "";
    });
    
    // 3. Reset Scene
    scene.innerHTML = "";
    
    // 4. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 5. Back to entrance/dialogue state
    currentState = STATE.ENTRANCE;
    toggleCamera(false); // Ensure camera is off when resetting
    document.getElementById('entrance-scene').classList.remove('hidden');
    document.getElementById('entrance-scene').classList.remove('open');
    
    // 6. Restart dialogue
    setTimeout(() => {
        startMysticDialog();
    }, 1000);
}

function enterRoom() {
    const scene = document.getElementById('entrance-scene');
    if (scene) {
        scene.classList.add('open');
        setTimeout(() => {
            startMysticDialog();
        }, 1200);
    }
}

async function startMysticDialog() {
    currentState = STATE.MYSTIC_DIALOG;
    const overlay = document.getElementById('mystic-dialogue-overlay');
    overlay.style.display = 'flex';
    overlay.classList.add('visible');
    
    // await typeWriter("mystic-text-bubble", "欢迎来到命运之间...我是守护此处的灵体...");
    // await new Promise(r => setTimeout(r, 1000));
    await typeWriter("mystic-text-bubble", "我能感受到你心中的困惑...告诉我，你今天想解答哪方面的疑问？");
    await new Promise(r => setTimeout(r, 1000));   
    showCategoryOptions();
}

function typeWriter(elementId, text) {
    return new Promise(resolve => {
        const el = document.getElementById(elementId);
        el.innerText = "";
        let i = 0;
        const interval = setInterval(() => {
            el.innerText += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}

function showCategoryOptions() {
    const container = document.getElementById('question-options');
    container.innerHTML = "";
    
    Object.keys(QUESTION_DATA).forEach(key => {
        if (key === 'custom') return; // Handle custom separately at bottom

        const group = document.createElement('div');
        group.className = 'question-group';
        
        const title = document.createElement('div');
        title.className = 'group-title';
        title.innerText = QUESTION_DATA[key].name;
        group.appendChild(title);
        
        const list = document.createElement('div');
        list.className = 'questions-list';
        
        QUESTION_DATA[key].questions.forEach(q => {
            const opt = document.createElement('div');
            opt.className = 'mystic-option';
            opt.innerText = q;
            opt.onclick = () => finalizeQuestion(q);
            list.appendChild(opt);
        });
        
        group.appendChild(list);
        container.appendChild(group);
    });

    // Add Custom Question Option at the end
    const customGroup = document.createElement('div');
    customGroup.className = 'question-group';
    const customList = document.createElement('div');
    customList.className = 'questions-list';
    const customOpt = document.createElement('div');
    customOpt.className = 'mystic-option';
    customOpt.style.borderStyle = 'dashed';
    customOpt.innerText = "✍️ 自定义我的困惑...";
    customOpt.onclick = () => {
        container.classList.remove('visible');
        setTimeout(async () => {
            await typeWriter("mystic-text-bubble", "原来你有独特的困惑...请告诉我你的问题。");
            document.getElementById('custom-question-container').style.display = 'block';
        }, 500);
    };
    customList.appendChild(customOpt);
    customGroup.appendChild(customList);
    container.appendChild(customGroup);

    container.classList.add('visible');
}

async function handleCategorySelect(key) {
    // This function is now mostly bypassed by the single-page layout
    // but kept for compatibility or specific custom logic if needed.
}

async function finalizeQuestion(q) {
    userQuestion = q;
    const overlay = document.getElementById('mystic-dialogue-overlay');
    overlay.classList.remove('visible');
    
    // Show transition hint for atmosphere
    const hint = document.getElementById('ritual-hint');
    if (hint) {
        setTimeout(() => {
            hint.innerText = "正在为你感应命运的走向...";
            hint.classList.add('visible');
        }, 800);
    }

    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('entrance-scene').classList.add('hidden');
        
        setTimeout(() => {
            if (hint) hint.classList.remove('visible');
            
            // Directly start game with TIME_FLOW spread
            startGame();
        }, 2000);
    }, 1000);
}

async function init() {
    initStars(); preloadDeckAssets();
    
    document.getElementById('enter-btn').onclick = enterRoom;
    document.getElementById('submit-custom-btn').onclick = () => {
        const input = document.getElementById('custom-question-input');
        if (input.value.trim()) {
            finalizeQuestion(input.value.trim());
        }
    };

    const video = document.getElementById('webcam-preview');
    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
    hands.onResults(res => { if (res.multiHandLandmarks && res.multiHandLandmarks[0]) handleGesture(res.multiHandLandmarks[0]); });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (currentState !== STATE.PICKING) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                velocity = -0.15;
                break;
            case 'ArrowRight':
                velocity = 0.15;
                break;
            case 'Enter':
            case ' ':
                selectCard();
                e.preventDefault(); // Prevent page scrolling with space
                break;
        }
    });

    const camera = new Camera(video, { onFrame: async () => await hands.send({ image: video }), width: 320, height: 240 });
    window._camera = camera; // Store camera instance globally for control
    // camera.start().then(() => { cameraReady = true; updateIdleStatus(); }).catch(() => { cameraError = true; updateIdleStatus(); });

    // Mouse interaction support for sliding AND clicking
    let isMouseDown = false;
    let dragDistance = 0;
    let lastX = 0;
    const sceneElement = document.getElementById('scene');
    
    sceneElement.addEventListener('mousedown', (e) => {
        if (currentState !== STATE.PICKING) return;
        isMouseDown = true;
        isClickPrevented = false; // Reset
        dragDistance = 0;
        lastX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isMouseDown || currentState !== STATE.PICKING) return;
        
        const deltaX = e.clientX - lastX;
        dragDistance += Math.abs(deltaX);
        lastX = e.clientX;
        
        if (dragDistance > 8) {
            isClickPrevented = true; // Mark as drag if significant movement
        }

        const moveScale = 0.005; 
        currentIndex -= deltaX * moveScale;
        velocity = -deltaX * moveScale * 0.5;
    });

    window.addEventListener('mouseup', (e) => {
        isMouseDown = false;
        // The flag will be used by the 'click' event on the card itself
        // Resetting after a tiny delay ensures the click event sees the flag
        setTimeout(() => { isClickPrevented = false; }, 50);
    });

    document.getElementById('settings-btn').onclick = () => document.getElementById('settings-modal').style.display = 'block';
    document.getElementById('close-settings-btn').onclick = () => document.getElementById('settings-modal').style.display = 'none';
    document.getElementById('save-settings-btn').onclick = () => { localStorage.setItem('deepseek_token', document.getElementById('api-token-input').value); document.getElementById('settings-modal').style.display = 'none'; };
    
    // Set default API key if not already present
    const defaultKey = "sk-88187d22e75f4b2fbb094e11963edf6f";
    if (!localStorage.getItem('deepseek_token')) {
        localStorage.setItem('deepseek_token', defaultKey);
    }
    document.getElementById('api-token-input').value = localStorage.getItem('deepseek_token') || '';
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.style.display = 'none';
        startBtn.onclick = () => { if (currentState === STATE.IDLE) startGame(); };
    }
    
    const interpretBtn = document.getElementById('interpret-btn');
    if (interpretBtn) {
        interpretBtn.onclick = () => {
            const t = localStorage.getItem('deepseek_token');
            if (t) getAIInterpretation(t);
            else alert("请先在设置中配置 API Token");
        };
    }
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.onclick = resetToNewQuestion;
    }

    gameLoop();
}

init();
