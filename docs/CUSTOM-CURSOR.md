# Floating ship cursor

The site uses the user's Floating Ship Animated Cursor pack by [Sweezy Cursors](https://sweezy-cursors.com/). The original two animation frames and the supplied hover pointer are retained. Frames were extracted from the ANI container into a small lossless WebP sprite; the browser does not need an extension or Windows cursor installation.

The cursor is mounted in the website layout. Mouse movement is handled without React renders or a JavaScript animation loop. CSS plays the original two frames at 14 jiffies per frame. Touch/pen input, editable text and disabled controls retain their native behavior. Reduced-motion visitors receive the first frame. Native dialogs use a matching static ship cursor because they occupy the browser's top layer.

The supplied pack's license is retained in `public/cursors/SOURCE-LICENSE.txt`, with source metadata in `public/cursors/asset-info.json`. Its terms permit personal use and restrict redistribution; confirm appropriate rights before publicly deploying the supplied artwork. No original `.ani`, `.cur` or ZIP file is redistributed by this implementation.
