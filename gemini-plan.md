# Mob Initiative and Combat Calculator Plan

This plan outlines the steps to create the Mob Initiative and Combat Calculator as described in `GEMINI.md`.

- [x] **1. Setup**
    - [x] Set up Tailwind CSS for styling.
    - [x] Include jQuery.
    - [x] Create the basic HTML structure in `index.html`.

- [x] **2. Mob Creator Form**
    - [x] Create a form in `index.html` with inputs for:
        - [x] Creature (text)
        - [x] Num Alive (number)
        - [x] Health Per Creature (text, dice roll format `XdY+Z`)
        - [x] Attack Modifier (number)
        - [x] Attacks Per Creature (number)
        - [x] Damage Per Attack (text, dice roll format `XdY+Z`)
    - [x] Add a submit button.

- [x] **3. Calculation Table**
    - [x] Create a table in `index.html` to display the mobs.
    - [x] The table should have columns for the mob's stats and action buttons.

- [x] **4. JavaScript Logic (`index.js`)**
    - [x] **Dice Rolling:**
        - [x] Create a function to parse a dice roll string (`XdY+Z`) and return the result of the roll.
    - [x] **Mob Creation:**
        - [x] On form submission:
            - [x] Read the values from the form.
            - [x] For each creature, roll for its individual health and store it in an array.
            - [x] Create a mob object containing all the necessary data.
            - [x] Add the new mob object to a global array of mobs.
            - [x] Render the updated mobs in the calculation table.
    - [x] **Table Rendering:**
        - [x] Create a function that takes the array of mobs and renders them as rows in the table.
        - [x] Each row should include the mob's data and the action buttons.
    - [x] **"Deal Damage" Functionality:**
        - [x] When the "Deal damage" button is clicked, show a modal.
        - [x] The modal will have an input for damage amount.
        - [x] On submitting the damage, apply it to the mob's health array.
        - [x] Update the "Num Alive" count.
        - [x] Re-render the table.
    - [x] **"Saving Throw" Functionality:**
        - [x] When the "Saving throw" button is clicked, show a modal.
        - [x] The modal will have inputs for Save modifier and DC.
        - [x] Roll a d20 for each alive creature and display the number of failures.
    - [x] **"Attack" Functionality:**
        - [x] When the "Attack" button is clicked, show a modal.
        - [x] The modal will have inputs for AC and roll type.
        - [x] For each alive creature, roll for attack and damage.
        - [x] Display the number of hits, individual damage rolls, and total damage.

- [x] **5. Styling**
    - [x] Use Tailwind CSS to style the page in dark mode.
    - [x] Ensure the layout is responsive.
    - [x] Style the form, table, and modals to look good.