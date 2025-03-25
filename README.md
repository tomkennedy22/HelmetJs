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
  "enableLogo":false,
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

![image](https://github.com/user-attachments/assets/23da26c4-1a08-4c86-b2e1-0effd9e8960e)
![image](https://github.com/user-attachments/assets/3c48c350-0039-4082-8e4a-ce32abb50cdb)

![image](https://github.com/user-attachments/assets/f140c20e-eaa1-40bc-9517-67add305bcea)
![image](https://github.com/user-attachments/assets/4dee917d-a115-40e0-b916-c36395b14fe6)

![image](https://github.com/user-attachments/assets/67677b2a-57d7-4878-a61d-9e99d60739d6)
![image](https://github.com/user-attachments/assets/0423b5de-a488-46bc-a29c-0ce5e8ae5293)

Credit:

- Largely inspired by dumbmatter's https://github.com/zengm-games/facesjs
- HeroUI
- Vite
- Tailwind
- Several other tools
