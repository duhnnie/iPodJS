# iPodJS

A Javascript iPod, have fun with it!

## How to use it

1. Clone the repo.
2. Change to the repo directory and run `npm install`.
3. Use it:
  a. To have a quick view of the iPod run `npm run start`, a browser will be open with an iPod on a HTML page.
  b. To use the iPod in your project you need to build the distributable file, for that run `npm run build`, all necessary files will be output in the `dist` directory.
  
## Compatibility

iPod.js is compatible with most modern browsers (Google Chrome, Firefox, Opera, Safari). 
For Microsoft IE11/Edge it is necessary to apply some polyfills to solve some issues:
  * Edge doesn't have a promise-like implementation of the `Audio.play()` method. A dirty polyfill is being used for the demo using the `npm run start` command.
  * IE11 has issues with `Array.from()` method, it needs to be polyfilled to make it work.
  
Any suggestion, ir idea of improvement just fork the repo and send the PR.

Happy listening!
