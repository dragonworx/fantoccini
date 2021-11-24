<style lang="scss">
main {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>

<script lang="ts">
import Label from "./gui/Label.svelte";
import Section from "./gui/Section.svelte";
</script>

<main>
  <Section title="Label">
    <Label text="text" />
    <Label enabled="{false}" text="text" />
    <Label text="text" url="www.google.com" />
  </Section>
</main>
