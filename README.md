# "UI" visualization demo

<img src="https://github.com/user-attachments/assets/c926bf7b-cf77-4088-b6dd-c91a67142425" width="640">
<img src="https://github.com/user-attachments/assets/4f496b82-1169-401e-91c0-58e30650d5ff" width="640">



### Key features:

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

