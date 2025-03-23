HelmetJs is a React package to generate a football helmet given a user's input. It also has a free editor at https://tomkennedy22.github.io/HelmetJs


### Using in TSX
Define your helmetConfig
```
const helmetConfig = {
  "flipHelmet":false,
  "helmetColor":"#ffdc30",
  "facemaskColor":"#936afe",
  "helmetLogoUrl":"Your URL here",
  "xAdjust":0,
  "yAdjust":0,
  "disableLogo":true,
  "flipLogoWithHelmet":false,
  "useFlippedLogoUrlWhenFlipped":false,
  "helmetStyle":"Standard",
  "tigerStripeColor":"#d18126",
  "wingColor":"#272727",
  "hornColor":"#ffffff",
  "helmetLogoScale":1
}
```

Or if you have just a few attributes in mind, specify those and get a mostly-blank slate
```
const helmetConfig = generateHelmetConfigFromOverrides({helmetConfigOverrides:{
  helmetColor: "#0f0",
}})
```

Then simply include the `Helmet` component in your app
```
<Helmet helmetConfig={helmetConfig}/>
```

Helmet Styles
- Standard
- Tiger Stripe
- Horn
- Wing


### Examples
![helmetjs-20250323171115](https://github.com/user-attachments/assets/6d447d51-6d0c-4cf3-b29e-d82b9454f1ac)
![helmetjs-20250323171135](https://github.com/user-attachments/assets/258f03a2-0ffa-4ea6-9dbf-9d5a8c3b7287)
![helmetjs-20250323171219](https://github.com/user-attachments/assets/5c2515f3-357f-42e3-b8dd-48843b2d3622)
![helmetjs-20250323171248](https://github.com/user-attachments/assets/d171fe56-308e-4b6b-b84e-982f97aa588a)


Credit:
- Largely inspired by dumbmatter's https://github.com/zengm-games/facesjs
- HeroUI
- Vite
- Tailwind
- Several other tools
