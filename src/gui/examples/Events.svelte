<style lang="scss">
.events {
  position: relative;
  box-sizing: border-box;

  .heading {
    position: absolute;
    left: 0;
    top: -14px;
    font-size: 10px;
  }

  &.fill {
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }
}
</style>

<script type="ts">
export let mute: boolean = false;
export let fill: boolean = false;

let icon = mute ? "🔕" : "🔔";
</script>

<div class="events" class:fill>
  <slot />
  <div class="heading">{icon}</div>
</div>
