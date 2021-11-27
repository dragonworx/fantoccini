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
import Section from "./gui/Section.svelte";
import Demo from "./gui/Demo.svelte";
import Label from "./gui/Label.svelte";
import Icon from "./gui/Icon.svelte";
import Button from "./gui/Button.svelte";
import PushButton from "./gui/PushButton.svelte";
</script>

<main>
  <Section title="Label - Simple">
    <Label text="Default" />
    <Label isEnabled="{false}" text="Disabled" />
    <Label text="Is Link" isLink="{true}" />
  </Section>
  <Section title="Label - Wrapping Left">
    <!-- Left -->
    <Demo key="align" value="left">
      <Label text="Text"><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="align" value="center"
      ><Label text="Text" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="align" value="end"
      ><Label text="Text" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="indent" value="5"
      ><Label text="Text" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
  </Section>
  <Section title="Label - Wrapping Right">
    <!-- Right -->
    <Demo key="align" value="start">
      <Label text="Text" position="right"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="right" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="right" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="right" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Label - Wrapping Top">
    <!-- Top -->
    <Demo key="align" value="start">
      <Label text="Text" position="top"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="top" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="top" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="top" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Label - Wrapping Bottom">
    <!-- Bottom -->
    <Demo key="align" value="start">
      <Label text="Text" position="bottom"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="bottom" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="bottom" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="bottom" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Button - Foundation">
    <Button appearance="round"><Icon name="tick" width="{10}" /></Button>
    <Button canToggle={true}><Icon name="tick" width="{10}" /></Button>
  </Section>
  <Section title="PushButton">
    <PushButton label="Push it!" on:mousedown="{() => console.log('!')}" />
    <PushButton label="Push it!" isEnabled="{false}" />
    <PushButton label="Push it!" iconName="tick" />
  </Section>
</main>
