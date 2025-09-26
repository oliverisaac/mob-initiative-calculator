This is a mob initiative and combat calculator for dungeons and dragons 5e.

Use tailwindcss, jquery, and html.

This app has two parts: the mob creator and the calculation table.

The top of the window should include a form where I can input a mob. Form options are:

Creature (string)
Num Alive (number)
Health Per Creature (dice roll)
Attack Modifier (number)
Attacks Per Creature (number)
Damage Per Attack (dice roll)

On submission, the mob should be added to the calculation table.

The dice roll format will be: XdY+Z, where X is the number of Dice, Y is the kind of Dice, and Z is the modifier.

When adding a mob to the table, calculate the health for each creature and include that in the data. Then, when the mob is attacked, reduce the health of each creature by as many points as the attack damage. For example, if there are three creatures with health, [10, 12, 13], and we deal 15 damage, then kill the 10 creature, and reduce the 12 creature by 3 health. We then end up with: [0, 9, 13]. Then update the number alive to be the number of creatures with health greater than 0.

The calculation table keeps track of the state of the mob. Each mob in the table should have these options:

- Deal damage
- Saving throw
- Attack

When the deal damage button is pressed, it should pop up a modal where I can enter how much damage was caused. Use the damage calculation above to remove health from the mob.

When the saving throw button is pressed, a modal should pop up where I can enter the Save modifier of the creature and the difficult of the save. Roll a d20 for each of the creatures and tell me how many failed.

When the attack button is pressed, a modal should pop up where I can enter the AC of the creature being attacked as well as the kind of roll (normal, advantage, or disadvantage.) Then calculate the amount of damage caused by rolling an attack for each of the alive creatures in the mob and add their attack modifier. For each attack that is equal to or greater than the AC, roll the damage per attack. Tell me how many creatures hit, the damage for each attack, and the total damage of all attacks.

Make sure the website is done in dark mode using tailwindcss. Make sure it is responsive. Make sure it looks good.

