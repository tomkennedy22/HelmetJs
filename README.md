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
![image](https://github.com/user-attachments/assets/8b956960-26f0-4674-9283-bc939483b7e8)
![image](https://github.com/user-attachments/assets/faa66994-2e4f-45db-86e4-b09e68023b81)
![image](https://github.com/user-attachments/assets/394a4937-f547-4fd5-8638-5b76efd87f87)
![image](https://github.com/user-attachments/assets/5aa2c9bb-94f9-4aa5-acee-f23db8889612)
![image](https://github.com/user-attachments/assets/969beaaf-1624-46c7-8ede-a89c6fe65a3e)
![image](https://github.com/user-attachments/assets/40bdefeb-4e06-49a4-9e58-8f8273d67fa8)



Credit:
- Largely inspired by dumbmatter's https://github.com/zengm-games/facesjs
- HeroUI
- Vite
- Tailwind
- Several other tools
