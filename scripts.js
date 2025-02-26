document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const diceTypes = document.querySelectorAll('.dice-type');
    const diceQueue = document.getElementById('dice-queue');
    const clearQueueButton = document.getElementById('clear-queue');
    const rollDiceButton = document.getElementById('roll-dice');
    const resultsArea = document.getElementById('results-area');
    const diceTotal = document.getElementById('dice-total');
    const rollHistory = document.getElementById('roll-history');
    
    // Add click handlers to dice types
    diceTypes.forEach(diceType => {
        diceType.addEventListener('click', () => {
            addDieToQueue(diceType.dataset.sides);
        });
    });
    
    // Clear queue button
    clearQueueButton.addEventListener('click', () => {
        diceQueue.innerHTML = '';
    });
    
    // Roll dice button
    rollDiceButton.addEventListener('click', () => {
        rollDice();
    });
    
    // Function to add a die to the queue
    function addDieToQueue(sides) {
        const die = document.createElement('div');
        die.className = 'queued-die';
        die.dataset.sides = sides;
        die.innerHTML = `
            d${sides}
            <div class="die-delete">×</div>
        `;
        
        // Add delete button functionality
        const deleteBtn = die.querySelector('.die-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            die.remove();
        });
        
        diceQueue.appendChild(die);
    }
    
    // Function to roll the dice
    function rollDice() {
        const queuedDice = diceQueue.querySelectorAll('.queued-die');
        
        if (queuedDice.length === 0) {
            alert('Please add at least one die to roll!');
            return;
        }
        
        // Clear previous results
        resultsArea.innerHTML = '';
        
        let total = 0;
        let resultHTML = '';
        const rollResults = [];
        
        // Roll each die and display results
        queuedDice.forEach(die => {
            const sides = parseInt(die.dataset.sides);
            const roll = Math.floor(Math.random() * sides) + 1;
            total += roll;
            
            // Determine if this is a max or min roll
            let cssClass = 'dice-result';
            if (roll === sides) {
                cssClass += ' dice-max';
            } else if (roll === 1) {
                cssClass += ' dice-min';
            }
            
            resultHTML += `<div class="${cssClass}">${roll}</div>`;
            rollResults.push({ sides, roll });
        });
        
        // Update results area and total
        resultsArea.innerHTML = resultHTML;
        diceTotal.textContent = total;
        
        // Add to history
        addToHistory(rollResults, total);
    }
    
    // Function to add roll to history
    function addToHistory(results, total) {
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        
        // Create a summary of the dice rolled
        const diceSummary = {};
        results.forEach(result => {
            if (!diceSummary[`d${result.sides}`]) {
                diceSummary[`d${result.sides}`] = 0;
            }
            diceSummary[`d${result.sides}`]++;
        });
        
        let summaryText = '';
        for (const [die, count] of Object.entries(diceSummary)) {
            summaryText += `${count}${die} `;
        }
        
        // Format timestamp
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        historyEntry.innerHTML = `
            <span>${summaryText.trim()}</span>
            <span>Result: ${total} <small>(${timestamp})</small></span>
        `;
        
        // Add to the top of history
        rollHistory.insertBefore(historyEntry, rollHistory.firstChild);
        
        // Limit history to 10 entries
        if (rollHistory.children.length > 10) {
            rollHistory.removeChild(rollHistory.lastChild);
        }
    }
});