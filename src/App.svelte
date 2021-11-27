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
import Button from "./gui/Button.svelte";
import Icon from "./gui/Icon.svelte";
import Label from "./gui/Label.svelte";
import Section from "./gui/Section.svelte";
import PushButton from "./gui/PushButton.svelte";
</script>

<main>
  <Section title="Label">
    <Label text="text" />
    <Label isEnabled="{false}" text="text" />
    <Label text="text" url="www.google.com" />
  </Section>
  <Section title="Button">
    <Button appearance="round"><Icon name="tick" width="{10}" /></Button>
  </Section>
  <Section title="PushButton">
    <PushButton label="Push it!" on:mousedown="{() => console.log('!')}" />
    <PushButton label="Push it!" isEnabled="{false}" />
    <PushButton label="Push it!" iconName="tick" />
  </Section>
</main>
