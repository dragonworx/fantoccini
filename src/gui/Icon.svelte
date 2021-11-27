<style lang="scss">
@import "theme";
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>

<script lang="ts">
export let src: string | undefined = undefined;
export let name: string | undefined = undefined;
export let alt: string | undefined = undefined;
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;
</script>

<img
  class="icon"
  src="{src || `img/icons/${name}.svg`}"
  alt="{alt}"
  width="{width}"
  height="{height}" />
