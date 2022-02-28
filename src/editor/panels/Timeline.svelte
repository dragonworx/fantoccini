<script lang="ts">
import { Panel, ButtonGroup } from 'src/gui/';
</script>

<div id="timeline">
  <div class="transport">
    <ButtonGroup
      options="{[{ label: 'Play', name: 'play' }]}"
      on:change="{e => console.log('ButtonGroup', 'change', e.detail)}" />
  </div>
</div>

<style lang="scss">
#timeline {
}
</style>
