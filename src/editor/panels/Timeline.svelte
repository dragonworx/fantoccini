<script lang="ts">
import { onMount } from 'svelte';
import { ButtonGroup } from 'src/gui/';
import hub, { event } from 'src/core/hub';

let smpte: string = '0:0:0:0';
let hasProject: boolean = false;
let selectedIndex: number = 3;

const reset = () => {
  smpte = '0:0:0:0';
  selectedIndex = 2;
};

onMount(() => {
  hub
    .on('project.init', () => {
      hasProject = true;
      reset();
    })
    .on('frame.tick', (hours, minutes, seconds, frames) => {
      smpte = `${hours}:${minutes}:${seconds}:${frames}`;
    })
    .on('transport.stop', () => {
      reset();
    })
    .on('project.close', () => {
      hasProject = false;
      reset();
    });
});
</script>

<div id="timeline">
  {#if hasProject}
    <div class="transport">
      <ButtonGroup
        selectedIndex="{selectedIndex}"
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
  {/if}
</div>

<style lang="scss">
#timeline {
}
</style>
