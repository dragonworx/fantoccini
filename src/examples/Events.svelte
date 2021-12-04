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
}
</style>

<script type="ts">
export let mute: boolean = false;

let icon = mute ? "🔕" : "🔔";
</script>

<div class="events">
  <slot />
  <div class="heading">{icon}</div>
</div>
