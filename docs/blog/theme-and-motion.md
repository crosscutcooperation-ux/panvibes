# Theme and motion

The supplied main-page theme is retained: navy `#104e87`, orange `#e5643d`, white backgrounds, Steinhart headings, Helvetica body copy and Steinhart Mono labels. Font files are included locally.

The grid follows the supplied United Carriers reference with five equal desktop columns, fine borders, four inset corner dots and centered image tiles. It adapts to four, three and two columns on smaller screens. Only the 27 real article tiles are rendered; there are no blank filler boxes.

The centered Blog title scatters and reassembles repeatedly while a mouse or hovering pen stays in its stationary title area, or while a touch is held. Moving away lets the current cycle finish and the letters settle. Re-entry or another tap restarts the animation immediately, including during an existing cycle. Keyboard activation plays a cycle too. Replays reset the existing animation timeline and timer, so they do not stack. Abstract speech, play, viewfinder and spark graphics move with the title. Motion scales down on phones and is disabled for reduced-motion preferences.

The original full articles are stored in `app/blog/posts.json`. The source importer retains only allowed formatting tags and strips scripts and event handlers.
