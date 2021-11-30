<style lang="scss">
.events {
  $height: 12px;

  position: relative;
  outline: 1px dashed rgb(155, 155, 151);
  box-sizing: border-box;
  border-radius: 3px;

  &:after {
    content: "Events";
    position: absolute;
    left: 0;
    top: -$height;
    height: $height;
    background-color: #ffeb00;
    border-radius: 5px;
    font-size: 10px;
    color: #853b0f;
    padding: 0 3px;
    outline: 1px dashed white;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    opacity: 0.3;
  }

  &.enabled {
    outline: 1px dashed yellow;

    &:after {
      opacity: 1;
    }
  }
}
</style>

<script lang="ts">
export let enabled: boolean = true;
</script>

<div class="events" class:enabled><slot /></div>
