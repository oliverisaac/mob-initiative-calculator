$(document).ready(function() {
    let mobs = [];

    // Save state to local storage
    function saveState() {
        localStorage.setItem('mobs', JSON.stringify(mobs));
    }

    // Load state from local storage
    function loadState() {
        const savedMobs = localStorage.getItem('mobs');
        if (savedMobs) {
            mobs = JSON.parse(savedMobs);
        }
    }

    // Parses a dice string like "XdY+Z" and returns the roll.
    function parseDiceString(diceString) {
        const match = diceString.match(/(\d+)d(\d+)([+-](\d+))?/);
        if (!match) return null;

        return {
            numDice: parseInt(match[1], 10),
            dieType: parseInt(match[2], 10),
            modifier: match[3] ? parseInt(match[3], 10) : 0
        };
    }

    // Parses a dice string like "XdY+Z" and returns the roll.
    function rollDice(diceString) {
        let rolls = []
        const dice = parseDiceString(diceString);
        if (!dice) return 0;

        for (let i = 0; i < dice.numDice; i++) {
            rolls.push(Math.floor(Math.random() * dice.dieType) + 1);
        }
        let total = rolls.reduce((previous, current) => {
          return previous + current 
        }, 0)
        console.debug(`Rolled ${diceString}: ${rolls} + ${dice.modifier}`)
        return total + dice.modifier;
    }

    // Renders the mobs in the table
    function renderMobs() {
        const $mobsTableBody = $('#mobs-table-body');
        $mobsTableBody.empty();

        mobs.forEach((mob, index) => {
            const healthDisplay = mob.healths.join(', ');
            const row = `
                <tr data-mob-index="${index}">
                    <td class="py-2 px-4 border-b border-gray-700">${mob.creature}</td>
                    <td class="py-2 px-4 border-b border-gray-700">${mob.numAlive}</td>
                    <td class="py-2 px-4 border-b border-gray-700">${mob.numStunned || 0}</td>
                    <td class="py-2 px-4 border-b border-gray-700">${healthDisplay}</td>
                    <td class="py-2 px-4 border-b border-gray-700">
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded deal-damage-btn">Damage</button>
                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded saving-throw-btn">Save</button>
                        <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded mark-stunned-btn">Mark Stunned</button>
                        <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded attack-btn">Attack</button>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded edit-mob-btn">Edit</button>
                        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded remove-mob-btn">Remove</button>
                    </td>
                </tr>
            `;
            $mobsTableBody.append(row);
        });
    }

    // Handle mob creation form submission
    $('#mob-form').on('submit', function(event) {
        event.preventDefault();

        const creature = $('#creature').val();
        const numAlive = parseInt($('#num-alive').val(), 10);
        const healthPerCreature = $('#health-per-creature').val();
        const attackModifier = parseInt($('#attack-modifier').val(), 10);
        const attacksPerCreature = parseInt($('#attacks-per-creature').val(), 10);
        const damagePerAttack = $('#damage-per-attack').val();

        const healths = [];
        for (let i = 0; i < numAlive; i++) {
            healths.push(rollDice(healthPerCreature));
        }

        const newMob = {
            creature,
            numAlive,
            healths,
            healthPerCreature,
            attackModifier,
            attacksPerCreature,
            damagePerAttack,
            numStunned: 0
        };

        mobs.push(newMob);
        saveState();
        renderMobs();

        // Clear the form
        $('#mob-form')[0].reset();
    });

    // Handle remove mob button click
    $('#mobs-table-body').on('click', '.remove-mob-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        mobs.splice(mobIndex, 1);
        saveState();
        renderMobs();
    });

    // Deal Damage Modal
    const $damageModal = $('#damage-modal');
    $('#mobs-table-body').on('click', '.deal-damage-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        $damageModal.data('mob-index', mobIndex);
        $damageModal.removeClass('hidden');
    });

    $('#cancel-damage').on('click', function() {
        $damageModal.addClass('hidden');
    });

    $('#apply-damage').on('click', function() {
        const mobIndex = $damageModal.data('mob-index');
        let damage = parseInt($('#damage-amount').val(), 10);
        if (isNaN(damage)) return;

        const mob = mobs[mobIndex];
        mob.healths.sort((a, b) => a - b); // Sort to apply damage to lowest health first

        for (let i = 0; i < mob.healths.length && damage > 0; i++) {
            if (mob.healths[i] > 0) {
                const health = mob.healths[i];
                if (damage >= health) {
                    damage -= health;
                    mob.healths[i] = 0;
                } else {
                    mob.healths[i] -= damage;
                    damage = 0;
                }
            }
        }

        mob.numAlive = mob.healths.filter(h => h > 0).length;
        saveState();
        $damageModal.addClass('hidden');
        $('#damage-amount').val('');
        renderMobs();
    });

    // Mark Stunned Modal
    const $markStunnedModal = $('#mark-stunned-modal');
    $('#mobs-table-body').on('click', '.mark-stunned-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        const mob = mobs[mobIndex];
        $markStunnedModal.data('mob-index', mobIndex);
        $('#num-stunned').val(mob.numStunned || 0);
        $markStunnedModal.removeClass('hidden');
    });

    $('#cancel-mark-stunned').on('click', function() {
        $markStunnedModal.addClass('hidden');
    });

    $('#apply-mark-stunned').on('click', function() {
        const mobIndex = $markStunnedModal.data('mob-index');
        const numStunned = parseInt($('#num-stunned').val(), 10);
        if (isNaN(numStunned)) return;

        const mob = mobs[mobIndex];
        mob.numStunned = numStunned;

        saveState();
        $markStunnedModal.addClass('hidden');
        renderMobs();
    });

    // Saving Throw Modal
    const $savingThrowModal = $('#saving-throw-modal');
    $('#mobs-table-body').on('click', '.saving-throw-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        $savingThrowModal.data('mob-index', mobIndex);
        $('#saving-throw-result').empty();
        $savingThrowModal.removeClass('hidden');
    });

    $('#close-saving-throw').on('click', function() {
        $savingThrowModal.addClass('hidden');
        $('#save-modifier').val('');
        $('#save-dc').val('');
        $('#saving-throw-result').empty();
    });

    $('#roll-saving-throw').on('click', function() {
        const mobIndex = $savingThrowModal.data('mob-index');
        const mob = mobs[mobIndex];
        const saveModifier = parseInt($('#save-modifier').val(), 10) || 0;
        const saveDC = parseInt($('#save-dc').val(), 10);

        if (isNaN(saveDC)) {
            $('#saving-throw-result').text('Please enter a valid DC.');
            return;
        }

        let failedSaves = 0;
        for (let i = 0; i < mob.numAlive; i++) {
            const roll = Math.floor(Math.random() * 20) + 1;
            if (roll + saveModifier < saveDC) {
                failedSaves++;
            }
        }

        $('#saving-throw-result').text(`${failedSaves} out of ${mob.numAlive} creatures failed the save.`);
    });

    // Attack Modal
    const $attackModal = $('#attack-modal');
    $('#mobs-table-body').on('click', '.attack-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        const mob = mobs[mobIndex];
        $attackModal.data('mob-index', mobIndex);
        $('#attack-num-stunned').val(mob.numStunned || 0);
        $('#attack-result').empty();
        $attackModal.removeClass('hidden');
    });

    $('#close-attack').on('click', function() {
        $attackModal.addClass('hidden');
        $('#attack-ac').val('');
        $('#roll-type').val('normal');
        $('#attack-result').empty();
    });

    $('#roll-attack').on('click', function() {
        const mobIndex = $attackModal.data('mob-index');
        const mob = mobs[mobIndex];
        const targetAC = parseInt($('#attack-ac').val(), 10);
        const rollType = $('#roll-type').val();
        const numStunned = parseInt($('#attack-num-stunned').val(), 10) || 0;

        mob.numStunned = numStunned;

        if (isNaN(targetAC)) {
            $('#attack-result').text('Please enter a valid AC.');
            return;
        }

        let totalDamage = 0;
        const attackResults = [];
        const damageDice = parseDiceString(mob.damagePerAttack);

        const numAttacking = mob.numAlive - (mob.numStunned || 0);
        const totalAttacks = numAttacking * mob.attacksPerCreature;

        for (let i = 0; i < numAttacking; i++) {
            for (let j = 0; j < mob.attacksPerCreature; j++) {
                let roll1 = Math.floor(Math.random() * 20) + 1;
                let roll2 = Math.floor(Math.random() * 20) + 1;
                let attackRollValue;

                if (rollType === 'advantage') {
                    attackRollValue = Math.max(roll1, roll2);
                } else if (rollType === 'disadvantage') {
                    attackRollValue = Math.min(roll1, roll2);
                } else {
                    attackRollValue = roll1;
                }

                if (attackRollValue + mob.attackModifier >= targetAC) {
                    const damage = rollDice(mob.damagePerAttack);
                    attackResults.push({ roll: attackRollValue, damage: damage });
                    totalDamage += damage;
                }
            }
        }

        const hits = attackResults.length;
        const attackRollsText = attackResults.map(r => `${r.roll} (${r.damage})`).join(', ');

        const resultText = `
            <p>${hits}/${totalAttacks} hits!</p>
            <p>Attack: 1d20+${mob.attackModifier}</p>
            <p>Damage: ${mob.damagePerAttack}</p>
            <p>Attack rolls: ${attackRollsText}</p>
            <p>Total damage: ${totalDamage}</p>
        `;
        $('#attack-result').html(resultText);
        saveState();
        renderMobs();
    });

    // Edit Mob Modal
    const $editMobModal = $('#edit-mob-modal');
    $('#mobs-table-body').on('click', '.edit-mob-btn', function() {
        const mobIndex = $(this).closest('tr').data('mob-index');
        const mob = mobs[mobIndex];

        $editMobModal.data('mob-index', mobIndex);
        $('#edit-creature').val(mob.creature);
        $('#edit-num-alive').val(mob.numAlive);
        $('#edit-health-per-creature').val(mob.healthPerCreature);
        $('#edit-attack-modifier').val(mob.attackModifier);
        $('#edit-attacks-per-creature').val(mob.attacksPerCreature);
        $('#edit-damage-per-attack').val(mob.damagePerAttack);
        $('#edit-healths').val(mob.healths.join(', '));
        $('#edit-num-stunned').val(mob.numStunned || 0);

        $editMobModal.removeClass('hidden');
    });

    $('#cancel-edit-mob').on('click', function() {
        $editMobModal.addClass('hidden');
    });

    $('#edit-mob-form').on('submit', function(event) {
        event.preventDefault();

        const mobIndex = $editMobModal.data('mob-index');
        const mob = mobs[mobIndex];

        mob.creature = $('#edit-creature').val();
        mob.numAlive = parseInt($('#edit-num-alive').val(), 10);
        mob.attackModifier = parseInt($('#edit-attack-modifier').val(), 10);
        mob.attacksPerCreature = parseInt($('#edit-attacks-per-creature').val(), 10);
        mob.damagePerAttack = $('#edit-damage-per-attack').val();
        mob.numStunned = parseInt($('#edit-num-stunned').val(), 10) || 0;
        
        const healthsString = $('#edit-healths').val();
        mob.healths = healthsString.split(',').map(h => parseInt(h.trim(), 10));

        mob.numAlive = mob.healths.filter(h => h > 0).length;

        saveState();
        renderMobs();
        $editMobModal.addClass('hidden');
    });

    $('#reroll-health').on('click', function() {
        const healthPerCreature = $('#edit-health-per-creature').val();
        const numAlive = parseInt($('#edit-num-alive').val(), 10);

        const newHealths = [];
        for (let i = 0; i < numAlive; i++) {
            newHealths.push(rollDice(healthPerCreature));
        }

        $('#edit-healths').val(newHealths.join(', '));
    });

    $(document).on('keydown', function(event) {
        if (event.key === "Escape") {
            $('#damage-modal').addClass('hidden');
            $('#saving-throw-modal').addClass('hidden');
            $('#attack-modal').addClass('hidden');
            $('#edit-mob-modal').addClass('hidden');
            $('#mark-stunned-modal').addClass('hidden');
        }
    });

    // Initial load
    loadState();
    renderMobs();
});
