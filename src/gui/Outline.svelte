<style lang="scss">
@import "theme";
span {
  :global(& > *) {
    outline: 1px dashed#ccc;
    border-radius: 3px;
  }
}
</style>

<span class="outline"><slot /></span>
