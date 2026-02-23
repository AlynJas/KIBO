// --- GAME STATE ---
let unlockedLevel = 1;
let currentLevel = 1;
let draggedBlock = null;
let typewriterInterval = null;
let fullStoryText = "";
let isTyping = false;
// Track scores & run attempts: { levelNumber: { score: X, total: Y, attempts: Z } }
let userScores = {}; 
let runAttempts = { 1: 0, 2: 0, 3: 0 }; // ระบบนับจำนวนครั้งที่กดรันโค้ด

// --- LEVEL DATA (SMART OFFICE) ---
const levelsData = {
    1: {
        title: "Level 1: Basic Output",
        shortTitle: "พื้นฐานและการแสดงผล",
        icon: "💡",
        workspaceType: "sequence",
        scenario: "> ระบบเริ่มทำงาน...\n> ยินดีต้อนรับสู่สำนักงานอัจฉริยะ (Smart Office)!\n> ภารกิจ (Welcome to the Office): ทดสอบหน้าจอแสดงผลต้อนรับพนักงาน โดยให้พิมพ์ข้อความ 'WELCOME' แบบเลื่อน หน่วงเวลา 2 วินาที และแสดงชื่อเป็นภาษาอังกฤษ",
        desc: "ลากบล็อกคำสั่งเรียงตามลำดับเพื่อทำงานแบบเป็นขั้นเป็นตอน (Sequence):\n1. พิมพ์ข้อความ 'WELCOME' แบบเลื่อน (LED Scroll)\n2. หน่วงเวลา (Delay) 2 วินาที\n3. พิมพ์และแสดงผลชื่อภาษาอังกฤษของคุณ (ห้ามซ้ำกับ WELCOME)",
        blocks: [
            { type: 'action-scroll', class: 'action-block', isComplex: true, 
                html: `<div class="flex items-center justify-center w-full">LED Scroll <span class="mx-2 font-bold text-green-100">=</span> <input type="text" class="block-input text-gray-900 bg-white px-2 py-1 rounded w-24 text-sm font-bold text-center shadow-sm outline-none placeholder-gray-400" placeholder="พิมพ์ข้อความ"></div>` },
            { type: 'delay', class: 'delay-block', isComplex: true, 
                html: `<div class="flex items-center justify-center w-full">Delay <input type="number" class="block-input text-gray-900 bg-white px-2 py-1 rounded w-16 text-sm font-bold text-center mx-2 shadow-sm outline-none" value="2"> sec</div>` },
            { type: 'action-scroll', class: 'action-block', isComplex: true, 
                html: `<div class="flex items-center justify-center w-full">LED Scroll <span class="mx-2 font-bold text-green-100">=</span> <input type="text" class="block-input text-gray-900 bg-white px-2 py-1 rounded w-24 text-sm font-bold text-center shadow-sm outline-none placeholder-gray-400" placeholder="พิมพ์ชื่อ (Eng)"></div>` } 
        ]
    },
    2: {
        title: "Level 2: Sensors & Logic",
        shortTitle: "การรับค่าและเงื่อนไข",
        icon: "🖥️",
        workspaceType: "dynamic-ifelse",
        scenario: "> ประกาศเตือนภัยฉุกเฉินระดับ 2!\n> อุณหภูมิในห้องเซิร์ฟเวอร์ (Server Room) พุ่งสูงขึ้น เสี่ยงต่อความเสียหาย\n> ภารกิจ (Server Room Meltdown): ใช้บล็อก If-Else อ่านค่าเซนเซอร์อุณหภูมิ เพื่อควบคุมพัดลมระบายอากาศผ่านพอร์ต USB",
        desc: "การใช้บล็อกคำสั่งทางตรรกะ (Logic):\n1. ลากบล็อกโครงสร้าง **IF...DO...ELSE** ไปวางเป็นฐานก่อน\n2. ลากบล็อกเซนเซอร์และอุปกรณ์ USB ไปใส่ในช่องว่าง\n\nเงื่อนไข: ถ้าอุณหภูมิ >= 25 ให้ USB ทำงาน (ON) มิฉะนั้น ให้ USB หยุดทำงาน (OFF)",
        blocks: [
            { type: 'structure-ifelse', class: 'structure-block', text: 'IF ... DO ... ELSE' },
            { type: 'sensor', class: 'sensor-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="sensor-type hidden">temp</span>Temp <select class="op-sel text-gray-900 bg-white px-1 py-0.5 rounded mx-2 font-bold shadow-sm outline-none cursor-pointer text-sm"><option value=">">&gt;</option><option value="<">&lt;</option><option value=">=">&gt;=</option><option value="<=">&lt;=</option><option value="=">=</option></select> <input type="number" class="val-input text-gray-900 bg-white px-2 py-0.5 rounded w-16 text-sm font-bold text-center shadow-sm outline-none" placeholder="°C"></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">usb</span>USB Status <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-2 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="ON">ON</option><option value="OFF">OFF</option></select></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">usb</span>USB Status <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-2 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="OFF">OFF</option><option value="ON">ON</option></select></div>` }
        ]
    },
    3: {
        title: "Level 3: Automation Challenge",
        shortTitle: "ระบบห้องประชุมอัจฉริยะ",
        icon: "⚙️",
        workspaceType: "dynamic-ifelse",
        scenario: "> เข้าสู่ระบบจัดการห้องประชุมอัจฉริยะ...\n> ห้องประชุมต้องพร้อมทำงานอัตโนมัติเมื่อมีคนอยู่ (อุณหภูมิห้องสูงขึ้นและแสงมืดลง)\n> ภารกิจ (Smart Meeting Room): เขียนโปรแกรมรวมโดยใช้ตรรกะ AND เพื่อเปิดแอร์และไฟพร้อมกัน!",
        desc: "1. ลากโครงสร้าง **IF...DO...ELSE** ไปวางในพื้นที่ทำงาน\n2. ลากบล็อกตรรกะ **[ ] AND/OR [ ]** สีม่วงไปวางใส่ในช่อง IF\n3. ประกอบเซนเซอร์และอุปกรณ์ให้ครบถ้วน\n\nเงื่อนไข: ถ้า (อุณหภูมิ > 25) AND (แสง < 40)\nให้เปิดแอร์ (USB=ON) และเปิดไฟ (LED=ON)\nมิฉะนั้น ปิดแอร์และปิดไฟ",
        blocks: [
            { type: 'structure-ifelse', class: 'structure-block', text: 'IF ... DO ... ELSE' },
            { type: 'logic-and', class: 'logic-block', text: '[ ] AND / OR [ ]' },
            { type: 'sensor', class: 'sensor-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="sensor-type hidden">temp</span>Temp <select class="op-sel text-gray-900 bg-white px-1 py-0.5 rounded mx-1 font-bold shadow-sm outline-none cursor-pointer text-sm"><option value=">">&gt;</option><option value="<">&lt;</option><option value=">=">&gt;=</option><option value="=">=</option></select> <input type="number" class="val-input text-gray-900 bg-white px-1 py-0.5 rounded w-14 text-sm font-bold text-center shadow-sm outline-none" placeholder="°C"></div>` },
            { type: 'sensor', class: 'sensor-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="sensor-type hidden">light</span>Light <select class="op-sel text-gray-900 bg-white px-1 py-0.5 rounded mx-1 font-bold shadow-sm outline-none cursor-pointer text-sm"><option value=">">&gt;</option><option value="<">&lt;</option><option value="<=">&lt;=</option><option value="=">=</option></select> <input type="number" class="val-input text-gray-900 bg-white px-1 py-0.5 rounded w-14 text-sm font-bold text-center shadow-sm outline-none" placeholder="Lux"></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">usb</span>USB Status <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-1 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="ON">ON</option><option value="OFF">OFF</option></select></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">usb</span>USB Status <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-1 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="OFF">OFF</option><option value="ON">ON</option></select></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">led</span>LED 16x8 <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-1 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="ON">ON</option><option value="OFF">OFF</option></select></div>` },
            { type: 'action', class: 'action-block', isComplex: true,
                html: `<div class="flex items-center justify-center w-full"><span class="action-type hidden">led</span>LED 16x8 <span class="mx-2 font-bold text-green-100">=</span> <select class="stat-sel text-gray-900 bg-white px-1 py-0.5 rounded font-bold shadow-sm outline-none cursor-pointer text-sm"><option value="OFF">OFF</option><option value="ON">ON</option></select></div>` }
        ]
    }
};

// --- NAVIGATION & DOM INJECTION ---
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'view-levels') renderLevelSelect();
    if (viewId !== 'view-story') clearInterval(typewriterInterval);
}

function renderLevelSelect() {
    const container = document.getElementById('levels-container');
    container.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
        const isLocked = i > unlockedLevel;
        const data = levelsData[i];
        const card = document.createElement('div');
        
        // Fetch saved score and attempt data if any
        let scoreText = "";
        let scoreColor = "";
        if (userScores[i]) {
            let pct = userScores[i].score / userScores[i].total;
            scoreColor = pct === 1 ? "text-green-600 bg-green-100" : "text-amber-600 bg-amber-100";
            let attemptStr = userScores[i].attempts ? `ทดสอบการรัน: ${userScores[i].attempts} ครั้ง` : "";
            
            scoreText = `
                <div class="mt-2 w-full px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 ${scoreColor}">
                    <span class="font-bold text-sm">คะแนน: ${userScores[i].score}/${userScores[i].total}</span>
                    <span class="text-[10px] font-medium opacity-80">${attemptStr}</span>
                </div>
            `;
        }

        if (isLocked) {
            card.className = "bg-gray-100 border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 cursor-not-allowed h-56 w-full max-w-sm md:w-72";
            card.innerHTML = `<svg class="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg><h3 class="text-xl font-bold">Level ${i}</h3><p class="text-sm mt-1">ถูกล็อก</p>`;
        } else {
            card.className = "bg-white border-2 border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-blue-700 cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1 h-56 w-full max-w-sm md:w-72";
            card.onclick = () => startStory(i);
            card.innerHTML = `<div class="w-14 h-14 mb-3 bg-blue-100 rounded-full flex items-center justify-center text-3xl shadow-inner">${data.icon}</div><h3 class="text-xl font-bold">Level ${i}</h3><p class="text-sm text-center text-gray-600 mt-1 font-medium leading-tight">${data.shortTitle}</p>${scoreText}`;
        }
        container.appendChild(card);
    }
}

function startStory(level) {
    currentLevel = level;
    runAttempts[level] = 0; // รีเซ็ตการนับจำนวนครั้งเมื่อเริ่มเล่นด่านใหม่
    
    const data = levelsData[level];
    
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-icon').innerText = data.icon;
    document.getElementById('start-mission-btn').classList.remove('opacity-100', 'pointer-events-auto');
    document.getElementById('start-mission-btn').classList.add('opacity-0', 'pointer-events-none');
    
    fullStoryText = data.scenario;
    document.getElementById('story-text').innerHTML = "";
    showView('view-story');
    
    isTyping = true;
    let i = 0;
    clearInterval(typewriterInterval);
    typewriterInterval = setInterval(() => {
        if (i < fullStoryText.length) {
            let char = fullStoryText.charAt(i);
            document.getElementById('story-text').innerHTML += (char === '\n') ? '<br>' : char;
            i++;
        } else { finishTypewriter(); }
    }, 30);
    
    preparePuzzle(level);
}

function skipTypewriter() {
    if (isTyping) {
        clearInterval(typewriterInterval);
        document.getElementById('story-text').innerHTML = fullStoryText.replace(/\n/g, '<br>');
        finishTypewriter();
    }
}
function finishTypewriter() {
    isTyping = false;
    document.getElementById('start-mission-btn').classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('start-mission-btn').classList.add('opacity-100', 'pointer-events-auto');
}

// --- DYNAMIC TEMPLATES ---
function getIfElseTemplate(level) {
    let doSlots = level === 3 ? 
        `<div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px] mb-2" id="drop-true1" data-expected="action">คำสั่งอุปกรณ์ 1</div>
            <div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px]" id="drop-true2" data-expected="action">คำสั่งอุปกรณ์ 2</div>` : 
        `<div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px]" id="drop-true1" data-expected="action">วางคำสั่งเมื่อเป็นจริง</div>`;
        
    let elseSlots = level === 3 ? 
        `<div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px] mb-2" id="drop-false1" data-expected="action">คำสั่งอุปกรณ์ 3</div>
            <div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px]" id="drop-false2" data-expected="action">คำสั่งอุปกรณ์ 4</div>` : 
        `<div class="drop-zone w-full bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[40px]" id="drop-false1" data-expected="action">วางคำสั่งเมื่อเป็นเท็จ</div>`;

    let condExpected = level === 3 ? 'logic-and' : 'sensor';
    let condText = level === 3 ? 'วางบล็อกตรรกะ [AND/OR] สีม่วง' : 'วางเซนเซอร์ (Condition)';

    return `
    <div class="bg-[#9333ea] rounded-xl p-4 shadow-lg border-2 border-purple-700 w-full animate-[fadeIn_0.3s_ease-out]" id="structure-ifelse-container">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
            <span class="font-bold text-white text-xl w-10">IF</span>
            <div class="drop-zone flex-1 bg-white/95 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center text-gray-500 text-sm p-2 min-h-[50px] w-full" id="drop-condition" data-expected="${condExpected}">${condText}</div>
        </div>
        <div class="pl-4 md:pl-8 border-l-4 border-purple-300 mb-4">
            <span class="font-bold text-white text-sm mb-2 block">DO (เมื่อเป็นจริง)</span>
            <div class="flex flex-col w-full">
                ${doSlots}
            </div>
        </div>
        <div class="flex items-center gap-2 mb-3 mt-4">
            <span class="font-bold text-white text-xl">ELSE</span>
        </div>
        <div class="pl-4 md:pl-8 border-l-4 border-purple-300">
            <span class="font-bold text-white text-sm mb-2 block">DO (เมื่อเป็นเท็จ)</span>
            <div class="flex flex-col w-full">
                ${elseSlots}
            </div>
        </div>
    </div>
    `;
}

function getAndTemplate() {
    return `
    <div class="flex-1 bg-[#a855f7] rounded-lg p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-inner border-2 border-purple-400 w-full animate-[fadeIn_0.3s_ease-out]" id="logic-and-container" data-type="logic-and">
        <div class="drop-zone flex-1 bg-white/95 border-2 border-dashed border-purple-300 rounded flex items-center justify-center text-gray-500 text-sm font-medium p-2 min-h-[46px]" id="drop-cond1" data-expected="sensor">วางเซนเซอร์ 1</div>
        <div class="flex justify-center shrink-0">
            <select class="logic-sel text-purple-900 bg-white px-3 py-1.5 rounded-lg font-bold shadow-sm outline-none cursor-pointer text-sm hover:bg-gray-50 border border-purple-300"><option value="AND">AND</option><option value="OR">OR</option></select>
        </div>
        <div class="drop-zone flex-1 bg-white/95 border-2 border-dashed border-purple-300 rounded flex items-center justify-center text-gray-500 text-sm font-medium p-2 min-h-[46px]" id="drop-cond2" data-expected="sensor">วางเซนเซอร์ 2</div>
    </div>
    `;
}

function buildWorkspaceHTML(type) {
    if (type === 'sequence') {
        return `
            <div class="bg-[#1e3a8a] rounded-xl p-5 shadow-lg border-2 border-blue-800 w-full animate-[fadeIn_0.3s_ease-out]">
                <p class="text-sm text-white mb-4 font-bold text-center bg-blue-900/40 py-2 px-4 rounded-lg border border-blue-700/50 shadow-inner">
                    ระบบจะประมวลผลคำสั่งจากบนลงล่างตามลำดับ (Sequential)
                </p>
                <div class="flex items-center gap-3 mb-4">
                    <span class="font-bold text-blue-300 text-lg w-16 text-right drop-shadow-sm">STEP 1</span>
                    <div class="drop-zone flex-1 border-2 border-dashed border-blue-400 rounded-lg bg-white/95 flex items-center justify-center text-blue-700 text-sm font-bold p-3 shadow-inner min-h-[54px]" id="drop-step1" data-expected="action-scroll" data-text="วางคำสั่งที่ 1 (แบบเลื่อน)">วางคำสั่งที่ 1 (แบบเลื่อน)</div>
                </div>
                <div class="flex items-center gap-3 mb-4">
                    <span class="font-bold text-amber-400 text-lg w-16 text-right drop-shadow-sm">WAIT</span>
                    <div class="drop-zone flex-1 border-2 border-dashed border-amber-500 rounded-lg bg-white/95 flex items-center justify-center text-amber-600 text-sm font-bold p-3 shadow-inner min-h-[54px]" id="drop-step2" data-expected="delay" data-text="วางคำสั่งหน่วงเวลา">วางคำสั่งหน่วงเวลา</div>
                </div>
                <div class="flex items-center gap-3 mb-2">
                    <span class="font-bold text-blue-300 text-lg w-16 text-right drop-shadow-sm">STEP 2</span>
                    <div class="drop-zone flex-1 border-2 border-dashed border-blue-400 rounded-lg bg-white/95 flex items-center justify-center text-blue-700 text-sm font-bold p-3 shadow-inner min-h-[54px]" id="drop-step3" data-expected="action-scroll" data-text="วางคำสั่งที่ 2 (แบบเลื่อน)">วางคำสั่งที่ 2 (แบบเลื่อน)</div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="drop-zone w-full border-4 border-dashed border-purple-300 bg-purple-50/50 rounded-xl flex flex-col items-center justify-center text-purple-500 p-8 min-h-[250px] transition-colors hover:bg-purple-100/50" id="workspace-main-drop" data-expected="structure-ifelse">
                <svg class="w-16 h-16 mb-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span class="font-bold text-lg text-center">วางโครงสร้าง IF-DO-ELSE ที่นี่</span>
            </div>
            <button onclick="preparePuzzle(currentLevel)" class="mt-4 text-sm text-gray-500 hover:text-gray-800 underline text-center w-full">เริ่มใหม่ (Reset Workspace)</button>
        `;
    }
}

function preparePuzzle(level) {
    const data = levelsData[level];
    document.getElementById('puzzle-title').innerText = data.title;
    document.getElementById('puzzle-desc').innerHTML = data.desc.replace(/\n/g, '<br>');
    
    document.getElementById('workspace-container').innerHTML = buildWorkspaceHTML(data.workspaceType);
    
    const container = document.getElementById('block-container');
    container.innerHTML = '';
    
    const blocksHTML = data.blocks.map(b => {
        const el = document.createElement('div');
        el.className = `block-item ${b.class} p-3 rounded-lg shadow-md font-medium text-center`;
        el.draggable = true;
        el.setAttribute('data-type', b.type);
        
        if (b.isComplex) {
            el.innerHTML = b.html;
            el.querySelectorAll('select, input').forEach(child => {
                child.onmousedown = (e) => e.stopPropagation();
                child.onfocus = () => el.draggable = false;
                child.onblur = () => el.draggable = true;
            });
        } else {
            el.innerText = b.text;
        }
        return el;
    });
    blocksHTML.sort(() => Math.random() - 0.5).forEach(el => container.appendChild(el));

    bindDropZones(); 
}

// --- DRAG & DROP LOGIC ---
function bindDropZones() {
    let draggedEl = null;

    document.querySelectorAll('.block-item').forEach(block => {
        block.ondragstart = function(e) {
            draggedEl = this;
            setTimeout(() => this.classList.add('opacity-50'), 0);
        };
        block.ondragend = function(e) {
            setTimeout(() => this.classList.remove('opacity-50'), 0);
            draggedEl = null;
        };
    });

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.ondragover = function(e) { e.preventDefault(); this.classList.add('drag-over'); };
        zone.ondragleave = function(e) { this.classList.remove('drag-over'); };
        zone.ondrop = function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (draggedEl) {
                const expectedType = this.getAttribute('data-expected');
                const blockType = draggedEl.getAttribute('data-type');
                
                if (expectedType === 'structure-ifelse') {
                    if (blockType !== 'structure-ifelse') {
                        showToast("ต้องวางบล็อกโครงสร้าง IF-DO-ELSE (สีม่วง) ก่อนครับ!");
                        return;
                    }
                    this.outerHTML = getIfElseTemplate(currentLevel);
                    draggedEl.remove(); 
                    bindDropZones();
                    return;
                }
                
                if (expectedType === 'logic-and' && currentLevel === 3) {
                    if (blockType !== 'logic-and') {
                        showToast("ช่องนี้ต้องใช้บล็อกตรรกะ [AND/OR] ครับ!");
                        return;
                    }
                    this.outerHTML = getAndTemplate();
                    draggedEl.remove();
                    bindDropZones();
                    return;
                }

                if (currentLevel === 1 && expectedType && !blockType.includes(expectedType) && expectedType !== blockType) {
                    showToast("ประเภทบล็อกไม่ตรงกับช่องนี้!");
                    return;
                }

                const existingBlock = this.querySelector('.block-item');
                if (existingBlock) document.getElementById('block-container').appendChild(existingBlock);
                this.innerHTML = '';
                this.classList.add('bg-white', 'border-transparent');
                
                draggedEl.style.width = '100%';
                draggedEl.style.margin = '0';
                this.appendChild(draggedEl);
            }
        };
    });

    const blockContainer = document.getElementById('block-container');
    blockContainer.ondragover = function(e) { e.preventDefault(); };
    blockContainer.ondrop = function(e) {
        e.preventDefault();
        if (draggedEl) {
            draggedEl.style.width = 'fit-content';
            draggedEl.style.margin = '0 auto';
            this.appendChild(draggedEl);
            
            document.querySelectorAll('.drop-zone').forEach(z => {
                if (z.children.length === 0 && z.getAttribute('data-text')) {
                    z.innerHTML = z.getAttribute('data-text');
                    z.classList.remove('bg-white', 'border-transparent');
                }
            });
        }
    };
}

// --- EVALUATION HELPERS FOR LEVEL 2 & 3 ---
function evalSensor(blockEl, currentTemp, currentLight) {
    if (!blockEl || !blockEl.classList.contains('block-item')) return { valid: false, error: 'missing' };
    if (blockEl.getAttribute('data-type') !== 'sensor') return { valid: false, error: 'type' };

    let sType = blockEl.querySelector('.sensor-type').innerText.trim().toLowerCase();
    let op = blockEl.querySelector('.op-sel').value;
    let valStr = blockEl.querySelector('.val-input').value.trim();
    let val = parseFloat(valStr);
    if (isNaN(val)) val = 0;

    let currentVal = (sType === 'temp') ? currentTemp : currentLight;
    let result = false;
    if (op === '>') result = currentVal > val;
    else if (op === '<') result = currentVal < val;
    else if (op === '>=') result = currentVal >= val;
    else if (op === '<=') result = currentVal <= val;
    else if (op === '=') result = currentVal == val;

    return {
        valid: true,
        type: sType,
        op: op,
        inputVal: valStr,
        val: val,
        result: result,
        text: `${sType==="temp"?"Temp":"Light"} ${op} ${valStr===""?"?":val}`
    };
}

function evalAction(blockEl) {
    if (!blockEl || !blockEl.classList.contains('block-item')) return { valid: false };
    if (blockEl.getAttribute('data-type') !== 'action') return { valid: false };
    
    let aType = blockEl.querySelector('.action-type').innerText.trim().toLowerCase();
    let stat = blockEl.querySelector('.stat-sel').value;
    return { valid: true, type: aType, stat: stat, text: `${aType==="usb"?"USB":"LED"} = ${stat}` };
}

// Checklist Renderer & Attempt Tracker
function renderChecklist(checksList) {
    let listHtml = '';
    let passedCount = 0;
    checksList.forEach(c => {
        if(c.passed) passedCount++;
        let icon = c.passed ? '<span class="text-green-600 text-lg">✅</span>' : '<span class="text-red-500 text-lg">❌</span>';
        let textClass = c.passed ? 'text-gray-700' : 'text-red-600 font-bold';
        listHtml += `<div class="flex items-start gap-2">${icon} <span class="${textClass} leading-tight">${c.text}</span></div>`;
    });
    
    document.getElementById('sim-checklist-items').innerHTML = listHtml;
    
    // Save score into userScores
    userScores[currentLevel] = { score: passedCount, total: checksList.length, attempts: runAttempts[currentLevel] };

    let scoreDiv = document.getElementById('sim-score-display');
    let isPerfect = passedCount === checksList.length;
    let attemptFeedback = "";
    
    // Display Logic for Scores & Attempts
    if (isPerfect) {
        scoreDiv.className = "mt-4 text-center font-bold py-3 rounded-lg bg-green-100 border-2 border-green-400 text-green-700";
        if (runAttempts[currentLevel] === 1) {
            attemptFeedback = `<div class="text-sm mt-1 font-medium text-green-600">🎉 ยอดเยี่ยมมาก! คุณผ่านภารกิจใน <b>การรันโค้ดครั้งแรก</b></div>`;
        } else {
            attemptFeedback = `<div class="text-sm mt-1 font-medium text-green-600">ผ่านภารกิจในความพยายาม <b>รันโค้ดครั้งที่ ${runAttempts[currentLevel]}</b></div>`;
        }
    } else {
        scoreDiv.className = "mt-4 text-center font-bold py-3 rounded-lg bg-red-50 border-2 border-red-300 text-red-600";
        attemptFeedback = `<div class="text-sm mt-1 font-medium text-red-500">จำนวนการรันโค้ด: <b>ครั้งที่ ${runAttempts[currentLevel]}</b> - ลองแก้ไขโค้ดดูใหม่นะ</div>`;
    }
    
    scoreDiv.innerHTML = `<div class="text-xl">ผลประเมิน: ได้ ${passedCount} จาก ${checksList.length} เงื่อนไข</div>${attemptFeedback}`;

    document.getElementById('sim-feedback-section').classList.remove('hidden');
    return isPerfect;
}

// --- SIMULATION LOGIC ---
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runSimulation() {
    const data = levelsData[currentLevel];
    let isPerfect = false;

    if (currentLevel > 1) {
        if (!document.getElementById('structure-ifelse-container')) {
            showToast("คุณยังไม่ได้วางโครงสร้างบล็อกหลักเลยครับ!");
            return;
        }
        if (currentLevel === 3 && !document.getElementById('logic-and-container')) {
            showToast("อย่าลืมวางบล็อกตรรกะ [AND/OR] สีม่วงในช่อง IF นะครับ!");
            return;
        }
    }

    let expectedCount = currentLevel === 1 ? 3 : (currentLevel === 2 ? 3 : 6);
    let blocksPlaced = 0;
    document.querySelectorAll('.drop-zone').forEach(z => { if (z.querySelector('.block-item')) blocksPlaced++; });

    if (blocksPlaced < expectedCount) {
        showToast(`กรุณาวางบล็อกให้ครบทุกช่อง (${blocksPlaced}/${expectedCount})`);
        return;
    }

    // เมื่อกดรันโปรแกรมสำเร็จและครบช่อง ให้บวกจำนวนความพยายามเพิ่ม 1
    runAttempts[currentLevel]++;

    const modal = document.getElementById('simModal');
    const logContainer = document.getElementById('sim-log-container');
    const iconEl = document.getElementById('sim-visual-icon');
    const textEl = document.getElementById('sim-visual-text');
    
    document.getElementById('sim-action-buttons').classList.add('hidden');
    document.getElementById('sim-close-x').classList.add('hidden');
    document.getElementById('sim-feedback-section').classList.add('hidden');
    logContainer.innerHTML = '';
    
    const visContainer = document.getElementById('sim-visual-container');
    if (currentLevel === 1) {
        visContainer.className = "h-24 w-48 flex items-center justify-center rounded-lg bg-slate-900 mb-4 overflow-hidden border-4 border-slate-700 shadow-inner relative mx-auto";
    } else {
        visContainer.className = "h-32 w-32 flex items-center justify-center rounded-2xl bg-slate-800 mb-4 overflow-hidden border-4 border-slate-300 shadow-inner relative mx-auto";
    }

    iconEl.className = 'text-6xl transition-all duration-700 transform scale-100 flex items-center justify-center w-full h-full text-center';
    iconEl.innerHTML = '⏳';
    textEl.innerText = 'กำลังส่งคำสั่ง...';
    textEl.className = 'text-lg font-bold text-gray-500 h-8 mb-4';
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (data.workspaceType === 'sequence') {
        // LEVEL 1
        document.getElementById('sim-trigger').innerText = "รันโปรแกรมตามลำดับขั้น (Sequence)";
        const steps = [
            document.querySelector('#drop-step1 .block-item'),
            document.querySelector('#drop-step2 .block-item'),
            document.querySelector('#drop-step3 .block-item')
        ];
        
        for (let i = 0; i < 3; i++) {
            const stepEl = steps[i];
            const sType = stepEl.getAttribute('data-type');
            let blockText = stepEl.innerText;
            let val = "";
            
            if (sType === 'action-scroll') {
                val = stepEl.querySelector('input').value.trim();
                blockText = `LED Scroll = "${val}"`;
                let logColor = (i === 0) ? 'text-blue-600' : 'text-green-600';
                logContainer.innerHTML += `<p class="mb-2 ${logColor} font-bold">▶ รันคำสั่งที่ ${i+1}: <span class="text-gray-700 font-normal">${blockText}</span></p>`;
                iconEl.innerHTML = `<div class="led-screen"><span class="led-text">${val || " "}</span></div>`;
                textEl.innerText = `เลื่อนข้อความ: ${val || "(ว่าง)"}`;
                await sleep(2500);
            } else if (sType === 'delay') {
                val = stepEl.querySelector('input').value;
                blockText = `Delay ${val} sec`;
                logContainer.innerHTML += `<p class="mb-2 text-amber-600 font-bold">▶ รันคำสั่งที่ ${i+1}: <span class="text-gray-700 font-normal">${blockText}</span></p>`;
                iconEl.innerHTML = '⏳';
                textEl.innerText = `กำลังหน่วงเวลา ${val} วินาที...`;
                await sleep(2000);
            } else {
                iconEl.innerHTML = '❓';
                textEl.innerText = 'คำสั่งไม่รู้จัก (Error)';
                await sleep(1000);
            }
        }

        // Check Rubric
        let checks = [];
        let s1Type = steps[0].getAttribute('data-type');
        let s2Type = steps[1].getAttribute('data-type');
        let s3Type = steps[2].getAttribute('data-type');
        
        checks.push({ 
            text: "บล็อกคำสั่งเรียงลำดับถูกต้อง (LED Scroll -> Delay -> LED Scroll)", 
            passed: (s1Type === 'action-scroll' && s2Type === 'delay' && s3Type === 'action-scroll') 
        });

        let val1 = steps[0].querySelector('input') ? steps[0].querySelector('input').value.trim() : "";
        checks.push({ 
            text: "บล็อกที่ 1 แสดงข้อความคำว่า 'WELCOME' (ตัวพิมพ์ใหญ่ทั้งหมด)", 
            passed: val1 === "WELCOME" 
        });

        let val2 = steps[1].querySelector('input') ? steps[1].querySelector('input').value : "";
        checks.push({ 
            text: "บล็อกหน่วงเวลา (Delay) ถูกตั้งค่าไว้เป็น 2 วินาที", 
            passed: val2 === "2" 
        });

        let val3 = steps[2].querySelector('input') ? steps[2].querySelector('input').value.trim() : "";
        let isEngName = /^[A-Za-z\s]+$/.test(val3) && val3.length > 0 && val3 !== "WELCOME";
        checks.push({ 
            text: "บล็อกที่ 3 แสดงชื่อเป็นภาษาอังกฤษ (ไม่ว่าง และไม่ซ้ำคำว่า WELCOME)", 
            passed: isEngName 
        });

        await sleep(500);
        isPerfect = renderChecklist(checks);

    } else if (data.workspaceType === 'dynamic-ifelse' && currentLevel === 2) {
        // LEVEL 2
        const condEl = document.querySelector('#drop-condition .block-item');
        const trueEl = document.querySelector('#drop-true1 .block-item');
        const falseEl = document.querySelector('#drop-false1 .block-item');

        const testTemp = 30; // Server is heating up
        document.getElementById('sim-trigger').innerText = `เซนเซอร์วัดค่าได้: Temp = ${testTemp}°C (ห้องเริ่มร้อน!)`;
        await sleep(800);

        let c1 = evalSensor(condEl, testTemp, 0); 
        if (!c1.valid) {
            logContainer.innerHTML += `<p class="mb-2"><span class="text-indigo-500 font-bold">▶ ผลลัพธ์:</span> <span class="font-bold text-red-600">Error: ใส่บล็อกเซนเซอร์ผิดประเภท</span></p>`;
            iconEl.innerHTML = '💥'; iconEl.className += ' text-red-500 animate-bounce scale-125';
            textEl.innerText = 'โปรแกรมพัง (Syntax Error)!'; textEl.className = 'text-lg font-bold h-8 text-red-500 mb-4';
        } else {
            logContainer.innerHTML += `<p class="mb-2"><span class="text-blue-500 font-bold">▶ ตรวจสอบ IF:</span> <span class="text-gray-700 font-normal">${c1.text}</span> (ปัจจุบัน ${testTemp})</p>`;
            await sleep(1000);

            logContainer.innerHTML += `<p class="mb-2"><span class="text-indigo-500 font-bold">▶ ผลลัพธ์เงื่อนไข:</span> <span class="font-bold ${c1.result ? 'text-green-600' : 'text-red-600'}">เป็น${c1.result ? 'จริง (TRUE)' : 'เท็จ (FALSE)'}</span></p>`;
            await sleep(1000);

            let executedEl = c1.result ? trueEl : falseEl;
            let executedZone = c1.result ? "DO (True)" : "ELSE DO (False)";
            let a = evalAction(executedEl);

            if (!a.valid) {
                logContainer.innerHTML += `<p><span class="text-green-500 font-bold">▶ รันคำสั่ง ${executedZone}:</span> <span class="font-bold text-red-600">Error: ไม่ใช่คำสั่งอุปกรณ์</span></p>`;
                iconEl.innerHTML = '❓'; iconEl.className += ' text-orange-500 scale-125';
                textEl.innerText = 'คำสั่งผิดพลาด (Error)!'; textEl.className = 'text-lg font-bold h-8 text-orange-500 mb-4';
            } else {
                logContainer.innerHTML += `<p><span class="text-green-500 font-bold">▶ รันคำสั่ง ${executedZone}:</span> <span class="bg-white px-1 border rounded text-gray-700 font-bold">${a.text}</span></p>`;
                await sleep(800);

                if (a.type === 'usb' && a.stat === 'ON') {
                    iconEl.innerHTML = '🌀'; iconEl.className += ' spin-fast text-blue-400 scale-125';
                    textEl.innerText = 'พัดลมทำงาน! ระบายความร้อนเซิร์ฟเวอร์'; textEl.className = 'text-lg font-bold h-8 text-blue-500 mb-4';
                } else if (a.type === 'usb' && a.stat === 'OFF') {
                    iconEl.innerHTML = '💥'; iconEl.className += ' text-red-500 animate-bounce scale-125';
                    textEl.innerText = 'พัดลมปิด! เซิร์ฟเวอร์ Overheat!'; textEl.className = 'text-lg font-bold h-8 text-red-500 mb-4';
                } else {
                    iconEl.innerHTML = '❓'; iconEl.className += ' text-orange-500 scale-125';
                    textEl.innerText = 'สั่งอุปกรณ์ผิดประเภท!'; textEl.className = 'text-lg font-bold h-8 text-orange-500 mb-4';
                }
            }
        }

        // Check Rubric
        let checks = [];
        checks.push({
            text: "โครงสร้าง If-Do-Else วางได้อย่างถูกต้อง",
            passed: document.getElementById('structure-ifelse-container') !== null
        });
        checks.push({
            text: "เงื่อนไข: วางบล็อก Temperature และตั้งค่าเป็น >= 25",
            passed: c1.valid && c1.type === 'temp' && c1.op === '>=' && c1.inputVal === '25'
        });
        
        let t1 = evalAction(trueEl);
        checks.push({
            text: "ช่อง DO (เป็นจริง): สั่งเปิดพัดลม (USB Status = ON)",
            passed: t1.valid && t1.type === 'usb' && t1.stat === 'ON'
        });

        let f1 = evalAction(falseEl);
        checks.push({
            text: "ช่อง ELSE (เป็นเท็จ): สั่งปิดพัดลม (USB Status = OFF)",
            passed: f1.valid && f1.type === 'usb' && f1.stat === 'OFF'
        });

        await sleep(500);
        isPerfect = renderChecklist(checks);

    } else if (data.workspaceType === 'dynamic-ifelse' && currentLevel === 3) {
        // LEVEL 3
        const cond1El = document.querySelector('#drop-cond1 .block-item');
        const cond2El = document.querySelector('#drop-cond2 .block-item');
        const logicOp = document.querySelector('.logic-sel').value; 
        
        const true1El = document.querySelector('#drop-true1 .block-item');
        const true2El = document.querySelector('#drop-true2 .block-item');
        const false1El = document.querySelector('#drop-false1 .block-item');
        const false2El = document.querySelector('#drop-false2 .block-item');

        const currentTemp = 30;
        const currentLight = 20;
        document.getElementById('sim-trigger').innerText = `สถานะปัจจุบัน: ห้องร้อน (${currentTemp}°C) และมืด (${currentLight} Lux)`;
        await sleep(800);

        let c1 = evalSensor(cond1El, currentTemp, currentLight);
        let c2 = evalSensor(cond2El, currentTemp, currentLight);

        if (!c1.valid || !c2.valid) {
            logContainer.innerHTML += `<p class="mb-2"><span class="font-bold text-red-600">Error: ลากบล็อกในช่องเซนเซอร์ผิดประเภท หรือไม่ครบ</span></p>`;
            iconEl.innerHTML = '💥'; iconEl.className += ' text-red-500 animate-bounce scale-125';
            textEl.innerText = 'โปรแกรมพัง (Syntax Error)!'; textEl.className = 'text-lg font-bold h-8 text-red-500 mb-4';
        } else {
            logContainer.innerHTML += `<p class="mb-1 text-blue-500 text-xs">▶ เงื่อนไขที่ 1: <span class="text-gray-700">${c1.text} -> <b>${c1.result}</b></span></p>`;
            await sleep(800);
            logContainer.innerHTML += `<p class="mb-1 text-blue-500 text-xs">▶ เงื่อนไขที่ 2: <span class="text-gray-700">${c2.text} -> <b>${c2.result}</b></span></p>`;
            await sleep(800);

            let finalCond = false;
            if (logicOp === 'AND') finalCond = c1.result && c2.result;
            else finalCond = c1.result || c2.result;

            logContainer.innerHTML += `<p class="mb-2"><span class="text-indigo-500 font-bold">▶ ตรรกะรวม (${logicOp}):</span> <span class="font-bold ${finalCond ? 'text-green-600' : 'text-red-600'}">เป็น${finalCond ? 'จริง (TRUE)' : 'เท็จ (FALSE)'}</span></p>`;
            await sleep(1000);

            let e1 = finalCond ? true1El : false1El;
            let e2 = finalCond ? true2El : false2El;
            let executedZone = finalCond ? "DO (True)" : "ELSE (False)";

            let a1 = evalAction(e1);
            let a2 = evalAction(e2);

            if (!a1.valid || !a2.valid) {
                logContainer.innerHTML += `<p><span class="font-bold text-red-600">Error: วางบล็อกสั่งการผิดประเภท</span></p>`;
                iconEl.innerHTML = '❓'; iconEl.className += ' text-orange-500 scale-125';
                textEl.innerText = 'คำสั่งผิดพลาด (Error)!'; textEl.className = 'text-lg font-bold h-8 text-orange-500 mb-4';
            } else {
                logContainer.innerHTML += `<p><span class="text-green-500 font-bold">▶ รันคำสั่ง ${executedZone}:</span><br><span class="text-gray-700 text-xs">- ${a1.text}<br>- ${a2.text}</span></p>`;
                await sleep(800);

                let showUsb = false, showLed = false;
                let usbOn = false, ledOn = false;

                [a1, a2].forEach(a => {
                    if(a.type === 'usb') { showUsb = true; usbOn = (a.stat === 'ON'); }
                    if(a.type === 'led') { showLed = true; ledOn = (a.stat === 'ON'); }
                });

                let iconHtml = '<div class="flex gap-2">';
                if(showUsb) iconHtml += `<span class="${usbOn ? 'spin-fast text-blue-400' : 'dark-fade'} inline-block">🌀</span>`;
                if(showLed) iconHtml += `<span class="${ledOn ? 'glow-yellow' : 'dark-fade'} inline-block">💡</span>`;
                iconHtml += '</div>';
                iconEl.innerHTML = iconHtml;

                if (showUsb && showLed) {
                    textEl.innerText = (usbOn && ledOn) ? "ห้องประชุมพร้อมใช้งาน 🏢" : "ห้องประชุมปิดมืด 🌑";
                    textEl.className = (usbOn && ledOn) ? "text-lg font-bold h-8 text-green-600 mb-4" : "text-lg font-bold h-8 text-gray-500 mb-4";
                } else {
                    textEl.innerText = "สั่งอุปกรณ์ไม่ครบ ❓";
                    textEl.className = "text-lg font-bold h-8 text-orange-500 mb-4";
                }
            }
        }
        
        // Check Rubric
        let checks = [];
        checks.push({
            text: "ใช้โครงสร้าง If-Do-Else และบล็อกตรรกะเชื่อมได้ถูกต้อง",
            passed: document.getElementById('logic-and-container') !== null && logicOp === 'AND'
        });

        let hasTempCond = (c1.valid && c1.type === 'temp' && c1.op === '>' && c1.inputVal === '25') || 
                            (c2.valid && c2.type === 'temp' && c2.op === '>' && c2.inputVal === '25');
        checks.push({
            text: "เงื่อนไขย่อย 1: Temperature Sensor > 25",
            passed: hasTempCond
        });

        let hasLightCond = (c1.valid && c1.type === 'light' && c1.op === '<' && c1.inputVal === '40') || 
                            (c2.valid && c2.type === 'light' && c2.op === '<' && c2.inputVal === '40');
        checks.push({
            text: "เงื่อนไขย่อย 2: Light Level Sensor < 40",
            passed: hasLightCond
        });

        let t1 = evalAction(true1El), t2 = evalAction(true2El);
        let isTruePerfect = (t1.valid && t2.valid) && 
            ((t1.type === 'usb' && t1.stat === 'ON' && t2.type === 'led' && t2.stat === 'ON') ||
                (t1.type === 'led' && t1.stat === 'ON' && t2.type === 'usb' && t2.stat === 'ON'));
        checks.push({
            text: "ช่อง DO: สั่ง USB Status=ON (แอร์) และ LED=ON (ไฟห้อง)",
            passed: isTruePerfect
        });

        let f1 = evalAction(false1El), f2 = evalAction(false2El);
        let isFalsePerfect = (f1.valid && f2.valid) && 
            ((f1.type === 'usb' && f1.stat === 'OFF' && f2.type === 'led' && f2.stat === 'OFF') ||
                (f1.type === 'led' && f1.stat === 'OFF' && f2.type === 'usb' && f2.stat === 'OFF'));
        checks.push({
            text: "ช่อง ELSE: สั่ง USB Status=OFF และ LED=OFF",
            passed: isFalsePerfect
        });

        await sleep(500);
        isPerfect = renderChecklist(checks);
    }

    window.currentSimResult = isPerfect;
    
    // Scroll logic so user sees feedback
    setTimeout(() => {
        const modalInner = document.querySelector('#simModal > div');
        modalInner.scrollTo({ top: modalInner.scrollHeight, behavior: 'smooth' });
    }, 300);

    document.getElementById('sim-action-buttons').classList.remove('hidden');
    document.getElementById('sim-close-x').classList.remove('hidden');
    
    if (isPerfect) {
        document.getElementById('sim-btn-next').classList.remove('hidden');
        document.getElementById('sim-btn-retry').classList.add('hidden');
    } else {
        document.getElementById('sim-btn-retry').classList.remove('hidden');
        document.getElementById('sim-btn-next').classList.add('hidden');
    }
}

function closeSimulation(isSuccess) {
    const modal = document.getElementById('simModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    if (isSuccess) { 
        handleSuccess(); 
    } else { 
        showToast("ยังไม่ผ่านเงื่อนไขบางข้อ ลองดู Feedback และแก้ไขโค้ดใหม่นะ!"); 
        // Re-render level selection to update scores
        renderLevelSelect();
    }
}

function handleSuccess() {
    // Re-render to show updated score on map before moving on
    renderLevelSelect();

    const modal = document.getElementById('successModal');
    const content = document.getElementById('modalContent');
    const btn = document.getElementById('next-level-btn');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    if (currentLevel === unlockedLevel && unlockedLevel < 3) unlockedLevel++;

    if (currentLevel < 3) {
        document.getElementById('modal-desc').innerText = `ภารกิจที่ ${currentLevel} เสร็จสมบูรณ์! คุณทำคะแนนได้เต็ม`;
        btn.innerText = "ไปรับภารกิจถัดไป";
        btn.onclick = () => { closeModal(); startStory(currentLevel + 1); };
    } else {
        document.getElementById('modal-desc').innerText = "ยินดีด้วย! คุณพิชิตภารกิจ Smart Office ครบทุกด่านด้วยคะแนนเต็ม 🏆";
        btn.innerText = "กลับหน้าเมนูหลัก";
        btn.onclick = () => { closeModal(); showView('view-home'); };
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    const content = document.getElementById('modalContent');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.remove('flex'); modal.classList.add('hidden'); }, 300);
}

function showToast(message) {
    const toast = document.getElementById('errorToast');
    document.getElementById('toast-msg').innerText = message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 3500);
}

// Init
renderLevelSelect();

