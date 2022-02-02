<style lang="scss">
  .form {
    display: block;

    .grid {
      display: grid;
      align-items: center;
    }
  }

  :global([data-component="form"] .grid > *:nth-child(odd)) {
    justify-self: end;
  }
</style>

<script lang="ts">
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;
  export let rowGap: number = 10;
  export let columnGap: number = 10;
  export let rowSize: number = 30;
  export let labelSize: number = -1;

  $: style = JSON.stringify({
    "row-gap": `${rowGap}px`,
    "column-gap": `${columnGap}px`,
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "100%",
    "grid-template-columns": `${
      labelSize === -1 ? "1fr" : `${labelSize}px`
    } 1fr`,
    "grid-template-rows": `${rowSize}px`,
    "grid-auto-rows": `${rowSize}px`,
  })
    .replace(/^{|}$|"/g, "")
    .replace(/,/g, ";");
</script>

<div data-component="form" class="form">
  <div class="grid" {style}><slot /></div>
</div>
