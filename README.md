# 🧮 Validation de formulaire

## 🎯 Objectifs
- Effectuer des **vérifications** et des **calculs** dans un formulaire web.
- Mettre en place des **contrôles de saisie** côté client.
- Gérer les **totaux automatiques** (HT, TVA, TTC).
- Respecter les bonnes pratiques d'**accessibilité** et d'ergonomie.

---

## 🧾 Énoncé

Dans cet exercice, nous allons créer le formulaire suivant (les champs **grisés** ne sont **pas modifiables** par l'internaute).

Les champs grisés se remplissent automatiquement en fonction des **choix** et des **quantités** saisies.  
Le **total TTC** sera affiché avec **2 chiffres après la virgule**.

Chaque liste déroulante propose les options :
- Demi-journée  
- Journée  
- Repas  

### 💰 Tarifs HT unitaires

| Type          | Prix unitaire HT |
|---------------|------------------|
| Demi-journée  | 8 €              |
| Journée       | 15 €             |
| Repas         | 7 €              |

---

## ⚙️ Fonctionnalités des boutons

### 🔍 Vérifier avant envoi
1. Contrôle des champs **obligatoires** :  
   - Si un champ est vide → **bordure rouge** + message d'erreur dans une boîte de dialogue.  
2. Contrôle du champ **email** :  
   - Vérifie la présence d'un **"@"**.  
3. Transformation du **nom** en **MAJUSCULES**.  

### 🖨️ Imprimer
- Déclenche l'impression de la page en **format paysage** (`@page { size: A4 landscape; }`).

### ♻️ Réinitialiser
- Efface toutes les données saisies et remet le formulaire à zéro.

### 📤 Envoyer ma commande
- Envoie le tout par **mailto** uniquement **si le formulaire a été vérifié** au préalable.

---

## 🧠 Spécifications fonctionnelles

### 🧩 Structure du formulaire

Chaque ligne du tableau comporte :
- Type (liste déroulante)
- Quantité (input number)
- Prix unitaire HT (readonly)
- Montant HT (readonly)
- Montant TTC (readonly)

En bas du tableau :
- **Total HT**
- **TVA**
- **Total TTC** (affiché avec 2 décimales)

> Exemple de taux : `const TAUX_TVA = 0.20`

---

### 🧾 Règles de calcul
```js
montantHT = prixUnitaireHT * quantite
montantTTC = montantHT * (1 + TAUX_TVA)

totalHT = somme des montants HT
tva = totalHT * TAUX_TVA
totalTTC = totalHT + tva