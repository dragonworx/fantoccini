import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { degToRad } from './geom-util';

export function PixiView() {
  const ref = useRef<HTMLDivElement>(null);

  const [mouseStart, setMouseStart] = useState<Array<number>>([-1, -1]);
  const [bunny, setBunny] = useState<PIXI.Sprite>();

  useEffect(() => {
    const { current } = ref;
    if (current) {
      const app = new PIXI.Application({
        resizeTo: current,
        backgroundColor: 0x110000,
      });
      current.appendChild(app.view);

      app.loader.add('bunny', 'img/test.jpg').load((loader, resources) => {
        // This creates a texture from a 'bunny.png' image.
        const bunny = new PIXI.Sprite(resources.bunny.texture);

        // Setup the position of the bunny
        bunny.x = app.renderer.width / 2;
        bunny.y = app.renderer.height / 2;

        // Rotate around the center
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        // Add the bunny to the scene we are building.
        app.stage.addChild(bunny);
        setBunny(bunny);

        // Listen for frame updates
        app.ticker.add(() => {
          // each frame we spin the bunny around a bit
          // bunny.rotation += 0.01;
        });
      });
    }
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseStart[0] === -1 && mouseStart[1] === -1) {
      setMouseStart([e.screenX, e.screenY]);
    } else {
      bunny && (bunny.rotation = degToRad(e.screenX));
    }
  };
  return <div className="view" ref={ref} onMouseMove={onMouseMove}></div>;
}
