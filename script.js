let stars = 0;
let patternScore = 0;
let patternRound = 0;
let labelData = {};
let adventureState = { happiness: 80, learned: 0, history: [] };

window.onload = function() {
    const savedStars = localStorage.getItem('aiQuestStars');
    if (savedStars) {
        stars = parseInt(savedStars);
        document.getElementById('star-count').innerText = stars;
    }
    setTimeout(() => { if (Math.random() > 0.7) createConfetti(15); }, 1200);
};

function updateStars(newStars) {
    stars = Math.min(15, stars + newStars);
    document.getElementById('star-count').innerText = stars;
    localStorage.setItem('aiQuestStars', stars);
    if (stars >= 15) {
        setTimeout(() => { alert('🎉 Congratulations! You\'ve earned your AI Trainer Badge! 🤖'); createConfetti(80); }, 600);
    }
}

function createConfetti(count) {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'fixed text-2xl pointer-events-none z-[200]';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.innerHTML = ['⭐', '🌈', '🤖', '🎉'][Math.floor(Math.random()*4)];
            document.body.appendChild(confetti);
            const duration = Math.random() * 2500 + 1800;
            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random()*720 - 360}deg)`, opacity: 0 }
            ], { duration: duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).onfinish = () => confetti.remove();
        }, i * 30);
    }
}

function petByte() {
    const mascot = document.querySelector('.mascot');
    mascot.style.transform = 'scale(1.3)';
    setTimeout(() => { mascot.style.transform = 'scale(1)'; }, 300);
    const messages = ["Beep boop! Thanks for the pets! 🤖", "You're my favorite trainer!", "I feel smarter already!", "Let's play more AI games!"];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-xl px-6 py-3 rounded-3xl flex items-center gap-x-3 border border-indigo-200 z-[300]';
    toast.innerHTML = `<span class="text-3xl">🤖</span> <span class="font-semibold text-gray-800">${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

// PATTERN DETECTIVE
let currentOddIndex = -1;
let patternEmojis = ['🍎', '🍌', '🍓', '🍒', '🍉', '🍑', '🍇', '🍓'];

function startPatternGame() {
    patternScore = 0; patternRound = 0;
    document.getElementById('pattern-score').innerText = `Score: ${patternScore}/5`;
    document.getElementById('pattern-round').innerText = '1';
    document.getElementById('pattern-next-btn').classList.add('hidden');
    document.getElementById('pattern-feedback').innerText = "Click the one that doesn't belong!";
    document.getElementById('pattern-modal').classList.remove('hidden');
    document.getElementById('pattern-modal').classList.add('flex');
    generatePatternRound();
}

function generatePatternRound() {
    const grid = document.getElementById('pattern-grid');
    grid.innerHTML = '';
    const size = 9;
    const baseEmoji = patternEmojis[Math.floor(Math.random() * patternEmojis.length)];
    let oddEmoji = baseEmoji;
    while (oddEmoji === baseEmoji) oddEmoji = patternEmojis[Math.floor(Math.random() * patternEmojis.length)];
    currentOddIndex = Math.floor(Math.random() * size);
    for (let i = 0; i < size; i++) {
        const cell = document.createElement('div');
        cell.className = `pattern-cell aspect-square flex items-center justify-center text-7xl bg-white rounded-2xl shadow cursor-pointer border-4 border-transparent hover:border-indigo-300`;
        cell.innerHTML = (i === currentOddIndex) ? oddEmoji : baseEmoji;
        cell.onclick = () => handlePatternClick(i, cell);
        grid.appendChild(cell);
    }
}

function handlePatternClick(index, cell) {
    const allCells = document.querySelectorAll('#pattern-grid > div');
    if (index === currentOddIndex) {
        cell.classList.add('!border-green-400', 'correct');
        patternScore++;
        document.getElementById('pattern-score').innerText = `Score: ${patternScore}/5`;
        document.getElementById('pattern-feedback').innerHTML = `<span class="text-green-600 font-bold">✅ Great job! Byte learned that pattern!</span>`;
        allCells.forEach(c => c.onclick = null);
        setTimeout(() => { document.getElementById('pattern-next-btn').classList.remove('hidden'); }, 900);
    } else {
        cell.classList.add('!border-red-400', 'wrong');
        document.getElementById('pattern-feedback').innerHTML = `<span class="text-red-500">Not quite... try again next round!</span>`;
        allCells.forEach(c => c.onclick = null);
        setTimeout(() => { document.getElementById('pattern-next-btn').classList.remove('hidden'); }, 1100);
    }
}

function nextPatternRound() {
    patternRound++;
    document.getElementById('pattern-round').innerText = patternRound + 1;
    document.getElementById('pattern-next-btn').classList.add('hidden');
    document.getElementById('pattern-feedback').innerText = "Click the one that doesn't belong!";
    if (patternRound < 5) {
        generatePatternRound();
    } else {
        endPatternGame();
    }
}

function endPatternGame() {
    const grid = document.getElementById('pattern-grid');
    grid.innerHTML = `<div class="col-span-3 text-center py-8"><div class="text-7xl mb-4">🎉</div><h4 class="text-3xl font-bold text-gray-900 mb-2">Amazing Detective Work!</h4><p class="text-xl text-gray-600 mb-6">You scored <span class="font-extrabold text-amber-500">${patternScore}/5</span></p><div class="max-w-xs mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-sm"><p class="font-semibold text-amber-700 mb-1">What Byte Learned:</p><p class="text-amber-600">Real AI uses <strong>pattern recognition</strong> to find differences in images, just like you did! This is how self-driving cars spot traffic signs.</p></div></div>`;
    if (patternScore >= 4) { updateStars(5); createConfetti(40); } else if (patternScore >= 2) { updateStars(3); } else { updateStars(1); }
    setTimeout(() => {
        document.getElementById('pattern-next-btn').innerHTML = 'Play Again <i class="fa-solid fa-redo ml-2"></i>';
        document.getElementById('pattern-next-btn').onclick = () => { closeModal('pattern-modal'); setTimeout(startPatternGame, 300); };
        document.getElementById('pattern-next-btn').classList.remove('hidden');
    }, 1500);
}

// LABEL & LEARN
let labelItems = [
    { emoji: '🐶', name: 'Dog', category: 'Animal' },
    { emoji: '🐱', name: 'Cat', category: 'Animal' },
    { emoji: '🐻', name: 'Bear', category: 'Animal' },
    { emoji: '🍎', name: 'Apple', category: 'Food' },
    { emoji: '🍌', name: 'Banana', category: 'Food' },
    { emoji: '🍓', name: 'Strawberry', category: 'Food' },
    { emoji: '🚗', name: 'Car', category: 'Vehicle' },
    { emoji: '🚕', name: 'Taxi', category: 'Vehicle' },
    { emoji: '🚂', name: 'Train', category: 'Vehicle' }
];
let trainingLabels = {};
let currentLabelIndex = 0;
let testItems = [];
let aiCorrect = 0;

function startLabelGame() {
    trainingLabels = {}; currentLabelIndex = 0; aiCorrect = 0; testItems = [];
    const modal = document.getElementById('label-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    document.getElementById('label-phase').innerText = 'Training Phase - Teach Byte!';
    showLabelTraining();
}

function showLabelTraining() {
    const content = document.getElementById('label-content');
    content.innerHTML = `<div class="mb-6"><div class="flex items-center justify-between mb-4"><div><span class="font-bold text-purple-700">Training Item ${currentLabelIndex + 1} / 6</span></div><div class="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-bold">Label this!</div></div><div class="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100"><div class="text-[120px] mb-4 drop-shadow">${labelItems[currentLabelIndex].emoji}</div><div class="text-4xl font-bold text-gray-800 mb-1">${labelItems[currentLabelIndex].name}</div><div class="text-purple-500 text-sm">What category does this belong to?</div></div></div><div class="grid grid-cols-3 gap-4"><button onclick="labelItem('Animal')" class="kid-button py-4 px-6 bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xl font-bold rounded-2xl flex flex-col items-center justify-center gap-y-1 shadow-lg"><span class="text-4xl">🐾</span><span>Animal</span></button><button onclick="labelItem('Food')" class="kid-button py-4 px-6 bg-gradient-to-br from-orange-400 to-amber-500 text-white text-xl font-bold rounded-2xl flex flex-col items-center justify-center gap-y-1 shadow-lg"><span class="text-4xl">🍎</span><span>Food</span></button><button onclick="labelItem('Vehicle')" class="kid-button py-4 px-6 bg-gradient-to-br from-sky-400 to-blue-500 text-white text-xl font-bold rounded-2xl flex flex-col items-center justify-center gap-y-1 shadow-lg"><span class="text-4xl">🚗</span><span>Vehicle</span></button></div>`;
    document.getElementById('label-next-btn').classList.add('hidden');
    document.getElementById('label-progress').innerText = `${Object.keys(trainingLabels).length} / 6 labeled`;
}

function labelItem(category) {
    const item = labelItems[currentLabelIndex];
    trainingLabels[item.name] = category;
    const content = document.getElementById('label-content');
    content.style.transition = 'all 0.3s'; content.style.opacity = '0.6';
    setTimeout(() => {
        currentLabelIndex++;
        if (currentLabelIndex < 6) { showLabelTraining(); content.style.opacity = '1'; } else { finishTraining(); }
    }, 420);
}

function finishTraining() {
    const content = document.getElementById('label-content');
    document.getElementById('label-phase').innerText = 'AI is Learning...';
    content.innerHTML = `<div class="text-center py-12"><div class="mx-auto w-20 h-20 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-8"></div><h4 class="text-3xl font-bold text-purple-700 mb-3">Byte is studying your labels!</h4><p class="text-gray-600 max-w-xs mx-auto">Analyzing patterns in your training data...</p></div>`;
    document.getElementById('label-next-btn').classList.add('hidden');
    setTimeout(() => { startTestPhase(); }, 2200);
}

function startTestPhase() {
    document.getElementById('label-phase').innerText = 'Testing Phase - Can Byte Guess?';
    const usedNames = Object.keys(trainingLabels);
    testItems = labelItems.filter(item => !usedNames.includes(item.name)).slice(0, 4);
    if (testItems.length < 4) testItems = labelItems.slice(6, 10);
    currentLabelIndex = 0; aiCorrect = 0;
    showTestItem();
}

function showTestItem() {
    const content = document.getElementById('label-content');
    const item = testItems[currentLabelIndex];
    let predicted = 'Animal';
    const sameCategoryItems = Object.keys(trainingLabels).filter(name => { const trainedItem = labelItems.find(i => i.name === name); return trainedItem && trainedItem.category === item.category; });
    if (sameCategoryItems.length > 0) {
        const votes = {};
        sameCategoryItems.forEach(name => { const cat = trainingLabels[name]; votes[cat] = (votes[cat] || 0) + 1; });
        predicted = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
    }
    content.innerHTML = `<div class="mb-8"><div class="text-center"><div class="inline-block px-4 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-4">NEW ITEM FOR BYTE</div><div class="text-[110px] mb-3">${item.emoji}</div><div class="text-4xl font-extrabold text-gray-900">${item.name}</div></div></div><div class="mb-6"><p class="text-center text-sm font-semibold text-purple-600 mb-3">Byte thinks this is a...</p><div class="flex justify-center"><div class="px-10 py-4 bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-300 rounded-3xl text-center"><span class="text-5xl font-extrabold text-purple-700">${predicted}</span></div></div></div><div class="text-center"><p class="text-sm text-gray-500 mb-4">Was Byte correct? Help him learn!</p><div class="flex gap-4 justify-center"><button onclick="evaluateLabel(true, '${predicted}')" class="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex-1 max-w-[140px]">Yes! Correct</button><button onclick="evaluateLabel(false, '${predicted}')" class="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl flex-1 max-w-[140px]">No, it's ${item.category}</button></div></div>`;
    document.getElementById('label-next-btn').classList.add('hidden');
}

function evaluateLabel(correct, predicted) {
    const item = testItems[currentLabelIndex];
    if (correct) {
        aiCorrect++;
        document.getElementById('label-content').innerHTML = `<div class="text-center py-10"><div class="text-6xl mb-4">✅</div><p class="text-2xl font-bold text-emerald-600">Byte got it right!</p><p class="text-gray-600 mt-2">Your training data helped him!</p></div>`;
    } else {
        document.getElementById('label-content').innerHTML = `<div class="text-center py-10"><div class="text-6xl mb-4">💡</div><p class="text-2xl font-bold text-rose-600">Byte learned something new!</p><p class="text-gray-600 mt-2">Thanks for the correction. He's getting smarter!</p></div>`;
    }
    setTimeout(() => {
        currentLabelIndex++;
        if (currentLabelIndex < testItems.length) { showTestItem(); } else { endLabelGame(); }
    }, 1450);
}

function endLabelGame() {
    const accuracy = Math.round((aiCorrect / testItems.length) * 100);
    const content = document.getElementById('label-content');
    let message = ''; let starsEarned = 2;
    if (accuracy >= 75) { message = 'Byte is becoming a classification expert!'; starsEarned = 5; createConfetti(35); }
    else if (accuracy >= 50) { message = 'Good job training him! More examples = better AI.'; starsEarned = 4; }
    else { message = 'AI learns best with consistent labels. Try again!'; starsEarned = 2; }
    updateStars(starsEarned);
    content.innerHTML = `<div class="text-center py-6"><div class="text-6xl mb-4">${accuracy >= 75 ? '🎉' : '👏'}</div><h4 class="text-4xl font-extrabold text-purple-700 mb-2">Training Complete!</h4><div class="text-6xl font-black text-purple-600 mb-2">${accuracy}%</div><p class="text-xl text-gray-600 mb-6">Byte's accuracy on new items</p><div class="max-w-sm mx-auto bg-purple-50 border border-purple-200 p-5 rounded-3xl text-left"><p class="font-bold text-purple-700 mb-2">What you taught Byte:</p><div class="text-sm text-purple-600 space-y-1">${Object.entries(trainingLabels).map(([name, cat]) => `<div class="flex justify-between"><span>${name}</span> <span class="font-mono">${cat}</span></div>`).join('')}</div></div><p class="mt-6 text-sm text-purple-600 italic">${message}</p></div>`;
    document.getElementById('label-next-btn').innerHTML = 'Play Again <i class="fa-solid fa-redo ml-2"></i>';
    document.getElementById('label-next-btn').onclick = () => { closeModal('label-modal'); setTimeout(startLabelGame, 400); };
    document.getElementById('label-next-btn').classList.remove('hidden');
}

// ADVENTURE TRAINER
let adventureScenarios = [
    { id: 1, text: "Byte enters a sparkling forest. A friendly squirrel offers a shiny acorn. What should Byte do?", choices: [ { text: "Take the acorn and say thank you", reward: 15, learned: "be polite", emoji: "😊" }, { text: "Ignore the squirrel and keep walking", reward: -10, learned: "explore alone", emoji: "😐" } ] },
    { id: 2, text: "A river blocks the path. Byte sees stepping stones. Should he cross?", choices: [ { text: "Jump carefully across the stones", reward: 20, learned: "be brave", emoji: "😎" }, { text: "Wait for help or turn back", reward: 5, learned: "be careful", emoji: "😕" } ] },
    { id: 3, text: "Byte finds a treasure chest! But there's a tricky lock. How to open it?", choices: [ { text: "Try different keys patiently", reward: 25, learned: "persevere", emoji: "😄" }, { text: "Shake the box really hard", reward: -15, learned: "be gentle", emoji: "😢" } ] }
];
let currentScenarioIndex = 0;

function startAdventureGame() {
    adventureState = { happiness: 80, learned: 0, history: [] };
    currentScenarioIndex = 0;
    const modal = document.getElementById('adventure-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    updateAdventureUI();
    showCurrentScenario();
}

function updateAdventureUI() {
    document.getElementById('adventure-happiness').innerText = adventureState.happiness;
    document.getElementById('happiness-bar').style.width = adventureState.happiness + '%';
    document.getElementById('learned-count').innerText = adventureState.learned;
}

function showCurrentScenario() {
    const storyEl = document.getElementById('adventure-story');
    const choicesEl = document.getElementById('adventure-choices');
    if (currentScenarioIndex >= adventureScenarios.length) { endAdventure(); return; }
    const scenario = adventureScenarios[currentScenarioIndex];
    storyEl.innerHTML = `<div class="flex items-start gap-4"><div class="text-6xl flex-shrink-0 mt-1">🤖</div><div class="flex-1"><p class="text-xl leading-tight text-gray-800">${scenario.text}</p></div></div>`;
    choicesEl.innerHTML = '';
    scenario.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = `kid-button text-left p-5 rounded-2xl border-2 flex items-start gap-4 transition-all hover:border-pink-400 ${idx === 0 ? 'border-pink-300 bg-white' : 'border-pink-200 bg-white'}`;
        btn.innerHTML = `<div class="text-4xl mt-0.5">${choice.emoji}</div><div class="flex-1"><div class="font-bold text-lg text-gray-900">${choice.text}</div><div class="text-xs text-pink-500 mt-1">${choice.reward > 0 ? '+' : ''}${choice.reward} happiness</div></div>`;
        btn.onclick = () => makeAdventureChoice(choice, scenario);
        choicesEl.appendChild(btn);
    });
}

function makeAdventureChoice(choice, scenario) {
    adventureState.happiness = Math.max(10, Math.min(100, adventureState.happiness + choice.reward));
    adventureState.learned++;
    adventureState.history.push({ scenario: scenario.id, choice: choice.text, reward: choice.reward });
    updateAdventureUI();
    const storyEl = document.getElementById('adventure-story');
    storyEl.innerHTML = `<div class="text-center py-4"><div class="text-5xl mb-3">${choice.emoji}</div><p class="font-bold text-xl ${choice.reward > 0 ? 'text-emerald-600' : 'text-rose-500'}">${choice.reward > 0 ? 'Great choice!' : 'Hmm, Byte learned from that!'}</p><p class="text-sm text-gray-500 mt-2">${choice.reward > 0 ? 'Byte feels happier and smarter.' : 'Every experience helps Byte grow.'}</p></div>`;
    document.getElementById('adventure-choices').innerHTML = '';
    setTimeout(() => { currentScenarioIndex++; showCurrentScenario(); }, 1350);
}

function endAdventure() {
    const storyEl = document.getElementById('adventure-story');
    const choicesEl = document.getElementById('adventure-choices');
    let finalMessage = "Byte reached the treasure!";
    let starsToAdd = 3;
    if (adventureState.happiness > 85) { finalMessage = "Byte is overjoyed! You're an amazing trainer!"; starsToAdd = 5; createConfetti(50); } else if (adventureState.happiness > 60) { starsToAdd = 4; }
    updateStars(starsToAdd);
    storyEl.innerHTML = `<div class="text-center py-6"><div class="text-7xl mb-5">🏆</div><h4 class="text-3xl font-extrabold text-pink-700 mb-3">Adventure Complete!</h4><p class="text-2xl font-bold text-gray-800 mb-2">Byte's Final Happiness: <span class="text-pink-600">${adventureState.happiness}</span></p><p class="text-gray-600 mb-6">${finalMessage}</p><div class="bg-white border border-pink-200 p-4 rounded-2xl text-left max-w-xs mx-auto"><p class="font-bold text-sm text-pink-600 mb-2">Byte learned these lessons:</p><ul class="text-sm text-gray-600 space-y-1">${adventureState.history.map(h => `<li class="flex items-start gap-2"><span class="text-pink-400">•</span> <span>${h.choice}</span></li>`).join('')}</ul></div></div>`;
    choicesEl.innerHTML = `<button onclick="resetAdventure()" class="col-span-2 kid-button py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl flex items-center justify-center gap-x-3"><span>Play Adventure Again</span><i class="fa-solid fa-redo"></i></button>`;
}

function resetAdventure() {
    closeModal('adventure-modal');
    setTimeout(() => { startAdventureGame(); }, 300);
}

// EXPLAINER
function showExplainer() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4';
    modal.innerHTML = `<div class="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"><div class="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"><div class="flex justify-between items-center"><div class="flex items-center gap-x-3"><i class="fa-solid fa-brain text-3xl"></i><h3 class="text-3xl font-bold">How Does AI Really Work?</h3></div><button onclick="this.closest('.fixed').remove()" class="text-white text-4xl">&times;</button></div></div><div class="p-8 space-y-8 text-gray-700"><div><div class="flex items-center gap-x-4 mb-3"><div class="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-search fa-lg"></i></div><div class="font-bold text-xl">1. Pattern Recognition</div></div><p class="pl-14 text-[15px]">AI looks at lots of examples to find hidden patterns. In Pattern Detective, you trained Byte to spot what's different — exactly like how image recognition AI works!</p></div><div><div class="flex items-center gap-x-4 mb-3"><div class="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-tags fa-lg"></i></div><div class="font-bold text-xl">2. Supervised Learning</div></div><p class="pl-14 text-[15px]">You gave Byte labeled examples ("this is a Dog = Animal"). Then he used that data to guess new items. This is how Gmail learns to sort spam!</p></div><div><div class="flex items-center gap-x-4 mb-3"><div class="w-9 h-9 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-map fa-lg"></i></div><div class="font-bold text-xl">3. Reinforcement Learning</div></div><p class="pl-14 text-[15px]">Byte tried different actions and got rewards (happiness). Over time he learns the best path — just like how robots and game AIs (like AlphaGo) improve by playing!</p></div><div class="pt-4 border-t text-xs text-center text-gray-400">AI isn't magic — it's math + data + practice. You just taught an AI today!</div></div></div>`;
    document.body.appendChild(modal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('flex'); modal.classList.add('hidden');
    if (modalId === 'pattern-modal') {
        document.getElementById('pattern-next-btn').onclick = null;
        document.getElementById('pattern-next-btn').innerHTML = 'Next Round <i class="fa-solid fa-arrow-right"></i>';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement.tagName === 'BODY') {
        e.preventDefault();
        const modals = document.querySelectorAll('.fixed:not(.hidden)');
        if (modals.length === 0) startPatternGame();
    }
});