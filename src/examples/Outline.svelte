<style>
div {
  outline: 1px dashed white;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>

<script lang="ts">
export let events: boolean = true;
$: style = `outline-color: ${events ? "yellow" : "#8f8435"};`;
</script>

<div style="{style}"><slot /></div>
