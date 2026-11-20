# F1 Power Unit Lab

Site statique pour **tester des moteurs de Formule 1** en 3D, consulter des rapports techniques et comparer les power units.

## Fonctionnalités

- Visualisation 3D interactive d’un power unit V6 Turbo Hybrid
- Choix entre Mercedes, Ferrari, Honda (RB) et Renault
- Curseurs **RPM** et **Charge**
- Modes ERS : Quali / Race / Save / Overtake
- Télémétrie simulée en direct (puissance, couple, MGU-K, MGU-H, batterie, turbo…)
- Rapports techniques cliquables
- Tableau comparatif des constructeurs

## Fichiers (tout à plat)

```
├── index.html
├── style.css
├── main.js
└── README.md
```

## Déploiement GitHub Pages

1. Crée un dépôt GitHub
2. Upload ces 4 fichiers à la racine
3. Settings → Pages → Deploy from branch → `main` / root
4. Le site sera en ligne sous `https://TON-USERNAME.github.io/NOM-DU-REPO/`

## Tech

- HTML / CSS / JS vanilla
- Three.js (via CDN + import map) pour le moteur 3D
- Aucun build, aucun backend

## Notes

Les chiffres de puissance et de couple sont des **estimations publiques**.  
Les valeurs réelles des équipes sont secrètes. Ce site est purement éducatif / démonstratif.
