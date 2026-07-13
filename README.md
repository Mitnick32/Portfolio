# Portfolio — TOTO Yao Wonder Japhet

Site statique multi-pages. HTML / CSS / JS strictement séparés.

## Structure
```
index.html          Accueil (hero + portrait flottant)
apropos.html        Parcours, formation, homelab
competences.html    Boîte à outils + jauges + certifications
projets.html        12 projets, filtrables par domaine
experience.html     Chronologie + CV
contact.html        Réseaux + formulaire (envoi direct)
assets/css/style.css
assets/js/main.js
assets/img/photo.png
assets/cv.pdf       <-- placeholder, à remplacer
```

## Avant publication
1. `assets/cv.pdf` — remplacer par le vrai CV.
2. **Activer le formulaire** : au tout premier message envoyé, FormSubmit adresse un e-mail
   de confirmation à `totowonder010@gmail.com`. Cliquer le lien dedans une seule fois.
   Ensuite, chaque message du site arrive directement dans la boîte, sans ouvrir de client mail.
3. Chiffres du hero (`data-count`) et niveaux des jauges (`data-level`) : à ajuster.
4. Ajouter un lien GitHub si Japhet en a un (pied de page des 6 pages + `contact.html`).

## Mise en ligne (GitHub Pages)
```bash
git init && git add . && git commit -m "portfolio"
git branch -M main
git remote add origin git@github.com:USER/USER.github.io.git
git push -u origin main
```
Puis Settings → Pages → Branch : `main` / `root`.

## Test local
```bash
python3 -m http.server 8000
```
