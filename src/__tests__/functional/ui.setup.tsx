/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Icon } from '../../ui/components/icon';
import { Option as RadioButtonGroupOption } from '../../ui/components/radioButtonGroup';
import { MenuOption } from '../../ui/components/menu';
import { Option as ToolButtonGroupOption } from '../../ui/components/toolButtonGroup';

export const radioButtonGroupOptions: RadioButtonGroupOption[] = [
  {
    name: 'option1',
    label: 'Opt1',
    value: 1,
  },
  {
    name: 'option2',
    label: 'Opt3 ++',
    value: 2,
  },
  {
    name: 'option3',
    label: 'Opt3',
    value: 3,
  },
];

export const toolButtonGroupOptions: ToolButtonGroupOption[] = [
  {
    name: 'play',
    icon: '#play',
  },
  {
    name: 'pause',
    icon: '#pause',
  },
  {
    name: 'record',
    icon: '#record',
  },
  {
    name: 'stop',
    icon: '#stop',
  },
];

export const selectOptionsStandard: MenuOption[] = [
  {
    label: 'Option1',
    value: 1,
  },
  {
    label: 'Option2',
    value: 2,
  },
  {
    label: 'Option3',
    value: 3,
  },
  {
    label: 'Option4',
    value: 4,
  },
];

export const selectOptionsMixed: MenuOption[] = [
  {
    label: 'Option1',
    value: 1,
    shortCut: 'Ctrl+E',
  },
  {
    enabled: false,
    label: 'Disabled2',
    value: 2,
  },
  {
    label: 'CheckedOption3',
    type: 'checked',
    value: false,
    shortCut: 'Ctrl+J',
  },
  {
    label: 'CheckedOption4',
    type: 'checked',
    value: true,
    shortCut: 'Ctrl+A',
  },
  {
    enabled: false,
    label: 'Disabled5',
    value: 5,
  },
  {
    type: 'separator',
  },
  {
    label: 'Option6',
    value: 6,
  },
];

export const selectOptionsLong: MenuOption[] = [
  {
    label: 'Option1 Long Very Very Text',
    value: 1,
  },
  {
    label: 'Option2 Long Text',
    value: 2,
  },
  {
    label: 'Option3 Long Text',
    value: 3,
  },
  {
    label: 'Option4 Long Text',
    value: 4,
  },
  {
    label: 'Option5 Long Text',
    value: 5,
  },
  {
    label: 'Option6 Long Text',
    value: 6,
  },
  {
    enabled: false,
    label: 'Option7 Long Text',
    value: 7,
  },
  {
    label: 'Option8 Long Text',
    value: 8,
  },
];

export const onHandleValue = (label: string) => (value: any) =>
  console.log(`${label}: ${value}`);

export const style = css`
  padding-bottom: 200px;

  .row {
    padding: 5px 10px;
    display: flex;
    > * {
      margin-right: 5px;
    }

    > *:last-child {
      margin-right: 0;
    }
  }

  .col {
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    > * {
      margin-bottom: 5px;
    }

    > *:last-child {
      margin-bottom: 0;
    }
  }

  .border {
    outline: 1px solid lime;
  }

  .hsplit {
    display: flex;
    align-items: center;
  }
`;

export const createIcons = (width: number = 16, amount: number = 3) => {
  const icons = [];
  for (let i = 0; i < amount; i++) {
    icons.push(<Icon src="img/test.jpg" width={width} />);
  }
  return icons;
};
