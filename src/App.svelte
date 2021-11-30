<style lang="scss">
main {
  position: relative;
  padding: 10px;
}

@media (min-width: 640px) {
  main {
    box-sizing: border-box;
    max-width: none;
    padding-bottom: 1000px;
  }
}
</style>

<script lang="ts">
/** example */
import Section from "./examples/Section.svelte";
import Demo from "./examples/Demo.svelte";
import Area from "./examples/Area.svelte";
import Events from "./examples/Events.svelte";

/** gui */
import { isAlphaNumeric } from "./gui";
import Label from "./gui/Label.svelte";
import Icon from "./gui/Icon.svelte";
import PushButton from "./gui/PushButton.svelte";
import Checkbox from "./gui/Checkbox.svelte";
import RadioGroup from "./gui/RadioGroup.svelte";
import TextField from "./gui/TextField.svelte";

const radioOptions = [
  { label: "Option 1", value: "a" },
  { label: "Option 2", value: "b" },
  { label: "Option 3", value: "c" },
];

const alphaNumericFilter = (key: string) => isAlphaNumeric(key);

function log(component: string, event: string, ...data: any[]) {
  console.log(
    `%c${component}:%c${event}: %c${
      data.length === 0
        ? ""
        : JSON.stringify(data)
            .replace(/[\[{()}\]]/g, "")
            .replace(/,/g, ", ")
            .replace(/:/g, ": ")
    }`,
    "color:cyan",
    "color:yellow",
    "color:white"
  );
}
</script>

<main>
  <!-- Label - Simple -->
  <Section title="Label - Simple">
    <Label text="Default" />
    <Label isEnabled="{false}" text="Disabled" />
    <Events>
      <Label
        text="Is Link"
        isLink="{true}"
        on:clicked="{() => log('label', 'clicked')}" />
    </Events>
    <Events enabled="{false}">
      <Label
        text="Is Link"
        isLink="{true}"
        isEnabled="{false}"
        on:clicked="{() => log('label', 'clicked')}" />
    </Events>
  </Section>
  <!-- Label - Wrapping -->
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
  <!-- Button -->
  <Section title="Button">
    <Area>
      <Events>
        <PushButton
          label="Push it"
          on:down="{(e) => log('pushbutton', 'down')}"
          on:up="{(e) => log('pushbutton', 'up')}"
          on:longpress="{(e) => log('pushbutton', 'longpress')}" />
      </Events>
      <Events enabled="{false}">
        <PushButton
          label="Push it"
          isEnabled="{false}"
          on:down="{(e) => log('pushbutton', 'down')}"
          on:up="{(e) => log('pushbutton', 'up')}" />
      </Events>
      <PushButton label="Push it" iconName="tick" />
      <PushButton label="No Style" noStyle="{true}" />
      <PushButton
        isEnabled="{false}"
        label="No Style Disabled"
        noStyle="{true}" />
      <Events>
        <PushButton
          label="No Style"
          noStyle="{true}"
          on:down="{(e) => log('pushbutton', 'down')}"
          on:up="{(e) => log('pushbutton', 'up')}"
          on:longpress="{(e) => log('pushbutton', 'longpress')}" />
      </Events>
    </Area>
    <Area>
      <Events>
        <PushButton
          label="Toggle it"
          iconName="tick"
          canToggle="{true}"
          on:toggle="{(e) => log('pushbutton', 'toggle', e.detail.isDown)}" />
      </Events>
      <PushButton
        label="Toggle it"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
      <Events enabled="{false}">
        <PushButton
          isEnabled="{false}"
          label="Toggle it"
          iconName="tick"
          canToggle="{true}"
          isDown="{true}"
          on:toggle="{(e) => log('pushbutton', 'toggle', e.detail.isDown)}" />
      </Events>
    </Area>
  </Section>
  <!-- Checkbox -->
  <Section title="Checkbox">
    <Area>
      <Events>
        <Checkbox
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Events>
      <Checkbox isDown="{true}" />
      <Events enabled="{false}">
        <Checkbox
          isEnabled="{false}"
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Events>
      <Checkbox isEnabled="{false}" isDown="{true}" />
    </Area>
    <Area>
      <Events>
        <Checkbox
          label="Left"
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Events>
      <Checkbox label="Right" position="right" />
      <Checkbox label="Top" position="top" />
      <Checkbox label="Bottom" position="bottom" />
      <Events enabled="{false}">
        <Checkbox
          label="Disabled"
          isEnabled="{false}"
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Events>
      <Checkbox label="Down" isDown="{true}" isEnabled="{false}" />
    </Area>
  </Section>
  <!-- Radio -->
  <Section title="Radio">
    <Area>
      <Events>
        <RadioGroup
          options="{radioOptions}"
          on:change="{(e) => log('radio', 'onchange', e.detail)}" />
      </Events>
      <Events enabled="{false}">
        <RadioGroup
          isEnabled="{false}"
          options="{radioOptions}"
          on:change="{(e) => log('radio', 'onchange', e.detail)}" />
      </Events>
      <RadioGroup options="{radioOptions}" position="left" />
      <RadioGroup options="{radioOptions}" position="top" />
      <RadioGroup options="{radioOptions}" position="bottom" />
    </Area>
  </Section>
  <!-- TextField -->
  <Section title="TextField">
    <Events>
      <TextField on:accept="{(e) => log('textfield', 'onaccept', e.detail)}" />
    </Events>
    <TextField isEnabled="{false}" value="{'This is some text'}" />
    <TextField
      filter="{alphaNumericFilter}"
      placeholder="With alpha numeric filter" />
    <TextField placeholder="With Button">
      <PushButton label="Button" /></TextField>
  </Section>
</main>
