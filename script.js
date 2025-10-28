// --- Constantes & outils ---
const TARIFS = Object.freeze({
    demijour: 8,
    jour: 15,
    repas: 7,
});

const TVA = 0.20;
const DEBUG = false;

const fmt = (n) => Number(n || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const telRegex = /^(?:0[1-9](?:[ .-]?\d{2}){4}|(?:\+33|0033)[ .-]?[1-9](?:[ .-]?\d{2}){4})$/;
const toUpper = (s) => (s || '').toLocaleUpperCase('fr-FR');

let wasVerified = false;

const debugLog = (...args) => {
    if (DEBUG) console.log('[DEBUG]', ...args);
};

// --- Logique de calcul ---
function getLignes() {
    return Array.from(document.querySelectorAll('.ligne')).map((row) => {
        const select = row.querySelector('.choix');
        const qteEl = row.querySelector('.nbpl');
        const stEl = row.querySelector('.stt');
        return {
            select,
            qteEl,
            stEl
        };
    });
}

function calculeSousTotals() {
    let sousTotal = 0;

    getLignes().forEach(({
        select,
        qteEl,
        stEl
    }) => {
        const type = select.value;
        const prix = TARIFS[type] ?? 0;
        const qte = Number.parseInt(qteEl.value, 10);

        if (Number.isNaN(qte) || qte < 0) {
            qteEl.classList.add('is-invalid');
            stEl.value = fmt(0);
            return;
        }
        qteEl.classList.remove('is-invalid');

        const st = qte * prix;
        stEl.value = fmt(st);
        sousTotal += st;
    });

    document.getElementById('st').value = fmt(sousTotal);
    const ttc = sousTotal * (1 + TVA);
    document.getElementById('total').value = fmt(ttc);

    debugLog('Sous-total HT:', sousTotal, 'Total TTC:', ttc);
}

// --- Impression ---
function impression() {
    window.print();
}

// --- Validation Bootstrap + règles spécifiques ---
function setInvalid(input, message) {
    input.classList.add('is-invalid');
    if (message) {
        const fb = input.parentElement.querySelector('.invalid-feedback');
        if (fb) fb.textContent = message;
    }
}

function clearInvalid(input) {
    input.classList.remove('is-invalid');
}

function validePrenom(input) {
    const ok = !!input.value && input.value.trim().length >= 2;
    ok ? clearInvalid(input) : setInvalid(input, 'Le prénom est obligatoire (≥ 2 caractères).');
    return ok;
}

function valideTel(input) {
    const value = (input.value || '').trim();
    const ok = telRegex.test(value);
    ok ? clearInvalid(input) : setInvalid(input, 'Numéro invalide (ex: 01 23 45 67 89).');
    return ok;
}

function valideEmail(input) {
    const ok = input.checkValidity();
    ok ? clearInvalid(input) : setInvalid(input, "Adresse e-mail invalide.");
    return ok;
}

function valideNom(input) {
    const ok = !!input.value;
    if (ok) {
        input.value = toUpper(input.value);
        clearInvalid(input);
    } else {
        setInvalid(input, 'Le nom est obligatoire.');
    }
    return ok;
}

function valideCG(checkbox) {
    const ok = checkbox.checked;
    ok ? checkbox.classList.remove('is-invalid') : checkbox.classList.add('is-invalid');
    return ok;
}

function verifierAvantEnvoi() {
    const form = document.getElementById('monFormulaire');
    const nom = document.getElementById('nom');
    const prenom = document.getElementById('prenom');
    const tel = document.getElementById('tel');
    const mail = document.getElementById('mail');
    const cg = document.getElementById('cg');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
    }

    const validations = [
        valideNom(nom),
        validePrenom(prenom),
        valideTel(tel),
        valideEmail(mail),
        valideCG(cg),
    ];

    calculeSousTotals();
    const qtesOK = Array.from(document.querySelectorAll('.nbpl'))
        .every((el) => !el.classList.contains('is-invalid'));

    const ok = validations.every(Boolean) && qtesOK;

    wasVerified = ok;
    if (!ok) {
        alert('Merci de corriger les champs indiqués en rouge.');
    } else {
        alert('✅ Formulaire vérifié, vous pouvez envoyer votre commande.');
    }
    debugLog('Vérification globale OK ?', ok);
    return ok;
}

function envoyer() {
    if (!wasVerified) {
        alert('Veuillez d\'abord cliquer sur "Vérifier avant envoi".');
        return;
    }
    document.getElementById('monFormulaire').submit();
}

function resetForm() {
    wasVerified = false;
    document.getElementById('monFormulaire').classList.remove('was-validated');
    document.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    calculeSousTotals();
}

// --- Init ---
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('imprimer').addEventListener('click', impression);
    document.getElementById('verifier').addEventListener('click', verifierAvantEnvoi);
    document.getElementById('envoyer').addEventListener('click', envoyer);
    document.getElementById('monFormulaire').addEventListener('reset', () => {
        setTimeout(resetForm, 0);
    });

    document.querySelectorAll('.choix').forEach((el) => el.addEventListener('change', calculeSousTotals));
    document.querySelectorAll('.nbpl').forEach((el) => el.addEventListener('input', calculeSousTotals));

    calculeSousTotals();
});