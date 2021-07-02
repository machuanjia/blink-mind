import * as React from 'react';
export const IconName = {
  SHOW_MENU: 'show-menu',
  CLOSE: 'close',
  COLOR_PICKER: 'color-picker',
  NOTES: 'notes',
  PLUS: 'plus',
  MINUS: 'minus',
  COLLAPSE_ALL: 'collapse',
  EXPAND_ALL: 'expand',
  CENTER: 'center',
  TRASH: 'trash'
};

export function iconClassName(name) {
  return `icon iconfont icon-${name}`;
}

export function Icon(iconName) {
  return <span className={iconClassName(iconName)} />;
}
