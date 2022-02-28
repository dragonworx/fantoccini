<script lang="ts">
import { ButtonGroup } from 'src/gui/';
import hub, { event } from 'src/core/hub';

let smpte: string = '';

hub
  .on('frame.tick', (hours, minutes, seconds, frames) => {
    smpte = `${hours}:${minutes}:${seconds}:${frames}`;
  })
  .on('transport.rewind', () => {
    smpte = '0:0:0:0';
  });
</script>

<div id="timeline">
  <div class="transport">
    <ButtonGroup
      canReset="{true}"
      options="{[
        { label: 'Play', name: event('transport.play') },
        { label: 'Pause', name: event('transport.pause') },
        { label: 'Stop', name: event('transport.stop') },
        { label: 'Rewind', name: event('transport.rewind') },
      ]}"
      on:change="{e => {
        const {
          detail: { selectedValue: event },
        } = e;
        hub.emit(event);
      }}" />
  </div>
  <div>{smpte}</div>
</div>

<style lang="scss">
#timeline {
}
</style>
