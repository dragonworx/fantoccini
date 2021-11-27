<style lang="scss">
@import "theme";
</style>

<script lang="ts">
export let src: string | undefined = undefined;
export let name: string | undefined = undefined;
export let alt: string | undefined = undefined;
export let width: number | undefined = undefined;
export let height: number | undefined = undefined;

function getSrc() {
  return src || `img/icons/${name}.svg`;
}
</script>

<img src="{getSrc()}" alt="{alt}" width="{width}" height="{height}" />
