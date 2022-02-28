<script lang="ts">
import { ButtonGroup } from 'src/gui/';
import hub, { event } from 'src/core/hub';

let smpte: string = '';

hub
  .on('frame.tick', (hours, minutes, seconds, frames) => {
    smpte = `${hours}:${minutes}:${seconds}:${frames}`;
  })
  .on('transport.stop', () => {
    smpte = '0:0:0:0';
  });
</script>

<div id="timeline">
  <div class="transport">
    <ButtonGroup
      selectedIndex="{3}"
      options="{[
        { icon: 'img/icons/play.svg', name: event('transport.play') },
        { icon: 'img/icons/pause.svg', name: event('transport.pause') },
        { icon: 'img/icons/record.svg', name: event('transport.stop') },
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
