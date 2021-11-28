<style>
div {
  outline: 1px dashed yellow;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>

<script lang="ts">
export let color: string = "yellow";
$: style = `outline-color: ${color};`;
</script>

<div style="{style}"><slot /></div>
