# TakaTaka Frontend (Admin • Chauffeur • Passager)

Projet React (Vite) + TailwindCSS, regroupant **3 modules** dans une seule application :

- **Accueil / Public** (landing, connexion, inscription)
- **Chauffeur** (dashboard + profil)
- **Admin** (dashboard + gestion)
- **Passager** (module complet avec réservation, suivi carte OpenStreetMap/Leaflet, historique, paiements, etc.)

---

## Démarrage

```bash
npm install
npm run dev
```

> L’appli démarre sur l’URL indiquée par Vite (par défaut http://localhost:5173).

---

## Routes principales

- **Accueil** : `/`
- **Connexion** : `/connexion`
- **Inscription** : `/inscription`

- **Passager** : `/passager`

- **Chauffeur** : `/chauffeur`
- **Profil chauffeur** : `/chauffeur/profil`

- **Admin** : `/admin`

---

## Notes sur l’assemblage

- Le projet **Passager** a été intégré sous : `src/apps/passager/`
- Le routeur principal a été mis à jour dans : `src/App.jsx`
- Les classes CSS **spécifiques** au module passager (préfixées `passenger-*`) ont été ajoutées dans : `src/styles/globals.css`
- Les dépendances Leaflet + Socket.io (utilisées par le module passager) ont été ajoutées dans : `package.json`

---

## Structure

```
src/
  apps/
    passager/
      components/
      context/
      hooks/
      pages/
      services/
      utils/
  components/          # accueil, admin, chauffeur
  pages/               # routes top-level
  styles/
```

---

## Cahier des charges

- Les notes initiales ont été conservées dans : `docs/notes-cahier-des-charges.md`
