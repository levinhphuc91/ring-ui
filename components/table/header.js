/* eslint-disable react/jsx-max-props-per-line */

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import style from './table.css';

import HeaderCell from './header-cell';
import Checkbox from '../checkbox/checkbox';

export default class Header extends RingComponent {
  static propTypes = {
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    checked: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    columns: PropTypes.array.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    selectable: true,
    checked: true,
    onSort: () => {},
    onCheckboxChange: () => {},
    sortKey: 'id',
    sortOrder: true
  }

  render() {
    const {caption, selectable, checked, onCheckboxChange, columns, onSort, sortKey, sortOrder} = this.props;

    const headerCells = [];

    if (selectable && !caption) {
      headerCells.push(
        <th key="checkbox" className={classNames(style.headerCell, style.cellCheckbox)}>
          <Checkbox
            checked={checked}
            onChange={onCheckboxChange}
            onFocus={e => e.target.blur()}
          />
        </th>
      );
    }

    columns.map((column, key) => {
      const props = {key, column, onSort, sortKey, sortOrder};
      if (caption) {
        props.tiny = true;
        if (key === 0) {
          props.colSpan = 2;
        }
      }
      headerCells.push(<HeaderCell {...props}/>);
    });

    return (
      <thead>
        <tr className={style.header}>{
          caption
          ? <th className={classNames(style.headerCell, style.caption)} colSpan={headerCells.length + 1}>{caption}</th>
          : headerCells
        }</tr>

        <tr className={style.subHeader}>{caption ? headerCells : ''}</tr>
      </thead>
    );
  }
}