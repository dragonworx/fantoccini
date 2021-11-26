<style lang="scss">
main {
  position: relative;
  padding: 10px;
}

@media (min-width: 640px) {
  main {
    box-sizing: border-box;
    max-width: none;
  }
}
</style>

<script lang="ts">
import Label from "./gui/Label.svelte";
import Section from "./gui/Section.svelte";
import AbstractButton from "./gui/AbstractButton.svelte";
</script>

<main>
  <Section title="Label">
    <Label text="text" />
    <Label enabled="{false}" text="text" />
    <Label text="text" url="www.google.com" />
  </Section>
  <Section title="Button">
    <AbstractButton on:mousedown="{() => console.log('!')}"
      ><Label text="Push It!" /></AbstractButton>
  </Section>
</main>
