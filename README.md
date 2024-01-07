# Ubiquiti Homework

The project for "Ubiquiti 3D Fullstack Web Developer Test Assignment".

Key features are:

- interactive floorplane
- select and install products on the ceiling
- drag selected product and re-locate it on the ceiling
- hover and press 'x' to delete a product
- navigation mode to 'walk' in the scene
- quick view toggle to switch between top view and ground view
- customizable view - allow setting accent color and product editing color

## To Run Locally

What's required
- Make sure the local node env is  `node >= v18`.
- Make sure your browser supports [SharedArrayBuffer](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) as well as [Atomics](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Atomics). It's needed for loading the `.usdz` files

To start dev just run

```bash
# if you use yarn
yarn install
yarn dev

# or
npm install
npm run dev
```
Then go to http://localhost:5173/

