<style lang="scss">
@import "../theme";
.icon {
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  pointer-events: none;
}
</style>

<script lang="ts" context="module">
export const preload = (filename: string) => {
  const img = new Image();
  img.src = `img/icons/${filename}`;
};
[
  "circle.svg",
  "cross.svg",
  "increment-down.svg",
  "increment-up.svg",
  "next-frame.svg",
  "pause.svg",
  "play.svg",
  "prev-frame.svg",
  "record.svg",
  "search.svg",
  "select.svg",
  "stop.svg",
  "tick.svg",
].forEach((filename) => preload(filename));
</script>

<script lang="ts">
export let src: string | undefined = undefined;
export let name: string | undefined = undefined;
export let alt: string | undefined = undefined;
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
export let size: number | undefined = undefined;
</script>

<img
  class="icon"
  src="{src || `img/icons/${name}.svg`}"
  alt="{alt}"
  width="{size || width}"
  height="{size || height}"
  data-component="icon" />
