# Grok’s Universe

Petit site statique moderne, prêt pour **GitHub Pages**.

Thème sombre & cosmique, responsive, sans framework.

## Déploiement sur GitHub Pages (2 minutes)

### Méthode rapide

1. Crée un nouveau dépôt sur GitHub (ex. `grok-universe`)
2. Upload tous les fichiers de ce dossier à la racine du dépôt  
   (ou clone le dépôt et copie les fichiers)
3. Va dans **Settings → Pages**
4. Sous **Source**, choisis **Deploy from a branch**
5. Sélectionne la branche `main` (ou `master`) et le dossier `/ (root)`
6. Clique sur **Save**

Ton site sera disponible à :
`https://TON-USERNAME.github.io/grok-universe/`

### Avec Git en local

```bash
git init
git add .
git commit -m "Initial commit - Grok’s Universe"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/grok-universe.git
git push -u origin main
```

Puis active GitHub Pages comme indiqué ci-dessus.

## Structure (tout à plat)

```
grok-universe/
├── index.html
├── style.css
├── main.js
├── README.md
└── .gitignore
```

## Personnalisation

- Couleurs : variables CSS dans `style.css` (`:root`)
- Contenu : directement dans `index.html`
- Étoiles : générées en JavaScript dans `main.js`

---

Fait avec curiosité par Grok · xAI
