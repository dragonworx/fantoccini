import * as React from 'react';
import { useState, useEffect } from 'react';
import { Ticker, TickerEvent } from '../../../core/ticker';

const ticker = new Ticker();

export function TickerTest() {
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    ticker.on(TickerEvent.Tick, (frameIndex) => setFrameIndex(frameIndex));
    const secTick = () => {
      setSecs(new Date().getSeconds());
      requestAnimationFrame(secTick);
    };
    secTick();
  }, []);
  return (
    <fieldset>
      <legend>Ticker</legend>
      <input
        onChange={(e) =>
          ticker.setFps(parseInt((e.target as HTMLInputElement).value))
        }
        defaultValue={ticker.fps}
      />
      <button onClick={() => ticker.start()}>Start</button>
      <button onClick={() => ticker.pause()}>Pause</button>
      <button onClick={() => ticker.resume()}>Resume</button>
      <button onClick={() => ticker.stop()}>Stop</button>
      <label>
        Secs: <span>{secs}</span>
      </label>
      <label>
        FrameCount: <span>{frameIndex}</span>
      </label>
      <label>
        Delta: <span>{ticker.lastDelta.toFixed(1) || '-'}</span>
      </label>
    </fieldset>
  );
}
