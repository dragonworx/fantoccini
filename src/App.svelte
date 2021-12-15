<style lang="scss">
main {
  position: relative;
  padding: 10px;
  padding-bottom: 100px;
}

@media (min-width: 640px) {
  main {
    box-sizing: border-box;
    max-width: none;
  }
}
</style>

<script lang="ts">
/** example */
import Section from "./gui/examples/Section.svelte";
import Area from "./gui/examples/Area.svelte";
import Events from "./gui/examples/Events.svelte";

/** gui */
import { isAlphaNumeric } from "./gui/filters";
import Label from "./gui/components/Label.svelte";
import Icon from "./gui/components/Icon.svelte";
import PushButton from "./gui/components/PushButton.svelte";
import Checkbox from "./gui/components/Checkbox.svelte";
import RadioGroup from "./gui/components/RadioGroup.svelte";
import TextField from "./gui/components/TextField.svelte";
import Spinner from "./gui/components/Spinner.svelte";
import MenuButton from "./gui/components/MenuButton.svelte";
import Select from "./gui/components/Select.svelte";
import ScrollBar from "./gui/components/ScrollBar.svelte";
import ScrollView from "./gui/components/ScrollView.svelte";

const radioOptions = [
  { label: "Option 1", value: "a" },
  { label: "Option 2", value: "b" },
  { label: "Option 3", value: "c" },
];

const alphaNumericFilter = (key: string) => isAlphaNumeric(key);

function log(component: string, event: string, ...data: any[]) {
  console.log(
    `%c${component}🔆%c${event}%c${
      data.length === 0
        ? ""
        : ": " +
          JSON.stringify(data)
            .replace(/[\[{()}\]]/g, "")
            .replace(/,/g, ", ")
            .replace(/:/g, ": ")
    }`,
    "color:cyan",
    "color:yellow",
    "color:white"
  );
}

const simpleMenuOptions = [
  { label: "Option 1" },
  { label: "Option 2" },
  { label: "Option 3" },
];

const simpleSelectOptions = simpleMenuOptions.map((option) => option.label);
</script>

<main>
  <!-- Label - Simple -->
  <Section title="Label">
    <Area
      ><Label text="Default" />
      <Label isEnabled="{false}" text="Disabled" /></Area>
    <Area>
      <Events>
        <Label
          text="Is Link"
          isLink="{true}"
          on:clicked="{() => log('Label', 'clicked')}" />
      </Events>
      <Events mute="{true}">
        <Label
          text="Is Link"
          isLink="{true}"
          isEnabled="{false}"
          on:clicked="{() => log('Label', 'clicked')}" />
      </Events>
    </Area>
  </Section>

  <Section title="Label.position: left (default)">
    <Label text="align: start"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: center" align="center"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: end" align="end"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="indent: 5" indent="{5}"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
  </Section>

  <Section title="Label.position: right">
    <Label text="align: start" position="right"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: center" position="right" align="center"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: end" position="right" align="end"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="indent: 5" position="right" indent="{5}"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
  </Section>

  <Section title="Label.position: top">
    <Label text="align: left" position="top"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: center" position="top" align="center"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: end" position="top" align="end"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="index: 5" position="top" indent="{5}"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
  </Section>

  <Section title="Label.position: bottom">
    <Label text="align: left" position="bottom"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: center" position="bottom" align="center"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="align: end" position="bottom" align="end"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
    <Label text="indent: 5" position="bottom" indent="{5}"
      ><Icon src="img/test-small.png" width="{50}" /></Label>
  </Section>

  <Section title="PushButton">
    <Area>
      <Events>
        <PushButton
          label="Push it"
          on:down="{(e) => log('PushButton', 'down')}"
          on:up="{(e) => log('PushButton', 'up')}"
          on:longpress="{(e) => log('PushButton', 'longpress')}" />
      </Events>
      <Events mute="{true}">
        <PushButton
          label="Push it"
          isEnabled="{false}"
          on:down="{(e) => log('PushButton', 'down')}"
          on:up="{(e) => log('PushButton', 'up')}" />
      </Events>
      <PushButton label="Push it" iconName="tick" />
      <Events>
        <PushButton
          label="No Style"
          noStyle="{true}"
          on:down="{(e) => log('PushButton', 'down')}"
          on:up="{(e) => log('PushButton', 'up')}"
          on:longpress="{(e) => log('PushButton', 'longpress')}" />
      </Events>
      <PushButton isEnabled="{false}" label="No Style" noStyle="{true}" />
    </Area>
    <Area>
      <Events>
        <PushButton
          label="Toggle it"
          iconName="tick"
          canToggle="{true}"
          on:toggle="{(e) => log('PushButton', 'toggle', e.detail.isDown)}"
          on:down="{(e) => log('PushButton', 'down')}"
          on:up="{(e) => log('PushButton', 'up')}" />
      </Events>
      <PushButton
        label="Toggle it"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
      <Events mute="{true}">
        <PushButton
          isEnabled="{false}"
          label="Toggle it"
          iconName="tick"
          canToggle="{true}"
          isDown="{true}"
          on:toggle="{(e) => log('PushButton', 'toggle', e.detail.isDown)}" />
      </Events>
    </Area>
  </Section>

  <Section title="Checkbox">
    <Area>
      <Events>
        <Checkbox
          on:change="{(e) => log('Checkbox', 'change', e.detail.checked)}" />
      </Events>
      <Checkbox isDown="{true}" />
      <Events mute="{true}">
        <Checkbox
          isEnabled="{false}"
          on:change="{(e) => log('Checkbox', 'change', e.detail.checked)}" />
      </Events>
      <Checkbox isEnabled="{false}" isDown="{true}" />
    </Area>
    <Area>
      <Events>
        <Checkbox
          label="Left"
          on:change="{(e) => log('Checkbox', 'change', e.detail.checked)}" />
      </Events>
      <Checkbox label="Right" position="right" />
      <Checkbox label="Top" position="top" />
      <Checkbox label="Bottom" position="bottom" />
      <Events mute="{true}">
        <Checkbox
          label="Disabled"
          isEnabled="{false}"
          on:change="{(e) => log('Checkbox', 'change', e.detail.checked)}" />
      </Events>
      <Checkbox label="Down" isDown="{true}" isEnabled="{false}" />
    </Area>
  </Section>

  <Section title="Radio">
    <Area>
      <Events>
        <RadioGroup
          options="{radioOptions}"
          on:change="{(e) => log('Radio', 'change', e.detail)}" />
      </Events>
      <Events mute="{true}">
        <RadioGroup
          isEnabled="{false}"
          options="{radioOptions}"
          on:change="{(e) => log('Radio', 'change', e.detail)}" />
      </Events>
      <RadioGroup options="{radioOptions}" position="left" />
      <RadioGroup options="{radioOptions}" position="top" />
      <RadioGroup options="{radioOptions}" position="bottom" />
    </Area>
  </Section>

  <Section title="TextField">
    <Events>
      <TextField
        on:change="{(e) => log('TextField', 'change', e.detail)}"
        on:accept="{(e) => log('TextField', 'accept', e.detail)}"
        on:focus="{(e) => log('TextField', 'focus')}"
        on:blur="{(e) => log('TextField', 'blur')}" />
    </Events>
    <TextField isEnabled="{false}" value="{'This is some text'}" />
    <TextField
      filter="{alphaNumericFilter}"
      placeholder="With alpha numeric filter" />
    <TextField placeholder="With Button">
      <PushButton label="Button" /></TextField>
  </Section>

  <Section title="Spinner" direction="vertical">
    <Area>
      <Events>
        <Spinner
          on:change="{(e) => log('Spinner', 'change', e.detail)}"
          on:focus="{(e) => log('Spinner', 'focus')}"
          on:blur="{(e) => log('Spinner', 'blur')}" />
      </Events>
      <Events mute="{true}">
        <Spinner isEnabled="{false}" />
      </Events>
    </Area>
    <Area>
      <Spinner digitCount="{1}" />
      <Spinner digitCount="{2}" />
      <Spinner digitCount="{3}" />
      <Spinner digitCount="{4}" />
      <Spinner digitCount="{5}" />
      <Spinner digitCount="{6}" />
      <Spinner digitCount="{7}" />
      <Spinner digitCount="{8}" />
      <Spinner digitCount="{9}" />
      <Spinner digitCount="{10}" />
    </Area>
  </Section>

  <Section title="MenuButton">
    <Area>
      <Events>
        <MenuButton
          options="{simpleMenuOptions}"
          on:select="{(e) => log('MenuButton', 'select', e.detail)}">
          <Label text="MouseDown" />
        </MenuButton>
      </Events>
      <MenuButton isEnabled="{false}" options="{simpleMenuOptions}">
        <Label text="MouseDown" />
      </MenuButton>
      <MenuButton options="{simpleMenuOptions}" position="popout">
        <Label text="Popout" />
      </MenuButton>
    </Area>
    <Area>
      <Events>
        <MenuButton
          options="{simpleMenuOptions}"
          trigger="mouseup"
          on:select="{(e) => log('MenuButton', 'select', e.detail)}">
          <Label text="Mouseup" />
        </MenuButton>
      </Events>
      <MenuButton
        options="{simpleMenuOptions}"
        position="popout"
        trigger="mouseup">
        <Label text="Popout" />
      </MenuButton>
    </Area>
  </Section>

  <Section title="Select">
    <Events
      ><Select
        options="{simpleSelectOptions}"
        on:change="{(e) => log('Select', 'change', e.detail)}" /></Events>
    <Events mute="{true}"
      ><Select
        isEnabled="{false}"
        options="{simpleSelectOptions}"
        selectedIndex="{1}"
        on:change="{(e) => log('Select', 'change', e.detail)}" /></Events>
    <Select options="{simpleSelectOptions}" width="{100}" />
  </Section>

  <Section title="ScrollBar">
    <Area direction="vertical">
      <Events
        ><ScrollBar
          direction="horizontal"
          value="{0}"
          size="{100}"
          on:change="{(e) => log('ScrollBar', 'change', e.detail)}" /></Events>
      <ScrollBar direction="horizontal" value="{0.5}" />
      <ScrollBar direction="horizontal" value="{1}" />
      <ScrollBar isEnabled="{false}" direction="horizontal" value="{1}" />
    </Area>
    <Area>
      <ScrollBar direction="vertical" value="{0}" size="{100}" />
      <ScrollBar direction="vertical" value="{0.5}" size="{100}" />
      <ScrollBar direction="vertical" value="{1}" size="{100}" />
      <ScrollBar isEnabled="{false}" direction="vertical" value="{1}" />
    </Area>
  </Section>

  <Section title="ScrollView">
    <Area height="{200}">
      <ScrollView>
        <img src="img/test-debug.jpg" alt="img" />
      </ScrollView>
    </Area>
    <Area height="{200}">
      <ScrollView width="{200}" height="{70}">
        <img src="img/test-debug.jpg" alt="img" />
      </ScrollView>
    </Area>
  </Section>
</main>
