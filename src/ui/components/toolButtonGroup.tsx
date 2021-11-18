/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { BoxLayout } from '../layout/box';
import { getProps } from '../util';
import { PushButton } from './pushButton';

export interface Option {
  name: string;
  icon: string;
}

export type onClick = (name: string) => void;

export interface Props {
  options: Option[];
  enabled?: boolean;
  onClick?: onClick;
}

export const defaultProps: Props = {
  enabled: true,
  options: [],
};

const radius = '8px';

export const cssStyle = () => css`
  display: flex;
  align-items: center;

  & .abstract-button {
    border-radius: 0;
    height: 26px;

    .buttoncontent {
      border-radius: 0;
    }
  }

  & .abstract-button:first-child {
    border-top-left-radius: ${radius};
    border-bottom-left-radius: ${radius};
    height: 26px;

    .buttoncontent {
      border-top-left-radius: ${radius};
      border-bottom-left-radius: ${radius};
    }
  }

  & .abstract-button:last-child {
    border-top-right-radius: ${radius};
    border-bottom-right-radius: ${radius};
    height: 26px;

    .buttoncontent {
      border-top-right-radius: ${radius};
      border-bottom-right-radius: ${radius};
    }
  }
`;

export function ToolButtonGroup(props: Props) {
  const { enabled, options, onClick } = getProps(props, defaultProps);

  const onClickHandler = (name: string) => () => onClick && onClick(name);

  return (
    <div css={cssStyle()} className="toolButtonGroup">
      <BoxLayout direction={'horizontal'} spacing={0}>
        {options.map(({ name, icon }) => (
          <PushButton
            enabled={enabled}
            icon={icon}
            iconWidth={16}
            margin={0}
            onClick={onClickHandler(name)}
          />
        ))}
      </BoxLayout>
    </div>
  );
}
