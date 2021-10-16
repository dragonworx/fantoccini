import * as React from 'react';
import { useState, useEffect } from 'react';
import { Ticker, FrameInfo } from '../../core/ticker';

const ticker = new Ticker();

export function TickerTest() {
  const [frameInfo, setFrameInfo] = useState<FrameInfo>();
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    ticker.on('tick', (info: FrameInfo) => setFrameInfo(info));
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
        FrameCount: <span>{frameInfo?.frameCount || 0}</span>
      </label>
      <label>
        Delta: <span>{frameInfo?.delta.toFixed(1) || '-'}</span>
      </label>
    </fieldset>
  );
}
