import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import {
  ITableLinkedStructFieldRenderer,
  createCssClass,
} from '@de-re-crud/ui';
import { NgRenderer } from '@de-re-crud/angular';

interface IRow {
  columns: string[];
}

@Component({
  selector: 'drc-table-linked-struct-field-renderer',
  templateUrl: './table-linked-struct-field-renderer.component.html',
})
export class TableLinkedStructFieldRenderer extends NgRenderer<
  ITableLinkedStructFieldRenderer
> {
  constructor(@Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  get rows(): IRow[] {
    const value: IRow[] = [];

    this.props.value.forEach((columns) => {
      value.push({
        columns: columns.map((x) => x || ' '),
      });
    });

    return value;
  }

  getCssName = (...names: string[]) => {
    return createCssClass(
      'de-re-crud-angular-table-linked-struct-field-renderer',
      ...names,
    );
  };
}
