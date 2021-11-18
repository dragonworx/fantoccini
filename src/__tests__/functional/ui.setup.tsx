/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Icon } from '../../ui/components/icon';
import { Option as RadioButtonGroupOption } from '../../ui/components/radioButtonGroup';
import { MenuItem } from '../../ui/components/menu';
import { Option as ToolButtonGroupOption } from '../../ui/components/toolButtonGroup';
import { MenuBarItem } from '../../ui/components/menuBar';
import { ReactNode } from 'react';

export function Row({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <fieldset className="row">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

export function HSplit({ children }: { children: ReactNode }) {
  return <div className="hsplit">{children}</div>;
}

export function Outline({ children }: { children: ReactNode }) {
  return <div className="outline">{children}</div>;
}

export function Column({ children }: { children: ReactNode }) {
  return <div className="column">{children}</div>;
}

export const style = css`
  padding-bottom: 500px;

  fieldset {
    border-radius: 5px;
    border: 1px inset #7f7f7f8a;
    background-color: rgba(0, 0, 0, 0.05);
    margin-bottom: 5px;
    padding-bottom: 10px !important;

    legend {
      color: #bcbcbc;
      padding: 2px 5px;
      border-radius: 5px;
      border-bottom: 1px solid #090e0e;
      border-top: 1px solid #9c9c9c;
      background-color: #2e4358;
    }
  }

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

  .column {
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

  .outline {
    outline: 1px solid lime;
  }

  .hsplit {
    display: flex;
    align-items: center;
  }
`;

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

export const selectOptionsStandard: MenuItem[] = [
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

export const selectOptionsLong: MenuItem[] = [
  {
    label: 'Option1 Long Very Very Very Very Text',
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

export const menuOptionsMixed: MenuItem[] = [
  {
    label: 'Option1',
    value: 1,
    shortCut: 'Ctrl+E',
    onSelect(value: any) {
      console.log('Option1.select!', value);
    },
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

menuOptionsMixed.splice(4, 0, {
  type: 'menu',
  label: 'SubMenu',
  value: menuOptionsMixed,
});

export const menuOptions1: MenuItem[] = [
  {
    label: 'Option1',
    value: 1,
    shortCut: 'Ctrl+E',
    onSelect(value: any) {
      console.log('Option1.select!', value);
    },
  },
  {
    label: 'Option2',
    value: 2,
    shortCut: 'Ctrl+E',
    onSelect(value: any) {
      console.log('Option2.select!', value);
    },
  },
  {
    label: 'Option2a',
    type: 'checked',
    value: true,
    shortCut: 'Ctrl+A',
    onSelect(value: any) {
      console.log('Option2a.checked!', value);
    },
  },
  {
    type: 'menu',
    label: 'Option3',
    value: [
      {
        label: 'sub1.Option1',
        value: 1,
        shortCut: 'Ctrl+E',
        onSelect(value: any) {
          console.log('sub1.Option1.select!', value);
        },
      },
      {
        label: 'sub1.Option2',
        value: 2,
        shortCut: 'Ctrl+E',
        onSelect(value: any) {
          console.log('sub1.Option2.select!', value);
        },
      },
      {
        label: 'sub1.Option2a',
        type: 'checked',
        value: true,
        shortCut: 'Ctrl+A',
        onSelect(value: any) {
          console.log('sub1.Option2a.checked!', value);
        },
      },
      {
        type: 'menu',
        label: 'sub1.Option3',
        value: [
          {
            label: 'sub2.Option1',
            value: 1,
            shortCut: 'Ctrl+E',
            onSelect(value: any) {
              console.log('sub2.Option1.select!', value);
            },
          },
          {
            label: 'sub2.Option2',
            value: 2,
            shortCut: 'Ctrl+E',
            onSelect(value: any) {
              console.log('sub2.Option2.select!', value);
            },
          },
        ],
      },
    ],
  },
];

export const menuBarItems: MenuBarItem[] = [
  {
    label: 'File',
    menu: menuOptionsMixed,
  },
  {
    label: 'Edit',
    menu: menuOptionsMixed,
  },
  {
    label: 'Window',
    menu: menuOptions1,
  },
];

export const onHandleValue = (label: string) => (value: any) =>
  console.log(`${label}: ${value}`);

export const createIcons = (width: number = 16, amount: number = 3) => {
  const icons = [];
  for (let i = 0; i < amount; i++) {
    icons.push(<Icon src="img/test.jpg" width={width} />);
  }
  return icons;
};
