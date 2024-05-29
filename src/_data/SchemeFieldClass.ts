import { IIdae } from './types';

class SchemeFieldClass {

  private _field_code!: IIdae.schemeFieldCode;
  private _field_code_raw!: IIdae.schemeFieldCodeRaw;
  private _field_name!: IIdae.schemeFieldName;
  private _field_name_raw!: IIdae.schemeFieldNameRaw;
  private _field_icon!: IIdae.schemeFieldIcon;
  private _field_type!: IIdae.schemeFieldName;
  private _field_group!: IIdae.schemeFieldName;
  private _field_order!: IIdae.schemeFieldOrder;
  private _field_name_group!: IIdae.schemeFieldName;
  private _viewFieldType!: string;
  private _title!: string;
  private _className!: string;

  get field_code() {
    return this._field_code;
  }

  get field_name() {
    return this._field_name;
  }

  get field_name_raw() {
    return this._field_name_raw;
  }

  get field_code_raw() {
    return this._field_code_raw;
  }

  get field_icon() {
    return this._field_icon;
  }

  get field_type() {
    return this._field_type;
  }

  get field_group() {
    return this._field_group;
  }

  get field_order() {
    return this._field_order;
  }

  get field_name_group() {
    return this._field_name_group;
  }

  get viewFieldType() {
    return this._viewFieldType;
  }

  get title() {
    return this._title;
  }

  get className() {
    return this._className;
  }

  construcor() {
  }

  buildSchemeField() {
  }
}
